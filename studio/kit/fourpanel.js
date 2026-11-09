/* fourpanel.js — FOUR-PANEL split-screen kit (channel "animatedstickhabit"), global `FourPanel`.
 * Load AFTER kit/stick.js. Additive: it only reads Stick and registers extra q* poses in Stick.ninja.POSE
 * (names that stick.js does not use), so no other project changes. Rules: mv/FOURPANEL_BIBLE.md.
 *
 *   const FP = FourPanel.create({ labels, hook, lesson, cta, T, s });
 *   function seek(t) { FP.frame(t, { glow: (i, t) => G, draw: (ctx, i, t, q) => {...}, shake: (i, t) => px, flash: (i, t) => 0..1 }); }
 *   Stick.boot({ duration: T.dur, fps: 30, seek, ready: FP.ready });
 *
 * Layout (1080x1920, fills the whole frame):
 *   hook band  y 168–333 (two lines, fitted to 940 px)    CTA pill (end) y 196–290, same band
 *   grid       2x2 panels, x 20–534 / 546–1060, y 340–1104 / 1116–1880 (514 x 764, radius 26)
 *   floor      q.fl = q.y0 + 700          figure x  q.fx = q.x0 + 96 (seated, desk to its right)
 *   labels     q.lx = q.x0 + 40, q.ly = q.y0 + 22 (BS 800 60 px, panel colour), badge right of each label
 *   lesson     full-width band y 884–1096 (over the grid centre / the bottom of the top row)
 */
(function () {
  const S = window.Stick; if (!S) throw new Error('fourpanel.js needs kit/stick.js first');
  const { seg, oC, iC, io, oBack, lerp, clamp, tri, hash } = S;
  const PI = Math.PI, TAU = 2 * PI;
  const COL = { yellow: '#ffd23f', blue: '#3fa9ff', red: '#ff3b4e', purple: '#b26bff' };
  const RGB = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16)).join(',');
  const G = { hookTop: 168, gridTop: 340, gridBot: 1880, gap: 12, x0: 20, x1: 1060, bandTop: 884, bandH: 212, ctaTop: 196, PW: 514, PH: 764 };
  const INK = '#12131c';

  // ---------------------------------------------------------------- extra poses (seated unless noted). Body units: s = 1
  const H0 = -172;
  const stand = (o = {}) => Object.assign({ hip: [0, H0], lean: .04, tilt: 0, hr: [22, -150], hl: [-12, -152], fr: [24, 0], fl: [-24, 0], tail: .3, face: 'n' }, o);
  const seat = o => Object.assign({ hip: [0, -104], lean: .2, tilt: .16, hr: [124, -238], hl: [98, -238], fr: [88, 0], fl: [70, 0], tail: .2, face: 'f', kneeUp: 1 }, o);
  const V2 = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
  const P = {
    /* typing at the desk: a.rate (taps/s·2π), a.face, a.lean, a.dy (hand height offset) */
    qType: (u, a) => { const r = a.rate || 17, b = Math.sin(u * 2.2), dy = a.dy || 0;
      return seat({ hip: [0, -104 + b], hr: [124, -238 + dy - 11 * Math.max(0, Math.sin(u * r))], hl: [98, -238 + dy - 11 * Math.max(0, Math.sin(u * r + 2))], face: a.face || 'f', lean: a.lean == null ? .2 : a.lean }); },
    /* writing with a pen (right hand scribbles), a.face */
    qWrite: (u, a) => { const b = Math.sin(u * 2.2), w = Math.sin(u * (a.rate || 26)), dy = a.dy || 0;
      return seat({ hip: [0, -104 + b], lean: .3, tilt: .3, hr: [132 + 10 * w, -222 + dy + 4 * Math.cos(u * 13)], hl: [100, -216 + dy], face: a.face || 'f' }); },
    /* stiff stare with trembling hands (fighting an urge); a.k0 start tension */
    qStare: (u, a) => { const k = clamp((a.k0 || 0) + u / 7.4), tr = Math.sin(u * 47) * 5 * k;
      return seat({ hip: [-8, -104], lean: -.06 - .04 * k, tilt: .22, hr: [72 + tr, -262 - tr], hl: [52 - tr, -250 + tr], face: 'd', elbowOut: 0 }); },
    /* lunge-grab toward a.x, a.y */
    qGrab: (u, a) => { const k = oC(seg(u, 0, .16));
      return seat({ hip: [lerp(-8, 14, k), -104], lean: lerp(-.06, .62, k), tilt: lerp(.2, .35, k), hr: [lerp(72, a.x || 300, k), lerp(-262, a.y || -262, k)], hl: [lerp(52, 230, k), lerp(-250, -240, k)], face: a.face || 's' }); },
    /* hunched scrolling a phone (glazed); a.d0 start droop, a.rate droop/s. J.phone = phone position */
    qScroll: (u, a) => { const d = clamp((a.d0 || 0) + u * (a.rate || .05)), b = Math.sin(u * 1.6);
      let fl = 0; for (let s = .5; s < 14; s += .95) fl = Math.max(fl, tri(u, s - .05, s + .18));
      const lean = .42 + .3 * d, hip = [0, -104];
      const shx = Math.sin(lean) * 108, shy = hip[1] - Math.cos(lean) * 108;
      const ph = [shx + 56 - 10 * d, shy + 74 + 2 * b + 10 * d];
      return seat({ hip, lean, tilt: .42 + .25 * d, hr: [ph[0] + 6, ph[1] - 12 * fl], hl: [ph[0] - 12, ph[1] + 8], face: a.face || 'g', phone: { x: ph[0] + 2, y: ph[1] - 6, r: -20 } }); },
    qPump: u => { const k = oBack(seg(u, 0, .22)), b = Math.abs(Math.sin(u * 9)) * (1 - seg(u, .4, .8));
      return seat({ hip: [0, -104 - 8 * b], lean: -.04, tilt: -.12, hr: [lerp(124, 46, k), lerp(-238, -392 - 10 * b, k)], hl: [lerp(98, 92, k), lerp(-238, -250, k)], face: 'h' }); },
    qUp: u => { const k = oBack(seg(u, 0, .25));
      return seat({ hip: [0, -104], lean: -.08, tilt: -.28, hr: [lerp(150, 92, k), lerp(-250, -350, k)], hl: [70, -250], face: 'd' }); },
    qSlam: u => { const k = iC(seg(u, 0, .14));
      return seat({ hip: [0, -104], lean: lerp(-.08, .45, k), tilt: lerp(-.28, .3, k), hr: [lerp(92, 290, k), lerp(-350, -246, k)], hl: [70, -250], face: 'd' }); },
    /* bored: chin on hand */
    qChin: (u, a) => { const b = Math.sin(u * 1.5);
      return { hip: [0, -104], lean: .3 + .015 * b, tilt: .1 + .03 * b, hr: [70, -246 + 2 * b], hl: [118, -236], fr: [88, 0], fl: [70, 0], tail: .1, face: a.face || 'w', kneeUp: 1 }; },
    /* asleep with the head down on folded arms (desk top ≈ -200) */
    qSleep: (u, a) => { const b = .5 - .5 * Math.cos(u * TAU / 2.4);
      return seat({ hip: [0, -104], lean: .34 + .03 * b, tilt: 1.1, hr: [112, -212], hl: [82, -210], face: 'z' }); },
    /* nodding off: head drops, snaps up (a.per seconds per nod) */
    qNod: (u, a) => { const per = a.per || 1.1, p = (u % per) / per, d = p < .8 ? io(p / .8) : 1 - oC((p - .8) / .2);
      return seat({ hip: [0, -104], lean: .22 + .14 * d, tilt: .16 + .9 * d, hr: [124, -232], hl: [98, -230], face: d > .5 ? 'z' : 'w' }); },
    /* panic, seated: hands on head, shaking */
    qPanicSit: u => { const j = Math.sin(u * 40) * 4;
      return seat({ hip: [j, -104], lean: -.12, tilt: -.1, hr: [60 + j, -330], hl: [8 + j, -326], face: 's', elbowOut: 1 }); },
    /* panic, standing: hands on head, jittering */
    qPanic: u => { const j = Math.sin(u * 40) * 5;
      return stand({ hip: [j, H0 + 6], lean: -.06, tilt: -.1, hr: [70 + j, -400], hl: [-40 + j, -398], fr: [40, 0], fl: [-40, 0], face: 's', elbowOut: 1, tail: .8 }); },
    /* crumple a page and toss it over the shoulder (a.per seconds per cycle) */
    qCrumple: (u, a) => { const per = a.per || 1.4, p = (u % per) / per;
      const sq = tri(p, .05, .35), th = io(seg(p, .45, .6)), back = io(seg(p, .7, 1));
      const hr = p < .45 ? V2([132, -222], [112, -270], sq) : V2(V2([112, -270], [-60, -330], th), [132, -222], back);
      return seat({ hip: [0, -104], lean: lerp(.3, -.05, th) + .35 * back * 0, tilt: .2 - .3 * th, hr, hl: p < .45 ? [100, -268] : [100, -216], face: p < .45 ? 'd' : 'w' }); },
    /* lean back relaxed, hands behind the head */
    qRelax: u => { const b = Math.sin(u * 2);
      return seat({ hip: [0, -104], lean: -.16, tilt: -.12, hr: [-20, -306 + b], hl: [-44, -300 + b], face: 'c', elbowOut: 1 }); },
    /* sit slumped on a couch (lower seat: feet forward), a.face */
    qCouch: (u, a) => { const b = Math.sin(u * 1.4);
      return { hip: [0, -84], lean: -.22 + .02 * b, tilt: .05, hr: [60, -120], hl: [34, -116], fr: [150, 0], fl: [130, 0], tail: .1, face: a.face || 'b', kneeUp: 1 }; },
    /* lying on the back (use with draw rotation 0; body along x), a.face; floor-level */
    qLie: (u, a) => { const b = .5 - .5 * Math.cos(u * TAU / 2.6);
      return { hip: [-80, -40], lean: 1.52 - .02 * b, tilt: .06, hr: [70, -10], hl: [40, -6], fr: [-250, -10], fl: [-260, -4], tail: .05, face: a.face || 'z', kneeBack: 1 }; },
    /* lying wrecked on the floor, limbs out */
    qWreck: (u, a) => { const tw = Math.sin(u * 20) * 3 * (1 - seg(u, 0, 1.5));
      return { hip: [-90, -34], lean: 1.5, tilt: .2, hr: [120 + tw, -60], hl: [140, 10], fr: [-260, -30], fl: [-250, 10], tail: .05, face: a.face || 'x', kneeBack: 1 }; },
    /* dumbbell curls (standing), a.rate */
    qCurl: (u, a) => { const r = a.rate || 7, c = .5 - .5 * Math.cos(u * r), c2 = .5 - .5 * Math.cos(u * r + PI);
      return stand({ hip: [0, H0 + 3 * c], lean: 0, hr: [44, lerp(-150, -300, c)], hl: [-30, lerp(-150, -300, c2)], fr: [40, 0], fl: [-40, 0], face: a.face || 'd', elbowOut: 0, tail: .5 }); },
    /* jumping jacks */
    qJack: (u, a) => { const r = a.rate || 9, c = .5 - .5 * Math.cos(u * r);
      return stand({ hip: [0, H0 - 22 * Math.sin(PI * c)], lean: 0, hr: V2([40, -160], [110, -420], c), hl: V2([-40, -160], [-110, -420], c), fr: [lerp(26, 90, c), -8 * Math.sin(PI * c)], fl: [lerp(-26, -90, c), -8 * Math.sin(PI * c)], face: a.face || 'd', front: 1, tail: .9 }); },
    /* limp walk / hobble (sore), a.face */
    qLimp: (u, a) => { const f = u / 1.3 * TAU, s = Math.sin(f);
      return stand({ hip: [0, H0 + 16 + 8 * Math.abs(s)], lean: .32, tilt: .3, fr: [s * 30, 0], fl: [-s * 30, 0], hr: [50, -110], hl: [30, -106], face: a.face || 'x', tail: .1 }); },
    /* two-minute mini habit: one push-up-ish squat (standing small rep) */
    qSquat: (u, a) => { const r = a.rate || 6, c = .5 - .5 * Math.cos(u * r);
      return stand({ hip: [-20 * c, H0 + 60 * c], lean: .25 * c, fr: [40, 0], fl: [-40, 0], hr: [lerp(30, 120, c), lerp(-180, -270, c)], hl: [lerp(-20, 100, c), lerp(-180, -262, c)], face: a.face || 'h', kneeUp: 0 }); },
    qFlex: u => { const k = oBack(seg(u, 0, .25)), p = .5 + .5 * Math.sin(u * 7);
      return stand({ hip: [0, H0 - 4 * p], lean: 0, tilt: -.05, hr: V2([30, -190], [78, -350 - 6 * p], k), hl: V2([-30, -192], [-78, -350 - 6 * p], k), fr: [44, 0], fl: [-40, 0], face: 'h', front: 1, elbowOut: 1 }); },
    qCross: u => { const b = Math.sin(u * 2.4);
      return stand({ hip: [0, H0 + 2 * b], lean: -.03, hr: [36, -186 + b], hl: [-36, -188 + b], fr: [44, 0], fl: [-40, 0], face: 'm', front: 1, elbowOut: 1 }); },
    /* standing, checking something off at hand height in front (a.x, a.y target) */
    qTick: (u, a) => { const per = a.per || 1, p = (u % per) / per, k = tri(p, .1, .45);
      return stand({ lean: .06, hr: [(a.x || 150) + 20 * k, (a.y || -300) + 26 * k], hl: [-20, -150], fr: [40, 0], fl: [-36, 0], face: a.face || 'h' }); },
    /* drinking from a can / mug held at the mouth (seated) */
    qDrink: (u, a) => { const k = io(seg(u, 0, .2)), g = Math.sin(u * 12) * 3 * seg(u, .2, .3);
      return seat({ hip: [0, -104], lean: lerp(.2, -.1, k), tilt: lerp(.16, -.45, k), hr: V2([124, -220], [58, -318 + g], k), hl: [98, -212], face: 'c' }); },
    /* jittery wide-eyed (too much caffeine), seated, typing frantic */
    qJitter: (u, a) => { const j = Math.round(Math.sin(u * 53) * 4);
      return seat({ hip: [j, -104], lean: .1, tilt: .05, hr: [130 + j, -214 - 8 * Math.max(0, Math.sin(u * 40))], hl: [104 - j, -214 - 8 * Math.max(0, Math.sin(u * 40 + 2))], face: 's' }); },
  };
  Object.keys(P).forEach(k => { if (!S.ninja.POSE[k]) S.ninja.POSE[k] = P[k]; });

  // ---------------------------------------------------------------- drawing helpers (canvas, pure)
  function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
  function poly(ctx, pts) { ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); }
  /* neon stick figure: white core, coloured outline, layered stroke glow (no blur). n = Stick.ninja.pose(...);
   * q = panel (q.col); Gl = glow strength (1 normal, <1 dim loser, >1 winner); o: {face, look, front, lit, dim, seed} */
  function neon(ctx, n, q, Gl, o = {}) {
    const sk = S.ninja.skel(n);
    ctx.save(); ctx.translate(n.x, n.y); if (n.r) ctx.rotate(n.r * PI / 180); ctx.scale(n.s * n.fx, n.s);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const parts = [sk.legB, sk.armB, [[sk.hip[0], sk.hip[1] + 4], sk.neck], sk.legF, sk.armF];
    const path = () => { ctx.beginPath(); parts.forEach(p => poly(ctx, p)); };
    const hc = sk.hc, HR = 40, X = Math.max(0, Gl - 1);
    [[56, .06], [42, .10], [32, .18]].forEach(([w, a]) => { ctx.globalAlpha = clamp(a * Gl); ctx.strokeStyle = q.col; ctx.lineWidth = w + 10 * X; path(); ctx.stroke();
      ctx.fillStyle = q.col; ctx.beginPath(); ctx.arc(hc[0], hc[1], HR + w / 2 - 6 + 6 * X, 0, TAU); ctx.fill(); });
    ctx.globalAlpha = 1;
    ctx.strokeStyle = q.col; ctx.lineWidth = 23; path(); ctx.stroke();
    ctx.strokeStyle = o.dim ? '#d9dbe6' : '#ffffff'; ctx.lineWidth = 14; path(); ctx.stroke();
    ctx.fillStyle = q.col; ctx.beginPath(); ctx.arc(hc[0], hc[1], HR + 5, 0, TAU); ctx.fill();
    ctx.fillStyle = o.lit ? '#e6fbff' : (o.dim ? '#e4e6ef' : '#ffffff'); ctx.beginPath(); ctx.arc(hc[0], hc[1], HR, 0, TAU); ctx.fill();
    if (o.lit) { const g = ctx.createLinearGradient(hc[0] + 40, 0, hc[0] - 40, 0); g.addColorStop(0, 'rgba(120,230,255,.55)'); g.addColorStop(1, 'rgba(120,230,255,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(hc[0], hc[1], HR, 0, TAU); ctx.fill(); }
    face(ctx, n, sk, o);
    ctx.restore();
    return { sk, hc: S.ninja.toWorld(n, sk.hc), hand: S.ninja.toWorld(n, sk.armF[2]), handB: S.ninja.toWorld(n, sk.armB[2]) };
  }
  /* faces: n h s d w g(glazed, phone-lit) c(calm closed) m(smug) x(wrecked X-eyes) z(asleep) b(bored half-lid) */
  function face(ctx, n, sk, o) {
    const J = n.J, f0 = o.face || J.face || 'n', front = o.front != null ? o.front : J.front;
    const blink = !['c', 'h', 'g', 'm', 'x', 'z'].includes(f0) && ((n.t + (o.seed || 0)) % 3.3) > 3.18;
    const f = blink ? 'blink' : f0, [lx, ly] = o.look || [0, 0];
    ctx.save(); ctx.translate(sk.hc[0], sk.hc[1]); ctx.rotate(sk.ht * (front ? .3 : 1));
    const cx = front ? 0 : 13, E = front ? [-14, 14] : [cx - 9, cx + 13], ey = -4;
    ctx.fillStyle = INK; ctx.strokeStyle = INK; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = 4.5;
    const dot = (x, r) => { ctx.beginPath(); ctx.arc(x + lx, ey + ly, r, 0, TAU); ctx.fill(); };
    const brow = (x, a, dy) => { ctx.save(); ctx.translate(x, ey - 12 + dy); ctx.rotate(a); ctx.beginPath(); ctx.moveTo(-8, 0); ctx.lineTo(8, 0); ctx.stroke(); ctx.restore(); };
    const mouth = fn => { ctx.beginPath(); fn(); ctx.stroke(); };
    const mx = front ? 0 : cx + 4, my = 15;
    if (f === 'h') { E.forEach(x => { ctx.beginPath(); ctx.arc(x, ey + 3, 6, PI * 1.1, PI * 1.9); ctx.stroke(); }); mouth(() => ctx.arc(mx, my - 6, 11, PI * .15, PI * .85));
      ctx.fillStyle = 'rgba(255,120,140,.45)'; ctx.beginPath(); ctx.arc(mx + (front ? -22 : 14), my - 4, 5, 0, TAU); ctx.arc(front ? mx + 22 : mx - 30, my - 4, 5, 0, TAU); ctx.fill(); }
    else if (f === 'c' || f === 'blink') { E.forEach(x => { ctx.beginPath(); if (f === 'c') ctx.arc(x, ey - 2, 6, PI * .15, PI * .85); else { ctx.moveTo(x - 5, ey); ctx.lineTo(x + 5, ey); } ctx.stroke(); });
      if (f === 'c') mouth(() => ctx.arc(mx, my - 8, 9, PI * .25, PI * .75)); else mouth(() => { ctx.moveTo(mx - 6, my); ctx.lineTo(mx + 7, my); }); }
    else if (f === 'z') { E.forEach(x => { ctx.beginPath(); ctx.moveTo(x - 6, ey + 1); ctx.lineTo(x + 6, ey + 1); ctx.stroke(); }); ctx.beginPath(); ctx.ellipse(mx, my + 1, 5, 6, 0, 0, TAU); ctx.fill(); }
    else if (f === 'x') { ctx.lineWidth = 4; E.forEach(x => { ctx.beginPath(); ctx.moveTo(x - 6, ey - 6); ctx.lineTo(x + 6, ey + 6); ctx.moveTo(x + 6, ey - 6); ctx.lineTo(x - 6, ey + 6); ctx.stroke(); });
      mouth(() => { ctx.moveTo(mx - 10, my + 3); ctx.quadraticCurveTo(mx - 5, my - 3, mx, my + 3); ctx.quadraticCurveTo(mx + 5, my + 8, mx + 10, my + 2); }); }
    else if (f === 'b') { E.forEach(x => { ctx.beginPath(); ctx.arc(x + lx, ey + 1, 5, 0, PI); ctx.fill(); ctx.beginPath(); ctx.moveTo(x - 7, ey); ctx.lineTo(x + 7, ey); ctx.stroke(); });
      mouth(() => { ctx.moveTo(mx - 8, my + 2); ctx.lineTo(mx + 8, my + 1); }); }
    else if (f === 'm') { E.forEach(x => { ctx.beginPath(); ctx.arc(x, ey, 5.5, 0, PI); ctx.fill(); ctx.beginPath(); ctx.moveTo(x - 7, ey - 1); ctx.lineTo(x + 7, ey - 1); ctx.stroke(); });
      mouth(() => { ctx.moveTo(mx - 10, my); ctx.quadraticCurveTo(mx + 2, my + 6, mx + 13, my - 5); }); }
    else if (f === 's') { E.forEach(x => { ctx.lineWidth = 3.5; ctx.beginPath(); ctx.arc(x, ey, 7, 0, TAU); ctx.stroke(); dot(x, 3); }); ctx.beginPath(); ctx.ellipse(mx, my + 2, 6, 8, 0, 0, TAU); ctx.fill(); }
    else if (f === 'g') { E.forEach(x => { ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(x, ey + 1, 6, 0, PI); ctx.fill(); ctx.fillStyle = '#3ee6ff'; ctx.fillRect(x - 2.5 + lx * .4, ey + 1, 5, 3.5);
        ctx.strokeStyle = INK; ctx.beginPath(); ctx.moveTo(x - 7, ey); ctx.lineTo(x + 7, ey); ctx.stroke(); });
      ctx.fillStyle = INK; ctx.beginPath(); ctx.ellipse(mx, my + 1, 5, 3.5, 0, 0, TAU); ctx.fill(); }
    else if (f === 'd') { E.forEach(x => dot(x, 4)); E.forEach((x, i) => brow(x, (i ? -1 : 1) * .5, 2));
      ctx.fillStyle = INK; rr(ctx, mx - 13, my - 5, 26, 12, 3); ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(mx - 11, my + 1); ctx.lineTo(mx + 11, my + 1);
      for (let i = -1; i <= 1; i++) { ctx.moveTo(mx + i * 6, my - 4); ctx.lineTo(mx + i * 6, my + 6); } ctx.stroke(); }
    else if (f === 'w') { E.forEach(x => dot(x, 4)); E.forEach((x, i) => brow(x, (i ? 1 : -1) * .45, -1));
      mouth(() => { ctx.moveTo(mx - 10, my + 2); ctx.quadraticCurveTo(mx - 5, my - 3, mx, my + 2); ctx.quadraticCurveTo(mx + 5, my + 7, mx + 10, my + 2); }); }
    else { E.forEach(x => dot(x, 4)); if (f === 'f') E.forEach(x => brow(x, 0, 2)); mouth(() => { ctx.moveTo(mx - 6, my); ctx.lineTo(mx + 7, my); }); }
    ctx.restore();
  }
  /* desk set in body units at (x, floor y) scaled by s: stool, desk (top at o.top, default -226), laptop (o.laptop !== false).
   * Returns world points: {top (desk-top y), x0, x1 (desk span), spot(u) -> x of a desk position u in body units} */
  function desk(ctx, q, x, y, s, o = {}) {
    const top = o.top == null ? -226 : o.top;
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineCap = 'butt'; ctx.lineJoin = 'miter';
    if (o.stool !== false) { ctx.fillStyle = '#262a3e'; rr(ctx, -46, -100, 92, 14, 6); ctx.fill(); ctx.fillRect(-34, -88, 10, 88); ctx.fillRect(24, -88, 10, 88); }
    ctx.fillStyle = '#2b3048'; rr(ctx, 70, top, 340, 16, 6); ctx.fill();
    ctx.fillStyle = `rgba(${q.rgb},.5)`; ctx.fillRect(74, top, 332, 3);
    ctx.fillStyle = '#1e2236'; ctx.fillRect(88, top + 16, 14, -top - 16); ctx.fillRect(370, top + 16, 14, -top - 16);
    if (o.laptop !== false) {
      ctx.fillStyle = '#3a4060'; rr(ctx, 110, top - 10, 120, 10, 3); ctx.fill();
      ctx.save(); ctx.translate(226, top - 8); ctx.rotate(-1.28); ctx.fillStyle = '#4a5278'; rr(ctx, 0, -5, 110, 10, 4); ctx.fill(); ctx.restore();
    }
    ctx.restore();
    return { top: y + top * s, spot: u => x + u * s };
  }
  function laptopGlow(ctx, q, x, y, s, k, top = -226) {
    if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.globalAlpha = .16 * k; ctx.fillStyle = q.col; ctx.beginPath(); ctx.moveTo(226, top - 104); ctx.lineTo(120, top - 74); ctx.lineTo(120, top - 14); ctx.lineTo(226, top - 14); ctx.fill();
    ctx.restore();
  }
  /* small phone; k = screen brightness 0..1, o.s size scale, o.held (no halo) */
  function phone(ctx, x, y, r, k, o = {}) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(r); const z = o.s || 1; ctx.scale(z, z); const w = 30, h = 52;
    if (k > 0 && !o.held) { ctx.globalAlpha = .28 * k; ctx.fillStyle = '#8fe9ff'; ctx.beginPath(); ctx.arc(0, 0, 46, 0, TAU); ctx.fill(); ctx.globalAlpha = 1; }
    ctx.fillStyle = '#0c0e18'; rr(ctx, -w / 2, -h / 2, w, h, 7); ctx.fill(); ctx.strokeStyle = '#8a90b0'; ctx.lineWidth = 2.5; ctx.stroke();
    const g = ctx.createLinearGradient(0, -h / 2, 0, h / 2); g.addColorStop(0, `rgba(120,230,255,${.25 + .75 * k})`); g.addColorStop(1, `rgba(255,92,138,${.2 + .7 * k})`);
    ctx.fillStyle = g; rr(ctx, -w / 2 + 4, -h / 2 + 5, w - 8, h - 10, 4); ctx.fill();
    ctx.restore();
  }
  function buzz(ctx, x, y, t, k, z = 1) {
    if (k <= 0) return; ctx.save(); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 4 * z; ctx.lineCap = 'round'; ctx.globalAlpha = clamp(k) * (.65 + .35 * Math.sin(t * 40));
    [-1, 1].forEach(sx => [0, 1].forEach(i => { const r = (36 + i * 15) * z; ctx.beginPath(); ctx.arc(x, y, r, sx > 0 ? -.55 : PI - .55, sx > 0 ? .55 : PI + .55); ctx.stroke(); }));
    ctx.restore();
  }
  /* notification bubble (icon + blank lines, no words); k = 0..1 life */
  function notif(ctx, x, y, k, col, z = 1) {
    if (k <= 0 || k >= 1) return; const e = oBack(seg(k, 0, .25)), a = 1 - seg(k, .7, 1);
    ctx.save(); ctx.translate(x, y - 40 * k * z); ctx.scale(e * z, e * z); ctx.globalAlpha = a;
    ctx.fillStyle = '#f2f4ff'; rr(ctx, -46, -18, 92, 36, 12); ctx.fill();
    ctx.fillStyle = col || '#ff5a8a'; ctx.beginPath(); ctx.arc(-26, 0, 10, 0, TAU); ctx.fill();
    ctx.fillStyle = '#b8bdd4'; ctx.fillRect(-10, -7, 44, 5); ctx.fillRect(-10, 3, 30, 5);
    ctx.restore();
  }
  function sweat(ctx, hc, t, k, seed = 0, z = 1) {
    if (k <= 0) return;
    for (let i = 0; i < 3; i++) { const p = ((t * 1.3 + i / 3 + seed) % 1); ctx.save(); ctx.globalAlpha = (1 - p) * k; ctx.fillStyle = '#9fe9ff';
      const sx = i % 2 ? 1 : -1; ctx.beginPath(); ctx.ellipse(hc[0] + sx * (30 + 26 * p) * z, hc[1] + (-26 - 20 * p + 90 * p * p) * z, 5 * z, 8 * z, 0, 0, TAU); ctx.fill(); ctx.restore(); }
  }
  function sparkle(ctx, x, y, r, col, a) { if (a <= 0) return; ctx.save(); ctx.translate(x, y); ctx.globalAlpha = clamp(a); ctx.fillStyle = col; ctx.beginPath();
    for (let k = 0; k < 8; k++) { const r2 = k % 2 ? r * .28 : r, b = k * PI / 4; ctx.lineTo(r2 * Math.cos(b), r2 * Math.sin(b)); } ctx.fill(); ctx.restore(); }
  /* ✗ / ✓ badge popping in (k 0..1) */
  function badge(ctx, x, y, k, ok, R = 36) {
    if (k <= 0) return; const e = oBack(seg(k, 0, 1), 2.4), z = R / 30;
    ctx.save(); ctx.translate(x, y); ctx.scale(e * z, e * z); ctx.rotate((1 - e) * .6);
    ctx.fillStyle = ok ? '#4dff9a' : '#ff3b4e'; ctx.beginPath(); ctx.arc(0, 0, 30, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#0b0c14'; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
    if (ok) { ctx.moveTo(-13, 1); ctx.lineTo(-4, 11); ctx.lineTo(14, -10); } else { ctx.moveTo(-11, -11); ctx.lineTo(11, 11); ctx.moveTo(11, -11); ctx.lineTo(-11, 11); }
    ctx.stroke(); ctx.restore();
  }
  /* green check that pops and floats (k 0..1 life) */
  function tick(ctx, x, y, k, z = 1, col = '#4dff9a') {
    if (k <= 0 || k >= 1) return; const e = oBack(seg(k, 0, .35), 2), a = 1 - seg(k, .7, 1);
    ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y - 30 * k * z); ctx.scale(e * z, e * z);
    ctx.strokeStyle = col; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(-16, 0); ctx.lineTo(-5, 12); ctx.lineTo(18, -14); ctx.stroke(); ctx.restore();
  }
  /* "Z z z" floating up (drawn shapes, not text) */
  function zzz(ctx, x, y, t, k, z = 1, col = '#cfd6ff') {
    if (k <= 0) return; ctx.save(); ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (let i = 0; i < 3; i++) { const p = ((t * .6 + i / 3) % 1), sz = (10 + 10 * p) * z;
      ctx.globalAlpha = k * Math.sin(PI * p); ctx.lineWidth = 4 * z; const cx = x + (20 * p + 12 * Math.sin(t * 2 + i)) * z, cy = y - 110 * p * z;
      ctx.beginPath(); ctx.moveTo(cx - sz, cy - sz); ctx.lineTo(cx + sz, cy - sz); ctx.lineTo(cx - sz, cy + sz); ctx.lineTo(cx + sz, cy + sz); ctx.stroke(); }
    ctx.restore();
  }
  /* burst rings + rising sparkles for the winner's power-up at t0 */
  function power(ctx, q, x, y, t, t0, until, z = 1) {
    if (t < t0 - .05 || t > until) return;
    for (let k = 0; k < 3; k++) { const p = seg(t, t0 + k * .12, t0 + .7 + k * .12); if (p <= 0 || p >= 1) continue;
      ctx.save(); ctx.globalAlpha = (1 - p) * .9; ctx.strokeStyle = k === 1 ? '#ffffff' : q.col; ctx.lineWidth = (12 * (1 - p) + 2) * z; ctx.beginPath(); ctx.ellipse(x, y - 10 * z, (60 + 230 * oC(p)) * z, (16 + 70 * oC(p)) * z, 0, 0, TAU); ctx.stroke(); ctx.restore(); }
    for (let k = 0; k < 8; k++) { const per = 1.1, p = ((t - t0) / per + hash(k * 3.3)) % 1, xx = x + (hash(k * 7.1) - .5) * 360 * z, yy = y - (30 + 300 * p) * z;
      sparkle(ctx, xx, yy, (10 + 6 * hash(k)) * z, k % 2 ? '#ffffff' : q.col, tri(p, 0, 1) * seg(t, t0, t0 + .3) * (1 - seg(t, until - .3, until))); }
  }
  /* radiating impact marks around (x, y) for d seconds after t0 */
  function impact(ctx, x, y, t, t0, col = '#ffffff', z = 1, d = .35, n = 6) {
    if (t < t0 || t > t0 + d) return; const p = seg(t, t0, t0 + d);
    ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 6 * z; ctx.lineCap = 'round'; ctx.globalAlpha = 1 - p;
    for (let k = 0; k < n; k++) { const a = k / n * TAU + .3; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * (40 + 40 * p) * z, y + Math.sin(a) * (40 + 40 * p) * z); ctx.lineTo(x + Math.cos(a) * (62 + 70 * p) * z, y + Math.sin(a) * (62 + 70 * p) * z); ctx.stroke(); }
    ctx.restore();
  }
  /* calendar card: cols x rows cells; state(i) -> '' | 'x' (missed, red) | 'v' (done, green check) | 'gap' (dark) ; pop(i) 0..1 */
  function calendar(ctx, x, y, w, h, cols, rows, state, pop, o = {}) {
    ctx.save(); ctx.globalAlpha = o.op == null ? 1 : o.op;
    ctx.fillStyle = '#f4f2ff'; rr(ctx, x, y, w, h, 14); ctx.fill();
    ctx.fillStyle = o.col || '#ff3b4e'; rr(ctx, x, y, w, 30, [14, 14, 0, 0]); ctx.fill();
    ctx.fillStyle = '#ffffff'; for (let k = 0; k < 2; k++) { rr(ctx, x + w * (.28 + .44 * k) - 5, y - 10, 10, 26, 5); ctx.fill(); }
    const pad = 10, cw = (w - pad * 2) / cols, ch = (h - 30 - pad * 2) / rows;
    for (let i = 0; i < cols * rows; i++) {
      const cx = x + pad + (i % cols) * cw + cw / 2, cy = y + 30 + pad + Math.floor(i / cols) * ch + ch / 2, st = state(i), k = pop ? pop(i) : 1;
      ctx.fillStyle = '#dcd8ee'; rr(ctx, cx - cw / 2 + 3, cy - ch / 2 + 3, cw - 6, ch - 6, 5); ctx.fill();
      if (!st || k <= 0) continue;
      const e = oBack(clamp(k), 2.2), m = Math.min(cw, ch) * .34 * e;
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      if (st === 'v') { ctx.fillStyle = '#2ed27a'; rr(ctx, cx - cw / 2 + 3, cy - ch / 2 + 3, cw - 6, ch - 6, 5); ctx.globalAlpha *= clamp(k * 2); ctx.fill(); ctx.globalAlpha = o.op == null ? 1 : o.op;
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = Math.max(3, m * .45); ctx.beginPath(); ctx.moveTo(cx - m, cy); ctx.lineTo(cx - m * .3, cy + m * .7); ctx.lineTo(cx + m, cy - m * .7); ctx.stroke(); }
      else if (st === 'x') { ctx.strokeStyle = '#ff3b4e'; ctx.lineWidth = Math.max(3, m * .45); ctx.beginPath(); ctx.moveTo(cx - m, cy - m); ctx.lineTo(cx + m, cy + m); ctx.moveTo(cx + m, cy - m); ctx.lineTo(cx - m, cy + m); ctx.stroke(); }
      else if (st === 'gap') { ctx.fillStyle = '#9a96b0'; rr(ctx, cx - cw / 2 + 3, cy - ch / 2 + 3, cw - 6, ch - 6, 5); ctx.fill(); }
    }
    ctx.restore();
  }
  /* energy-drink can (bottom centre x, y), z scale, rot */
  function can(ctx, x, y, z = 1, rot = 0, col = '#3fff8a') {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(z, z);
    ctx.fillStyle = '#c7cbe0'; rr(ctx, -16, -64, 32, 8, 3); ctx.fill();
    ctx.fillStyle = '#1b1f33'; rr(ctx, -18, -58, 36, 58, 6); ctx.fill();
    ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(4, -50); ctx.lineTo(-8, -26); ctx.lineTo(2, -26); ctx.lineTo(-4, -8); ctx.lineTo(10, -34); ctx.lineTo(0, -34); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  /* sheet of paper (centre), crumple 0..1 turns it into a ball */
  function paper(ctx, x, y, z = 1, rot = 0, crumple = 0, lines = 3) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(z, z);
    if (crumple < .5) { const w = lerp(64, 30, crumple * 2), h = lerp(84, 34, crumple * 2);
      ctx.fillStyle = '#ffffff'; rr(ctx, -w / 2, -h / 2, w, h, 3); ctx.fill(); ctx.fillStyle = '#b9b4d6';
      for (let l = 0; l < lines; l++) ctx.fillRect(-w / 2 + 8, -h / 2 + 12 + l * (h - 20) / lines, (w - 16) * (l % 2 ? .7 : 1), 4); }
    else { ctx.fillStyle = '#f1efff'; ctx.beginPath(); for (let k = 0; k < 9; k++) { const a = k / 9 * TAU, r = 19 + 5 * hash(k * 1.7); ctx.lineTo(r * Math.cos(a), r * Math.sin(a)); } ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#a8a2cc'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(-10, -6); ctx.lineTo(4, 2); ctx.lineTo(-2, 12); ctx.moveTo(6, -12); ctx.lineTo(10, -2); ctx.stroke(); }
    ctx.restore();
  }
  /* book closed/stack: (x, y) bottom-left, w, h */
  function bookStack(ctx, x, y, n, z = 1, cols = ['#ff7a59', '#3fa9ff', '#ffd23f', '#b26bff']) {
    for (let i = 0; i < n; i++) { ctx.fillStyle = cols[i % cols.length]; rr(ctx, x + (hash(i * 3.1) - .5) * 10 * z, y - (i + 1) * 18 * z, 120 * z, 16 * z, 3 * z); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fillRect(x + (hash(i * 3.1) - .5) * 10 * z + 100 * z, y - (i + 1) * 18 * z + 3 * z, 10 * z, 10 * z); }
  }
  function couch(ctx, x, y, z = 1, col = '#4a5aa8') {
    ctx.save(); ctx.translate(x, y); ctx.scale(z, z);
    ctx.fillStyle = '#323f80'; rr(ctx, -150, -180, 330, 110, 26); ctx.fill();         // back
    ctx.fillStyle = col; rr(ctx, -150, -100, 330, 64, 18); ctx.fill();                 // seat
    ctx.fillStyle = '#28336a'; rr(ctx, -176, -140, 52, 110, 18); ctx.fill(); rr(ctx, 156, -140, 52, 110, 18); ctx.fill();
    ctx.fillStyle = '#12162b'; ctx.fillRect(-150, -36, 12, 36); ctx.fillRect(168, -36, 12, 36);
    ctx.restore();
  }
  function bed(ctx, x, y, z = 1, col = '#5a4bb0') {
    ctx.save(); ctx.translate(x, y); ctx.scale(z, z);
    ctx.fillStyle = '#262a46'; rr(ctx, -40, -190, 26, 190, 8); ctx.fill();           // headboard
    ctx.fillStyle = '#2c3150'; rr(ctx, -30, -84, 420, 50, 10); ctx.fill();            // frame
    ctx.fillStyle = '#e9e6ff'; rr(ctx, -10, -112, 110, 34, 16); ctx.fill();           // pillow
    ctx.fillStyle = '#1e2238'; ctx.fillRect(-26, -34, 14, 34); ctx.fillRect(366, -34, 14, 34);
    ctx.restore();
  }
  function blanket(ctx, x, y, z = 1, col = '#5a4bb0', k = 1) {
    if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(z, z); ctx.globalAlpha = clamp(k);
    ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(80, -86); ctx.quadraticCurveTo(110, -150, 220, -136); ctx.quadraticCurveTo(330, -126, 392, -100); ctx.lineTo(392, -60); ctx.lineTo(80, -60); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  function dumbbell(ctx, x, y, z = 1, rot = 0) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(z, z);
    ctx.fillStyle = '#9aa0bf'; ctx.fillRect(-26, -4, 52, 8); ctx.fillStyle = '#3a3f5c'; rr(ctx, -40, -16, 16, 32, 4); ctx.fill(); rr(ctx, 24, -16, 16, 32, 4); ctx.fill();
    ctx.restore();
  }
  function window2(ctx, x, y, w, h, night) {     // window with moon (night 1) or sun (0)
    ctx.save(); ctx.fillStyle = '#1a2040'; rr(ctx, x - 8, y - 8, w + 16, h + 16, 10); ctx.fill();
    const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, `rgb(${lerp(255, 18, night) | 0},${lerp(180, 24, night) | 0},${lerp(110, 60, night) | 0})`); g.addColorStop(1, `rgb(${lerp(255, 40, night) | 0},${lerp(225, 36, night) | 0},${lerp(160, 90, night) | 0})`);
    ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = night > .5 ? '#f5f1d0' : '#fff2a8'; ctx.beginPath(); ctx.arc(x + w * .68, y + h * lerp(.62, .32, night), 18, 0, TAU); ctx.fill();
    ctx.fillStyle = '#1a2040'; ctx.fillRect(x + w / 2 - 3, y, 6, h); ctx.fillRect(x, y + h / 2 - 3, w, 6);
    ctx.restore();
  }

  /* speech bubble with a short canvas word (counts toward the 8-word budget; keep it clear of DOM text). k = 0..1 life,
   * tail points down-left to (x, y + 40·z) */
  function bubble(ctx, x, y, text, k, o = {}) {
    if (k <= 0 || k >= 1) return; const z = o.z || 1, e = oBack(seg(k, 0, .18), 2.4), a = 1 - seg(k, .8, 1);
    ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(e * z, e * z); ctx.rotate(o.rot || -.05);
    ctx.font = `800 ${o.size || 44}px BS`; const w = ctx.measureText(text).width + 36, h = (o.size || 44) + 22;
    ctx.fillStyle = o.bg || '#ffffff'; rr(ctx, -w / 2, -h / 2, w, h, 18); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-w / 2 + 26, h / 2 - 4); ctx.lineTo(-w / 2 + 10, h / 2 + 26); ctx.lineTo(-w / 2 + 50, h / 2 - 4); ctx.fill();
    ctx.fillStyle = o.col || INK; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 3);
    ctx.restore();
  }
  /* wall clock that can spin fast and ring (alarm): hours = shown time, ring = 0..1 */
  function clock(ctx, x, y, z, hours, ring = 0, t = 0) {
    const j = ring > 0 ? Math.sin(t * 70) * 6 * ring : 0;
    ctx.save(); ctx.translate(x + j, y); ctx.rotate(j * .02);
    if (ring > 0) { ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 5 * z; ctx.lineCap = 'round'; ctx.globalAlpha = ring;
      [-1, 1].forEach(sx => [0, 1].forEach(i => { const r = (88 + i * 20) * z; ctx.beginPath(); ctx.arc(0, 0, r, sx > 0 ? -.5 : PI - .5, sx > 0 ? .5 : PI + .5); ctx.stroke(); })); ctx.globalAlpha = 1;
      ctx.fillStyle = '#ffd23f'; [-1, 1].forEach(sx => { ctx.beginPath(); ctx.arc(sx * 50 * z, -66 * z, 20 * z, 0, TAU); ctx.fill(); }); }
    ctx.restore();
    S.wallClock(ctx, x + j, y, z, 0, { t0: hours, speed: 0 });
  }
  /* potted plant that grows (g 0..1: sprout -> leafy plant), glow colour col */
  function plant(ctx, x, y, z, g, col = '#4dff9a', t = 0) {
    ctx.save(); ctx.translate(x, y); ctx.scale(z, z); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.fillStyle = '#b5653a'; ctx.beginPath(); ctx.moveTo(-44, -70); ctx.lineTo(44, -70); ctx.lineTo(34, 0); ctx.lineTo(-34, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#8a4a28'; ctx.fillRect(-50, -82, 100, 16);
    const H = 30 + 300 * g, sw = Math.sin(t * 2) * 4 * g;
    ctx.strokeStyle = '#3bd27a'; ctx.lineWidth = 10 + 6 * g; ctx.beginPath(); ctx.moveTo(0, -80); ctx.quadraticCurveTo(10 + sw, -80 - H * .5, sw, -80 - H); ctx.stroke();
    const nL = Math.floor(2 + 8 * g);
    for (let i = 0; i < nL; i++) { const f = (i + 1) / (nL + 1), yy = -80 - H * f, sx = i % 2 ? 1 : -1, L = (34 + 40 * g) * (1 - .4 * f);
      ctx.save(); ctx.translate(sw * f, yy); ctx.rotate(sx * (.6 + .2 * Math.sin(t * 2 + i))); ctx.fillStyle = i % 3 ? '#4dff9a' : '#2ed27a';
      ctx.beginPath(); ctx.ellipse(sx * L * .55, 0, L * .55, L * .24, 0, 0, TAU); ctx.fill(); ctx.restore(); }
    if (g > .85) { ctx.globalAlpha = (g - .85) / .15; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(sw, -80 - H, 22, 0, TAU); ctx.fill(); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.arc(sw, -80 - H, 10, 0, TAU); ctx.fill(); }
    ctx.restore();
  }

  // ---------------------------------------------------------------- the format
  const CSS = `
.fp-lab { position:absolute; font:800 60px/1 BS; line-height:1; text-transform:uppercase; letter-spacing:.01em; white-space:nowrap; text-shadow:0 5px 0 rgba(0,0,0,.6); will-change:transform,opacity }
.fp-hook { position:absolute; left:0; width:1080px; text-align:center; font:800 90px/.92 BS; text-transform:uppercase; color:#fff; text-shadow:0 6px 0 rgba(0,0,0,.5); will-change:transform,opacity }
.fp-hook div { white-space:nowrap } .fp-hook span { display:inline-block }
.fp-band { position:absolute; left:0; width:1080px; background:rgba(9,8,20,.96); border-top:5px solid var(--wc); border-bottom:5px solid var(--wc); box-shadow:0 0 40px rgba(0,0,0,.6); box-sizing:border-box;
  display:flex; flex-direction:column; justify-content:center; align-items:center; font:800 90px/.95 BS; text-transform:uppercase; color:#fff; will-change:transform,opacity }
.fp-band div { white-space:nowrap } .fp-band .w { display:inline-block; will-change:transform,opacity }
.fp-cta { position:absolute; left:0; width:1080px; text-align:center; will-change:transform,opacity }
.fp-cta span { display:inline-block; padding:16px 34px; border-radius:999px; background:#16122f; border:4px solid var(--wc); color:#fff; font:600 46px HG; white-space:nowrap; box-shadow:0 8px 0 rgba(0,0,0,.45) }
.fp-cta b { font-weight:600; color:var(--wl) } .fp-cta .em { font-family:'Noto Color Emoji', sans-serif; font-weight:400 }
.fp-c0 { color:${COL.yellow} } .fp-c1 { color:${COL.blue} } .fp-c2 { color:${COL.red} } .fp-c3 { color:${COL.purple} } .fp-hl { color:var(--wl) }
`;
  /* create(cfg): cfg = {
   *   labels: [4 names], colors?: [4 hex] (default yellow, blue, red, purple), winner?: 3,
   *   hook: [line1 html, line2 html] (wrap words in <i class="fp-hl">…</i> for the winner colour), hookMax?: [84, 96],
   *   lesson: [line1, line2] (same markup), lessonMax?: [86, 106], cta?: html (default 📒 FREE HABIT TRACKER · LINK IN BIO),
   *   s?: figure scale (1.3), T: { dur, stamps:[4], hookOut, les:[beat per word] or les0, lesOut, cta, reset, hookIn } } */
  function create(cfg) {
    const stage = S.stage();
    if (!document.getElementById('fp-css')) { const st = document.createElement('style'); st.id = 'fp-css'; st.textContent = CSS; document.head.appendChild(st); }
    const cols = cfg.colors || [COL.yellow, COL.blue, COL.red, COL.purple], win = cfg.winner == null ? 3 : cfg.winner, T = cfg.T;
    stage.style.background = '#06070d';
    stage.style.setProperty('--wc', cols[win]); stage.style.setProperty('--wl', '#cfa6ff');
    window.CHECK_ZONE = 'fourpanel';
    const mk = bg => { const c = document.createElement('canvas'); c.width = 1080; c.height = 1920;
      c.setAttribute('style', 'position:absolute;left:0;top:0;width:1080px;height:1920px'); if (bg) c.dataset.bg = 'grid'; stage.appendChild(c);
      return c.getContext('2d', { willReadFrequently: true }); };
    const BG = mk(true), CX = mk(false);
    const s = cfg.s || 1.3;
    const Q = cfg.labels.map((name, i) => {
      const c = i % 2, r = i >> 1, x0 = c ? G.x0 + G.PW + G.gap : G.x0, y0 = r ? G.gridTop + G.PH + G.gap : G.gridTop;
      const q = { i, name, col: cols[i], rgb: RGB(cols[i]), r, c, x0, x1: x0 + G.PW, y0, y1: y0 + G.PH, w: G.PW, h: G.PH, fl: y0 + 700, fx: x0 + 96, s, lx: x0 + 40, ly: y0 + 22 };
      const d = document.createElement('div'); d.className = 'fp-lab'; d.style.color = q.col;
      const lines = name.split('|'); q.nl = lines.length; q.lh = cfg.labelSize || (lines.length > 1 ? 54 : 60);
      d.style.fontSize = q.lh + 'px'; d.innerHTML = lines.map(l => `<div><span>${l}</span></div>`).join('');
      d.style.left = q.lx + 'px'; d.style.top = q.ly + 'px'; stage.appendChild(d); q.el = d;
      q.labBot = q.ly + q.lh * q.nl + 4;                       // first free y under the label (props may start here + 14)
      return q;
    });
    const hm = cfg.hookMax || [84, 96], lm = cfg.lessonMax || [86, 106];
    const hook = document.createElement('div'); hook.className = 'fp-hook'; hook.style.top = G.hookTop + 'px';
    hook.innerHTML = cfg.hook.map((h, k) => `<div><span data-fit="${hm[k] || hm[0]}">${h}</span></div>`).join(''); stage.appendChild(hook);
    const band = document.createElement('div'); band.className = 'fp-band'; band.style.top = G.bandTop + 'px'; band.style.height = G.bandH + 'px'; band.style.opacity = 0;
    band.innerHTML = cfg.lesson.map((l, k) => {
      const tmp = document.createElement('div'); tmp.innerHTML = l; const parts = [];
      tmp.childNodes.forEach(nd => { if (nd.nodeType === 3) nd.data.split(/\s+/).filter(Boolean).forEach(w => parts.push(`<span class="w">${w}</span>`));
        else parts.push(`<span class="w ${nd.className || ''}">${nd.innerHTML}</span>`); });
      return `<div><span data-fit="${lm[k] || lm[0]}">${parts.join(' ')}</span></div>`;
    }).join(''); stage.appendChild(band);
    const W = [...band.querySelectorAll('.w')];
    const cta = document.createElement('div'); cta.className = 'fp-cta'; cta.style.top = G.ctaTop + 'px'; cta.style.opacity = 0;
    cta.innerHTML = `<span data-fit="50">${cfg.cta || '<i class="em" style="font-style:normal">📒</i> FREE HABIT TRACKER · <b>LINK IN BIO</b>'}</span>`; stage.appendChild(cta);
    [hook, band, cta].forEach(e => e.classList.add('abs'));
    let LW = null;
    function ready() {          // fit every line to 940 px (x 70–1010) and measure the labels (for the badges)
      document.querySelectorAll('#stage [data-fit]').forEach(sp => {
        let px = +sp.dataset.fit; const set = () => { sp.style.fontSize = px + 'px'; if (!sp.closest('.fp-cta')) sp.parentElement.style.fontSize = px + 'px'; };
        set(); while (sp.offsetWidth > 940 && px > 30) { px -= 2; set(); }
      });
      LW = Q.map(q => { const sp = q.el.querySelectorAll('span'); return sp[sp.length - 1].offsetWidth; });
    }
    const beats = T.les || W.map((w, k) => T.les0 + k * .22);
    const resetK = t => io(seg(t, T.reset, T.reset + .45));
    /* default glow curve: losers fade to .45 after `fail`, the winner builds over [build] and flashes at `power` */
    function glow(i, t, o = {}) {
      const r = resetK(t);
      if (i === win) { const g = 1 + .35 * seg(t, (o.build || [5, 14])[0], (o.build || [5, 14])[1]) + 1.1 * oC(seg(t, o.power, o.power + .4)) - .4 * seg(t, o.power + .4, o.power + 1.2) + .12 * Math.sin(t * 6) * seg(t, o.power, o.power + .5);
        return lerp(g, 1, r); }
      return lerp(1 - .55 * io(seg(t, o.fail + .3, o.fail + 3)), 1, r);
    }
    function drawBG(t, glowF, flashF) {
      const ctx = BG; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.fillStyle = '#06070d'; ctx.fillRect(0, 0, 1080, 1920);
      Q.forEach((q, i) => {
        const Gl = glowF(i, t), h = q.h;
        ctx.save(); rr(ctx, q.x0, q.y0, q.w, h, 26); ctx.clip();
        ctx.fillStyle = '#0d0f1c'; ctx.fillRect(q.x0, q.y0, q.w, h);
        const rg = ctx.createRadialGradient(q.fx + 150, q.fl - 220, 20, q.fx + 150, q.fl - 220, 520);
        rg.addColorStop(0, `rgba(${q.rgb},${(.17 * Gl).toFixed(3)})`); rg.addColorStop(1, `rgba(${q.rgb},0)`);
        ctx.fillStyle = rg; ctx.fillRect(q.x0, q.y0, q.w, h);
        ctx.fillStyle = '#090a14'; ctx.fillRect(q.x0, q.fl, q.w, q.y1 - q.fl);
        ctx.fillStyle = `rgba(${q.rgb},.35)`; ctx.fillRect(q.x0, q.fl, q.w, 3);
        ctx.restore();
        const fl = flashF ? flashF(i, t) : 0, st = tri(t, T.stamps[i], T.stamps[i] + .35);
        ctx.save(); ctx.strokeStyle = q.col; ctx.globalAlpha = clamp(.45 * Math.min(Gl, 1.4) + .5 * fl + .4 * st); ctx.lineWidth = 4 + 6 * fl; rr(ctx, q.x0 + 2, q.y0 + 2, q.w - 4, h - 4, 24); ctx.stroke(); ctx.restore();
        if (i === win && Gl > 1.3) { ctx.save(); ctx.strokeStyle = q.col; ctx.globalAlpha = .25 * (Gl - 1.3); ctx.lineWidth = 16; rr(ctx, q.x0 + 8, q.y0 + 8, q.w - 16, h - 16, 22); ctx.stroke(); ctx.restore(); }
      });
    }
    /* frame(t, {glow(i,t), draw(ctx,i,t,q), shake(i,t) px, flash(i,t)}) — paints the whole frame */
    function frame(t, o) {
      if (!LW) ready();
      const glowF = o.glow || ((i, tt) => 1);
      drawBG(t, glowF, o.flash);
      const ctx = CX; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, 1080, 1920);
      for (let i = 0; i < 4; i++) {
        const q = Q[i]; ctx.save(); ctx.lineCap = 'butt'; ctx.lineJoin = 'miter'; ctx.globalAlpha = 1;
        rr(ctx, q.x0, q.y0, q.w, q.h, 26); ctx.clip();
        const sh = Math.round((o.shake ? o.shake(i, t) : 0) + shk(t, T.stamps[i], .18, 6));
        ctx.translate(sh, 0);
        o.draw(ctx, i, t, q);
        ctx.restore();
      }
      // verdict badges right of the labels
      const off = 1 - seg(t, T.reset - .1, T.reset + .1);
      Q.forEach((q, i) => badge(ctx, q.lx + LW[i] + 46, q.ly + (q.nl - 1) * q.lh + q.lh * .52, seg(t, T.stamps[i], T.stamps[i] + .3) * off, i === win));
      Q.forEach((q, i) => { const d = (i !== win ? .35 : 0) * seg(t, T.stamps[i], T.stamps[i] + .3) * off; q.el.style.opacity = (1 - d).toFixed(3); });
      // hook: frame 0 full; out at hookOut; back in at hookIn (loop)
      if (t < T.hookIn) { const p = seg(t, T.hookOut, T.hookOut + .25); hook.style.opacity = (1 - p).toFixed(3); hook.style.transform = `translate(0px,${Math.round(-26 * iC(p))}px)`; }
      else { const p = seg(t, T.hookIn, T.hookIn + .3); hook.style.opacity = p.toFixed(3); hook.style.transform = `translate(0px,${Math.round(24 * (1 - oC(p)))}px)`; }
      // lesson band: opens from its centre line, words slam in on their beats, all leave at lesOut
      const b0 = beats[0] - .12, open = io(seg(t, b0, b0 + .22)), pout = seg(t, T.lesOut, T.lesOut + .25);
      band.style.opacity = (t >= b0 ? 1 : 0) * (1 - pout) + '';
      band.style.clipPath = `inset(${(50 * (1 - open)).toFixed(2)}% -2% ${(50 * (1 - open)).toFixed(2)}% -2%)`;
      band.style.transform = 'translate(0px,0px)';
      W.forEach((w, k) => { const t0 = beats[k] == null ? beats[beats.length - 1] : beats[k], p = seg(t, t0, t0 + .16);
        w.style.opacity = (p > 0 ? clamp(p * 3) : 0).toFixed(3);
        w.style.transform = `translate(0px,${p >= 1 ? Math.round(5 * tri(t, t0 + .16, t0 + .3)) : Math.round(18 * (1 - oC(p)))}px)`; });   // rise from below: never crosses the line above
      // CTA pill in the hook band
      const cin = seg(t, T.cta, T.cta + .3), cout = seg(t, T.lesOut, T.lesOut + .25);
      cta.style.opacity = (cin * (1 - cout)).toFixed(3);
      cta.style.transform = `translate(0px,${Math.round(-30 * (1 - oBack(seg(t, T.cta, T.cta + .4))))}px)`;
      S.hideInvisible(stage);
    }
    return { stage, Q, BG, CX, s, T, win, frame, ready, glow, resetK, beats };
  }
  const shk = (t, a, d, amp) => t >= a && t < a + d ? Math.round(amp * (1 - (t - a) / d) * Math.sin(t * 97)) : 0;

  window.FourPanel = { create, COL, G, neon, face, desk, laptopGlow, phone, buzz, notif, sweat, sparkle, badge, tick, zzz, power, impact, calendar, can, paper,
    bookStack, couch, bed, blanket, dumbbell, window2, bubble, clock, plant, rr, poly, shk, POSES: Object.keys(P) };
})();
