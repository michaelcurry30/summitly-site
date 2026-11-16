P = dict(ninout=-.1, title='The Done List', cut='NOTHING', cutsize=160,
 envs=["S.env(stage, 'bedroom')", "S.env(stage, 'hall')", "S.env(stage, 'library', { day: true })"],
 vo=['End of the day, and it feels like you did nothing?', 'You only see what’s still left on the list.', 'Look again.',
     'Write a done list. Every small win counts, even making your bed.', 'See your wins. Keep going.'],
 heads=['<div data-max="130">END OF THE DAY, AND IT</div><div data-max="130">FEELS LIKE YOU DID <i class="pk">NOTHING?</i></div>',
        '<div data-max="130">YOU ONLY SEE WHAT’S</div><div data-max="140">STILL <i class="pk">LEFT</i> ON THE LIST.</div>',
        '<div data-max="170"><i class="cy">LOOK</i> <i class="cy">AGAIN.</i></div>',
        '<div data-max="130">WRITE A DONE LIST.</div><div data-max="140">EVERY <i class="cy">SMALL</i> <i class="cy">WIN</i> COUNTS.</div>',
        '<div data-max="150">SEE YOUR WINS.</div>', '<div data-max="160"><i class="or">KEEP</i> <i class="or">GOING.</i></div>'],
 keys=dict(h1=('hook', 1.6), pk=('prob', 1.9), f1=('fix', .5), f2=('fix', 2.3)),
 h1sfx='uhoh', sfx=[('prob', .3, 'pop', -14), ('prob', .6, 'pop', -14), ('prob', .9, 'pop', -14), ('fix', .9, 'ui_tap', -15), ('fix', 1.3, 'ui_tap', -15), ('fix', 1.7, 'ui_tap', -15)],
 js=r'''
const hookTL = S.ninja.timeline([[0, 'walk'], [1.0, 'slump', {}, .2], [K.h1, 'facepalm', {}, .15]]);
const hookTr = S.track([[0, 200, 1500, 1, 0], [1.0, 440, 1500, 1, 0]]);
function drawHook(ctx, t) { S.wallClock(ctx, 820, 1020, 1.0, t, { speed: 3 }); D(ctx, nin(t, hookTL(t), Object.assign({ vx: t < 1 ? 240 : 0 }, hookTr(t)))); }
const probTL = S.ninja.timeline([[A.prob, 'look'], [K.pk, 'slump', {}, .12]]);
function drawProb(ctx, t) { for (let i = 0; i < 6; i++) { const a = A.prob + .2 + i * .15, k = oBack(seg(t, a, a + .2), 2); if (k <= 0) continue;
    S.note(ctx, 620 + (i % 3) * 130, 1000 + Math.floor(i / 3) * 150, .45 * k, (i - 2) * 6, '', { col: '#ffb3d1' }); }
  D(ctx, nin(t, probTL(t), { x: 330, y: 1500, s: 1 })); }
const fixTL = S.ninja.timeline([[A.fix, 'type', { face: 'f', dx: 130, dy: -236 }], [K.f2, 'cheer', {}, .12]]);
function drawFix(ctx, t) {
  ctx.fillStyle = '#2a2f55'; ctx.fillRect(640, 1262, 380, 20); ctx.fillRect(660, 1282, 20, 218); ctx.fillRect(980, 1282, 20, 218);
  const k = oBack(seg(t, A.fix + .1, K.f1), 2);
  if (k > 0) { ctx.save(); ctx.translate(820, 1250); ctx.scale(k, k); ctx.rotate(-.04); ctx.fillStyle = '#fff6e8'; ctx.beginPath(); ctx.roundRect(-150, -260, 300, 250, 12); ctx.fill();
    ctx.fillStyle = '#3ee6ff'; ctx.fillRect(-150, -260, 300, 34); ctx.lineCap = 'round';
    const n = Math.floor(5 * seg(t, K.f1, K.f2)); for (let i = 0; i < n; i++) { const y = -195 + i * 38;
      ctx.strokeStyle = '#141b3a'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-80, y); ctx.lineTo(-80 + 120 + 60 * hash(i * 3.1), y); ctx.stroke();
      ctx.strokeStyle = '#19c37d'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(-125, y); ctx.lineTo(-115, y + 9); ctx.lineTo(-98, y - 10); ctx.stroke(); }
    ctx.restore(); }
  D(ctx, nin(t, fixTL(t), { x: 560, y: 1500, s: 1 }));
  S.sparks(ctx, t, K.f2, 960, 980, { n: 12, seed: 14, speed: 500, dir: -Math.PI / 2, spread: 2.4, life: .4, g: 900 }); }
''')
