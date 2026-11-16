P = dict(ninout=-.1, title='Subscription Check', cut='AUTO-RENEW', cutsize=120,
 envs=["S.env(stage, 'bedroom')", "S.env(stage, 'kitchen')", "S.env(stage, 'library', { day: true })"],
 vo=['Still paying for subscriptions you never use?', 'Streaming, the gym, that free trial. They renew every month.', 'Gotcha.',
     'List every subscription today. Cancel the ones you didn’t use last month.', 'Pay only for what you use.'],
 heads=['<div data-max="130">STILL PAYING FOR STUFF</div><div data-max="140">YOU <i class="pk">NEVER</i> <i class="pk">USE?</i></div>',
        '<div data-max="130">STREAMING. GYM. FREE TRIAL.</div><div data-max="140">THEY RENEW <i class="pk">EVERY</i> <i class="pk">MONTH.</i></div>',
        '<div data-max="180"><i class="cy">GOTCHA.</i></div>',
        '<div data-max="120">LIST EVERY SUBSCRIPTION.</div><div data-max="130"><i class="cy">CANCEL</i> WHAT YOU DIDN’T USE.</div>',
        '<div data-max="150">PAY ONLY FOR</div>', '<div data-max="160"><i class="or">WHAT</i> <i class="or">YOU</i> <i class="or">USE.</i></div>'],
 keys=dict(h1=('hook', 1.5), pk=('prob', 2.4), f1=('fix', .6), f2=('fix', 2.3)),
 h1sfx='uhoh', sfx=[('hook', .9, 'impact_soft', -14), ('prob', .3, 'pop', -14), ('prob', .9, 'pop', -14), ('prob', 1.5, 'pop', -14), ('fix', 1.2, 'ui_tap', -15), ('fix', 1.7, 'ui_tap', -15)],
 js=r'''
const hookTL = S.ninja.timeline([[0, 'reach', { x: 170, y: -90, face: 'n' }], [.9, 'look', {}, .15], [K.h1, 'shrug', {}, .12]]);
function coins(ctx, t, a, x, y) { for (let i = 0; i < 4; i++) { const u = t - a - i * .12; if (u < 0 || u > .9) continue;
  const cx = x + (i - 1.5) * 26 + 60 * u, cy = y + 20 + 500 * u * u; ctx.fillStyle = '#ffd25e'; ctx.strokeStyle = '#a8740f'; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(cx, cy, 16, 16 * Math.abs(Math.cos(u * 9 + i)) + 3, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); } }
function drawHook(ctx, t) { ctx.lineCap = 'round'; ctx.lineJoin = 'round'; S.mail(ctx, 720, 1180, .9 * oBack(seg(t, .2, .5), 2), 8); coins(ctx, t, .7, 720, 1180);
  D(ctx, nin(t, hookTL(t), { x: 440, y: 1500, s: 1 })); }
const probTL = S.ninja.timeline([[A.prob, 'look'], [A.prob + 1.4, 'shrug', {}, .15], [K.pk, 'facepalm', {}, .12]]);
function drawProb(ctx, t) { ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  [.3, .9, 1.5].forEach((o, i) => { const k = oBack(seg(t, A.prob + o, A.prob + o + .25), 2); if (k <= 0) return; const x = 620 + i * 160, y = 1210;
    S.calPage(ctx, x, y - 60, .38 * k, ['TV', 'GYM', 'TRIAL'][i], { rot: (i - 1) * 6, col: '#ff6fae' }); coins(ctx, t, A.prob + o + .2, x, y); });
  D(ctx, nin(t, probTL(t), { x: 330, y: 1500, s: 1 })); }
const fixTL = S.ninja.timeline([[A.fix, 'type', { face: 'f', dx: 130, dy: -236 }], [K.f2, 'cheer', {}, .12]]);
function drawFix(ctx, t) { ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.fillStyle = '#2a2f55'; ctx.fillRect(640, 1262, 380, 20); ctx.fillRect(660, 1282, 20, 218); ctx.fillRect(980, 1282, 20, 218);
  const k = oBack(seg(t, A.fix + .1, K.f1), 2);
  if (k > 0) { ctx.save(); ctx.translate(820, 1250); ctx.scale(k, k); ctx.rotate(-.04); ctx.fillStyle = '#fff6e8'; ctx.beginPath(); ctx.roundRect(-150, -260, 300, 250, 12); ctx.fill();
    ctx.fillStyle = '#ffb36b'; ctx.fillRect(-150, -260, 300, 34); ctx.lineCap = 'round';
    for (let i = 0; i < 5; i++) { const y = -195 + i * 38; ctx.strokeStyle = '#141b3a'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-110, y); ctx.lineTo(60, y); ctx.stroke();
      if (i % 2 === 0) { const p = seg(t, K.f1 + i * .25, K.f1 + i * .25 + .25); if (p > 0) { ctx.strokeStyle = '#ff4f8b'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-120, y); ctx.lineTo(-120 + 200 * p, y); ctx.stroke(); } }
      else { ctx.fillStyle = '#3ee6ff'; ctx.beginPath(); ctx.arc(100, y, 9 * seg(t, K.f1 + i * .25, K.f1 + i * .25 + .2), 0, Math.PI * 2); ctx.fill(); } }
    ctx.restore(); }
  D(ctx, nin(t, fixTL(t), { x: 560, y: 1500, s: 1 }));
  S.check(ctx, 960, 980, .6, seg(t, K.f2, K.f2 + .35));
  S.sparks(ctx, t, K.f2, 960, 980, { n: 12, seed: 14, speed: 500, dir: -Math.PI / 2, spread: 2.4, life: .4, g: 900 }); }
''')
