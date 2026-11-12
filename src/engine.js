import { createInMemoryRedis } from '../vendor/js-redis-server/src/in-memory-client.ts';
import { createRedisCommandRegistry } from '../vendor/js-redis-server/src/commands/index.ts';
import { resolveCompatibilityProfile } from '../vendor/js-redis-server/src/core/compatibility/index.ts';

export const REDIS_VERSION = '7.2.7';
const compatibility = { flavor: 'redis', version: REDIS_VERSION };
const excluded = new Set(`ACL AUTH CLIENT CLUSTER COMMAND CONFIG DEBUG DUMP RESTORE RESTORE-ASKING INFO LASTSAVE LATENCY MEMORY MIGRATE MODULE MONITOR MOVE OBJECT PSYNC REPLCONF REPLICAOF ROLE SAVE BGSAVE BGREWRITEAOF SHUTDOWN SLAVEOF SLOWLOG SYNC WAIT WAITAOF READONLY READWRITE ASKING EVAL EVAL_RO EVALSHA EVALSHA_RO FCALL FCALL_RO FUNCTION SCRIPT QUIT RESET SELECT HELLO BLPOP BRPOP BLMOVE BRPOPLPUSH BZPOPMIN BZPOPMAX BLMPOP BZMPOP`.split(' '));
export const SUPPORTED = Object.freeze(createRedisCommandRegistry([], resolveCompatibilityProfile(compatibility))
  .getAll().map(c => c.name.toUpperCase()).filter(c => !excluded.has(c)).sort());
export const LIMITATIONS = Object.freeze([
  'Simulación educativa local de Redis 7.2.7 mediante js-redis-server 0.5.0; no ejecuta el servidor Redis oficial.',
  'Los datos viven en esta pestaña y se pierden al recargar. El progreso se guarda por separado.',
  'No hay persistencia RDB/AOF, replicación, Cluster, ACL ni telemetría real. Lua y funciones requieren un entorno externo.',
  'Las operaciones bloqueantes y XREAD/XREADGROUP BLOCK no están habilitadas. Pub/Sub y WATCH pueden practicarse entre las conexiones A y B.',
  'Límites educativos: 64 KiB por comando, cadenas de hasta 1 MiB, 2.000 claves y argumentos numéricos de tamaño acotado. LCS admite hasta 2.048 bytes por cadena y no se permite dentro de MULTI. El explorador muestra hasta 1.024 caracteres por cadena y 100 eventos por Stream.',
  'No se garantiza el orden de SCAN ni de Sets; HyperLogLog usa una implementación compatible, no su representación binaria nativa. La terminal acepta texto UTF-8, no todos los valores binarios de RESP.',
  'El recorte aproximado de Streams (~) es educativo: no reproduce bloques radix ni el coste y límite de trabajo del servidor oficial. Usa recorte exacto para comparar resultados.',
]);

/** Tokenizer follows redis-cli quoting: quoted empty strings, single quotes,
 * double-quoted control escapes and unambiguous rejection of incomplete input. */
export function tokenize(line) {
  const tokens = [];
  let value = '', quote = null, started = false, closed = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (quote) {
      if (c === quote) { quote = null; closed = true; continue; }
      if (c === '\\' && i + 1 < line.length) {
        const next = line[i + 1];
        if (quote === "'" && next !== "'") { value += c; continue; }
        i++;
        if (quote === '"' && next === 'x' && /^[a-f0-9]{2}$/i.test(line.slice(i + 1, i + 3))) {
          value += String.fromCharCode(parseInt(line.slice(i + 1, i + 3), 16)); i += 2;
        } else value += quote === '"' ? ({ n: '\n', r: '\r', t: '\t', b: '\b', a: '\x07' }[next] ?? next) : next;
      } else value += c;
      continue;
    }
    if (/\s/.test(c)) {
      if (started) tokens.push(value);
      value = ''; started = false; closed = false;
    } else if (closed) {
      throw new Error('ERR Se necesita un espacio después de cerrar las comillas.');
    } else if (c === '"' || c === "'") { quote = c; started = true; }
    else { value += c; started = true; }
  }
  if (quote) throw new Error('ERR Comillas sin cerrar.');
  if (started) tokens.push(value);
  return tokens;
}

export function formatReply(value, indent = '') {
  if (value === null || value === undefined) return '(nil)';
  if (value instanceof Error) return `(error) ${value.message}`;
  if (typeof value === 'number' || typeof value === 'bigint') return `(integer) ${value}`;
  if (Array.isArray(value)) return value.length ? value.map((item, i) => `${indent}${i + 1}) ${formatReply(item, indent + '   ')}`).join('\n') : '(lista vacía)';
  if (value instanceof Map) return formatReply([...value.entries()].flat());
  if (value instanceof Set) return formatReply([...value]);
  if (typeof value === 'object') return JSON.stringify(value);
  return ['OK', 'PONG', 'QUEUED'].includes(value) ? value : JSON.stringify(value);
}

export class RedisEngine {
  mode = 'Simulación local · Redis 7.2.7';
  version = REDIS_VERSION;
  supported = SUPPORTED;
  limitations = LIMITATIONS;
  onMessage = null;
  constructor() { this.ready = this.initialize(); }
  async initialize() {
    this.instance = await createInMemoryRedis({ compatibility, databaseCount: 1 });
    this.connections = { A: this.instance.connect(), B: this.instance.connect() };
    this.inspector = this.instance.connect();
    this.binaryInspector = this.instance.connect({ returnBuffers: true });
    this.counters = { A: 0, B: 0 };
    this.lifecycle = new AbortController();
    for (const [name, client] of Object.entries(this.connections)) {
      this.readMessages(client, name, this.lifecycle.signal);
    }
  }
  async readMessages(client, connection, signal) {
    try {
      for await (const message of client.pushes(signal)) this.onMessage?.({ connection, message });
    } catch (error) { if (!signal.aborted) this.onMessage?.({ connection, message: error }); }
  }
  async execute(command, connection = 'A') {
    await this.ready;
    if (typeof command !== 'string' || command.length > 65536) throw new Error('LIMIT Comando máximo: 64 KiB.');
    const args = tokenize(command.trim());
    if (!args.length) return null;
    const name = args[0].toUpperCase();
    if (!SUPPORTED.includes(name)) throw new Error(`UNSUPPORTED ${name} no está habilitado en el simulador; consulta su ficha y el entorno requerido.`);
    if (!this.connections[connection]) throw new Error('ERR Conexión desconocida: usa A o B.');
    if (name === 'LCS' && this.counters[connection]) throw new Error('LIMIT Ejecuta LCS fuera de MULTI para comprobar el tamaño antes de asignar memoria.');
    if (['XREAD', 'XREADGROUP'].includes(name) && args.some(x => x.toUpperCase() === 'BLOCK')) throw new Error('UNSUPPORTED BLOCK requiere un entorno Redis externo.');
    await this.checkBounds(name, args);
    if (this.counters[connection] > 1000 && !['EXEC', 'DISCARD'].includes(name)) throw new Error('LIMIT La transacción admite hasta 1.000 comandos; usa DISCARD.');
    const reply = await this.connections[connection].command(name, ...args.slice(1));
    if (name === 'MULTI') this.counters[connection] = 1;
    else if (name === 'EXEC' || name === 'DISCARD') this.counters[connection] = 0;
    else if (this.counters[connection]) this.counters[connection]++;
    return reply;
  }
  async checkBounds(name, args) {
    const max = 1048576;
    // Prevent unbounded allocation from offsets, array counts or the quadratic LCS table.
    const positions = { SETRANGE: [2], SETBIT: [2], GETBIT: [2] }[name] ?? [];
    for (const pos of positions) if (Number(args[pos]) > (name.includes('BIT') ? max * 8 - 1 : max - 1)) throw new Error('LIMIT Offset demasiado grande para el laboratorio.');
    if (['BITFIELD', 'BITFIELD_RO'].includes(name)) {
      for (let i = 2; i < args.length; i++) if (['GET', 'SET', 'INCRBY'].includes(args[i].toUpperCase())) {
        const width = Number(args[i + 1]?.slice(1));
        const offset = args[i + 2] ?? '';
        const bits = Number(offset.replace('#', '')) * (offset.startsWith('#') ? width : 1);
        if (bits + width > max * 8) throw new Error('LIMIT Offset BITFIELD demasiado grande.');
      }
    }
    if (name === 'LCS') for (const key of args.slice(1, 3)) if (await this.inspector.command('STRLEN', key) > 2048) throw new Error('LIMIT LCS admite 2.048 bytes por cadena en este laboratorio.');
    if (name === 'APPEND' || name === 'SETRANGE') {
      const length = await this.inspector.command('STRLEN', args[1]);
      if ((name === 'APPEND' ? length : Number(args[2])) + (args.at(-1)?.length ?? 0) * 4 > max) throw new Error('LIMIT Cadena demasiado grande para el laboratorio.');
    }
    if (['SRANDMEMBER', 'HRANDFIELD', 'ZRANDMEMBER'].includes(name) && Math.abs(Number(args[2])) > 10000) throw new Error('LIMIT Máximo 10.000 resultados aleatorios.');
    if ((await this.inspector.command('DBSIZE')) >= 2000 && !['DEL', 'UNLINK', 'FLUSHALL', 'FLUSHDB', 'EXEC', 'DISCARD', 'GET', 'KEYS', 'SCAN'].includes(name)) throw new Error('LIMIT Se alcanzaron 2.000 claves; elimina datos o reinicia el escenario.');
  }
  async keys() {
    await this.ready;
    const keys = await this.inspector.command('KEYS', '*');
    const result = [];
    for (const key of keys.sort()) {
      const type = await this.inspector.command('TYPE', key);
      if (type === 'none') continue;
      const ttl = await this.inspector.command('PTTL', key);
      let value;
      if (type === 'string') {
        const raw = await this.binaryInspector.command('GET', key);
        if (raw?.some(byte => byte < 32 && ![9, 10, 13].includes(byte))) {
          value = { representacion: 'Contenido binario', bytes: raw.length, hex: [...raw.subarray(0, 32)].map(byte => byte.toString(16).padStart(2, '0')).join(' ') + (raw.length > 32 ? ' …' : '') };
        } else {
          value = raw?.toString('utf8') ?? null;
          if (value?.length > 1024) value = `${value.slice(0, 1024)} … [valor truncado; consulta GET para explorar]`;
        }
      } else if (type === 'hash') value = await this.inspector.command('HGETALL', key);
      else if (type === 'list') value = await this.inspector.command('LRANGE', key, 0, -1);
      else if (type === 'set') value = await this.inspector.command('SMEMBERS', key);
      else if (type === 'zset') value = await this.inspector.command('ZRANGE', key, 0, -1, 'WITHSCORES');
      else if (type === 'stream') value = await this.inspector.command('XRANGE', key, '-', '+', 'COUNT', 100);
      result.push({ key, type, value, ttl: ttl < 0 ? ttl : Math.ceil(ttl / 1000), pttl: ttl });
    }
    return result;
  }
  async reset() {
    await this.ready;
    this.close();
    this.ready = this.initialize();
    await this.ready;
  }
  async load(commands, { reset = true } = {}) {
    if (reset) await this.reset();
    const lines = Array.isArray(commands) ? commands : commands.split(/\r?\n/);
    const result = [];
    for (const line of lines) if (line.trim() && !line.trim().startsWith('#')) result.push(await this.execute(line));
    return result;
  }
  close() {
    this.lifecycle?.abort();
    Object.values(this.connections ?? {}).forEach(client => client.close());
    this.inspector?.close();
    this.binaryInspector?.close();
    this.instance?.close();
  }
}
export const createEngine = () => new RedisEngine();
