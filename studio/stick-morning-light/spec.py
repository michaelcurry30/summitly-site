P = dict(ninout=-.1, title='Morning Light', cut='SNOOZE', cutsize=170,
 envs=["S.env(stage, 'bedroom')", "S.env(stage, 'hall')", "S.env(stage, 'mountain')"],
 envOpt4="t => ({ rise: .2 + .7 * io(seg(t, A.fix, A.pay)) })",
 vo=['You wake up groggy, and the first thing you grab is your phone.', 'Dim room. Bright screen. Still half asleep.', 'Up.',
     'Step outside for a few minutes of morning light. Take a short walk if you can.', 'Light first. Phone later.'],
 heads=['<div data-max="130">YOU WAKE UP GROGGY</div><div data-max="140">AND GRAB YOUR <i class="pk">PHONE.</i></div>',
        '<div data-max="130">DIM ROOM. BRIGHT SCREEN.</div><div data-max="140">STILL <i class="pk">HALF</i> <i class="pk">ASLEEP.</i></div>',
        '<div data-max="200"><i class="cy">UP.</i></div>',
        '<div data-max="130">STEP OUTSIDE FOR A FEW</div><div data-max="140">MINUTES OF <i class="cy">MORNING</i> <i class="cy">LIGHT.</i></div>',
        '<div data-max="150">LIGHT FIRST.</div>', '<div data-max="160"><i class="or">PHONE</i> <i class="or">LATER.</i></div>'],
 keys=dict(h1=('hook', 1.6), pk=('prob', 1.9), f1=('fix', .6), f2=('fix', 2.4)),
 h1sfx='notif_ding', sfx=[('hook', .5, 'impact_soft', -14), ('prob', .4, 'ui_tap', -15), ('prob', .8, 'ui_tap', -15), ('fix', .3, 'whoosh_short', -11), ('fix', 1.4, 'chime_up', -13)],
 js=r'''
const hookTL = S.ninja.timeline([[0, 'flat'], [1.0, 'sitBack', {}, .25], [K.h1, 'scroll', { swipes: [.2, .5] }, .15]]);
function drawHook(ctx, t) { if (t < K.h1) { S.phone(ctx, 760, 1460, .7, 90, { glow: .8 }); S.buzz(ctx, 760, 1460, t, 1); }
  D(ctx, nin(t, hookTL(t), { x: 440, y: 1500, s: 1, face: t > K.h1 ? 'g' : 'x' })); }
const probTL = S.ninja.timeline([[A.prob, 'scroll', { swipes: [.3, .7, 1.1] }], [K.pk, 'slump', {}, .15]]);
function drawProb(ctx, t) { glow(ctx, 470, 1150, 200, 'rgba(138,92,255,A)', .9);
  D(ctx, nin(t, probTL(t), { x: 430, y: 1500, s: 1, face: 'g' })); S.qmark(ctx, 600, 1020, .9, seg(t, K.pk, K.pk + .3)); }
const fixTL = S.ninja.timeline([[A.fix, 'walk'], [K.f2, 'stretch', {}, .25]]);
const fixTr = S.track([[A.fix, 200, 1500, 1, 0], [K.f2, 520, 1500, 1, 0]]);
function drawFix(ctx, t) { glow(ctx, 760, 1050, 360, 'rgba(255,179,107,A)', .3 + .6 * seg(t, A.fix, K.f2));
  D(ctx, nin(t, fixTL(t), Object.assign({ vx: t < K.f2 ? 160 : 0 }, fixTr(t))));
  S.sparks(ctx, t, K.f2, 540, 1100, { n: 12, seed: 14, speed: 500, dir: -Math.PI / 2, spread: 2.4, life: .4, g: 900, cols: ['#fff', '#ffb36b'] }); }
''')
