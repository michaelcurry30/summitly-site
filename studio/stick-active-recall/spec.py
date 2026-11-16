P = dict(ninout=-.1, title='Test Yourself', cut='REREAD', cutsize=170,
 envs=["S.env(stage, 'library', { day: true })", "S.env(stage, 'bedroom')", "S.env(stage, 'hall')"],
 vo=['You read your notes five times, then blank on the test.', 'Rereading feels easy. That’s the trap.', 'Not again.',
     'Close the book. Write down everything you remember. Then check what you missed.', 'Test yourself. Don’t just reread.'],
 heads=['<div data-max="130">YOU READ YOUR NOTES 5 TIMES,</div><div data-max="140">THEN <i class="pk">BLANK</i> ON THE TEST.</div>',
        '<div data-max="130">REREADING FEELS EASY.</div><div data-max="150">THAT’S THE <i class="pk">TRAP.</i></div>',
        '<div data-max="180"><i class="cy">NOT</i> <i class="cy">AGAIN.</i></div>',
        '<div data-max="120">CLOSE THE BOOK. WRITE WHAT</div><div data-max="130">YOU <i class="cy">REMEMBER.</i> THEN <i class="cy">CHECK.</i></div>',
        '<div data-max="150">TEST YOURSELF.</div>', '<div data-max="160"><i class="or">DON’T</i> <i class="or">JUST</i> <i class="or">REREAD.</i></div>'],
 keys=dict(h1=('hook', 1.8), pk=('prob', 1.7), f1=('fix', .5), f2=('fix', 2.6)),
 h1sfx='uhoh', sfx=[('hook', .4, 'rustle', -14) if False else ('hook', .4, 'pop', -15), ('prob', .4, 'pop', -14), ('fix', .3, 'impact_soft', -12), ('fix', 1.2, 'ui_tap', -15), ('fix', 1.6, 'ui_tap', -15)],
 js=r'''
const hookTL = S.ninja.timeline([[0, 'read'], [K.h1, 'shrug', {}, .15]]);
function drawHook(ctx, t) { const k = oBack(seg(t, K.h1 - .2, K.h1 + .1), 2);
  if (k > 0) { S.calPage(ctx, 800, 1050, .6 * k, 'TEST', { rot: 6, col: '#ff6fae' }); S.qmark(ctx, 810, 1080, .8, seg(t, K.h1 + .1, K.h1 + .3)); }
  D(ctx, nin(t, hookTL(t), { x: 440, y: 1500, s: 1 })); }
const probTL = S.ninja.timeline([[A.prob, 'read'], [K.pk, 'slump', {}, .15]]);
function drawProb(ctx, t) { for (let i = 0; i < 3; i++) { const a = A.prob + .2 + i * .4, k = oBack(seg(t, a, a + .25), 2); if (k > 0) S.note(ctx, 660 + i * 130, 1040 + (i % 2) * 60, .5 * k, (i - 1) * 9, '', { col: '#ffe36b' }); }
  D(ctx, nin(t, probTL(t), { x: 380, y: 1500, s: 1, face: 'g' })); }
const fixTL = S.ninja.timeline([[A.fix, 'throw'], [A.fix + .6, 'type', { face: 'f', dx: 130, dy: -236 }, .15], [K.f2, 'cheer', {}, .12]]);
function drawFix(ctx, t) {
  ctx.fillStyle = '#2a2f55'; ctx.fillRect(640, 1262, 380, 20); ctx.fillRect(660, 1282, 20, 218); ctx.fillRect(980, 1282, 20, 218);
  S.book(ctx, 900, 1240, .6, 4, { open: 1 - seg(t, A.fix + .1, A.fix + .4) });
  const k = oBack(seg(t, A.fix + .5, K.f1 + .4), 2);
  if (k > 0) { ctx.save(); ctx.translate(780, 1240); ctx.scale(k, k); ctx.fillStyle = '#fff6e8'; ctx.beginPath(); ctx.roundRect(-110, -230, 220, 220, 12); ctx.fill();
    ctx.lineCap = 'round'; const n = Math.floor(5 * seg(t, K.f1 + .2, K.f2)); for (let i = 0; i < 5; i++) { const y = -195 + i * 38;
      ctx.strokeStyle = i < n ? '#141b3a' : '#d8cfbf'; ctx.lineWidth = i < n ? 6 : 4; ctx.beginPath(); ctx.moveTo(-85, y); ctx.lineTo(-85 + (i < n ? 120 + 40 * hash(i * 2.3) : 170), y); ctx.stroke(); }
    ctx.restore(); }
  D(ctx, nin(t, fixTL(t), { x: 520, y: 1500, s: 1 }));
  S.check(ctx, 900, 1000, .55, seg(t, K.f2, K.f2 + .35));
  S.sparks(ctx, t, K.f2, 900, 1000, { n: 12, seed: 14, speed: 500, dir: -Math.PI / 2, spread: 2.4, life: .4, g: 900 }); }
''')
