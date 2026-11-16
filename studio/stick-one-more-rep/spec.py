P = dict(ninout=-.1, title='Add One Rep', cut='SAME OLD', cutsize=150,
 envs=["S.env(stage, 'bedroom')", "S.env(stage, 'hall')", "S.env(stage, 'library', { day: true })"],
 vo=['Same workout every week, and you feel stuck?', 'Same reps. Same weight. Same results.', 'Level up.',
     'Add one rep, or a little weight, each week. Small steps, steady progress.', 'Do a bit more than last time.'],
 heads=['<div data-max="130">SAME WORKOUT EVERY WEEK,</div><div data-max="140">AND YOU FEEL <i class="pk">STUCK?</i></div>',
        '<div data-max="130">SAME REPS. SAME WEIGHT.</div><div data-max="140">SAME <i class="pk">RESULTS.</i></div>',
        '<div data-max="180"><i class="cy">LEVEL</i> <i class="cy">UP.</i></div>',
        '<div data-max="130">ADD ONE REP EACH WEEK.</div><div data-max="140"><i class="cy">SMALL</i> <i class="cy">STEPS,</i> STEADY PROGRESS.</div>',
        '<div data-max="140">DO A BIT MORE</div>', '<div data-max="160"><i class="or">THAN</i> <i class="or">LAST</i> <i class="or">TIME.</i></div>'],
 keys=dict(h1=('hook', 1.5), pk=('prob', 1.9), f1=('fix', .5), f2=('fix', 2.3)),
 h1sfx='uhoh', sfx=[('hook', .3, 'hop', -14), ('hook', .8, 'hop', -14), ('prob', .3, 'pop', -14), ('prob', .8, 'pop', -14), ('prob', 1.3, 'pop', -14), ('fix', .5, 'pop', -13), ('fix', 1.1, 'pop', -13), ('fix', 1.7, 'pop', -13)],
 js=r'''
const hookTL = S.ninja.timeline([[0, 'pushup'], [K.h1, 'shrug', {}, .15]]);
function drawHook(ctx, t) { S.calPage(ctx, 820, 1060, .5 * oBack(seg(t, .4, .7), 2), '10', { rot: 6, col: '#ff6fae' });
  D(ctx, nin(t, hookTL(t), { x: 470, y: 1500, s: 1 })); }
const probTL = S.ninja.timeline([[A.prob, 'pump'], [A.prob + 1.3, 'slump', {}, .2], [K.pk, 'facepalm', {}, .12]]);
function drawProb(ctx, t) { for (let i = 0; i < 3; i++) { const a = A.prob + .3 + i * .5, k = oBack(seg(t, a, a + .2), 2); if (k <= 0) continue;
    S.calPage(ctx, 620 + i * 150, 1040 + (i % 2) * 70, .42 * k, '10', { rot: (i - 1) * 6, col: '#ff6fae' }); }
  D(ctx, nin(t, probTL(t), { x: 330, y: 1500, s: 1 })); }
const fixTL = S.ninja.timeline([[A.fix, 'pushup'], [A.fix + 1.6, 'pump', {}, .12], [K.f2 + .2, 'cheer', {}, .12]]);
function drawFix(ctx, t) {
  glow(ctx, 760, 1150, 260, 'rgba(62,230,255,A)', .3 + .4 * seg(t, K.f1, K.f2));
  ['11', '12', '13'].forEach((w, i) => { const a = K.f1 + i * .6, k = oBack(seg(t, a, a + .25), 2); if (k <= 0) return;
    S.calPage(ctx, 640 + i * 150, 1260 - i * 110, .42 * k, w, { rot: 0, col: '#3ee6ff' }); });
  D(ctx, nin(t, fixTL(t), { x: 400, y: 1500, s: 1 }));
  S.sparks(ctx, t, K.f2, 940, 1000, { n: 12, seed: 14, speed: 500, dir: -Math.PI / 2, spread: 2.4, life: .4, g: 900 }); }
''')
