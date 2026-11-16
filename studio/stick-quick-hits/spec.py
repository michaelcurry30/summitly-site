P = dict(ninout=-.1, title='Quick Hits vs Real Focus', cut='QUICK HITS', cutsize=125,
 envs=["S.env(stage, 'library', { day: true })", "S.env(stage, 'kitchen')", "S.env(stage, 'bedroom')"],
 vo=['Why does homework feel so boring?', 'Scrolling, games, snacks. Quick fun all day long.', 'Too easy.',
     'Swap one quick hit for a slow one. A walk. A book. A real task.', 'Less cheap fun. More real focus.'],
 heads=['<div data-max="140">WHY DOES HOMEWORK</div><div data-max="140">FEEL SO <i class="pk">BORING?</i></div>',
        '<div data-max="130">SCROLLING. GAMES. SNACKS.</div><div data-max="140">QUICK FUN <i class="pk">ALL</i> <i class="pk">DAY.</i></div>',
        '<div data-max="180"><i class="cy">TOO</i> <i class="cy">EASY.</i></div>',
        '<div data-max="130">SWAP ONE QUICK HIT</div><div data-max="140">FOR A <i class="cy">WALK,</i> A <i class="cy">BOOK,</i> A <i class="cy">REAL</i> TASK.</div>',
        '<div data-max="140">LESS CHEAP FUN.</div>', '<div data-max="160"><i class="or">MORE</i> <i class="or">REAL</i> <i class="or">FOCUS.</i></div>'],
 keys=dict(h1=('hook', 1.3), pk=('prob', 2.2), f1=('fix', .5), f2=('fix', 2.5)),
 h1sfx='uhoh', sfx=[('prob', .3, 'pop', -14), ('prob', .8, 'pop', -14), ('prob', 1.3, 'pop', -14), ('fix', .5, 'pop', -13), ('fix', 1.2, 'pop', -13)],
 js=r'''
const hookTL = S.ninja.timeline([[0, 'read'], [K.h1, 'slump', {}, .2]]);
function drawHook(ctx, t) { D(ctx, nin(t, hookTL(t), { x: 470, y: 1500, s: 1, face: t > K.h1 ? 'x' : 'd' }));
  S.qmark(ctx, 640, 1020 - 40 * oBack(seg(t, K.h1, K.h1 + .4), 2), 1, seg(t, K.h1, K.h1 + .3)); }
const probTL = S.ninja.timeline([[A.prob, 'scroll', { swipes: [.3, .6] }], [A.prob + 1.2, 'eat', {}, .15], [K.pk, 'slump', {}, .12]]);
function drawProb(ctx, t) {
  [.3, .8, 1.3].forEach((o, i) => { const k = oBack(seg(t, A.prob + o, A.prob + o + .25), 2); if (k <= 0) return; const x = 640 + i * 150, y = 1230;
    if (i === 0) S.phone(ctx, x, y - 20, .8 * k, -8, { glow: .8 }); else if (i === 1) S.note(ctx, x, y - 40, .5 * k, 8, '', { col: '#9ee7ff' }); else S.chips(ctx, x, y, .9 * k, -12); });
  D(ctx, nin(t, probTL(t), { x: 330, y: 1500, s: 1 })); }
const fixTL = S.ninja.timeline([[A.fix, 'walk'], [A.fix + 1.2, 'read', {}, .2], [K.f2, 'cheer', {}, .15]]);
const fixTr = S.track([[A.fix, 250, 1500, 1, 0], [A.fix + 1.2, 470, 1500, 1, 0]]);
function drawFix(ctx, t) { glow(ctx, 520, 1250, 260, 'rgba(62,230,255,A)', .3 + .4 * seg(t, K.f1, K.f2));
  S.book(ctx, 820, 1100, .9 * oBack(seg(t, K.f1, K.f1 + .3), 2), -8, { open: seg(t, A.fix + 1.2, A.fix + 1.6) });
  D(ctx, nin(t, fixTL(t), Object.assign({ vx: t < A.fix + 1.2 ? 180 : 0 }, fixTr(t))));
  S.sparks(ctx, t, K.f2, 820, 1060, { n: 12, seed: 14, speed: 500, dir: -Math.PI / 2, spread: 2.4, life: .4, g: 900 }); }
''')
