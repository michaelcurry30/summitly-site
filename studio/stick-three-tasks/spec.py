P = dict(ninout=-.1, title='The 3-Task Day', cut='EVERYTHING', cutsize=125,
 envs=["S.env(stage, 'bedroom')", "S.env(stage, 'hall')", "S.env(stage, 'library', { day: true })"],
 vo=['A to-do list a mile long, and nothing gets done.', 'You jump from task to task all day.', 'Cut it.',
     'Pick just three tasks that matter most. Do those first.', 'Three wins beat thirty maybes.'],
 heads=['<div data-max="130">A TO-DO LIST A MILE LONG,</div><div data-max="140">AND <i class="pk">NOTHING</i> GETS DONE.</div>',
        '<div data-max="130">YOU JUMP FROM TASK</div><div data-max="140">TO TASK <i class="pk">ALL</i> <i class="pk">DAY.</i></div>',
        '<div data-max="180"><i class="cy">CUT</i> <i class="cy">IT.</i></div>',
        '<div data-max="130">PICK JUST 3 TASKS</div><div data-max="140">THAT MATTER. <i class="cy">DO</i> <i class="cy">THOSE</i> <i class="cy">FIRST.</i></div>',
        '<div data-max="150">3 WINS BEAT</div>', '<div data-max="160"><i class="or">30</i> <i class="or">MAYBES.</i></div>'],
 keys=dict(h1=('hook', 1.6), pk=('prob', 2.0), f1=('fix', .5), f2=('fix', 2.0)),
 h1sfx='impact_soft', sfx=[('hook', .3, 'pop', -14), ('hook', .6, 'pop', -14), ('hook', .9, 'pop', -14), ('prob', .4, 'whoosh_short', -12), ('prob', 1.0, 'whoosh_short', -12), ('fix', 1.5, 'pop', -13), ('fix', 1.8, 'pop', -13)],
 js=r'''
const hookTL = S.ninja.timeline([[0, 'look'], [K.h1, 'crushed', { k: .7 }, .08]]);
function drawHook(ctx, t) { for (let i = 0; i < 9; i++) { const a = .2 + i * .14, u = t - a; if (u < 0) continue;
    const y = Math.min(1440 - (i % 3) * 30, 900 + 1400 * u * u); S.note(ctx, 600 + (i % 4) * 110, y, .45, -25 + i * 9, '', { col: ['#ffe36b', '#9ee7ff', '#ffb3d1', '#c9ffb3'][i % 4] }); }
  D(ctx, nin(t, hookTL(t), { x: 400, y: 1500, s: 1 })); }
const probTL = S.ninja.timeline([[A.prob, 'run'], [K.pk, 'slump', {}, .12]]);
const probTr = S.track([[A.prob, 300, 1500, 1, 0], [A.prob + .6, 760, 1500, 1, 0], [A.prob + 1.2, 300, 1500, 1, 0], [K.pk, 520, 1500, 1, 0]]);
function drawProb(ctx, t) { [0, 1, 2].forEach(i => S.note(ctx, 200 + i * 330, 1000 + (i % 2) * 60, .5, (i - 1) * 8, '', { col: '#ffb3d1' }));
  D(ctx, nin(t, probTL(t), Object.assign({ vx: t < K.pk ? 400 : 0 }, probTr(t)))); }
const fixTL = S.ninja.timeline([[A.fix, 'sweep'], [K.f1, 'point', { ang: -30 }, .15], [K.f2 + .2, 'cheer', {}, .12]]);
function drawFix(ctx, t) {
  [0, 1, 2].forEach(i => { const a = K.f1 + i * .3, k = oBack(seg(t, a, a + .25), 2); if (k <= 0) return;
    S.note(ctx, 700 + i * 120, 1020 + (i % 2) * 70, .55 * k, (i - 1) * 7, '', { col: '#ffe36b' }); S.check(ctx, 700 + i * 120, 1020 + (i % 2) * 70, .45, seg(t, K.f2 + i * .12, K.f2 + i * .12 + .3)); });
  D(ctx, nin(t, fixTL(t), { x: 420, y: 1500, s: 1 }));
  S.sparks(ctx, t, K.f2, 820, 1040, { n: 12, seed: 14, speed: 500, dir: -Math.PI / 2, spread: 2.4, life: .4, g: 900 }); }
''')
