P = dict(ninout=-.1, title='Set a Short Deadline', cut='ALL DAY', cutsize=170,
 envs=["S.env(stage, 'bedroom')", "S.env(stage, 'hall')", "S.env(stage, 'library', { day: true })"],
 vo=['One small task, and somehow it takes all day?', 'Work stretches to fill the time you give it.', 'Not anymore.',
     'Give each task a short deadline. Set a timer, and race it.', 'Less time. More done.'],
 heads=['<div data-max="130">ONE SMALL TASK, AND IT</div><div data-max="140">TAKES <i class="pk">ALL</i> <i class="pk">DAY?</i></div>',
        '<div data-max="130">WORK STRETCHES TO FILL</div><div data-max="140">THE <i class="pk">TIME</i> YOU GIVE IT.</div>',
        '<div data-max="170"><i class="cy">NOT</i> <i class="cy">ANYMORE.</i></div>',
        '<div data-max="130">GIVE EACH TASK A SHORT</div><div data-max="140">DEADLINE. <i class="cy">SET</i> <i class="cy">A</i> <i class="cy">TIMER.</i></div>',
        '<div data-max="150">LESS TIME.</div>', '<div data-max="160"><i class="or">MORE</i> <i class="or">DONE.</i></div>'],
 keys=dict(h1=('hook', 1.6), pk=('prob', 2.0), f1=('fix', .5), f2=('fix', 2.3)),
 h1sfx='uhoh', sfx=[('hook', .4, 'impact_soft', -15), ('prob', .5, 'whoosh_short', -13), ('fix', .5, 'ui_tap', -13), ('fix', 1.4, 'whoosh_short', -12)],
 js=r'''
const hookTL = S.ninja.timeline([[0, 'type', { face: 'd', dx: 130, dy: -236 }], [1.0, 'sit', { lean: .3, tilt: .25, face: 'c', dx: 150, dy: -232 }, .2], [K.h1, 'type', { face: 'x', dx: 130, dy: -236 }, .1]]);
function drawHook(ctx, t) { S.wallClock(ctx, 300, 1000, 1.1, t, { speed: 2 + 20 * seg(t, 0, A.prob) });
  ctx.fillStyle = '#2a2f55'; ctx.fillRect(640, 1262, 380, 20); ctx.fillRect(660, 1282, 20, 218); ctx.fillRect(980, 1282, 20, 218);
  S.note(ctx, 820, 1200, .5, -4, '', { col: '#ffe36b' }); D(ctx, nin(t, hookTL(t), { x: 560, y: 1500, s: 1 })); }
const probTL = S.ninja.timeline([[A.prob, 'stretch'], [A.prob + 1.0, 'slump', {}, .2], [K.pk, 'facepalm', {}, .12]]);
function drawProb(ctx, t) { const w = 120 + 520 * io(seg(t, A.prob + .2, K.pk));
  ctx.save(); ctx.fillStyle = '#ffe36b'; ctx.beginPath(); ctx.roundRect(560, 1060, w, 110, 14); ctx.fill(); ctx.restore();
  D(ctx, nin(t, probTL(t), { x: 380, y: 1500, s: 1 })); }
const fixTL = S.ninja.timeline([[A.fix, 'point', { ang: -30 }], [K.f1 + .3, 'run', {}, .12], [K.f2, 'cheer', {}, .12]]);
const fixTr = S.track([[A.fix, 300, 1500, 1, 0], [K.f1 + .3, 300, 1500, 1, 0], [K.f2, 560, 1500, 1, 0]]);
function drawFix(ctx, t) { glow(ctx, 820, 1050, 240, 'rgba(62,230,255,A)', .3 + .4 * seg(t, K.f1, K.f2));
  S.timer(ctx, 840, 1000, .55 * oBack(seg(t, K.f1 - .2, K.f1 + .1), 2), 1 - .95 * seg(t, K.f1, K.f2));
  D(ctx, nin(t, fixTL(t), Object.assign({ vx: t > K.f1 + .3 && t < K.f2 ? 300 : 0 }, fixTr(t))));
  S.check(ctx, 840, 1000, .55, seg(t, K.f2, K.f2 + .35));
  S.sparks(ctx, t, K.f2, 840, 1000, { n: 12, seed: 14, speed: 500, dir: -Math.PI / 2, spread: 2.4, life: .4, g: 900 }); }
''')
