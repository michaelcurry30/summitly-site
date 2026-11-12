P = dict(title='Track Every Dollar', ec='c', cut='LEAKS', cutsize=170,
 envs=["S.env(stage, 'bedroom')", "S.env(stage, 'kitchen')", "S.env(stage, 'library', { day: true })"],
 heads=['<div data-max="130">PAYDAY WAS LAST WEEK.</div><div data-max="140">WHERE DID IT <i class="pk">ALL</i> <i class="pk">GO?</i></div>',
        '<div data-max="130">COFFEE. SNACKS. SUBSCRIPTIONS.</div><div data-max="150">LITTLE <i class="pk">LEAKS.</i></div>',
        '<div data-max="180"><i class="cy">GOT</i> <i class="cy">YOU.</i></div>',
        '<div data-max="120">WRITE DOWN EVERY DOLLAR</div><div data-max="130">FOR ONE WEEK. <i class="cy">THEN</i> <i class="cy">DECIDE.</i></div>',
        '<div data-max="150">TRACK IT, THEN</div>', '<div data-max="160"><i class="or">YOU</i> <i class="or">CONTROL</i> <i class="or">IT.</i></div>'],
 keys=dict(h1=('hook', 1.6), pk=('prob', 2.2), f1=('fix', .6), f2=('fix', 2.2)),
 h1sfx='uhoh', sfx=[('hook', 1.0, 'impact_soft', -14), ('prob', .3, 'pop', -14), ('prob', .9, 'pop', -14), ('prob', 1.5, 'pop', -14), ('fix', 1.2, 'ui_tap', -15), ('fix', 1.6, 'ui_tap', -15)],
 js=r'''
const hookTL = S.ninja.timeline([[0, 'reach', { x: 170, y: -90, face: 'n' }], [1.0, 'look', {}, .15], [K.h1, 'shrug', {}, .12]]);
function drawHook(ctx, t) { S.box(ctx, 640, 1500, .9, seg(t, .3, .9)); S.qmark(ctx, 650, 1300 - 40 * oBack(seg(t, .9, 1.3), 2), 1.1, seg(t, .9, 1.2));
  D(ctx, nin(t, hookTL(t), { x: 440, y: 1500, s: 1 })); }
const probTL = S.ninja.timeline([[A.prob, 'look'], [A.prob + 1.2, 'eat', {}, .15], [K.pk, 'facepalm', {}, .12]]);
function coins(ctx, t, a, x, y) { for (let i = 0; i < 4; i++) { const u = t - a - i * .12; if (u < 0 || u > .9) continue;
  const cx = x + (i - 1.5) * 26 + 60 * u, cy = y + 20 + 500 * u * u; ctx.fillStyle = '#ffd25e'; ctx.strokeStyle = '#a8740f'; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(cx, cy, 16, 16 * Math.abs(Math.cos(u * 9 + i)) + 3, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); } }
function drawProb(ctx, t) {
  [.3, .9, 1.5].forEach((o, i) => { const k = oBack(seg(t, A.prob + o, A.prob + o + .25), 2); if (k <= 0) return; const x = 620 + i * 160, y = 1230;
    if (i === 0) S.mug(ctx, x, y + 20, .9 * k); else if (i === 1) S.chips(ctx, x, y, .9 * k, -12); else S.mail(ctx, x, y - 10, .9 * k, 10);
    coins(ctx, t, A.prob + o + .2, x, y); });
  D(ctx, nin(t, probTL(t), { x: 330, y: 1500, s: 1 })); }
const fixTL = S.ninja.timeline([[A.fix, 'type', { face: 'f', dx: 130, dy: -236 }], [K.f2, 'cheer', {}, .12]]);
function drawFix(ctx, t) {
  ctx.fillStyle = '#2a2f55'; ctx.fillRect(640, 1262, 380, 20); ctx.fillRect(660, 1282, 20, 218); ctx.fillRect(980, 1282, 20, 218);
  const k = oBack(seg(t, A.fix + .1, K.f1), 2);
  if (k > 0) { ctx.save(); ctx.translate(820, 1250); ctx.scale(k, k); ctx.rotate(-.04); ctx.fillStyle = '#fff6e8'; ctx.beginPath(); ctx.roundRect(-150, -260, 300, 250, 12); ctx.fill();
    ctx.fillStyle = '#ffb36b'; ctx.fillRect(-150, -260, 300, 34); ctx.strokeStyle = '#c9bfae'; ctx.lineWidth = 4;
    const n = Math.floor(6 * seg(t, K.f1, K.f2)); for (let i = 0; i < 6; i++) { const y = -200 + i * 30; ctx.beginPath(); ctx.moveTo(-120, y); ctx.lineTo(120, y); ctx.stroke();
      if (i < n) { ctx.strokeStyle = '#141b3a'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-110, y - 8); ctx.lineTo(-110 + 150 * hash(i * 3.1) + 40, y - 8); ctx.stroke(); ctx.fillStyle = '#ffb36b'; ctx.beginPath(); ctx.arc(100, y - 8, 7, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#c9bfae'; ctx.lineWidth = 4; } }
    ctx.restore(); }
  D(ctx, nin(t, fixTL(t), { x: 560, y: 1500, s: 1 }));
  S.check(ctx, 960, 980, .6, seg(t, K.f2, K.f2 + .35));
  S.sparks(ctx, t, K.f2, 960, 980, { n: 12, seed: 14, speed: 500, dir: -Math.PI / 2, spread: 2.4, life: .4, g: 900 }); }
''')
