const { test } = require('node:test');
const assert = require('node:assert/strict');
const G = require('../dist/engine.js');
const apply = (s, a) => { const r = G.act(s, a); assert.equal(r.ok, true, r.message); return r.state; };
const move = (s, room) => apply(s, { type: 'move', room });
const inspect = (s, id) => apply(s, { type: 'inspect', id });

// Play through public actions only: no direct mutation or debug unlocks.
function investigate() {
  let s = G.create();
  s = inspect(s, 'manual'); s = inspect(s, 'pass');
  s = move(s, 'lounge'); s = apply(s, { type: 'talk', id: 'eileen' });
  s = inspect(s, 'manifest'); s = inspect(s, 'route'); s = inspect(s, 'score');
  s = apply(s, { type: 'talk', id: 'eileen', choice: 'music' });
  s = move(s, 'deck'); s = inspect(s, 'hatch'); s = inspect(s, 'boats');
  s = apply(s, { type: 'wait', minute: 9 });
  s = move(s, 'bridge'); s = inspect(s, 'video'); s = inspect(s, 'logs'); s = inspect(s, 'order');
  s = apply(s, { type: 'talk', id: 'captain' });
  s = apply(s, { type: 'deduce', ids: ['route', 'logs'] });
  s = apply(s, { type: 'deduce', ids: ['alibi', 'video', 'logs'] });
  s = move(s, 'cabin'); s = apply(s, { type: 'reset' });
  s = apply(s, { type: 'wait', minute: 3 }); s = move(s, 'clinic');
  s = apply(s, { type: 'talk', id: 'doctor' }); s = inspect(s, 'calendar'); s = inspect(s, 'records');
  s = apply(s, { type: 'locker', code: '1104' });
  s = apply(s, { type: 'deduce', ids: ['manifest', 'records'] });
  s = move(s, 'engine'); s = inspect(s, 'relay'); s = inspect(s, 'transfer');
  s = apply(s, { type: 'power', values: [2, 3, 1] });
  s = move(s, 'archive'); s = inspect(s, 'ticket');
  return s;
}

test('initial gates explain the investigation route', () => {
  const s = G.create();
  assert.match(G.gate(s, 'clinic'), /00:03/);
  assert.match(G.gate(s, 'engine'), /钥匙/);
  assert.equal(G.act(s, { type: 'move', room: 'archive' }).ok, false);
  assert.equal(s.minute, 0);
});
test('the full investigation is reachable without attributes or external relics', () => {
  const s = investigate();
  assert.equal(G.ready(s), true); assert.equal(s.cycle, 2);
  assert.equal(s.deductions.length, 3);
});
test('each of three endings requires explicit confirmation and records an anchor once', () => {
  for (const ending of ['maintain', 'stop', 'rescue']) {
    let s = investigate();
    if (ending === 'rescue') s = apply(s, { type: 'consent' });
    assert.equal(G.act(s, { type: 'finish', ending }).ok, false);
    const before = s.xp;
    s = apply(s, { type: 'finish', ending, confirm: true });
    assert.equal(s.ending, ending); assert.equal(s.xp - before, 450);
    assert.equal(G.act(s, { type: 'finish', ending, confirm: true }).ok, false);
    s = apply(s, { type: 'replay' });
    assert.equal(s.ending, null); assert.equal(s.endingsSeen.includes(ending), true);
  }
});
test('loop rollover resets physical states and keeps knowledge and unique rewards', () => {
  let s = investigate(); const before = s.xp; const known = s.known.slice();
  s = apply(s, { type: 'wait', minute: 14 });
  assert.equal(s.cycle, 3); assert.equal(s.minute, 0); assert.equal(s.room, 'cabin');
  assert.equal(s.flags.power, false); assert.equal(s.flags.locker, false); assert.equal(s.flags.relay, false);
  assert.deepEqual(s.known, known); assert.equal(s.xp, before);
  s = inspect(s, 'pass'); assert.equal(s.xp, before);
});
test('wrong evidence sets do not deduct XP or lock the investigation', () => {
  let s = investigate(); const before = s.xp;
  const bad = G.act(s, { type: 'deduce', ids: ['pass', 'manual'] });
  assert.equal(bad.ok, false); assert.equal(bad.state.xp, before);
  const good = G.act(s, { type: 'deduce', ids: ['route', 'logs'] });
  assert.equal(good.ok, true); assert.equal(good.state.xp, before);
});
test('alibi is only recorded when the player is actually on deck at 00:09', () => {
  let s = apply(G.create(), { type: 'wait', minute: 9 });
  assert.equal(G.has(s, 'alibi'), false);
  assert.equal(G.has(investigate(), 'alibi'), true);
});
test('power allocation rejects overloaded and unsafe settings without irreversible damage', () => {
  let s = investigate(); s = move(s, 'engine');
  for (const values of [[2, 3, 2], [1, 3, 1], [2, 2, 1], [-1, 3, 1], [2, 3]]) {
    const r = G.act(s, { type: 'power', values }); assert.equal(r.ok, false);
    assert.deepEqual(r.state, s);
  }
  assert.equal(G.act(s, { type: 'power', values: [2, 3, 1] }).ok, true);
});
test('all-person rescue cannot be selected without consent', () => {
  const s = investigate();
  assert.deepEqual(G.rescueMissing(s), ['本轮取得14份知情授权']);
  assert.equal(G.act(s, { type: 'finish', ending: 'rescue', confirm: true }).ok, false);
});
test('malformed or unknown-version saves fail safely; valid saves preserve the loop', () => {
  for (const raw of ['broken json', '{}', 'null', '{"version":999}', '{"version":1,"room":"__proto__"}']) assert.equal(G.restore(raw), null);
  const s = investigate(); const restored = G.restore(JSON.stringify(s));
  assert.deepEqual(restored, s);
});
test('rewards cannot be farmed through inspection, repeat conversations or repeated deductions', () => {
  let s = investigate(); const before = s.xp;
  for (let i = 0; i < 5; i++) {
    s = inspect(s, 'ticket'); s = apply(s, { type: 'deduce', ids: ['logs', 'route'] });
  }
  assert.equal(s.xp, before);
});
test('the engine never mutates its input state', () => {
  const s = G.create(); const serialized = JSON.stringify(s);
  G.act(s, { type: 'inspect', id: 'pass' });
  assert.equal(JSON.stringify(s), serialized);
});
