/* dojo.js — "Habit Dojo" animated tip-list kit (global `Dojo`), 1080x1920, 30 fps, frame-pure.
 * Rules + spec format: DOJO_BIBLE.md. Assembler: make_dojo.mjs (loads this file in a Node vm for timeline()).
 * Self-contained (does not load or touch stick.js / quiet.js).
 *
 *   index.html = <script src="kit/dojo.js"></script> + Dojo.assemble(SPEC)
 *   SPEC = { hook, items: [4-6 short lines], lesson, cta, music_seed }
 *
 * Layers: bg canvas [data-bg] (sky, stars, embers, sunset glow, two mountain ranges, glow behind the ninja)
 *         #cam (camera nudge) > ninja canvas (head, headband tails, katana arc, cut-in streaks) + DOM text
 *         (hook -> header, item cards with numbered badges, lesson, CTA pill).
 * Timeline: 0 thumbnail (hook big + big ninja) | 1.0-1.75 hook shrinks to the header, ninja flies top-right |
 *           items every 2.3 s from 1.9 (streak cuts across the row, then the card pops; ninja reacts) |
 *           lesson + CTA | last ~1 s: content fades, hook + ninja return to the frame-0 layout (clean loop).
 */
(function () {
  'use strict';
  const KIT = (typeof document !== 'undefined' && document.currentScript && document.currentScript.src || '').replace(/dojo\.js(\?.*)?$/, '') || 'kit/';
  const W = 1080, H = 1920, PI = Math.PI, TAU = PI * 2;
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const seg = (t, a, b) => clamp((t - a) / (b - a));
  const lerp = (a, b, k) => a + (b - a) * k;
  const io = x => .5 - .5 * Math.cos(PI * clamp(x));
  const ioC = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  const oC = x => 1 - Math.pow(1 - clamp(x), 3);
  const oBack = (x, s = 1.7) => { x = clamp(x) - 1; return 1 + (s + 1) * x * x * x + s * x * x; };
  const tri = (t, a, b) => (t <= a || t >= b) ? 0 : Math.sin(PI * (t - a) / (b - a));
  const hash = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const $ = id => document.getElementById(id);
  const SW2D = { willReadFrequently: true };
  const C = { green: '#18785a', greenD: '#0f5c44', orange: '#ff8a2e', orangeD: '#e8721c', skin: '#f4d2b4', ink: '#0d0f18',
    cream: '#fff4e6', navy: '#0a0e26', sky1: '#1c1b41', sky2: '#272151', sky3: '#5e3865', sky4: '#834770',
    mtnBack: '#3a2a5c', mtnFront: '#141128' };

  // ------------------------------------------------------------------ timeline (shared with make_dojo.mjs)
  const FIRST = 1.9, STEP = 2.3, LESSON = 6.0, OUTRO = 1.0;
  const REACT = ['slash', 'bounce', 'nod', 'flick'];
  function timeline(spec) {
    const n = (spec.items || []).length;
    const items = (spec.items || []).map((text, i) => ({ i, text, a: FIRST + i * STEP, react: REACT[i % 4] }));
    const lessonAt = FIRST + n * STEP;
    const DUR = Math.round(Math.max(18, lessonAt + LESSON + OUTRO) * 30) / 30;
    return { items, hookOut: 1.0, lessonAt, ctaAt: lessonAt + .8, fadeAt: DUR - 1.0, backAt: DUR - .72, DUR };
  }

  // ------------------------------------------------------------------ page, CSS, text
  function el(parent, tag, cls, style, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls; if (style) e.setAttribute('style', style); if (html != null) e.innerHTML = html;
    parent.appendChild(e); return e;
  }
  function injectCSS() {
    if ($('dojo-css')) return;
    const st = document.createElement('style'); st.id = 'dojo-css';
    st.textContent = `
@font-face { font-family: BS; src: url(${KIT}fonts/big-shoulders-display-latin-800-normal.woff2) format("woff2"); font-weight: 800; }
@font-face { font-family: HG; src: url(${KIT}fonts/hanken-grotesk-latin-600-normal.woff2) format("woff2"); font-weight: 600; }
@font-face { font-family: PM; src: url(${KIT}fonts/ibm-plex-mono-latin-400-normal.woff2) format("woff2"); font-weight: 400; }
html,body { margin:0; height:100%; background:#000; overflow:hidden }
#stage { position:absolute; left:0; top:0; width:1080px; height:1920px; transform-origin:0 0; overflow:hidden; background:${C.navy}; font-family:HG, Arial, sans-serif }
.abs { position:absolute }
.full { left:0; top:0; width:1080px; height:1920px }
.dhook { left:100px; top:250px; width:880px; text-align:center; font-family:BS, Impact, sans-serif; font-weight:800; color:${C.cream};
  line-height:1.06; letter-spacing:.01em; text-transform:uppercase; text-wrap:balance; text-shadow:0 7px 0 #1a1238; transform-origin:0 0 }
.dhook .em { color:${C.orange} }
.dcard { left:100px; width:880px; border-radius:24px; background:rgba(14,14,44,.80); box-shadow:inset 0 0 0 2px rgba(255,255,255,.07);
  transform-origin:50% 50% }
.dbadge { position:absolute; left:16px; width:76px; height:76px; border-radius:50%; background:${C.orange}; color:${C.navy};
  font-family:BS, Impact, sans-serif; font-weight:800; font-size:54px; line-height:76px; text-align:center; box-shadow:0 5px 0 #a8501a }
.dtext { position:absolute; left:114px; width:742px; white-space:nowrap; color:${C.cream}; font-weight:600; font-size:64px; line-height:1.2 }
.dlesson { left:110px; width:740px; text-align:center; color:${C.cream}; font-weight:600; font-size:56px; line-height:1.18; text-wrap:balance; text-shadow:0 4px 0 #1a1238 }
.dlesson .q { color:${C.orange} }
.dcta { left:120px; width:720px; text-align:center }
.dcta .pill { display:inline-block; white-space:nowrap; background:${C.green}; color:${C.cream}; border:4px solid ${C.orange}; border-radius:60px;
  padding:16px 34px 16px 28px; font-weight:600; font-size:38px; letter-spacing:.03em; box-shadow:0 7px 0 #0b3d2d }
.dcta svg { display:inline-block; vertical-align:-0.2em; margin-right:.45em }
`;
    document.head.appendChild(st);
  }
  const escH = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  /* hook markup: *word* = orange; with no *, a leading number is orange */
  function hookHTML(s) {
    s = escH(s.toUpperCase());
    if (s.includes('*')) return s.replace(/\*([^*]+)\*/g, '<span class="em">$1</span>');
    return s.replace(/^(\d+)/, '<span class="em">$1</span>');
  }
  const NOTEBOOK = s => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><rect x="4" y="2" width="16.5" height="20" rx="2.6" fill="${C.cream}"/>` +
    `<rect x="4" y="2" width="4.6" height="20" rx="1.6" fill="${C.orange}"/><rect x="11" y="6.6" width="7" height="1.9" rx=".95" fill="${C.green}"/>` +
    `<rect x="11" y="10.6" width="5.6" height="1.9" rx=".95" fill="${C.green}"/><rect x="11" y="14.6" width="6.4" height="1.9" rx=".95" fill="${C.green}"/></svg>`;
  const ctaText = s => String(s || '').replace(/^\s*📒\s*/u, '').replace(/^[^\w"'(]+/u, '').trim();

  // ------------------------------------------------------------------ background (data-bg)
  function off(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  function ridge(ctx, pts, base, fill) {
    ctx.beginPath(); ctx.moveTo(pts[0][0], base);
    for (const p of pts) ctx.lineTo(p[0], p[1]);
    ctx.lineTo(pts[pts.length - 1][0], base); ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
  }
  function makeBg() {
    const sky = off(W, H + 80), s = sky.getContext('2d', SW2D);
    let g = s.createLinearGradient(0, 0, 0, H + 80);
    g.addColorStop(0, '#080b22'); g.addColorStop(.32, '#16173a'); g.addColorStop(.55, '#272151'); g.addColorStop(.72, '#4a2f62');
    g.addColorStop(.82, '#834770'); g.addColorStop(.9, '#c46a5c'); g.addColorStop(1, '#e8925a');
    s.fillStyle = g; s.fillRect(0, 0, W, H + 80);
    g = s.createRadialGradient(540, 1560, 40, 540, 1560, 760); g.addColorStop(0, 'rgba(255,150,80,.38)'); g.addColorStop(1, 'rgba(255,150,80,0)');
    s.fillStyle = g; s.fillRect(0, 0, W, H + 80);
    const back = off(W + 120, 700), b = back.getContext('2d', SW2D);
    ridge(b, [[-10, 330], [180, 150], [390, 320], [560, 190], [700, 300], [860, 120], [1060, 300], [1210, 210], [1250, 260]], 700, C.mtnBack);
    const front = off(W + 160, 600), f = front.getContext('2d', SW2D);
    ridge(f, [[-20, 260], [250, 150], [520, 300], [800, 160], [1000, 260], [1260, 140]], 600, C.mtnFront);
    return { sky, back, front };
  }
  function drawBg(ctx, t, B, nj, cam) {
    const px = cam.x, py = cam.y;
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
    ctx.drawImage(B.sky, 0, -40 + py * .2);
    // stars (twinkle)
    for (let i = 0; i < 70; i++) {
      const x = hash(i * 3.7) * W, y = hash(i * 9.1 + 2) * 1100, r = .8 + 2 * hash(i * 5.3);
      ctx.globalAlpha = (.18 + .5 * (.5 + .5 * Math.sin(t * (1 + hash(i) * 2) + i))) * (1 - y / 1300);
      ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(x + px * .2, y + py * .2, r, 0, TAU); ctx.fill();
    }
    // embers drifting up (looping: the cycle length divides any duration via the wrap)
    for (let i = 0; i < 26; i++) {
      const sp = 40 + 50 * hash(i * 2.2), y0 = 1900 - ((t * sp + hash(i * 4.4) * 1500) % 1500);
      const x = hash(i * 6.6) * W + 30 * Math.sin(t * .9 + i);
      ctx.globalAlpha = .55 * Math.sin(PI * clamp((1900 - y0) / 1500));
      ctx.fillStyle = i % 3 ? C.orange : '#ffd2a0'; ctx.beginPath(); ctx.arc(x, y0, 2 + 2.5 * hash(i * 8.8), 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 1;
    // glow behind the ninja (a sunset disc)
    const g = ctx.createRadialGradient(nj.x + px, nj.y + py, nj.r * .6, nj.x + px, nj.y + py, nj.r * 2.1);
    g.addColorStop(0, 'rgba(255,170,110,.42)'); g.addColorStop(1, 'rgba(255,170,110,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.drawImage(B.back, -60 + px * .35, 1330 + py * .35);
    ctx.drawImage(B.front, -80 + px * .6, 1420 + py * .6);
  }

  // ------------------------------------------------------------------ the ninja (vector, matches brand4/profile-habitdojo-1024.png)
  /* st = { x, y, r, rot, sx, sy, face (dy of the features), gaze [dx,dy], squint 0-1, blink 0-1, brow 0-1, tail (amplitude), tp (tail phase) } */
  function tailShape(ctx, k0, len, dir, amp, ph, w0, fill) {
    const N = 22, L = [], R = [];
    for (let i = 0; i <= N; i++) {
      const s = i / N, x = k0[0] + len * s, wave = amp * Math.sin(ph - s * 3.2) * s;
      const y = k0[1] + dir * len * s + wave;
      const dx = len, dy = dir * len + amp * (Math.sin(ph - (s + .02) * 3.2) * (s + .02) - Math.sin(ph - s * 3.2) * s) / .02;
      const nl = Math.hypot(dx, dy) || 1, w = w0 * (1 - s * .72);
      L.push([x - dy / nl * w, y + dx / nl * w]); R.push([x + dy / nl * w, y - dx / nl * w]);
    }
    ctx.beginPath(); ctx.moveTo(L[0][0], L[0][1]);
    for (const p of L) ctx.lineTo(p[0], p[1]);
    const tip = [k0[0] + len * 1.06, k0[1] + dir * len * 1.06 + amp * Math.sin(ph - 3.4)];
    ctx.lineTo(tip[0], tip[1]);
    for (let i = R.length - 1; i >= 0; i--) ctx.lineTo(R[i][0], R[i][1]);
    ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
  }
  function ninja(ctx, st) {
    ctx.save();
    ctx.translate(st.x, st.y); ctx.rotate(st.rot || 0); ctx.scale(st.r * (st.sx || 1), st.r * (st.sy || 1));
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const amp = st.tail == null ? .09 : st.tail, ph = st.tp || 0;
    // headband tails (behind the head), knot on the right
    tailShape(ctx, [.84, -.5], .86, .1, amp * 1.2, ph + 1.3, .12, C.orangeD);
    tailShape(ctx, [.84, -.58], .92, -.2, amp, ph, .14, C.orange);
    // head
    ctx.beginPath(); ctx.arc(0, 0, 1, 0, TAU); ctx.fillStyle = C.green; ctx.fill();
    ctx.lineWidth = .022; ctx.strokeStyle = C.ink; ctx.stroke();
    // lower-left orange rim (the band's other end wrapping round)
    ctx.beginPath(); ctx.arc(0, 0, 1.025, 114 * PI / 180, 201 * PI / 180); ctx.lineWidth = .038; ctx.strokeStyle = C.orange; ctx.stroke();
    // headband
    ctx.save(); ctx.beginPath(); ctx.arc(0, 0, 1.04, 0, TAU); ctx.clip();
    ctx.beginPath(); ctx.moveTo(-1.1, -.56); ctx.lineTo(1.1, -.71); ctx.lineTo(1.1, -.41); ctx.lineTo(-1.1, -.26); ctx.closePath();
    ctx.fillStyle = C.orange; ctx.fill();
    ctx.restore();
    ctx.beginPath(); ctx.ellipse(.9, -.555, .1, .14, .2, 0, TAU); ctx.fillStyle = C.orangeD; ctx.fill();
    // face features
    const fy = st.face || 0, gz = st.gaze || [0, 0];
    ctx.save(); ctx.translate(0, fy);
    ctx.beginPath();
    const sx0 = -.83, sy0 = -.14, sw = 1.48, sh = .54, rr = .27;
    ctx.moveTo(sx0 + rr, sy0); ctx.lineTo(sx0 + sw - rr, sy0); ctx.arc(sx0 + sw - rr, sy0 + rr, rr, -PI / 2, PI / 2);
    ctx.lineTo(sx0 + rr, sy0 + sh); ctx.arc(sx0 + rr, sy0 + rr, rr, PI / 2, PI * 1.5); ctx.closePath();
    ctx.fillStyle = C.skin; ctx.fill(); ctx.lineWidth = .016; ctx.strokeStyle = C.ink; ctx.stroke();
    const sq = clamp(1 - (st.squint || 0) * .45 - (st.blink || 0) * .92, .06, 1);
    for (const ex of [-.37, .3]) {
      const x = ex + gz[0], y = .13 + gz[1];
      ctx.beginPath(); ctx.ellipse(x, y, .108, .125 * sq, 0, 0, TAU); ctx.fillStyle = C.ink; ctx.fill();
      if (sq > .35) { ctx.beginPath(); ctx.arc(x + .035, y - .045 * sq, .036, 0, TAU); ctx.fillStyle = '#ffffff'; ctx.fill(); }
    }
    const bd = (st.brow || 0) * .05;
    ctx.lineWidth = .055; ctx.strokeStyle = C.ink;
    ctx.beginPath(); ctx.moveTo(-.6, -.075 + bd * .3); ctx.lineTo(-.21, -.005 + bd); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(.15, -.005 + bd); ctx.lineTo(.53, -.075 + bd * .3); ctx.stroke();
    ctx.restore();
    ctx.restore();
  }

  // ------------------------------------------------------------------ layout + assembler
  const BIG = { x: 540, y: 1150, r: 272 }, SMALL = { x: 842, y: 352, r: 118 };
  const HEAD_S = .56;                      // header scale of the hook box
  function assemble(spec) {
    injectCSS();
    let stg = $('stage'); if (!stg) { stg = el(document.body, 'div'); stg.id = 'stage'; }
    window.STAGE_W = W; window.STAGE_H = H; window.CHECK_ZONE = 'dojo';
    const T = timeline(spec), DUR = T.DUR, n = T.items.length;
    const bgC = el(stg, 'canvas', 'abs full'); bgC.width = W; bgC.height = H; bgC.dataset.bg = 'dojo';
    const cam = el(stg, 'div', 'abs full');
    const njC = el(cam, 'canvas', 'abs full'); njC.width = W; njC.height = H;
    const bg = bgC.getContext('2d', SW2D), nc = njC.getContext('2d', SW2D);
    const hookEl = el(cam, 'div', 'abs dhook', 'font-size:150px', hookHTML(spec.hook || ''));
    const cards = T.items.map(it => {
      const c = el(cam, 'div', 'abs dcard', 'opacity:0');
      const b = el(c, 'div', 'dbadge', '', String(it.i + 1));
      const tx = el(c, 'div', 'dtext', '', `<span>${escH(it.text)}</span>`);
      return { c, b, tx, it };
    });
    const lessonEl = el(cam, 'div', 'abs dlesson', 'opacity:0', escH(spec.lesson || ''));
    const ctaEl = el(cam, 'div', 'abs dcta', 'opacity:0', `<span class="pill">${NOTEBOOK(40)}${escH(ctaText(spec.cta || '📒 FREE HABIT TRACKER · LINK IN BIO'))}</span>`);
    const B = makeBg();
    const L = { rows: [], hookH: 0, lessonY: 1188, ctaY: 1330 };

    function layout() {
      // hook: biggest size (<= 150 px) that fits 880 px wide in <= 3 lines and <= 480 px tall, no word broken
      let px = 170;
      const words = [...hookEl.textContent.split(/\s+/)];
      const fits = () => hookEl.scrollWidth <= 880 && hookEl.offsetHeight <= 500;
      hookEl.style.fontSize = px + 'px';
      while (!fits() && px > 70) { px -= 2; hookEl.style.fontSize = px + 'px'; }
      L.hookH = hookEl.offsetHeight; L.hookPx = px; void words;
      const top = Math.max(500, Math.round(232 + L.hookH * HEAD_S + 36));
      const pitch = Math.min(165, Math.floor((1136 - top) / n)), ch = Math.min(128, pitch - 16);
      cards.forEach((k, i) => {
        const y = top + i * pitch + Math.round((pitch - 16 - ch) / 2);
        k.c.style.top = y + 'px'; k.c.style.height = ch + 'px';
        k.b.style.top = Math.round((ch - 76) / 2) + 'px';
        let fs = 64; k.tx.style.fontSize = fs + 'px';
        while (k.tx.firstChild.offsetWidth > 742 && fs > 30) { fs -= 1; k.tx.style.fontSize = fs + 'px'; }
        k.tx.style.top = Math.round((ch - k.tx.offsetHeight) / 2) + 'px';
        L.rows.push(y + ch / 2); L.listEnd = y + ch;
      });
      L.lessonY = L.listEnd + 34;
      lessonEl.style.top = L.lessonY + 'px';
      let lf = 56; lessonEl.style.fontSize = lf + 'px';
      while (lessonEl.offsetHeight > 140 && lf > 30) { lf -= 1; lessonEl.style.fontSize = lf + 'px'; }
      L.ctaY = L.lessonY + lessonEl.offsetHeight + 26;
      ctaEl.style.top = L.ctaY + 'px';
      const pill = ctaEl.firstChild; let cf = 38;
      while (pill.offsetWidth > 720 && cf > 22) { cf -= 1; pill.style.fontSize = cf + 'px'; }
    }

    // ---- state functions (all pure in t)
    const hookK = t => t < T.backAt ? io(seg(t, T.hookOut, T.hookOut + .55)) : 1 - io(seg(t, T.backAt + .2, DUR - .06));
    function njPos(t) {
      let kx, ky;
      if (t < T.backAt) { kx = ioC(seg(t, 1.05, 1.6)); ky = ioC(seg(t, 1.18, 1.75)); }
      else { ky = 1 - ioC(seg(t, T.backAt - .02, T.backAt + .32)); kx = 1 - ioC(seg(t, T.backAt + .18, DUR - .05)); }
      const kr = (kx + ky) / 2;
      return { x: lerp(BIG.x, SMALL.x, kx), y: lerp(BIG.y, SMALL.y, ky), r: lerp(BIG.r, SMALL.r, kr) };
    }
    function camNudge(t) {
      let x = 0, y = 0;
      for (const it of T.items) {
        const u = t - (it.a + .2); if (u < 0 || u > 1.2) continue;
        const d = Math.exp(-u * 6) * Math.sin(u * 22);
        x += -9 * d; y += 7 * d;
      }
      { const u = t - T.lessonAt; if (u >= 0 && u < 1.2) { const d = Math.exp(-u * 6) * Math.sin(u * 22); y += 8 * d; } }
      return { x, y };
    }
    function blinkAt(t) {
      let b = 0;
      for (let k = 0; k < 12; k++) { const bt = 2.9 + k * 3.7 + hash(k) * .8; if (bt > DUR - 1.2) break; b = Math.max(b, tri(t, bt, bt + .16)); }
      return b;
    }
    function ninjaState(t) {
      const p = njPos(t), small = seg(p.r, BIG.r, SMALL.r);
      const st = { x: p.x, y: p.y + Math.sin(t * TAU / 1.6) * lerp(5, 4, small), r: p.r, rot: Math.sin(t * TAU / 3.2) * .03,
        sx: 1, sy: 1, face: 0, gaze: [0, 0], squint: 0, blink: blinkAt(t), brow: 0, tail: .09, tp: t * 5.2, arc: 0 };
      for (const it of T.items) {
        const u = t - it.a + .12; if (u < 0 || u > 1.3) continue;
        const k = tri(u, 0, .9);
        st.squint = Math.max(st.squint, tri(u, 0, .7)); st.brow = Math.max(st.brow, k);
        st.gaze = [-.05 * k, .035 * k];
        if (it.react === 'slash') { st.rot += -.32 * tri(u, 0, .32) + .1 * tri(u, .32, .7); st.arc = u < .45 ? u / .45 : 0; st.tail += .12 * tri(u, 0, .8); }
        if (it.react === 'bounce') { const h = tri(u, .05, .55); st.y -= 46 * h; st.sy = 1 - .14 * tri(u, 0, .08) - .1 * tri(u, .55, .7) + .06 * h; st.sx = 2 - st.sy; }
        if (it.react === 'nod') { const v = Math.sin(PI * 2 * clamp(u / .7)) * (1 - clamp(u / .8)); st.face = .1 * Math.abs(v) + .05 * tri(u, 0, .8); st.y += 10 * Math.abs(v); }
        if (it.react === 'flick') { st.rot += .18 * Math.sin(u * 18) * Math.exp(-u * 4); st.tail += .55 * Math.exp(-u * 2.5) * (u > 0 ? 1 : 0); st.tp += 8 * oC(u / .6); }
      }
      { const u = t - T.lessonAt + .1; if (u > 0 && u < 1) { const h = tri(u, 0, .5); st.y -= 30 * h; st.squint = Math.max(st.squint, tri(u, 0, .8)); } }
      return st;
    }
    function katanaArc(ctx, st, k) {         // a quick silver crescent over the head (never below its centre)
      if (k <= 0 || k >= 1) return;
      const a1 = lerp(-PI * 1.05, -PI * .05, oC(k)), a0 = Math.max(-PI * 1.05, a1 - 1.6), R = st.r * 1.42, a = 1 - Math.pow(k, 3);
      ctx.save(); ctx.translate(st.x, st.y);
      for (let i = 0; i < 3; i++) {
        ctx.beginPath(); ctx.arc(0, 0, R + i * 6, a0 + (a1 - a0) * i * .25, a1); ctx.lineWidth = [10, 5, 2.5][i];
        ctx.strokeStyle = i ? `rgba(255,214,170,${.55 * a})` : `rgba(255,255,255,${.9 * a})`; ctx.lineCap = 'round'; ctx.stroke();
      }
      ctx.restore();
    }
    function streak(ctx, t, it) {             // the cut-in: a white/orange slash runs across the empty row, gone before the card pops
      const y = L.rows[it.i], u = seg(t, it.a, it.a + .17), fade = 1 - seg(t, it.a + .15, it.a + .22);
      if (t < it.a || fade <= 0) return;
      const head = lerp(1000, 96, oC(u)), tail = Math.min(1000, head + 520 * (1 - u * .5));
      const tilt = -.035;
      ctx.save(); ctx.translate(0, y); ctx.rotate(tilt); ctx.globalAlpha = fade;
      ctx.beginPath(); ctx.moveTo(head, 0); ctx.lineTo(tail, -15); ctx.lineTo(tail, 15); ctx.closePath(); ctx.fillStyle = C.orange; ctx.fill();
      ctx.beginPath(); ctx.moveTo(head - 8, 0); ctx.lineTo(tail, -6); ctx.lineTo(tail, 6); ctx.closePath(); ctx.fillStyle = '#ffffff'; ctx.fill();
      for (let i = 0; i < 6; i++) {
        const sx = head + 20 + 260 * hash(it.i * 10 + i) * (1 - u * .4), sy = (hash(it.i * 7 + i) - .5) * 40;
        ctx.globalAlpha = fade * .8; ctx.fillStyle = i % 2 ? '#ffd2a0' : '#ffffff'; ctx.beginPath(); ctx.arc(sx, sy, 3 + 2 * hash(i), 0, TAU); ctx.fill();
      }
      ctx.restore();
    }

    function setVis(e, op) { e.style.opacity = op.toFixed(3); e.style.visibility = op <= 0.001 ? 'hidden' : 'visible'; }
    function seek(t) {
      const cn = camNudge(t), st = ninjaState(t);
      cam.style.transform = `translate(${cn.x.toFixed(2)}px,${cn.y.toFixed(2)}px)`;
      drawBg(bg, t, B, st, cn);
      nc.setTransform(1, 0, 0, 1, 0, 0); nc.globalAlpha = 1; nc.clearRect(0, 0, W, H);
      for (const it of T.items) streak(nc, t, it);
      katanaArc(nc, st, st.arc);
      ninja(nc, st);
      // hook: thumbnail -> header
      const hk = hookK(t), s = lerp(1, HEAD_S, hk), hx = lerp(0, 108 - 100, hk), hy = lerp(0, 232 - 250, hk);
      const pop = t < .001 ? 1 : 1;
      hookEl.style.transform = `translate(${(hx + (1 - s) * 0).toFixed(2)}px,${hy.toFixed(2)}px) scale(${(s * pop).toFixed(4)})`;
      setVis(hookEl, 1);
      // items
      const fadeOut = 1 - io(seg(t, T.fadeAt, T.fadeAt + .28));
      for (const k of cards) {
        const a = k.it.a + .23, u = seg(t, a, a + .3);
        const op = (t < a ? 0 : clamp((t - a) / .08)) * fadeOut;
        const sc = t < a ? .8 : lerp(.8, 1, oBack(u, 2.2));
        const dim = 1 - .25 * io(seg(t, T.lessonAt, T.lessonAt + .4));
        k.c.style.transform = `scale(${sc.toFixed(4)})`;
        setVis(k.c, op * dim);
        k.b.style.transform = `scale(${(t < a ? 0 : oBack(seg(t, a + .05, a + .35), 3)).toFixed(4)}) rotate(${(-25 * (1 - oC(seg(t, a, a + .4)))).toFixed(2)}deg)`;
      }
      // lesson + CTA
      { const u = seg(t, T.lessonAt, T.lessonAt + .4);
        setVis(lessonEl, io(u) * fadeOut); lessonEl.style.transform = `translateY(${(26 * (1 - oC(u))).toFixed(2)}px)`; }
      { const u = seg(t, T.ctaAt, T.ctaAt + .35), pulse = t > T.ctaAt + .5 ? 1 + .025 * Math.sin((t - T.ctaAt) * TAU / 1.1) : 1;
        setVis(ctaEl, clamp(u * 3) * fadeOut); ctaEl.style.transform = `scale(${(lerp(.6, 1, oBack(u, 2)) * pulse).toFixed(4)})`; }
    }

    window.FPS = 30; window.DURATION = DUR; window.seek = seek;
    window.ready = (async () => {
      await document.fonts.load('800 40px BS'); await document.fonts.load('600 40px HG'); await document.fonts.load('400 40px PM'); await document.fonts.ready;
      layout(); seek(0);
      for (let i = 0; i < 3; i++) await new Promise(r => requestAnimationFrame(() => r()));
    })();
    const fit = () => { const sc = Math.min(innerWidth / W, innerHeight / H); stg.style.transform = `scale(${sc})`; };
    if (!location.search.includes('capture=1')) {
      addEventListener('resize', fit); fit();
      window.ready.then(() => { const t0 = performance.now(); const loop = n2 => { seek(((n2 - t0) / 1000) % DUR); requestAnimationFrame(loop); }; requestAnimationFrame(loop); });
    }
    return window.ready;
  }

  window.Dojo = { timeline, assemble, ninja, REACT, W, H };
})();
