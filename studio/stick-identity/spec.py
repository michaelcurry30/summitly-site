P = dict(ninout=-.1, title='Identity First', cut='NOT ME', cutsize=180,
 envs=["S.env(stage, 'rooftop')", "S.env(stage, 'hall')", "S.env(stage, 'library', { day: true })"],
 vo=['You try to run, but you tell yourself, I’m not a runner.', 'So every workout feels like a fight.', 'Wrong story.',
     'Say, I’m someone who moves every day. Then do one tiny workout to prove it.', 'Become the person first. The habits follow.'],
 heads=['<div data-max="130">YOU TRY TO RUN, BUT</div><div data-max="140">“I’M <i class="pk">NOT</i> A <i class="pk">RUNNER.</i>”</div>',
        '<div data-max="130">SO EVERY WORKOUT</div><div data-max="140">FEELS LIKE A <i class="pk">FIGHT.</i></div>',
        '<div data-max="170"><i class="cy">WRONG</i> <i class="cy">STORY.</i></div>',
        '<div data-max="120">“I MOVE EVERY DAY.”</div><div data-max="130">THEN <i class="cy">PROVE</i> <i class="cy">IT</i> WITH ONE TINY WORKOUT.</div>',
        '<div data-max="130">BECOME THE PERSON FIRST.</div>', '<div data-max="160"><i class="or">HABITS</i> <i class="or">FOLLOW.</i></div>'],
 keys=dict(h1=('hook', 1.6), pk=('prob', 1.9), f1=('fix', .6), f2=('fix', 2.4)),
 h1sfx='uhoh', sfx=[('hook', .4, 'hop', -14), ('prob', .5, 'impact_soft', -13), ('prob', 1.1, 'impact_soft', -13), ('fix', 1.0, 'hop', -13), ('fix', 1.5, 'hop', -13)],
 js=r'''
const hookTL = S.ninja.timeline([[0, 'run'], [K.h1, 'slump', {}, .15]]);
const hookTr = S.track([[0, 160, 1500, 1, 0], [K.h1, 460, 1500, 1, 0]]);
function drawHook(ctx, t) { D(ctx, nin(t, hookTL(t), Object.assign({ vx: t < K.h1 ? 300 : 0 }, hookTr(t))));
  S.calPage(ctx, 800, 1060, .55 * oBack(seg(t, K.h1 - .2, K.h1 + .1), 2), 'NOT ME', { rot: 7, col: '#ff6fae' }); }
const probTL = S.ninja.timeline([[A.prob, 'push'], [A.prob + 1.4, 'crushed', { k: .6 }, .12], [K.pk + .3, 'facepalm', {}, .15]]);
function drawProb(ctx, t) { const u = t - A.prob, k = seg(t, A.prob, A.prob + 1.4);
  S.monster(ctx, 820 - 60 * k, 1500, .7, t, { mood: 'roar', label: 'WORKOUT' });
  D(ctx, nin(t, probTL(t), { x: 400 + 10 * Math.sin(u * 30) * (1 - k), y: 1500, s: 1 })); }
const fixTL = S.ninja.timeline([[A.fix, 'pushup'], [A.fix + 1.8, 'jump', { ph: .5 }, .1], [K.f2, 'cheer', {}, .12]]);
function drawFix(ctx, t) {
  glow(ctx, 520, 1250, 260, 'rgba(62,230,255,A)', .3 + .4 * seg(t, K.f1, K.f2));
  S.calPage(ctx, 820, 1040, .55 * oBack(seg(t, K.f1, K.f1 + .3), 2), 'DAY 1', { rot: -5, col: '#3ee6ff' });
  S.check(ctx, 830, 1060, .55, seg(t, K.f2, K.f2 + .35));
  D(ctx, nin(t, fixTL(t), { x: 430, y: 1500, s: 1 }));
  S.sparks(ctx, t, K.f2, 830, 1040, { n: 12, seed: 14, speed: 500, dir: -Math.PI / 2, spread: 2.4, life: .4, g: 900 }); }
''')
