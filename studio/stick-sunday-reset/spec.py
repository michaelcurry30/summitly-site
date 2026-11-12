P = dict(title='The Sunday Reset', ec='a', cut='CHAOS', cutsize=170,
 envs=["S.env(stage, 'bedroom')", "S.env(stage, 'kitchen')", "S.env(stage, 'library', { day: true })"],
 heads=['<div data-max="130">MONDAY HITS, AND YOU’RE</div><div data-max="150">ALREADY <i class="pk">BEHIND?</i></div>',
        '<div data-max="130">MESSY ROOM. NO PLAN.</div><div data-max="130">EVERY WEEK, THE SAME <i class="pk">CHAOS.</i></div>',
        '<div data-max="170"><i class="cy">NOT</i> <i class="cy">THIS</i> <i class="cy">WEEK.</i></div>',
        '<div data-max="130">SUNDAY NIGHT: TIDY UP</div><div data-max="140">AND PLAN <i class="cy">THREE</i> <i class="cy">WINS.</i></div>',
        '<div data-max="150">RESET ON SUNDAY.</div>', '<div data-max="160"><i class="or">WIN</i> <i class="or">THE</i> <i class="or">WEEK.</i></div>'],
 keys=dict(h1=('hook', 1.3), pk=('prob', 1.9), f1=('fix', .9), f2=('fix', 2.1)),
 h1sfx='impact_soft', sfx=[('hook', .25, 'riser', -14), ('prob', .4, 'pop', -14), ('prob', .8, 'pop', -14), ('prob', 1.2, 'pop', -14), ('fix', 1.55, 'pop', -13), ('fix', 1.85, 'pop', -13)],
 js=r'''
const hookTL = S.ninja.timeline([[0, 'run'], [K.h1, 'crushed', { k: .7 }, .08], [K.h1 + .7, 'facepalm', {}, .15]]);
const hookTr = S.track([[0, 160, 1500, 1, 0], [K.h1, 420, 1500, 1, 0]]);
function drawHook(ctx, t) { const k = oBack(seg(t, .3, .7), 2);
  if (k > 0) S.calPage(ctx, 760, 1000 + 40 * oC(seg(t, K.h1 - .2, K.h1)), .7 * k, 'MON', { rot: 6 });
  D(ctx, nin(t, hookTL(t), Object.assign({ vx: t < K.h1 ? 300 : 0 }, hookTr(t))));
  S.sparks(ctx, t, K.h1, 420, 1040, { n: 10, seed: 3, speed: 400, dir: -Math.PI / 2, spread: 2.4, life: .3, g: 900 }); }
const probTL = S.ninja.timeline([[A.prob, 'slump'], [A.prob + 1.0, 'shrug', {}, .15], [K.pk, 'facepalm', {}, .12]]);
function drawProb(ctx, t) {
  [.4, .8, 1.2].forEach((o, i) => { const k = oBack(seg(t, A.prob + o, A.prob + o + .25), 2); if (k <= 0) return; const x = 640 + i * 150, y = 1230;
    if (i === 0) S.chips(ctx, x, y, .9 * k, -12); else if (i === 1) S.mug(ctx, x, y + 20, .9 * k); else S.mail(ctx, x, y - 10, .9 * k, 10); });
  [0, 1, 2, 3].forEach(i => S.note(ctx, 620 + i * 120, 1470 - (i % 2) * 14, .45, -20 + i * 17, '', { col: ['#ffe36b', '#9ee7ff', '#ffb3d1', '#c9ffb3'][i] }));
  D(ctx, nin(t, probTL(t), { x: 330, y: 1500, s: 1 })); }
const fixTL = S.ninja.timeline([[A.fix, 'sweep'], [K.f1, 'point', { ang: -30 }, .15], [K.f2 + .2, 'cheer', {}, .12]]);
function drawFix(ctx, t) {
  [0, 1, 2].forEach(i => { const a = K.f1 + i * .35, k = oBack(seg(t, a, a + .25), 2); if (k <= 0) return;
    S.note(ctx, 700 + i * 120, 1020 + (i % 2) * 70, .55 * k, (i - 1) * 7, '', { col: '#ffe36b' }); S.check(ctx, 700 + i * 120, 1020 + (i % 2) * 70, .45, seg(t, K.f2 + i * .12, K.f2 + i * .12 + .3)); });
  D(ctx, nin(t, fixTL(t), { x: 420, y: 1500, s: 1 }));
  S.sparks(ctx, t, A.fix + .3, 560, 1300, { n: 10, seed: 15, speed: 400, dir: -Math.PI / 2, spread: 2.4, life: .35, g: 900, cols: ['#fff', '#3ee6ff'] });
  S.sparks(ctx, t, K.f2, 820, 1040, { n: 12, seed: 14, speed: 500, dir: -Math.PI / 2, spread: 2.4, life: .4, g: 900 }); }
''')
