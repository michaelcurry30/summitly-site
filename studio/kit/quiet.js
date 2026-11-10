/* quiet.js — "Quiet Progress" visual-metaphor kit (global `Quiet`), 1080x1920, frame-pure.
 * Rules: mv/QUIET_BIBLE.md. Docs: kit/README.md "Quiet kit". Self-contained (does not load or touch stick.js / summit.js).
 *
 *   const Q = Quiet, stage = Q.stage();
 *   const E = Q.engine(stage);                    // bg canvas (data-bg: gradient, bloom, dust) + crisp fg canvas
 *   const hook = Q.hook(stage, 'Success is built quietly.');
 *   const L1 = Q.label(stage, 'CONSISTENCY', { x: 750, y: 1150 });
 *   const SC = [{ a: 0, b: 6.5, draw(ctx, lt, t) {...}, bg(ctx, lt, t) {...} }, ...];
 *   function seek(t) { E.frame(t, SC); Q.show(hook, t, 0, 4, { hold0: true }); Q.hideInvisible(); }
 *   Q.boot({ duration: 32, seek });
 */
(function () {
  'use strict';
  const KIT = (typeof document !== 'undefined' && document.currentScript && document.currentScript.src || '').replace(/quiet\.js(\?.*)?$/, '') || 'kit/';
  const W = 1080, H = 1920, PI = Math.PI, TAU = PI * 2;
  // ------------------------------------------------------------------ math / easing
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const seg = (t, a, b) => clamp((t - a) / (b - a));
  const lerp = (a, b, k) => a + (b - a) * k;
  const io = x => .5 - .5 * Math.cos(PI * clamp(x));                 // sine in-out (the house easing)
  const oC = x => 1 - Math.pow(1 - clamp(x), 3);
  const iC = x => Math.pow(clamp(x), 3);
  const ioC = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  const oBack = (x, s = 1.4) => { x = clamp(x) - 1; return 1 + (s + 1) * x * x * x + s * x * x; };
  const smooth = x => { x = clamp(x); return x * x * (3 - 2 * x); };
  const tri = (t, a, b) => (t <= a || t >= b) ? 0 : Math.sin(PI * (t - a) / (b - a));
  const hash = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const noise1 = x => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return lerp(hash(i), hash(i + 1), u) * 2 - 1; };
  const $ = id => document.getElementById(id);
  const SW2D = { willReadFrequently: true };                             // CPU canvases: deterministic raster
  const C = { bg0: '#05040e', bg1: '#120f2e', bg2: '#2a2160', white: '#ffffff', l1: '#efeaff', l2: '#cfc6ff', l3: '#9d8cff',
    l4: '#7a63ff', l5: '#6f5ce8', line: '#8f7dff', text: '#ece8ff', soft: '#b9adff' };
  const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };

  // ------------------------------------------------------------------ page, fonts, text
  function injectCSS() {
    if ($('quiet-css')) return;
    const st = document.createElement('style'); st.id = 'quiet-css';
    st.textContent = `
@font-face { font-family: HG; src: url(${KIT}fonts/hanken-grotesk-latin-600-normal.woff2) format("woff2"); font-weight: 600; }
@font-face { font-family: PM; src: url(${KIT}fonts/ibm-plex-mono-latin-400-normal.woff2) format("woff2"); font-weight: 400; }
html,body { margin:0; height:100%; background:#000; overflow:hidden }
#stage { position:absolute; left:0; top:0; width:1080px; height:1920px; transform-origin:0 0; overflow:hidden; background:${C.bg0}; color:${C.text}; font-family:HG, Arial, sans-serif }
.abs { position:absolute; will-change:transform,opacity }
.qfull { left:0; top:0; width:1080px; height:1920px }
.qtxt { text-align:center; white-space:nowrap; font-weight:600; font-family:HG, Arial, sans-serif }
.qlab { color:${C.text}; letter-spacing:.2em; text-transform:uppercase; text-shadow:0 0 18px rgba(150,130,255,.75), 0 0 4px rgba(150,130,255,.5) }
.qhook { color:#f4f1ff; letter-spacing:.03em; text-shadow:0 0 26px rgba(150,130,255,.7) }
.qwm { color:${C.soft}; letter-spacing:.14em; opacity:.5 }
.qcta { color:#efeaff; letter-spacing:.02em; text-shadow:0 0 16px rgba(150,130,255,.6) }
.qcta svg { display:inline-block; vertical-align:-0.16em; margin-right:.42em }
`;
    document.head.appendChild(st);
  }
  function el(parent, tag, cls, style, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls; if (style) e.setAttribute('style', style); if (html != null) e.innerHTML = html;
    parent.appendChild(e); return e;
  }
  function stage() {
    injectCSS();
    let s = $('stage'); if (!s) { s = el(document.body, 'div'); s.id = 'stage'; }
    window.STAGE_W = W; window.STAGE_H = H; window.CHECK_ZONE = 'quiet';
    return s;
  }
  /* text element centred on x (or left-aligned with align:'left'), top y; auto-shrinks to fit w at boot */
  function txt(parent, html, o, cls) {
    const x = o.x == null ? 540 : o.x, size = o.size || 36;
    const w = o.align === 'left' ? Math.min(o.w || 840, 960 - x) : Math.min(o.w || 840, 2 * (x - 122), 2 * (958 - x));   // glyphs always inside x 120-960
    const left = o.align === 'left' ? x : x - w / 2;
    const e = el(parent, 'div', `abs qtxt ${cls}`, `left:${Math.round(left)}px;top:${Math.round(o.y)}px;width:${w}px;font-size:${size}px;` +
      `${o.align === 'left' ? 'text-align:left;' : ''}opacity:0;${o.style || ''}`, `<span>${html}</span>`);
    e.dataset.fit = w; e.dataset.size = size; return e;
  }
  // letter-spaced uppercase label; the trailing letter-space is balanced with padding-left
  const label = (p, text, o = {}) => txt(p, text, Object.assign({ size: 36 }, o), 'qlab');
  const hook = (p, text, o = {}) => txt(p, text, Object.assign({ y: 300, size: 62 }, o), 'qhook');
  const closing = (p, text, o = {}) => txt(p, text, Object.assign({ y: 330, size: 70 }, o), 'qhook');
  const NOTEBOOK = s => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><rect x="4" y="2.5" width="16" height="19" rx="2.6" fill="#cfc6ff"/>` +
    `<rect x="4" y="2.5" width="4.2" height="19" rx="1.6" fill="#7a63ff"/><rect x="10.5" y="7" width="7" height="1.8" rx=".9" fill="#5a4bc8"/>` +
    `<rect x="10.5" y="11" width="5.5" height="1.8" rx=".9" fill="#5a4bc8"/></svg>`;
  /* closing CTA "📒 free habit tracker · link in bio": the notebook is drawn (the renderer has no emoji font) */
  const cta = (p, o = {}) => txt(p, `${NOTEBOOK(Math.round((o.size || 40) * 1.05))}${o.text || 'free habit tracker · link in bio'}`,
    Object.assign({ y: 1150, size: 40 }, o), 'qcta');
  const watermark = (p, o = {}) => { const e = txt(p, o.text || '@quietprogress', Object.assign({ y: 1222, size: 24 }, o), 'qwm'); e.style.opacity = '.5'; e.dataset.wm = 1; return e; };
  /* show(el, t, a, b): soft fade + 12 px rise in over d s from a; fade + drift up out from b. hold0 = fully in at a. */
  function show(e, t, a, b, o = {}) {
    const d = o.d || .55, dy = o.dy == null ? 14 : o.dy, max = o.max == null ? (e.dataset.wm ? .5 : 1) : o.max;
    const kin = o.hold0 ? 1 : io(seg(t, a, a + d)), kout = io(seg(t, b, b + (o.dout || .45)));
    e.style.opacity = (max * kin * (1 - kout)).toFixed(3);
    e.style.transform = `translate(${Math.round(o.dx || 0)}px,${Math.round(dy * (1 - kin) - 10 * kout + (o.y || 0))}px)`;
  }
  function fitText(root) {
    (root || document).querySelectorAll('.qtxt[data-fit]').forEach(e => {
      const sp = e.firstChild, w = +e.dataset.fit; let px = +e.dataset.size;
      while (sp.offsetWidth > w && px > 18) { px -= 1; e.style.fontSize = px + 'px'; }
      if (e.classList.contains('qlab')) sp.style.paddingLeft = '.2em';
    });
  }
  function hideInvisible(root) {
    (root || $('stage')).querySelectorAll('.abs').forEach(e => { const op = e.style.opacity; e.style.visibility = (op !== '' && parseFloat(op) <= 0) ? 'hidden' : 'visible'; });
  }
  function safeGuide(parent) {
    if (!/guide=1/.test(location.search)) return null;
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.setAttribute('class', 'abs qfull'); s.setAttribute('width', W); s.setAttribute('height', H);
    s.setAttribute('style', 'z-index:999;pointer-events:none');
    s.innerHTML = `<rect x="120" y="240" width="840" height="1020" fill="none" stroke="#0f0" stroke-width="4" stroke-dasharray="16 10"/><rect x="0" y="1260" width="1080" height="660" fill="rgba(255,0,0,.18)"/>`;
    parent.appendChild(s); return s;
  }
  function boot(o) {
    window.FPS = o.fps || 30; window.DURATION = o.duration; window.STAGE_W = W; window.STAGE_H = H;
    window.seek = o.seek;
    window.ready = (async () => {
      await Promise.all([...document.images].map(im => im.decode()));
      await document.fonts.load('600 40px HG'); await document.fonts.load('400 40px PM'); await document.fonts.ready;
      fitText();
      if (o.ready) await o.ready();
      o.seek(0);
      for (let i = 0; i < 3; i++) await new Promise(r => requestAnimationFrame(() => r()));
    })();
    const st = $('stage');
    const fit = () => { const s = Math.min(innerWidth / W, innerHeight / H); st.style.transform = `scale(${s})`; };
    if (!location.search.includes('capture=1')) {
      addEventListener('resize', fit); fit();
      window.ready.then(() => { const t0 = performance.now(); const loop = n => { o.seek(((n - t0) / 1000) % o.duration); requestAnimationFrame(loop); }; requestAnimationFrame(loop); });
    }
    return window.ready;
  }

  // ------------------------------------------------------------------ engine: background, bloom, dust, scene director
  function canvas(parent, cls, bg) {
    const c = el(parent, 'canvas', 'abs qfull' + (cls ? ' ' + cls : ''));
    c.width = W; c.height = H; if (bg) c.dataset.bg = bg;
    return c;
  }
  function off(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  function engine(parent, o = {}) {
    const bgC = canvas(parent, '', 'quiet'), fgC = canvas(parent, '', null);
    const bg = bgC.getContext('2d', SW2D), fg = fgC.getContext('2d', SW2D);
    // static base: radial indigo gradient + vignette (rendered once)
    const base = off(W, H), b = base.getContext('2d', SW2D);
    const cy = o.cy == null ? 820 : o.cy;
    let g = b.createRadialGradient(540, cy, 0, 540, cy, 1250);
    g.addColorStop(0, '#2a2160'); g.addColorStop(.5, '#141133'); g.addColorStop(1, '#05040e');
    b.fillStyle = g; b.fillRect(0, 0, W, H);
    g = b.createRadialGradient(540, 900, 520, 540, 900, 1250); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(2,1,8,.6)');
    b.fillStyle = g; b.fillRect(0, 0, W, H);
    const s1 = off(540, 960), s1c = s1.getContext('2d', SW2D), s2 = off(270, 480), s2c = s2.getContext('2d', SW2D);
    const L = off(W, H), Lc = L.getContext('2d', SW2D);
    const reset = c => { c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; c.filter = 'none'; c.lineCap = 'round'; c.lineJoin = 'round'; c.shadowBlur = 0; };
    const N = o.dust == null ? 70 : o.dust;
    function dust(t, a) {
      bg.save();
      for (let i = 0; i < N; i++) {
        const sp = 6 + 10 * hash(i * 3.1), x0 = hash(i * 7.7) * W, y0 = hash(i * 1.3 + 4) * H;
        const y = ((y0 - t * sp) % H + H) % H, x = x0 + 18 * Math.sin(t * .35 + i);
        const tw = .5 + .5 * Math.sin(t * (.8 + hash(i) * 1.2) + i * 2.3);
        const r = 1.1 + 1.9 * hash(i * 9.1);
        bg.globalAlpha = a * (.08 + .3 * tw) * (r > 2.4 ? 1 : .75);
        bg.fillStyle = C.l2; bg.beginPath(); bg.arc(x, y, r, 0, TAU); bg.fill();
      }
      bg.restore();
    }
    /* SC = [{a, b, x (crossfade s, default .8), draw(ctx, lt, t), bg(ctx, lt, t), lt(t) optional local-time override}] */
    function frame(t, SC, opt = {}) {
      reset(bg); reset(fg);
      bg.drawImage(base, 0, 0);
      fg.clearRect(0, 0, W, H);
      const vis = [];
      for (const s of SC) {
        const X = s.x == null ? .8 : s.x;
        const kin = s.a <= 0 ? 1 : io(seg(t, s.a - X / 2, s.a + X / 2));
        const kout = s.b == null ? 0 : io(seg(t, s.b - X / 2, s.b + X / 2));
        const k = kin * (1 - kout);
        if (k <= .001) continue;
        vis.push({ s, k, lt: s.lt ? s.lt(t) : t - s.a });
      }
      // per-scene background extras (zone fills, water, underground) -> bg canvas
      for (const v of vis) if (v.s.bg) {
        if (v.k >= .999) { bg.save(); v.s.bg(bg, v.lt, t); bg.restore(); reset(bg); }
        else { reset(Lc); Lc.clearRect(0, 0, W, H); v.s.bg(Lc, v.lt, t); bg.globalAlpha = v.k; bg.drawImage(L, 0, 0); reset(bg); }
      }
      for (const v of vis) {
        if (v.k >= .999) { fg.save(); v.s.draw(fg, v.lt, t); fg.restore(); reset(fg); }
        else { reset(Lc); Lc.clearRect(0, 0, W, H); v.s.draw(Lc, v.lt, t); fg.globalAlpha = v.k; fg.drawImage(L, 0, 0); reset(fg); }
      }
      if (opt.post) { fg.save(); opt.post(fg, t); fg.restore(); reset(fg); }
      // bloom: the crisp layer, blurred at 1/2 and 1/4 res, added under itself (soft gaussian glow, no camera blur)
      const bl = opt.bloom == null ? 1 : opt.bloom;
      s1c.clearRect(0, 0, 540, 960); s1c.filter = 'blur(7px)'; s1c.drawImage(fgC, 0, 0, 540, 960); s1c.filter = 'none';
      s2c.clearRect(0, 0, 270, 480); s2c.filter = 'blur(9px)'; s2c.drawImage(fgC, 0, 0, 270, 480); s2c.filter = 'none';
      bg.globalCompositeOperation = 'lighter';
      bg.globalAlpha = .55 * bl; bg.drawImage(s1, 0, 0, W, H);
      bg.globalAlpha = .45 * bl; bg.drawImage(s2, 0, 0, W, H);
      reset(bg);
      dust(t, opt.dust == null ? 1 : opt.dust);
    }
    return { bg: bgC, fg: fgC, bgCtx: bg, ctx: fg, frame };
  }

  // ------------------------------------------------------------------ figure (smooth, rounded, tapered, gradient-shaded)
  /* Angles in degrees, world frame, 0 = straight down, + = toward the facing direction.
   * Pose fields: lean (torso, + forward), head (tilt), hL kL hR kR (hips / knee bend, L = far side), aL eL aR eR (shoulders / elbow bend),
   * dy (extra hip lift, px at s=1), ground (true: lowest foot on y), hipY (when ground=false: hip height above y). */
  const DIM = { thigh: 54, shin: 52, torso: 72, neck: 34, head: 25, upper: 44, fore: 42 };
  const R = { hip: 12.5, chest: 15, thigh0: 11.5, thigh1: 9.2, shin1: 7.6, arm0: 9.8, arm1: 8, fore1: 6.8 };
  const KEYS = ['lean', 'head', 'hL', 'kL', 'hR', 'kR', 'aL', 'eL', 'aR', 'eR', 'dy', 'hipY'];
  const P = (o) => Object.assign({ lean: 2, head: 0, hL: 3, kL: 3, hR: -3, kR: 3, aL: -8, eL: 10, aR: 8, eR: 12, dy: 0, ground: true, hipY: 0 }, o);
  function mix(A, B, k) {
    const o = {}; for (const key of KEYS) o[key] = lerp(A[key] || 0, B[key] || 0, k);
    o.ground = k < .5 ? A.ground : B.ground; o.prop = k < .5 ? A.prop : B.prop; o.face = k < .5 ? A.face : B.face;
    if (A.ground !== B.ground) o.blendGround = [A.ground, B.ground, k];
    return o;
  }
  const breath = (t, a = 1) => Math.sin(t * TAU / 3.6) * a;
  const POSE = {
    stand: (t = 0) => P({ lean: 2 + breath(t, 1.2), head: breath(t + .4, 1.5), aL: -7 + breath(t, 2), aR: 9 - breath(t, 2), eL: 12, eR: 14 }),
    walk: (t = 0, o = {}) => {
      const f = o.rate || 1.1, st = o.stride || 1, ph = TAU * f * t;
      const sR = Math.sin(ph), sL = Math.sin(ph + PI);
      const kn = s => 6 + 40 * st * Math.pow(Math.max(0, Math.cos(s)), 1.3);
      return P({ lean: (o.lean == null ? 6 : o.lean) + 1.5 * Math.sin(2 * ph), head: o.head || 0, hR: 25 * st * sR, hL: 25 * st * sL,
        kR: kn(ph), kL: kn(ph + PI), aR: -20 * st * sR + 4, aL: -20 * st * sL + 4, eR: 22 + 8 * st, eL: 22 + 8 * st });
    },
    climb: (t = 0, o = {}) => {
      const ph = TAU * (o.rate || .9) * t, sR = Math.sin(ph), sL = Math.sin(ph + PI);
      const kn = s => 14 + 58 * Math.pow(Math.max(0, Math.cos(s)), 1.1);
      return P({ lean: 16, head: -6, hR: 14 + 30 * sR, hL: 14 + 30 * sL, kR: kn(ph), kL: kn(ph + PI), aR: -24 * sR + 10, aL: -24 * sL + 10, eR: 62, eL: 62 });
    },
    push: (t = 0, o = {}) => {
      const ph = TAU * (o.rate || .55) * t, sR = Math.sin(ph), sL = Math.sin(ph + PI);
      return P({ lean: 36, head: -16, hR: 8 + 22 * sR, hL: 8 + 22 * sL, kR: 18 + 22 * Math.max(0, Math.cos(ph)), kL: 18 + 22 * Math.max(0, -Math.cos(ph)),
        aR: 78, aL: 72, eR: 14, eL: 18 });
    },
    carry: (t = 0, o = {}) => {                                  // walking, holding something at chest (o.high: overhead)
      const w = POSE.walk(t, { rate: o.rate || 1, stride: o.stride == null ? .7 : o.stride, lean: 4 });
      return Object.assign(w, o.high ? { aR: 168, aL: 160, eR: 8, eL: 10 } : { aR: 58, aL: 52, eR: 72, eL: 76 });
    },
    place: (t = 0) => P({ lean: 8 + breath(t), aR: 100, aL: 92, eR: 16, eL: 20 }),
    slump: (t = 0) => P({ lean: 26 + breath(t, 2), head: 28, hL: 14, hR: 10, kL: 22, kR: 20, aL: 4, aR: 8, eL: 8, eR: 6 }),
    celebrate: (t = 0) => P({ lean: -4, head: -14, aL: 150 + 8 * Math.sin(t * 5), aR: 156 + 8 * Math.sin(t * 5 + 1), eL: -14, eR: -12,
      dy: 14 * Math.abs(Math.sin(t * PI * 1.25)), hL: 4, hR: -6, kL: 6, kR: 6 }),
    sit: (t = 0, o = {}) => P({ ground: false, hipY: o.h == null ? 66 : o.h, lean: 6 + breath(t, 1.5), head: 6 + breath(t + .3, 2), hL: 82, kL: 80, hR: 86, kR: 86,
      aL: 30, eL: 50, aR: 36, eR: 46 }),
    hug: (t = 0) => P({ ground: false, hipY: 10, lean: 14 + breath(t, 1.5), head: 18, hL: 128, kL: 150, hR: 132, kR: 152, aL: 70, eL: 40, aR: 74, eR: 36 }),
    recline: (t = 0) => P({ ground: false, hipY: 12, lean: -42 + breath(t, 1.2), head: -24, hL: 86, kL: 18, hR: 80, kR: 40, aL: -38, eL: 0, aR: 62, eR: 96, prop: 'phone' }),
    think: (t = 0) => P({ lean: 1 + breath(t, 1), head: 12 + 5 * Math.sin(t * 1.3), aR: 150, eR: 128, aL: 28, eL: 96, hL: 3, hR: -3 }),
    reach: (t = 0) => P({ lean: -2, head: -26, aR: 172 + 3 * Math.sin(t * 3), eR: 2, aL: 20, eL: 20, hL: 2, hR: -2, dy: 4 }),
    jump: (t = 0) => P({ lean: 4, head: -18, hL: 40, kL: 70, hR: 30, kR: 60, aR: 165, eR: 6, aL: 140, eL: 10 }),
    crouch: (t = 0) => P({ lean: 22, head: 6, hL: 50, kL: 95, hR: 46, kR: 92, aL: 40, eL: 30, aR: 46, eR: 26 }),
  };
  /* tl([[t0, poseFn | pose, args?], ...], blend=.4) -> (t) => pose ; pose functions get u = t - t0 */
  function tl(KEYS2, blend = .45) {
    return t => {
      let i = 0; while (i + 1 < KEYS2.length && t >= KEYS2[i + 1][0]) i++;
      const at = j => { const [t0, f, args] = KEYS2[j]; return typeof f === 'function' ? f(t - t0, args || {}) : (typeof f === 'string' ? POSE[f](t - t0, args || {}) : f); };
      const cur = at(i);
      if (i === 0 || t - KEYS2[i][0] >= (KEYS2[i][3] || blend)) return cur;
      return mix(at(i - 1), cur, io((t - KEYS2[i][0]) / (KEYS2[i][3] || blend)));
    };
  }
  const dv = (deg) => [Math.sin(deg * PI / 180), Math.cos(deg * PI / 180)];
  function limb(ctx, ax, ay, bx, by, ra, rb) {
    const dx = bx - ax, dy = by - ay, d = Math.hypot(dx, dy) || 1, nx = -dy / d, ny = dx / d;
    ctx.moveTo(ax + nx * ra, ay + ny * ra); ctx.lineTo(bx + nx * rb, by + ny * rb); ctx.lineTo(bx - nx * rb, by - ny * rb); ctx.lineTo(ax - nx * ra, ay - ny * ra); ctx.closePath();
    ctx.moveTo(ax + ra, ay); ctx.arc(ax, ay, ra, 0, TAU); ctx.moveTo(bx + rb, by); ctx.arc(bx, by, rb, 0, TAU);
  }
  /* solve(pose) -> joints in figure units (hip at 0,0; +x forward, +y down) */
  function solve(p) {
    const J = { hip: [0, 0] };
    const tv = dv(p.lean); J.sh = [tv[0] * DIM.torso, -tv[1] * DIM.torso];
    J.neck = [J.sh[0] + tv[0] * 10, J.sh[1] - tv[1] * 10];
    const hv = dv(p.lean + p.head * .6); J.head = [J.sh[0] + hv[0] * DIM.neck, J.sh[1] - hv[1] * DIM.neck];
    for (const s of ['L', 'R']) {
      const h = p['h' + s], k = p['k' + s], a = p['a' + s], e = p['e' + s];
      const t1 = dv(h), knee = [t1[0] * DIM.thigh, t1[1] * DIM.thigh], t2 = dv(h - k), foot = [knee[0] + t2[0] * DIM.shin, knee[1] + t2[1] * DIM.shin];
      const shp = [J.sh[0] + tv[0] * -3 + (s === 'L' ? -2 : 2), J.sh[1] + 6];
      const u1 = dv(a), elb = [shp[0] + u1[0] * DIM.upper, shp[1] + u1[1] * DIM.upper], u2 = dv(a + e), hand = [elb[0] + u2[0] * DIM.fore, elb[1] + u2[1] * DIM.fore];
      J['knee' + s] = knee; J['foot' + s] = foot; J['sh' + s] = shp; J['elb' + s] = elb; J['hand' + s] = hand;
    }
    return J;
  }
  function hipLift(p, J) {
    if (p.blendGround) { const [ga, gb, k] = p.blendGround; const A = ga ? Math.max(J.footL[1], J.footR[1]) + R.shin1 : p.hipY, B = gb ? Math.max(J.footL[1], J.footR[1]) + R.shin1 : p.hipY; return lerp(A, B, k); }
    return p.ground === false ? p.hipY : Math.max(J.footL[1], J.footR[1]) + R.shin1;
  }
  /* fig(ctx, pose, {x, y, s, dir, a, glow, tone}) draws the figure with feet (or seat) on y. Returns world joints. */
  function fig(ctx, p, o = {}) {
    const s = o.s || 1, dir = o.dir || 1, J = solve(p);
    const lift = hipLift(p, J) + (p.dy || 0);
    const X = u => o.x + u[0] * s * dir, Y = u => o.y + (u[1] - lift) * s;
    const out = {}; for (const k in J) out[k] = [X(J[k]), Y(J[k])];
    out.top = Y(J.head) - DIM.head * s; out.s = s;
    ctx.save();
    ctx.globalAlpha *= o.a == null ? 1 : o.a;
    const hx = X(J.head), hy = Y(J.head), bot = o.y;
    const g1 = ctx.createLinearGradient(o.x - 60 * s * dir, hy - 20 * s, o.x + 70 * s * dir, bot);
    const lit = o.glow || 0;
    g1.addColorStop(0, '#ffffff'); g1.addColorStop(.55, lerpHex('#d6ceff', '#ffffff', lit * .6)); g1.addColorStop(1, lerpHex(o.tone || '#9a88ff', '#d8d0ff', lit * .6));
    const g0 = ctx.createLinearGradient(o.x - 60 * s * dir, hy - 20 * s, o.x + 70 * s * dir, bot);
    g0.addColorStop(0, '#c7beff'); g0.addColorStop(1, lerpHex('#5e4dd6', '#8f7dff', lit * .6));
    const side = (sd, fill) => {
      ctx.fillStyle = fill; ctx.beginPath();
      limb(ctx, X(J.hip) + (sd === 'L' ? -2 : 2) * s * dir, Y(J.hip), X(J['knee' + sd]), Y(J['knee' + sd]), R.thigh0 * s, R.thigh1 * s);
      limb(ctx, X(J['knee' + sd]), Y(J['knee' + sd]), X(J['foot' + sd]), Y(J['foot' + sd]), R.thigh1 * s, R.shin1 * s);
      ctx.fill();
    };
    const arm = (sd, fill) => {
      ctx.fillStyle = fill; ctx.beginPath();
      limb(ctx, X(J['sh' + sd]), Y(J['sh' + sd]), X(J['elb' + sd]), Y(J['elb' + sd]), R.arm0 * s, R.arm1 * s);
      limb(ctx, X(J['elb' + sd]), Y(J['elb' + sd]), X(J['hand' + sd]), Y(J['hand' + sd]), R.arm1 * s, R.fore1 * s);
      ctx.fill();
    };
    arm('L', g0); side('L', g0);
    ctx.fillStyle = g1; ctx.beginPath(); limb(ctx, X(J.hip), Y(J.hip), X(J.neck), Y(J.neck), R.hip * s, R.chest * s); ctx.fill();
    side('R', g1);
    // head: soft sphere
    const r = DIM.head * s, hg = ctx.createRadialGradient(hx - r * .38 * dir, hy - r * .42, r * .1, hx, hy, r * 1.05);
    hg.addColorStop(0, '#ffffff'); hg.addColorStop(.55, lerpHex('#ddd6ff', '#ffffff', lit * .5)); hg.addColorStop(1, lerpHex('#8d7aff', '#c9bfff', lit * .5));
    ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(hx, hy, r, 0, TAU); ctx.fill();
    if (p.prop === 'phone' || o.prop === 'phone') {        // small glowing phone in the near hand + light on the face
      const [px, py] = out.handR; ctx.save(); ctx.translate(px, py); ctx.rotate(-.5 * dir);
      ctx.fillStyle = '#ffffff'; roundRect(ctx, -9 * s, -26 * s, 18 * s, 30 * s, 4 * s); ctx.fill(); ctx.restore();
    }
    arm('R', g1);
    ctx.restore();
    return out;
  }
  function lerpHex(a, b, k) {
    const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16);
    const c = i => Math.round(lerp((A >> i) & 255, (B >> i) & 255, clamp(k)));
    return `rgb(${c(16)},${c(8)},${c(0)})`;
  }
  function roundRect(ctx, x, y, w, h, r) {
    r = Math.max(0, Math.min(r, w / 2, h / 2)); ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }

  // ------------------------------------------------------------------ props
  /* ground(ctx, x0, x1, y, {a, w, prog, from:'left'|'center'}) thin glowing line with faded ends */
  function ground(ctx, x0, x1, y, o = {}) {
    const k = o.prog == null ? 1 : clamp(o.prog); if (k <= 0) return;
    let a0 = x0, a1 = x1;
    if (o.from === 'left') a1 = lerp(x0, x1, k); else { const c = (x0 + x1) / 2; a0 = lerp(c, x0, k); a1 = lerp(c, x1, k); }
    ctx.save(); ctx.globalAlpha *= o.a == null ? 1 : o.a;
    const g = ctx.createLinearGradient(a0, 0, a1, 0), f = Math.min(.25, 90 / Math.max(1, a1 - a0));
    g.addColorStop(0, rgba(C.line, 0)); g.addColorStop(f, rgba('#a596ff', 1)); g.addColorStop(1 - f, rgba('#a596ff', 1)); g.addColorStop(1, rgba(C.line, 0));
    ctx.fillStyle = g; const w = o.w || 4; roundRect(ctx, a0, y - w / 2, a1 - a0, w, w / 2); ctx.fill(); ctx.restore();
  }
  /* block(ctx, x, yBottom, w, h, {a, r, lit}) soft 3D-ish slab: vertical lavender gradient, light left face, top highlight */
  function block(ctx, x, yb, w, h, o = {}) {
    if (h <= 0 || w <= 0) return;
    ctx.save(); ctx.globalAlpha *= o.a == null ? 1 : o.a;
    if (o.rot) { ctx.translate(x + w / 2, yb - h / 2); ctx.rotate(o.rot); ctx.translate(-(x + w / 2), -(yb - h / 2)); }
    const lit = o.lit || 0, r = o.r == null ? Math.min(7, w / 5, h / 3) : o.r;
    const g = ctx.createLinearGradient(0, yb - h, 0, yb + (o.span || 0));
    g.addColorStop(0, lerpHex('#ddd8ff', '#ffffff', lit)); g.addColorStop(1, lerpHex('#6f5ce8', '#a898ff', lit));
    ctx.fillStyle = g; roundRect(ctx, x, yb - h, w, h, r); ctx.fill();
    const s = ctx.createLinearGradient(x, 0, x + w, 0);
    s.addColorStop(0, 'rgba(255,255,255,.18)'); s.addColorStop(.4, 'rgba(255,255,255,0)'); s.addColorStop(1, 'rgba(30,20,90,.22)');
    ctx.fillStyle = s; roundRect(ctx, x, yb - h, w, h, r); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.55)'; roundRect(ctx, x + r * .8, yb - h + 1.5, w - r * 1.6, Math.min(3, h / 4), 1.5); ctx.fill();
    ctx.restore();
  }
  /* tower(ctx, x, yb, n, {w, h, gap, k: [] per-block 0..1 drop-in, a}) blocks stacked, each drops in from above as k goes 0->1 */
  function tower(ctx, cx, yb, n, o = {}) {
    const w = o.w || 120, h = o.h || 50, gap = o.gap == null ? 6 : o.gap, top = [cx, yb];
    for (let i = 0; i < n; i++) {
      const k = o.k ? (typeof o.k === 'function' ? o.k(i) : o.k[i]) : 1; if (k == null || k <= 0) continue;
      const y = yb - i * (h + gap) - (1 - oC(k)) * (o.fall || 120), ww = (o.wf ? o.wf(i) : w);
      block(ctx, cx - ww / 2, y, ww, h, { a: clamp(k * 2.5) * (o.a == null ? 1 : o.a), lit: o.lit ? o.lit(i) : 0, rot: o.rot ? o.rot(i) : 0, span: o.span });
      top[1] = y - h;
    }
    return top;
  }
  function stairs(ctx, x, yb, n, w, h, o = {}) {
    for (let i = 0; i < n; i++) {
      const k = o.k ? o.k(i) : 1; if (k <= 0) continue;
      const hh = h * (i + 1) * (o.grow ? oC(k) : 1);
      block(ctx, x + i * w, yb + (o.grow ? 0 : (1 - oC(k)) * 40), w - (o.gap == null ? 6 : o.gap), hh, { a: clamp(k * 2) * (o.a == null ? 1 : o.a) * (o.fade ? (.35 + .65 * (i + 1) / n) : 1), span: o.span, lit: o.lit ? o.lit(i) : 0 });
    }
  }
  /* orb(ctx, x, y, r, {a, pulse}) the light: wide halo + bright core */
  function orb(ctx, x, y, r, o = {}) {
    ctx.save(); ctx.globalAlpha *= o.a == null ? 1 : o.a;
    const R2 = r * (3.6 + (o.pulse || 0));
    const g = ctx.createRadialGradient(x, y, 0, x, y, R2);
    g.addColorStop(0, 'rgba(255,255,255,.95)'); g.addColorStop(.22, 'rgba(207,198,255,.55)'); g.addColorStop(.55, 'rgba(122,99,255,.16)'); g.addColorStop(1, 'rgba(122,99,255,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, R2, 0, TAU); ctx.fill();
    const c = ctx.createRadialGradient(x - r * .3, y - r * .3, 0, x, y, r);
    c.addColorStop(0, '#ffffff'); c.addColorStop(.8, '#f1edff'); c.addColorStop(1, '#d9d2ff');
    ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
    ctx.restore();
  }
  /* flame(ctx, x, yb, s, t, {a, flick, wild}) teardrop flame (s=1 about 120 px tall), lavender outer, white core */
  function flame(ctx, x, yb, s, t, o = {}) {
    if (s <= .01) return;
    ctx.save(); ctx.globalAlpha *= o.a == null ? 1 : o.a;
    const wild = o.wild || 0, f = 1 + (.06 + .2 * wild) * noise1(t * (5 + 6 * wild)) ;
    const sway = (6 + 18 * wild) * noise1(t * 2.3 + 7) * s;
    const draw = (sc, c0, c1) => {
      const h = 120 * s * sc * f, w = 44 * s * sc * (1 + .05 * noise1(t * 4 + 3));
      const g = ctx.createLinearGradient(0, yb, 0, yb - h); g.addColorStop(0, c0); g.addColorStop(1, c1);
      ctx.fillStyle = g; ctx.beginPath();
      ctx.moveTo(x, yb);
      ctx.bezierCurveTo(x - w * 1.1, yb - h * .05, x - w * .9, yb - h * .55, x + sway * .5, yb - h);
      ctx.bezierCurveTo(x + w * .95, yb - h * .55, x + w * 1.1, yb - h * .05, x, yb);
      ctx.fill();
    };
    draw(1, 'rgba(122,99,255,.85)', 'rgba(207,198,255,.0)');
    draw(.78, 'rgba(180,165,255,.95)', 'rgba(220,214,255,.2)');
    draw(.48, 'rgba(255,255,255,1)', 'rgba(255,255,255,.35)');
    ctx.restore();
  }
  /* sparks(ctx, t, t0, x, y, {n, spread, up, life, seed, a}) rising embers */
  function sparks(ctx, t, t0, x, y, o = {}) {
    const n = o.n || 14, life = o.life || 1.6; ctx.save();
    for (let i = 0; i < n; i++) {
      const st = t0 + (o.every ? i * o.every : 0), u = (t - st) / life; if (u < 0 || u > 1) continue;
      const sd = (o.seed || 1) * 31 + i, ang = (hash(sd) - .5) * (o.spread || 1.4), sp = (o.up || 260) * (.5 + hash(sd * 3));
      const px = x + Math.sin(ang) * sp * u + 10 * Math.sin(u * 6 + i), py = y - Math.cos(ang) * sp * u + 40 * u * u;
      ctx.globalAlpha = (o.a == null ? 1 : o.a) * (1 - u) * .9; ctx.fillStyle = '#efeaff';
      ctx.beginPath(); ctx.arc(px, py, (2.6 + 2 * hash(sd * 7)) * (1 - u * .5), 0, TAU); ctx.fill();
    }
    ctx.restore();
  }
  function smoke(ctx, t, t0, x, y, o = {}) {
    ctx.save(); ctx.lineCap = 'round';
    for (let i = 0; i < (o.n || 3); i++) {
      const u = ((t - t0) / (o.life || 2.4) + i / (o.n || 3)) % 1; if (t < t0) break;
      ctx.globalAlpha = (o.a == null ? 1 : o.a) * .35 * Math.sin(PI * u);
      ctx.strokeStyle = C.l3; ctx.lineWidth = 5 * (1 - u * .5); ctx.beginPath();
      for (let j = 0; j <= 10; j++) { const v = j / 10, yy = y - (u * 140 + v * 60), xx = x + 14 * Math.sin(v * 5 + t * 2 + i * 2); j ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }
      ctx.stroke();
    }
    ctx.restore();
  }
  /* poly(pts) -> {len, at(u) -> {x, y, ang}, draw(ctx, u0, u1, {w, col, a, dash, glow})}  (u in 0..1 by arc length) */
  function poly(pts) {
    const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const len = L[L.length - 1];
    const at = u => {
      const d = clamp(u) * len; let i = 1; while (i < L.length - 1 && L[i] < d) i++;
      const k = (d - L[i - 1]) / ((L[i] - L[i - 1]) || 1), a = pts[i - 1], b = pts[i];
      return { x: lerp(a[0], b[0], k), y: lerp(a[1], b[1], k), ang: Math.atan2(b[1] - a[1], b[0] - a[0]), i };
    };
    const draw = (ctx, u0, u1, o = {}) => {
      if (u1 <= u0) return;
      ctx.save(); ctx.globalAlpha *= o.a == null ? 1 : o.a; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.strokeStyle = o.col || '#cfc6ff'; ctx.lineWidth = o.w || 5; if (o.dash) ctx.setLineDash(o.dash);
      if (o.dash && o.dashOff) ctx.lineDashOffset = o.dashOff;
      ctx.beginPath(); const p0 = at(u0); ctx.moveTo(p0.x, p0.y);
      const d0 = u0 * len, d1 = u1 * len;
      for (let i = 1; i < pts.length; i++) if (L[i] > d0 && L[i] < d1) ctx.lineTo(pts[i][0], pts[i][1]);
      const p1 = at(u1); ctx.lineTo(p1.x, p1.y); ctx.stroke(); ctx.restore();
    };
    return { pts, len, at, draw };
  }
  /* curve(ctrl, n) Catmull-Rom through control points -> dense points */
  function curve(P0, n = 16) {
    const out = [];
    for (let i = 0; i < P0.length - 1; i++) {
      const p0 = P0[Math.max(0, i - 1)], p1 = P0[i], p2 = P0[i + 1], p3 = P0[Math.min(P0.length - 1, i + 2)];
      for (let j = 0; j < n; j++) {
        const u = j / n, u2 = u * u, u3 = u2 * u;
        out.push([0, 1].map(c => .5 * ((2 * p1[c]) + (-p0[c] + p2[c]) * u + (2 * p0[c] - 5 * p1[c] + 4 * p2[c] - p3[c]) * u2 + (-p0[c] + 3 * p1[c] - 3 * p2[c] + p3[c]) * u3)));
      }
    }
    out.push(P0[P0.length - 1].slice()); return out;
  }
  /* rings(ctx, cx, cy, rxs[], ratio, {a: [] per ring, w, lit: [] 0..1}) concentric ground-plane ellipses (zones) */
  function rings(ctx, cx, cy, rxs, ratio, o = {}) {
    ctx.save();
    rxs.forEach((rx, i) => {
      const a = o.a ? o.a[i] : 1; if (a <= 0) return;
      const lit = o.lit ? o.lit[i] : 0;
      ctx.globalAlpha = a; ctx.strokeStyle = lerpHex('#8f7dff', '#ffffff', lit); ctx.lineWidth = (o.w || 4) + 2 * lit;
      ctx.beginPath(); ctx.ellipse(cx, cy, rx, rx * ratio, 0, 0, TAU); ctx.stroke();
    });
    ctx.restore();
  }
  /* zoneFill(ctx, cx, cy, rx, ratio, a) soft filled ellipse (use in a scene's bg()) */
  function zoneFill(ctx, cx, cy, rx, ratio, a, col) {
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(cx, cy); ctx.scale(1, ratio);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx); g.addColorStop(0, col || 'rgba(160,140,255,.5)'); g.addColorStop(1, 'rgba(122,99,255,.08)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, rx, 0, TAU); ctx.fill(); ctx.restore();
  }
  /* mountain(ctx, x0, x1, yb, px, py, {a, rough}) soft gradient massif with a rounded peak; returns surface(xx) -> y on the left face */
  function mountain(ctx, x0, x1, yb, px, py, o = {}) {
    ctx.save(); ctx.globalAlpha *= o.a == null ? 1 : o.a;
    const pts = [[x0, yb], [lerp(x0, px, .35), lerp(yb, py, .3) + 10], [lerp(x0, px, .62), lerp(yb, py, .62) - 6], [px - 24, py + 14], [px, py], [px + 26, py + 16],
      [lerp(px, x1, .4), lerp(py, yb, .38) - 8], [lerp(px, x1, .7), lerp(py, yb, .7) + 6], [x1, yb]];
    const g = ctx.createLinearGradient(0, py, 0, yb); g.addColorStop(0, 'rgba(200,190,255,.62)'); g.addColorStop(.5, 'rgba(122,99,255,.30)'); g.addColorStop(1, 'rgba(70,55,170,.14)');
    ctx.fillStyle = g; ctx.beginPath(); const c = curve(pts, 8); c.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); ctx.fill();
    // shaded right face
    ctx.fillStyle = 'rgba(20,14,60,.28)'; ctx.beginPath(); ctx.moveTo(px, py);
    const half = c.filter(p => p[0] >= px); half.forEach(p => ctx.lineTo(p[0], p[1])); ctx.lineTo(px + (x1 - px) * .18, yb); ctx.closePath(); ctx.fill();
    // ridge highlight
    ctx.strokeStyle = 'rgba(235,230,255,.55)'; ctx.lineWidth = 3; ctx.beginPath(); c.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke();
    ctx.restore();
    return c;
  }
  /* iceberg(ctx, x, waterY, s, {a, reveal 0..1 (how much of the hidden mass shows), tip, body (extra scale of each part)}) */
  function iceberg(ctx, x, wy, s, o = {}) {
    ctx.save(); ctx.globalAlpha *= o.a == null ? 1 : o.a;
    const tip = [[-70, 0], [-30, -110], [10, -150], [45, -90], [80, 0]];
    const body = [[-80, 0], [-190, 120], [-230, 300], [-150, 470], [0, 540], [170, 450], [240, 260], [180, 90], [90, 0]];
    const ts = s * (o.tip || 1), bs = s * (o.body || 1);
    const path = (P0, k) => { ctx.beginPath(); curve(P0.map(p => [x + p[0] * k, wy + p[1] * k]), 2).forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); };
    const r = o.reveal == null ? 1 : o.reveal;
    let g = ctx.createLinearGradient(0, wy, 0, wy + 540 * bs); g.addColorStop(0, `rgba(170,155,255,${.75 * r})`); g.addColorStop(1, `rgba(90,70,220,${.25 * r})`);
    ctx.fillStyle = g; path(body, bs); ctx.fill();
    g = ctx.createLinearGradient(0, wy - 150 * ts, 0, wy); g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#9d8cff');
    ctx.fillStyle = g; path(tip, ts); ctx.fill();
    ctx.restore();
  }
  /* road(ctx, cx, yTop, yBot, {wTop, wBot, wave, t, a, prog}) perspective road; wave>0 bends it (S-curves); centre dashes flow with t */
  function road(ctx, cx, y0, y1, o = {}) {
    const n = 40, wT = o.wTop || 40, wB = o.wBot || 360, wave = o.wave || 0, k = o.prog == null ? 1 : o.prog;
    const P0 = [], Lf = [], Rt = [];
    for (let i = 0; i <= n; i++) {
      const v = i / n; if (v > k) break;
      const y = lerp(y1, y0, Math.pow(v, .8)), w = lerp(wB, wT, v), x = cx + wave * Math.sin(v * PI * 3.2) * (1 - v * .6) * 160;
      P0.push([x, y]); Lf.push([x - w / 2, y]); Rt.push([x + w / 2, y]);
    }
    if (P0.length < 2) return;
    ctx.save(); ctx.globalAlpha *= o.a == null ? 1 : o.a;
    ctx.fillStyle = 'rgba(122,99,255,.16)'; ctx.beginPath(); Lf.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); Rt.slice().reverse().forEach(p => ctx.lineTo(p[0], p[1])); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#a596ff'; ctx.lineWidth = 3; ctx.lineCap = 'round';
    [Lf, Rt].forEach(E => { ctx.beginPath(); E.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); });
    const pl = poly(P0); pl.draw(ctx, 0, 1, { w: 4, col: '#efeaff', dash: [18, 22], dashOff: -(o.t || 0) * 60, a: .8 });
    ctx.restore();
    return pl;
  }
  /* scribble(ctx, cx, cy, r, t, {a, k}) tangled thought loops (overthinking) */
  function scribble(ctx, cx, cy, r, t, o = {}) {
    ctx.save(); ctx.globalAlpha *= o.a == null ? 1 : o.a; ctx.strokeStyle = '#cfc6ff'; ctx.lineWidth = 3.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); const N = 140, k = o.k == null ? 1 : o.k;
    for (let i = 0; i <= N * k; i++) {
      const u = i / N * TAU * 3, rr = r * (.55 + .45 * Math.sin(u * 1.7 + t * 1.3 + 1));
      const x = cx + Math.cos(u + t * .9) * rr * 1.25, y = cy + Math.sin(u * 1.13 + t * .7) * rr * .8;
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.stroke(); ctx.restore();
  }
  function sparkle(ctx, x, y, r, o = {}) {
    if (r <= 0) return; ctx.save(); ctx.globalAlpha *= o.a == null ? 1 : o.a; ctx.fillStyle = o.col || '#ffffff'; ctx.translate(x, y); ctx.rotate(o.rot || 0);
    ctx.beginPath(); for (let i = 0; i < 8; i++) { const a = i * PI / 4, rr = i % 2 ? r * .22 : r; ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } ctx.closePath(); ctx.fill(); ctx.restore();
  }
  /* trail(ctx, pts, prog, {a}) a dotted glowing path: dots light up as prog passes them */
  function dots(ctx, pl, prog, o = {}) {
    const n = o.n || 24; ctx.save();
    for (let i = 0; i <= n; i++) { const u = i / n, p = pl.at(u), on = prog >= u ? 1 : 0;
      ctx.globalAlpha = (o.a == null ? 1 : o.a) * (on ? 1 : .35); ctx.fillStyle = on ? '#ffffff' : '#8f7dff';
      ctx.beginPath(); ctx.arc(p.x, p.y, on ? (o.r || 4.5) : (o.r || 4.5) * .7, 0, TAU); ctx.fill(); }
    ctx.restore();
  }

  window.Quiet = {
    W, H, C, KIT, clamp, seg, lerp, io, oC, iC, ioC, oBack, smooth, tri, hash, noise1, rgba, lerpHex, roundRect,
    stage, engine, boot, hideInvisible, safeGuide, fitText, show, label, hook, closing, cta, watermark, txt,
    POSE, P, mix, tl, fig, solve, DIM,
    ground, block, tower, stairs, orb, flame, sparks, smoke, poly, curve, rings, zoneFill, mountain, iceberg, road, scribble, sparkle, dots,
  };
})();

/* ======================================================================================================
 * SCENE LIBRARY + ASSEMBLER (Quiet.SCENES, Quiet.timeline, Quiet.assemble)
 * Each scene is self-contained and parameterised only by its label texts:
 *   SCENES[id] = { dur, title, labels: {slot: 'DEFAULT TEXT'}, slots: {slot: {x, y, w, size, at}}, sfx: [[lt, name, gain, pitch]],
 *                  draw(ctx, lt, o), bg?(ctx, lt, o) }       o = { dur, last }  (lt runs past dur when the scene is the last one:
 *                  it must keep a calm, moving "answer" state; art stays inside y 450-1120 and out of the slots / CTA band y 1140-1200)
 * Layout grid: hook / closing y 270-420 (no art), art y 450-1120 (ground GY = 1100), labels band y 1140, CTA y 1150, watermark y 1222.
 * ====================================================================================================== */
(function () {
  'use strict';
  const Q = window.Quiet;
  const { clamp, seg, lerp, io, oC, iC, tri, hash, noise1, POSE, P, mix, tl, fig, ground, block, tower, orb, flame, sparks, smoke, poly, curve,
    rings, zoneFill, mountain, iceberg, scribble, sparkle, dots, roundRect, lerpHex } = Q;
  const PI = Math.PI, TAU = PI * 2, GY = 1100;
  const SCENES = {};
  const def = (id, o) => { o.id = id; SCENES[id] = o; };
  const LB = 1140;                                                           // label band top
  const two = (a, b, o = {}) => ({ a: Object.assign({ x: 320, y: LB, w: 390, size: 36 }, a || {}), b: Object.assign({ x: 760, y: LB, w: 390, size: 36 }, b || {}) });
  const F = (ctx, pose, x, y, s, dir, extra) => fig(ctx, pose, Object.assign({ x, y, s, dir }, extra || {}));
  const pulseAt = (lt, times, a = .25, b = .4) => times.reduce((m, ti) => Math.max(m, tri(lt, ti - a, ti + b)), 0);
  const underground = (ctx, y0, a = 1) => {
    const g = ctx.createLinearGradient(0, y0, 0, 1800); g.addColorStop(0, `rgba(10,7,30,${.8 * a})`); g.addColorStop(.55, `rgba(5,3,16,${.7 * a})`); g.addColorStop(1, 'rgba(5,4,14,0)');
    ctx.fillStyle = g; ctx.fillRect(0, y0, 1080, 1800 - y0);
  };

  // ---------------------------------------------------------------- 1. perfectionism vs consistency (towers)
  const PC_T = i => .4 + (i - 2) * .5;
  def('perfectionism-vs-consistency', {
    title: 'Perfectionism vs consistency (towers)', dur: 6.5,
    labels: { a: 'PERFECTIONISM', b: 'CONSISTENCY' }, slots: two(),
    sfx: [...Array.from({ length: 10 }, (_, j) => [PC_T(j + 2) + .4, 'soft_tap', -17, j * .5]), [.75, 'air', -22], [3.15, 'air', -22], [5.55, 'air', -22]],
    draw(ctx, lt) {
      ground(ctx, 140, 940, GY);
      const bx = 360; block(ctx, bx - 65, GY - 2, 130, 56);
      const u = (lt + .6) % 2.4, kd = oC(seg(u, 0, .45)), wob = seg(u, .45, 1.3), kf = seg(u, 1.3, 2.0);
      if (kf < 1) block(ctx, bx - 55 + kf * 80, GY - 64 - (1 - kd) * 90 + kf * kf * 60, 110, 50, { rot: Math.sin(wob * 16) * .08 * wob + kf * kf * 1.2, a: (1 - kf) * clamp(kd * 3) });
      const pl = POSE.place(lt), th = POSE.think(lt), sl = POSE.slump(lt);
      const p = u < .45 ? mix(sl, pl, io(seg(u, 0, .3))) : u < 1.3 ? mix(pl, th, io(seg(u, .45, .85))) : mix(th, sl, io(seg(u, 1.3, 1.7)));
      F(ctx, p, 200, GY - 2, 1.02, 1);
      tower(ctx, 760, GY - 2, 12, { w: 110, h: 42, gap: 6, fall: 110, k: i => seg(lt, PC_T(i), PC_T(i) + .45), lit: i => 1 - seg(lt, PC_T(i) + .3, PC_T(i) + 1.2) });
      const pu = pulseAt(lt, Array.from({ length: 12 }, (_, i) => PC_T(i)));
      F(ctx, mix(POSE.stand(lt), POSE.place(lt), pu * .8), 625, GY - 2, 1.02, 1);
    },
  });

  // ---------------------------------------------------------------- 2. motivation vs discipline (flare vs steady flame)
  const logs = (ctx, x) => { block(ctx, x - 44, GY - 2, 88, 13, { rot: .12, r: 6 }); block(ctx, x - 44, GY - 2, 88, 13, { rot: -.12, r: 6 }); };
  def('motivation-vs-discipline', {
    title: 'Motivation (a flare that fizzles) vs discipline (a small steady flame)', dur: 6.5,
    labels: { a: 'MOTIVATION', b: 'DISCIPLINE' }, slots: two(),
    sfx: [[.35, 'flare', -12], [2.3, 'fizz', -16], [3.6, 'soft_tap', -20, -3], [3.9, 'soft_chime', -20, -5]],
    draw(ctx, lt) {
      ground(ctx, 140, 940, GY);
      logs(ctx, 330);
      const big = lt < 1 ? lerp(1.7, 2.6, oC(seg(lt, .2, 1))) : lerp(2.6, 0, io(seg(lt, 2.0, 3.9)));
      flame(ctx, 330, GY - 8, big, lt, { wild: .8 });
      sparks(ctx, lt, .35, 340, GY - 220, { n: 20, life: 1.5, up: 280, spread: 1.7, every: .05 });
      if (lt > 3.2) smoke(ctx, lt, 3.2, 330, GY - 16, { a: seg(lt, 3.2, 3.8) });
      F(ctx, tl([[0, 'celebrate'], [2.3, 'stand', {}, .6], [3.6, 'slump', {}, .7]])(lt), 185, GY - 2, 1.02, 1);
      logs(ctx, 815);
      flame(ctx, 815, GY - 8, .78 + .14 * io(seg(lt, 0, 6)) + .14 * tri(lt, 3.8, 5.0), lt + 10, { wild: .05 });
      block(ctx, 600, GY - 2, 84, 60);
      const sit = POSE.sit(lt, { h: 67 }), feed = Object.assign({}, sit, { aR: 82, eR: 6, lean: 16 });
      F(ctx, mix(sit, feed, io(Math.min(1, tri(lt, 3.2, 4.4) * 1.4))), 640, GY - 2, 1.02, 1);
    },
  });

  // ---------------------------------------------------------------- 3. comfort zone -> growth zone (rings)
  const CZ = { cx: 540, cy: 820, rx: [170, 320, 440], ratio: .5 };
  const czX = lt => lerp(540, 915, io(seg(lt, 1.9, 5.3)));
  def('comfort-to-growth', {
    title: 'Comfort zone -> growth zone (figure steps out through the rings)', dur: 7,
    labels: { a: 'COMFORT ZONE', b: 'GROWTH ZONE' },
    slots: { a: { x: 540, y: 921, w: 270, size: 28 }, b: { x: 540, y: 1062, w: 420, size: 34, at: 3.6 } },
    sfx: [[1.2, 'air', -20], [2.75, 'soft_chime', -18, 0], [4.05, 'soft_chime', -17, 4], [5.2, 'shimmer', -14]],
    bg(ctx, lt) {
      const out = seg(lt, 1.9, 5.3);
      zoneFill(ctx, CZ.cx, CZ.cy, CZ.rx[0], CZ.ratio, .75 - .35 * out);
      zoneFill(ctx, CZ.cx, CZ.cy, CZ.rx[2], CZ.ratio, .15 + .35 * io(seg(lt, 4.6, 6)), 'rgba(190,175,255,.35)');
    },
    draw(ctx, lt) {
      const x = czX(lt), lit = CZ.rx.map((r, i) => clamp(1 - Math.abs(x - (CZ.cx + r)) / 70) + (x > CZ.cx + r ? .25 : 0));
      lit[2] = Math.max(lit[2], .8 * io(seg(lt, 5, 6)));
      rings(ctx, CZ.cx, CZ.cy, CZ.rx, CZ.ratio, { a: [1, .85, .9], w: 4, lit });
      const p = tl([[0, 'hug'], [1.1, 'stand', {}, .7], [1.9, (u) => POSE.walk(u, { rate: 1.05 }), {}, .4], [5.3, 'celebrate', {}, .5]])(lt);
      F(ctx, p, x, CZ.cy, lerp(.8, .95, io(seg(lt, 4.6, 5.8))), 1, { glow: io(seg(lt, 4.4, 5.8)) });
    },
  });

  // ---------------------------------------------------------------- 4. procrastinating / overthinking / doing (mountain)
  const MT = poly(curve([[610, 1100], [930, 1030], [700, 950], [960, 870], [760, 790], [900, 715], [850, 628]], 10));
  const mtU = lt => io(seg(lt, .4, 6.6));
  def('procrastinate-overthink-do', {
    title: 'Procrastinating / overthinking / doing (only Doing climbs the mountain)', dur: 7.5,
    labels: { a: 'PROCRASTINATING', b: 'OVERTHINKING', c: 'DOING' },
    slots: { a: { x: 290, y: LB, w: 330, size: 32 }, b: { x: 425, y: 712, w: 320, size: 30 }, c: { x: 700, y: LB, w: 220, size: 34 } },
    sfx: [[.5, 'soft_tap', -20], [6.6, 'shimmer', -13], [6.75, 'soft_chime', -16, 2]],
    draw(ctx, lt, o) {
      const sun = io(seg(lt, 6.2, 8));
      if (sun > 0) orb(ctx, 850, lerp(640, 545, sun), 18, { a: sun });
      mountain(ctx, 520, 1160, GY, 850, 600);
      ground(ctx, 140, 940, GY);
      const u = mtU(lt);
      MT.draw(ctx, 0, 1, { w: 4, col: '#8f7dff', a: .55, dash: [2, 14] });
      MT.draw(ctx, 0, u, { w: 4, col: '#efeaff', a: .9 });
      const dim = o.last ? 1 - .55 * seg(lt, o.dur - .6, o.dur + .6) : 1;
      F(ctx, POSE.recline(lt), 215, GY - 2, .8, 1, { a: dim });
      const th = POSE.think(lt); th.hL += 6 * Math.sin(lt * 1.7); th.hR -= 6 * Math.sin(lt * 1.7);
      const J = F(ctx, th, 425, GY - 2, .8, Math.sin(lt * .9) > 0 ? 1 : -1, { a: dim });
      scribble(ctx, 425, J.top - 62, 42, lt, { a: .9 * dim });
      const p = MT.at(u), nx = MT.at(Math.min(1, u + .01)), dir = nx.x >= p.x ? 1 : -1;
      const s = lerp(.7, .42, u);
      const pose = u >= .999 ? mix(POSE.climb(lt), POSE.celebrate(lt), io(seg(lt, 6.6, 7.1))) : POSE.climb(lt, { rate: 1.1 });
      F(ctx, pose, p.x, p.y, s, u >= .999 ? 1 : dir, { glow: io(seg(lt, 6.4, 7.4)) });
    },
  });

  // ---------------------------------------------------------------- 5. expectation vs reality (lines)
  const EXP = poly([[180, 720], [900, 500]]);
  const REAL = poly(curve([[180, 1060], [260, 990], [320, 1045], [400, 950], [450, 1000], [500, 1030], [560, 920], [610, 960], [680, 880], [730, 930], [790, 820], [840, 850], [900, 760]], 12));
  def('expectation-vs-reality', {
    title: 'Expectation (a straight line) vs reality (a wavy line that still ends higher)', dur: 6.5,
    labels: { a: 'EXPECTATION', b: 'REALITY' },
    slots: { a: { x: 330, y: 466, w: 360, size: 34 }, b: { x: 300, y: LB, w: 330, size: 36 } },
    sfx: [[.3, 'air', -20], [2.2, 'soft_tap', -18, 5], [5.7, 'soft_chime', -15, 3]],
    draw(ctx, lt) {
      ctx.save(); ctx.globalAlpha = .45; ctx.strokeStyle = '#8f7dff'; ctx.lineWidth = 2;
      [[160, 740, 920, 740], [160, 1080, 920, 1080]].forEach(l => { ctx.beginPath(); ctx.moveTo(l[0], l[1]); ctx.lineTo(l[2], l[3]); ctx.stroke(); }); ctx.restore();
      const ua = .15 + .85 * io(seg(lt, 0, 2.2)), ub = .05 + .95 * seg(lt, .2, 5.7);
      EXP.draw(ctx, 0, ua, { w: 6, col: '#efeaff' });
      REAL.draw(ctx, 0, 1, { w: 4, col: '#8f7dff', a: .3, dash: [2, 12] });
      REAL.draw(ctx, 0, ub, { w: 6, col: '#efeaff' });
      const pa = EXP.at(ua); F(ctx, ua >= .999 ? POSE.stand(lt) : POSE.walk(lt, { rate: 1.8 }), pa.x, pa.y - 3, .32, 1);
      const pb = REAL.at(ub), nb = REAL.at(Math.min(1, ub + .01)), down = nb.y > pb.y + .5;
      F(ctx, ub >= .999 ? POSE.celebrate(lt) : (down ? POSE.walk(lt, { rate: 1.3, lean: -4 }) : POSE.climb(lt, { rate: 1.2 })), pb.x, pb.y - 3, .32, 1);
      if (ua >= .999) orb(ctx, 900, 500, 7, { a: .8 });
      const end = seg(lt, 5.6, 6.2); if (end > 0) { orb(ctx, 900, 760, 8 + 3 * end, { a: end }); sparkle(ctx, 900, 760, 34 * tri(lt, 5.6, 6.6), { a: .9 }); }
    },
  });

  // ---------------------------------------------------------------- 6. the 1% rule (tiny steps -> huge staircase, camera pulls back)
  const ST = { n: 40, w: 22, h: 12 };
  const stN = lt => 3 + 37 * Math.pow(seg(lt, .2, 5.8), 1.25);
  const stCam = lt => { const k = io(seg(lt, .6, 5.8)), j = Math.max(0, stN(lt) - 1.5);
    return { z: lerp(3.2, .9, k), fx: lerp((j + .5) * ST.w, 0, k), fy: lerp(-(j + 1) * ST.h, 0, k), ax: lerp(540, 144, k), ay: lerp(1000, 1100, k) }; };
  def('one-percent-rule', {
    title: 'The 1% rule (tiny daily steps become a huge staircase)', dur: 7,
    labels: { a: 'THE 1% RULE', b: 'IT ADDS UP.' },
    slots: { a: { x: 540, y: 480, w: 600, size: 44 }, b: { x: 540, y: LB, w: 600, size: 38, at: 4.6 } },
    sfx: [[.4, 'soft_tap', -18], [1.0, 'swell', -14], [4.7, 'shimmer', -13]],
    draw(ctx, lt) {
      const c = stCam(lt), X = wx => c.ax + (wx - c.fx) * c.z, Y = wy => c.ay + (wy - c.fy) * c.z;
      ground(ctx, 100, 980, GY + 1, { a: .9 });
      const n = stN(lt);
      for (let i = 0; i < ST.n; i++) {
        const k = clamp(n - i); if (k <= 0) break;
        const x0 = X(i * ST.w), x1 = X((i + 1) * ST.w) - Math.max(1, 2 * c.z * .5);
        if (x1 < -40 || x0 > 1120) continue;
        const top = Y(-(i + 1) * ST.h);
        block(ctx, x0, Math.min(GY, Y(0)), x1 - x0, (Math.min(GY, Y(0)) - top) * oC(k), { a: clamp(k * 2) * (.45 + .55 * (i + 1) / ST.n), r: Math.min(5, 2 * c.z), lit: 1 - seg(n - i, 1, 2.5) });
      }
      const j = Math.max(0, Math.floor(n) - 1), fx = (j + .5) * ST.w;
      F(ctx, n >= ST.n ? POSE.celebrate(lt) : POSE.climb(lt, { rate: 1.3 }), X(fx), Y(-(j + 1) * ST.h), .13 * c.z, 1, { glow: seg(lt, 5.4, 6.4) });
    },
  });

  // ---------------------------------------------------------------- 7. what people see vs what it took (podium + hidden tunnel)
  const SURF = 640;
  const TUN = poly([[180, 1110], [900, 1110], [900, 990], [180, 990], [180, 870], [900, 870], [900, 750], [720, 750], [720, SURF - 4]]);
  def('seen-vs-hidden', {
    title: 'What people see (podium) vs what it took (a long hidden tunnel of work)', dur: 7,
    labels: { a: 'WHAT PEOPLE SEE', b: 'WHAT IT TOOK' },
    slots: { a: { x: 320, y: 520, w: 380, size: 32 }, b: { x: 480, y: 912, w: 420, size: 32, at: 1.2 } },
    sfx: [[.2, 'soft_chime', -18, 7], [1.1, 'swell', -15], [6.1, 'shimmer', -13]],
    bg(ctx, lt) { underground(ctx, SURF, .35 + .65 * io(seg(lt, .6, 1.6))); },
    draw(ctx, lt) {
      const rev = io(seg(lt, .6, 1.6)), u = seg(lt, 1.0, 6.0);
      TUN.draw(ctx, 0, 1, { w: 28, col: '#2c2470', a: rev });
      TUN.draw(ctx, 0, 1, { w: 3, col: '#8f7dff', a: .6 * rev, dash: [2, 12] });
      TUN.draw(ctx, 0, u, { w: 5, col: '#efeaff', a: rev });
      ground(ctx, 140, 940, SURF, { w: 5 });
      block(ctx, 660, SURF - 2, 120, 48, { lit: .2 });
      F(ctx, POSE.celebrate(lt), 720, SURF - 50, .62, 1, { glow: .3 + .7 * tri(lt, 5.8, 7.5) });
      if (rev > .05) {
        const p = TUN.at(u), nx = TUN.at(Math.min(1, u + .01)), vert = Math.abs(nx.x - p.x) < .5;
        F(ctx, vert ? POSE.climb(lt, { rate: 1.4 }) : POSE.walk(lt, { rate: 1.6 }), p.x, p.y + 12, .22, nx.x >= p.x ? 1 : -1, { a: rev * (1 - seg(lt, 6.0, 6.4)) });
      }
      sparkle(ctx, 720, SURF - 220, 40 * tri(lt, 5.9, 6.9), { a: .9 });
    },
  });

  // ---------------------------------------------------------------- 8. don't chase, build (orb)
  def('chase-vs-build', {
    title: "Don't chase, build (one chases a floating orb; one builds steps and the orb comes to them)", dur: 7,
    labels: { top: "DON'T CHASE. BUILD.", a: 'CHASE', b: 'BUILD' },
    slots: Object.assign({ top: { x: 540, y: 462, w: 760, size: 40, at: .6 } }, two()),
    sfx: [[3.4, 'air', -16], [5.2, 'soft_tap', -20, -4], ...[.8, 1.9, 3.0, 4.1].map((t, i) => [t + .45, 'soft_tap', -16, i * 2]), [5.9, 'shimmer', -13], [6.0, 'soft_chime', -16, 4]],
    draw(ctx, lt) {
      ground(ctx, 140, 940, GY);
      // left: chasing
      const run = seg(lt, 0, 3.4), fx = lerp(170, 360, io(run)) + (lt > 3.4 ? 40 * io(seg(lt, 3.4, 4.2)) : 0);
      const jump = tri(lt, 3.4, 4.2), ox = Math.min(480, fx + 120 + 60 * io(seg(lt, 3.3, 4.4))), oy = 830 - 90 * io(seg(lt, 3.2, 4.4)) + 14 * Math.sin(lt * 2.4) - 120 * io(seg(lt, 4.6, 6.5));
      orb(ctx, ox, oy, 12, { a: 1 - .7 * seg(lt, 4.8, 6.5) });
      const lp = lt < 3.4 ? POSE.walk(lt, { rate: 1.9, stride: 1.2, lean: 14 }) : lt < 4.3 ? POSE.jump(lt) : POSE.slump(lt);
      F(ctx, lt < 3.4 ? lp : mix(lt < 4.3 ? POSE.walk(lt, { rate: 1.9 }) : POSE.jump(lt), lp, io(seg(lt, lt < 4.3 ? 3.4 : 4.3, lt < 4.3 ? 3.6 : 4.7))), fx, GY - 2 - 120 * jump, .8, 1);
      // right: building
      const T = [.8, 1.9, 3.0, 4.1], sw = 70;
      for (let i = 0; i < 4; i++) { const k = seg(lt, T[i], T[i] + .45); if (k > 0) block(ctx, 600 + i * sw, GY - 2 - (1 - oC(k)) * 60, sw - 6, 60 * (i + 1), { a: clamp(k * 3), lit: 1 - seg(lt, T[i] + .3, T[i] + 1.2) }); }
      let st = -1; T.forEach((ti, i) => { if (lt > ti + .55) st = i; });
      const hop = T.reduce((m, ti) => Math.max(m, tri(lt, ti + .55, ti + .95)), 0);
      const bx = st < 0 ? 560 : 600 + st * sw + sw / 2 - 3, by = st < 0 ? GY - 2 : GY - 2 - 60 * (st + 1);
      const pBuild = mix(POSE.stand(lt), POSE.place(lt), pulseAt(lt, T, .35, .3));
      const pr = lt > 5.3 ? mix(pBuild, POSE.reach(lt), io(seg(lt, 5.3, 5.9))) : pBuild;
      F(ctx, pr, bx, by - 34 * hop, .6, 1, { glow: io(seg(lt, 5.8, 6.6)) });
      const orx = lerp(880, bx + 6, io(seg(lt, 3.8, 5.9))), ory = lerp(560, by - 175, io(seg(lt, 3.8, 5.9))) + 8 * Math.sin(lt * 2);
      orb(ctx, orx, ory, 13 + 3 * io(seg(lt, 5.9, 6.6)), { a: 1, pulse: .6 * tri(lt, 5.9, 7) });
    },
  });

  // ---------------------------------------------------------------- 9. confidence vs ego (icebergs)
  const WY = 760;
  def('confidence-vs-ego', {
    title: 'Confidence (small tip, huge base) vs ego (big tip, nothing underneath)', dur: 6.5,
    labels: { a: 'CONFIDENCE', b: 'EGO' }, slots: two(),
    sfx: [[.6, 'swell', -16], [3.2, 'air', -20], [4.6, 'soft_chime', -17, 2]],
    bg(ctx, lt) { underground(ctx, WY + 4 * Math.sin(lt * 1.3), .7); },
    draw(ctx, lt) {
      const rev = .3 + .7 * io(seg(lt, .5, 2.6)), bob = 5 * Math.sin(lt * 1.3);
      iceberg(ctx, 320, WY + bob, .62, { tip: .85, reveal: rev });
      F(ctx, POSE.stand(lt), 326, WY + bob - 150 * .62 * .85 + 6, .36, 1);
      ctx.save(); const r = .07 * Math.sin(lt * 2.1) + .05 * tri(lt, 3.0, 4.2) * Math.sin(lt * 9);
      ctx.translate(770, WY); ctx.rotate(r); ctx.translate(-770, -WY);
      iceberg(ctx, 770, WY + bob * .6, .62, { tip: 2.1, body: .28, reveal: rev });
      F(ctx, mix(POSE.celebrate(lt), POSE.stand(lt), .3), 776, WY + bob * .6 - 150 * .62 * 2.1 + 8, .34, 1);
      ctx.restore();
      ctx.save(); ctx.strokeStyle = '#cfc6ff'; ctx.lineWidth = 3; ctx.globalAlpha = .9; ctx.beginPath();
      for (let x = 140; x <= 940; x += 10) { const y = WY + 4 * Math.sin(x * .03 + lt * 2) + 2 * Math.sin(lt * 1.3); x === 140 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
      ctx.stroke(); ctx.restore();
    },
  });

  // ---------------------------------------------------------------- 10. don't quit in the dip
  const DIP = poly(curve([[150, 700], [260, 760], [360, 900], [450, 1030], [520, 1060], [590, 1030], [680, 920], [780, 760], [860, 620], [930, 545]], 12));
  const dipU = lt => lt < 2.4 ? .46 * io(seg(lt, 0, 2.4)) * 1 : .46 + .54 * io(seg(lt, 3.6, 6.3));
  def('the-dip', {
    title: "The dip (it gets harder before it gets better: keep going)", dur: 6.5,
    labels: { a: 'THE DIP', b: 'KEEP GOING' }, slots: two({ x: 400, w: 300 }, { at: 3.6 }),
    sfx: [[2.4, 'air', -20], [3.6, 'swell', -15], [6.2, 'shimmer', -13]],
    draw(ctx, lt) {
      const u = Math.max(.02, dipU(lt));
      DIP.draw(ctx, 0, 1, { w: 4, col: '#8f7dff', a: .45, dash: [2, 12] });
      DIP.draw(ctx, 0, u, { w: 6, col: '#efeaff' });
      const p = DIP.at(u), nx = DIP.at(Math.min(1, u + .01));
      const pose = lt < 2.4 ? POSE.walk(lt, { rate: 1.2, lean: 0 }) : lt < 3.6 ? mix(POSE.walk(lt), POSE.slump(lt), io(seg(lt, 2.4, 2.8)) * (1 - io(seg(lt, 3.3, 3.6)))) :
        (u >= .999 ? mix(POSE.climb(lt), POSE.celebrate(lt), io(seg(lt, 6.3, 6.8))) : POSE.climb(lt, { rate: 1.1 }));
      F(ctx, pose, p.x, p.y - 3, .5, 1, { glow: io(seg(lt, 5.6, 6.6)) });
      const e = seg(lt, 6.1, 6.8); if (e > 0) orb(ctx, 930, 520, 10, { a: e });
    },
  });

  // ---------------------------------------------------------------- 11. roots first (bamboo)
  const RG = 820;
  const ROOTS = (() => {
    const out = []; let sd = 3;
    const br = (x, y, ang, len, d, d0, w) => {
      const x1 = x + Math.sin(ang) * len, y1 = Math.min(1100, y + Math.cos(ang) * len);
      out.push([x, y, x1, y1, d0, d0 + len, w]);
      if (d >= 4) return;
      const n = d < 2 ? 2 : 2 + (hash(sd++) > .5 ? 1 : 0);
      for (let i = 0; i < n; i++) br(x1, y1, ang + (i - (n - 1) / 2) * (.95 - d * .1) + (hash(sd++) - .5) * .3, len * (.72 + .12 * hash(sd++)), d + 1, d0 + len, w * .72);
    };
    br(560, RG + 4, 0, 105, 0, 0, 10); return out;
  })();
  const RMAX = Math.max(...ROOTS.map(r => r[5]));
  def('roots-first', {
    title: 'Results come late: roots grow underground first, then the bamboo shoots up', dur: 7,
    labels: { a: 'ROOTS FIRST', b: 'THEN GROWTH' },
    slots: { a: { x: 540, y: LB, w: 420, size: 36 }, b: { x: 800, y: 560, w: 300, size: 32, at: 5.0 } },
    sfx: [[.4, 'soft_tap', -20, -5], [1.0, 'swell', -17], [4.6, 'air', -14], [5.0, 'shimmer', -13]],
    bg(ctx) { underground(ctx, RG, .9); },
    draw(ctx, lt) {
      const g = io(seg(lt, .4, 4.4));
      ctx.save(); ctx.strokeStyle = '#b9adff'; ctx.lineCap = 'round';
      ROOTS.forEach(([x0, y0, x1, y1, d0, d1, w]) => { const k = clamp((g * RMAX - d0) / (d1 - d0)); if (k <= 0) return; ctx.globalAlpha = .85; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(lerp(x0, x1, k), lerp(y0, y1, k)); ctx.stroke(); });
      ctx.restore();
      ground(ctx, 140, 940, RG, { w: 5 });
      const h = 14 + 336 * oC(seg(lt, 4.5, 6.3));
      const sw = 3 * Math.sin(lt * 1.4);
      for (let y = 0; y < h; y += 48) { const hh = Math.min(46, h - y); block(ctx, 547 + sw * y / 350, RG - y, 26, hh, { r: 8 }); }
      [[.45, -1], [.62, 1], [.8, -1], [.93, 1]].forEach(([f, sd], i) => { const k = seg(h, 350 * f - 20, 350 * f + 40); if (k <= 0) return;
        ctx.save(); ctx.translate(560 + sw, RG - h * f); ctx.rotate(sd * (.9 + .1 * Math.sin(lt * 2 + i))); ctx.globalAlpha = k;
        const gr = ctx.createLinearGradient(0, 0, 0, -60); gr.addColorStop(0, '#9d8cff'); gr.addColorStop(1, '#efeaff'); ctx.fillStyle = gr;
        ctx.beginPath(); ctx.ellipse(0, -40 * k, 12, 40 * k, 0, 0, TAU); ctx.fill(); ctx.restore(); });
      const p = tl([[0, 'crouch'], [4.5, 'stand', {}, .5], [5.2, 'reach', {}, .6]])(lt);
      F(ctx, p, 400, RG - 2, .8, 1, { glow: io(seg(lt, 5, 6.2)) });
    },
  });

  // ---------------------------------------------------------------- 12. noise vs focus
  def('noise-vs-focus', {
    title: 'Noise (a figure spun around by distractions) vs focus (a straight beam to the light)', dur: 6.5,
    labels: { a: 'NOISE', b: 'FOCUS' }, slots: two(),
    sfx: [[.3, 'air', -20], [2.0, 'air', -22], [5.4, 'shimmer', -13]],
    draw(ctx, lt) {
      ground(ctx, 140, 940, GY);
      for (let i = 0; i < 26; i++) {
        const a = lt * (1.2 + 1.6 * hash(i)) * (i % 2 ? 1 : -1) + i, r = 70 + 110 * hash(i * 3), cx = 300 + r * Math.cos(a) * 1.05, cy = 900 + r * .7 * Math.sin(a * 1.3 + i);
        ctx.save(); ctx.globalAlpha = .55 + .4 * Math.sin(lt * 3 + i); ctx.fillStyle = i % 3 ? '#cfc6ff' : '#ffffff';
        roundRect(ctx, cx - 7, cy - 5, 14, 10, 3); ctx.fill(); ctx.restore();
      }
      const turn = Math.sin(lt * 2.2) > 0 ? 1 : -1;
      F(ctx, POSE.think(lt * 1.6), 300, GY - 2, .8, turn);
      const x = lerp(610, 790, io(seg(lt, .4, 5.4)));
      const J = F(ctx, lt < 5.4 ? POSE.walk(lt, { rate: .9, stride: .7 }) : mix(POSE.walk(lt), POSE.reach(lt), io(seg(lt, 5.4, 6))), x, GY - 2, .8, 1, { glow: io(seg(lt, 5.2, 6.2)) });
      ctx.save(); ctx.globalAlpha = .7; const gb = ctx.createLinearGradient(x, 0, 905, 0); gb.addColorStop(0, 'rgba(239,234,255,.2)'); gb.addColorStop(1, 'rgba(255,255,255,.9)');
      ctx.strokeStyle = gb; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(J.neck[0] + 20, J.neck[1]); ctx.lineTo(905, 880); ctx.stroke(); ctx.restore();
      orb(ctx, 905, 880, 12, { pulse: .5 * tri(lt, 5.4, 6.5) });
    },
  });

  // ---------------------------------------------------------------- 13. consume vs create
  const CR = [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [.5, 2], [1.5, 2], [1, 3]];
  const crT = i => .5 + i * .6;
  def('consume-vs-create', {
    title: 'Consume (content streams into a phone) vs create (blocks become something)', dur: 6.5,
    labels: { a: 'CONSUME', b: 'CREATE' }, slots: two(),
    sfx: CR.map((c, i) => [crT(i) + .35, 'soft_tap', -18, i * .7]).concat([[5.9, 'soft_chime', -16, 5]]),
    draw(ctx, lt) {
      ground(ctx, 140, 940, GY);
      block(ctx, 190, GY - 2, 74, 48);
      const J = F(ctx, POSE.sit(lt, { h: 67 }), 226, GY - 2, .85, 1, { prop: 'phone', a: 1 - .35 * seg(lt, 1, 6) });
      const ph = J.handR;
      for (let i = 0; i < 12; i++) {
        const u = ((lt * .55 + i / 12) % 1), sx = 300 + 180 * hash(i * 5), sy = 560 + 80 * hash(i * 2);
        const x = lerp(sx, ph[0], io(u)), y = lerp(sy, ph[1] - 10, io(u)) - 60 * Math.sin(PI * u), s = 1 - .8 * u;
        ctx.save(); ctx.globalAlpha = .9 * Math.sin(PI * Math.min(1, u * 1.2)); ctx.fillStyle = '#cfc6ff'; roundRect(ctx, x - 14 * s, y - 10 * s, 28 * s, 20 * s, 4 * s); ctx.fill(); ctx.restore();
      }
      const bw = 62;
      CR.forEach(([c, r], i) => { const k = seg(lt, crT(i), crT(i) + .4); if (k > 0) block(ctx, 715 + c * bw, GY - 2 - r * 56 - (1 - oC(k)) * 50, bw - 6, 50, { a: clamp(k * 3), lit: 1 - seg(lt, crT(i) + .2, crT(i) + 1) }); });
      F(ctx, mix(POSE.stand(lt), POSE.place(lt), pulseAt(lt, CR.map((_, i) => crT(i)), .3, .3)), 640, GY - 2, .8, 1, { glow: io(seg(lt, 5.6, 6.4)) });
      sparkle(ctx, 777, GY - 2 - 4 * 56 + 4, 30 * tri(lt, 5.8, 6.8));
    },
  });

  // ---------------------------------------------------------------- 14. busy vs productive
  def('busy-vs-productive', {
    title: 'Busy (running in circles) vs productive (slow, straight, arrives)', dur: 6.5,
    labels: { a: 'BUSY', b: 'PRODUCTIVE' }, slots: two(),
    sfx: [[.4, 'air', -21], [2.0, 'air', -21], [3.6, 'air', -21], [5.6, 'shimmer', -13]],
    draw(ctx, lt) {
      ground(ctx, 560, 940, GY);
      const cx = 320, cy = 1015, rx = 160, ry = 52;
      ctx.save(); ctx.strokeStyle = '#a596ff'; ctx.lineWidth = 4; ctx.globalAlpha = .9; ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, TAU); ctx.stroke(); ctx.restore();
      const th = lt * 2.3 + .5, x = cx + rx * Math.cos(th), y = cy + ry * Math.sin(th), dir = -Math.sin(th) >= 0 ? 1 : -1;
      F(ctx, POSE.walk(lt, { rate: 2.2, stride: 1.25, lean: 16 }), x, y, .52 + .1 * Math.sin(th), dir);
      const px = lerp(600, 845, io(seg(lt, .3, 5.6)));
      dots(ctx, poly([[600, GY + 18], [880, GY + 18]]), (px - 600) / 280, { n: 14, r: 3.5 });
      orb(ctx, 905, 900, 11, { a: .9, pulse: .6 * tri(lt, 5.6, 6.6) });
      F(ctx, lt < 5.6 ? POSE.walk(lt, { rate: .75, stride: .8 }) : mix(POSE.walk(lt), POSE.celebrate(lt), io(seg(lt, 5.6, 6))), px, GY - 2, .8, 1, { glow: io(seg(lt, 5.4, 6.3)) });
    },
  });

  // ---------------------------------------------------------------- 15. small habits compound (snowball of light)
  const sbK = lt => io(seg(lt, .3, 5.6));
  def('small-habits-compound', {
    title: 'Small habits compound (a pushed ball of light grows as it rolls)', dur: 6.5,
    labels: { a: 'SMALL HABITS', b: 'BIG RESULTS' }, slots: two({}, { at: 3.8 }),
    sfx: [[.4, 'soft_tap', -18], [1.2, 'swell', -15], [5.6, 'shimmer', -13]],
    draw(ctx, lt) {
      ground(ctx, 140, 940, GY);
      const k = sbK(lt), r = 18 + 132 * Math.pow(k, 1.5), bx = lerp(250, 770, k), by = GY - 2 - r;
      const g = ctx.createRadialGradient(bx - r * .35, by - r * .4, r * .1, bx, by, r);
      g.addColorStop(0, '#ffffff'); g.addColorStop(.6, '#cfc6ff'); g.addColorStop(1, '#7a63ff');
      ctx.save(); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(bx, by, r, 0, TAU); ctx.fill();
      const rot = (bx - 250) / Math.max(18, r * .9);
      for (let i = 0; i < 5; i++) { const a = rot + i * TAU / 5; ctx.globalAlpha = .35 * Math.max(0, Math.cos(a - PI * 1.2)); ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(bx + Math.cos(a) * r * .62, by + Math.sin(a) * r * .62, r * .09, 0, TAU); ctx.fill(); }
      ctx.restore();
      const s = .75, push = POSE.push(lt, { rate: .7 });
      F(ctx, k >= .999 ? mix(push, POSE.celebrate(lt), io(seg(lt, 5.6, 6.1))) : push, bx - r - 48 * s, GY - 2, s, 1, { glow: io(seg(lt, 5.4, 6.3)) });
    },
  });

  // ---------------------------------------------------------------- 16. rest, don't quit
  def('rest-dont-quit', {
    title: "Rest, don't quit (one sits, rests and goes on; the other turns back and fades)", dur: 6.5,
    labels: { a: 'REST', b: "DON'T QUIT" }, slots: two({ x: 450, w: 260, at: 1.8 }, { x: 780, w: 340, at: 3.9 }),
    sfx: [[1.8, 'soft_tap', -20, -4], [3.8, 'swell', -16], [5.9, 'shimmer', -13]],
    draw(ctx, lt) {
      ground(ctx, 140, 940, GY);
      block(ctx, 410, GY - 2, 84, 46);
      const bx = lt < 1.8 ? lerp(170, 450, io(seg(lt, 0, 1.8))) : lerp(450, 860, io(seg(lt, 3.8, 6.2)));
      const p = tl([[0, (u) => POSE.walk(u, { rate: 1 })], [1.8, 'sit', { h: 66 }, .5], [3.8, (u) => POSE.walk(u, { rate: 1 }), {}, .5], [6.2, 'celebrate', {}, .5]])(lt);
      const qa = (1 - seg(lt, 3.0, 5.6)) * .5, qx = lerp(640, 230, io(seg(lt, 2.0, 5.6)));
      if (qa > 0) F(ctx, lt < 2 ? POSE.slump(lt) : POSE.walk(lt, { rate: .8, stride: .6, lean: 18 }), qx, GY - 2, .66, lt < 2 ? 1 : -1, { a: qa });
      F(ctx, p, bx, GY - 2, .8, 1, { glow: io(seg(lt, 5.4, 6.4)) });
    },
  });

  // ---------------------------------------------------------------- timeline + assembler
  /* timeline(spec) -> { scenes: [{id, i, a, b, dur}], closeAt, ctaAt, DUR } (shared by the page and make_quiet.mjs) */
  function timeline(spec) {
    let a = 0;
    const sc = spec.scenes.map((s, i) => {
      const d = SCENES[s.id]; if (!d) throw new Error('unknown quiet scene: ' + s.id + ' (known: ' + Object.keys(SCENES).join(', ') + ')');
      const dur = s.dur || d.dur, r = { id: s.id, i, a, b: a + dur, dur }; a += dur; return r;
    });
    const DUR = Math.round((a + (spec.close || 5.2)) * 30) / 30;
    return { scenes: sc, closeAt: a, ctaAt: a + .9, DUR };
  }
  function assemble(spec) {
    const st = Q.stage(), E = Q.engine(st), T = timeline(spec), DUR = T.DUR, last = T.scenes.length - 1;
    const hookEl = Q.hook(st, spec.hook || '');
    const labs = [];
    T.scenes.forEach(s => {
      const d = SCENES[s.id], L = Object.assign({}, d.labels, spec.scenes[s.i].labels || {});
      for (const k in d.slots) { if (!L[k]) continue; const sl = d.slots[k]; labs.push({ el: Q.label(st, L[k], sl), s, at: sl.at || 0 }); }
    });
    const closeEl = Q.closing(st, spec.closing || ''), ctaEl = Q.cta(st, spec.cta ? { text: spec.cta } : {});
    const wm = spec.watermark === false ? null : Q.watermark(st, spec.watermark ? { text: spec.watermark } : {});
    Q.safeGuide(st);
    const SC = T.scenes.map((s, i) => { const d = SCENES[s.id], o = { dur: s.dur, last: i === last };
      return { a: s.a, b: i === last ? DUR - .4 : s.b, draw: (c, lt) => d.draw(c, lt, o), bg: d.bg ? (c, lt) => d.bg(c, lt, o) : null }; });
    const d0 = SCENES[T.scenes[0].id], o0 = { dur: T.scenes[0].dur, last: last === 0 };
    SC.push({ a: DUR - .4, lt: () => 0, draw: c => d0.draw(c, 0, o0), bg: d0.bg ? c => d0.bg(c, 0, o0) : null });   // loop back to frame 0
    const LOOP = DUR - .38, s0 = T.scenes[0];
    function seek(t) {
      E.frame(t, SC);
      const loop = t >= DUR - .4;
      Q.show(hookEl, t, loop ? LOOP : 0, loop ? 1e9 : s0.b - .85, loop ? { d: .38 } : { hold0: true });
      for (const L of labs) {
        if (loop && L.s.i === 0 && !L.at) { Q.show(L.el, t, LOOP, 1e9, { d: .38 }); continue; }
        const first = L.s.i === 0 && !L.at;
        Q.show(L.el, t, L.s.a + (first ? 0 : (L.at || (L.s.i === 0 ? 0 : .45))), L.s.b - .85, { hold0: first });
      }
      Q.show(closeEl, t, T.closeAt + .15, DUR - .85, { d: .7 });
      Q.show(ctaEl, t, T.ctaAt, DUR - .85, { d: .6 });
      Q.hideInvisible(st);
    }
    return Q.boot({ duration: DUR, fps: 30, seek });
  }
  Object.assign(Q, { SCENES, timeline, assemble, GY });
})();
