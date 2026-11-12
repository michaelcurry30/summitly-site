P = dict(title='Boredom Builds Focus', ec='e', cut='SCROLL', cutsize=130,
 envs=["S.env(stage, 'bedroom')", "S.env(stage, 'feed')", "S.env(stage, 'library', { day: true })"],
 envOpt2="t => ({ scroll: 900 * (t - A.prob) + 600 * (t - A.prob) * (t - A.prob) })",
 heads=['<div data-max="130">SCROLLED FOR AN HOUR?</div><div data-max="130">NOW YOU CAN’T READ <i class="pk">ONE</i> <i class="pk">PAGE?</i></div>',
        '<div data-max="120">YOUR BRAIN GOT USED TO</div><div data-max="120"><i class="or">SOMETHING</i> <i class="or">NEW</i> EVERY FEW SECONDS.</div>',
        '<div data-max="180"><i class="cy">RESET.</i></div>',
        '<div data-max="130">PUT IT DOWN. LET IT BE</div><div data-max="140"><i class="cy">BORING</i> FOR A FEW MINUTES.</div>',
        '<div data-max="150">BOREDOM BUILDS</div>', '<div data-max="170"><i class="or">FOCUS.</i></div>'],
 keys=dict(h1=('hook', 2.1), pk=('prob', 2.1), f1=('fix', .7), f2=('fix', 2.0)),
 h1sfx='uhoh', sfx=[('hook', .4, 'ui_tap', -16), ('hook', .75, 'ui_tap', -16), ('hook', 1.1, 'ui_tap', -16), ('prob', .4, 'pop', -14), ('prob', .9, 'pop', -14), ('prob', 1.4, 'notif_ding', -14), ('fix', .7, 'impact_soft', -12)],
 js=r'''
const hookTL = S.ninja.timeline([[0, 'scroll', { swipes: [.05, .4, .75, 1.1] }], [1.5, 'read', {}, .15], [K.h1, 'slump', {}, .12]]);
function drawHook(ctx, t) { S.laptop(ctx, 820, 1262, 1, { on: false, lines: 0 });
  D(ctx, nin(t, hookTL(t), { x: 420, y: 1500, s: 1, face: t < 1.5 ? 'g' : (t < K.h1 ? 'd' : 'x') }));
  S.sparks(ctx, t, K.h1, 440, 1060, { n: 8, seed: 3, speed: 300, dir: -Math.PI / 2, spread: 2, life: .3, g: 900 }); }
const probTL = S.ninja.timeline([[A.prob, 'idle', { }], [A.prob + 1.0, 'look', {}, .15], [K.pk, 'facepalm', {}, .12]]);
function drawProb(ctx, t) {
  const u = t - A.prob; S.goblin.draw(ctx, { x: 780, y: 1500 - 30 * Math.abs(Math.sin(u * 7)), s: 1.1, t, face: 'grin', fx: -1, squash: .2 * Math.max(0, Math.sin(u * 7)) });
  D(ctx, nin(t, probTL(t), { x: 330, y: 1500, s: 1, face: 'x' })); }
const fixTL = S.ninja.timeline([[A.fix, 'reach', { x: 200, y: -60, face: 'f' }], [K.f1 + .1, 'chin', { face: 'd' }, .2], [K.f2, 'read', { sit: true, face: 'f' }, .2]]);
function drawFix(ctx, t) {
  glow(ctx, 520, 1250, 260, 'rgba(62,230,255,A)', .7 * seg(t, K.f2, K.f2 + .6));
  ctx.fillStyle = '#2a2f55'; ctx.fillRect(400, 1390, 150, 18); ctx.fillRect(420, 1408, 16, 92); ctx.fillRect(514, 1408, 16, 92);
  if (t < K.f1) S.phone(ctx, lerp(640, 760, seg(t, A.fix + .1, K.f1 - .1)), lerp(1250, 1440, seg(t, A.fix + .1, K.f1 - .1)), .6, 90 * seg(t, A.fix + .1, K.f1), {});
  S.box(ctx, 780, 1500, .9, 1 - seg(t, K.f1 - .1, K.f1 + .1));
  D(ctx, nin(t, fixTL(t), { x: 470, y: 1500, s: 1 }));
  S.sparks(ctx, t, K.f1, 780, 1430, { n: 10, seed: 13, speed: 400, dir: -Math.PI / 2, spread: 2.4, life: .35, g: 900 });
  S.sparks(ctx, t, K.f2, 560, 1150, { n: 12, seed: 14, speed: 500, dir: -Math.PI / 2, spread: 2.4, life: .4, g: 900 }); }
''')
