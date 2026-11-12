P = dict(title='Go Deep Not Long', ec='d', cut='BUZZ', cutsize=200,
 envs=["S.env(stage, 'bedroom')", "S.env(stage, 'hall')", "S.env(stage, 'library', { day: true })"],
 heads=['<div data-max="130">HOURS AT YOUR DESK,</div><div data-max="140">BUT <i class="pk">NOTHING</i> <i class="pk">GETS</i> <i class="pk">DONE?</i></div>',
        '<div data-max="130">PHONE BUZZING. TABS OPEN.</div><div data-max="140">FOCUS IN <i class="pk">PIECES.</i></div>',
        '<div data-max="180"><i class="cy">ENOUGH.</i></div>',
        '<div data-max="130">PHONE AWAY. ONE TASK.</div><div data-max="140"><i class="cy">ONE</i> <i class="cy">TIMER.</i> <i class="cy">GO</i> <i class="cy">DEEP.</i></div>',
        '<div data-max="160">GO DEEP,</div>', '<div data-max="170"><i class="or">NOT</i> <i class="or">LONG.</i></div>'],
 keys=dict(h1=('hook', 1.9), pk=('prob', 2.1), f1=('fix', .55), f2=('fix', 2.2)),
 h1sfx='uhoh', sfx=[('prob', .3, 'notif_ding', -14), ('prob', .75, 'pop', -14), ('prob', 1.05, 'pop', -14), ('prob', 1.35, 'notif_ding', -14), ('fix', .15, 'whoosh_short', -10)],
 js=r'''
const hookTL = S.ninja.timeline([[0, 'type', { face: 'd', dx: 130, dy: -236 }], [1.0, 'sit', { lean: .3, tilt: .25, face: 'c', dx: 150, dy: -232 }, .2], [K.h1, 'type', { face: 'x', dx: 130, dy: -236 }, .1]]);
function drawHook(ctx, t) { S.wallClock(ctx, 300, 1000, 1.1, t, { speed: 2 + 14 * seg(t, 0, A.prob) }); S.laptop(ctx, 820, 1262, 1, { on: true, lines: 2 });
  D(ctx, nin(t, hookTL(t), { x: 560, y: 1500, s: 1 })); S.sparks(ctx, t, K.h1, 560, 1060, { n: 8, seed: 3, speed: 300, dir: -Math.PI / 2, spread: 2, life: .3, g: 900 }); }
const probTL = S.ninja.timeline([[A.prob, 'look'], [A.prob + .9, 'scroll', { swipes: [.1, .4, .7] }, .12], [K.pk, 'facepalm', {}, .12]]);
function drawProb(ctx, t) {
  [.6, .9, 1.2].forEach((o, i) => { const k = oBack(seg(t, A.prob + o, A.prob + o + .25), 2); if (k > 0) S.note(ctx, 640 + i * 130, 1000 - (i % 2) * 70, .6 * k, (i - 1) * 8, '', { col: ['#9ee7ff', '#ffe36b', '#ffb3d1'][i] }); });
  if (t < A.prob + .9) { S.phone(ctx, 800, 1215, .8, 0, { glow: .8 }); S.buzz(ctx, 800, 1215, t, 1); }
  D(ctx, nin(t, probTL(t), { x: 380, y: 1500, s: 1 })); }
const fixTL = S.ninja.timeline([[A.fix, 'throw'], [A.fix + .5, 'type', { face: 'f', dx: 130, dy: -236 }, .15], [K.f2, 'cheer', {}, .12]]);
function drawFix(ctx, t) {
  ctx.fillStyle = '#2a2f55'; ctx.fillRect(640, 1262, 380, 20); ctx.fillRect(660, 1282, 20, 218); ctx.fillRect(980, 1282, 20, 218);
  glow(ctx, 820, 1200, 220, 'rgba(62,230,255,A)', .3 + .4 * seg(t, K.f1, K.f2)); S.laptop(ctx, 820, 1262, 1, { on: true, lines: 1 + Math.floor(5 * seg(t, K.f1, K.f2)) });
  S.timer(ctx, 840, 960, .5 * oBack(seg(t, K.f1 - .2, K.f1 + .1), 2), 1 - .9 * seg(t, K.f1, K.f2));
  const n = nin(t, fixTL(t), { x: 560, y: 1500, s: 1 }); D(ctx, n);
  const p = seg(t, A.fix + .2, A.fix + .65); if (p > 0 && p < 1) S.phone(ctx, lerp(560, 1150, p), lerp(1100, 1000, p) - 220 * Math.sin(Math.PI * p), .7, p * 540, {});
  S.check(ctx, 1000, 1120, .6, seg(t, K.f2, K.f2 + .35));
  S.sparks(ctx, t, K.f2, 1000, 1120, { n: 12, seed: 13, speed: 600, dir: -Math.PI / 2, spread: 2.4, life: .4, g: 900 }); }
''')
