P = dict(ninout=-.1, title='Sleep and Focus', cut='ONE MORE', cutsize=150,
 envs=["S.env(stage, 'library', { day: true })", "S.env(stage, 'bedroom')", "S.env(stage, 'bedroom')"],
 vo=['Can’t focus in the morning?', 'You stayed up for one more episode. Then one more.', 'Lights out.',
     'Keep the same bedtime every night, and put screens away before bed.', 'Sleep well tonight. Focus tomorrow.'],
 heads=['<div data-max="150">CAN’T FOCUS</div><div data-max="140">IN THE <i class="pk">MORNING?</i></div>',
        '<div data-max="130">UP LATE FOR ONE MORE EPISODE.</div><div data-max="150">THEN <i class="pk">ONE</i> <i class="pk">MORE.</i></div>',
        '<div data-max="170"><i class="cy">LIGHTS</i> <i class="cy">OUT.</i></div>',
        '<div data-max="130">SAME BEDTIME EVERY NIGHT.</div><div data-max="140"><i class="cy">SCREENS</i> <i class="cy">AWAY</i> BEFORE BED.</div>',
        '<div data-max="150">SLEEP WELL TONIGHT.</div>', '<div data-max="160"><i class="or">FOCUS</i> <i class="or">TOMORROW.</i></div>'],
 keys=dict(h1=('hook', 1.2), pk=('prob', 2.3), f1=('fix', .6), f2=('fix', 2.2)),
 h1sfx='uhoh', sfx=[('prob', .3, 'ui_tap', -15), ('prob', .7, 'ui_tap', -15), ('prob', 1.1, 'ui_tap', -15), ('prob', 1.5, 'ui_tap', -15), ('fix', .2, 'whoosh_short', -10)],
 js=r'''
const hookTL = S.ninja.timeline([[0, 'type', { face: 'd', dx: 130, dy: -236 }], [.7, 'sit', { lean: .3, tilt: .25, face: 'c', dx: 150, dy: -232 }, .2], [K.h1, 'sit', { lean: .5, tilt: .4, face: 'x', dx: 150, dy: -232 }, .2]]);
function drawHook(ctx, t) { ctx.fillStyle = '#2a2f55'; ctx.fillRect(640, 1262, 380, 20); ctx.fillRect(660, 1282, 20, 218); ctx.fillRect(980, 1282, 20, 218);
  S.laptop(ctx, 820, 1262, 1, { on: true, lines: 2 }); D(ctx, nin(t, hookTL(t), { x: 560, y: 1500, s: 1 }));
  S.qmark(ctx, 600, 1020 - 40 * oBack(seg(t, K.h1, K.h1 + .4), 2), 1, seg(t, K.h1, K.h1 + .3)); }
const probTL = S.ninja.timeline([[A.prob, 'scroll', { swipes: [.3, .7, 1.1, 1.5] }], [K.pk, 'slump', {}, .12]]);
function drawProb(ctx, t) { S.wallClock(ctx, 820, 1020, 1.0, t, { speed: 4 + 30 * seg(t, A.prob, A.roof) });
  D(ctx, nin(t, probTL(t), { x: 430, y: 1500, s: 1, face: 'g' })); }
const fixTL = S.ninja.timeline([[A.fix, 'throw'], [A.fix + .6, 'idle', {}, .15], [K.f2, 'stretch', {}, .2]]);
function drawFix(ctx, t) {
  glow(ctx, 520, 1250, 280, 'rgba(62,230,255,A)', .5 * seg(t, K.f2, K.f2 + .6));
  S.wallClock(ctx, 820, 1020, 1.0, t, { speed: 1 });
  const p = seg(t, A.fix + .2, A.fix + .65); if (p > 0 && p < 1) S.phone(ctx, lerp(560, 1150, p), lerp(1100, 1000, p) - 220 * Math.sin(Math.PI * p), .7, p * 540, {});
  D(ctx, nin(t, fixTL(t), { x: 470, y: 1500, s: 1 }));
  S.sparks(ctx, t, K.f2, 520, 1100, { n: 12, seed: 14, speed: 500, dir: -Math.PI / 2, spread: 2.4, life: .4, g: 900 }); }
''')
