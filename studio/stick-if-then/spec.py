P = dict(ninout=-.1, title='If-Then Plans', cut='SOMEDAY', cutsize=160,
 envs=["S.env(stage, 'bedroom')", "S.env(stage, 'hall')", "S.env(stage, 'mountain')"],
 envOpt4="t => ({ rise: .3 + .5 * io(seg(t, A.fix, A.pay)) })",
 vo=['I’ll work out more. You say it every single week.', 'But more is not a plan, so it never happens.', 'Be specific.',
     'Say: if it’s seven a.m., then I put on my shoes. Same time, same place.', 'A clear plan beats a vague wish.'],
 heads=['<div data-max="140">“I’LL WORK OUT MORE.”</div><div data-max="140">YOU SAY IT <i class="pk">EVERY</i> <i class="pk">WEEK.</i></div>',
        '<div data-max="130">BUT “MORE” IS NOT A PLAN.</div><div data-max="140">SO IT <i class="pk">NEVER</i> <i class="pk">HAPPENS.</i></div>',
        '<div data-max="170"><i class="cy">BE</i> <i class="cy">SPECIFIC.</i></div>',
        '<div data-max="130">“IF IT’S 7 A.M.,</div><div data-max="130">THEN I <i class="cy">PUT</i> <i class="cy">ON</i> <i class="cy">MY</i> <i class="cy">SHOES.</i>”</div>',
        '<div data-max="140">A CLEAR PLAN BEATS</div>', '<div data-max="160"><i class="or">A</i> <i class="or">VAGUE</i> <i class="or">WISH.</i></div>'],
 keys=dict(h1=('hook', 1.6), pk=('prob', 2.1), f1=('fix', .5), f2=('fix', 2.5)),
 h1sfx='uhoh', sfx=[('hook', .3, 'pop', -14), ('prob', .3, 'pop', -14), ('prob', .7, 'pop', -14), ('prob', 1.1, 'pop', -14), ('fix', .5, 'chime_up', -13), ('fix', 1.5, 'whoosh_short', -12)],
 js=r'''
const hookTL = S.ninja.timeline([[0, 'point', { ang: -30 }], [.9, 'proud', {}, .15], [K.h1, 'shrug', {}, .15]]);
function drawHook(ctx, t) { S.calPage(ctx, 800, 1060, .6 * oBack(seg(t, .2, .5), 2), 'MORE?', { rot: 6, col: '#ff6fae' });
  D(ctx, nin(t, hookTL(t), { x: 440, y: 1500, s: 1 })); }
const probTL = S.ninja.timeline([[A.prob, 'sitBack'], [A.prob + 1.0, 'slump', {}, .2], [K.pk, 'facepalm', {}, .12]]);
function drawProb(ctx, t) { ['MON', 'TUE', 'WED', 'THU'].forEach((w, i) => { const a = A.prob + .3 + i * .3, k = oBack(seg(t, a, a + .2), 2); if (k <= 0) return;
    S.calPage(ctx, 620 + (i % 2) * 190, 980 + Math.floor(i / 2) * 190, .4 * k, w, { rot: (i - 1.5) * 5, op: .55 }); });
  D(ctx, nin(t, probTL(t), { x: 330, y: 1500, s: 1 })); }
const fixTL = S.ninja.timeline([[A.fix, 'point', { ang: -30 }], [K.f1 + 1.0, 'run', {}, .12], [K.f2, 'cheer', {}, .12]]);
const fixTr = S.track([[A.fix, 330, 1500, 1, 0], [K.f1 + 1.0, 330, 1500, 1, 0], [K.f2, 600, 1500, 1, 0]]);
function drawFix(ctx, t) { S.wallClock(ctx, 800, 1000, 1.0, t, { speed: 0 });
  S.calPage(ctx, 960, 1180, .4 * oBack(seg(t, K.f1, K.f1 + .3), 2), '7:00', { rot: 6, col: '#3ee6ff' });
  D(ctx, nin(t, fixTL(t), Object.assign({ vx: t > K.f1 + 1 && t < K.f2 ? 300 : 0 }, fixTr(t))));
  S.check(ctx, 960, 1180, .5, seg(t, K.f2, K.f2 + .35));
  S.sparks(ctx, t, K.f2, 960, 1150, { n: 12, seed: 14, speed: 500, dir: -Math.PI / 2, spread: 2.4, life: .4, g: 900 }); }
''')
