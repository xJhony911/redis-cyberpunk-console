import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const raw = JSON.parse(readFileSync(root + 'data/redis-7.2.7.commands.json', 'utf8'));
const curated = JSON.parse(readFileSync(root + 'data/command-guides.json', 'utf8'));
const execution = existsSync(root+'data/execution-coverage.json') ? JSON.parse(readFileSync(root+'data/execution-coverage.json','utf8')) : {supported:[],verified:[]};
const groups = {string:'Strings',hash:'Hashes',list:'Lists',set:'Sets',sorted_set:'Sorted Sets',generic:'Claves y caducidad',bitmap:'Bitmaps y Bitfields',hyperloglog:'HyperLogLog',geo:'Geoespacial',stream:'Streams',pubsub:'Pub/Sub',transactions:'Transacciones',scripting:'Scripting y funciones',server:'Servidor y diagnóstico',connection:'Conexiones',cluster:'Redis Cluster',sentinel:'Sentinel'};
const descriptions = Object.fromEntries(readFileSync(root+'data/command-summaries.es.txt','utf8').split('\n').filter(x=>x.includes('|')).map(x=>x.split('|').map(s=>s.trim())));
const typeNames = {integer:'entero',double:'número decimal',string:'texto o bytes',key:'clave',pattern:'patrón', 'unix-time':'instante Unix', 'pure-token':'opción literal',block:'grupo de argumentos',oneof:'alternativas',array:'lista',object:'objeto',number:'número',boolean:'booleano',null:'nulo'};
function syntaxArg(a) {
  let s = a.type==='oneof' ? a.arguments.map(syntaxArg).join(' | ') : a.type==='block' ? a.arguments.map(syntaxArg).join(' ') : a.type==='pure-token' ? a.token : `${a.token ? a.token+' ':''}${a.name}`;
  if (a.multiple) s += ' [' + s + ' ...]';
  return a.optional ? '['+s+']' : s;
}
function flattenArgs(args=[],prefix='') {
  return args.flatMap(a=>[`${prefix}${a.token || a.name}: ${typeNames[a.type]||a.type}${a.optional ? ', opcional':''}${a.multiple ? ', repetible':''}${a.since ? '; desde Redis '+a.since:''}${a.type==='oneof' ? '; elegir una alternativa':''}`, ...flattenArgs(a.arguments, prefix+'↳ ')]);
}
function getTokens(args=[]) { return args.flatMap(a=>[...(a.token?[a.token]:[]),...getTokens(a.arguments)]); }
function response(schema) {
  if (!schema) return 'Respuesta dependiente del subcomando; consulta su ficha específica.';
  if (schema.anyOf || schema.oneOf) return [...new Set((schema.anyOf||schema.oneOf).map(response))].join(' / ');
  if (Object.hasOwn(schema,'const')) return JSON.stringify(schema.const);
  if(schema.type==='array') return 'Lista de respuestas'+(schema.items ? ' ('+response(schema.items)+')':'');
  return typeNames[schema.type] || 'Respuesta estructurada según las opciones elegidas';
}
function requirement(name,v) {
  if(v.group==='sentinel') return 'Proceso Redis Sentinel; no es un comando del servidor de datos estándar.';
  if(v.group==='cluster'||['ASKING','READONLY','READWRITE','RESTORE-ASKING'].includes(name)) return 'Nodos Redis configurados como Cluster y, para redirecciones, cliente compatible.';
  if((v.command_flags||[]).includes('BLOCKING')) return 'Conexión persistente y soporte de bloqueo; un lote secuencial no sustituye varios clientes.';
  if(['server','connection'].includes(v.group)) return 'Servidor Redis real para operaciones de administración, conexiones y métricas del sistema.';
  if(v.group==='pubsub') return 'Conexiones suscriptora y publicadora distintas para observar entregas; no hay historial durable.';
  if(v.group==='scripting') return 'Motor Lua 5.1 y API de funciones Redis 7 cuando corresponda.';
  return 'Redis base 7.2.7. El modo del laboratorio declara por separado las operaciones habilitadas.';
}
function defaultNotes(name,v) {
  const common = ['La sintaxis y la versión proceden del código fuente oficial Redis 7.2.7. Una ficha de referencia no implica que todas sus variantes estén verificadas en el laboratorio.'];
  if(['KEYS','HGETALL','SMEMBERS'].includes(name)) common.push('Recorrer toda la colección puede bloquear Redis con grandes volúmenes; utiliza SCAN, HSCAN o SSCAN cuando corresponda.');
  if(v.group==='cluster') common.push('Las operaciones multiclave de Redis Cluster requieren que las claves pertenezcan al mismo hash slot; utiliza etiquetas {…} cuando necesites agruparlas.');
  return common;
}
const catalog = Object.entries(raw).map(([name,v])=>{
  const g=curated[name]||{};
  const complexity=(v.complexity?.match(/O\([^)]*\)/g)||[]).join('; ') || 'Depende del subcomando';
  return { name,group:v.group,groupLabel:groups[v.group],since:v.since,syntax:[name,...(v.arguments||[]).map(syntaxArg)].join(' '),
    summary:g.summary||descriptions[name]||`Familia de operaciones de ${groups[v.group]}. Selecciona un subcomando para consultar su efecto.`,
    arguments:flattenArgs(v.arguments),options:g.options||getTokens(v.arguments),response:g.response||response(v.reply_schema),
    complexity:g.complexity||complexity,sourceComplexity:v.complexity||null,
    deprecated:v.deprecated_since ? `Obsoleto desde Redis ${v.deprecated_since}. ${g.replacement||'Consulta la alternativa recomendada en la documentación oficial.'}`:null,
    docs:`https://redis.io/docs/latest/commands/${name.toLowerCase().replaceAll(' ','-')}/`,
    source:`https://github.com/redis/redis/blob/7.2.7/src/commands/${name.toLowerCase().replaceAll(' ','-')}.json`,
    examples:g.examples||[],notes:g.notes||defaultNotes(name,v),ttl:g.ttl||(['string','hash','list','set','sorted_set','bitmap','hyperloglog','geo','stream'].includes(v.group)?'Las lecturas conservan la caducidad. Las mutaciones en el contenido conservan normalmente el TTL; sobrescribir o eliminar una clave puede cambiarlo. Consulta la variante concreta.':'El efecto depende del comando y sus opciones.'),
    errors:g.errors||['ERR wrong number of arguments: faltan argumentos o sobran valores.','ERR syntax error: revisa las alternativas y la versión de cada opción.',...(['string','hash','list','set','sorted_set','bitmap','hyperloglog','geo','stream'].includes(v.group)?['WRONGTYPE: la clave existe con un tipo incompatible; consulta TYPE antes de modificarla.']:[])],
    requirements:requirement(name,v),level:g.level||(['server','cluster','sentinel','scripting','stream','pubsub'].includes(v.group)?'Avanzado':'Inicial'),
    coverage:{documentation:g.documentation||'reference',example:!!g.examples?.length,terminal:execution.supported.includes(name.split(' ')[0])?'supported':'external',verification:execution.verified.some(e=>e.command===name)?'Ejemplos ejecutados sin errores por npm test. Semántica representativa en las pruebas del motor; variantes restantes sin certificar.':g.verification||'Inventario contrastado con metadatos oficiales; ejecución sin verificar.'},
    lab:g.lab||null,arity:v.arity,flags:v.command_flags||[],
  };
}).sort((a,b)=>a.name.localeCompare(b.name));
mkdirSync(root+'src',{recursive:true}); mkdirSync(root+'docs',{recursive:true});
writeFileSync(root+'data/catalog.json',JSON.stringify(catalog,null,2)+'\n');
writeFileSync(root+'src/catalog.js',`// Generado por scripts/generate-catalog.mjs a partir del tag oficial 7.2.7.\nimport data from '../data/catalog.json' with { type: 'json' };\nexport const catalog = data;\nexport const groups = ${JSON.stringify(groups)};\nexport function findCommand(name) { return catalog.find(c => c.name === name.trim().toUpperCase()); }\nexport default catalog;\n`);
const esc=x=>String(x).replaceAll('|','\\|').replaceAll('\n',' ');
writeFileSync(root+'docs/COVERAGE.md',`# Matriz de cobertura Redis 7.2.7\n\nFuente fijada: [redis/redis tag 7.2.7](https://github.com/redis/redis/tree/7.2.7/src/commands), commit ba181057223b04aba580a01b1b36662430aea4a0.\n\nEl inventario contiene **${catalog.length} definiciones**, incluidos contenedores de subcomandos, Sentinel y comandos internos. Esto no significa ${catalog.length} comandos ejecutables ni ${catalog.length} fichas pedagógicas completas. La columna «Ficha» separa guías detalladas de referencias estructuradas. Las referencias incluyen sintaxis, todos los argumentos del esquema oficial, versión, respuesta y enlace; los ejemplos y la revisión de variantes pendientes se muestran explícitamente. La interfaz cruza el inventario con la lista de capacidades del motor.\n\n| Categoría | Comando | Desde | Ficha | Ejemplos | Laboratorio | Opciones | Comprobación |\n|---|---|---|---|---|---|---|---|\n`+catalog.map(c=>`| ${c.groupLabel} | [${c.name}](${c.docs}) | ${c.since} | ${c.coverage.documentation==='detailed'?'Detallada':'Referencia'} | ${c.examples.length} | ${c.lab||'—'} | ${esc(c.options.join('; '))} | ${esc(c.coverage.verification)} |`).join('\n')+'\n');
console.log(`Catálogo: ${catalog.length} definiciones, ${catalog.filter(c=>c.examples.length).length} con ejemplos, ${catalog.filter(c=>c.coverage.documentation==='detailed').length} guías detalladas.`);
