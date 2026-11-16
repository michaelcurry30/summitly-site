P = dict(ninout=-.1, title='The 1% Rule', cut='OVERNIGHT', cutsize=130,
 envs=["S.env(stage, 'bedroom')", "S.env(stage, 'hall')", "S.env(stage, 'library', { day: true })"],
 vo=['You want a big change, and you want it now.', 'Day one, nothing. Day two, nothing. So you quit.', 'Hold up.',
     'Aim for one percent better today. Then one percent again tomorrow.', 'Tiny gains add up. Keep stacking.'],
 heads=['<div data-max="130">YOU WANT A BIG CHANGE,</div><div data-max="140">AND YOU WANT IT <i class="pk">NOW.</i></div>',
        '<div data-max="130">DAY 1, NOTHING. DAY 2, NOTHING.</div><div data-max="150">SO YOU <i class="pk">QUIT.</i></div>',
        '<div data-max="180"><i class="cy">HOLD</i> <i class="cy">UP.</i></div>',
        '<div data-max="130">AIM FOR 1% BETTER TODAY.</div><div data-max="140">THEN <i class="cy">1%</i> <i class="cy">AGAIN</i> TOMORROW.</div>',
        '<div data-max="140">TINY GAINS ADD UP.</div>', '<div data-max="160"><i class="or">KEEP</i> <i class="or">STACKING.</i></div>'],
 keys=dict(h1=('hook', 1.7), pk=('prob', 2.2), f1=('fix', .4), f2=('fix', 2.3)),
 h1sfx='impact_soft', sfx=[('hook', .5, 'hop', -13), ('hook', 1.1, 'hop', -13), ('prob', .3, 'pop', -14), ('prob', 1.2, 'pop', -14), ('fix', .4, 'pop', -14), ('fix', .9, 'pop', -14), ('fix', 1.4, 'pop', -14), ('fix', 1.9, 'pop', -13)],
 js=r'''
const hookTL = S.ninja.timeline([[0, 'crouch'], [.4, 'jump', { ph: .5 }, .1], [.9, 'crouch', {}, .1], [1.0, 'jump', { ph: .5 }, .1], [K.h1, 'fall', {}, .1]]);
function drawHook(ctx, t) { S.calPage(ctx, 760, 960, .6, 'GOAL', { rot: 6 });
  const j = Math.max(0, Math.sin(Math.PI * seg(t, .4, .9))) + Math.max(0, Math.sin(Math.PI * seg(t, 1.0, 1.5)));
  D(ctx, nin(t, hookTL(t), { x: 470, y: 1500 - 160 * j, s: 1 })); }
const probTL = S.ninja.timeline([[A.prob, 'look'], [A.prob + 1.2, 'shrug', {}, .15], [K.pk, 'facepalm', {}, .12]]);
function drawProb(ctx, t) {
  [0, 1].forEach(i => { const a = A.prob + .3 + i * .9, k = oBack(seg(t, a, a + .25), 2); if (k <= 0) return;
    S.calPage(ctx, 680 + i * 190, 1060 + i * 30, .5 * k, 'DAY ' + (i + 1), { rot: (i ? 6 : -6), col: '#ff6fae' }); });
  D(ctx, nin(t, probTL(t), { x: 330, y: 1500, s: 1 })); }
const fixTL = S.ninja.timeline([[A.fix, 'point', { ang: -30 }], [A.fix + 1.0, 'climb', {}, .15], [K.f2, 'cheer', {}, .12]]);
function drawFix(ctx, t) {
  glow(ctx, 760, 1150, 260, 'rgba(62,230,255,A)', .3 + .4 * seg(t, K.f1, K.f2));
  for (let i = 0; i < 5; i++) { const a = K.f1 + i * .45, k = oBack(seg(t, a, a + .25), 2); if (k <= 0) continue;
    S.calPage(ctx, 640 + i * 90, 1400 - i * 95, .36 * k, '+1%', { rot: 0, col: '#3ee6ff' }); }
  D(ctx, nin(t, fixTL(t), { x: 400, y: 1500, s: 1 }));
  S.sparks(ctx, t, K.f2, 1000, 1000, { n: 12, seed: 14, speed: 500, dir: -Math.PI / 2, spread: 2.4, life: .4, g: 900 }); }
''')
