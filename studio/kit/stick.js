/* stick.js — STICK NINJA kit: brand-neutral, frame-pure, vertical (1080x1920) lesson videos.
 *
 *   <script src="kit/stick.js"></script>          (global `Stick`; <project>/kit is a symlink to ../kit)
 *
 * Everything is a pure function of t: no timers, no CSS animation, no state carried between frames.
 * Pieces (all documented in kit/README.md, section "Stick Ninja kit"):
 *   stage / text / kin / kicker / chip / show / boot / hideInvisible / safeGuide   page + typography
 *   env(parent, kind, opt)        flat environments in WORLD coords (bedroom, library, rooftop, mountain, feed, void)
 *   world(stage)                  camera + whip-pan director: one canvas for ninja/props, shake, flash, speed lines
 *   ninja.pose / ninja.draw / ninja.timeline / track    the stick ninja rig (2-bone IK + pose library + blending)
 *   wordcut(opt)                  THE WORD CUT: solid 3D word, clip-split along the slash line, halves fall, sparks
 *   meter(stage, opt) + dopa()    the DOPAMINE METER (gauge + trace) and a spike/crash level generator
 *   goblin.draw                   the SCROLL GOBLIN (optional)
 *   props: phone, book, calendar page, laptop, check mark, sparks
 */
(function () {
  'use strict';
  const KIT = (document.currentScript && document.currentScript.src || '').replace(/stick\.js(\?.*)?$/, '') || 'kit/';
  const PI = Math.PI, TAU = 2 * PI, D2R = PI / 180;

  // ---------------------------------------------------------------- helpers
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const seg = (t, a, b) => clamp((t - a) / (b - a));
  const oC = x => 1 - Math.pow(1 - clamp(x), 3);
  const iC = x => Math.pow(clamp(x), 3);
  const ioC = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  const io = x => { x = clamp(x); return x * x * (3 - 2 * x); };
  const oBack = (x, c = 1.7) => { x = clamp(x); return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
  const oElastic = x => { x = clamp(x); return x === 0 || x === 1 ? x : Math.pow(2, -10 * x) * Math.sin((x * 10 - .75) * TAU / 3) + 1; };
  const lerp = (a, b, p) => a + (b - a) * p;
  const tri = (t, a, b) => (t <= a || t >= b) ? 0 : Math.sin(PI * (t - a) / (b - a));
  const hash = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const V = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
  const $ = id => document.getElementById(id);
  // every kit canvas is a software (CPU) canvas: Chromium may otherwise move a busy 2D canvas between GPU and CPU
  // raster mid-render, which changes antialiasing and breaks the "same t, same pixels" check.
  const SW2D = { willReadFrequently: true };
  const C = { navy: '#0b1026', ink: '#0d0f16', cyan: '#3ee6ff', orange: '#ffb36b', peach: '#ffd7b8', white: '#ffffff',
    pink: '#ff5c8a', purple: '#8a5cff', red: '#ff5a4f', green: '#5dffa8', skin: '#f3cfa8' };

  // ---------------------------------------------------------------- CSS + fonts
  function injectCSS() {
    if ($('stick-css')) return;
    const st = document.createElement('style'); st.id = 'stick-css';
    st.textContent = `
@font-face { font-family: BS; src: url(${KIT}fonts/big-shoulders-display-latin-800-normal.woff2) format("woff2"); font-weight: 800; }
@font-face { font-family: PM; src: url(${KIT}fonts/ibm-plex-mono-latin-400-normal.woff2) format("woff2"); font-weight: 400; }
@font-face { font-family: HG; src: url(${KIT}fonts/hanken-grotesk-latin-600-normal.woff2) format("woff2"); font-weight: 600; }
html,body { margin:0; height:100%; background:#000; overflow:hidden }
#stage { position:absolute; left:0; top:0; width:1080px; height:1920px; transform-origin:0 0; overflow:hidden; background:${C.navy}; color:#fff; font-family:HG, Arial, sans-serif }
.abs { position:absolute; will-change:transform,opacity }
.full { left:0; top:0; width:1080px; height:1920px }
.block { position:absolute; left:120px; width:840px; text-align:center }
.kick { font:400 40px PM; letter-spacing:.24em; color:${C.peach}; white-space:nowrap }
.head { font:800 190px/0.88 BS; text-transform:uppercase; letter-spacing:-.005em; text-shadow:0 8px 0 rgba(0,0,0,.35) }
.head div { white-space:nowrap } .head span { display:inline-block }
.head .w { display:inline-block; will-change:transform,opacity }
.head .wm { display:inline-block }
.cap { font:600 52px/1.15 HG; color:#fff; white-space:nowrap }
.or { color:${C.orange} } .cy { color:${C.cyan} } .pk { color:${C.pink} }
.chip { display:inline-block; padding:16px 30px; border-radius:999px; background:#fff; color:${C.ink}; font:600 52px HG; white-space:nowrap; box-shadow:0 10px 0 rgba(0,0,0,.28) }
.chip b { color:#0a9fbd; font-weight:600 } .chip.cyan { background:${C.cyan} } .chip.dark { background:#141b3a; color:#fff; box-shadow:0 0 0 3px rgba(62,230,255,.6) }
.chip.dark b { color:${C.cyan} }
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
  function stage() {
    injectCSS();
    let s = $('stage');
    if (!s) { s = el(document.body, 'div'); s.id = 'stage'; }
    window.STAGE_W = 1080; window.STAGE_H = 1920;
    return s;
  }

  // ---------------------------------------------------------------- typography
  function text(parent, html, o = {}) {
    let inner = /^\s*<div/.test(html) ? html : `<div>${html}</div>`;
    const tmp = document.createElement('div'); tmp.innerHTML = inner;
    [...tmp.children].forEach(d => { d.innerHTML = `<span data-max="${d.dataset.max || o.max || 170}">${d.innerHTML}</span>`; });
    return el(parent, 'div', `abs block head${o.color ? ' ' + o.color : ''}`, `top:${o.top == null ? 300 : o.top}px;opacity:0;${o.style || ''}`, tmp.innerHTML);
  }
  /* kinetic headline: every word is its own span (.w) that enters on its own beat. Lines: <div>..</div>.
   * Wrap a word in <i class="or">…</i> to colour it. kinShow(e, t, a, b, {stagger, beats:[t,...], style}) */
  function kin(parent, html, o = {}) {
    const e = text(parent, html, o);
    e.querySelectorAll('span[data-max]').forEach(sp => {
      const parts = [];
      sp.childNodes.forEach(nd => {
        if (nd.nodeType === 3) nd.data.split(/\s+/).filter(Boolean).forEach(w => parts.push(`<span class="wm"><span class="w">${w}</span></span>`));
        else parts.push(`<span class="wm"><span class="w ${nd.className || ''}">${nd.innerHTML}</span></span>`);
      });
      sp.innerHTML = parts.join(' ');
    });
    e._w = [...e.querySelectorAll('.w')];
    return e;
  }
  function kinShow(e, t, a, b, o = {}) {
    const st = o.stagger == null ? .09 : o.stagger, style = o.style || 'pop';
    const pout = seg(t, b, b + .25);
    e.style.opacity = (t >= a - .001 || o.hold0 ? 1 : 0) * (1 - pout) + '';
    e.style.transform = `translateY(${Math.round(-26 * iC(pout))}px)`;
    e._w.forEach((w, i) => {
      const t0 = o.beats ? (o.beats[i] == null ? o.beats[o.beats.length - 1] : o.beats[i]) : a + i * st;
      const k = o.hold0 && t0 <= 0 ? 1 : seg(t, t0, t0 + (style === 'slam' ? .16 : .3));
      // each word is wiped on with clip-path (glyphs stay in place) plus a short move: it never overlaps a neighbour
      let y, clip;
      if (style === 'slam') { y = (k >= 1 ? 8 * tri(t, t0 + .16, t0 + .32) : 0); clip = `inset(-20% -12% ${((1 - oC(k)) * 120).toFixed(1)}% -12%)`; }
      else if (style === 'rise') { y = 16 * (1 - oC(k)); clip = `inset(${((1 - oC(k)) * 120).toFixed(1)}% -12% -20% -12%)`; }
      else { y = 14 * (1 - oBack(k, 2.2)); clip = `inset(${((1 - oC(k * 1.3)) * 120).toFixed(1)}% -12% -20% -12%)`; }
      w.style.clipPath = k >= 1 ? 'inset(-20% -12% -20% -12%)' : clip;      // same clip type every frame (stable layer)
      w.style.opacity = (k > 0 ? clamp(k * 3) : 0).toFixed(3);
      w.style.transform = `translateY(${Math.max(-12, Math.round(y))}px)`;
    });
  }
  function kicker(parent, txt, o = {}) {
    return el(parent, 'div', `abs block kick${o.color ? ' ' + o.color : ''}`, `top:${o.top || 250}px;opacity:0;${o.style || ''}`, txt);
  }
  function chip(parent, html, o = {}) {
    if (o.left == null)
      return el(parent, 'div', 'abs block', `top:${o.top || 600}px;opacity:0`, `<span class="chip${o.cls ? ' ' + o.cls : ''}" style="font-size:${o.size || 52}px">${html}</span>`);
    return el(parent, 'div', `abs chip${o.cls ? ' ' + o.cls : ''}`, `left:${o.left}px;top:${o.top || 600}px;font-size:${o.size || 52}px;opacity:0`, html);
  }
  function show(e, t, a, b, o = {}) {
    const pin = o.hold0 ? 1 : seg(t, a, a + .3), pout = seg(t, b, b + .25);
    const op = pin * (1 - pout);
    const y = (1 - (o.pop ? oBack : oC)(o.hold0 ? 1 : seg(t, a, a + .4))) * (o.pop ? 60 : (o.dy == null ? 36 : o.dy)) - 26 * iC(pout);
    const x = (o.dx || 0) * (1 - oC(seg(t, a, a + .4)));
    e.style.opacity = op.toFixed(3);
    e.style.transform = `translate(${Math.round(x)}px,${Math.round(y)}px)`;
  }
  function fitText(root = document) {
    root.querySelectorAll('.head span[data-max]').forEach(sp => {
      let px = +sp.dataset.max; sp.style.fontSize = px + 'px'; sp.parentElement.style.fontSize = px + 'px';
      while (sp.offsetWidth > 840 && px > 60) { px -= 2; sp.style.fontSize = px + 'px'; sp.parentElement.style.fontSize = px + 'px'; }
    });
  }
  function hideInvisible(root) {
    (root || $('stage')).querySelectorAll('.abs').forEach(e => { const op = e.style.opacity; e.style.visibility = (op !== '' && parseFloat(op) <= 0) ? 'hidden' : 'visible'; });
  }
  function safeGuide(parent) {
    if (!/guide=1/.test(location.search)) return null;
    const s = document.createElementNS(svgNS, 'svg'); s.setAttribute('class', 'abs full'); s.setAttribute('width', 1080); s.setAttribute('height', 1920);
    s.setAttribute('style', 'z-index:999;pointer-events:none');
    s.innerHTML = `<rect x="120" y="240" width="840" height="1020" fill="none" stroke="#0f0" stroke-width="4" stroke-dasharray="16 10"/><rect x="780" y="840" width="300" height="1080" fill="rgba(255,0,0,.25)"/><rect x="0" y="1260" width="1080" height="660" fill="rgba(255,0,0,.18)"/>`;
    parent.appendChild(s); return s;
  }
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

  // ---------------------------------------------------------------- environments (world coords, floor y 1500)
  /* env(parent, kind, opt) -> { el, kind, floor, seek(t, o) }   kinds: bedroom, library, rooftop, mountain, feed, void
   * The layer is tagged data-bg (it is set dressing behind everything). Its CSS transform is set by world().
   * World coords = stage coords when the camera is at {x:540, y:960, z:1}; the art covers x -540..1620, y -960..2880. */
  const FLOOR = 1500;
  function envSvg(parent, inner, defs) {
    // no will-change here: the camera scales this layer, and a will-change layer would keep a stale raster scale
    const d = el(parent, 'div', 'full', 'position:absolute;transform-origin:0 0;opacity:0;visibility:hidden');
    d.dataset.bg = 'env';
    const s = document.createElementNS(svgNS, 'svg');
    s.setAttribute('width', 2160); s.setAttribute('height', 3840); s.setAttribute('viewBox', '-540 -960 2160 3840');
    s.setAttribute('style', 'position:absolute;left:-540px;top:-960px;overflow:visible');
    s.innerHTML = `<defs>${defs || ''}</defs>${inner}`;
    d.appendChild(s); return { d, s };
  }
  const grad = (id, stops, x2 = 0, y2 = 1) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a != null ? ` stop-opacity="${a}"` : ''}/>`).join('')}</linearGradient>`;
  const rgrad = (id, stops) => `<radialGradient id="${id}">${stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a != null ? ` stop-opacity="${a}"` : ''}/>`).join('')}</radialGradient>`;
  let envN = 0;
  function env(parent, kind, opt = {}) {
    const id = 'e' + (envN++) + '_';
    const F = opt.floor || FLOOR;
    let inner = '', defs = '', dyn = () => {};
    const books = (x0, y0, w, h, seed, pal) => {   // a shelf row of book spines
      let s = '', x = x0, i = 0;
      while (x < x0 + w - 18) {
        const bw = 18 + Math.floor(hash(seed + i * 3.1) * 22), bh = h - Math.floor(hash(seed + i * 7.3) * h * .35);
        const c = pal[Math.floor(hash(seed + i * 1.7) * pal.length)];
        const lean = hash(seed + i * 5.9) > .93 ? 8 : 0;
        s += `<rect x="${x}" y="${y0 - bh}" width="${bw}" height="${bh}" rx="3" fill="${c}" transform="rotate(${lean} ${x} ${y0})"/><rect x="${x + 4}" y="${y0 - bh + 12}" width="${bw - 8}" height="5" fill="#000" opacity=".25"/>`;
        x += bw + 3 + (lean ? 8 : 0); i++;
      }
      return s;
    };
    if (kind === 'bedroom') {
      defs = grad(id + 'wall', [[0, '#141b3d'], [1, '#0a0f25']]) + grad(id + 'flr', [[0, '#0b0f22'], [1, '#05070f']]) +
        rgrad(id + 'lamp', [[0, '#ffb36b', .55], [.5, '#ffb36b', .16], [1, '#ffb36b', 0]]) + rgrad(id + 'spot', [[0, '#2a3a7a', .55], [1, '#2a3a7a', 0]]) +
        grad(id + 'win', [[0, '#1b2a5e'], [1, '#3a3270']]) + rgrad(id + 'moon', [[0, '#fff7e0'], [.6, '#ffe7b8'], [1, '#ffd79a']]);
      const city = Array.from({ length: 9 }, (_, i) => { const w = 34 + hash(i + 3) * 30, h = 60 + hash(i * 2.3) * 150, x = 150 + i * 32; return `<rect x="${x}" y="${900 - h}" width="${w}" height="${h}" fill="#0c1230"/>` + (hash(i * 4.4) > .4 ? `<rect x="${x + 8}" y="${910 - h + 20}" width="6" height="8" fill="#ffd27a" opacity=".8"/>` : ''); }).join('');
      inner = `<rect x="-540" y="-960" width="2160" height="${F + 960}" fill="url(#${id}wall)"/>
<g opacity=".18" stroke="#3ee6ff" stroke-width="2">${Array.from({ length: 14 }, (_, i) => `<line x1="${-500 + i * 160}" y1="-960" x2="${-500 + i * 160}" y2="${F}"/>`).join('')}</g>
<ellipse cx="600" cy="${F - 300}" rx="620" ry="520" fill="url(#${id}spot)"/>
<g transform="translate(560 260)"><rect x="120" y="520" width="320" height="400" rx="14" fill="url(#${id}win)" stroke="#2b3770" stroke-width="18"/>
<circle class="moon" cx="200" cy="620" r="54" fill="url(#${id}moon)"/>${city}
<g fill="#fff">${[[730, 830], [790, 900], [960, 960], [860, 820], [750, 1020]].map(([x, y]) => `<circle class="st" cx="${x}" cy="${y}" r="2.4"/>`).join('')}</g>
<line x1="280" y1="520" x2="280" y2="920" stroke="#2b3770" stroke-width="10"/><line x1="120" y1="720" x2="440" y2="720" stroke="#2b3770" stroke-width="10"/></g>
<polygon points="690,1190 990,1190 1260,${F} 440,${F}" fill="#9bb8ff" opacity=".05"/>
<rect x="60" y="1040" width="300" height="16" rx="4" fill="#1d2550"/>${books(72, 1040, 270, 90, 11, ['#3a2f6b', '#24407a', '#7a3a5a', '#2d5a6a', '#6a5a2d'])}
<rect x="-540" y="${F}" width="2160" height="1500" fill="url(#${id}flr)"/><line x1="-540" y1="${F}" x2="1620" y2="${F}" stroke="#3ee6ff" stroke-width="3" opacity=".35"/>
<g stroke="#141a36" stroke-width="3">${Array.from({ length: 9 }, (_, i) => `<line x1="${-500 + i * 260}" y1="${F + 4}" x2="${-900 + i * 340}" y2="${F + 600}"/>`).join('')}</g>
<ellipse class="lampglow" cx="930" cy="1220" rx="420" ry="360" fill="url(#${id}lamp)"/>
<rect x="560" y="1262" width="470" height="24" rx="6" fill="#2a2f55"/><rect x="560" y="1262" width="470" height="6" rx="3" fill="#ffb36b" opacity=".55"/>
<rect x="590" y="1286" width="18" height="${F - 1286}" fill="#1a1f3d"/><rect x="990" y="1286" width="18" height="${F - 1286}" fill="#1a1f3d"/>
<rect x="830" y="1286" width="170" height="110" rx="6" fill="#20264a"/><rect class="drawer" x="840" y="1300" width="150" height="80" rx="6" fill="#272e5a"/><rect x="895" y="1334" width="40" height="8" rx="4" fill="#ffb36b" opacity=".8"/>
<g transform="translate(960 1262)"><ellipse cx="0" cy="-4" rx="34" ry="8" fill="#151a33"/><line x1="0" y1="-6" x2="-30" y2="-110" stroke="#151a33" stroke-width="9" stroke-linecap="round"/><line x1="-30" y1="-110" x2="-80" y2="-150" stroke="#151a33" stroke-width="9" stroke-linecap="round"/><path d="M-118 -170 L-58 -150 L-78 -110 Z" fill="#ffb36b"/></g>
<rect x="400" y="${F - 100}" width="150" height="18" rx="6" fill="#2a2f55"/><rect x="414" y="${F - 82}" width="14" height="82" fill="#1a1f3d"/><rect x="522" y="${F - 82}" width="14" height="82" fill="#1a1f3d"/>`;
      dyn = (s, t, o) => {
        const lg = s.querySelector('.lampglow'); lg.setAttribute('opacity', (o.lamp == null ? 1 : o.lamp).toFixed(3));
        s.querySelectorAll('.st').forEach((c, i) => c.setAttribute('opacity', (.4 + .4 * Math.sin(t * 2 + i * 2.1)).toFixed(3)));
      };
    } else if (kind === 'library') {
      const day = opt.day ? 1 : 0;
      defs = grad(id + 'wall', day ? [[0, '#2a2140'], [1, '#191530']] : [[0, '#1c1733'], [1, '#100d22']]) + grad(id + 'flr', [[0, '#1c1428'], [1, '#0a0812']]) +
        grad(id + 'arch', [[0, '#ffcf9a'], [1, '#ff9a6a']]) + rgrad(id + 'warm', [[0, '#ffb36b', .35], [1, '#ffb36b', 0]]) +
        grad(id + 'dim', [[0, '#0d0a1c', opt.dim == null ? .8 : opt.dim], [.8, '#0d0a1c', (opt.dim == null ? .8 : opt.dim) * .8], [1, '#0d0a1c', 0]]);   // darker top: captions sit there
      const pal = ['#5b3a6e', '#2f4f7a', '#7a4a3a', '#3a6a5a', '#8a6a3a', '#4a3a7a', '#6a2f45'];
      let shelves = '';
      [[-260, 420], [700, 420]].forEach(([x0, w], si) => {
        shelves += `<rect x="${x0 - 20}" y="300" width="${w + 40}" height="${F - 300}" fill="#1a1226"/>`;
        for (let r = 0; r < 6; r++) { const y = 470 + r * 180; shelves += books(x0, y, w, 140, si * 50 + r * 9, pal) + `<rect x="${x0 - 20}" y="${y}" width="${w + 40}" height="18" fill="#2a1d36"/>`; }
      });
      inner = `<rect x="-540" y="-960" width="2160" height="${F + 960}" fill="url(#${id}wall)"/>
<path d="M330 1180 L330 560 A210 210 0 0 1 750 560 L750 1180 Z" fill="url(#${id}arch)" opacity="${day ? .9 : .35}"/>
<path d="M540 350 L540 1180 M330 820 L750 820" stroke="#1c1733" stroke-width="12"/>
<polygon points="330,1180 750,1180 980,${F} 100,${F}" fill="#ffcf9a" opacity="${day ? .12 : .05}"/>
${shelves}
<ellipse cx="540" cy="${F - 260}" rx="560" ry="420" fill="url(#${id}warm)"/>
<rect x="-540" y="-960" width="2160" height="${(opt.dimTo || 950) + 960}" fill="url(#${id}dim)"/>
<rect x="-540" y="${F}" width="2160" height="1500" fill="url(#${id}flr)"/><line x1="-540" y1="${F}" x2="1620" y2="${F}" stroke="#ffb36b" stroke-width="3" opacity=".35"/>
<g stroke="#241a30" stroke-width="3">${Array.from({ length: 12 }, (_, i) => `<line x1="${-540 + i * 200}" y1="${F + 2}" x2="${-540 + i * 200 - 160}" y2="${F + 700}"/>`).join('')}</g>`;
    } else if (kind === 'rooftop') {
      defs = grad(id + 'sky', [[0, '#070a1e'], [.55, '#1b1846'], [.85, '#4a2a62'], [1, '#7a3a66']]) + rgrad(id + 'moon', [[0, '#fff7e0'], [.7, '#ffe2a8'], [1, '#ffcf8a']]) +
        rgrad(id + 'halo', [[0, '#ffe2a8', .35], [1, '#ffe2a8', 0]]) + grad(id + 'roof', [[0, '#171a33'], [1, '#07080f']]);
      const sky = (base, n, hmin, hmax, col, lit, seed) => Array.from({ length: n }, (_, i) => {
        const w = 70 + hash(seed + i) * 90, x = -540 + i * (2160 / n), h = hmin + hash(seed + i * 1.9) * (hmax - hmin);
        let s = `<rect x="${x}" y="${base - h}" width="${w + 30}" height="${h + 400}" fill="${col}"/>`;
        if (lit) for (let k = 0; k < 6; k++) if (hash(seed + i * 13 + k) > .55) s += `<rect class="win" x="${x + 14 + (k % 3) * 26}" y="${base - h + 24 + Math.floor(k / 3) * 40}" width="12" height="18" fill="#ffd27a"/>`;
        return s;
      }).join('');
      inner = `<rect x="-540" y="-960" width="2160" height="3840" fill="url(#${id}sky)"/>
<g fill="#fff">${Array.from({ length: 40 }, (_, i) => `<circle class="st" cx="${-540 + hash(i * 3.3) * 2160}" cy="${-300 + hash(i * 7.1) * 1100}" r="${1.2 + hash(i) * 1.8}"/>`).join('')}</g>
<circle cx="880" cy="1060" r="260" fill="url(#${id}halo)"/><circle cx="880" cy="1060" r="100" fill="url(#${id}moon)"/>
<g class="far">${sky(1330, 16, 120, 420, '#1a1840', 0, 3)}</g><g class="mid">${sky(1420, 12, 160, 520, '#0f1030', 1, 9)}</g>
<rect x="-540" y="${F}" width="2160" height="1500" fill="url(#${id}roof)"/><rect x="-540" y="${F - 30}" width="2160" height="30" fill="#1d2140"/><line x1="-540" y1="${F - 30}" x2="1620" y2="${F - 30}" stroke="#3ee6ff" stroke-width="3" opacity=".45"/>
<g transform="translate(980 ${F - 30})"><rect x="-90" y="-300" width="180" height="200" rx="16" fill="#151834"/><path d="M-100 -300 L0 -360 L100 -300Z" fill="#151834"/><rect x="-80" y="-100" width="12" height="100" fill="#151834"/><rect x="68" y="-100" width="12" height="100" fill="#151834"/></g>
<g transform="translate(60 ${F - 30})"><line x1="0" y1="0" x2="0" y2="-380" stroke="#151834" stroke-width="8"/><circle class="blink" cx="0" cy="-384" r="9" fill="#ff5a4f"/></g>
<rect x="-200" y="${F - 110}" width="160" height="80" rx="8" fill="#151834"/>`;
      dyn = (s, t) => {
        s.querySelectorAll('.st').forEach((c, i) => c.setAttribute('opacity', (.35 + .4 * Math.sin(t * 1.6 + i * 1.3)).toFixed(3)));
        s.querySelector('.blink').setAttribute('opacity', (Math.sin(t * 5) > 0 ? 1 : .25) + '');
      };
    } else if (kind === 'mountain') {
      defs = grad(id + 'sky', [[0, '#0a0f26'], [.42, '#2b2457'], [.62, '#8a4a72'], [.76, '#ff9a6a'], [1, '#ffcf9a']]) +
        rgrad(id + 'sun', [[0, '#fff2d6'], [.35, '#ffc27a', .8], [1, '#ff8a5c', 0]]) + grad(id + 'm1', [[0, '#5b3f78'], [1, '#3a2a5a']]) +
        grad(id + 'm2', [[0, '#2c2148'], [1, '#1c1633']]) + grad(id + 'pk', [[0, '#1e1a3a'], [.4, '#110f22'], [1, '#08080f']]);
      inner = `<rect x="-540" y="-960" width="2160" height="3840" fill="url(#${id}sky)"/>
<circle class="sun" cx="560" cy="1220" r="420" fill="url(#${id}sun)"/>
<path class="m1" d="M-540 1300 L-200 1060 L80 1180 L360 980 L560 1140 L760 1020 L1000 1170 L1300 990 L1620 1180 V2900 H-540Z" fill="url(#${id}m1)" opacity=".92"/>
<path class="m2" d="M-540 1440 L-100 1280 L260 1380 L520 1250 L780 1370 L1100 1270 L1620 1400 V2900 H-540Z" fill="url(#${id}m2)"/>
<path d="M-540 2900 L-540 ${F + 60} L120 ${F} L960 ${F} L1620 ${F + 80} V2900Z" fill="url(#${id}pk)"/><path d="M120 ${F} L960 ${F}" stroke="#ff9a6a" stroke-width="5" opacity=".85"/>`;
      dyn = (s, t, o) => { s.querySelector('.sun').setAttribute('transform', `translate(0 ${(-120 * (o.rise || 0)).toFixed(1)})`); };
    } else if (kind === 'feed') {
      defs = rgrad(id + 'glow', [[0, '#8a5cff', .5], [1, '#8a5cff', 0]]) + grad(id + 'bg', [[0, '#12062a'], [1, '#06020f']]) +
        grad(id + 'c0', [[0, '#ff5c8a'], [1, '#8a5cff']], 1, 1) + grad(id + 'c1', [[0, '#3ee6ff'], [1, '#5d3bff']], 1, 1) + grad(id + 'c2', [[0, '#ffb36b'], [1, '#ff5c8a']], 1, 1);
      let cards = '';
      for (let i = 0; i < 10; i++) {
        const lane = i % 3, y = i * 420;
        cards += `<g class="card" data-lane="${lane}" data-y="${y}"><rect x="-150" y="-190" width="300" height="380" rx="34" fill="url(#${id}c${i % 3})" opacity=".85"/><rect x="-150" y="-190" width="300" height="380" rx="34" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="4"/><path d="M-26 -40 L36 0 L-26 40 Z" fill="#fff" opacity=".9"/><rect x="-120" y="150" width="${120 + hash(i) * 110}" height="10" rx="5" fill="#fff" opacity=".7"/><path d="M110 -150 c-12 -16 -36 -6 -24 12 l24 22 l24 -22 c12 -18 -12 -28 -24 -12z" fill="#fff" opacity=".8"/></g>`;
      }
      defs += grad(id + 'dim', [[0, '#06020f', .94], [.9, '#06020f', .9], [1, '#06020f', 0]]);
      inner = `<rect x="-540" y="-960" width="2160" height="3840" fill="url(#${id}bg)"/><ellipse cx="540" cy="900" rx="900" ry="900" fill="url(#${id}glow)"/><g class="cards">${cards}</g>
<rect x="-540" y="-960" width="2160" height="${opt.dimTo || 1150 + 960}" fill="url(#${id}dim)"/>`; inner += `
<rect x="-540" y="${F}" width="2160" height="1500" fill="#06020f" opacity=".0"/>`;
      dyn = (s, t, o) => {
        const sc = o.scroll || 0;
        s.querySelectorAll('.card').forEach(g => {
          const lane = +g.dataset.lane, y0 = +g.dataset.y, X = [-120, 540, 1200][lane];
          let y = (((y0 - sc * (lane === 1 ? 1 : .7)) % 4200) + 4200) % 4200 - 700;
          g.setAttribute('transform', `translate(${X} ${y.toFixed(1)})`);
        });
      };
    } else { // void
      defs = rgrad(id + 'g', [[0, opt.glow || '#2a3a7a', .6], [1, opt.glow || '#2a3a7a', 0]]);
      inner = `<rect x="-540" y="-960" width="2160" height="3840" fill="${opt.bg || '#0b1026'}"/><ellipse cx="540" cy="1100" rx="800" ry="800" fill="url(#${id}g)"/>
<rect x="-540" y="${F}" width="2160" height="1500" fill="#060914"/><line x1="-540" y1="${F}" x2="1620" y2="${F}" stroke="#3ee6ff" stroke-width="3" opacity=".35"/>`;
    }
    const { d, s } = envSvg(parent, inner, defs);
    return { el: d, svg: s, kind, floor: F, seek(t, o = {}) { dyn(s, t, o); } };
  }

  // ---------------------------------------------------------------- canvas + world / camera / whip director
  function canvas(parent) {
    const c = el(parent, 'canvas', '', 'position:absolute;left:0;top:0;width:1080px;height:1920px'); c.dataset.name = 'canvas: ninja/props';
    c.width = 1080; c.height = 1920; return c;
  }
  const clear = ctx => { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, 1080, 1920); };
  /* world(stage) — call AFTER creating every env. Creates the ninja/props canvas and a flash layer.
   * w.seek(t, SCENES, {shake:[dx,dy], flash:0..1, flashColor}) where SCENES = [{a, b, env, cam(t)->{x,y,z}, draw(ctx,t), whip}]
   *   whip: 'left' (default) | 'right' | 'up' | 'down' | 'cut' — how the scene ENTERS at its start a (0.32 s, overlapping a ± .16).
   * During a whip both scenes are drawn, slid by a full screen, with drawn speed lines (no blur). */
  function world(st) {
    const can = canvas(st), ctx = can.getContext('2d', SW2D);
    const flash = el(st, 'div', 'abs full', 'opacity:0;background:#3ee6ff'); flash.dataset.bg = 'flash';
    const W = .32;
    function camM(cam, ox, oy) {
      const z = cam.z || 1, r = (cam.r || 0) * D2R;
      const c = Math.cos(r) * z, s = Math.sin(r) * z;
      // screen = T(540+ox, 960+oy) R(r) S(z) T(-x, -y)
      return [c, s, -s, c, 540 + ox - (c * cam.x - s * cam.y), 960 + oy - (s * cam.x + c * cam.y)];
    }
    function seek(t, SC, o = {}) {
      clear(ctx);
      const [sx, sy] = o.shake || [0, 0];
      let cur = SC.findIndex(s => t >= s.a && t < s.b); if (cur < 0) cur = t < SC[0].a ? 0 : SC.length - 1;
      const list = [];
      const next = SC[cur + 1];
      const sc = SC[cur];
      // entering transition of current scene (if within a..a+W/2) or of the next one (within b-W/2..b)
      let pair = null;
      if (next && t >= next.a - W / 2 && next.whip !== 'cut') pair = [sc, next];
      else if (cur > 0 && t < sc.a + W / 2 && sc.whip !== 'cut') pair = [SC[cur - 1], sc];
      if (pair) {
        const [A, B] = pair, k = ioC(seg(t, B.a - W / 2, B.a + W / 2)), dir = B.whip || 'left';
        const v = { left: [-1, 0], right: [1, 0], up: [0, -1], down: [0, 1] }[dir] || [-1, 0];
        list.push([A, v[0] * 1180 * k, v[1] * 2020 * k], [B, -v[0] * 1180 * (1 - k), -v[1] * 2020 * (1 - k)]);
      } else list.push([sc, 0, 0]);
      SC.forEach(s => { if (s.env && !list.some(l => l[0].env === s.env)) { s.env.el.style.opacity = '0'; s.env.el.style.visibility = 'hidden'; } });
      for (const [s, ox, oy] of list) {
        const cam = Object.assign({}, s.cam ? s.cam(t) : { x: 540, y: 960, z: 1 });
        // always-on breathing drift: the camera never sits perfectly still, which also makes Chromium repaint the
        // whole environment every frame (a static layer gets partial re-raster with history-dependent antialiasing)
        cam.x += 2.5 * Math.sin(t * 1.3); cam.y += 2 * Math.cos(t * 1.1);
        const m = camM(cam, ox + sx, oy + sy);
        if (s.env) {
          s.env.el.style.opacity = '1'; s.env.el.style.visibility = 'visible';
          s.env.el.style.transform = `matrix(${m.map(v => +v.toFixed(5)).join(',')})`;
          s.env.seek(t, s.envOpt ? s.envOpt(t) : {});
        }
        ctx.setTransform(m[0], m[1], m[2], m[3], m[4], m[5]);
        ctx.save(); if (s.draw) s.draw(ctx, t, cam); ctx.restore();
      }
      if (pair) {                                                     // drawn speed lines, screen space
        const B = pair[1], k = seg(t, B.a - W / 2, B.a + W / 2), amt = tri(k, 0, 1), dir = B.whip || 'left';
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        const vert = dir === 'up' || dir === 'down';
        for (let i = 0; i < 16; i++) {
          const p = hash(i * 9.7 + Math.floor(t * 30) * .13), q = hash(i * 3.1);
          const len = 300 + 500 * q, pos = vert ? 60 + p * 960 : 700 + p * 1180;
          ctx.globalAlpha = .55 * amt; ctx.strokeStyle = i % 3 ? '#ffffff' : C.cyan; ctx.lineWidth = 4 + 6 * q; ctx.lineCap = 'round';
          ctx.beginPath();
          const off = (hash(i * 5.3) * 1400 - 200) + (vert ? 0 : 0);
          if (vert) { const y0 = 720 + (off + 200) % 1100; ctx.moveTo(pos, y0); ctx.lineTo(pos, Math.min(1920, y0 + len)); }   // below the caption band else { ctx.moveTo(off - 200, pos); ctx.lineTo(off - 200 + len, pos); }
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }
      flash.style.opacity = (o.flash || 0).toFixed(3);
      if (o.flashColor) flash.style.background = o.flashColor;
      return { ctx, cur };
    }
    return { canvas: can, ctx, flash, seek, camM };
  }

  // ---------------------------------------------------------------- the stick ninja rig
  // Ground frame, facing +x, feet at y 0. Lengths at s = 1 (the figure is about 440 px tall).
  const L = { th: 92, sh: 92, torso: 124, shoulder: 108, neck: 20, head: 44, up: 72, fo: 70, hipY: -172 };
  function ik(r, tgt, a, b, pref) {
    let dx = tgt[0] - r[0], dy = tgt[1] - r[1], d = Math.hypot(dx, dy);
    const m = a + b - .5; if (d > m) { dx *= m / d; dy *= m / d; d = m; } if (d < 1e-3) d = 1e-3;
    const c = (a * a + d * d - b * b) / (2 * a * d), ang = Math.acos(clamp(c, -1, 1)), base = Math.atan2(dy, dx);
    const c1 = [r[0] + a * Math.cos(base + ang), r[1] + a * Math.sin(base + ang)], c2 = [r[0] + a * Math.cos(base - ang), r[1] + a * Math.sin(base - ang)];
    return [r, pref(c1, c2) ? c1 : c2, [r[0] + dx, r[1] + dy]];
  }
  const H0 = L.hipY;
  const stand = (o = {}) => Object.assign({ hip: [0, H0], lean: .04, tilt: 0, hr: [22, -150], hl: [-12, -152], fr: [24, 0], fl: [-24, 0], tail: .3, face: 'n' }, o);
  const SL = { hit: .345,                                     // slash: blade points straight forward .345 s after the pose starts
    uAt: deg => .30 + .12 * (1 - Math.cbrt(1 - clamp((deg + 150) / 202))),   // pose-local time when the hand angle is `deg`
    A0: -150, A1: 52 };                                     // slash: impact (blade at mid-arc) .36 s after the pose starts
  const POSE = {
    idle: u => { const b = Math.sin(u * 2.4); return stand({ hip: [0, H0 + 2 * b], hr: [24, -150 + 3 * b], hl: [-14, -152 + 3 * b], lean: .04 + .01 * b }); },
    breathe: u => { const b = .5 - .5 * Math.cos(u * TAU / 3.2); return stand({ hip: [0, H0 - 5 * b], lean: -.04 * b, tilt: -.12 * b, hr: [40 + 26 * b, -160 - 40 * b], hl: [-30 - 26 * b, -160 - 40 * b], face: 'c', tail: .2 }); },
    walk: u => { const f = u / .9 * TAU, s = Math.sin(f), c = Math.cos(f);
      return stand({ hip: [0, H0 - 6 * Math.abs(Math.cos(f))], lean: .08, fr: [s * 48, -Math.max(0, c) * 26], fl: [-s * 48, -Math.max(0, -c) * 26], hr: [-s * 40 + 14, -156 + 6 * Math.abs(s)], hl: [s * 40 - 6, -156], tail: .55 }); },
    run: u => { const f = u / .52 * TAU, s = Math.sin(f), c = Math.cos(f);
      return stand({ hip: [0, H0 + 14 - 14 * Math.abs(c)], lean: .36, fr: [s * 86, -Math.max(0, c) * 70], fl: [-s * 86, -Math.max(0, -c) * 70], hr: [-s * 70 + 30, -230 - 20 * s], hl: [s * 70 - 10, -226 + 20 * s], tail: 1 }); },
    jump: (u, a) => { const ph = a.ph == null ? clamp(u / .5) : a.ph, k = Math.sin(PI * ph);
      return stand({ hip: [0, H0 - 10], lean: .2, fr: [36 + 20 * k, -80 * k], fl: [-20, -70 * k], hr: [40, -300 - 60 * k], hl: [-30, -290 - 50 * k], tail: 1, face: a.face || 'd', spin: a.flip ? -360 * io(ph) : 0 }); },
    crouch: (u, a) => stand({ hip: [-6, -118], lean: .42, fr: [62, 0], fl: [-62, 0], hr: [-34, -316], hl: [70, -176], tail: .6, face: 'd' }),
    slash: (u, a) => {                                          // 0–.08 reach for the hilt, .08–.28 draw + cock (crouch), .30–.42 strike, hold, .9–1.25 recover to 'ready'
      const A0 = -150, A1 = 52;                                 // hand angle about the shoulder, degrees (0 = forward, -90 = up)
      const draw = io(seg(u, .08, .28)), strike = oC(seg(u, .30, .42)), rec = io(seg(u, .9, 1.25)), cr = io(seg(u, 0, .26));
      let ang = lerp(lerp(-118, A0, draw), A1, strike);
      if (rec > 0) ang = lerp(A1, -42, rec);
      const hip = [lerp(-10, 46, strike) - 46 * rec, lerp(lerp(-160, -122, cr), -114, strike) - 36 * rec];
      const lean = lerp(lerp(.1, .34, cr), .55, strike) - .41 * rec;
      const R = 120, shx = hip[0] + Math.sin(lean) * L.shoulder, shy = hip[1] - Math.cos(lean) * L.shoulder;
      const ar = ang * D2R, hand = [shx + R * Math.cos(ar), shy + R * Math.sin(ar)];
      const hilt = [shx - 34, shy - 52];
      const hr = u < .08 ? V([22, -150], hilt, io(seg(u, 0, .08))) : (u < .12 ? V(hilt, hand, seg(u, .08, .12)) : hand);
      const tgt = ar < -PI / 2 ? ar + TAU : ar;                 // blade starts along the scabbard (pointing down-back, ~100 deg)
      const katAng = u < .3 ? lerp(100 * D2R, tgt, io(seg(u, .1, .28))) : ar;
      const arcOp = seg(u, .30, .32) * (1 - seg(u, .43, .56));
      return { hip, lean, tilt: -.1 + .1 * rec, hr, hl: V(V([70, -180], [-40, -200], strike), [40, -210], rec), fr: [lerp(64, 118, strike) - 62 * rec, 0], fl: [-70 + 20 * rec, 0], tail: .9 + .3 * strike,
        face: 'd', kat: u >= .1 ? { ang: katAng } : null,
        arc: arcOp > .01 ? { c: [shx, shy], a0: lerp(A0 + 10, A1, Math.pow(Math.max(0, strike - .45) / .55, 1.4) * .92) * D2R, a1: ang * D2R, r0: R + 120, r1: R + 236, op: arcOp } : null };
    },
    ready: u => { const b = Math.sin(u * 3); return stand({ hip: [0, -150 + 2 * b], lean: .14, fr: [56, 0], fl: [-50, 0], hr: [74, -232 + 3 * b], hl: [40, -210], face: 'd', kat: { ang: -42 * D2R }, tail: .5 }); },
    sheath: u => { const k = io(seg(u, 0, .55)); const ang = lerp(-42, -100, k) * D2R;
      return stand({ hip: [0, H0 + 6 * (1 - k)], lean: .08, hr: V([74, -232], [-26, -324], k), hl: [-12, -152], face: k > .9 ? 'h' : 'd', kat: k < .97 ? { ang: lerp(ang, -116 * D2R, k) } : null, tail: .4 }); },
    point: (u, a) => { const ang = (a.ang == null ? -20 : a.ang) * D2R, b = Math.sin(u * 3); return stand({ hip: [0, H0 + 2 * b], lean: .08, hr: [20 + 140 * Math.cos(ang), -280 + 140 * Math.sin(ang)], hl: [-30, -150], fr: [40, 0], fl: [-30, 0], face: a.face || 'n' }); },
    cheer: u => { const b = Math.abs(Math.sin(u * 6)); return stand({ hip: [0, H0 - 34 * b], lean: 0, hr: [50, -430 + 8 * Math.sin(u * 12)], hl: [-40, -426 - 8 * Math.sin(u * 12)], fr: [36, -30 * b], fl: [-30, -26 * b], tail: 1, face: 'h' }); },
    pump: u => { const k = oBack(seg(u, 0, .25)); return stand({ hip: [0, H0 - 8 * k], lean: -.04, hr: V([60, -230], [36, -420], k), hl: [-20, -150], fr: [34, 0], fl: [-30, 0], face: 'h', tail: .8 }); },
    kick: u => { const p = Math.sin(PI * clamp(u / .5)); return stand({ lean: -.28 * p, hr: [60, -260], hl: [30, -230], fr: [44 + 140 * p, -150 * p], fl: [-44, 0], tail: .8, face: 'd' }); },
    throw: (u, a) => { const k = io(seg(u, .2, .4)); return stand({ lean: lerp(-.15, .3, k), hr: V([-90, -330], [150, -300], k), hl: [-30, -170], fr: [70, 0], fl: [-60, 0], tail: .8, face: 'd' }); },
    sit: (u, a) => { const b = Math.sin(u * 2.2); const dx = a.dx == null ? 120 : a.dx, dy = a.dy == null ? -238 : a.dy;
      return { hip: [0, -104 + b], lean: (a.lean == null ? .12 : a.lean), tilt: a.tilt || 0, hr: [dx, dy], hl: [dx - 18, dy + 2], fr: [88, 0], fl: [70, 0], tail: .25, face: a.face || 'n', kneeUp: 1 }; },
    type: (u, a) => { const b = Math.sin(u * 2.2), dx = a.dx == null ? 124 : a.dx, dy = a.dy == null ? -238 : a.dy;
      return { hip: [0, -104 + b], lean: .2, tilt: .16, hr: [dx, dy - 10 * Math.max(0, Math.sin(u * 17))], hl: [dx - 26, dy - 10 * Math.max(0, Math.sin(u * 17 + 2))], fr: [88, 0], fl: [70, 0], tail: .25, face: a.face || 'f' }; },
    scroll: (u, a) => {                                         // hunched over the phone; a.swipes = [t,...] (pose-local) thumb flicks
      let fl = 0; (a.swipes || []).forEach(s => { fl = Math.max(fl, tri(u, s - .05, s + .18)); });
      const sit = a.sit !== false, b = Math.sin(u * 1.8);
      const hip = sit ? [0, -104] : [0, H0 + 14], lean = sit ? .5 : .32;
      const shx = hip[0] + Math.sin(lean) * L.shoulder, shy = hip[1] - Math.cos(lean) * L.shoulder;
      const ph = [shx + 58, shy + 78 + b * 2];
      return { hip, lean, tilt: .42, hr: [ph[0] + 6, ph[1] - 12 * fl], hl: [ph[0] - 10, ph[1] + 8], fr: sit ? [88, 0] : [30, 0], fl: sit ? [70, 0] : [-22, 0], tail: .15, face: 'g', kneeUp: sit ? 1 : 0, phone: { x: ph[0] + 2, y: ph[1] - 6, r: -20 } };
    },
    slump: u => { const b = Math.sin(u * 1.4); return stand({ hip: [0, H0 + 14], lean: .3 + .02 * b, tilt: .45, hr: [56, -120], hl: [40, -118], fr: [22, 0], fl: [-22, 0], tail: .05, face: 'w' }); },
    stretch: u => { const b = .5 - .5 * Math.cos(u * TAU / 1.6); return stand({ hip: [0, H0 - 10 * b], lean: -.1 * b, tilt: -.25 * b, hr: [26, -430 - 20 * b], hl: [-14, -428 - 20 * b], fr: [20, -12 * b], fl: [-20, -12 * b], face: 'c', tail: .3 }); },
    climb: u => { const f = u / .7 * TAU, s = Math.sin(f); return stand({ hip: [0, H0 + 4 * s], lean: .02, hr: [40, -360 + 56 * s], hl: [34, -360 - 56 * s], fr: [30, -60 * Math.max(0, s)], fl: [24, -60 * Math.max(0, -s)], face: 'd', tail: .5 }); },
    fall: u => { const f = u * 14; return stand({ hip: [0, H0], lean: -.2, hr: [80 * Math.cos(f), -300 + 80 * Math.sin(f)], hl: [-80 * Math.cos(f + 1), -300 + 80 * Math.sin(f + 1)], fr: [60, -40 + 30 * Math.sin(f)], fl: [-50, -20 - 30 * Math.sin(f)], face: 's', tail: 1 }); },
    getup: u => { const k = io(seg(u, 0, .7)); return stand({ hip: [lerp(-10, 0, k), lerp(-82, H0, k)], lean: lerp(.6, .04, k), tilt: lerp(.3, 0, k), hr: V([60, -100], [24, -150], k), hl: V([40, -96], [-12, -152], k), fr: V([60, 0], [24, 0], k), fl: V([-70, -6], [-24, 0], k), face: k > .8 ? 'd' : 'w', kneeBack: k < .6 ? 1 : 0 }); },
    facepalm: u => { const k = io(seg(u, 0, .25)), b = Math.sin(u * 5) * .03; return stand({ lean: .1, tilt: .32 + b, hr: V([24, -150], [66, -312], k), hl: [-34, -176], fr: [30, 0], fl: [-26, 0], face: 'c', tail: .1 }); },
    shrug: u => { const k = io(seg(u, 0, .2)) * (1 - .3 * Math.sin(u * 4) ** 2); return stand({ lean: 0, tilt: -.16 * k, hr: V([22, -150], [80, -250], k), hl: V([-12, -152], [-66, -250], k), face: 'w', tail: .2 }); },
    look: u => { const b = Math.sin(u * 2.4); return stand({ hip: [0, H0 + 2 * b], hr: [24, -150], hl: [-14, -152], face: 'h', front: 1 }); },
    proud: u => { const b = Math.sin(u * 2.4); return stand({ hip: [0, H0 + 2 * b], lean: -.02, hr: [30, -190], hl: [-30, -192], fr: [40, 0], fl: [-36, 0], face: 'h', front: 1, elbowOut: 1, tail: .4 }); },
    wave: u => { const w = Math.sin(u * 9); return stand({ hr: [60 + 28 * w, -390], hl: [-14, -152], face: 'h', front: 1, tail: .4 }); },
    push: u => { const f = u / .7 * TAU, s = Math.sin(f); return stand({ hip: [0, H0 + 20], lean: .5, hr: [150, -300], hl: [140, -280], fr: [40 + s * 30, 0], fl: [-80 - s * 30, -10 * Math.max(0, s)], face: 'd', tail: .6 }); },
    crushed: (u, a) => { const k = a.k == null ? .5 : a.k; return stand({ hip: [0, lerp(-130, -70, k)], lean: .1, hr: [40, lerp(-330, -200, k)], hl: [-20, lerp(-326, -196, k)], fr: [70, 0], fl: [-60, 0], face: 'w', tail: .3, elbowOut: 1 }); },
    flat: u => ({ hip: [-10, -30], lean: 1.48, tilt: -.1, hr: [300, -24], hl: [280, -14], fr: [-180, -14], fl: [-170, -6], face: 'x', tail: .05 }),
    read: (u, a) => { const sit = !!a.sit, b = Math.sin(u * 1.6); const hip = sit ? [0, -104] : [0, H0], lean = sit ? .14 : .06;
      const shx = hip[0] + Math.sin(lean) * L.shoulder, shy = hip[1] - Math.cos(lean) * L.shoulder, bk = [shx + 70, shy + 56 + b];
      return { hip, lean, tilt: .22, hr: [bk[0] + 8, bk[1] + 4], hl: [bk[0] - 18, bk[1] + 10], fr: sit ? [88, 0] : [24, 0], fl: sit ? [70, 0] : [-24, 0], face: a.face || 'f', tail: .2, kneeUp: sit ? 1 : 0, book: { x: bk[0], y: bk[1] - 8 } }; },
    reach: (u, a) => { const k = io(seg(u, 0, .3)); return stand({ lean: lerp(.04, .34, k), hr: V([24, -150], [a.x || 150, a.y || -170], k), hl: [-20, -150], fr: [40, 0], fl: [-40, 0], face: a.face || 'd' }); },
    sitBack: u => { const b = Math.sin(u * 2); return { hip: [0, -104], lean: -.08, tilt: -.1, hr: [30, -150 + b], hl: [10, -150 + b], fr: [96, 0], fl: [80, 0], tail: .2, face: 'h', kneeUp: 1 }; },
  };
  function mixJ(A, B, k) {
    const o = Object.assign({}, k < .5 ? A : B);
    ['lean', 'tilt', 'tail', 'spin'].forEach(n => o[n] = lerp(A[n] || 0, B[n] || 0, k));
    ['hip', 'hl', 'hr', 'fl', 'fr'].forEach(n => o[n] = V(A[n], B[n], k));
    if (A.phone && B.phone) o.phone = { x: lerp(A.phone.x, B.phone.x, k), y: lerp(A.phone.y, B.phone.y, k), r: lerp(A.phone.r, B.phone.r, k) };
    if (A.kat && B.kat) o.kat = { ang: lerp(A.kat.ang, B.kat.ang, k) };
    return o;
  }
  /* timeline(KEYS): KEYS = [[t0, poseName, args?, blendSec?], ...] sorted by t0. Returns f(t) -> joint set J,
   * blending from the previous pose over blendSec (default .18 s, eased). Each pose gets u = t - t0. */
  function timeline(KEYS) {
    return function (t) {
      let i = -1; for (let k = 0; k < KEYS.length; k++) if (t >= KEYS[k][0]) i = k;
      if (i < 0) i = 0;
      const K = KEYS[i], P = POSE[K[1]] || POSE.idle, J = P(Math.max(0, t - K[0]), K[2] || {});
      const bl = K[3] == null ? .18 : K[3];
      if (i > 0 && bl > 0 && t < K[0] + bl) {
        const Kp = KEYS[i - 1], Pp = POSE[Kp[1]] || POSE.idle;
        return mixJ(Pp(t - Kp[0], Kp[2] || {}), J, io(seg(t, K[0], K[0] + bl)));
      }
      return J;
    };
  }
  /* track(KEYS): [[t, x, y, s, arc], ...]. Between keys: eased move; arc > 0 makes a hop/leap of that height.
   * Returns {x, y, s, air (-1 on ground, else 0..1 phase), vx (px/s), land (seconds since the last landing)} */
  function track(KEYS) {
    const at = t => {
      if (t <= KEYS[0][0]) return { x: KEYS[0][1], y: KEYS[0][2], s: KEYS[0][3], air: -1 };
      for (let i = 1; i < KEYS.length; i++) {
        const A = KEYS[i - 1], B = KEYS[i];
        if (t < B[0]) {
          const u = seg(t, A[0], B[0]), arc = B[4] || 0;
          const e = arc > 0 ? lerp(u, io(u), .5) : io(u);
          return { x: lerp(A[1], B[1], e), y: lerp(A[2], B[2], e) - arc * 4 * u * (1 - u), s: lerp(A[3], B[3], e), air: arc > 0 ? u : -1, land: -1 };
        }
      }
      const Z = KEYS[KEYS.length - 1]; return { x: Z[1], y: Z[2], s: Z[3], air: -1 };
    };
    return t => {
      const p = at(t), q = at(t - 1 / 30);
      p.vx = (p.x - q.x) * 30;
      let land = 99; for (let i = 1; i < KEYS.length; i++) if ((KEYS[i][4] || 0) > 0 && t >= KEYS[i][0]) land = t - KEYS[i][0];
      p.land = land;
      return p;
    };
  }

  /* ninja.pose(t, o) -> n   o: x, y (feet, world px), s, J (from timeline(t)) or pose + p + args,
   *   fx (+1 faces right, -1 left), face, look:[ex,ey], katana 'back'|'none', sq (squash +, stretch -), r (deg lean about feet),
   *   spin (deg about the body centre), vx (px/s, for headband tails), shadow (0..1), glow (phone-glow on the face 0..1) */
  function pose(t, o = {}) {
    const J = o.J || (POSE[o.pose || 'idle'] || POSE.idle)(o.p == null ? t : o.p, o.args || {});
    const n = Object.assign({ t, x: 540, y: FLOOR, s: 1, fx: 1, katana: 'back', sq: 0, r: 0, shadow: 1 }, o, { J });
    if (o.face) n.faceO = o.face;
    if (o.land != null && o.land < .25) n.sq = Math.max(n.sq, .35 * Math.sin(PI * o.land / .25));   // landing squash
    if (o.air != null && o.air >= 0) n.sq = -.12 * Math.sin(PI * o.air);
    return n;
  }
  function skel(n) {           // joint positions in the ninja's local frame (facing right, feet at 0)
    const J = n.J, hip = J.hip, Lh = J.lean;
    const du = [Math.sin(Lh), -Math.cos(Lh)];
    const sh = [hip[0] + du[0] * L.shoulder, hip[1] + du[1] * L.shoulder], neck = [hip[0] + du[0] * L.torso, hip[1] + du[1] * L.torso];
    const ht = Lh + (J.tilt || 0), dh = [Math.sin(ht), -Math.cos(ht)];
    const hc = [neck[0] + dh[0] * (L.neck + L.head * .8), neck[1] + dh[1] * (L.neck + L.head * .8)];
    const kf = J.kneeBack ? (a, b) => a[0] < b[0] : (a, b) => a[0] > b[0];
    const ef = J.elbowOut ? (a, b) => (a[0] - sh[0]) * Math.sign(J.hr[0] - sh[0] || 1) > (b[0] - sh[0]) * Math.sign(J.hr[0] - sh[0] || 1) : (a, b) => a[1] > b[1];
    const efB = J.elbowOut ? (a, b) => a[0] < b[0] : (a, b) => a[1] > b[1];
    return { hip, sh, neck, hc, du, ht,
      legF: ik([hip[0] + 4, hip[1]], J.fr, L.th, L.sh, kf), legB: ik([hip[0] - 4, hip[1]], J.fl, L.th, L.sh, kf),
      armF: ik([sh[0] + 3, sh[1]], J.hr, L.up, L.fo, ef), armB: ik([sh[0] - 3, sh[1]], J.hl, L.up, L.fo, efB) };
  }
  // world position of a local point
  function toWorld(n, p) {
    const sq = n.sq || 0, sx = (1 + sq * .45) * n.s * n.fx, sy = (1 - sq * .45) * n.s;
    const r = (n.r || 0) * D2R;
    let x = p[0] * sx, y = p[1] * sy;
    const c = Math.cos(r), s = Math.sin(r); [x, y] = [x * c - y * s, x * s + y * c];
    return [n.x + x, n.y + y];
  }
  /* n.reach(): blade sweep circle of a slash in world coords {cx, cy, R} (to place / align a wordcut) */
  function reach(n) {
    const S = skel(n), J = n.J; const c = J.arc ? J.arc.c : S.sh;
    const w = toWorld(n, c); return { cx: w[0], cy: w[1], R: (J.arc ? (J.arc.r0 + J.arc.r1) / 2 : 230) * n.s };
  }
  function line(ctx, pts, w, col) { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.lineWidth = w; ctx.strokeStyle = col; ctx.stroke(); }
  function drawNinja(ctx, n) {
    const J = n.J, S = skel(n), t = n.t;
    const sq = n.sq || 0, sx = (1 + sq * .45) * n.s, sy = (1 - sq * .45) * n.s;
    // shadow
    if (n.shadow > 0) {
      const lift = Math.max(0, (n.ground == null ? 0 : n.ground - n.y));
      ctx.save(); ctx.globalAlpha = .4 * n.shadow * clamp(1 - lift / 400); ctx.fillStyle = '#000';
      ctx.beginPath(); ctx.ellipse(n.x, (n.ground == null ? n.y : n.ground) + 4, 92 * n.s * (1 - clamp(lift / 600) * .5), 16 * n.s, 0, 0, TAU); ctx.fill(); ctx.restore();
    }
    ctx.save();
    ctx.translate(n.x, n.y); ctx.rotate((n.r || 0) * D2R); ctx.scale(sx * n.fx, sy);
    const spin = (n.spin || 0) + (J.spin || 0);
    if (spin) { const c = [S.hip[0], S.hip[1] - 60]; ctx.translate(c[0], c[1]); ctx.rotate(spin * D2R); ctx.translate(-c[0], -c[1]); }
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const tails = tailPts(n, S);
    const pass = rim => {
      const BK = rim ? C.cyan : C.ink, BK2 = rim ? C.cyan : '#1b2132', CY = rim ? C.cyan : C.cyan;
      if (rim) { ctx.save(); ctx.translate(-3.5 * n.fx, -2.5); }
      // headband tails (behind)
      tails.forEach(tp => { drawTail(ctx, tp, rim ? C.cyan : '#2bc8e0', rim ? 12 : 11); });
      // katana scabbard on the back
      const bk = [-Math.cos(J.lean), -Math.sin(J.lean)];
      const sb0 = [S.hip[0] + S.du[0] * 6 + bk[0] * 26, S.hip[1] + S.du[1] * 6 + bk[1] * 26];
      const sb1 = [S.hip[0] + S.du[0] * 128 + bk[0] * 2, S.hip[1] + S.du[1] * 128 + bk[1] * 2];
      line(ctx, [sb0, sb1], 13, rim ? C.cyan : '#232c4a');
      if (n.katana !== 'none' && !J.kat) {
        const dv = [(sb1[0] - sb0[0]) / 122, (sb1[1] - sb0[1]) / 122];
        const h0 = sb1, h1 = [sb1[0] + dv[0] * 54, sb1[1] + dv[1] * 54];
        line(ctx, [h0, h1], 12, rim ? C.cyan : '#8a2335');
        if (!rim) { line(ctx, [[h0[0] - dv[1] * 14, h0[1] + dv[0] * 14], [h0[0] + dv[1] * 14, h0[1] - dv[0] * 14]], 7, '#ffd36b'); }
      }
      // back limbs
      line(ctx, S.legB, 20, BK2); line(ctx, S.armB, 18, BK2);
      // torso
      line(ctx, [[S.hip[0], S.hip[1] + 4], S.neck], 24, BK);
      // belt
      const bn = [Math.cos(J.lean), Math.sin(J.lean)];
      line(ctx, [[S.hip[0] - bn[0] * 15 + S.du[0] * 10, S.hip[1] - bn[1] * 15 + S.du[1] * 10], [S.hip[0] + bn[0] * 15 + S.du[0] * 10, S.hip[1] + bn[1] * 15 + S.du[1] * 10]], 9, CY);
      // front leg
      line(ctx, S.legF, 21, BK);
      // head
      ctx.fillStyle = BK; ctx.beginPath(); ctx.arc(S.hc[0], S.hc[1], L.head, 0, TAU); ctx.fill();
      if (!rim) drawFace(ctx, n, S);
      // front arm
      line(ctx, S.armF, 19, BK);
      // fists
      ctx.fillStyle = BK; [S.armF[2], S.armB[2]].forEach(p => { ctx.beginPath(); ctx.arc(p[0], p[1], 12, 0, TAU); ctx.fill(); });
      if (rim) ctx.restore();
    };
    // smear arc behind the figure
    if (J.arc) drawSmear(ctx, J.arc);
    pass(true); pass(false);
    if (J.kat) drawBlade(ctx, S.armF[2], J.kat.ang);
    if (J.phone && n.props !== false) drawPhoneProp(ctx, J.phone, n);
    if (J.book && n.props !== false) drawBookProp(ctx, J.book, n);
    ctx.restore();
  }
  function tailPts(n, S) {
    const J = n.J, t = n.t, en = clamp(J.tail == null ? .3 : J.tail), vx = (n.vx || 0) * n.fx;
    const spd = clamp(Math.abs(vx) / 900) + en * .6;
    const ht = S.ht, knot = [S.hc[0] - Math.cos(ht) * 40 - Math.sin(ht) * 0, S.hc[1] - Math.sin(ht) * 40 - 14];
    const out = [];
    for (let k = 0; k < 2; k++) {
      const pts = [knot];
      let ang = lerp(PI * .58, PI * .98, clamp(spd)) + k * .22;                 // hang down-back (idle) -> stream straight back (fast)
      let p = knot;
      for (let i = 1; i <= 6; i++) {
        const w = Math.sin(t * (8 + 6 * spd) - i * .85 + k * 1.3) * (.12 + .28 * spd) * i / 6;
        const a2 = ang + w; const len = 18 + 4 * spd;
        p = [p[0] + Math.cos(a2) * len * (k ? .9 : 1), p[1] + Math.sin(a2) * len * .9 * (k ? .9 : 1) ];
        pts.push(p);
      }
      out.push(pts);                                              // angles near PI point back (-x), PI/2 hangs down
    }
    return out;
  }
  function drawTail(ctx, pts, col, w0) {
    ctx.fillStyle = col; ctx.beginPath();
    const N = pts.length, L1 = [], R1 = [];
    for (let i = 0; i < N; i++) {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(N - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1;
      const w = w0 * (1 - i / N * .75) / 2; L1.push([pts[i][0] - dy / d * w, pts[i][1] + dx / d * w]); R1.push([pts[i][0] + dy / d * w, pts[i][1] - dx / d * w]);
    }
    ctx.moveTo(L1[0][0], L1[0][1]); L1.forEach(p => ctx.lineTo(p[0], p[1])); R1.reverse().forEach(p => ctx.lineTo(p[0], p[1])); ctx.closePath(); ctx.fill();
  }
  function drawFace(ctx, n, S) {
    const J = n.J, face = n.faceO || J.face || 'n', front = n.front != null ? n.front : J.front;
    const blinkOn = face !== 'c' && face !== 'h' && face !== 'x' && (n.t % 3.7) > 3.58;
    const f = blinkOn ? 'blink' : face;
    const [lx, ly] = n.look || [0, 0];
    ctx.save(); ctx.translate(S.hc[0], S.hc[1]); ctx.rotate(S.ht);
    ctx.beginPath(); ctx.arc(0, 0, L.head - .5, 0, TAU); ctx.clip();
    // headband
    ctx.fillStyle = C.cyan; ctx.fillRect(-60, -30, 120, 14);
    ctx.fillStyle = '#1aa7c0'; ctx.fillRect(-60, -18, 120, 3);
    // slit
    const cx = front ? 0 : 20, w = front ? 70 : 56, hgt = f === 's' ? 30 : 24;
    ctx.fillStyle = C.skin; ctx.beginPath(); ctx.roundRect(cx - w / 2, -9, w, hgt, 10); ctx.fill();
    const E = front ? [-15, 15] : [10, 30], ey = 3 + (f === 's' ? 3 : 0);
    ctx.fillStyle = C.ink; ctx.strokeStyle = C.ink; ctx.lineCap = 'round';
    const pupil = (x, r) => { ctx.beginPath(); ctx.arc(x + lx * .6, ey + ly * .5, r, 0, TAU); ctx.fill(); };
    if (f === 'h') { ctx.lineWidth = 4; E.forEach(x => { ctx.beginPath(); ctx.arc(x, ey + 5, 6, PI * 1.1, PI * 1.9); ctx.stroke(); }); }
    else if (f === 'c' || f === 'blink') { ctx.lineWidth = 4; E.forEach(x => { ctx.beginPath(); ctx.moveTo(x - 6, ey + 1); ctx.lineTo(x + 6, ey + 1); ctx.stroke(); }); }
    else if (f === 'x') { ctx.lineWidth = 4; E.forEach(x => { ctx.beginPath(); ctx.moveTo(x - 5, ey - 5); ctx.lineTo(x + 5, ey + 5); ctx.moveTo(x + 5, ey - 5); ctx.lineTo(x - 5, ey + 5); ctx.stroke(); }); }
    else if (f === 's') { E.forEach(x => { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, ey, 8, 0, TAU); ctx.fill(); ctx.fillStyle = C.ink; pupil(x, 3.5); }); }
    else if (f === 'g') {                                         // glazed: heavy lids, screen glow in the eyes
      E.forEach(x => { ctx.fillStyle = '#e8fbff'; ctx.beginPath(); ctx.arc(x, ey, 7, 0, TAU); ctx.fill(); ctx.fillStyle = '#0a6a80'; ctx.fillRect(x - 3 + lx * .4, ey - 2, 6, 7); });
      ctx.fillStyle = C.skin; ctx.fillRect(cx - w / 2, -9, w, 10); ctx.fillStyle = C.ink; ctx.fillRect(cx - w / 2, 0, w, 2.5);
    } else { E.forEach(x => pupil(x, 5)); ctx.fillStyle = '#fff'; E.forEach(x => { ctx.beginPath(); ctx.arc(x + lx * .6 + 2, ey + ly * .5 - 2, 1.6, 0, TAU); ctx.fill(); }); }
    // brows (the mask's edge)
    ctx.fillStyle = C.ink;
    const brow = (x, a, dy) => { ctx.save(); ctx.translate(x, -9 + dy); ctx.rotate(a); ctx.fillRect(-11, -6, 22, 7); ctx.restore(); };
    // E[0] is the left eye, E[1] the right one: inner ends are between them
    if (f === 'd' || f === 'f') E.forEach((x, i) => brow(x, (i ? -1 : 1) * (f === 'd' ? .42 : .18), 3));      // inner ends down: determined
    else if (f === 'w' || f === 'g') E.forEach((x, i) => brow(x, (i ? 1 : -1) * (f === 'w' ? .35 : .12), 1)); // inner ends up: worried
    else if (f === 's') E.forEach(x => brow(x, 0, -4));
    if (f === 'h') { ctx.fillStyle = '#ff8f8f'; ctx.globalAlpha = .5; ctx.beginPath(); ctx.arc(front ? 0 : 24, 14, 5, 0, TAU); ctx.fill(); ctx.globalAlpha = 1; }
    ctx.restore();
  }
  function drawSmear(ctx, a) {
    const N = 26, pts = [];
    const crescent = (r0, r1, expo) => {
      const P = []; const Q = [];
      for (let i = 0; i <= N; i++) { const k = i / N, an = lerp(a.a0, a.a1, k), w = Math.pow(k, expo); P.push([a.c[0] + r1 * Math.cos(an), a.c[1] + r1 * Math.sin(an)]); Q.push([a.c[0] + lerp(r1, r0, w) * Math.cos(an), a.c[1] + lerp(r1, r0, w) * Math.sin(an)]); }
      ctx.beginPath(); ctx.moveTo(P[0][0], P[0][1]); P.forEach(p => ctx.lineTo(p[0], p[1])); Q.reverse().forEach(p => ctx.lineTo(p[0], p[1])); ctx.closePath(); ctx.fill();
    };
    ctx.save(); ctx.globalAlpha = a.op;
    ctx.fillStyle = C.cyan; crescent(a.r0 - 14, a.r1 + 14, .7);
    ctx.fillStyle = '#ffffff'; crescent(a.r0 + 14, a.r1, 1.1);
    ctx.restore(); void pts;
  }
  function drawBlade(ctx, h, ang) {
    const dx = Math.cos(ang), dy = Math.sin(ang);
    line(ctx, [[h[0] - dx * 26, h[1] - dy * 26], [h[0] + dx * 24, h[1] + dy * 24]], 12, '#8a2335');
    line(ctx, [[h[0] + dx * 24 - dy * 15, h[1] + dy * 24 + dx * 15], [h[0] + dx * 24 + dy * 15, h[1] + dy * 24 - dx * 15]], 8, '#ffd36b');
    ctx.lineCap = 'round';
    line(ctx, [[h[0] + dx * 28, h[1] + dy * 28], [h[0] + dx * 226, h[1] + dy * 226]], 10, '#e9f1ff');
    line(ctx, [[h[0] + dx * 40 + dy * 3, h[1] + dy * 40 - dx * 3], [h[0] + dx * 222 + dy * 3, h[1] + dy * 222 - dx * 3]], 3, C.cyan);
  }
  // ---------------------------------------------------------------- props (local, drawn in the ninja frame or world)
  function phoneShape(ctx, w, h, glowCol) {
    ctx.fillStyle = '#10142a'; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, w * .2); ctx.fill();
    ctx.strokeStyle = C.cyan; ctx.lineWidth = 3; ctx.stroke();
    const g = ctx.createLinearGradient(0, -h / 2, 0, h / 2); g.addColorStop(0, glowCol || '#8a5cff'); g.addColorStop(1, '#ff5c8a');
    ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(-w / 2 + 5, -h / 2 + 6, w - 10, h - 12, w * .14); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.globalAlpha = .9; ctx.beginPath(); ctx.moveTo(-6, -8); ctx.lineTo(9, 0); ctx.lineTo(-6, 8); ctx.fill(); ctx.globalAlpha = 1;
  }
  function drawPhoneProp(ctx, p, n) {
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate((p.r || 0) * D2R);
    // glow cone toward the face
    ctx.globalAlpha = .22 * (n.glow == null ? 1 : n.glow); ctx.fillStyle = C.cyan; ctx.beginPath(); ctx.moveTo(-10, -30); ctx.lineTo(-110, -150); ctx.lineTo(10, -170); ctx.lineTo(20, -30); ctx.fill(); ctx.globalAlpha = 1;
    phoneShape(ctx, 40, 72); ctx.restore();
  }
  function phone(ctx, x, y, s = 1, r = 0, o = {}) {           // world phone (on a desk, flying, in a drawer)
    ctx.save(); ctx.translate(x, y); ctx.rotate(r * D2R); ctx.scale(s, s);
    if (o.glow) { const g = ctx.createRadialGradient(0, 0, 10, 0, 0, 160); g.addColorStop(0, 'rgba(138,92,255,.45)'); g.addColorStop(1, 'rgba(138,92,255,0)'); ctx.fillStyle = g; ctx.globalAlpha = o.glow; ctx.beginPath(); ctx.arc(0, 0, 160, 0, TAU); ctx.fill(); ctx.globalAlpha = 1; }
    phoneShape(ctx, 56, 100, o.col); ctx.restore();
  }
  function drawBookProp(ctx, b, n) { book(ctx, b.x, b.y, .9, -8, { open: 1, t: n.t, flip: n.flip }); }
  /* book(ctx, x, y, s, rot, {open 0..1, flip: page-flip phase 0..1, col}) */
  function book(ctx, x, y, s = 1, r = 0, o = {}) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(r * D2R); ctx.scale(s, s);
    const col = o.col || '#ff7a59';
    if ((o.open || 0) > .5) {
      ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(-58, -40, 116, 76, 8); ctx.fill();
      ctx.fillStyle = '#fff6e6'; ctx.beginPath(); ctx.moveTo(0, -30); ctx.quadraticCurveTo(-28, -40, -52, -34); ctx.lineTo(-52, 28); ctx.quadraticCurveTo(-28, 22, 0, 30); ctx.quadraticCurveTo(28, 22, 52, 28); ctx.lineTo(52, -34); ctx.quadraticCurveTo(28, -40, 0, -30); ctx.fill();
      ctx.strokeStyle = '#c9b9a0'; ctx.lineWidth = 2; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-44, -20 + i * 12); ctx.lineTo(-8, -18 + i * 12); ctx.moveTo(8, -18 + i * 12); ctx.lineTo(44, -20 + i * 12); ctx.stroke(); }
      if (o.flip != null && o.flip > 0 && o.flip < 1) { const k = o.flip; ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.moveTo(0, -30); const xx = lerp(50, -50, k); ctx.quadraticCurveTo(xx * .5, -46 + 10 * Math.abs(k - .5), xx, -34 + 8 * Math.sin(PI * k)); ctx.lineTo(xx, 28); ctx.quadraticCurveTo(xx * .5, 24, 0, 30); ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#d8ccb8'; ctx.stroke(); }
      line(ctx, [[0, -30], [0, 30]], 2, '#b8a890');
    } else {
      ctx.fillStyle = '#fff6e6'; ctx.fillRect(-50, -12, 100, 26);
      ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(-54, -18, 108, 10, 3); ctx.fill(); ctx.beginPath(); ctx.roundRect(-54, 12, 108, 10, 3); ctx.fill();
      ctx.fillRect(-56, -18, 8, 40);
    }
    ctx.restore();
  }
  function laptop(ctx, x, y, s = 1, o = {}) {                   // on a desk; screen shows a calm code/doc layout (no text)
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = '#2a3150'; ctx.beginPath(); ctx.roundRect(-110, -150, 220, 140, 10); ctx.fill();
    ctx.fillStyle = o.on ? '#16224a' : '#0d1124'; ctx.beginPath(); ctx.roundRect(-100, -140, 200, 120, 6); ctx.fill();
    if (o.on) { const lines = o.lines == null ? 6 : o.lines; for (let i = 0; i < Math.min(7, lines); i++) { const w = 40 + hash(i * 3.7) * 110 * clamp(lines - i); ctx.fillStyle = i % 3 === 0 ? C.cyan : (i % 3 === 1 ? '#9fb2ff' : C.orange); ctx.globalAlpha = .85; ctx.fillRect(-86 + (i % 2) * 14, -128 + i * 15, w, 7); } ctx.globalAlpha = 1; }
    ctx.fillStyle = '#3a4266'; ctx.beginPath(); ctx.moveTo(-130, -10); ctx.lineTo(130, -10); ctx.lineTo(140, 0); ctx.lineTo(-140, 0); ctx.fill();
    ctx.restore();
  }
  function check(ctx, x, y, s, k) {                            // check mark that draws on (k 0..1)
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = C.green; ctx.globalAlpha = clamp(k * 3); ctx.beginPath(); ctx.arc(0, 0, 60 * oBack(clamp(k * 2)), 0, TAU); ctx.fill(); ctx.globalAlpha = 1;
    const P = [[-28, 2], [-8, 24], [32, -22]], kk = clamp(k * 1.6 - .4);
    ctx.strokeStyle = '#0b1026'; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(P[0][0], P[0][1]);
    if (kk < .4) ctx.lineTo(lerp(P[0][0], P[1][0], kk / .4), lerp(P[0][1], P[1][1], kk / .4)); else { ctx.lineTo(P[1][0], P[1][1]); ctx.lineTo(lerp(P[1][0], P[2][0], (kk - .4) / .6), lerp(P[1][1], P[2][1], (kk - .4) / .6)); }
    ctx.stroke(); ctx.restore();
  }
  /* sparks(ctx, t, t0, x, y, {n, seed, speed, spread (rad), dir (rad), g, life, cols}) — drawn line sparks, pure in t */
  function sparks(ctx, t, t0, x, y, o = {}) {
    const tau = t - t0, life = o.life || .45; if (tau < 0 || tau > life) return;
    const N = o.n || 12, g = o.g == null ? 1800 : o.g, cols = o.cols || ['#ffffff', C.cyan, C.orange];
    ctx.save(); ctx.lineCap = 'round';
    for (let i = 0; i < N; i++) {
      const h1 = hash((o.seed || 1) * 31 + i * 7.7), h2 = hash((o.seed || 1) * 17 + i * 3.3);
      const a = (o.dir || 0) + (h1 - .5) * (o.spread == null ? TAU : o.spread), sp = (o.speed || 900) * (.45 + .8 * h2);
      const vx = Math.cos(a) * sp, vy = Math.sin(a) * sp;
      const px = x + vx * tau, py = y + vy * tau + .5 * g * tau * tau;
      const qx = px - vx * .035, qy = py - (vy + g * tau) * .035;
      ctx.globalAlpha = 1 - tau / life; ctx.strokeStyle = cols[i % cols.length]; ctx.lineWidth = 3 + 4 * h2 * (1 - tau / life);
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(qx, qy); ctx.stroke();
    }
    ctx.restore();
  }

  /* hearts(ctx, t, t0, x, y, {n, seed, s}) — little like-hearts that pop out of a phone and float up (drawn shapes) */
  function hearts(ctx, t, t0, x, y, o = {}) {
    const tau = t - t0; if (tau < 0 || tau > .9) return;
    for (let i = 0; i < (o.n || 3); i++) {
      const h1 = hash((o.seed || 1) * 13 + i * 4.1), k = tau / .9, sc = (o.s || 1) * (.7 + .5 * h1) * oBack(clamp(tau / .2));
      const px = x + (h1 - .5) * 120 * k + 14 * Math.sin(tau * 9 + i), py = y - 260 * oC(k) - i * 26;
      ctx.save(); ctx.globalAlpha = 1 - iC(k); ctx.translate(px, py); ctx.scale(sc, sc);
      ctx.fillStyle = i % 2 ? C.pink : '#ff8fb1'; ctx.beginPath(); ctx.moveTo(0, 10); ctx.bezierCurveTo(-26, -8, -14, -30, 0, -16); ctx.bezierCurveTo(14, -30, 26, -8, 0, 10); ctx.fill();
      ctx.restore();
    }
  }

  // ---------------------------------------------------------------- THE WORD CUT
  /* wordcut({text, x, y, size, color, side, depth, angle, off, font, seed})
   *   a solid, extruded word in WORLD coords (centre x,y). The cut is a straight line through the word's centre
   *   (shifted `off` px along its normal) at `angle` degrees (screen convention: + = clockwise, i.e. descending to the right).
   * wc.draw(ctx, t, {in, cut, out, mode:'drop'|'fly'|'pop', from:[dx,dy], floor, wob, pull:[dx,dy], hot})
   *   in   : arrival time (drop = falls from above with gravity and lands with squash; fly = slides in from `from`; pop = scales up)
   *   cut  : impact time (blade crosses). Frames [cut, cut+2f): hot frame (word flashes white, cut line glints).
   *          [cut+2f, cut+.2): halves hold the cut with a sliver gap and slide along the line (the "clean cut" beat).
   *          then both halves fall under gravity with rotation; the far half is knocked along the slash direction.
   *   floor: optional world y; halves stop there, bounce once and settle (else they fall out of frame).
   * wc.shake(t) -> [dx, dy] (8 px decaying jitter on impact, for world.seek({shake}))
   * wc.flash(t) -> 0..1 (the 2-frame accent flash) */
  function wordcut(o) {
    const W = Object.assign({ x: 540, y: 1000, size: 200, color: C.pink, side: '#6a1736', depth: 16, angle: 24, off: 0, font: 'BS', seed: 1, outline: '#0b0b18' }, o);
    const off = document.createElement('canvas'); const octx = off.getContext('2d', SW2D);
    let M = null;
    const measure = () => {
      if (M) return M;
      const c = document.createElement('canvas').getContext('2d'); c.font = `800 ${W.size}px ${W.font}`;
      const m = c.measureText(W.text);
      M = { w: m.width, asc: m.actualBoundingBoxAscent, desc: m.actualBoundingBoxDescent };
      M.h = M.asc + M.desc; return M;
    };
    const F = 1 / 30;
    const th = W.angle * D2R, u = [Math.cos(th), Math.sin(th)], nrm = [-Math.sin(th), Math.cos(th)];
    function render(scale, hot, glint) {           // word into the offscreen canvas, local centre at its middle
      const m = measure(), pad = W.depth + 30;
      const cw = Math.ceil((m.w + pad * 2) * scale), ch = Math.ceil((m.h + pad * 2) * scale);
      if (off.width !== cw || off.height !== ch) { off.width = cw; off.height = ch; }
      octx.setTransform(1, 0, 0, 1, 0, 0); octx.clearRect(0, 0, cw, ch);
      octx.setTransform(scale, 0, 0, scale, cw / 2, ch / 2);
      octx.font = `800 ${W.size}px ${W.font}`; octx.textAlign = 'center'; octx.textBaseline = 'alphabetic';
      const by = (m.asc - m.desc) / 2;                          // baseline so the glyph box is centred on 0
      octx.lineJoin = 'round';
      // extrusion
      for (let k = W.depth; k >= 1; k--) { octx.fillStyle = k === W.depth ? W.outline : W.side; octx.fillText(W.text, k * .35, by + k); }
      octx.lineWidth = 10; octx.strokeStyle = W.outline; octx.strokeText(W.text, 0, by);
      const g = octx.createLinearGradient(0, -m.asc / 2 - 10, 0, m.h / 2);
      if (hot) { g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#d9fbff'); }
      else { g.addColorStop(0, W.top || '#ffffff'); g.addColorStop(.18, W.color); g.addColorStop(1, W.color2 || W.color); }
      octx.fillStyle = g; octx.fillText(W.text, 0, by);
      // top bevel highlight
      octx.save(); octx.globalCompositeOperation = 'source-atop'; octx.fillStyle = 'rgba(255,255,255,.18)'; octx.fillRect(-m.w, -m.h, m.w * 2, m.h * .42); octx.restore();
      if (glint > 0) {                                          // freshly cut face: a bright line along the cut, only on the glyphs
        octx.save(); octx.globalCompositeOperation = 'source-atop'; octx.globalAlpha = glint;
        const L0 = m.w + m.h, p0 = [nrm[0] * W.off, nrm[1] * W.off];
        octx.strokeStyle = '#ffffff'; octx.lineWidth = 10; octx.beginPath(); octx.moveTo(p0[0] - u[0] * L0, p0[1] - u[1] * L0); octx.lineTo(p0[0] + u[0] * L0, p0[1] + u[1] * L0); octx.stroke();
        octx.strokeStyle = C.cyan; octx.lineWidth = 22; octx.globalAlpha = glint * .45; octx.stroke();
        octx.restore();
      }
      return { cw, ch };
    }
    function halfClip(ctx, side) {                               // half-plane polygon in word-local coords (side +1 / -1 of the line)
      const m = measure(), R = (m.w + m.h) * 2, p0 = [nrm[0] * W.off, nrm[1] * W.off];
      ctx.beginPath();
      ctx.moveTo(p0[0] - u[0] * R, p0[1] - u[1] * R); ctx.lineTo(p0[0] + u[0] * R, p0[1] + u[1] * R);
      ctx.lineTo(p0[0] + u[0] * R + nrm[0] * R * side, p0[1] + u[1] * R + nrm[1] * R * side); ctx.lineTo(p0[0] - u[0] * R + nrm[0] * R * side, p0[1] - u[1] * R + nrm[1] * R * side);
      ctx.closePath(); ctx.clip();
    }
    function arrive(t, s) {                                      // whole-word position before the cut
      const m = measure();
      let x = W.x, y = W.y, rot = 0, sc = 1, sqx = 1, sqy = 1, op = 1;
      const a = s.in == null ? -1 : s.in;
      if (t < a) return null;
      const tau = t - a;
      if (s.mode === 'drop') {
        const h = s.h || 900, tf = Math.sqrt(2 * h / 4200);
        if (tau < tf) { y = W.y - h + .5 * 4200 * tau * tau; sqy = 1.08; sqx = .94; }
        else { const k = tau - tf; const b = Math.exp(-k * 9) * Math.sin(k * 30); sqy = 1 - .22 * Math.exp(-k * 10) * Math.cos(k * 26); sqx = 2 - sqy; y = W.y - Math.max(0, b) * 30; }
        y += (1 - sqy) * m.h / 2;
      } else if (s.mode === 'fly') {
        const k = oBack(seg(tau, 0, .45), 1.4), fr = s.from || [700, -200];
        x = W.x + fr[0] * (1 - k); y = W.y + fr[1] * (1 - k); rot = (s.rot0 == null ? 25 : s.rot0) * (1 - k);
      } else {
        sc = oBack(seg(tau, 0, .35), 2.2); op = clamp(tau / .1);
      }
      const wob = s.wob == null ? 1 : s.wob;
      rot += wob * 2.2 * Math.sin(t * 3.1 + W.seed); y += wob * 7 * Math.sin(t * 2.3 + W.seed);
      if (s.pull) { x += s.pull[0]; y += s.pull[1]; }
      return { x, y, rot, sc, sqx, sqy, op };
    }
    function draw(ctx, t, s = {}) {
      const tc = s.cut == null ? 1e9 : s.cut;
      if (s.out != null && t >= s.out + .3) return;
      const outOp = s.out != null ? 1 - seg(t, s.out, s.out + .3) : 1;
      const m = measure();
      const tr = ctx.getTransform(), zoom = Math.hypot(tr.a, tr.b) || 1;
      if (t < tc) {
        const A = arrive(t, s); if (!A || A.sc < .02 || A.op <= 0) return;
        const { cw, ch } = render(zoom * A.sc * Math.max(A.sqx, A.sqy), false, 0);
        ctx.save(); ctx.globalAlpha = A.op * outOp; ctx.translate(A.x, A.y); ctx.rotate(A.rot * D2R); ctx.scale(A.sqx * A.sc, A.sqy * A.sc);
        const k = 1 / (zoom * A.sc * Math.max(A.sqx, A.sqy)); ctx.drawImage(off, -cw / 2 * k, -ch / 2 * k, cw * k, ch * k);
        ctx.restore();
        return;
      }
      // ---- after the cut
      const A = arrive(tc - 1e-4, s) || { x: W.x, y: W.y, rot: 0 };
      const tau = t - tc, hot = tau < 2 * F;
      const glint = hot ? 1 : clamp(1 - (tau - 2 * F) / .5);
      const { cw, ch } = render(zoom, hot, glint);
      const k = 1 / zoom;
      const g = 2500, slide = oC(seg(tau, 2 * F, .2));
      const dirS = s.dir == null ? 1 : s.dir;                     // blade travel direction along u (+1 / -1)
      const kick = s.kick == null ? 1 : s.kick;                   // how hard the blade knocks the far half
      [-1, 1].forEach(side => {
        // side -1 is the half on the -normal side; for a cut descending to the right that is the upper-right piece.
        const isTop = (nrm[1] * side) < 0 || (Math.abs(nrm[1]) < 1e-3 && side < 0);
        const fallT = Math.max(0, tau - .2);
        const sl = (isTop ? 34 : -6) * dirS * slide;              // the clean-cut beat: the upper piece slips along the cut
        const dx = u[0] * sl + nrm[0] * side * 6 * slide, dy = u[1] * sl + nrm[1] * side * 6 * slide;
        const vx = (isTop ? 300 * kick : -60) * u[0] * dirS + nrm[0] * side * 40, vy = (isTop ? 300 * kick : -60) * u[1] * dirS * .4 + (isTop ? -40 : -20);
        const w = (isTop ? 1.5 : -.55) * dirS * (u[0] >= 0 ? 1 : -1);
        let px = dx + vx * fallT, py = dy + vy * fallT + .5 * g * fallT * fallT, rot = A.rot * D2R + w * fallT;
        if (s.floor != null) {
          const rest = s.floor - A.y - m.h * (isTop ? .2 : .32);
          const tHit = (-vy + Math.sqrt(Math.max(0, vy * vy + 2 * g * (rest - dy)))) / g;
          if (fallT > tHit) {
            const af = fallT - tHit, vImp = vy + g * tHit;
            const b1 = Math.max(0, Math.sin(Math.min(af * 9, PI))) * Math.min(60, vImp * .05);
            px = dx + vx * tHit + vx * .25 * (1 - Math.exp(-af * 4)); py = rest - b1;
            rot = A.rot * D2R + w * tHit + w * .3 * (1 - Math.exp(-af * 5));
          }
        }
        const fade = s.fadeAt != null ? 1 - seg(t, s.fadeAt, s.fadeAt + .3) : 1;
        ctx.save(); ctx.globalAlpha = fade * outOp;
        ctx.translate(A.x + px, A.y + py); ctx.rotate(rot);
        halfClip(ctx, side);
        ctx.drawImage(off, -cw / 2 * k, -ch / 2 * k, cw * k, ch * k);
        ctx.restore();
      });
      // the cut line itself: a bright slit for the impact frames, then thinning
      const sl = clamp(1 - tau / .12);
      if (sl > 0) {
        const Lw = m.w * .5 + 40, p0 = [A.x + nrm[0] * W.off, A.y + nrm[1] * W.off];
        ctx.save(); ctx.lineCap = 'round';
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 9 * sl + 2; ctx.globalAlpha = sl;
        ctx.beginPath(); ctx.moveTo(p0[0] - u[0] * Lw, p0[1] - u[1] * Lw); ctx.lineTo(p0[0] + u[0] * Lw, p0[1] + u[1] * Lw); ctx.stroke();
        ctx.restore();
      }
      // sparks + shards from three points along the cut
      [-.32, 0, .3].forEach((f, i) => {
        const p = [A.x + nrm[0] * W.off + u[0] * m.w * f, A.y + nrm[1] * W.off + u[1] * m.w * f];
        sparks(ctx, t, tc, p[0], p[1], { n: 7, seed: W.seed * 10 + i, speed: 950, g: 2600, dir: Math.atan2(u[1], u[0]) * (dirS > 0 ? 1 : -1) + (dirS > 0 ? 0 : PI) - .5, spread: 1.7, life: .42 });
      });
      shards(ctx, t, tc, A.x, A.y, W);
    }
    function shards(ctx, t, tc, x, y, W) {
      const tau = t - tc; if (tau < 0 || tau > .9) return;
      for (let i = 0; i < 6; i++) {
        const h1 = hash(W.seed * 7 + i * 2.1), h2 = hash(W.seed * 3 + i * 5.7);
        const vx = (h1 - .5) * 900, vy = -120 - h2 * 260, px = x + (h1 - .5) * measure().w * .7 + vx * tau, py = y + vy * tau + 1300 * tau * tau;
        ctx.save(); ctx.globalAlpha = 1 - tau / .9; ctx.translate(px, py); ctx.rotate(tau * (6 + h2 * 8) * (i % 2 ? 1 : -1));
        ctx.fillStyle = i % 2 ? W.color : W.side; ctx.beginPath(); ctx.moveTo(-12, -7); ctx.lineTo(14, -2); ctx.lineTo(-2, 12); ctx.closePath(); ctx.fill();
        ctx.restore();
      }
    }
    return {
      o: W, draw, measure,
      shake(t, tc) { const c = tc == null ? W._cut : tc; const tau = t - c; if (tau < 0 || tau > .22) return [0, 0]; const a = 8 * (1 - tau / .22); const f = Math.floor(tau * 30); return [Math.round(a * (hash(f * 3.1 + W.seed) * 2 - 1)), Math.round(a * (hash(f * 7.7 + W.seed) * 2 - 1))]; },
      flash(t, tc) { const tau = t - tc; return tau >= 0 && tau < 2 * F ? .32 : 0; },
    };
  }

  // ---------------------------------------------------------------- DOPAMINE METER
  /* meter(stage, {x, y, h, label}) -> m.seek(t, fn, {op})   fn(t) -> level 0..1 (e.g. from dopa()).
   * Vertical gauge (tube, ticks, level fill: cyan when calm, orange/pink when spiking) + a live trace of the
   * last 2.4 s to its right. Label is DOM text (checked). Everything sits inside x x..x+300. */
  function meter(st, o = {}) {
    const x = o.x == null ? 140 : o.x, y = o.y == null ? 640 : o.y, h = o.h || 460, w = 74, tw = o.trace == null ? 190 : o.trace;
    // not a will-change layer: its SVG changes every frame and must re-raster in the main paint (deterministic)
    const box = el(st, 'div', '', `position:absolute;left:${x}px;top:${y}px;width:${w + tw + 30}px;height:${h + 90}px;opacity:0;visibility:hidden`);
    box.dataset.name = 'dopamine meter';
    const lab = el(box, 'div', 'kick', `position:absolute;left:0;top:0;font-size:40px;letter-spacing:.16em;color:${C.peach}`, o.label || 'DOPAMINE');
    // the gauge is painted on its own 2D canvas (synchronous, deterministic raster; no SVG gradients / clip paths)
    const cv = el(box, 'canvas', '', `position:absolute;left:-10px;top:60px;width:${w + tw + 50}px;height:${h + 40}px`);
    cv.width = w + tw + 50; cv.height = h + 40; cv.dataset.name = 'dopamine meter gauge';
    const g = cv.getContext('2d', SW2D);
    const ly = v => 8 + (h - 16) * (1 - clamp(v));
    return {
      el: box, label: lab,
      seek(t, fn, so = {}) {
        const v = fn(t), base = so.base == null ? .35 : so.base;
        g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, cv.width, cv.height); g.setTransform(1, 0, 0, 1, 10, 10);
        g.fillStyle = '#0a0f24'; g.beginPath(); g.roundRect(0, 0, w, h, w / 2); g.fill();
        g.save(); g.beginPath(); g.roundRect(8, 8, w - 16, h - 16, (w - 16) / 2); g.clip();
        const gr = g.createLinearGradient(0, h, 0, 0); gr.addColorStop(0, '#3ee6ff'); gr.addColorStop(.55, '#ffb36b'); gr.addColorStop(1, '#ff5c8a');
        g.fillStyle = gr; g.fillRect(8, ly(v), w - 16, h - ly(v)); g.restore();
        g.strokeStyle = v > .75 ? '#ff5c8a' : 'rgba(62,230,255,.6)'; g.lineWidth = v > .75 ? 7 : 4; g.beginPath(); g.roundRect(0, 0, w, h, w / 2); g.stroke();
        g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 3;
        for (let i = 0; i < 9; i++) { const yy = 20 + i * (h - 40) / 8; g.beginPath(); g.moveTo(w - 20, yy); g.lineTo(w - 8, yy); g.stroke(); }
        g.fillStyle = '#fff'; g.beginPath(); g.moveTo(-2, ly(v)); g.lineTo(-10, ly(v) - 10); g.lineTo(-10, ly(v) + 10); g.fill();
        g.fillStyle = 'rgba(10,15,36,.75)'; g.beginPath(); g.roundRect(w + 18, 0, tw, h, 18); g.fill();
        g.strokeStyle = 'rgba(255,255,255,.12)'; g.lineWidth = 3; g.stroke();
        g.setLineDash([10, 10]); g.strokeStyle = 'rgba(62,230,255,.45)'; g.beginPath(); g.moveTo(w + 24, ly(base)); g.lineTo(w + 12 + tw, ly(base)); g.stroke(); g.setLineDash([]);
        g.strokeStyle = v > .62 ? '#ff5c8a' : (v > .35 ? '#ffb36b' : '#3ee6ff'); g.lineWidth = 7; g.lineJoin = 'round'; g.lineCap = 'round'; g.beginPath();
        const N = 48;
        for (let i = 0; i <= N; i++) { const tt = t - 2.4 * (1 - i / N), x = w + 26 + (tw - 18) * i / N, y = ly(fn(Math.max(0, tt))); if (i) g.lineTo(x, y); else g.moveTo(x, y); }
        g.stroke();
        g.fillStyle = '#fff'; g.beginPath(); g.arc(w + 8 + tw, ly(v), 11, 0, TAU); g.fill();
        const shk = so.shake ? Math.round(so.shake * Math.sin(t * 90)) : 0;
        const op = so.op == null ? 1 : so.op;
        box.style.opacity = op.toFixed(3); box.style.visibility = op > 0 ? 'visible' : 'hidden';
        box.style.transform = `translate(${shk + (so.dx || 0)}px,${so.dy || 0}px)`;
      }
    };
  }
  /* dopa(SWIPES, o) -> fn(t): a level curve. Each swipe time spikes the level (fast rise .1 s) then crashes below
   * the running baseline (.7 s); baseline sinks with each swipe ("each hit buys less"). o.calm = [t0, t1]: from t0 the
   * level eases to a steady o.calmLevel; o.base (default .38), o.peak (.95), o.crash (.12), o.start (level at t=0). */
  function dopa(SW, o = {}) {
    const base0 = o.base == null ? .38 : o.base, peak = o.peak == null ? .95 : o.peak, crash = o.crash == null ? .14 : o.crash;
    return t => {
      let v = o.start == null ? base0 : o.start, n = 0;
      for (const s of SW) {
        if (t < s) break;
        n++;
        const tau = t - s, b = Math.max(.08, base0 - .05 * n);
        const up = oC(seg(tau, 0, .1)), down = io(seg(tau, .12, .75)), rec = io(seg(tau, .8, 1.6));
        const pk = peak - .03 * n;
        v = lerp(lerp(v, pk, up), crash, down); if (rec > 0) v = lerp(crash, b, rec * .6);
      }
      if (o.calm) { const k = io(seg(t, o.calm[0], o.calm[1])); v = lerp(v, (o.calmLevel == null ? .42 : o.calmLevel) + .015 * Math.sin(t * 2.2), k); }
      if (o.jitter !== false) v += .012 * Math.sin(t * 13.7) * (1 - (o.calm ? io(seg(t, o.calm[0], o.calm[1])) : 0));
      return clamp(v);
    };
  }

  // ---------------------------------------------------------------- SCROLL GOBLIN
  /* goblin.draw(ctx, {x, y (feet), s, t, face:'grin'|'shock'|'sad', fx, armL:[x,y], armR:[x,y], squash, op}) */
  const goblin = {
    draw(ctx, g) {
      const t = g.t || 0, s = g.s || 1, sq = g.squash || 0;
      ctx.save(); ctx.globalAlpha = g.op == null ? 1 : g.op; ctx.translate(g.x, g.y); ctx.scale(s * (g.fx || 1) * (1 + sq * .3), s * (1 - sq * .3));
      const bob = Math.sin(t * 8) * 4;
      ctx.lineCap = 'round';
      // legs
      ctx.strokeStyle = '#3b1f74'; ctx.lineWidth = 16;
      [[-28, 1], [28, -1]].forEach(([lx, k]) => { ctx.beginPath(); ctx.moveTo(lx, -40); ctx.lineTo(lx + 6 * Math.sin(t * 14) * k, -4); ctx.stroke(); ctx.fillStyle = '#3b1f74'; ctx.beginPath(); ctx.ellipse(lx + 8 + 6 * Math.sin(t * 14) * k, -4, 18, 9, 0, 0, TAU); ctx.fill(); });
      ctx.translate(0, bob);
      // arms
      const aL = g.armL || [-100, -150 + 14 * Math.sin(t * 7)], aR = g.armR || [100, -150 - 14 * Math.sin(t * 7)];
      ctx.strokeStyle = '#5b33b0'; ctx.lineWidth = 14;
      [[-54, aL], [54, aR]].forEach(([sx, a]) => { ctx.beginPath(); ctx.moveTo(sx, -120); ctx.quadraticCurveTo((sx + a[0]) / 2, a[1] - 30, a[0], a[1]); ctx.stroke(); ctx.fillStyle = '#7b4bd6'; ctx.beginPath(); ctx.arc(a[0], a[1], 14, 0, TAU); ctx.fill(); });
      // horns
      ctx.fillStyle = '#5b33b0'; [[-34, -1], [34, 1]].forEach(([hx, k]) => { ctx.beginPath(); ctx.moveTo(hx - 12, -228); ctx.lineTo(hx + 10 * k, -268); ctx.lineTo(hx + 12, -228); ctx.fill(); });
      // body = chubby phone
      ctx.fillStyle = '#7b4bd6'; ctx.beginPath(); ctx.roundRect(-64, -236, 128, 200, 36); ctx.fill();
      ctx.fillStyle = '#6236b8'; ctx.beginPath(); ctx.roundRect(28, -236, 36, 200, [0, 36, 36, 0]); ctx.fill();
      ctx.strokeStyle = '#2a1060'; ctx.lineWidth = 5; ctx.beginPath(); ctx.roundRect(-64, -236, 128, 200, 36); ctx.stroke();
      // screen face
      ctx.fillStyle = '#1a0b3a'; ctx.beginPath(); ctx.roundRect(-48, -218, 96, 150, 22); ctx.fill();
      const f = g.face || 'grin';
      ctx.fillStyle = '#ffe36b';
      if (f === 'shock') { [[-20, -168], [20, -168]].forEach(([ex, ey]) => { ctx.beginPath(); ctx.arc(ex, ey, 12, 0, TAU); ctx.fill(); }); ctx.beginPath(); ctx.ellipse(0, -112, 14, 18, 0, 0, TAU); ctx.fill(); }
      else {
        [[-20, -166, 1], [20, -166, -1]].forEach(([ex, ey, k]) => { ctx.beginPath(); ctx.moveTo(ex - 13, ey - 6 * k * (f === 'sad' ? -1 : 1)); ctx.lineTo(ex + 13, ey + 6 * k * (f === 'sad' ? -1 : 1)); ctx.lineTo(ex, ey + 10); ctx.closePath(); ctx.fill(); });
        if (f === 'sad') { ctx.strokeStyle = '#ffe36b'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, -96, 20, PI * 1.15, PI * 1.85); ctx.stroke(); }
        else { ctx.beginPath(); ctx.moveTo(-30, -124); ctx.quadraticCurveTo(0, -84, 30, -124); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#1a0b3a'; for (let i = -2; i <= 2; i++) { ctx.fillRect(i * 11 - 2, -124, 4, 12); } }
      }
      ctx.restore();
    }
  };

  // ---------------------------------------------------------------- calendar page (prop)
  /* calPage(ctx, x, y, s, label, {rot, op, col}) — a tear-off calendar sheet with a big label (e.g. "DAY 3") */
  function calPage(ctx, x, y, s, label, o = {}) {
    ctx.save(); ctx.globalAlpha = o.op == null ? 1 : o.op; ctx.translate(x, y); ctx.rotate((o.rot || 0) * D2R); ctx.scale(s, s);
    ctx.fillStyle = '#000'; ctx.globalAlpha *= .3; ctx.beginPath(); ctx.roundRect(-118, -128, 244, 270, 22); ctx.fill(); ctx.globalAlpha = o.op == null ? 1 : o.op;
    ctx.fillStyle = '#fff6ea'; ctx.beginPath(); ctx.roundRect(-122, -140, 244, 270, 22); ctx.fill();
    ctx.fillStyle = o.col || C.orange; ctx.beginPath(); ctx.roundRect(-122, -140, 244, 64, [22, 22, 0, 0]); ctx.fill();
    ctx.fillStyle = '#0b1026'; [-60, 60].forEach(rx => { ctx.beginPath(); ctx.arc(rx, -140, 10, 0, TAU); ctx.fill(); });
    ctx.fillStyle = '#0b1026'; ctx.font = '800 112px BS'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, 0, 26);
    ctx.restore();
  }

  window.Stick = {
    clamp, seg, oC, iC, ioC, io, oBack, oElastic, lerp, tri, hash, C, FLOOR, V,
    stage, text, kin, kinShow, kicker, chip, show, fitText, hideInvisible, safeGuide, boot,
    env, world, canvas, clear,
    ninja: { pose, draw: drawNinja, timeline, POSE, L, skel, reach, toWorld, SLASH: SL, ik, mix: mixJ },
    track, wordcut, meter, dopa, goblin, sparks, hearts, phone, book, laptop, check, calPage,
  };
})();

/* ---------------------------------------------------------------- stick.js EXTENSIONS (videos 3–4; appended, additive)
 * Adds, without changing anything above:
 *   poses      tug (lean back on a rope), yanked (pulled backwards by the belt), chin (sitting, chin on hand, bored),
 *              carry (walking, holding something at arm's length), reachUp (stretching up for something)
 *   env kind   'hall' — a second room: open doorway, side table with a lidded box, picture frame, sconce
 *   props      rope(ctx, A, B, o)   cloud(ctx, x, y, s, t, o)   wallClock(ctx, x, y, s, t, o)   door(ctx, x, y, s, open)
 *              box(ctx, x, y, s, lid)   buzz(ctx, x, y, t, k)   belt(n) -> world point of the ninja's belt
 */
(function () {
  'use strict';
  const S = window.Stick; if (!S) return;
  const { clamp, seg, oC, io, lerp, hash, C } = S;
  const PI = Math.PI, TAU = 2 * PI, H0 = -172;
  const stand = (o = {}) => Object.assign({ hip: [0, H0], lean: .04, tilt: 0, hr: [22, -150], hl: [-12, -152], fr: [24, 0], fl: [-24, 0], tail: .3, face: 'n' }, o);
  Object.assign(S.ninja.POSE, {
    // leaning back, both fists forward at belly height gripping a rope; trembles with effort. a.k 0..1 = how hard
    tug: (u, a) => { const k = a.k == null ? .7 : a.k, tr = Math.sin(u * 31) * 3 * k;
      return stand({ hip: [-26 * k, H0 + 26 * k], lean: -.34 * k, tilt: .1 * k, hr: [96 + tr, -214 + 10 * k], hl: [74 + tr, -206 + 10 * k], fr: [70, 0], fl: [-74, 0], face: a.face || 'd', tail: .6, elbowOut: 0 }); },
    // pulled backwards by the belt (toward -x in the local frame): hips lead, limbs trail forward, shocked
    yanked: (u, a) => { const f = Math.sin(u * 16);
      return stand({ hip: [-24, H0 + 6], lean: .62, tilt: .25, hr: [150 + 10 * f, -250 - 16 * f], hl: [130 - 10 * f, -200 + 16 * f], fr: [86, -70 + 12 * f], fl: [110, -30 - 12 * f], face: a.face || 's', tail: 1 }); },
    // sitting (stool / crate), elbow on the knee, chin on the hand, bored. a.face (default 'w')
    chin: (u, a) => { const b = Math.sin(u * 1.5);
      return { hip: [0, -104], lean: .36 + .015 * b, tilt: .12 + .03 * b, hr: [74, -232 + 2 * b], hl: [104, -112], fr: [88, 0], fl: [70, 0], tail: .1, face: a.face || 'w', kneeUp: 1 }; },
    // walking with both hands out in front holding something at arm's length (a.dx, a.dy hand target)
    carry: (u, a) => { const f = u / .8 * TAU, s = Math.sin(f), c = Math.cos(f), dx = a.dx == null ? 118 : a.dx, dy = a.dy == null ? -262 : a.dy, still = a.still ? 0 : 1;
      return stand({ hip: [0, H0 - 5 * Math.abs(Math.cos(f)) * still], lean: -.04, tilt: -.12, fr: [s * 44 * still + (still ? 0 : 24), -Math.max(0, c) * 24 * still], fl: [-s * 44 * still - (still ? 0 : 24), -Math.max(0, -c) * 24 * still],
        hr: [dx, dy + 3 * s * still], hl: [dx - 14, dy + 8 + 3 * s * still], face: a.face || 'w', tail: .5 }); },
    // stretching up on tiptoe for something above (a.x, a.y hand target)
    reachUp: (u, a) => { const k = io(seg(u, 0, .2)), w = Math.sin(u * 7) * 6;
      return stand({ hip: [0, H0 - 14 * k], lean: -.06, tilt: -.3 * k, hr: [lerp(24, a.x == null ? 60 : a.x, k) + w, lerp(-150, a.y == null ? -440 : a.y, k)], hl: [-20, lerp(-152, -300, k)], fr: [24, -18 * k], fl: [-24, -10 * k], face: a.face || 's', tail: .6 }); },
  });
  // world position of the ninja's belt (where a rope is tied)
  S.belt = n => { const sk = S.ninja.skel(n); return S.ninja.toWorld(n, [sk.hip[0] + sk.du[0] * 10, sk.hip[1] + sk.du[1] * 10]); };

  /* rope(ctx, A, B, {len, t, vib, snap, keep, col, w, seed})
   *   A (anchor, e.g. the phone) -> B (e.g. the belt). Slack when |AB| < len (sags under gravity), taut and vibrating
   *   (vib 0..1) otherwise. snap = seconds since the rope snapped (>= 0): both halves recoil toward their ends with a
   *   decaying curl; the B half keeps `keep` px (a dangling stub) and the A half whips out of sight. Drawn shapes only. */
  function rope(ctx, A, B, o = {}) {
    const t = o.t || 0, len = o.len || 400, col = o.col || '#ff5c8a', w = o.w || 10;
    const dx = B[0] - A[0], dy = B[1] - A[1], d = Math.hypot(dx, dy) || 1, ux = dx / d, uy = dy / d, nx = -uy, ny = ux;
    const strand = (pts) => {
      ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.strokeStyle = '#2a0f22'; ctx.lineWidth = w + 6; path(pts); ctx.stroke();
      ctx.strokeStyle = col; ctx.lineWidth = w; path(pts); ctx.stroke();
      ctx.setLineDash([10, 12]); ctx.lineDashOffset = 0; ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = w * .35; path(pts); ctx.stroke();
      ctx.restore();
    };
    const path = pts => { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); };
    const N = 28;
    if (o.snap == null || o.snap < 0) {
      const sag = Math.sqrt(Math.max(0, len * len - d * d)) * .5, vib = (o.vib || 0) * 9;
      const pts = [];
      for (let i = 0; i <= N; i++) {
        const k = i / N, bell = 4 * k * (1 - k);
        const wv = vib * Math.sin(k * PI * 3 + t * 60) * Math.sin(k * PI);
        pts.push([A[0] + dx * k + nx * wv, A[1] + dy * k + sag * bell + ny * wv]);
      }
      strand(pts);
      return;
    }
    const tau = o.snap, keep = o.keep == null ? 90 : o.keep;
    [0, 1].forEach(side => {
      const P = side ? B : A, sgn = side ? -1 : 1;                 // direction from this end toward the other end
      const L0 = d / 2, Lk = side ? keep : 0, L = lerp(L0, Lk, oC(clamp(tau / .32)));
      if (L < 4) return;
      const pts = [];
      for (let i = 0; i <= N; i++) {
        const k = i / N, s = L * k;
        const curl = Math.exp(-tau * 5) * 60 * Math.sin(k * PI * 2.5 - tau * 30) * k;
        const drop = (side ? 1 : 1) * 900 * Math.min(tau, .5) * Math.min(tau, .5) * k * k;     // the stub droops under gravity
        pts.push([P[0] + ux * sgn * s + nx * curl, P[1] + uy * sgn * s + ny * curl + drop]);
      }
      ctx.save(); ctx.globalAlpha = side ? 1 : clamp(1 - tau / .4); strand(pts); ctx.restore();
    });
  }

  /* cloud(ctx, x, y, s, t, {face:'smug'|'happy'|'wink'|'none', sparkle 0..1, rain 0..1, op, grey 0..1})
   *   THE MOTIVATION CLOUD: a puffy lilac-white cloud with gold sparkles orbiting it; `rain` drops golden sparkles
   *   below it (up to ~420*s px). Centre at x, y; about 300*s wide. */
  function cloud(ctx, x, y, s, t, o = {}) {
    const op = o.op == null ? 1 : o.op; if (op <= 0) return;
    const grey = o.grey || 0, bob = Math.sin(t * 2.2) * 6 * s;
    ctx.save(); ctx.globalAlpha = op; ctx.translate(x, y + bob); ctx.scale(s, s);
    const puffs = [[-100, 10, 62], [-48, -34, 78], [30, -46, 86], [100, -4, 66], [60, 34, 60], [-30, 38, 62]];
    // rain of sparkles
    const rain = o.rain || 0;
    if (rain > 0) for (let i = 0; i < 18; i++) {
      const h = hash(i * 4.7), p = ((t * (.9 + .5 * h) + h) % 1), px = (h - .5) * 230 + 10 * Math.sin(t * 3 + i), py = 60 + p * 420;
      ctx.save(); ctx.globalAlpha = op * rain * Math.sin(PI * p); ctx.translate(px, py); ctx.rotate(t * 3 + i); star4(ctx, 9 + 7 * h, i % 3 ? '#ffe36b' : '#ffffff'); ctx.restore();
    }
    // glow
    const g = ctx.createRadialGradient(0, 0, 40, 0, 0, 230); g.addColorStop(0, `rgba(255,227,107,${.35 * (1 - grey)})`); g.addColorStop(1, 'rgba(255,227,107,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 230, 0, TAU); ctx.fill();
    ctx.fillStyle = '#2a1f5a'; puffs.forEach(([px, py, r]) => { ctx.beginPath(); ctx.arc(px, py + 8, r + 8, 0, TAU); ctx.fill(); });
    const top = grey ? `rgb(${lerp(255, 170, grey)},${lerp(250, 170, grey)},${lerp(255, 180, grey)})` : '#fffaff';
    const cg = ctx.createLinearGradient(0, -130, 0, 100); cg.addColorStop(0, top); cg.addColorStop(1, grey ? '#7a7690' : '#c9b8ff');
    ctx.fillStyle = cg; puffs.forEach(([px, py, r]) => { ctx.beginPath(); ctx.arc(px, py, r, 0, TAU); ctx.fill(); });
    // face
    const f = o.face || 'smug';
    if (f !== 'none') {
      ctx.strokeStyle = '#2a1f5a'; ctx.fillStyle = '#2a1f5a'; ctx.lineWidth = 7; ctx.lineCap = 'round';
      if (f === 'happy') { [-28, 28].forEach(ex => { ctx.beginPath(); ctx.arc(ex, -2, 12, PI * 1.1, PI * 1.9); ctx.stroke(); }); ctx.beginPath(); ctx.arc(0, 14, 22, PI * .15, PI * .85); ctx.stroke();
        ctx.fillStyle = '#ff9ec2'; ctx.globalAlpha = op * .7; [-52, 52].forEach(ex => { ctx.beginPath(); ctx.arc(ex, 18, 10, 0, TAU); ctx.fill(); }); ctx.globalAlpha = op; }
      else if (f === 'wink') { ctx.beginPath(); ctx.moveTo(-40, -4); ctx.lineTo(-16, -4); ctx.stroke(); ctx.beginPath(); ctx.arc(28, -4, 8, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(-18, 22); ctx.quadraticCurveTo(10, 36, 34, 14); ctx.stroke(); }
      else { [-28, 28].forEach(ex => { ctx.beginPath(); ctx.arc(ex, 0, 8, 0, TAU); ctx.fill(); ctx.fillRect(ex - 14, -14, 28, 6); }); ctx.beginPath(); ctx.moveTo(-20, 24); ctx.quadraticCurveTo(6, 34, 30, 16); ctx.stroke(); }
    }
    // orbiting sparkles
    const sp = (o.sparkle == null ? 1 : o.sparkle) * (1 - grey);
    if (sp > 0) for (let i = 0; i < 6; i++) {
      const a = t * 1.6 + i * TAU / 6, px = Math.cos(a) * 190, py = Math.sin(a) * 70 - 10, tw = .5 + .5 * Math.sin(t * 9 + i * 2);
      ctx.save(); ctx.globalAlpha = op * sp * (.4 + .6 * tw); ctx.translate(px, py); ctx.rotate(t * 2 + i); star4(ctx, 10 + 8 * tw, i % 2 ? '#ffe36b' : '#ffffff'); ctx.restore();
    }
    ctx.restore();
  }
  function star4(ctx, r, col) {
    ctx.fillStyle = col; ctx.beginPath();
    for (let k = 0; k < 8; k++) { const rr = k % 2 ? r * .32 : r, b = k * PI / 4; ctx.lineTo(rr * Math.cos(b), rr * Math.sin(b)); }
    ctx.closePath(); ctx.fill();
  }

  /* wallClock(ctx, x, y, s, t, {speed}) — a round wall clock whose hands spin `speed` hours per second (time passing) */
  function wallClock(ctx, x, y, s, t, o = {}) {
    const sp = o.speed == null ? 1 : o.speed, h = (o.t0 || 0) + t * sp;
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = '#0b1026'; ctx.beginPath(); ctx.arc(0, 0, 78, 0, TAU); ctx.fill();
    ctx.fillStyle = '#e9ecff'; ctx.beginPath(); ctx.arc(0, 0, 66, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#0b1026'; ctx.lineCap = 'round';
    for (let i = 0; i < 12; i++) { const a = i * TAU / 12; ctx.lineWidth = i % 3 ? 3 : 6; ctx.beginPath(); ctx.moveTo(52 * Math.cos(a), 52 * Math.sin(a)); ctx.lineTo(60 * Math.cos(a), 60 * Math.sin(a)); ctx.stroke(); }
    const ah = h / 12 * TAU - PI / 2, am = h * TAU - PI / 2;
    ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(30 * Math.cos(ah), 30 * Math.sin(ah)); ctx.stroke();
    ctx.strokeStyle = '#ff5c8a'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(48 * Math.cos(am), 48 * Math.sin(am)); ctx.stroke();
    ctx.fillStyle = '#0b1026'; ctx.beginPath(); ctx.arc(0, 0, 7, 0, TAU); ctx.fill();
    ctx.restore();
  }
  /* door(ctx, x, y, s, open) — a door slab hinged at x (left edge), bottom at y, 0 = shut, 1 = swung open (thin) */
  function door(ctx, x, y, s, open) {
    const W = 250 * s, H = 520 * s, w = W * lerp(1, .16, clamp(open));
    ctx.save();
    ctx.fillStyle = '#3a2a4a'; ctx.beginPath(); ctx.moveTo(x, y - H); ctx.lineTo(x + w, y - H + 26 * s * open); ctx.lineTo(x + w, y - 26 * s * open); ctx.lineTo(x, y); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#21162c'; ctx.lineWidth = 6 * s; ctx.stroke();
    if (open < .85) { ctx.fillStyle = '#2c1f3a'; ctx.fillRect(x + w * .14, y - H * .9, w * .72, H * .34); ctx.fillRect(x + w * .14, y - H * .48, w * .72, H * .38);
      ctx.fillStyle = '#ffb36b'; ctx.beginPath(); ctx.arc(x + w * .86, y - H * .5, 9 * s, 0, TAU); ctx.fill(); }
    ctx.restore();
  }
  /* box(ctx, x, y, s, lid) — a small wooden box (bottom centre x, y); lid 0 = closed, 1 = open (tilted back) */
  function box(ctx, x, y, s, lid) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = '#7a4a2a'; ctx.beginPath(); ctx.roundRect(-90, -80, 180, 80, 8); ctx.fill();
    ctx.fillStyle = '#93603a'; ctx.fillRect(-90, -80, 180, 12); ctx.fillStyle = '#5a341c'; ctx.fillRect(-90, -40, 180, 6);
    ctx.save(); ctx.translate(-92, -80); ctx.rotate(-1.9 * clamp(lid));
    ctx.fillStyle = '#a06a40'; ctx.beginPath(); ctx.roundRect(0, -16, 184, 18, 6); ctx.fill(); ctx.fillStyle = '#ffb36b'; ctx.fillRect(80, 0, 24, 8);
    ctx.restore(); ctx.restore();
  }
  /* buzz(ctx, x, y, t, k) — vibration marks around a buzzing phone (k 0..1) */
  function buzz(ctx, x, y, t, k) {
    if (k <= 0) return;
    ctx.save(); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.globalAlpha = k * (.6 + .4 * Math.sin(t * 40));
    [-1, 1].forEach(sx => [0, 1].forEach(i => { const r = 70 + i * 26; ctx.beginPath(); ctx.arc(x, y, r, sx > 0 ? -.5 : PI - .5, sx > 0 ? .5 : PI + .5); ctx.stroke(); }));
    ctx.restore();
  }
  Object.assign(S, { rope, cloud, wallClock, door, box, buzz, star4 });

  // ---- env 'hall': a second room (doorway on the left, side table + box on the right). Same contract as env().
  const env0 = S.env; let hallN = 0;
  S.env = function (parent, kind, opt = {}) {
    if (kind !== 'hall') return env0(parent, kind, opt);
    const id = 'hall' + (hallN++) + '_', F = opt.floor || S.FLOOR, NS = 'http://www.w3.org/2000/svg';
    const d = document.createElement('div'); d.className = 'full'; d.setAttribute('style', 'position:absolute;transform-origin:0 0;opacity:0;visibility:hidden'); d.dataset.bg = 'env';
    parent.appendChild(d);
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('width', 2160); s.setAttribute('height', 3840); s.setAttribute('viewBox', '-540 -960 2160 3840');
    s.setAttribute('style', 'position:absolute;left:-540px;top:-960px;overflow:visible');
    s.innerHTML = `<defs><linearGradient id="${id}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d1a3e"/><stop offset="1" stop-color="#12102a"/></linearGradient>
<linearGradient id="${id}f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1530"/><stop offset="1" stop-color="#08060f"/></linearGradient>
<radialGradient id="${id}sc"><stop offset="0" stop-color="#ffb36b" stop-opacity=".5"/><stop offset="1" stop-color="#ffb36b" stop-opacity="0"/></radialGradient>
<linearGradient id="${id}dim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b0a1c" stop-opacity=".85"/><stop offset=".8" stop-color="#0b0a1c" stop-opacity=".6"/><stop offset="1" stop-color="#0b0a1c" stop-opacity="0"/></linearGradient>
<linearGradient id="${id}dr" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2a3a7a"/><stop offset="1" stop-color="#0a0d22"/></linearGradient></defs>
<rect x="-540" y="-960" width="2160" height="${F + 960}" fill="url(#${id}w)"/>
<rect x="-540" y="${F - 330}" width="2160" height="330" fill="#191633"/><line x1="-540" y1="${F - 330}" x2="1620" y2="${F - 330}" stroke="#2c2752" stroke-width="10"/>
${Array.from({ length: 10 }, (_, i) => `<rect x="${-500 + i * 220}" y="${F - 290}" width="180" height="250" rx="6" fill="none" stroke="#24204a" stroke-width="5"/>`).join('')}
<rect x="130" y="${F - 560}" width="300" height="560" fill="#2c2752"/><rect x="150" y="${F - 540}" width="260" height="540" fill="url(#${id}dr)"/>
<polygon points="150,${F} 410,${F} 520,${F + 120} 60,${F + 120}" fill="#2a3a7a" opacity=".25"/>
<ellipse cx="760" cy="${F - 470}" rx="300" ry="260" fill="url(#${id}sc)"/>
<rect x="744" y="${F - 500}" width="32" height="54" rx="8" fill="#ffb36b" opacity=".9"/><rect x="738" y="${F - 450}" width="44" height="12" rx="4" fill="#3a2a4a"/>
<g transform="translate(520 ${F - 760})"><rect x="0" y="0" width="190" height="140" rx="8" fill="#0d0b20" stroke="#5a4a7a" stroke-width="10"/><path d="M14 126 L70 56 L104 96 L130 70 L176 126Z" fill="#ff9a6a" opacity=".85"/><circle cx="140" cy="38" r="14" fill="#ffe2a8"/></g>
<rect x="-540" y="-960" width="2160" height="${950 + 960}" fill="url(#${id}dim)"/>
<rect x="-540" y="${F}" width="2160" height="1500" fill="url(#${id}f)"/><line x1="-540" y1="${F}" x2="1620" y2="${F}" stroke="#ffb36b" stroke-width="3" opacity=".35"/>
<g stroke="#1a1428" stroke-width="3">${Array.from({ length: 12 }, (_, i) => `<line x1="${-540 + i * 200}" y1="${F + 2}" x2="${-540 + i * 200 + 140}" y2="${F + 700}"/>`).join('')}</g>
<rect x="640" y="${F - 250}" width="300" height="22" rx="6" fill="#3a2a4a"/><rect x="640" y="${F - 250}" width="300" height="5" rx="3" fill="#ffb36b" opacity=".5"/>
<rect x="660" y="${F - 228}" width="16" height="228" fill="#241a30"/><rect x="904" y="${F - 228}" width="16" height="228" fill="#241a30"/><rect x="676" y="${F - 120}" width="228" height="12" fill="#241a30"/>`;
    d.appendChild(s);
    return { el: d, svg: s, kind, floor: F, seek() {} };
  };
})();

/* ---------------------------------------------------------------- stick.js EXTENSIONS 2 (app channel; appended, additive)
 * Adds, without changing anything above:
 *   endCardApp(stage, o) -> ec      THE "DOWNLOAD SUMMITLY" END CARD, identical in every app-channel video:
 *                                   call ec(t, t0) every frame (t0 = end-card start; it lasts ec.dur = 3.3 s).
 *   appPhone(stage, o)  -> ph       a big phone (screen + chin) showing a REAL app screenshot window; ph.seek(t, {in, out, pan})
 *   poses      flourish {aim}       katana twirl (two turns) that ends thrust forward, pointing at something
 */
(function () {
  'use strict';
  const S = window.Stick; if (!S) return;
  const { clamp, seg, oC, iC, io, ioC, oBack, lerp, tri, hash, C, V } = S;
  const PI = Math.PI, TAU = 2 * PI, D2R = PI / 180, H0 = -172;
  const KIT = (document.currentScript && document.currentScript.src || '').replace(/stick\.js(\?.*)?$/, '') || 'kit/';
  const stand = (o = {}) => Object.assign({ hip: [0, H0], lean: .04, tilt: 0, hr: [22, -150], hl: [-12, -152], fr: [24, 0], fl: [-24, 0], tail: .3, face: 'n' }, o);
  const mk = (parent, tag, cls, style, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (style) e.setAttribute('style', style); if (html != null) e.innerHTML = html; parent.appendChild(e); return e; };

  Object.assign(S.ninja.POSE, {
    // .00–.10 reach for the hilt, .10–.60 twirl the blade two full turns with the hand raised (drawn smear),
    // .60–.78 lunge and thrust: the blade ends pointing forward at a.aim degrees (0 = level, + = down); then hold.
    flourish: (u, a) => {
      const aim = a.aim == null ? 8 : a.aim;
      const th = io(seg(u, .6, .78)), b = Math.sin(u * 2.6);
      const hilt = [-36, -290], hUp = [78, -246], hAim = [116, -262];
      let hr;
      if (u < .1) hr = V([22, -150], hilt, io(seg(u, 0, .1)));
      else if (u < .6) hr = V(hilt, hUp, io(seg(u, .1, .26)));
      else hr = V(hUp, hAim, th);
      if (u > .78) hr = [hr[0], hr[1] + 2 * b];
      const tw = ioC(seg(u, .1, .6));
      let ang = u < .6 ? lerp(-100, 620, tw) : lerp(-100, aim, th);
      const kat = u >= .08 ? { ang: ang * D2R } : null;
      // smear behind the moving blade (twirl and thrust), drawn about the hand
      let arc = null;
      const spin = u > .12 && u < .58 ? 1 : (u > .6 && u < .8 ? 1 : 0);
      if (spin) {
        const back = u < .6 ? 110 : 70 * (1 - th) + 10;
        arc = { c: hr, a0: (ang - back) * D2R, a1: ang * D2R, r0: 40, r1: 205, op: .75 * (u < .6 ? tri(u, .12, .58) : tri(u, .6, .8)) };
      }
      return stand({ hip: [lerp(0, 22, th), H0 + lerp(4, 22, th) + (u > .78 ? b : 0)], lean: lerp(-.02, .22, th), tilt: lerp(-.12, .02, th),
        hr, hl: V([-40, -230], [-74, -200], th), fr: [lerp(30, 92, th), 0], fl: [lerp(-30, -74, th), 0],
        face: u > 1.0 ? 'h' : 'd', tail: .5 + .5 * (1 - th) * (u > .1 ? 1 : 0), kat, arc });
    },
  });

  // ---------------------------------------------------------------- CSS for the end card + app phone
  (function css() {
    if (document.getElementById('stick-css2')) return;
    const st = document.createElement('style'); st.id = 'stick-css2';
    st.textContent = `
.eca { background:linear-gradient(180deg,#070b1f 0%,#111845 46%,#1a1d52 64%,#0b1026 100%) }
.eca-icon { position:absolute; width:200px; height:200px; border-radius:46px; overflow:hidden; box-shadow:0 0 0 4px rgba(62,230,255,.75), 0 0 46px rgba(62,230,255,.55), 0 14px 0 rgba(0,0,0,.35) }
.eca-icon img { width:200px; height:200px; display:block }
.eca-shine { position:absolute; left:0; top:-60px; width:90px; height:320px; background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.38),rgba(255,255,255,0)) }
.eca-sub { position:absolute; text-align:center; font:600 46px HG; letter-spacing:.05em; color:${C.orange}; white-space:nowrap }
.eca-chip { position:absolute; text-align:center }
.eca-edge { position:absolute; left:-700px; top:952px; width:2500px; height:16px; border-radius:8px; background:#fff; box-shadow:0 0 0 5px rgba(62,230,255,.85), 0 0 34px rgba(62,230,255,.9) }
.sp-phone { border-radius:56px; background:linear-gradient(145deg,#3a4256,#10131b 40%,#1d2230); box-shadow:0 0 0 3px rgba(62,230,255,.6), 0 0 0 9px rgba(62,230,255,.13), 0 24px 0 rgba(0,0,0,.3) }
.sp-phone .sc { position:absolute; overflow:hidden; background:#05070c }
.sp-phone .sc img { position:absolute; left:0; top:0; display:block; transform-origin:0 0 }
.sp-phone .isl { position:absolute; height:26px; border-radius:16px; background:#000 }
.sp-phone .hb { position:absolute; width:58px; height:58px; border-radius:50%; box-shadow:inset 0 0 0 4px rgba(255,255,255,.22) }
`;
    document.head.appendChild(st);
  })();

  /* ---------------------------------------------------------------- THE APP END CARD
   * endCardApp(stage, {dur}) -> ec ; ec(t, t0) every frame (ec.seek is the same function). Create it LAST (on top of
   * everything). Layout (all words inside the safe zone, nothing in the x>780 / y>840 corner):
   *   DOWNLOAD (cyan) / SUMMITLY (white)  y ≈ 560–815, centred      the real app icon  x 440–640, y 868–1068
   *   ninja lands at x 250 on the summit ledge (feet y 1070), twirls the katana and points it at the icon
   *   FREE ON THE APP STORE  y ≈ 1100–1150      chip SEARCH "SUMMITLY"  y ≈ 1160–1228  (both centred at x 430)
   * Timing (u = t - t0): 0–.32 katana-slash wipe; .12–.62 the ninja leaps in (flip) and lands; .50 icon pops (put the
   * sound kit's `sting` here); .40 / .80 DOWNLOAD / SUMMITLY; .95–1.73 flourish → points at the icon (spark + shine);
   * 1.55 FREE ON THE APP STORE; 2.05 chip. VO (narrator): "Download Summitly. Free on the App Store." at t0 + .30.
   * Fade the scene's own captions out at least .27 s before t0 (they must be gone before the wipe). */
  function endCardApp(st, o = {}) {
    const dur = o.dur || 3.3;
    const edge = mk(st, 'div', 'abs eca-edge', 'opacity:0');
    const root = mk(st, 'div', 'abs full eca', 'opacity:0');
    root.dataset.name = 'app end card';
    // decor (stars, dawn glow, far ridge, the summit ledge, icon glow) on its own software canvas, tagged data-bg
    const deco = mk(root, 'canvas', '', 'position:absolute;left:0;top:0;width:1080px;height:1920px'); deco.width = 1080; deco.height = 1920;
    deco.dataset.bg = 'endcard';
    const dctx = deco.getContext('2d', { willReadFrequently: true });
    const STARS = Array.from({ length: 34 }, (_, i) => [hash(i * 3.7) * 1080, 60 + hash(i * 9.1) * 1000, 1.4 + hash(i) * 2]);
    const poly = (c, pts) => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); pts.slice(1).forEach(q => c.lineTo(q[0], q[1])); c.closePath(); };
    function drawDeco(t, u) {
      const c = dctx; c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, 1080, 1920);
      c.fillStyle = '#fff';
      STARS.forEach(([x, y, r], i) => { c.globalAlpha = .25 + .35 * Math.sin(t * 1.7 + i * 1.9); c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); });
      c.globalAlpha = 1;
      let g = c.createRadialGradient(540, 1260, 0, 540, 1260, 700); g.addColorStop(0, 'rgba(255,207,154,.5)'); g.addColorStop(1, 'rgba(255,138,92,0)');
      c.save(); c.translate(540, 1260); c.scale(1, 300 / 700); c.translate(-540, -1260); c.fillStyle = g; c.beginPath(); c.arc(540, 1260, 700, 0, TAU); c.fill(); c.restore();
      g = c.createLinearGradient(0, 1110, 0, 1920); g.addColorStop(0, '#4a2f6e'); g.addColorStop(1, '#22184a');
      c.globalAlpha = .9; c.fillStyle = g; poly(c, [[-40, 1330], [150, 1180], [300, 1250], [470, 1120], [640, 1230], [820, 1110], [1120, 1290], [1120, 1920], [-40, 1920]]); c.fill(); c.globalAlpha = 1;
      const gl = seg(u, .45, .8) * (.85 + .15 * Math.sin(u * 3.2));
      if (gl > 0) { g = c.createRadialGradient(540, 968, 0, 540, 968, 330); g.addColorStop(0, `rgba(62,230,255,${(.42 * gl).toFixed(3)})`); g.addColorStop(.55, `rgba(62,230,255,${(.1 * gl).toFixed(3)})`); g.addColorStop(1, 'rgba(62,230,255,0)');
        c.save(); c.translate(540, 968); c.scale(1, 300 / 330); c.translate(-540, -968); c.fillStyle = g; c.beginPath(); c.arc(540, 968, 330, 0, TAU); c.fill(); c.restore(); }
      g = c.createLinearGradient(0, 1070, 0, 1920); g.addColorStop(0, '#1b1f4a'); g.addColorStop(.35, '#11143a'); g.addColorStop(1, '#07081a');
      c.fillStyle = g; poly(c, [[-40, 1920], [-40, 1300], [120, 1150], [170, 1070], [700, 1070], [760, 1150], [960, 1260], [1120, 1340], [1120, 1920]]); c.fill();
      c.lineCap = 'round'; c.strokeStyle = '#3ee6ff'; c.globalAlpha = .8; c.lineWidth = 5; c.beginPath(); c.moveTo(170, 1070); c.lineTo(700, 1070); c.stroke();
      c.globalAlpha = .35; c.lineWidth = 3; c.beginPath(); c.moveTo(120, 1150); c.lineTo(170, 1070); c.moveTo(700, 1070); c.lineTo(760, 1150); c.stroke(); c.globalAlpha = 1;
    }
    const icon = mk(root, 'div', 'abs eca-icon', 'left:440px;top:868px;opacity:0;transform-origin:100px 100px');
    const img = mk(icon, 'img', '', ''); img.src = o.icon || KIT + 'assets/icon.png'; img.alt = '';
    const shine = mk(icon, 'div', 'abs eca-shine', 'opacity:0');
    const can = mk(root, 'canvas', '', 'position:absolute;left:0;top:0;width:1080px;height:1920px'); can.width = 1080; can.height = 1920; can.dataset.name = 'canvas: end-card ninja';
    const ctx = can.getContext('2d', { willReadFrequently: true });
    const head = S.kin(root, '<div data-max="112"><i class="cy">DOWNLOAD</i></div><div data-max="176">SUMMITLY</div>', { top: 540 });
    const sub = mk(root, 'div', 'abs eca-sub', 'left:130px;width:600px;top:1094px;opacity:0', 'FREE ON THE APP STORE');
    const chip = mk(root, 'div', 'abs eca-chip', 'left:130px;width:600px;top:1160px;opacity:0', '<span class="chip dark" style="font-size:38px">SEARCH <b>"SUMMITLY"</b></span>');
    const FEET = 1070, NX = 250, NS = .52;
    const tl = S.ninja.timeline([[0, 'jump', { ph: 0, flip: true }], [.62, 'crouch', {}, .06], [.8, 'ready', {}, .14], [.95, 'flourish', { aim: 6 }, .1]]);
    const tr = S.track([[.12, -90, FEET, NS, 0], [.62, NX, FEET, NS, 190], [9, NX, FEET, NS, 0]]);
    function ec(t, t0) {
      const u = t - t0;
      if (u < -.05) { root.style.opacity = '0'; edge.style.opacity = '0'; return; }
      // katana-slash wipe: the card is revealed behind a slanted blade edge sweeping left -> right
      const k = ioC(seg(u, 0, .32)), X = lerp(-300, 1420, k), SL = 300;
      root.style.opacity = '1';
      root.style.clipPath = `polygon(-20px -20px, ${(X + SL).toFixed(1)}px -20px, ${(X - SL).toFixed(1)}px 1940px, -20px 1940px)`;
      const eop = u < .34 ? 1 - seg(u, .3, .34) : 0;
      edge.style.opacity = eop.toFixed(3);
      edge.style.transform = `translate(${Math.round(X - 540)}px,0px) rotate(${(-Math.atan2(1920, 2 * SL) / D2R).toFixed(2)}deg)`;
      // decor
      drawDeco(t, u);
      // icon pops in with overshoot at .50, a light bump when the blade points at it
      const ip = oBack(seg(u, .5, .85), 2.2), bump = .06 * tri(u, 1.7, 1.95);
      icon.style.opacity = (u >= .5 ? 1 : 0) + '';
      icon.style.transform = `scale(${Math.max(.001, ip + bump).toFixed(4)})`;
      const sh = seg(u, 1.72, 2.12);
      shine.style.opacity = (sh > 0 && sh < 1 ? 1 : 0) + '';
      shine.style.transform = `translate(${Math.round(lerp(-120, 260, sh))}px,0px) rotate(20deg)`;
      // ninja
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, 1080, 1920);
      const p = tr(Math.max(0, u));
      const J = u < .62 ? S.ninja.POSE.jump(u, { ph: Math.max(0, p.air), flip: true }) : tl(u);
      if (u >= .12) S.ninja.draw(ctx, S.ninja.pose(t, Object.assign({ J, ground: FEET, look: u > 1.7 ? [6, 2] : [0, 0] }, p)));
      S.sparks(ctx, t, t0 + .62, NX, FEET - 4, { n: 10, seed: 21, speed: 520, dir: -PI / 2, spread: 2.2, life: .35, g: 1400 });
      S.sparks(ctx, t, t0 + 1.72, 428, 945, { n: 12, seed: 23, speed: 560, dir: -1.2, spread: 1.6, life: .32, g: 300 });
      // words
      S.kinShow(head, t, t0 + .4, 1e9, { beats: [t0 + .4, t0 + .8], style: 'slam' });
      const sp = seg(u, 1.55, 1.85);
      sub.style.opacity = (u >= 1.55 ? clamp(sp * 3) : 0).toFixed(3); sub.style.clipPath = `inset(-20% ${((1 - oC(sp)) * 100).toFixed(1)}% -20% -2%)`;
      sub.style.transform = `translateY(${Math.round(10 * (1 - oC(sp)))}px)`;
      S.show(chip, t, t0 + 2.05, 1e9, { dy: 18 });
    }
    ec.seek = ec; ec.dur = dur; ec.el = root;
    return ec;
  }

  /* ---------------------------------------------------------------- appPhone: a REAL app screenshot, held up
   * appPhone(stage, {src, x, y, w, h, chin, crop:{x, y, s}}) -> { el, seek(t, {in, out, pan:[dx, dy], panAt:[a, b]}) }
   *   Body at (x, y), w × (h + chin) px; the screen window is w-28 × h px; the screenshot is drawn at scale crop.s with
   *   its pixel (crop.x, crop.y) at the window's top-left (zoomed onto the key element). The chin carries a home button,
   *   so the screen ends above y + h + 14 (keep that above 1260: the screenshot's words stay inside the safe zone).
   *   Enters with a short rise + fade at `in`, leaves at `out` (no scaling of the screenshot). Tagged data-words.
   *   Create it AFTER the world canvas so the ninja (hand on its edge) passes behind it. */
  function appPhone(st, o = {}) {
    const x = o.x == null ? 150 : o.x, y = o.y == null ? 540 : o.y, w = o.w || 470, h = o.h || 620, chin = o.chin == null ? 96 : o.chin;
    const cr = Object.assign({ x: 0, y: 0, s: 1 }, o.crop || {});
    const ph = mk(st, 'div', 'abs sp-phone', `left:${x}px;top:${y}px;width:${w}px;height:${h + 28 + chin}px;opacity:0`,
      `<div class="sc" style="left:14px;top:14px;width:${w - 28}px;height:${h}px;border-radius:44px 44px 18px 18px"><img src="${o.src}" alt="" style="width:${Math.round((o.imgW || 880) * cr.s)}px"></div>` +
      `<div class="isl" style="left:${Math.round(w / 2 - 50)}px;top:26px;width:100px"></div><div class="hb" style="left:${Math.round(w / 2 - 29)}px;top:${h + 14 + Math.round((chin - 58) / 2) + 6}px"></div>`);
    ph.dataset.words = 'screenshot';
    const im = ph.querySelector('img');
    return {
      el: ph,
      seek(t, s = {}) {
        const a = s.in == null ? -1 : s.in, b = s.out == null ? 1e9 : s.out;
        const pin = seg(t, a, a + .3), pout = seg(t, b, b + .25);
        ph.style.opacity = (t < a || t > b + .25 ? 0 : clamp(pin * 2.5) * (1 - pout)).toFixed(3);
        ph.style.transform = `translate(0px,${Math.round(60 * (1 - oBack(pin, 1.4)) + 40 * iC(pout))}px)`;
        const pk = s.panAt ? io(seg(t, s.panAt[0], s.panAt[1])) : 0, pan = s.pan || [0, 0];
        im.style.transform = `translate(${Math.round(-cr.x * cr.s + pan[0] * pk)}px,${Math.round(-cr.y * cr.s + pan[1] * pk)}px)`;
      }
    };
  }

  Object.assign(S, { endCardApp, appPhone });
})();

/* ---------------------------------------------------------------- stick.js EXTENSIONS 3 (videos 5–7; appended, additive)
 *   props   monster(ctx, x, y, s, t, o)   THE TASK MONSTER (procrastination): feet at x,y, ~460*s tall
 *           timer(ctx, x, y, s, k, o)      big round focus timer (ring remaining = k, centre label)
 *           link(ctx, x, y, ang, s, face, o) / chain(ctx, P, n, s, o)   chain links along a path P(u) -> [x, y]
 *           block(ctx, x, y, w, h, label, o)   snap-together habit brick (bottom-centre x,y) with studs + icon (cup brush book stretch check plus)
 *           note(ctx, x, y, s, rot, label)     sticky note    chips(ctx, x, y, s, rot)    mail(ctx, x, y, s, rot)
 *           mug(ctx, x, y, s)   brush(ctx, x, y, s, rot)   cutters(ctx, x, y, s, rot, open)   qmark(ctx, x, y, s, op)
 *   poses   hide {face} (crouched behind cover, peeking)   eat (snacking)   sweep (wiping a desk)   pushup
 *   envs    'kitchen' (counter x 380–1100 top y 1250, window, coffee machine)   'bath' (mirror, sink counter y 1250)
 */
(function () {
  'use strict';
  const S = window.Stick; if (!S) return;
  const { clamp, seg, oC, iC, io, oBack, lerp, tri, hash, C } = S;
  const PI = Math.PI, TAU = 2 * PI, D2R = PI / 180, H0 = -172;
  const stand = (o = {}) => Object.assign({ hip: [0, H0], lean: .04, tilt: 0, hr: [22, -150], hl: [-12, -152], fr: [24, 0], fl: [-24, 0], tail: .3, face: 'n' }, o);

  Object.assign(S.ninja.POSE, {
    hide: (u, a) => { const b = Math.sin(u * 9) * 2; return stand({ hip: [0, -104 + b], lean: .16, tilt: -.1, hr: [70, -214], hl: [50, -206], fr: [66, 0], fl: [-56, 0], face: a.face || 'w', tail: .15 }); },
    eat: (u, a) => { const c = Math.max(0, Math.sin(u * 11)); return stand({ lean: .02, tilt: -.06, hr: [lerp(60, 34, c), lerp(-210, -330, c)], hl: [56, -200], face: a.face || 'h', tail: .3, elbowOut: 0 }); },
    sweep: (u, a) => { const s = Math.sin(u * 16); return stand({ hip: [0, H0 + 8], lean: .3, tilt: .1, hr: [150 + 70 * s, -250], hl: [60, -180], fr: [50, 0], fl: [-50, 0], face: a.face || 'd', tail: .7 }); },
    pushup: (u, a) => { const k = .5 - .5 * Math.cos(u * TAU / .9);
      return { hip: [-150, lerp(-112, -64, k)], lean: lerp(1.2, 1.36, k), tilt: -.25, hr: [26, 0], hl: [8, 0], fr: [-300, 0], fl: [-312, 0], tail: .3, face: a.face || 'd', kneeBack: 1, elbowOut: 1 }; },
  });

  /* THE TASK MONSTER. o: {mood:'roar'|'grin'|'shock'|'cute', roar 0..1 (mouth), label ('TASK' — a word prop), fx, op, hop} */
  function monster(ctx, x, y, s, t, o = {}) {
    const mood = o.mood || 'grin', roar = o.roar || 0, br = 1 + .03 * Math.sin(t * 3.1);
    ctx.save(); ctx.globalAlpha = o.op == null ? 1 : o.op; ctx.translate(x, y); ctx.scale(s * (o.fx || 1) * br, s / br);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    // legs
    ctx.fillStyle = '#2a0c2a'; [-90, 90].forEach(lx => { ctx.beginPath(); ctx.roundRect(lx - 40, -80, 80, 80, 20); ctx.fill(); });
    // arms (claws up when roaring)
    const ra = roar * 1;
    ctx.strokeStyle = '#3d1240'; ctx.lineWidth = 34;
    [-1, 1].forEach(k => { const sx = 170 * k, ex = (230 + 40 * ra) * k, ey = lerp(-140, -420, ra) + 10 * Math.sin(t * 4 + k);
      ctx.beginPath(); ctx.moveTo(sx, -250); ctx.quadraticCurveTo((sx + ex) / 2 + 30 * k, (ey - 250) / 2 + 40, ex, ey); ctx.stroke();
      ctx.fillStyle = '#ffd36b'; for (let c = -1; c <= 1; c++) { ctx.save(); ctx.translate(ex, ey); ctx.rotate((c * .4 - (ra > .5 ? PI / 2 : 0)) * k); ctx.beginPath(); ctx.moveTo(-8, -6); ctx.lineTo(0, -40); ctx.lineTo(8, -6); ctx.fill(); ctx.restore(); } });
    // body
    const g = ctx.createLinearGradient(0, -470, 0, -40); g.addColorStop(0, '#7a1f5c'); g.addColorStop(1, '#2e0a2e');
    ctx.fillStyle = g; ctx.strokeStyle = '#12040f'; ctx.lineWidth = 10;
    ctx.beginPath(); ctx.moveTo(-200, -60); ctx.bezierCurveTo(-250, -260, -190, -470, 0, -470); ctx.bezierCurveTo(190, -470, 250, -260, 200, -60); ctx.quadraticCurveTo(0, -20, -200, -60); ctx.fill(); ctx.stroke();
    // horns
    ctx.fillStyle = '#e8d9ff'; [-1, 1].forEach(k => { ctx.beginPath(); ctx.moveTo(90 * k, -440); ctx.quadraticCurveTo(170 * k, -520, 150 * k, -590); ctx.quadraticCurveTo(120 * k, -510, 40 * k, -458); ctx.fill(); });
    // eyes
    const E = mood === 'cute' ? [[-70, -340, 44], [70, -340, 44]] : [[-90, -350, 30], [0, -380, 36], [90, -350, 30]];
    E.forEach(([ex, ey, r]) => {
      ctx.fillStyle = mood === 'cute' ? '#fff' : '#ffe36b'; ctx.beginPath(); ctx.arc(ex, ey, r, 0, TAU); ctx.fill();
      ctx.fillStyle = '#12040f';
      if (mood === 'cute') { ctx.beginPath(); ctx.arc(ex + 6, ey + 6, r * .55, 0, TAU); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ex + 14, ey - 4, r * .18, 0, TAU); ctx.fill(); }
      else if (mood === 'shock') { ctx.beginPath(); ctx.arc(ex, ey, r * .3, 0, TAU); ctx.fill(); }
      else { ctx.beginPath(); ctx.ellipse(ex, ey, r * .22, r * .8, 0, 0, TAU); ctx.fill(); }
    });
    if (mood !== 'cute' && mood !== 'shock') { ctx.fillStyle = '#12040f'; E.forEach(([ex, ey, r], i) => { ctx.save(); ctx.translate(ex, ey - r * .7); ctx.rotate(i === 0 ? .4 : i === 2 ? -.4 : 0); ctx.fillRect(-r - 4, -r * .45, 2 * r + 8, r * .45); ctx.restore(); }); }
    // mouth
    if (mood === 'cute') { ctx.strokeStyle = '#12040f'; ctx.lineWidth = 9; ctx.beginPath(); ctx.arc(0, -262, 30, PI * .15, PI * .85); ctx.stroke(); ctx.fillStyle = '#ff8fb1'; ctx.globalAlpha *= .6; [-120, 120].forEach(cx => { ctx.beginPath(); ctx.arc(cx, -280, 22, 0, TAU); ctx.fill(); }); ctx.globalAlpha = o.op == null ? 1 : o.op; }
    else {
      const mh = mood === 'shock' ? 50 : 26 + 90 * roar;
      ctx.fillStyle = '#12040f'; ctx.beginPath(); ctx.ellipse(0, -250, 120, mh, 0, 0, PI); ctx.lineTo(-120, -250); ctx.fill();
      ctx.fillStyle = '#fff6ea'; for (let i = -4; i <= 4; i++) { ctx.beginPath(); ctx.moveTo(i * 26 - 12, -250); ctx.lineTo(i * 26, -250 + 26 + 10 * roar); ctx.lineTo(i * 26 + 12, -250); ctx.fill(); }
      if (roar > .3) { ctx.fillStyle = '#ff5c8a'; ctx.beginPath(); ctx.ellipse(0, -250 + mh * .7, 50, 18 * roar, 0, 0, TAU); ctx.fill(); }
    }
    // belly label (a word prop): plate + text
    if (o.label) {
      ctx.fillStyle = '#12040f'; ctx.beginPath(); ctx.roundRect(-110, -180, 220, 92, 18); ctx.fill();
      ctx.font = '800 82px BS'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#ffb36b'; ctx.fillText(o.label, 0, -132);
    }
    ctx.restore();
  }

  /* big round timer: ring remaining k (1 full -> 0), label in the centre (e.g. '10:00') */
  function timer(ctx, x, y, s, k, o = {}) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineCap = 'butt'; ctx.lineJoin = 'miter';
    ctx.fillStyle = '#0d1330'; ctx.beginPath(); ctx.arc(0, 0, 170, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#3ee6ff'; ctx.lineWidth = 4; ctx.globalAlpha = .5; ctx.beginPath(); ctx.arc(0, 0, 170, 0, TAU); ctx.stroke(); ctx.globalAlpha = 1;
    for (let i = 0; i < 60; i++) { const a = i * TAU / 60; ctx.strokeStyle = i % 5 ? 'rgba(255,255,255,.25)' : 'rgba(255,255,255,.6)'; ctx.lineWidth = i % 5 ? 3 : 6; ctx.beginPath(); ctx.moveTo(150 * Math.cos(a), 150 * Math.sin(a)); ctx.lineTo((i % 5 ? 140 : 132) * Math.cos(a), (i % 5 ? 140 : 132) * Math.sin(a)); ctx.stroke(); }
    ctx.lineCap = 'round'; ctx.strokeStyle = '#26305e'; ctx.lineWidth = 18; ctx.beginPath(); ctx.arc(0, 0, 112, 0, TAU); ctx.stroke();
    if (k > 0) { ctx.strokeStyle = '#3ee6ff'; ctx.beginPath(); ctx.arc(0, 0, 112, -PI / 2, -PI / 2 + TAU * clamp(k)); ctx.stroke();
      const a = -PI / 2 + TAU * clamp(k); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(112 * Math.cos(a), 112 * Math.sin(a), 12, 0, TAU); ctx.fill(); }
    ctx.fillStyle = '#fff'; ctx.fillRect(-18, -200, 36, 26); ctx.fillRect(-30, -212, 60, 14);
    if (o.label) { ctx.font = `800 ${o.size || 96}px BS`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#fff'; ctx.fillText(o.label, 0, 6); }
    ctx.restore();
  }

  /* chain link at x,y oriented along ang (radians); face: true = ring seen face-on, false = edge-on bar */
  function link(ctx, x, y, ang, s, face, o = {}) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s); ctx.globalAlpha *= o.op == null ? 1 : o.op; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const col = o.col || '#ffd36b', dark = o.dark || '#6a4a10';
    if (face) {
      ctx.lineWidth = 20; ctx.strokeStyle = dark; ctx.beginPath(); ctx.roundRect(-46, -26, 92, 52, 26); ctx.stroke();
      ctx.lineWidth = 12; ctx.strokeStyle = col; ctx.beginPath(); ctx.roundRect(-46, -26, 92, 52, 26); ctx.stroke();
      ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.beginPath(); ctx.moveTo(-30, -26); ctx.lineTo(20, -26); ctx.stroke();
    } else {
      ctx.fillStyle = dark; ctx.beginPath(); ctx.roundRect(-50, -11, 100, 22, 11); ctx.fill();
      ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(-46, -7, 92, 14, 7); ctx.fill();
    }
    if (o.glow) { ctx.globalAlpha *= o.glow; ctx.strokeStyle = '#fff'; ctx.lineWidth = 6; ctx.beginPath(); ctx.roundRect(-52, -32, 104, 64, 32); ctx.stroke(); }
    ctx.restore();
  }
  /* chain along a path P(u) (u 0..1 -> [x, y]): n links (fractional n: the last one forges in), spacing ~ 78*s */
  function chain(ctx, P, n, s, o = {}) {
    const full = Math.floor(n), fr = n - full;
    for (let i = 0; i < full + (fr > 0 ? 1 : 0); i++) {
      const u = (i + .5) / Math.max(1, o.total || Math.ceil(n)), p = P(u), q = P(Math.min(1, u + .01)), r = P(Math.max(0, u - .01));
      const ang = Math.atan2(q[1] - r[1], q[0] - r[0]);
      const k = i === full ? oBack(fr, 2.4) : 1;
      if (k <= 0) continue;
      link(ctx, p[0], p[1] - (i === full ? 60 * (1 - oC(fr)) : 0), ang, s * k, i % 2 === 0, { col: o.col, dark: o.dark, glow: o.glowAt != null ? tri(o.glowAt, i * .06, i * .06 + .3) : (i === full ? 1 - fr : 0), op: o.op });
    }
  }

  /* habit brick: bottom-centre x,y, size w×h, label (word prop), o: {col, dark, icon:'cup'|'brush'|'book'|'stretch', studs, size} */
  function block(ctx, x, y, w, h, label, o = {}) {
    const col = o.col || '#3ee6ff', dark = o.dark || '#0e5a6a';
    ctx.save(); ctx.translate(x, y); if (o.rot) ctx.rotate(o.rot * D2R); if (o.sc) ctx.scale(o.sc, o.sc);
    ctx.globalAlpha *= o.op == null ? 1 : o.op;
    const ns = o.studs == null ? Math.max(2, Math.round(w / 130)) : o.studs;
    for (let i = 0; i < ns; i++) { const sx = -w / 2 + w * (i + .5) / ns; ctx.fillStyle = dark; ctx.beginPath(); ctx.roundRect(sx - 30, -h - 22, 60, 30, 8); ctx.fill(); ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(sx - 26, -h - 20, 52, 22, 7); ctx.fill(); }
    ctx.fillStyle = dark; ctx.beginPath(); ctx.roundRect(-w / 2, -h, w, h, 14); ctx.fill();
    ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(-w / 2 + 6, -h + 6, w - 12, h - 20, 10); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(-w / 2 + 16, -h + 12, w - 32, 6);
    let tx = 0;
    if (o.icon) { tx = 34; if (label) icon(ctx, o.icon, -w / 2 + 52, -h / 2 - 6, h / 120); else icon(ctx, o.icon, 0, -h / 2 - 6, h / 95); }
    if (label) { let fs = o.size || Math.round(h * .5); ctx.font = `800 ${fs}px BS`; while (ctx.measureText(label).width > w - (o.icon ? 120 : 40) && fs > 20) { fs -= 2; ctx.font = `800 ${fs}px BS`; }
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = o.ink || '#0b1026'; ctx.fillText(label, tx, -h / 2 - 6); }
    ctx.restore();
  }
  function icon(ctx, kind, x, y, s) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0b1026'; ctx.fillStyle = '#0b1026'; ctx.lineWidth = 7;
    if (kind === 'cup') { ctx.beginPath(); ctx.moveTo(-22, -16); ctx.lineTo(-18, 22); ctx.lineTo(16, 22); ctx.lineTo(20, -16); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.arc(24, 2, 11, -PI / 2, PI / 2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-6, -26); ctx.quadraticCurveTo(-12, -34, -4, -42); ctx.moveTo(8, -26); ctx.quadraticCurveTo(2, -34, 10, -42); ctx.stroke(); }
    else if (kind === 'brush') { ctx.save(); ctx.rotate(-.6); ctx.fillRect(-34, -5, 52, 10); ctx.fillRect(14, -16, 22, 12); ctx.restore(); }
    else if (kind === 'book') { ctx.beginPath(); ctx.moveTo(0, -18); ctx.lineTo(-30, -24); ctx.lineTo(-30, 22); ctx.lineTo(0, 28); ctx.lineTo(30, 22); ctx.lineTo(30, -24); ctx.closePath(); ctx.fill(); }
    else if (kind === 'check') { ctx.lineWidth = 11; ctx.beginPath(); ctx.moveTo(-24, 0); ctx.lineTo(-6, 18); ctx.lineTo(26, -18); ctx.stroke(); }
    else if (kind === 'plus') { ctx.lineWidth = 11; ctx.beginPath(); ctx.moveTo(-22, 0); ctx.lineTo(22, 0); ctx.moveTo(0, -22); ctx.lineTo(0, 22); ctx.stroke(); }
    else if (kind === 'stretch') { ctx.beginPath(); ctx.arc(0, -26, 9, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(-26, -34); ctx.lineTo(0, -12); ctx.lineTo(26, -34); ctx.moveTo(0, -12); ctx.lineTo(0, 10); ctx.lineTo(-18, 32); ctx.moveTo(0, 10); ctx.lineTo(18, 32); ctx.stroke(); }
    ctx.restore();
  }
  function note(ctx, x, y, s, rot, label, o = {}) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot * D2R); ctx.scale(s, s);
    ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillRect(-86, -76, 180, 170);
    ctx.fillStyle = o.col || '#ffe36b'; ctx.fillRect(-92, -86, 180, 170); ctx.fillStyle = 'rgba(0,0,0,.08)'; ctx.fillRect(-92, -86, 180, 26);
    if (label) { ctx.font = `800 ${o.size || 50}px BS`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#2a1a0a'; String(label).split('\n').forEach((l, i, A) => ctx.fillText(l, -2, 6 + (i - (A.length - 1) / 2) * (o.size || 50) * .95)); }
    ctx.restore();
  }
  function chips(ctx, x, y, s, rot) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot * D2R); ctx.scale(s, s);
    ctx.fillStyle = '#ff5a4f'; ctx.beginPath(); ctx.moveTo(-40, -60); ctx.lineTo(40, -60); ctx.lineTo(46, 60); ctx.lineTo(-46, 60); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffe36b'; ctx.beginPath(); ctx.arc(0, 4, 24, 0, TAU); ctx.fill(); ctx.fillStyle = '#c23a30'; ctx.fillRect(-42, -64, 84, 12); ctx.fillRect(-46, 54, 92, 12);
    ctx.restore();
  }
  function mail(ctx, x, y, s, rot) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot * D2R); ctx.scale(s, s); ctx.lineCap = 'butt';
    ctx.fillStyle = '#e9f1ff'; ctx.beginPath(); ctx.roundRect(-48, -32, 96, 64, 8); ctx.fill();
    ctx.strokeStyle = '#5d8cff'; ctx.lineWidth = 6; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(-44, -28); ctx.lineTo(0, 6); ctx.lineTo(44, -28); ctx.stroke();
    ctx.restore();
  }
  function mug(ctx, x, y, s) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineCap = 'butt';
    ctx.fillStyle = '#ffb36b'; ctx.beginPath(); ctx.roundRect(-34, -80, 68, 80, [6, 6, 16, 16]); ctx.fill();
    ctx.strokeStyle = '#ffb36b'; ctx.lineWidth = 11; ctx.beginPath(); ctx.arc(38, -44, 18, -PI / 2, PI / 2); ctx.stroke();
    ctx.fillStyle = '#5a2e14'; ctx.beginPath(); ctx.ellipse(0, -78, 30, 7, 0, 0, TAU); ctx.fill();
    ctx.restore();
  }
  function brush(ctx, x, y, s, rot) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot * D2R); ctx.scale(s, s);
    ctx.fillStyle = '#3ee6ff'; ctx.beginPath(); ctx.roundRect(-70, -7, 120, 14, 7); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.fillRect(34, -26, 36, 19); ctx.fillStyle = '#9fe9ff'; for (let i = 0; i < 5; i++) ctx.fillRect(36 + i * 7, -32, 4, 8);
    ctx.restore();
  }
  function cutters(ctx, x, y, s, rot, open) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot * D2R); ctx.scale(s, s); ctx.lineCap = 'round';
    const a = (open == null ? .3 : open) * .5;
    [-1, 1].forEach(k => { ctx.save(); ctx.rotate(k * a); ctx.strokeStyle = '#ff5a4f'; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-150, 14 * k); ctx.stroke();
      ctx.fillStyle = '#9aa3b8'; ctx.beginPath(); ctx.moveTo(0, -4 * k); ctx.lineTo(70, -18 * k); ctx.lineTo(78, 2 * k); ctx.lineTo(0, 10 * k); ctx.fill(); ctx.restore(); });
    ctx.fillStyle = '#2a2f55'; ctx.beginPath(); ctx.arc(0, 0, 10, 0, TAU); ctx.fill();
    ctx.restore();
  }
  function qmark(ctx, x, y, s, op) {
    if (op <= 0) return; ctx.save(); ctx.globalAlpha = op; ctx.translate(x, y); ctx.scale(s, s); ctx.lineJoin = 'round';
    ctx.font = '800 110px BS'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineWidth = 10; ctx.strokeStyle = '#0b1026'; ctx.strokeText('?', 0, 0); ctx.fillStyle = '#ffe36b'; ctx.fillText('?', 0, 0); ctx.restore();
  }
  Object.assign(S, { monster, timer, link, chain, block, note, chips, mail, mug, brush, cutters, qmark, icon });

  // ---- envs 'kitchen' and 'bath' (same contract as env(): world coords, floor y 1500, tagged data-bg, darker caption band)
  const env0 = S.env; let n3 = 0;
  S.env = function (parent, kind, opt = {}) {
    if (kind !== 'kitchen' && kind !== 'bath') return env0(parent, kind, opt);
    const id = 'e3_' + (n3++) + '_', F = opt.floor || S.FLOOR, NS = 'http://www.w3.org/2000/svg';
    const d = document.createElement('div'); d.className = 'full'; d.setAttribute('style', 'position:absolute;transform-origin:0 0;opacity:0;visibility:hidden'); d.dataset.bg = 'env';
    parent.appendChild(d);
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('width', 2160); s.setAttribute('height', 3840); s.setAttribute('viewBox', '-540 -960 2160 3840');
    s.setAttribute('style', 'position:absolute;left:-540px;top:-960px;overflow:visible');
    const defs = `<linearGradient id="${id}dim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a0b1e" stop-opacity=".88"/><stop offset=".8" stop-color="#0a0b1e" stop-opacity=".6"/><stop offset="1" stop-color="#0a0b1e" stop-opacity="0"/></linearGradient>
<linearGradient id="${id}f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c1a34"/><stop offset="1" stop-color="#07060f"/></linearGradient>
<radialGradient id="${id}l"><stop offset="0" stop-color="#ffcf9a" stop-opacity=".5"/><stop offset="1" stop-color="#ffcf9a" stop-opacity="0"/></radialGradient>`;
    let inner;
    if (kind === 'kitchen') {
      const tiles = Array.from({ length: 12 }, (_, i) => Array.from({ length: 4 }, (_, j) => `<rect x="${-500 + i * 180}" y="${1010 + j * 60}" width="176" height="56" rx="6" fill="#1f2a50" opacity="${.5 + .3 * hash(i * 7 + j)}"/>`).join('')).join('');
      inner = `<rect x="-540" y="-960" width="2160" height="${F + 960}" fill="#16183a"/>${tiles}
<g transform="translate(60 560)"><rect x="0" y="0" width="320" height="380" rx="14" fill="#2a3a7a" stroke="#2c2752" stroke-width="18"/><circle cx="230" cy="110" r="46" fill="#ffe2a8"/><path d="M0 330 L90 240 L170 300 L240 230 L320 300 L320 380 L0 380Z" fill="#1b1846"/><line x1="160" y1="0" x2="160" y2="380" stroke="#2c2752" stroke-width="10"/></g>
<ellipse cx="760" cy="1150" rx="420" ry="300" fill="url(#${id}l)"/>
<line x1="760" y1="-960" x2="760" y2="760" stroke="#2c2752" stroke-width="6"/><path d="M690 760 L830 760 L800 820 L720 820Z" fill="#ffb36b"/>
<rect x="380" y="1250" width="760" height="${F - 1250}" fill="#232a55"/><rect x="370" y="1236" width="780" height="22" rx="6" fill="#3a4680"/><rect x="370" y="1236" width="780" height="5" fill="#ffb36b" opacity=".5"/>
${[430, 620, 810, 1000].map(x => `<rect x="${x}" y="1286" width="170" height="${F - 1310}" rx="8" fill="#1b2148"/><rect x="${x + 70}" y="1300" width="30" height="8" rx="4" fill="#ffb36b" opacity=".7"/>`).join('')}
<g transform="translate(980 1236)"><rect x="-70" y="-190" width="140" height="190" rx="14" fill="#2c3366"/><rect x="-50" y="-170" width="100" height="40" rx="8" fill="#0d1124"/><circle cx="-20" cy="-150" r="6" fill="#5dffa8"/><rect x="-30" y="-110" width="60" height="16" rx="4" fill="#141a33"/></g>
<rect x="-540" y="-960" width="2160" height="${950 + 960}" fill="url(#${id}dim)"/>
<rect x="-540" y="${F}" width="2160" height="1500" fill="url(#${id}f)"/><line x1="-540" y1="${F}" x2="1620" y2="${F}" stroke="#ffb36b" stroke-width="3" opacity=".35"/>
${Array.from({ length: 11 }, (_, i) => `<line x1="${-540 + i * 220}" y1="${F + 2}" x2="${-640 + i * 260}" y2="${F + 700}" stroke="#1a1630" stroke-width="3"/>`).join('')}`;
    } else {
      const tiles = Array.from({ length: 14 }, (_, i) => Array.from({ length: 12 }, (_, j) => `<rect x="${-520 + i * 150}" y="${560 + j * 80}" width="146" height="76" rx="4" fill="#1d3a4a" opacity="${.35 + .25 * hash(i * 3 + j * 11)}"/>`).join('')).join('');
      inner = `<rect x="-540" y="-960" width="2160" height="${F + 960}" fill="#0f2230"/>${tiles}
<rect x="600" y="760" width="360" height="400" rx="26" fill="#2b4a60" stroke="#8fb8c8" stroke-width="12"/><path d="M640 800 L760 800 L640 920Z" fill="#fff" opacity=".12"/>
<ellipse cx="780" cy="700" rx="160" ry="40" fill="url(#${id}l)"/><rect x="700" y="700" width="160" height="16" rx="8" fill="#ffe2a8"/>
<rect x="560" y="1250" width="440" height="${F - 1250}" fill="#203848"/><rect x="540" y="1232" width="480" height="24" rx="8" fill="#e9f1ff"/><ellipse cx="780" cy="1244" rx="110" ry="8" fill="#9fb8c8"/>
<rect x="770" y="1196" width="20" height="40" rx="6" fill="#c9d6e0"/><rect x="770" y="1196" width="56" height="12" rx="6" fill="#c9d6e0"/>
<rect x="60" y="900" width="26" height="320" rx="8" fill="#3a5a70"/><rect x="20" y="920" width="110" height="250" rx="16" fill="#ff7a59" opacity=".8"/>
<rect x="-540" y="-960" width="2160" height="${950 + 960}" fill="url(#${id}dim)"/>
<rect x="-540" y="${F}" width="2160" height="1500" fill="url(#${id}f)"/><line x1="-540" y1="${F}" x2="1620" y2="${F}" stroke="#3ee6ff" stroke-width="3" opacity=".35"/>
${Array.from({ length: 12 }, (_, i) => `<line x1="${-540 + i * 200}" y1="${F}" x2="${-540 + i * 200}" y2="${F + 700}" stroke="#0c1820" stroke-width="3"/>`).join('')}`;
    }
    s.innerHTML = `<defs>${defs}</defs>${inner}`;
    d.appendChild(s);
    return { el: d, svg: s, kind, floor: F, seek() {} };
  };
})();

/* ---------------------------------------------------------------- stick.js EXTENSIONS 4 (planner channel; appended, additive)
 *   endCardPlanner(stage, {dur}) -> ec ; ec(t, t0) every frame. THE "FREE HABIT TRACKER / LINK IN BIO" END CARD, identical in
 *   every planner-channel video (Changing Habits store). Same katana-slash wipe + navy dawn card as endCardApp, but no app,
 *   no icon, no price: a drawn habit-tracker page (x 430–650, y 850–1080) fills with checks; the ninja lands on the ledge,
 *   twirls and points at it. Words: FREE (cyan) / HABIT TRACKER (y ≈ 540–800), chip "LINK IN BIO" (y ≈ 1120–1200, x 130–730).
 *   Timing (u = t - t0): 0–.32 wipe; .12–.62 leap + land; .45 page pops (put `sting` here); .35/.7 headline; 1.4 chip.
 *   Options (rotating CTA lines): {dur, head: kin html, headTop, beats: [u…] per word, chip: chip html}.
 *   VO (narrator): "Grab the free habit tracker. Link in bio." at t0 + .30. Lasts 3.0 s. Captions must be gone .27 s before t0.
 */
(function () {
  'use strict';
  const S = window.Stick; if (!S) return;
  const { clamp, seg, oC, io, ioC, oBack, lerp, tri, hash } = S;
  const PI = Math.PI, TAU = 2 * PI, D2R = PI / 180;
  const mk = (parent, tag, cls, style, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (style) e.setAttribute('style', style); if (html != null) e.innerHTML = html; parent.appendChild(e); return e; };
  const poly = (c, pts) => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); pts.slice(1).forEach(q => c.lineTo(q[0], q[1])); c.closePath(); };
  function endCardPlanner(st, o = {}) {
    const dur = o.dur || 3.0;
    const edge = mk(st, 'div', 'abs eca-edge', 'opacity:0');
    const root = mk(st, 'div', 'abs full eca', 'opacity:0'); root.dataset.name = 'planner end card';
    const deco = mk(root, 'canvas', '', 'position:absolute;left:0;top:0;width:1080px;height:1920px'); deco.width = 1080; deco.height = 1920; deco.dataset.bg = 'endcard';
    const dctx = deco.getContext('2d', { willReadFrequently: true });
    const STARS = Array.from({ length: 34 }, (_, i) => [hash(i * 3.7) * 1080, 60 + hash(i * 9.1) * 1000, 1.4 + hash(i) * 2]);
    function drawDeco(t, u) {
      const c = dctx; c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, 1080, 1920); c.fillStyle = '#fff';
      STARS.forEach(([x, y, r], i) => { c.globalAlpha = .25 + .35 * Math.sin(t * 1.7 + i * 1.9); c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); });
      c.globalAlpha = 1;
      let g = c.createRadialGradient(540, 1260, 0, 540, 1260, 700); g.addColorStop(0, 'rgba(255,207,154,.5)'); g.addColorStop(1, 'rgba(255,138,92,0)');
      c.save(); c.translate(540, 1260); c.scale(1, 300 / 700); c.translate(-540, -1260); c.fillStyle = g; c.beginPath(); c.arc(540, 1260, 700, 0, TAU); c.fill(); c.restore();
      g = c.createLinearGradient(0, 1110, 0, 1920); g.addColorStop(0, '#4a2f6e'); g.addColorStop(1, '#22184a');
      c.globalAlpha = .9; c.fillStyle = g; poly(c, [[-40, 1330], [150, 1180], [300, 1250], [470, 1120], [640, 1230], [820, 1110], [1120, 1290], [1120, 1920], [-40, 1920]]); c.fill(); c.globalAlpha = 1;
      const gl = seg(u, .4, .75) * (.85 + .15 * Math.sin(u * 3.2));
      if (gl > 0) { g = c.createRadialGradient(540, 965, 0, 540, 965, 330); g.addColorStop(0, `rgba(255,179,107,${(.4 * gl).toFixed(3)})`); g.addColorStop(.55, `rgba(255,179,107,${(.1 * gl).toFixed(3)})`); g.addColorStop(1, 'rgba(255,179,107,0)');
        c.save(); c.translate(540, 965); c.scale(1, 300 / 330); c.translate(-540, -965); c.fillStyle = g; c.beginPath(); c.arc(540, 965, 330, 0, TAU); c.fill(); c.restore(); }
      g = c.createLinearGradient(0, 1070, 0, 1920); g.addColorStop(0, '#1b1f4a'); g.addColorStop(.35, '#11143a'); g.addColorStop(1, '#07081a');
      c.fillStyle = g; poly(c, [[-40, 1920], [-40, 1300], [120, 1150], [170, 1090], [740, 1090], [800, 1150], [960, 1260], [1120, 1340], [1120, 1920]]); c.fill();
      c.lineCap = 'round'; c.strokeStyle = '#3ee6ff'; c.globalAlpha = .8; c.lineWidth = 5; c.beginPath(); c.moveTo(170, 1090); c.lineTo(740, 1090); c.stroke(); c.globalAlpha = 1;
    }
    // the tracker page (no words: a grid that fills with checks), drawn on the figure canvas
    function tracker(c, u) {
      const k = oBack(seg(u, .45, .8), 2.2) + .05 * tri(u, 1.6, 1.85); if (k <= 0) return;
      c.save(); c.translate(540, 1080); c.scale(k, k); c.rotate(.04);
      c.fillStyle = 'rgba(0,0,0,.3)'; c.fillRect(-104, -222, 220, 236);
      c.fillStyle = '#fff6e8'; c.beginPath(); c.roundRect(-112, -232, 216, 232, 14); c.fill();
      c.lineWidth = 4; c.strokeStyle = '#ffb36b'; c.stroke();
      c.fillStyle = '#ffb36b'; c.fillRect(-112, -232, 216, 34);
      c.fillStyle = '#141b3a'; for (let i = 0; i < 6; i++) { c.beginPath(); c.arc(-88 + i * 34, -232, 7, 0, TAU); c.fill(); }
      c.strokeStyle = '#c9bca8'; c.lineWidth = 2.5;
      for (let r = 0; r < 5; r++) for (let q = 0; q < 6; q++) { const x = -96 + q * 32, y = -184 + r * 34; c.strokeRect(x, y, 26, 26);
        const i = r * 6 + q, a = .7 + i * .045, p = seg(u, a, a + .12);
        if (p > 0 && i < 27) { c.save(); c.strokeStyle = i % 4 === 3 ? '#ff6fae' : '#0a9fbd'; c.lineWidth = 5; c.lineCap = 'round'; c.lineJoin = 'round';
          c.beginPath(); c.moveTo(x + 5, y + 14); c.lineTo(x + 5 + 6 * Math.min(1, p * 2), y + 14 + 7 * Math.min(1, p * 2));
          if (p > .5) c.lineTo(x + 11 + 11 * (p - .5) * 2, y + 21 - 17 * (p - .5) * 2); c.stroke(); c.restore(); } }
      c.restore();
    }
    const can = mk(root, 'canvas', '', 'position:absolute;left:0;top:0;width:1080px;height:1920px'); can.width = 1080; can.height = 1920; can.dataset.name = 'canvas: end-card ninja';
    const ctx = can.getContext('2d', { willReadFrequently: true });
    const head = S.kin(root, o.head || '<div data-max="150"><i class="cy">FREE</i></div><div data-max="150">HABIT TRACKER</div>', { top: o.headTop || 540 });
    const chip = mk(root, 'div', 'abs eca-chip', 'left:130px;width:600px;top:1128px;opacity:0', o.chip || '<span class="chip dark" style="font-size:50px">LINK IN <b>BIO</b></span>');
    const FEET = 1090, NX = 250, NS = .52;
    const tl = S.ninja.timeline([[0, 'jump', { ph: 0, flip: true }], [.62, 'crouch', {}, .06], [.8, 'ready', {}, .14], [.9, 'flourish', { aim: 10 }, .1]]);
    const tr = S.track([[.12, -90, FEET, NS, 0], [.62, NX, FEET, NS, 190], [9, NX, FEET, NS, 0]]);
    function ec(t, t0) {
      const u = t - t0;
      if (u < -.05) { root.style.opacity = '0'; edge.style.opacity = '0'; return; }
      const k = ioC(seg(u, 0, .32)), X = lerp(-300, 1420, k), SL = 300;
      root.style.opacity = '1';
      root.style.clipPath = `polygon(-20px -20px, ${(X + SL).toFixed(1)}px -20px, ${(X - SL).toFixed(1)}px 1940px, -20px 1940px)`;
      edge.style.opacity = (u < .34 ? 1 - seg(u, .3, .34) : 0).toFixed(3);
      edge.style.transform = `translate(${Math.round(X - 540)}px,0px) rotate(${(-Math.atan2(1920, 2 * SL) / D2R).toFixed(2)}deg)`;
      drawDeco(t, u);
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, 1080, 1920);
      tracker(ctx, u);
      const p = tr(Math.max(0, u));
      const J = u < .62 ? S.ninja.POSE.jump(u, { ph: Math.max(0, p.air), flip: true }) : tl(u);
      if (u >= .12) S.ninja.draw(ctx, S.ninja.pose(t, Object.assign({ J, ground: FEET, look: u > 1.6 ? [6, 2] : [0, 0] }, p)));
      S.sparks(ctx, t, t0 + .62, NX, FEET - 4, { n: 10, seed: 21, speed: 520, dir: -PI / 2, spread: 2.2, life: .35, g: 1400 });
      S.sparks(ctx, t, t0 + 1.62, 440, 960, { n: 12, seed: 23, speed: 560, dir: -1.2, spread: 1.6, life: .32, g: 300 });
      S.kinShow(head, t, t0 + .35, 1e9, { beats: o.beats ? o.beats.map(b => t0 + b) : [t0 + .35, t0 + .62, t0 + .85], style: 'slam' });
      S.show(chip, t, t0 + 1.4, 1e9, { pop: true });
    }
    ec.seek = ec; ec.dur = dur; ec.el = root;
    return ec;
  }
  Object.assign(S, { endCardPlanner });
})();
