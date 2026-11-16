P = dict(ninout=-.1, title='25-Minute Focus Sprints', cut='DRIFTING', cutsize=140,
 envs=["S.env(stage, 'bedroom')", "S.env(stage, 'hall')", "S.env(stage, 'library', { day: true })"],
 vo=['Three hours of studying, and you remember nothing?', 'Your mind drifts every few minutes.', 'Reset.',
     'Set a timer for twenty-five minutes. Focus on one subject. Then take a five-minute break.', 'Short sprints. Real progress.'],
 heads=['<div data-max="130">3 HOURS OF STUDYING,</div><div data-max="140">AND YOU REMEMBER <i class="pk">NOTHING?</i></div>',
        '<div data-max="130">YOUR MIND DRIFTS</div><div data-max="140">EVERY <i class="pk">FEW</i> <i class="pk">MINUTES.</i></div>',
        '<div data-max="200"><i class="cy">RESET.</i></div>',
        '<div data-max="130">25 MINUTES ON ONE SUBJECT.</div><div data-max="140">THEN A <i class="cy">5-MINUTE</i> <i class="cy">BREAK.</i></div>',
        '<div data-max="150">SHORT SPRINTS.</div>', '<div data-max="160"><i class="or">REAL</i> <i class="or">PROGRESS.</i></div>'],
 keys=dict(h1=('hook', 1.9), pk=('prob', 1.8), f1=('fix', .55), f2=('fix', 2.6)),
 h1sfx='uhoh', sfx=[('prob', .3, 'notif_ding', -14), ('prob', .9, 'pop', -14), ('fix', .55, 'ui_tap', -13), ('fix', 2.6, 'chime_up', -12)],
 js=r'''
const hookTL = S.ninja.timeline([[0, 'type', { face: 'd', dx: 130, dy: -236 }], [1.0, 'sit', { lean: .3, tilt: .25, face: 'c', dx: 150, dy: -232 }, .2], [K.h1, 'type', { face: 'x', dx: 130, dy: -236 }, .1]]);
function drawHook(ctx, t) { ctx.lineCap = 'round'; ctx.lineJoin = 'round'; S.wallClock(ctx, 300, 1000, 1.1, t, { speed: 2 + 14 * seg(t, 0, A.prob) });
  ctx.fillStyle = '#2a2f55'; ctx.fillRect(640, 1262, 380, 20); ctx.fillRect(660, 1282, 20, 218); ctx.fillRect(980, 1282, 20, 218); S.book(ctx, 820, 1230, .8, -6, { open: 1 });
  D(ctx, nin(t, hookTL(t), { x: 560, y: 1500, s: 1 })); }
const probTL = S.ninja.timeline([[A.prob, 'look'], [A.prob + .8, 'chin', { face: 'd' }, .15], [K.pk, 'facepalm', {}, .12]]);
function drawProb(ctx, t) {
  [.3, .6, .9].forEach((o, i) => { const k = oBack(seg(t, A.prob + o, A.prob + o + .25), 2); if (k > 0) S.cloud(ctx, 660 + i * 130, 1000 - (i % 2) * 60, .5 * k, t, {}); });
  D(ctx, nin(t, probTL(t), { x: 380, y: 1500, s: 1 })); }
const fixTL = S.ninja.timeline([[A.fix, 'type', { face: 'f', dx: 130, dy: -236 }], [K.f2, 'stretch', {}, .2]]);
function drawFix(ctx, t) { ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.fillStyle = '#2a2f55'; ctx.fillRect(640, 1262, 380, 20); ctx.fillRect(660, 1282, 20, 218); ctx.fillRect(980, 1282, 20, 218);
  glow(ctx, 820, 1200, 220, 'rgba(62,230,255,A)', .3 + .4 * seg(t, K.f1, K.f2)); S.book(ctx, 820, 1230, .8, -6, { open: 1, flip: seg(t, K.f1, K.f2) });
  S.timer(ctx, 840, 960, .5 * oBack(seg(t, K.f1 - .2, K.f1 + .1), 2), 1 - .95 * seg(t, K.f1, K.f2));
  D(ctx, nin(t, fixTL(t), { x: 560, y: 1500, s: 1 }));
  S.sparks(ctx, t, K.f2, 840, 960, { n: 12, seed: 13, speed: 600, dir: -Math.PI / 2, spread: 2.4, life: .4, g: 900 }); }
''')
