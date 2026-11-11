import test from 'node:test';
import assert from 'node:assert/strict';
import { RedisEngine, tokenize, formatReply, SUPPORTED } from '../src/engine.js';

async function fixture(t) { const e = new RedisEngine(); await e.ready; t.after(() => e.close()); return e; }

test('parser preserves empty values, quotes, escaped controls and spaces', () => {
  assert.deepEqual(tokenize('SET "mi clave" "hola mundo"'), ['SET', 'mi clave', 'hola mundo']);
  assert.deepEqual(tokenize('SET x ""'), ['SET', 'x', '']);
  assert.deepEqual(tokenize('SET x "a\\nb\\t\\x41"'), ['SET', 'x', 'a\nb\tA']);
  assert.deepEqual(tokenize("SET x 'a\\nb'"), ['SET', 'x', 'a\\nb']);
  assert.throws(() => tokenize('SET x "sin cierre'), /Comillas/);
  assert.throws(() => tokenize('SET x "hola"mundo'), /espacio/);
});

test('all Redis 7.2 string commands are exposed', () => {
  for (const name of 'SET GET APPEND STRLEN GETRANGE SETRANGE INCR INCRBY INCRBYFLOAT DECR DECRBY MGET MSET MSETNX GETDEL GETEX LCS SETNX SETEX PSETEX GETSET SUBSTR'.split(' ')) assert.ok(SUPPORTED.includes(name), name);
});

test('arbitrary keys, strings, wrong types and independent sessions', async t => {
  const e = await fixture(t), other = await fixture(t);
  assert.equal(await e.execute('SET "con espacio" "valor nuevo"'), 'OK');
  assert.equal(await e.execute('GET "con espacio"'), 'valor nuevo');
  assert.equal(await other.execute('GET "con espacio"'), null);
  assert.equal(await e.execute('HSET perfil nombre Ana'), 1);
  await assert.rejects(e.execute('GET perfil'), /WRONGTYPE/);
  assert.deepEqual(await e.execute('MGET perfil inexistente "con espacio"'), [null, null, 'valor nuevo']);
});

test('SET NX/XX/GET/KEEPTTL validates conditions and expiration changes', async t => {
  const e = await fixture(t);
  assert.equal(await e.execute('SET k uno PX 60000 NX'), 'OK');
  assert.equal(await e.execute('SET k dos NX GET'), 'uno');
  assert.equal(await e.execute('GET k'), 'uno');
  assert.equal(await e.execute('SET k tres XX GET KEEPTTL'), 'uno');
  assert.ok(await e.execute('PTTL k') > 59000);
  await assert.rejects(e.execute('SET k malo NX XX'), /syntax/i);
  assert.equal(await e.execute('GET k'), 'tres');
  assert.equal(await e.execute('SET k cuatro'), 'OK');
  assert.equal(await e.execute('TTL k'), -1);
  assert.equal(await e.execute('SET falta cero XX'), null);
});

test('absolute expiry, GETEX PERSIST and expired key observation', async t => {
  const e = await fixture(t);
  await e.execute(`SET corta dato PXAT ${Date.now() + 80}`);
  await new Promise(resolve => setTimeout(resolve, 100));
  assert.equal(await e.execute('GET corta'), null);
  assert.equal(await e.execute('TTL corta'), -2);
  await e.execute('PSETEX k 60000 dato');
  assert.equal(await e.execute('GETEX k PERSIST'), 'dato');
  assert.equal(await e.execute('PTTL k'), -1);
  await e.execute('EXPIRE k 60 NX');
  assert.equal(await e.execute('EXPIRE k 30 NX'), 0);
  assert.equal(await e.execute('EXPIRE k 30 XX LT'), 1);
});

test('ranges use byte offsets, negative indices and zero padding', async t => {
  const e = await fixture(t);
  await e.execute('SET saludo "¡Hola!"');
  assert.equal(await e.execute('STRLEN saludo'), 7);
  assert.equal(await e.execute('GETRANGE saludo 2 -1'), 'Hola!');
  assert.equal(await e.execute('APPEND saludo " mundo"'), 13);
  assert.equal(await e.execute('SETRANGE huecos 3 z'), 4);
  assert.equal(await e.execute('GET huecos'), '\0\0\0z');
  assert.equal(await e.execute('SUBSTR saludo 2 5'), 'Hola');
});

test('integer operations retain signed 64-bit precision and reject overflow', async t => {
  const e = await fixture(t);
  await e.execute('SET n 9223372036854775806');
  assert.equal(await e.execute('INCR n'), 9223372036854775807n);
  await assert.rejects(e.execute('INCR n'), /overflow/i);
  assert.equal(await e.execute('GET n'), '9223372036854775807');
  await e.execute('SET n 01');
  await assert.rejects(e.execute('INCR n'), /integer/i);
  assert.equal(await e.execute('INCRBYFLOAT saldo 1.25'), '1.25');
  assert.equal(await e.execute('INCRBYFLOAT saldo -0.25'), '1');
});

test('MSETNX is all-or-nothing; GETDEL and deprecated aliases work', async t => {
  const e = await fixture(t);
  await e.execute('MSET a 1 b 2');
  assert.equal(await e.execute('MSETNX a 7 c 3'), 0);
  assert.equal(await e.execute('GET c'), null);
  assert.equal(await e.execute('GETSET a 9'), '1');
  assert.equal(await e.execute('GETDEL a'), '9');
  assert.equal(await e.execute('EXISTS a'), 0);
  assert.equal(await e.execute('SETNX a 4'), 1);
  await e.execute('SETEX a 60 cinco');
  assert.ok(await e.execute('TTL a') >= 59);
});

test('LCS sequence, length and indices derive from arbitrary values', async t => {
  const e = await fixture(t);
  await e.execute('MSET a ohmytext b mynewtext');
  assert.equal(await e.execute('LCS a b'), 'mytext');
  assert.equal(await e.execute('LCS a b LEN'), 6);
  const result = await e.execute('LCS a b IDX WITHMATCHLEN');
  assert.equal(result.at(-1), 6);
  assert.ok(Array.isArray(result[1]));
});

test('hash, list, set and sorted-set operations modify observable state', async t => {
  const e = await fixture(t);
  await e.execute('HSET usuario nombre Ana edad 20');
  assert.equal(await e.execute('HINCRBY usuario edad 1'), 21);
  await e.execute('RPUSH cola a b c');
  assert.equal(await e.execute('LPOP cola'), 'a');
  assert.deepEqual(await e.execute('LRANGE cola 0 -1'), ['b', 'c']);
  assert.equal(await e.execute('SADD tags redis redis js'), 2);
  assert.equal(await e.execute('SISMEMBER tags js'), 1);
  await e.execute('ZADD ranking 10 Ana 20 Luis');
  assert.deepEqual(await e.execute('ZRANGE ranking 0 -1 REV WITHSCORES'), ['Luis', '20', 'Ana', '10']);
  assert.equal((await e.keys()).find(k => k.key === 'usuario').type, 'hash');
});

test('bitmaps, bitfield and HyperLogLog operate on data', async t => {
  const e = await fixture(t);
  await e.execute('SETBIT dias 3 1');
  await e.execute('SETBIT dias 7 1');
  assert.equal(await e.execute('BITCOUNT dias'), 2);
  assert.deepEqual(await e.execute('BITFIELD campos SET u8 0 15 INCRBY u8 0 1 GET u8 0'), [0, 16, 16]);
  assert.equal(await e.execute('PFADD visitas Ana Luis Ana'), 1);
  assert.equal(await e.execute('PFCOUNT visitas'), 2);
});

test('geo search, streams and consumer groups support real state transitions', async t => {
  const e = await fixture(t);
  await e.execute('GEOADD lugares -78.4678 -0.1807 Quito -79.8891 -2.1709 Guayaquil');
  assert.deepEqual(await e.execute('GEOSEARCH lugares FROMMEMBER Quito BYRADIUS 10 km'), ['Quito']);
  assert.equal(await e.execute('XADD eventos 1-0 tipo compra'), '1-0');
  assert.equal(await e.execute('XGROUP CREATE eventos procesadores 0'), 'OK');
  assert.deepEqual(await e.execute('XREADGROUP GROUP procesadores c1 STREAMS eventos >'), [['eventos', [['1-0', ['tipo', 'compra']]]]]);
  assert.equal(await e.execute('XACK eventos procesadores 1-0'), 1);
});

test('MULTI queues, EXEC executes, inspector does not pollute queue; WATCH aborts', async t => {
  const e = await fixture(t);
  await e.execute('SET saldo 10');
  assert.equal(await e.execute('MULTI'), 'OK');
  assert.equal(await e.execute('INCRBY saldo 5'), 'QUEUED');
  assert.equal((await e.keys()).find(k => k.key === 'saldo').value, '10');
  assert.deepEqual(await e.execute('EXEC'), [15]);
  await e.execute('WATCH saldo');
  await e.execute('SET saldo 30', 'B');
  await e.execute('MULTI');
  await e.execute('DECR saldo');
  assert.equal(await e.execute('EXEC'), null);
  assert.equal(await e.execute('GET saldo'), '30');
});

test('Pub/Sub delivers messages between independent connections', async t => {
  const e = await fixture(t);
  const received = [];
  e.onMessage = message => received.push(message);
  assert.deepEqual(await e.execute('SUBSCRIBE noticias', 'B'), ['subscribe', 'noticias', 1]);
  assert.equal(await e.execute('PUBLISH noticias "hola Ana"', 'A'), 1);
  await new Promise(resolve => setTimeout(resolve, 5));
  assert.deepEqual(received[0], { connection: 'B', message: ['message', 'noticias', 'hola Ana'] });
  await e.execute('UNSUBSCRIBE noticias', 'B');
  assert.equal(await e.execute('PUBLISH noticias bye'), 0);
});

test('limits and unsupported commands are explicit; reset cancels transaction and data', async t => {
  const e = await fixture(t);
  for (const command of ['INFO', 'CONFIG GET *', 'EVAL "return 1" 0', 'BLPOP a 0', 'XREAD BLOCK 0 STREAMS a $']) await assert.rejects(e.execute(command), /UNSUPPORTED/);
  await assert.rejects(e.execute('SETBIT enorme 4294967295 1'), /LIMIT/);
  await e.execute('SET x y');
  await e.execute('MULTI');
  await e.reset();
  assert.deepEqual(await e.keys(), []);
  await assert.rejects(e.execute('EXEC'), /without MULTI/i);
  assert.equal(formatReply(9223372036854775807n), '(integer) 9223372036854775807');
});
