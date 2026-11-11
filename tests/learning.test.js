import test from 'node:test';
import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { RedisEngine } from '../src/engine.js';
import { lessons, labs, quiz } from '../src/learning.js';
import { catalog } from '../src/catalog.js';

test('curriculum links and quizzes are internally consistent', () => {
  assert.equal(new Set(lessons.map(l=>l.id)).size,lessons.length);
  assert.equal(new Set(labs.map(l=>l.id)).size,labs.length);
  for(const l of lessons) {
    assert.ok(l.paragraphs.length && l.demonstration.length, l.id);
    if(l.labId) assert.ok(labs.some(x=>x.id===l.labId), l.labId);
  }
  for(const q of quiz) assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<q.options.length);
});

for(const lab of labs.filter(l=>l.mode==='local')) {
  test(`lab ${lab.id}: rejects initial state and accepts solution`, async()=>{
    const e=new RedisEngine();
    try {
      for(const command of lab.setup) await e.execute(command);
      assert.equal((await lab.validate(e)).pass,false,'Initial state must not pass');
      for(const command of lab.solution) await e.execute(command);
      const result=await lab.validate(e);
      assert.equal(result.pass,true,result.message);
    } finally {await e.close();}
  });
}

test('equivalent counter solution passes by state, not command text',async()=>{
  const e=new RedisEngine();
  try {await e.execute('INCRBY visitas:inicio 3');assert.equal((await labs.find(l=>l.id==='visitas').validate(e)).pass,true);}
  finally {await e.close();}
});

test('all documented executable examples complete without errors',async()=>{
  const e=new RedisEngine();
  const verified=[];
  try {
    for(const c of catalog.filter(c=>e.supported.includes(c.name.split(' ')[0]))) {
      for(const example of c.examples) {
        if(example.executable===false)continue;
        await e.reset();
        for(const line of [...example.setup,...example.commands]) {
          try {await e.execute(line);} catch(error) {throw new Error(`${c.name}: ${line}: ${error.message}`);}
        }
        verified.push({command:c.name,title:example.title});
      }
    }
    writeFileSync('data/execution-coverage.json',JSON.stringify({supported:e.supported,verified,scope:'Ejemplos ejecutados sin errores; las aserciones de semántica y resultados están en tests/engine.test.js y tests/learning.test.js. No certifica todas las variantes.'},null,2)+'\n');
  }finally {await e.close();}
});

test('explicit exact stream trimming accepts = and removes the oldest entry',async()=>{
  const e=new RedisEngine();
  try {
    await e.execute('XADD eventos 1-0 valor uno');
    await e.execute('XADD eventos 2-0 valor dos');
    assert.equal(await e.execute('XTRIM eventos MAXLEN = 1'),1);
    assert.deepEqual(await e.execute('XRANGE eventos - +'),[['2-0',['valor','dos']]]);
  }finally{await e.close();}
});
