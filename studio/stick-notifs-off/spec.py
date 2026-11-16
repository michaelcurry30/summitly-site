P = dict(ninout=-.25, title='Notifications Off', cut='PING', cutsize=180,
 envs=["S.env(stage, 'library', { day: true })", "S.env(stage, 'bedroom')", "S.env(stage, 'library', { day: true })"],
 vo=['Every time your phone buzzes, your focus breaks.', 'Ping. Ping. Ping. You never get back on track.', 'Silence.',
     'Turn off every notification you don’t need. Check messages when you choose.', 'Your attention. Your rules.'],
 heads=['<div data-max="130">EVERY TIME YOUR PHONE BUZZES,</div><div data-max="140">YOUR FOCUS <i class="pk">BREAKS.</i></div>',
        '<div data-max="140">PING. PING. PING.</div><div data-max="130">YOU NEVER GET <i class="pk">BACK</i> <i class="pk">ON</i> <i class="pk">TRACK.</i></div>',
        '<div data-max="180"><i class="cy">SILENCE.</i></div>',
        '<div data-max="120">TURN OFF ALERTS YOU DON’T NEED.</div><div data-max="130">CHECK <i class="cy">WHEN</i> <i class="cy">YOU</i> <i class="cy">CHOOSE.</i></div>',
        '<div data-max="150">YOUR ATTENTION.</div>', '<div data-max="160"><i class="or">YOUR</i> <i class="or">RULES.</i></div>'],
 keys=dict(h1=('hook', 1.2), pk=('prob', 2.3), f1=('fix', .6), f2=('fix', 2.4)),
 h1sfx='notif_ding', sfx=[('hook', .6, 'notif_ding', -14), ('prob', .2, 'notif_ding', -13), ('prob', .6, 'notif_ding', -13), ('prob', 1.0, 'notif_ding', -13), ('fix', .6, 'ui_tap', -13), ('fix', 1.0, 'ui_tap', -13)],
 js=r'''
const hookTL = S.ninja.timeline([[0, 'read'], [K.h1, 'look', { face: 'x' }, .1]]);
function drawHook(ctx, t) { S.phone(ctx, 780, 1300, .8, 0, { glow: t > .5 ? .8 : 0 }); S.buzz(ctx, 780, 1300, t, t > .5 ? 1 : 0);
  D(ctx, nin(t, hookTL(t), { x: 440, y: 1500, s: 1 })); S.sparks(ctx, t, K.h1, 470, 1060, { n: 8, seed: 3, speed: 300, dir: -Math.PI / 2, spread: 2, life: .3, g: 900 }); }
const probTL = S.ninja.timeline([[A.prob, 'look'], [A.prob + .8, 'scroll', { swipes: [.1, .4, .7] }, .12], [K.pk, 'facepalm', {}, .12]]);
function drawProb(ctx, t) {
  [.2, .6, 1.0].forEach((o, i) => { const k = oBack(seg(t, A.prob + o, A.prob + o + .25), 2); if (k > 0) S.note(ctx, 640 + i * 130, 1000 - (i % 2) * 70, .6 * k, (i - 1) * 8, '', { col: ['#9ee7ff', '#ffe36b', '#ffb3d1'][i] }); });
  if (t < A.prob + .8) { S.phone(ctx, 800, 1215, .8, 0, { glow: .8 }); S.buzz(ctx, 800, 1215, t, 1); }
  D(ctx, nin(t, probTL(t), { x: 380, y: 1500, s: 1 })); }
const fixTL = S.ninja.timeline([[A.fix, 'point', { ang: 20 }], [K.f1 + .5, 'type', { face: 'f', dx: 130, dy: -236 }, .15], [K.f2, 'cheer', {}, .12]]);
function drawFix(ctx, t) {
  ctx.fillStyle = '#2a2f55'; ctx.fillRect(640, 1262, 380, 20); ctx.fillRect(660, 1282, 20, 218); ctx.fillRect(980, 1282, 20, 218);
  glow(ctx, 820, 1200, 220, 'rgba(62,230,255,A)', .3 + .4 * seg(t, K.f1, K.f2)); S.laptop(ctx, 760, 1262, 1, { on: true, lines: 1 + Math.floor(5 * seg(t, K.f1, K.f2)) });
  S.phone(ctx, 960, 1240, .6, 180 * seg(t, A.fix + .1, K.f1), {});
  D(ctx, nin(t, fixTL(t), { x: 500, y: 1500, s: 1 }));
  S.check(ctx, 960, 1080, .55, seg(t, K.f2, K.f2 + .35));
  S.sparks(ctx, t, K.f2, 960, 1080, { n: 12, seed: 13, speed: 600, dir: -Math.PI / 2, spread: 2.4, life: .4, g: 900 }); }
''')
