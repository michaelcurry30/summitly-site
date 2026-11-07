/* summit.js — Summitly "Summit Ninja" visual kit for vertical (1080x1920) frame-pure ads.
 *
 * Load from a project page with   <script src="kit/summit.js"></script>   where <project>/kit is a symlink
 * to the shared kit (ln -s ../kit <project>/kit). Everything here is a pure function of t: no timers, no
 * CSS animations, no state carried between frames. See kit/README.md for the full guide.
 *
 *   const S = Summit;                                  // global
 *   const stage = S.stage();                           // #stage 1080x1920 (created if missing) + kit CSS + fonts
 *   const bg = S.mountains(stage, { peak: true });     // dawn layers (+ peak ledge / summit)
 *   const can = S.canvas(stage); const ctx = can.getContext('2d');
 *   const phone = S.phone(stage, { src: 'kit/assets/app_s_run2.png', toggle: { x: 290, y: 660 } });
 *   const card = S.notif(stage, { app: 'Scroll', when: 'now', text: 'New videos for you' });
 *   const h = S.text(stage, 'PRESS <span class="or">START.</span>', { top: 300, max: 150 });
 *   const end = S.endCard(stage);
 *   S.boot({ duration: 20, seek(t) {
 *     bg.seek(t, { camUp: 0 });
 *     S.clear(ctx); S.ninja.draw(ctx, S.ninja.pose(t, { x: 420, y: 1265, s: .9, pose: 'idle' }));
 *     S.show(h, t, 3.0, 6.0);  end.seek(t, 17);
 *   }});
 */
(function () {
  'use strict';
  const KIT = (document.currentScript && document.currentScript.src || '').replace(/summit\.js(\?.*)?$/, '') || 'kit/';
  const PI = Math.PI;

  // ---------------------------------------------------------------- easing / time helpers
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const seg = (t, a, b) => clamp((t - a) / (b - a));               // 0..1 progress of t through [a,b]
  const oC = x => 1 - Math.pow(1 - clamp(x), 3);                    // ease-out cubic
  const iC = x => Math.pow(clamp(x), 3);                            // ease-in cubic
  const ioC = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  const oBack = x => { x = clamp(x); const c = 1.7; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
  const lerp = (a, b, p) => a + (b - a) * p;
  const tri = (t, a, b) => (t <= a || t >= b) ? 0 : Math.sin(PI * (t - a) / (b - a));   // 0→1→0 bump
  const hash = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }; // seeded "random"
  const $ = id => document.getElementById(id);

  const C = { navy: '#0b1026', cyan: '#3ee6ff', orange: '#ffb36b', peach: '#ffd7b8', white: '#ffffff', ink: '#0b1026' };

  // ---------------------------------------------------------------- CSS + fonts
  function injectCSS() {
    if ($('summit-css')) return;
    const st = document.createElement('style'); st.id = 'summit-css';
    st.textContent = `
@font-face { font-family: BS; src: url(${KIT}fonts/big-shoulders-display-latin-800-normal.woff2) format("woff2"); font-weight: 800; }
@font-face { font-family: PM; src: url(${KIT}fonts/ibm-plex-mono-latin-400-normal.woff2) format("woff2"); font-weight: 400; }
@font-face { font-family: HG; src: url(${KIT}fonts/hanken-grotesk-latin-600-normal.woff2) format("woff2"); font-weight: 600; }
html,body { margin:0; height:100%; background:#000; overflow:hidden }
#stage { position:absolute; left:0; top:0; width:1080px; height:1920px; transform-origin:0 0; overflow:hidden; background:${C.navy}; color:#fff; font-family:HG, Arial, sans-serif }
.abs { position:absolute; will-change:transform,opacity }
.full { left:0; top:0; width:1080px; height:1920px }
.block { position:absolute; left:120px; width:840px; text-align:center }
.kick { font:400 40px PM; letter-spacing:.28em; color:${C.peach}; white-space:nowrap }
.head { font:800 190px/0.86 BS; text-transform:uppercase; letter-spacing:-.005em }
.head div { white-space:nowrap } .head span { display:inline-block }
.or { color:${C.orange} } .cy { color:${C.cyan} }
.chip { display:inline-block; padding:16px 30px; border-radius:999px; background:#fff; color:${C.ink}; font:600 56px HG; white-space:nowrap; box-shadow:0 10px 0 rgba(0,0,0,.28) }
.chip b { color:#0a9fbd; font-weight:600 } .chip.cyan { background:${C.cyan} }
.s-phone { width:380px; height:798px; border-radius:58px; background:linear-gradient(145deg,#3a4256,#10131b 40%,#1d2230); box-shadow:0 0 0 3px rgba(62,230,255,.55), 0 0 0 9px rgba(62,230,255,.12) }
.s-phone .sc { position:absolute; left:12px; top:12px; width:356px; height:774px; border-radius:48px; overflow:hidden; background:#05070c }
.s-phone .sc img { width:356px; display:block }
.s-phone .sheen { position:absolute; inset:0; background:linear-gradient(120deg,rgba(255,255,255,.10),rgba(255,255,255,0) 38%) }
.s-phone .isl { position:absolute; left:138px; top:22px; width:104px; height:30px; border-radius:20px; background:#000 }
.s-tog { width:39px; height:23px; border-radius:12px; background:#1a1830 }
.s-knob { left:3px; top:3px; width:17px; height:17px; border-radius:50%; background:#5d5a74 }
.s-glow { width:900px; height:1000px; background:radial-gradient(closest-side,rgba(62,230,255,.38),rgba(62,230,255,0)) }
.s-card { width:800px; height:200px; border-radius:40px; background:#f4f6fb; color:${C.ink}; box-sizing:border-box; box-shadow:0 14px 0 rgba(0,0,0,.25) }
.s-card .ic { position:absolute; left:34px; top:48px; width:104px; height:104px; border-radius:26px; overflow:hidden }
.s-card .t1 { position:absolute; left:170px; top:36px; font:600 40px HG; color:#4b5266 }
.s-card .t1 i { font:400 34px PM; font-style:normal; color:#7c8296; margin-left:18px }
.s-card .t2 { position:absolute; left:170px; top:94px; font:600 52px HG; color:${C.ink}; white-space:nowrap }
.s-card .dot { position:absolute; right:38px; top:44px; width:22px; height:22px; border-radius:50%; background:#ff6b5a }
.s-icon { width:240px; height:240px; border-radius:56px; box-shadow:0 0 0 4px rgba(62,230,255,.7), 0 14px 0 rgba(0,0,0,.35) }
`;
    document.head.appendChild(st);
  }

  function el(parent, tag, cls, style, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (style) e.setAttribute('style', style);
    if (html != null) e.innerHTML = html;
    parent.appendChild(e); return e;
  }
  const svgNS = 'http://www.w3.org/2000/svg';
  function svg(parent, cls = 'abs full', inner = '', style = 'overflow:visible') {
    const s = document.createElementNS(svgNS, 'svg');
    s.setAttribute('class', cls); s.setAttribute('width', 1080); s.setAttribute('height', 1920); s.setAttribute('style', style);
    s.innerHTML = inner; parent.appendChild(s); return s;
  }

  function stage() {
    injectCSS();
    let s = $('stage');
    if (!s) { s = el(document.body, 'div'); s.id = 'stage'; }
    window.STAGE_W = 1080; window.STAGE_H = 1920;
    return s;
  }

  // ---------------------------------------------------------------- dawn mountains
  /* S.mountains(stage, { peak, steps, stars }) -> { seek(t, o), steps:[[x,feetY]...], peakY:1180 }
   * o (all optional): camUp 0..1 (camera climbs: far/mid layers sink), near 0..1 (near ridge drops away),
   *   peak 0..1 (peak ledge risen into frame; 1 = ledge top at y 1180, ledge spans x 342–598),
   *   snow 0..1 (snow cap on the peak), steps 0..1 / [inPerStep] (rock steps visible), dim 0..1,
   *   peakY px extra offset of the peak (e.g. push the summit lower for the end card), dur (default 20) for drift. */
  function mountains(stage, opt = {}) {
    const defs = `<defs>
<linearGradient id="sSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a0f26"/><stop offset=".42" stop-color="#2b2457"/><stop offset=".62" stop-color="#8a4a72"/><stop offset=".74" stop-color="#ff9a6a"/><stop offset="1" stop-color="#ffcf9a"/></linearGradient>
<linearGradient id="sM1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5b3f78"/><stop offset="1" stop-color="#3a2a5a"/></linearGradient>
<linearGradient id="sM2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2c2148"/><stop offset="1" stop-color="#1c1633"/></linearGradient>
<linearGradient id="sM3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#141228"/><stop offset="1" stop-color="#0a0a16"/></linearGradient>
<linearGradient id="sPk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1e1a3a"/><stop offset=".4" stop-color="#110f22"/><stop offset="1" stop-color="#08080f"/></linearGradient>
<linearGradient id="sFog" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd2b0" stop-opacity="0"/><stop offset=".5" stop-color="#ffd2b0" stop-opacity=".28"/><stop offset="1" stop-color="#ffd2b0" stop-opacity="0"/></linearGradient></defs>`;
    const BG = [];                                                  // every layer here is tagged data-bg (ignored by check_overlap)
    BG.push(svg(stage, 'abs full', defs + '<rect width="1080" height="1920" fill="url(#sSky)"/>', ''));
    const sun = el(stage, 'div', 'abs', 'left:340px;top:800px;width:760px;height:760px;border-radius:50%;background:radial-gradient(closest-side,#fff2d6 0%,rgba(255,194,122,.8) 35%,rgba(255,138,92,0) 100%)');
    const STARS = [[140, 120, 2], [300, 200, 1.5], [820, 140, 2.2], [960, 260, 1.4], [620, 90, 1.6], [460, 230, 1.2], [60, 300, 1.4], [220, 420, 1.3], [900, 470, 1.6], [700, 330, 1.2]];
    const starSvg = svg(stage, 'abs full', '<g fill="#fff">' + STARS.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('') + '</g>', '');
    BG.push(sun, starSvg);
    const stars = [...starSvg.querySelectorAll('circle')];
    const far = svg(stage, 'abs full', `
<path d="M-60 1260 L160 1080 L260 1150 L420 960 L560 1120 L700 1010 L860 1150 L1140 1000 V2300 H-60Z" fill="url(#sM1)" opacity=".9"/>
<path d="M600 1250 L770 900 L820 960 L850 930 L1140 1300 V2300 H600Z" fill="url(#sM1)"/>
<path d="M770 900 L800 960 L782 952 L770 990 L752 960 L740 970Z" fill="#fff" opacity=".85"/>
<g class="farflag"><path d="M770 900 v-60" stroke="#fff" stroke-width="3"/><path d="M770 842 h34 l-8 10 8 10 h-34z" fill="#3ee6ff"/></g>
<rect x="-60" y="1150" width="1200" height="220" fill="url(#sFog)"/>`);
    const farFlag = far.querySelector('.farflag');
    const mid = svg(stage, 'abs full', `<path d="M-60 1400 L180 1250 L330 1330 L520 1200 L700 1320 L900 1230 L1140 1330 V2400 H-60Z" fill="url(#sM2)"/>
<rect x="-60" y="1330" width="1200" height="160" fill="url(#sFog)" opacity=".6"/>`);
    const near = svg(stage, 'abs full', `<path d="M-60 1520 C120 1460 200 1278 300 1268 L560 1268 C640 1278 700 1410 760 1460 C860 1520 980 1500 1140 1540 V2600 H-60Z" fill="url(#sM3)"/>
<path d="M300 1268 L560 1268" stroke="#ff9a6a" stroke-width="4" opacity=".7"/>`);
    const dim = el(stage, 'div', 'abs full', 'background:#070b1d;opacity:0');
    const STEPS = opt.steps || [[245, 1250], [258, 1120], [242, 990], [256, 860]];
    const stepSvg = svg(stage, 'abs full', STEPS.map(([x, y], i) => `<g><path d="M${x - 92} ${y} L${x + 92} ${y} L${x + 74} ${y + 34} L${x - 70} ${y + 40} Z" fill="#141228"/><path d="M${x - 92} ${y} L${x + 92} ${y}" stroke="${i % 2 ? '#3ee6ff' : '#ff9a6a'}" stroke-width="4" opacity=".8"/></g>`).join(''));
    const stepG = [...stepSvg.querySelectorAll('g')];
    BG.push(far, mid, near, dim, stepSvg);
    let peak = null, snow = null;
    if (opt.peak !== false) {
      peak = svg(stage, 'abs full', `<path d="M-60 2300 L-60 1640 L120 1480 L250 1300 L330 1186 L342 1180 L598 1180 L612 1187 L700 1320 L840 1500 L1140 1690 V2300Z" fill="url(#sPk)"/>
<path d="M342 1180 L598 1180" stroke="#ff9a6a" stroke-width="5" opacity=".85"/><path d="M330 1186 L250 1300" stroke="#3ee6ff" stroke-width="3" opacity=".35"/>`);
      snow = svg(stage, 'abs full', `<path d="M330 1186 L342 1180 L598 1180 L612 1187 L586 1222 L548 1204 L500 1232 L452 1206 L404 1230 L366 1208 Z" fill="#ece8f7"/>`);
      BG.push(peak, snow);
    }
    BG.forEach(e => e.setAttribute('data-bg', 'mountains'));
    return {
      steps: STEPS, peakY: 1180, layers: { sun, far, mid, near, dim, peak, snow, steps: stepSvg },
      seek(t, o = {}) {
        const D = o.dur || window.DURATION || 20, cam = o.camUp || 0, dr = t / D;
        sun.style.transform = `translateY(${(-70 * dr - 90 * cam).toFixed(0)}px)`;
        stars.forEach((c, i) => c.setAttribute('opacity', (.45 + .3 * Math.sin(t * 1.7 + i * 1.9)).toFixed(3)));
        far.style.transform = `translate(${(-14 * dr).toFixed(0)}px,${(-6 * dr + 130 * cam).toFixed(0)}px)`;
        farFlag.setAttribute('opacity', (1 - clamp((o.peakY || 0) / 60)).toFixed(3));   // gone on the end-card pullback: it would poke into the CTA chip
        mid.style.transform = `translate(${(-26 * dr).toFixed(0)}px,${(-4 * dr + 230 * cam).toFixed(0)}px)`;
        near.style.transform = `translate(${(-40 * dr).toFixed(0)}px,${(650 * (o.near || 0)).toFixed(0)}px)`;
        dim.style.opacity = (.38 * (o.dim || 0)).toFixed(3);
        const sv = o.steps || 0;
        stepG.forEach((g, i) => {
          const v = Array.isArray(sv) ? sv[i] || 0 : sv, out = o.stepsOut ? ioC(clamp(o.stepsOut * 1.15 - i * .04)) : 0;
          g.setAttribute('opacity', (v * (1 - out)).toFixed(3));
          g.setAttribute('transform', `translate(${(-40 * (1 - v)).toFixed(2)},${(300 * out).toFixed(2)})`);
        });
        if (peak) {
          const py = 900 * (1 - (o.peak || 0)) + (o.peakY || 0);
          peak.style.transform = snow.style.transform = `translateY(${py.toFixed(0)}px)`;
          snow.style.opacity = (o.snow || 0).toFixed(3);
        }
      }
    };
  }

  // ---------------------------------------------------------------- canvas layer
  function canvas(parent) {
    const c = el(parent, 'canvas', '', 'position:absolute;left:0;top:0;width:1080px;height:1920px'); c.dataset.name = 'canvas: ninja/props';
    c.width = 1080; c.height = 1920; return c;
  }
  const clear = ctx => { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, 1080, 1920); };

  // ---------------------------------------------------------------- Summit Ninja rig
  const ACC = C.cyan;
  const P = d => new Path2D(d);
  const rr = (x, y, w, h, r) => { const p = new Path2D(); p.roundRect(x, y, w, h, r); return p; };
  const circ = (x, y, r) => { const p = new Path2D(); p.arc(x, y, r, 0, 2 * PI); return p; };
  const elp = (x, y, rx, ry) => { const p = new Path2D(); p.ellipse(x, y, rx, ry, 0, 0, 2 * PI); return p; };
  let NP = null;
  function parts() {
    if (NP) return NP;
    NP = {
      legL: P('M-58 120 C-70 170 -84 205 -96 238 L-40 240 C-30 200 -18 170 -10 130 Z'), footL: P('M-104 236 h70 a10 10 0 0 1 0 18 h-78 z'),
      legR: P('M18 128 C40 170 62 205 84 236 L140 232 C112 196 84 160 66 118 Z'), footR: P('M78 232 h70 a10 10 0 0 1 -2 18 h-74z'),
      torso: P('M-92 -40 C-110 30 -96 110 -70 140 L80 140 C104 100 112 20 92 -40 C60 -70 -60 -70 -92 -40 Z'),
      torsoSh: P('M30 -60 C60 -58 80 -50 92 -40 C112 20 104 100 80 140 L20 140 C50 90 52 10 30 -60 Z'),
      torsoHi: P('M-80 -44 C-60 -60 -30 -62 -10 -60 C-50 -40 -70 0 -76 40 C-90 20 -92 -10 -80 -44 Z'),
      torsoRim: P('M-94 -36 C-108 30 -98 104 -74 136'), vee: P('M-30 -48 L0 40 L30 -48'),
      armL: P('M-90 -20 C-140 20 -150 70 -100 92'), armR: P('M88 -24 C140 -70 150 -130 120 -168'),
      head: circ(0, -150, 112), headSh1: P('M60 -244 A112 112 0 0 1 20 -40 A120 120 0 0 0 60 -244 Z'),
      headSh2: P('M98 -96 A112 112 0 0 1 -40 -45 C30 -50 80 -70 98 -96 Z'), headHi: P('M-80 -228 A112 112 0 0 1 10 -262 C-40 -250 -72 -230 -92 -200 Z'),
      headRim: P('M-104 -196 A112 112 0 0 0 -60 -56'), skin: rr(-82, -172, 164, 62, 31), skinHi: rr(-70, -166, 90, 20, 10),
      brN: P('M-58 -160 L-14 -150 L-14 -146 L-60 -152Z M58 -160 L14 -150 L14 -146 L60 -152Z'),
      brW: P('M-60 -148 L-14 -166 L-13 -161 L-60 -143Z M60 -148 L14 -166 L13 -161 L60 -143Z'),
      brS: P('M-60 -166 L-16 -170 L-16 -165 L-60 -161Z M60 -166 L16 -170 L16 -165 L60 -161Z'),
      eyes: (() => { const p = elp(-36, -133, 13, 16); p.addPath(elp(36, -133, 13, 16)); return p; })(),
      eyeHi: (() => { const p = circ(-31, -139, 5); p.addPath(circ(41, -139, 5)); return p; })(),
      eyeW: (() => { const p = elp(-36, -134, 19, 21); p.addPath(elp(36, -134, 19, 21)); return p; })(),
      pup: (() => { const p = circ(-36, -132, 6.5); p.addPath(circ(36, -132, 6.5)); return p; })(),
      eyH: P('M-52 -128 Q-36 -150 -20 -128 M20 -128 Q36 -150 52 -128'),
      eyD: P('M-52 -136 L-20 -130 M20 -130 L52 -136'),
      band: P('M-110 -206 C-50 -232 50 -232 110 -206 L106 -180 C50 -204 -50 -204 -106 -180 Z'),
      sweat: P('M92 -196 C102 -180 108 -170 100 -162 C92 -156 82 -164 86 -176 Z'),
      shadow: elp(0, 0, 150, 22),
    };
    return NP;
  }
  function scarfD(t, k) {
    const w = 2 * PI * 1.7, a = Math.sin(w * t) * k, b = Math.sin(w * t + 1.1) * k, c = Math.sin(w * t + 2.2) * k;
    return `M60 -150 C160 ${-190 + 8 * a} 230 ${-120 + 12 * b} 330 ${-170 + 22 * c} C290 ${-110 + 14 * c} 220 ${-100 + 8 * b} 150 -105 C210 ${-60 + 8 * a} 260 ${-70 + 12 * b} 310 ${-40 + 20 * c} C220 ${-20 + 10 * b} 150 -70 70 -110 Z`;
  }
  function bandD(t, k) {
    const w = 2 * PI * 1.9, a = Math.sin(w * t + .5) * k, b = Math.sin(w * t + 1.6) * k, c = Math.sin(w * t + 2.7) * k;
    return `M100 -200 C150 ${-220 + 6 * a} 200 ${-200 + 10 * b} 250 ${-230 + 16 * c} C230 ${-190 + 10 * c} 190 -178 140 -184 C180 -160 210 ${-160 + 8 * b} 240 ${-140 + 14 * c} C190 -130 150 -160 104 -180Z`;
  }
  function clothD(t) {
    const a = Math.sin(2 * PI * 1.6 * t) * 7, b = Math.sin(2 * PI * 1.6 * t + 1.4) * 6;
    return `M0 -220 C30 ${-228 + a} 64 ${-212 - a} 104 ${-220 + b} L90 ${-188 + b * .5} L104 ${-156 + b} C64 ${-148 - a} 30 ${-164 + a} 0 -156 Z`;
  }

  function fillP(ctx, p, c, a = 1) { ctx.globalAlpha = a; ctx.fillStyle = c; ctx.fill(p); ctx.globalAlpha = 1; }
  function strokeP(ctx, p, c, w, a = 1, cap = 'round') { ctx.globalAlpha = a; ctx.strokeStyle = c; ctx.lineWidth = w; ctx.lineCap = cap; ctx.stroke(p); ctx.globalAlpha = 1; }
  function rotAbout(ctx, deg, cx, cy) { ctx.translate(cx, cy); ctx.rotate(deg * PI / 180); ctx.translate(-cx, -cy); }

  /* S.ninja.draw(ctx, n): n from S.ninja.pose(). Rig units: feet at (0,0), ~510 tall at s = 1
   * (face centre ≈ 383·s above the feet, head top ≈ 512·s). */
  function drawNinja(ctx, n) {
    const N = parts(), f = (p, c, a) => fillP(ctx, p, c, a), k = (p, c, w, a, cap) => strokeP(ctx, p, c, w, a, cap);
    ctx.save(); ctx.translate(n.x, n.y); ctx.scale(n.s, n.s);
    if (n.shA > 0) { ctx.save(); ctx.scale(n.shS, 1); f(N.shadow, '#000', n.shA); ctx.restore(); }
    if (n.spin) { ctx.translate(0, -250); ctx.rotate(n.spin * PI / 180); ctx.translate(0, 250); }
    ctx.rotate(n.r * PI / 180); ctx.scale(n.sx, n.sy); ctx.translate(0, -250);
    if (n.katana === 'back') { ctx.save(); ctx.rotate(-38 * PI / 180);
      f(rr(-8, -250, 16, 300, 6), '#c9d6df'); const h = rr(-11, -300, 22, 70, 6); f(h, '#0c0f16'); k(h, ACC, 3); f(rr(-26, -232, 52, 10, 4), '#d4a24c'); ctx.restore(); }
    f(P(n.scarf), ACC, .78);
    ctx.save(); rotAbout(ctx, n.legL, -34, 125); f(N.legL, '#11141c'); f(N.footL, '#06080c'); ctx.restore();
    ctx.save(); rotAbout(ctx, n.legR, 42, 125); f(N.legR, '#161a24'); f(N.footR, '#06080c'); ctx.restore();
    ctx.save(); ctx.translate(0, n.bob);
    f(N.torso, '#1c2130'); f(N.torsoSh, '#10131b'); f(N.torsoHi, '#2a3142'); k(N.torsoRim, ACC, 5, .9, 'butt');
    f(rr(-88, 70, 178, 22, 8), ACC); const bk = rr(18, 66, 30, 30, 6); f(bk, '#0c0f16'); k(bk, ACC, 4);
    k(N.vee, '#0c0f16', 10, .6, 'butt');
    ctx.save(); rotAbout(ctx, n.armL, -90, -20); k(N.armL, '#1b2030', 40); ctx.translate(-18, 0); k(N.armL, ACC, 4, .7, 'butt'); ctx.restore();
    ctx.save(); rotAbout(ctx, n.armR, 88, -24);
    if (n.katana === 'hand') { ctx.save(); ctx.translate(118, -172); ctx.rotate(11 * PI / 180);
      f(rr(-8, -300, 16, 280, 6), '#dfe8ee'); f(rr(-3, -292, 5, 262, 0), '#fff', .7); f(rr(-26, -26, 52, 10, 4), '#d4a24c');
      const g = rr(-11, -18, 22, 64, 6); f(g, '#0c0f16'); k(g, ACC, 3); ctx.restore(); }
    if (n.flag) { ctx.save(); ctx.translate(118, -172); ctx.rotate(-8 * PI / 180);
      k(P('M0 30 V-200'), '#f4f6fb', 7); f(P(clothD(n.t || 0)), ACC); ctx.restore(); }
    k(N.armR, '#202637', 40); f(circ(118, -172, 26), '#0c0f16'); ctx.restore();
    ctx.save(); rotAbout(ctx, n.headR, 0, -40);
    f(N.head, '#1c2130'); f(N.headSh1, '#10131b'); f(N.headSh2, '#0f1219'); f(N.headHi, '#2c3446');
    k(N.headRim, ACC, 6, 1, 'butt'); f(N.skin, '#f6cba7'); f(N.skinHi, '#ffe2c8');
    const face = n.face;
    f(face === 'w' ? N.brW : face === 's' ? N.brS : N.brN, '#0c0f16');
    if (face === 'h') k(N.eyH, '#0c0f16', 8);
    else if (face === 's') { ctx.save(); ctx.translate(n.eyeX * .5, n.eyeY * .3); f(N.eyeW, '#fff'); k(N.eyeW, '#0c0f16', 4); f(N.pup, '#0c0f16'); ctx.restore(); }
    else if (face === 'd') { ctx.save(); ctx.translate(n.eyeX, n.eyeY * .5); ctx.translate(0, -133); ctx.scale(1, .55); ctx.translate(0, 133); f(N.eyes, '#0c0f16'); ctx.restore(); }
    else if (face === 'blink') k(P('M-50 -132 H-22 M22 -132 H50'), '#0c0f16', 7);
    else { ctx.save(); ctx.translate(n.eyeX, n.eyeY); f(N.eyes, '#0c0f16'); f(N.eyeHi, '#fff'); ctx.restore(); }
    f(N.band, ACC); f(P(n.bandD), ACC);
    if (n.sweat > 0) { ctx.save(); ctx.translate(0, n.sweatY); f(N.sweat, '#bff6ff', n.sweat); k(N.sweat, ACC, 2, n.sweat); ctx.restore(); }
    k(N.head, '#fff', 2, .06);
    ctx.restore(); ctx.restore(); ctx.restore();
  }

  /* S.ninja.pose(t, o) -> state for S.ninja.draw
   * o: { x, y (feet), s (scale), pose, p (seconds since the pose started), air (-1 grounded, 0..1 jump phase),
   *      bump (0..1 squash at take-off / landing), face ('n' neutral, 'w' worried, 'h' happy, 's' shocked,
   *      'd' determined, 'blink'), look: [eyeX, eyeY] px, katana ('back'|'hand'|'none'), flag (bool: holds a flag),
   *      r (deg lean about the feet), spin (deg about the body centre), shadow (0..1, default 1) }
   * poses: 'idle' (breathing), 'climb' (reach-and-pull loop), 'hop' (crouch→stretch; use with air),
   *        'worried' (wobble on a ledge, sweat), 'slash' (p: 0–.35 draw & raise, .35–.58 slash, hold),
   *        'plant' (p: 0–.3 raise flag pole, .3–.7 plant, then proud fist, happy),
   *        'proud' (fist up, chest out), 'wave', 'fall' (p seconds of tumbling: flailing, shocked, spinning). */
  function pose(t, o = {}) {
    const p = o.p || 0, air = o.air == null ? -1 : o.air, bump = o.bump || 0;
    const stretch = air >= 0 ? Math.sin(PI * air) : 0;
    let sy = 1 - .1 * bump + .06 * stretch, sx = 1 + .06 * bump - .03 * stretch;
    const breath = Math.sin(2 * PI * .8 * t);
    let armR = 2 * breath, armL = -3 * breath, legL = 0, legR = 0, headR = 1.5 * Math.sin(2 * PI * .4 * t), r = o.r || 0, spin = o.spin || 0;
    let face = 'n', sweat = 0, katana = o.katana || 'back', scarfK = 1;
    let [eyeX, eyeY] = o.look || [0, 0];
    if (air >= 0) { legL = 22 * stretch; legR = -22 * stretch; armR += -28 * stretch; armL += 30 * stretch; scarfK = 1.6; }
    switch (o.pose || 'idle') {
      case 'climb': { const c = Math.sin(2 * PI * 1.6 * p); armR = -70 + 40 * c; armL = 40 - 40 * c; legL = 10 * c; legR = -10 * c; eyeY -= 6; break; }
      case 'hop': { const c = tri(p, 0, .14); sy *= 1 - .12 * c; sx *= 1 + .06 * c; break; }
      case 'worried': {
        face = 'w'; sweat = seg(p, .2, .4);
        const env = seg(p, .2, .6) * (o.calm ? 1 - o.calm : 1), ph = 2 * PI * 1.3 * (p - .2);
        r += 8 * Math.sin(ph) * env;
        armL += -55 * env * (.5 + .5 * Math.sin(ph + 1)); armR += 25 * env * Math.sin(ph + 2);
        legL += 8 * env * Math.sin(ph); legR += 8 * env * Math.sin(ph);
        break;
      }
      case 'slash': {
        face = o.face || 'd';
        if (p >= .12) katana = 'hand';
        if (p < .35) armR = lerp(0, -150, ioC(seg(p, 0, .35)));
        else armR = lerp(-150, 30, oC(seg(p, .35, .58))) + (p > 1 ? 2 * breath : 0);
        armL = p < .58 ? lerp(0, -40, seg(p, 0, .35)) : lerp(-40, 0, oC(seg(p, .7, 1.2)));
        break;
      }
      case 'plant': {
        if (p < .3) armR = lerp(0, 125, ioC(seg(p, .0, .3)));
        else armR = lerp(125, -18, oBack(seg(p, .35, .75))) + (p > .75 ? 3 * breath : 0);
        if (p >= .65) face = 'h';
        sy *= 1 + .05 * tri(p, .65, 1.0);
        break;
      }
      case 'proud': { face = 'h'; armR = -18 + 3 * breath; sy *= 1 + .02 * breath; break; }
      case 'wave': { face = 'h'; armR = -14 + 26 * Math.sin(2 * PI * 1.7 * p) * seg(p, 0, .3); break; }
      case 'fall': {
        face = 's'; scarfK = 2.2;
        const w = 2 * PI * 3.2 * p;
        armR = -120 + 50 * Math.sin(w); armL = 60 + 50 * Math.sin(w + 1.7);
        legL = 25 * Math.sin(w + .6); legR = -25 * Math.sin(w + 2.1); headR += 6 * Math.sin(w * .5);
        sweat = 1;
        break;
      }
    }
    if (o.face) face = o.face;
    if (o.sweat != null) sweat = o.sweat;
    const shadow = o.shadow == null ? 1 : o.shadow, airK = air >= 0 ? stretch : 0;
    return { t, x: o.x || 0, y: o.y || 0, s: o.s || 1, r, spin, sx, sy, shS: 1 - .4 * airK, shA: .45 * (1 - .6 * airK) * shadow, bob: 3 * breath,
      armR: armR + (o.armR || 0), armL: armL + (o.armL || 0), legL, legR, headR: headR + r * .4, katana, flag: !!o.flag,
      scarf: scarfD(t, scarfK), bandD: bandD(t, scarfK), face, eyeX, eyeY, sweat, sweatY: 14 * ((t * 1.1) % 1) };
  }

  /* S.track(KEYS) -> at(t) = { x, y, s, air, bump, moving }
   * KEYS: [[t, x, feetY, scale, arcHeightIntoThisKey], ...]  sorted by t. A key that differs from the previous
   * one is a move (hop / leap: arc > 0, or a slide: arc 0). bump = squash 0.14 s before take-off / 0.18 s after landing. */
  function track(KEYS) {
    const MOVES = [];
    for (let i = 0; i + 1 < KEYS.length; i++) { const a = KEYS[i], b = KEYS[i + 1]; if (a[1] !== b[1] || a[2] !== b[2] || a[3] !== b[3]) MOVES.push([a[0], b[0]]); }
    const at = t => {
      let i = 0; while (i + 2 < KEYS.length && t >= KEYS[i + 1][0]) i++;
      const a = KEYS[i], b = KEYS[i + 1], p = seg(t, a[0], b[0]);
      const moving = a[1] !== b[1] || a[2] !== b[2] || a[3] !== b[3];
      let e = ioC(p);
      if (moving && b[4] === 0) e = b[2] < a[2] ? oC(p) : iC(p);
      let bump = 0; for (const [m0, m1] of MOVES) bump = Math.max(bump, tri(t, m0 - .14, m0), tri(t, m1, m1 + .18));
      return { x: lerp(a[1], b[1], e), y: lerp(a[2], b[2], e) - b[4] * Math.sin(PI * p), s: lerp(a[3], b[3], e),
        air: moving && b[4] > 0 && p > 0 && p < 1 ? p : -1, bump, moving };
    };
    at.moves = MOVES; at.keys = KEYS;
    return at;
  }

  /* S.drawFlag(ctx, x, footY, t, wobbleDeg, scale) — summit flag (pole 220 px at scale 1, cyan cloth) */
  function drawFlag(ctx, x, fy, t, wob = 0, s = 1) {
    ctx.save(); ctx.translate(x, fy); ctx.scale(s, s); ctx.rotate(wob * PI / 180);
    strokeP(ctx, P('M0 0 V-220'), '#f4f6fb', 7); fillP(ctx, P(clothD(t)), ACC); fillP(ctx, circ(0, -222, 7), C.orange);
    ctx.restore();
  }
  /* flag planting helper: returns { y, wob, visible } for a flag dropped from above and planted at tPlant */
  function flagDrop(t, tPlant, fy, fall = .2, h = 520) {   // h: drop height in px (lower it when a headline sits above the summit)
    const fd = seg(t, tPlant - fall, tPlant), since = t - tPlant;
    return { visible: t >= tPlant - fall, y: fy - h * (1 - fd * fd), wob: since > 0 ? 7 * Math.sin(since * 16) * Math.exp(-since * 4) : 0 };
  }

  // ---------------------------------------------------------------- phone mockup
  /* S.phone(stage, { src, x=400, y=450, toggle:{x,y} }) -> { el, glow, seek(t, { in, out, toggleAt, bounce=1, scale=1 }) }
   * bounce 0..1 scales the rise overshoot (lower it when a headline sits just above the phone);
   * scale (> 1) zooms the whole phone about its top-left corner so the screenshot is readable on a phone.
   * 380x798 phone with lit cyan bezel + glow; rises with overshoot at `in`, drops at `out`; optional strict-mode toggle. */
  function phone(parent, o = {}) {
    const x = o.x == null ? 400 : o.x, y = o.y == null ? 450 : o.y;
    const glow = el(parent, 'div', 'abs s-glow', `left:${x - 260}px;top:${y - 100}px;opacity:0`); glow.setAttribute('data-bg', 'glow');
    // data-words: the screenshot carries words; check_overlap flags anything outside the phone painted over it
    const ph = el(parent, 'div', 'abs s-phone', `left:${x}px;top:${y}px;opacity:0;transform-origin:0 0`,
      `<div class="sc"><img src="${o.src || KIT + 'assets/app_s_run2.png'}" alt=""><div class="sheen"></div></div><div class="isl"></div>`);
    ph.dataset.words = 'screenshot';
    let tog = null, knob = null;
    if (o.toggle) {
      tog = el(ph.querySelector('.sc'), 'div', 'abs s-tog', `left:${o.toggle.x}px;top:${o.toggle.y}px;opacity:0`);
      knob = el(tog, 'div', 'abs s-knob');
    }
    return {
      el: ph, glow,
      seek(t, s = {}) {
        const a = s.in == null ? -1 : s.in, b = s.out == null ? 1e9 : s.out;
        const u = seg(t, a, a + .55), bo = s.bounce == null ? 1 : s.bounce;           // bounce 0..1: overshoot amount
        const pin = lerp(oC(u), oBack(u), bo), pout = iC(seg(t, b, b + .5));
        ph.style.transform = `translateY(${Math.round(1300 * (1 - pin) + 1300 * pout)}px)` + (s.scale && s.scale !== 1 ? ` scale(${s.scale})` : '');
        ph.style.opacity = t < a || t > b + .55 ? 0 : 1;
        glow.style.opacity = (seg(t, a + .25, a + .75) * (1 - seg(t, b - .1, b + .3))).toFixed(3);
        if (tog) {
          const ta = s.toggleAt == null ? 1e9 : s.toggleAt, tg = ioC(seg(t, ta, ta + .2));
          tog.style.opacity = t >= ta - .05 ? 1 : 0;
          tog.style.background = `rgb(${lerp(26, 62, tg) | 0},${lerp(24, 230, tg) | 0},${lerp(48, 255, tg) | 0})`;
          knob.style.transform = `translateX(${(16 * tg).toFixed(2)}px)`;
          knob.style.background = tg > .5 ? '#ffffff' : '#5d5a74';
        }
      }
    };
  }

  // ---------------------------------------------------------------- notification card (sliceable)
  /* S.notif(stage, { app='Scroll', when='now', text='New videos for you', x=140, y=500 }) -> { top, bot, seek(t, o) }
   * Generic app notification (never a real brand logo). Two stacked halves cut along a diagonal so it can be
   * sliced: o = { in, nudge:[a,b], cut, exit } — slides down at `in`, jitters during nudge, splits at `cut`
   * (top half flies left, bottom half right, both off-screen, staying in the card band: never across the headline or the ninja). */
  const GENERIC_ICON = `<svg width="104" height="104"><defs><linearGradient id="gIc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff5f8f"/><stop offset="1" stop-color="#7b5cff"/></linearGradient></defs><rect width="104" height="104" fill="url(#gIc)"/><path d="M42 32 L74 52 L42 72 Z" fill="#fff"/></svg>`;
  function notif(parent, o = {}) {
    const x = o.x == null ? 140 : o.x, y = o.y == null ? 500 : o.y;
    const inner = `<div class="ic">${o.icon || GENERIC_ICON}</div><div class="t1">${o.app || 'Scroll'}<i>${o.when || 'now'}</i></div><div class="t2">${o.text || 'New videos for you'}</div><div class="dot"></div>`;
    const top = el(parent, 'div', 'abs s-card', `left:${x}px;top:${y}px;clip-path:polygon(0 0,100% 0,100% 40px,0 160px)`, inner);
    const bot = el(parent, 'div', 'abs s-card', `left:${x}px;top:${y}px;clip-path:polygon(0 160px,100% 40px,100% 100%,0 100%);box-shadow:none`, inner);
    const words = [...top.querySelectorAll('.t1,.t2'), ...bot.querySelectorAll('.t1,.t2')];
    bot.querySelectorAll('linearGradient').forEach(g => g.id = 'gIc2'); bot.querySelectorAll('rect').forEach(r => r.setAttribute('fill', 'url(#gIc2)'));
    return {
      top, bot, x, y,
      seek(t, s = {}) {
        const a = s.in == null ? -1 : s.in, cut = s.cut == null ? 1e9 : s.cut;
        const cin = oBack(seg(t, a, a + .45));
        const [n0, n1] = s.nudge || [1e9, 1e9];
        const nudge = 6 * Math.sin(2 * PI * 3 * t) * seg(t, n0, n0 + .2) * (1 - seg(t, n1 - .2, n1));
        // drops in from 70 px above (not from off-screen) so its words never leave the safe zone
        const base = `translate(${Math.round(nudge)}px,${Math.round(-70 * (1 - cin))}px)`;
        // the words vanish just before the blade lands: a split card never carries half-words off-screen
        const wop = (1 - seg(t, cut - .12, cut - .04)).toFixed(3);   // during the katana raise
        words.forEach(w => { w.style.opacity = wop; });
        const k = seg(t, cut, cut + .75), e = k * k, sep = oC(seg(t, cut, cut + .12));
        // halves fly sideways (left / right) in their own band: they never cross the headline above or the ninja below
        top.style.transform = base + ` translate(${(-14 * sep - 1250 * e - 120 * k).toFixed(1)}px,${(-6 * sep + 30 * oC(k)).toFixed(1)}px) rotate(${(4 * k).toFixed(2)}deg)`;
        bot.style.transform = base + ` translate(${(14 * sep + 1250 * e + 120 * k).toFixed(1)}px,${(6 * sep - 10 * oC(k)).toFixed(1)}px) rotate(${(-4 * k).toFixed(2)}deg)`;
        const op = seg(t, a, a + .12) * (1 - seg(t, cut + .55, cut + .75)) * (s.exit == null ? 1 : 1 - seg(t, s.exit, s.exit + .3));
        top.style.opacity = bot.style.opacity = op.toFixed(3);
      }
    };
  }

  /* S.slash(stage, { d }) -> { seek(t, t0, dur=.18) } katana slash arc (cyan glow + white core), draws on, fades */
  function slash(parent, o = {}) {
    const d = o.d || 'M90 700 Q540 640 1000 470';
    const s = svg(parent, 'abs full', `<path d="${d}" fill="none" stroke="#3ee6ff" stroke-width="34" stroke-linecap="round" opacity=".55"/><path d="${d}" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round"/>`);
    const paths = [...s.querySelectorAll('path')];
    let L = 0;
    return {
      el: s,
      seek(t, t0, dur = .18) {
        if (!L) L = paths[0].getTotalLength();
        const sp = oC(seg(t, t0, t0 + dur)), so = 1 - seg(t, t0 + dur + .07, t0 + dur + .42);
        paths.forEach(p => { p.style.strokeDasharray = `${L} ${L}`; p.style.strokeDashoffset = (L * (1 - sp)).toFixed(2); });
        s.style.opacity = (t >= t0 ? so : 0).toFixed(3);
      }
    };
  }

  // ---------------------------------------------------------------- text
  /* S.text(stage, html, { top, cls='head', max=190 }) -> element. Headline lines: pass '<div>LINE 1</div><div class="or">LINE 2</div>'
   * or a single line string. `max` = font size in px, auto-shrunk so each line fits 840 px (x 120–960). */
  function text(parent, html, o = {}) {
    const cls = o.cls || 'head';
    let inner = html;
    if (cls === 'head') {
      if (!/^\s*<div/.test(html)) inner = `<div>${html}</div>`;
      const tmp = document.createElement('div'); tmp.innerHTML = inner;
      [...tmp.children].forEach(d => { if (!d.querySelector('span[data-max]')) d.innerHTML = `<span data-max="${d.dataset.max || o.max || 190}">${d.innerHTML}</span>`; });
      inner = tmp.innerHTML;
    }
    const e = el(parent, 'div', `abs block ${cls}${o.color ? ' ' + o.color : ''}`, `top:${o.top == null ? 300 : o.top}px;opacity:0;${o.style || ''}`, inner);
    return e;
  }
  const kicker = (parent, txt, o = {}) => text(parent, txt, Object.assign({ cls: 'kick', top: 250 }, o));
  /* S.chip(stage, html, { top, left, center=true, size=56, cyan }) — white pill; <b> inside is teal */
  function chip(parent, html, o = {}) {
    if (o.center !== false && o.left == null)
      return el(parent, 'div', 'abs block', `top:${o.top || 600}px;opacity:0`, `<span class="chip${o.cyan ? ' cyan' : ''}" style="font-size:${o.size || 56}px">${html}</span>`);
    return el(parent, 'div', `abs chip${o.cyan ? ' cyan' : ''}`, `left:${o.left}px;top:${o.top || 600}px;font-size:${o.size || 56}px;opacity:0`, html);
  }
  /* S.show(el, t, a, b, { dy=40, pop, hold0, rot }) — fade/slide in at a (0.35 s), out at b (0.3 s).
   * hold0: fully visible at t = a (use for the frame-0 hook). pop: overshoot rise. Integer px only (no scale). */
  function show(e, t, a, b, o = {}) {
    const pin = o.hold0 ? 1 : seg(t, a, a + .35), pout = seg(t, b, b + .3);
    const op = pin * (1 - pout);
    const y = (1 - (o.pop ? oBack : oC)(o.hold0 ? 1 : seg(t, a, a + .45))) * (o.pop ? 70 : (o.dy == null ? 40 : o.dy)) - 30 * iC(pout);
    e.style.opacity = op.toFixed(3);
    e.style.transform = `translateY(${Math.round(y)}px)` + (o.rot ? ` rotate(${o.rot}deg)` : '');
  }
  function fitText(root = document) {
    root.querySelectorAll('.head span[data-max]').forEach(sp => {
      let px = +sp.dataset.max; sp.style.fontSize = px + 'px'; sp.parentElement.style.fontSize = px + 'px';
      while (sp.offsetWidth > 840 && px > 60) { px -= 2; sp.style.fontSize = px + 'px'; sp.parentElement.style.fontSize = px + 'px'; }
    });
  }

  // ---------------------------------------------------------------- end card
  /* S.endCard(stage, { top=320, icon }) -> { seek(t, t0) }
   * App icon (240 px) + "SUMMITLY" + "FREE ON THE APP STORE" + cyan chip SEARCH "SUMMITLY"
   * (icon 320–560, title ≈ 600–750, kicker ≈ 780–810, chip ≈ 836–930). The wide kicker stays above y 840 so
   * nothing sits in the x > 780 / y > 840 UI corner. Pops in staggered from t0 (+0.05 / .2 / .4 / .55).
   * Keep the ninja and props below y ≈ 960 (feet ~1300, scale ≤ .5). */
  function endCard(parent, o = {}) {
    const top = o.top == null ? 320 : o.top;
    const icon = el(parent, 'img', 'abs s-icon', `left:420px;top:${top}px;opacity:0`); icon.src = o.icon || KIT + 'assets/icon.png'; icon.alt = '';
    const title = text(parent, 'SUMMITLY', { top: top + 272, max: 170 });
    const k = kicker(parent, 'FREE ON THE APP STORE', { top: top + 450, style: 'color:#fff' });
    const c = el(parent, 'div', 'abs block', `top:${top + 516}px;opacity:0`, `<span class="chip cyan" style="font-size:46px">SEARCH "SUMMITLY"</span>`);
    return {
      els: [icon, title, k, c],
      seek(t, t0) {
        show(icon, t, t0 + .05, 1e9, { pop: true });
        show(title, t, t0 + .2, 1e9);
        show(k, t, t0 + .4, 1e9, { dy: 24 });
        show(c, t, t0 + .55, 1e9, { pop: true });
      }
    };
  }

  // ---------------------------------------------------------------- rewind / VHS overlay (no blur)
  /* S.rewind(stage) -> { seek(t, a, b) } — between a and b: cool tint, scanlines, jittering tracking bar and
   * a "◀◀ REWIND" badge (drawn shapes, no glyph dependency). Pair with playing a motion backwards. */
  function rewind(parent, o = {}) {   // o.x, o.y: REWIND badge position (default 140, 1150)
    const wrap = el(parent, 'div', 'abs full', 'opacity:0;pointer-events:none'); wrap.setAttribute('data-bg', 'rewind');   // stage-wide tint; its REWIND word is still checked
    el(wrap, 'div', 'abs full', 'background:rgba(40,90,160,.28);mix-blend-mode:screen');
    el(wrap, 'div', 'abs full', 'background:repeating-linear-gradient(0deg,rgba(0,0,0,.22) 0 3px,rgba(0,0,0,0) 3px 7px)');
    const bar = el(wrap, 'div', 'abs', 'left:0;top:0;width:1080px;height:46px;background:rgba(255,255,255,.18)');
    const bar2 = el(wrap, 'div', 'abs', 'left:0;top:0;width:1080px;height:14px;background:rgba(62,230,255,.35)');
    const badge = el(wrap, 'div', 'abs', `left:${o.x == null ? 140 : o.x}px;top:${o.y == null ? 1150 : o.y}px;height:72px;padding:0 28px 0 22px;border-radius:16px;background:rgba(11,16,38,.75);display:flex;align-items:center;gap:18px;font:400 40px PM;letter-spacing:.2em;color:#fff`,
      '<svg width="74" height="44"><path d="M36 2 L2 22 L36 42Z M72 2 L38 22 L72 42Z" fill="#fff"/></svg>REWIND');
    return {
      el: wrap,
      seek(t, a, b) {
        const on = seg(t, a, a + .06) * (1 - seg(t, b - .06, b));
        wrap.style.opacity = on.toFixed(3);
        const f = Math.floor(t * 30);
        bar.style.transform = `translateY(${Math.round(((t - a) * 2400) % 1920)}px)`;
        bar2.style.transform = `translateY(${Math.round((hash(f) * 1800))}px)`;
        badge.style.opacity = (Math.floor(t * 4) % 2 === 0 ? 1 : .55).toFixed(2);
      },
      jitter: t => Math.round((hash(Math.floor(t * 30)) - .5) * 16)   // px horizontal frame jitter while rewinding
    };
  }

  // ---------------------------------------------------------------- safe-zone guide
  /* Shown only when the page URL has ?guide=1 (never in renders): TikTok/Reels/Shorts safe zone.
   * Words, logo, CTA and the ninja's face inside x 120–960, y 240–1260; nothing important at x > 780 below y 840. */
  function safeGuide(parent) {
    if (!/guide=1/.test(location.search)) return null;
    return svg(parent, 'abs full', `<rect x="120" y="240" width="840" height="1020" fill="none" stroke="#0f0" stroke-width="4" stroke-dasharray="16 10"/>
<rect x="780" y="840" width="300" height="1080" fill="rgba(255,0,0,.25)"/><rect x="0" y="1260" width="1080" height="660" fill="rgba(255,0,0,.18)"/>`, 'z-index:999;pointer-events:none');
  }

  // ---------------------------------------------------------------- boot
  /* S.boot({ duration, fps=30, seek(t), ready: async () => {} })
   * Sets window.DURATION/FPS/STAGE_W/H/seek/ready, waits for images + fonts, fits headlines, paints t=0;
   * outside capture mode (?capture=1) it scales the stage to the window and loops a live preview. */
  function boot(o) {
    window.FPS = o.fps || 30; window.DURATION = o.duration; window.STAGE_W = 1080; window.STAGE_H = 1920;
    window.seek = o.seek;
    window.ready = (async () => {
      await Promise.all([...document.images].map(im => im.decode()));
      await document.fonts.load('800 100px BS'); await document.fonts.load('400 40px PM'); await document.fonts.load('600 40px HG');
      await document.fonts.ready;
      fitText();
      if (o.ready) await o.ready();
      o.seek(0);
      for (let i = 0; i < 3; i++) await new Promise(r => requestAnimationFrame(() => r()));
    })();
    const st = $('stage');
    const fit = () => { const s = Math.min(innerWidth / 1080, innerHeight / 1920); st.style.transform = `scale(${s})`; };
    if (!location.search.includes('capture=1')) {
      addEventListener('resize', fit); fit();
      window.ready.then(() => { const t0 = performance.now(); const loop = n => { o.seek(((n - t0) / 1000) % o.duration); requestAnimationFrame(loop); }; requestAnimationFrame(loop); });
    }
    return window.ready;
  }
  /* call at the end of seek(t): elements at opacity 0 leave the render tree (keeps layer set a function of t) */
  function hideInvisible(root) {
    (root || $('stage')).querySelectorAll('.abs').forEach(e => { const op = e.style.opacity; e.style.visibility = (op !== '' && parseFloat(op) <= 0) ? 'hidden' : 'visible'; });
  }

  window.Summit = {
    KIT, C, clamp, seg, oC, iC, ioC, oBack, lerp, tri, hash, $,
    stage, mountains, canvas, clear, ninja: { draw: drawNinja, pose }, track, drawFlag, flagDrop,
    phone, notif, slash, text, kicker, chip, show, fitText, endCard, rewind, safeGuide, boot, hideInvisible, el, svg,
  };
})();

/* ---------------------------------------------------------------- SENSEI (mentor = the in-app habit coach)
 * Added by the EP2 agent as an extension block (keeps every earlier export intact).
 *   const n = S.sensei.pose(t, { x, y, s, pose: 'sit'|'stand', ... });  S.sensei.draw(ctx, n);
 * Rig units: feet / seat bottom at (0,0). Standing ≈ 470 px tall at s = 1 (face ≈ 330·s above the feet);
 * sitting (cross-legged) ≈ 400 px tall (face ≈ 300·s above the seat). Calm old ninja master: white beard,
 * grey robe, cyan headband, wooden staff. Everything is a pure function of the pose object.
 * pose(t, o) fields (all optional):
 *   pose   'sit' (cross-legged, gentle hover option) | 'stand'
 *   eyes   'calm' (closed, content) | 'open' | 'wink' (left closed, right open) | 'wide' | 'happy' | 'blink'
 *   brow   -1..1 (−1 stern frown, 0 neutral, 1 raised)     look [ex, ey] pupil offset px
 *   talk   0..1 mouth open (drive it with S.sensei.talk(t, a, b))   smile 0..1
 *   arm    left-hand action: 'lap' | 'beard' (strokes the beard) | 'point' | 'tea' (holds a cup) | 'raise'
 *   armK   0..1 blend into that action (default 1)
 *   staff  deg tilt of the staff (right hand); staffUp px lift (for a tap: lift then drop)
 *   float  px hover (meditation levitation)   r deg lean   headR deg head tilt   bump 0..1 squash
 *   mirror true → faces left (flip)          shadow 0..1
 */
(function () {
  'use strict';
  const S = window.Summit; if (!S || S.sensei) return;
  const { clamp, seg, ioC, oC, lerp, tri } = S, PI = Math.PI;
  const P = d => new Path2D(d);
  const circ = (x, y, r) => { const p = new Path2D(); p.arc(x, y, r, 0, 2 * PI); return p; };
  const elp = (x, y, rx, ry, rot = 0) => { const p = new Path2D(); p.ellipse(x, y, rx, ry, rot, 0, 2 * PI); return p; };
  const rr = (x, y, w, h, r) => { const p = new Path2D(); p.roundRect(x, y, w, h, r); return p; };
  const F = (ctx, p, c, a = 1) => { ctx.globalAlpha = a; ctx.fillStyle = c; ctx.fill(p); ctx.globalAlpha = 1; };
  const K = (ctx, p, c, w, a = 1, cap = 'round') => { ctx.globalAlpha = a; ctx.strokeStyle = c; ctx.lineWidth = w; ctx.lineCap = cap; ctx.lineJoin = 'round'; ctx.stroke(p); ctx.globalAlpha = 1; };
  const rot = (ctx, deg, cx, cy) => { ctx.translate(cx, cy); ctx.rotate(deg * PI / 180); ctx.translate(-cx, -cy); };
  const CY = S.C.cyan, ROBE = '#8e97ab', ROBE_D = '#687188', ROBE_L = '#b3bccd', SKIN = '#f0c39d', SKIN_D = '#d9a47c', HAIR = '#f4f1ea', HAIR_D = '#cfcbc2', INK = '#0c0f16', WOOD = '#8a5a34', WOOD_D = '#5e3a1e';

  // head-local geometry: head centre at (0,0), radius 100
  function bandTails(t, k) {
    const w = 2 * PI * 1.5, a = Math.sin(w * t) * k, b = Math.sin(w * t + 1.2) * k, c = Math.sin(w * t + 2.3) * k;
    return `M-92 -46 C-140 ${-60 + 6 * a} -180 ${-40 + 10 * b} -232 ${-62 + 16 * c} C-206 ${-28 + 10 * c} -170 ${-22 + 6 * b} -128 -24 C-160 ${4 + 6 * a} -196 ${10 + 10 * b} -226 ${30 + 14 * c} C-180 ${30 + 8 * b} -140 6 -96 -30 Z`;
  }
  function beardD(t, sway) {
    const s = sway, w = Math.sin(2 * PI * .7 * t) * 4 + s;
    return `M-74 26 C-86 70 -70 120 -40 ${160 + w * .3} C-20 ${196} ${-6 + w} ${226} ${4 + w * 1.4} ${238} C${14 + w} ${222} 26 196 44 ${160 - w * .3} C72 118 86 70 74 26 C40 54 -40 54 -74 26 Z`;
  }

  function drawHead(ctx, n) {
    const e = n.eyes, br = n.brow;
    // ears
    F(ctx, elp(-98, 6, 18, 26), SKIN_D); F(ctx, elp(98, 6, 18, 26), SKIN_D);
    // headband tails (behind the head)
    F(ctx, P(bandTails(n.t, n.tailK)), CY, .9);
    // head
    F(ctx, circ(0, 0, 100), SKIN);
    F(ctx, P('M60 -80 A100 100 0 0 1 70 72 A110 110 0 0 0 60 -80 Z'), SKIN_D, .55);
    F(ctx, elp(-34, -62, 34, 18, -.4), '#fff', .35);                 // bald-head shine
    // side hair tufts
    F(ctx, P('M-100 -6 C-118 20 -112 52 -88 64 C-96 40 -92 16 -84 -4 Z'), HAIR);
    F(ctx, P('M100 -6 C118 20 112 52 88 64 C96 40 92 16 84 -4 Z'), HAIR);
    // topknot
    F(ctx, elp(0, -104, 22, 16), HAIR); F(ctx, rr(-8, -96, 16, 10, 3), CY);
    // headband
    F(ctx, P('M-100 -40 C-50 -62 50 -62 100 -40 L98 -16 C50 -36 -50 -36 -98 -16 Z'), CY);
    F(ctx, P('M-100 -40 C-50 -62 50 -62 100 -40 L100 -34 C50 -56 -50 -56 -100 -34 Z'), '#bff6ff', .6);
    // brows (bushy white, expressive)
    const bl = -8 - 14 * br, tilt = br < 0 ? -br * 12 : -br * 4;
    ctx.save(); ctx.translate(-36, bl + 6); ctx.rotate((tilt) * PI / 180);
    F(ctx, P('M-30 2 C-24 -12 18 -14 30 -2 C16 -6 -10 -4 -30 8 Z'), HAIR); K(ctx, P('M-30 4 C-20 -8 16 -10 30 -2'), HAIR_D, 2, .7); ctx.restore();
    ctx.save(); ctx.translate(36, bl + 6); ctx.rotate((-tilt) * PI / 180);
    F(ctx, P('M30 2 C24 -12 -18 -14 -30 -2 C-16 -6 10 -4 30 8 Z'), HAIR); K(ctx, P('M30 4 C20 -8 -16 -10 -30 -2'), HAIR_D, 2, .7); ctx.restore();
    // eyes
    const ex = n.look[0], ey = n.look[1];
    const closed = x => K(ctx, P(`M${x - 15} 22 Q${x} 33 ${x + 15} 22`), INK, 6);     // content, closed (∪)
    const happy = x => K(ctx, P(`M${x - 15} 28 Q${x} 12 ${x + 15} 28`), INK, 6);      // ∩
    const open = (x, r = 9) => { F(ctx, elp(x + ex, 24 + ey, r, r * 1.15), INK); F(ctx, circ(x + ex + 3, 20 + ey, r * .36), '#fff'); };
    const wide = x => { F(ctx, elp(x, 22, 16, 18), '#fff'); K(ctx, elp(x, 22, 16, 18), INK, 3.5); F(ctx, circ(x + ex * .6, 23 + ey * .6, 7), INK); };
    if (e === 'calm') { closed(-36); closed(36); }
    else if (e === 'happy') { happy(-36); happy(36); }
    else if (e === 'wink') { closed(-36); open(36); }
    else if (e === 'wide') { wide(-36); wide(36); }
    else if (e === 'blink') { K(ctx, P('M-50 24 H-22 M22 24 H50'), INK, 6); }
    else { open(-36); open(36); }
    // cheeks + nose
    F(ctx, elp(-58, 44, 14, 8), '#ff9a8a', .35); F(ctx, elp(58, 44, 14, 8), '#ff9a8a', .35);
    F(ctx, elp(0, 40, 13, 11), SKIN_D);
    // beard (sways), mouth, mustache
    F(ctx, P(beardD(n.t, n.sway)), HAIR);
    K(ctx, P('M-30 90 C-20 130 -6 170 2 200 M26 96 C22 130 14 160 10 190'), HAIR_D, 3, .8);
    const mo = n.talk, sm = n.smile;
    if (mo > .02) { F(ctx, elp(0, 72 + 4 * mo, 14 + 4 * mo, 4 + 13 * mo), '#4a1f22'); F(ctx, elp(0, 78 + 9 * mo, 8, 3 + 4 * mo), '#e0707a', .9); }
    else K(ctx, P(`M-14 ${70 - 2 * sm} Q0 ${74 + 8 * sm} 14 ${70 - 2 * sm}`), '#4a1f22', 4);
    F(ctx, P('M0 52 C-16 46 -40 48 -58 62 C-66 70 -76 70 -84 62 C-74 80 -50 82 -34 72 C-20 66 -8 64 0 66 C8 64 20 66 34 72 C50 82 74 80 84 62 C76 70 66 70 58 62 C40 48 16 46 0 52 Z'), HAIR);
    K(ctx, P('M-4 58 C-20 56 -40 60 -56 70 M4 58 C20 56 40 60 56 70'), HAIR_D, 2, .7);
    K(ctx, circ(0, 0, 100), '#fff', 2, .08);
  }

  // left arm (viewer's left) actions, in body coords. Returns hand position.
  function drawArmL(ctx, n, sh) {
    const k = n.armK, a = n.arm;
    // targets for the hand relative to the shoulder (sh = [x, y])
    const T = { lap: [10, 150], beard: [92, 10], point: [-150, -40], tea: [40, 92], raise: [-60, -150] }[a] || [10, 150];
    const L0 = [10, 150];
    const hx = sh[0] + lerp(L0[0], T[0], k), hy = sh[1] + lerp(L0[1], T[1], k);
    // stroking: small up/down rub on the beard
    let rx = 0, ry = 0;
    if (a === 'beard') { ry = 14 * Math.sin(2 * PI * 1.6 * n.t) * k; rx = 4 * Math.sin(2 * PI * 1.6 * n.t + 1) * k; }
    const X = hx + rx, Y = hy + ry;
    const mx = (sh[0] + X) / 2 - 30, my = (sh[1] + Y) / 2 + 20;
    K(ctx, P(`M${sh[0]} ${sh[1]} Q${mx} ${my} ${X} ${Y}`), ROBE_D, 50);
    K(ctx, P(`M${sh[0]} ${sh[1]} Q${mx} ${my} ${X} ${Y}`), ROBE, 40);
    F(ctx, circ(X, Y, 20), SKIN); F(ctx, circ(X + 4, Y + 4, 12), SKIN_D, .4);
    if (a === 'tea' && k > .5) {
      F(ctx, P(`M${X - 26} ${Y - 46} L${X + 26} ${Y - 46} L${X + 20} ${Y - 6} Q${X} ${Y + 2} ${X - 20} ${Y - 6} Z`), '#e9eef6');
      F(ctx, rr(X - 26, Y - 46, 52, 9, 4), CY, .85);
      for (let i = 0; i < 2; i++) { const o = (n.t * .8 + i * .5) % 1; K(ctx, P(`M${X - 7 + i * 14} ${Y - 54 - 50 * o} q8 -10 0 -20 q-8 -10 0 -20`), '#fff', 3, .55 * (1 - o)); }
      F(ctx, circ(X - 14, Y - 4, 11), SKIN);
    }
    return [X, Y];
  }

  function drawStaff(ctx, n, hand) {
    ctx.save(); ctx.translate(hand[0], hand[1]); ctx.rotate(n.staff * PI / 180); ctx.translate(0, -n.staffUp);
    const bot = n.sit ? 96 : 300;
    K(ctx, P(`M0 -250 L0 ${bot}`), WOOD_D, 20); K(ctx, P(`M0 -250 L0 ${bot}`), WOOD, 14);
    K(ctx, P(`M-3 -240 L-3 ${bot - 10}`), '#c08a5a', 3, .7);
    F(ctx, elp(0, -262, 22, 26), WOOD); F(ctx, elp(-6, -270, 8, 10), '#c08a5a', .7);   // knot top
    F(ctx, rr(-12, -214, 24, 16, 5), CY);                                                 // cyan wrap
    ctx.restore();
  }

  function draw(ctx, n) {
    ctx.save(); ctx.translate(n.x, n.y); ctx.scale(n.s, n.s);
    if (n.shA > 0) F(ctx, elp(0, 4 + n.float, n.sit ? 170 : 130, 22), '#000', n.shA);
    ctx.translate(0, -n.float);
    ctx.rotate(n.r * PI / 180); ctx.scale(n.sx, n.sy);
    const sit = n.sit, bob = n.bob;
    const sh = sit ? [-78, -200 + bob] : [-78, -270 + bob];         // left shoulder
    const shR = sit ? [78, -200 + bob] : [78, -270 + bob];
    const handR = [shR[0] + 50, shR[1] + 110];
    // staff behind the right arm
    drawStaff(ctx, n, handR);
    if (sit) {
      // crossed legs base
      F(ctx, P('M-170 -10 C-180 -70 -110 -96 -40 -84 L40 -84 C110 -96 180 -70 170 -10 C150 10 -150 10 -170 -10 Z'), ROBE_D);
      F(ctx, P('M-160 -20 C-160 -64 -100 -82 -30 -74 C-60 -50 -90 -30 -150 -12 Z'), ROBE, .9);
      F(ctx, P('M160 -20 C160 -64 100 -82 30 -74 C60 -50 90 -30 150 -12 Z'), ROBE, .9);
      F(ctx, elp(-120, -8, 34, 14), INK); F(ctx, elp(120, -8, 34, 14), INK);         // feet
      // torso
      F(ctx, P(`M-96 ${-210 + bob} C-120 -150 -128 -90 -118 -60 L118 -60 C128 -90 120 -150 96 ${-210 + bob} C60 ${-236 + bob} -60 ${-236 + bob} -96 ${-210 + bob} Z`), ROBE);
      F(ctx, P(`M40 ${-226 + bob} C80 ${-220 + bob} 96 -200 106 -170 C120 -130 122 -90 118 -60 L60 -60 C80 -110 70 -180 40 ${-226 + bob} Z`), ROBE_D, .7);
      F(ctx, P(`M-50 ${-226 + bob} L0 ${-140 + bob} L50 ${-226 + bob} L30 ${-228 + bob} L0 ${-168 + bob} L-30 ${-228 + bob} Z`), ROBE_L);
      F(ctx, rr(-112, -100, 224, 26, 10), '#262b3c'); F(ctx, rr(-112, -100, 224, 6, 3), CY, .8);   // sash
    } else {
      F(ctx, elp(-40, -6, 40, 14), INK); F(ctx, elp(40, -6, 40, 14), INK);
      F(ctx, P(`M-96 ${-280 + bob} C-124 -200 -140 -90 -134 -14 L134 -14 C140 -90 124 -200 96 ${-280 + bob} C60 ${-306 + bob} -60 ${-306 + bob} -96 ${-280 + bob} Z`), ROBE);
      F(ctx, P(`M40 ${-296 + bob} C80 ${-290 + bob} 100 -260 112 -220 C128 -150 136 -80 134 -14 L70 -14 C90 -100 80 -220 40 ${-296 + bob} Z`), ROBE_D, .7);
      F(ctx, P(`M-50 ${-296 + bob} L0 ${-200 + bob} L50 ${-296 + bob} L30 ${-298 + bob} L0 ${-230 + bob} L-30 ${-298 + bob} Z`), ROBE_L);
      F(ctx, rr(-118, -170, 236, 26, 10), '#262b3c'); F(ctx, rr(-118, -170, 236, 6, 3), CY, .8);
      K(ctx, P('M-60 -140 C-66 -90 -70 -50 -72 -16 M20 -140 C24 -90 26 -50 28 -16'), ROBE_D, 3, .6);
    }
    // right arm holding the staff
    K(ctx, P(`M${shR[0]} ${shR[1]} Q${shR[0] + 50} ${shR[1] + 40} ${handR[0]} ${handR[1]}`), ROBE_D, 50);
    K(ctx, P(`M${shR[0]} ${shR[1]} Q${shR[0] + 50} ${shR[1] + 40} ${handR[0]} ${handR[1]}`), ROBE, 40);
    F(ctx, circ(handR[0], handR[1], 21), SKIN);
    // head
    ctx.save();
    const hc = [0, (sit ? -300 : -370) + bob];
    rot(ctx, n.headR, 0, hc[1] + 70);
    ctx.translate(hc[0], hc[1]);
    drawHead(ctx, n);
    ctx.restore();
    // left arm last when it reaches the beard/face (in front of the beard)
    drawArmL(ctx, n, sh);
    ctx.restore();
  }

  function pose(t, o = {}) {
    const sit = (o.pose || 'sit') === 'sit';
    const breath = Math.sin(2 * PI * .5 * t), bump = o.bump || 0;
    const p = o.p || 0;
    let sy = 1 - .08 * bump + .012 * breath, sx = 1 + .05 * bump;
    if (o.mirror) sx *= -1;
    let eyes = o.eyes || 'open';
    // natural blinks for open eyes (deterministic)
    if (eyes === 'open' && !o.noBlink) { const ph = (t + 0.37) % 3.1; if (ph < .1) eyes = 'blink'; }
    const fl = o.float || 0;
    return {
      t, x: o.x || 0, y: o.y || 0, s: o.s || 1, sit, sx, sy, r: o.r || 0, bob: 3 * breath,
      float: fl + (fl ? 6 * Math.sin(2 * PI * .6 * t) : 0), shA: (.4 - (fl ? .15 : 0)) * (o.shadow == null ? 1 : o.shadow),
      eyes, brow: o.brow || 0, look: o.look || [0, 0], talk: clamp(o.talk || 0), smile: o.smile == null ? .5 : o.smile,
      arm: o.arm || 'lap', armK: o.armK == null ? 1 : clamp(o.armK), staff: o.staff == null ? 6 : o.staff, staffUp: o.staffUp || 0,
      headR: (o.headR || 0) + 1.5 * Math.sin(2 * PI * .3 * t), sway: (o.sway || 0), tailK: o.tailK == null ? 1 : o.tailK, p,
    };
  }
  /* mouth flap while a line is spoken between a and b (syllable-ish rhythm, deterministic) */
  function talk(t, a, b) {
    if (t < a || t > b) return 0;
    const e = Math.min(1, (t - a) / .08, (b - t) / .08);
    return e * (.25 + .75 * Math.abs(Math.sin(2 * PI * 4.2 * (t - a)) * (.7 + .3 * Math.sin(2 * PI * 1.3 * (t - a)))));
  }
  /* S.sensei.rock(ctx, x, y, w, h): flat-topped meditation rock, top surface at y (seat), base below */
  function rock(ctx, x, y, w = 360, h = 220) {
    ctx.save(); ctx.translate(x, y);
    const hw = w / 2;
    F(ctx, P(`M${-hw} ${h} C${-hw - 20} ${h * .5} ${-hw + 10} 10 ${-hw + 50} 0 L${hw - 40} -6 C${hw + 4} 6 ${hw + 24} ${h * .5} ${hw + 10} ${h} Z`), '#241f3e');
    F(ctx, P(`M${hw - 40} -6 C${hw + 4} 6 ${hw + 24} ${h * .5} ${hw + 10} ${h} L${hw * .3} ${h} C${hw * .6} ${h * .5} ${hw * .5} 20 ${hw - 40} -6 Z`), '#17142b');
    K(ctx, P(`M${-hw + 50} 0 L${hw - 40} -6`), '#ff9a6a', 4, .7);
    K(ctx, P(`M${-hw * .4} ${h * .35} l30 26 l-10 30`), '#3a335e', 4, .8);
    ctx.restore();
  }

  S.sensei = { pose, draw, talk, rock };
})();
