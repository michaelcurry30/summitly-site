P = dict(ninout=-.1, title='The 5-Second Rule', cut='LATER', cutsize=200,
 envs=["S.env(stage, 'bedroom')", "S.env(stage, 'hall')", "S.env(stage, 'library', { day: true })"],
 vo=['The alarm rings, and you just lie there.', 'Too tired. Too cold. Your brain says, later.', 'Not today.',
     'Count five, four, three, two, one, and move before you think.', 'Don’t wait to feel ready. Count, then go.'],
 heads=['<div data-max="140">THE ALARM RINGS,</div><div data-max="140">AND YOU JUST <i class="pk">LIE</i> <i class="pk">THERE.</i></div>',
        '<div data-max="130">TOO TIRED. TOO COLD.</div><div data-max="140">YOUR BRAIN SAYS <i class="pk">LATER.</i></div>',
        '<div data-max="180"><i class="cy">NOT</i> <i class="cy">TODAY.</i></div>',
        '<div data-max="140">COUNT 5, 4, 3, 2, 1</div><div data-max="130">AND <i class="cy">MOVE</i> BEFORE YOU <i class="cy">THINK.</i></div>',
        '<div data-max="130">DON’T WAIT TO FEEL READY.</div>', '<div data-max="160"><i class="or">COUNT,</i> <i class="or">THEN</i> <i class="or">GO.</i></div>'],
 keys=dict(h1=('hook', 1.5), pk=('prob', 2.2), f1=('fix', .5), f2=('fix', 2.6)),
 h1sfx='uhoh', sfx=[('hook', .2, 'notif_ding', -14), ('hook', .6, 'notif_ding', -14), ('hook', 1.0, 'notif_ding', -14), ('prob', .3, 'pop', -14), ('prob', .9, 'pop', -14), ('prob', 1.5, 'pop', -14),
   ('fix', .5, 'ui_tap', -13), ('fix', .9, 'ui_tap', -13), ('fix', 1.3, 'ui_tap', -13), ('fix', 1.7, 'ui_tap', -13), ('fix', 2.1, 'ui_tap', -13)],
 js=r'''
const hookTL = S.ninja.timeline([[0, 'flat'], [K.h1, 'slump', {}, .25]]);
function drawHook(ctx, t) { S.wallClock(ctx, 820, 1080, 1.0, t, { speed: 2 }); S.buzz(ctx, 820, 1080, t, t < K.h1 ? 1 : 0);
  D(ctx, nin(t, hookTL(t), { x: 440, y: 1500, s: 1 })); S.qmark(ctx, 470, 1050 - 40 * oBack(seg(t, K.h1, K.h1 + .4), 2), 1, seg(t, K.h1, K.h1 + .3)); }
const probTL = S.ninja.timeline([[A.prob, 'slump'], [A.prob + 1.0, 'shrug', {}, .15], [K.pk, 'facepalm', {}, .12]]);
function drawProb(ctx, t) {
  ['TIRED', 'COLD', 'LATER'].forEach((w, i) => { const o = .3 + i * .6, k = oBack(seg(t, A.prob + o, A.prob + o + .25), 2); if (k <= 0) return;
    S.calPage(ctx, 660 + i * 140, 1020 + (i % 2) * 120, .5 * k, w, { rot: (i - 1) * 7, col: '#ff6fae' }); });
  D(ctx, nin(t, probTL(t), { x: 330, y: 1500, s: 1 })); }
const fixTL = S.ninja.timeline([[A.fix, 'crouch'], [A.fix + 2.2, 'jump', { ph: .5 }, .1], [K.f2, 'cheer', {}, .12]]);
function drawFix(ctx, t) {
  glow(ctx, 820, 1050, 240, 'rgba(62,230,255,A)', .3 + .5 * seg(t, K.f1, K.f2));
  for (let i = 0; i < 5; i++) { const a = K.f1 + i * .4, k = oBack(seg(t, a, a + .2), 2) * (1 - seg(t, a + .38, a + .45)); if (k > 0 || (i === 4 && t > a)) S.calPage(ctx, 820, 1050, .7 * (i === 4 && t > a ? Math.max(k, 1 - seg(t, K.f2, K.f2 + .2)) : k), String(5 - i), { rot: (i % 2 ? 5 : -5), col: '#3ee6ff' }); }
  D(ctx, nin(t, fixTL(t), { x: 440, y: 1500, s: 1 }));
  S.sparks(ctx, t, K.f2, 820, 1050, { n: 14, seed: 14, speed: 600, dir: -Math.PI / 2, spread: 2.6, life: .45, g: 900 }); }
''')
