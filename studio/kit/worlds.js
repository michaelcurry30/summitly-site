/* ==== SUMMIT NINJA worlds + FX kit (EP2/EP4 agent). Load after kit/summit.js:  <script src="kit/worlds.js"></script>
 * Everything is a canvas painter and a pure function of its arguments (no state between frames). World units are
 * the 1080x1920 stage; paint under the camera (ctx.setTransform from S.cam) — painters cover x -200..1280, y -200..2120
 * so small shakes / zooms never show an edge. Floors sit at y 1268 (the kit's feet line).
 *
 *   const W = Summit.world;
 *   LOCATIONS (paint on a data-bg background canvas):
 *     W.bedroom(ctx, t, { lamp=1 })        messy bedroom at night: window + moon, shelves, desk with lamp (desk top y 1060, x 560–1010)
 *     W.rooftop(ctx, t, { px=0 })          city rooftop at dusk: skyline with lit windows, water tower, ledge; px = skyline parallax px
 *     W.library(ctx, t, { })               warm school library: shelves of spines, arched window, long table (top y 1080, x 160–920)
 *     W.trail(ctx, t, { rain=1, px=0 })    cold rainy mountain trail (blue/grey), rocks, puddles, falling rain
 *     W.night(ctx, t, { k=1 })             near-black teaser sky with faint stars
 *   PROPS (paint on the world canvas):
 *     W.book(ctx, x, y, w, h, rot)         giant hardcover (orange, mountain emblem) centred at x,y
 *     W.bookTower(ctx, x, footY, t, o)     stack of giant books; o: { n=5, lean deg, fall 0..1 (collapse progress), floor (landing y), s }
 *     W.boulder(ctx, x, y, r, t, o)        to-do boulder centred at x,y radius r; o: { broken: [0..1 x3] chunk breakaway, crack 0..1, glow }
 *     W.cliff(ctx, x, top, bottom, t)      climbable rock wall (left edge at x) between y top and bottom, with hand-holds
 *     W.cloud(ctx, x, y, s, t, o)          personal rain cloud (o.rain 0..1, o.dark)
 *     W.zzz(ctx, x, y, t, k)               sleeping Z's (drawn shapes, not text)
 *   FX (world or overlay canvas):
 *     W.focusLines(ctx, cx, cy, t, k, col)     anime radial speed lines converging on cx,cy (k 0..1 strength)
 *     W.streaks(ctx, t, k, dir, col)           horizontal (dir ±1) or vertical (dir ±2) motion streaks across the frame
 *     W.ribbon(ctx, pts, w, col, a)            smear ribbon behind a fast mover (pts = [[x,y],...] newest last)
 *     W.flash(ctx, k, col)                     full-frame impact flash (k 0..1). One or two frames only, never over words.
 *     W.aura(ctx, x, y, s, t, k)               glowing cyan power aura (flame tongues + rising sparks) around a character
 *     W.burst(ctx, x, y, t, t0, o)             light burst: rays + ring (o: { r=420, col, dur=.7, rays=14 })
 *     W.debris(ctx, x, y, t, t0, o)            rock chunks with gravity (o: { n=10, col, s=1, spread=1, up=1 })
 *     W.dust(ctx, x, y, t, t0, s)              landing dust puff
 *     W.poof(ctx, x, y, t, t0, s)              magic smoke puff + sparkles
 *     W.sparkle(ctx, x, y, r, col, a)          4-point star
 *     W.impactStar(ctx, x, y, r, t, col)       comic impact starburst
 *     W.shake(t, HITS) -> {dx, dy}            HITS: [[t0, amp px, dur=.3], ...] deterministic decaying camera shake
 *   TYPE:
 *     W.slam(el, t, times, o)                 per-word slam-in for an S.text headline whose words are wrapped in <span class="w">;
 *                                             times[i] = when word i lands (synced to the VO). o.out = fade-out time.
 *     W.words(str)                            'A B C' -> '<span class="w">A</span> <span class="w">B</span> ...'
 *     W.tilt(el, t, a, o)                     3D tilt-in for a kit phone (call AFTER phone.seek): rotY/rotX ease to 0 by a + o.dur
 */
(function () {
  'use strict';
  const S = window.Summit; if (!S || S.world) return;
  const { clamp, seg, oC, iC, ioC, oBack, lerp, tri, hash } = S, PI = Math.PI;
  const P = d => new Path2D(d);
  const F = (ctx, p, c, a = 1) => { ctx.globalAlpha = a; ctx.fillStyle = c; ctx.fill(p); ctx.globalAlpha = 1; };
  const rect = (ctx, x, y, w, h, c, a = 1) => { ctx.globalAlpha = a; ctx.fillStyle = c; ctx.fillRect(x, y, w, h); ctx.globalAlpha = 1; };
  const circ = (x, y, r) => { const p = new Path2D(); p.arc(x, y, r, 0, 2 * PI); return p; };
  const elp = (x, y, rx, ry, r = 0) => { const p = new Path2D(); p.ellipse(x, y, rx, ry, r, 0, 2 * PI); return p; };
  const rr = (x, y, w, h, r) => { const p = new Path2D(); p.roundRect(x, y, w, h, r); return p; };
  const lin = (ctx, x0, y0, x1, y1, stops) => { const g = ctx.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, c]) => g.addColorStop(o, c)); return g; };
  const rad = (ctx, x, y, r, stops) => { const g = ctx.createRadialGradient(x, y, 0, x, y, r); stops.forEach(([o, c]) => g.addColorStop(o, c)); return g; };
  const X0 = -240, Y0 = -240, WW = 1560, HH = 2400;

  (function css() {
    if (document.getElementById('summit-world-css')) return;
    const st = document.createElement('style'); st.id = 'summit-world-css';
    st.textContent = `.head span.w { display:inline-block; will-change:transform,opacity }`;
    document.head.appendChild(st);
  })();

  // ------------------------------------------------------------------ locations
  function floor(ctx, y, c0, c1, edge) {
    ctx.fillStyle = lin(ctx, 0, y, 0, y + 700, [[0, c0], [1, c1]]); ctx.fillRect(X0, y, WW, HH);
    if (edge) rect(ctx, X0, y - 2, WW, 5, edge, .7);
  }
  function bedroom(ctx, t, o = {}) {
    const lamp = o.lamp == null ? 1 : o.lamp;
    ctx.fillStyle = lin(ctx, 0, 0, 0, 1300, [[0, '#121633'], [1, '#262150']]); ctx.fillRect(X0, Y0, WW, HH);
    // wallpaper stripes
    for (let x = -240; x < 1320; x += 90) rect(ctx, x, -240, 30, 1510, '#ffffff', .025);
    // window with night city
    ctx.save(); ctx.translate(150, 360);
    F(ctx, rr(-18, -18, 416, 476, 14), '#3a2f5e');
    ctx.fillStyle = lin(ctx, 0, 0, 0, 440, [[0, '#070a20'], [1, '#1d2a5c']]); ctx.fillRect(0, 0, 380, 440);
    F(ctx, circ(280, 100, 46), '#fff6d8'); F(ctx, circ(298, 90, 40), '#0b1030', .0);
    for (let i = 0; i < 14; i++) F(ctx, circ(20 + 340 * hash(i + 2), 20 + 200 * hash(i + 9), 1.6 + 1.4 * hash(i)), '#fff', .5 + .5 * Math.sin(t * 3 + i));
    for (let i = 0; i < 8; i++) { const bx = i * 50, bh = 90 + 150 * hash(i + 20); rect(ctx, bx, 440 - bh, 46, bh, '#0d1230'); for (let j = 0; j < 5; j++) if (hash(i * 7 + j) > .55) rect(ctx, bx + 8 + (j % 2) * 18, 440 - bh + 16 + j * 26, 10, 12, '#ffcf7a', .8); }
    rect(ctx, 186, 0, 8, 440, '#3a2f5e'); rect(ctx, 0, 214, 380, 8, '#3a2f5e');
    ctx.restore();
    // curtains
    F(ctx, P('M110 330 C150 500 120 700 140 850 L90 850 C80 680 100 480 70 330 Z'), '#6a3c78');
    F(ctx, P('M570 330 C530 500 560 700 540 850 L590 850 C600 680 580 480 610 330 Z'), '#6a3c78');
    rect(ctx, 60, 318, 560, 14, '#8a5a34');
    // shelf with small books + trophy
    rect(ctx, 660, 520, 340, 16, '#8a5a34');
    for (let i = 0; i < 9; i++) { const h = 70 + 40 * hash(i + 31); rect(ctx, 676 + i * 26, 520 - h, 22, h, ['#e8743f', '#3ee6ff', '#8e97ab', '#ffb36b', '#6a3c78'][i % 5], .9); }
    F(ctx, P('M920 520 L930 460 L970 460 L980 520 Z'), '#ffcf5a'); F(ctx, circ(950, 452, 22), '#ffcf5a');
    // poster (a mountain, no words)
    F(ctx, rr(700, 640, 240, 170, 8), '#e9e3d4'); F(ctx, P('M718 792 L790 690 L830 740 L860 700 L922 792 Z'), '#3a2f5e'); F(ctx, circ(890, 680, 16), '#ff9a6a');
    floor(ctx, 1268, '#2a1d3e', '#0f0a1c', '#ff9a6a');
    F(ctx, elp(340, 1400, 360, 70), '#3a2a5a', .7);
    // desk
    rect(ctx, 560, 1060, 450, 30, '#9a6a40'); rect(ctx, 560, 1088, 450, 10, '#5e3a1e');
    rect(ctx, 580, 1098, 26, 170, '#6e4626'); rect(ctx, 966, 1098, 26, 170, '#6e4626');
    rect(ctx, 820, 1098, 160, 110, '#7a5030'); rect(ctx, 880, 1146, 40, 8, '#c08a5a');
    // lamp
    ctx.save(); ctx.translate(950, 1060);
    F(ctx, elp(0, -6, 46, 10), '#2c3446'); ctx.strokeStyle = '#2c3446'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(0, -10); ctx.lineTo(-40, -120); ctx.lineTo(-110, -160); ctx.stroke();
    F(ctx, P('M-150 -190 L-70 -150 L-100 -110 L-170 -140 Z'), '#3ee6ff');
    ctx.restore();
    if (lamp > 0) { ctx.globalAlpha = .55 * lamp; ctx.fillStyle = rad(ctx, 800, 1050, 420, [[0, 'rgba(255,214,150,.85)'], [1, 'rgba(255,214,150,0)']]); ctx.fillRect(380, 640, 840, 840); ctx.globalAlpha = 1; }
    // floor clutter: socks, crumpled papers
    F(ctx, elp(160, 1320, 40, 16), '#e9e3d4'); F(ctx, elp(1000, 1330, 34, 14), '#e9e3d4');
    F(ctx, P('M260 1300 c20 -10 50 -6 60 6 c-14 14 -44 14 -60 -6 Z'), '#3ee6ff', .8);
  }
  function rooftop(ctx, t, o = {}) {
    const px = o.px || 0;
    ctx.fillStyle = lin(ctx, 0, 0, 0, 1300, [[0, '#1b1840'], [.45, '#5a3470'], [.75, '#ff8a6a'], [1, '#ffc88a']]); ctx.fillRect(X0, Y0, WW, HH);
    F(ctx, circ(760, 1010, 150), '#ffe0a8', .9);
    // far skyline
    const sky = (seed, base, hMin, hMax, col, win, off) => {
      for (let i = -3; i < 22; i++) {
        const w = 90 + 60 * hash(seed + i), x = ((i * 120 + off) % 2880 + 2880) % 2880 - 400, h = hMin + (hMax - hMin) * hash(seed + i * 3);
        rect(ctx, x, base - h, w, h + 400, col);
        if (hash(seed + i * 5) > .6) rect(ctx, x + w * .4, base - h - 60, 6, 60, col);
        if (win) for (let r = 0; r < h / 40 - 1; r++) for (let c = 0; c < w / 30 - 1; c++) if (hash(seed + i * 31 + r * 7 + c) > .62) rect(ctx, x + 12 + c * 30, base - h + 20 + r * 40, 12, 16, '#ffd27a', .75);
      }
    };
    sky(10, 1130, 160, 420, '#3a2a5a', false, -px * .3);
    sky(40, 1200, 120, 330, '#221a3e', true, -px * .6);
    floor(ctx, 1268, '#2b2440', '#100c1c', '#ffb36b');
    rect(ctx, X0, 1268, WW, 26, '#3a3150');
    // water tower
    ctx.save(); ctx.translate(140 - px * .1, 1268);
    rect(ctx, -70, -150, 10, 150, '#1a1530'); rect(ctx, 60, -150, 10, 150, '#1a1530');
    F(ctx, rr(-90, -330, 180, 190, 18), '#3b2b2a'); F(ctx, P('M-100 -330 L0 -400 L100 -330 Z'), '#2a1f22');
    for (let i = 0; i < 4; i++) rect(ctx, -90, -300 + i * 44, 180, 5, '#24191a');
    ctx.restore();
    // AC units + vent pipe (trip hazard at x ~ 650)
    F(ctx, rr(860, 1180, 150, 90, 8), '#4a4262'); F(ctx, circ(935, 1225, 30), '#2a2440');
    rect(ctx, 600, 1236, 120, 32, '#5a5272'); rect(ctx, 690, 1180, 30, 60, '#5a5272');
    // antenna with blinking light
    rect(ctx, 990, 900, 6, 290, '#1a1530'); F(ctx, circ(993, 896, 9), '#ff4d6d', .4 + .6 * (Math.floor(t * 2) % 2));
  }
  function library(ctx, t) {
    ctx.fillStyle = lin(ctx, 0, 0, 0, 1300, [[0, '#2a1630'], [1, '#5a2e2c']]); ctx.fillRect(X0, Y0, WW, HH);
    // arched window + light shafts
    F(ctx, P('M440 300 L640 300 L640 760 L440 760 Z M440 300 A100 100 0 0 1 640 300 Z'), '#ffd7a0', .9);
    F(ctx, P('M440 300 A100 100 0 0 1 640 300 Z'), '#ffe7c0');
    rect(ctx, 536, 200, 8, 560, '#5a2e2c'); rect(ctx, 440, 520, 200, 8, '#5a2e2c');
    ctx.globalAlpha = .16; ctx.fillStyle = '#ffd7a0'; ctx.fill(P('M440 760 L640 760 L900 1268 L260 1268 Z')); ctx.globalAlpha = 1;
    // shelves
    const shelf = (x0, x1) => {
      rect(ctx, x0 - 14, 200, x1 - x0 + 28, 1070, '#3a1e1c');
      for (let r = 0; r < 6; r++) {
        const y = 300 + r * 160; rect(ctx, x0 - 14, y, x1 - x0 + 28, 14, '#6e3a26');
        let x = x0;
        for (let i = 0; x < x1 - 20; i++) {
          const w = 20 + 16 * hash(x0 + r * 17 + i), h = 90 + 50 * hash(x0 + r * 13 + i * 3);
          rect(ctx, x, y - h, w, h, ['#e8743f', '#3ee6ff', '#c9b27a', '#8e3a5a', '#4a6aa8', '#ffb36b'][Math.floor(hash(r * 7 + i + x0) * 6)], .85);
          rect(ctx, x, y - h + 12, w, 5, '#fff', .25);
          x += w + 4;
        }
      }
    };
    shelf(-200, 380); shelf(700, 1280);
    floor(ctx, 1268, '#4a2420', '#1a0c0c', '#ffb36b');
    for (let x = -240; x < 1320; x += 120) rect(ctx, x, 1268, 4, 700, '#000', .15);
    // long table
    rect(ctx, 120, 1080, 840, 30, '#9a5a30'); rect(ctx, 120, 1108, 840, 10, '#5e2e18');
    rect(ctx, 150, 1118, 30, 150, '#6e3a20'); rect(ctx, 900, 1118, 30, 150, '#6e3a20');
    // banker's lamp
    ctx.save(); ctx.translate(820, 1080); rect(ctx, -6, -110, 12, 110, '#c9a24a'); F(ctx, P('M-90 -110 Q0 -170 90 -110 Z'), '#1f7a4a'); F(ctx, elp(0, -4, 44, 10), '#c9a24a'); ctx.restore();
    ctx.globalAlpha = .4; ctx.fillStyle = rad(ctx, 820, 1000, 300, [[0, 'rgba(255,220,150,.9)'], [1, 'rgba(255,220,150,0)']]); ctx.fillRect(520, 700, 600, 600); ctx.globalAlpha = 1;
  }
  function trail(ctx, t, o = {}) {
    const rain = o.rain == null ? 1 : o.rain, px = o.px || 0;
    ctx.fillStyle = lin(ctx, 0, 0, 0, 1300, [[0, '#0d1424'], [.6, '#26344e'], [1, '#4a5a74']]); ctx.fillRect(X0, Y0, WW, HH);
    // heavy clouds
    for (let i = 0; i < 9; i++) F(ctx, elp(-100 + i * 160 + 30 * Math.sin(t * .4 + i), 260 + 60 * hash(i), 180, 80), '#1a2236', .9);
    F(ctx, P(`M-240 1100 L${80 - px * .2} 820 L${260 - px * .2} 960 L${470 - px * .2} 760 L${700 - px * .2} 980 L${900 - px * .2} 840 L1320 1060 V2200 H-240 Z`), '#33415c');
    F(ctx, P(`M-240 1200 L${200 - px * .4} 1000 L${420 - px * .4} 1110 L${640 - px * .4} 960 L${860 - px * .4} 1120 L1320 1000 V2200 H-240 Z`), '#222c42');
    floor(ctx, 1268, '#1a2030', '#080b12', '#7fa8c8');
    for (let i = 0; i < 12; i++) F(ctx, elp(-100 + i * 120 + 40 * hash(i + 3), 1300 + 60 * hash(i + 8), 30 + 20 * hash(i), 12), '#2c3650');
    F(ctx, elp(300, 1340, 120, 16), '#5f7fa0', .45); F(ctx, elp(860, 1380, 90, 12), '#5f7fa0', .45);
    if (rain > 0) {
      ctx.strokeStyle = '#a8c8ec'; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.globalAlpha = .45 * rain; ctx.beginPath();
      for (let i = 0; i < 90; i++) { const x = (hash(i) * 1500 - 200 + t * 120) % 1500 - 200, y = ((hash(i + 50) * 2000 + t * 1700) % 2000) - 200; ctx.moveTo(x, y); ctx.lineTo(x - 12, y + 60); }
      ctx.stroke(); ctx.globalAlpha = 1;
      for (let i = 0; i < 8; i++) { const k = ((t * 1.3 + hash(i)) % 1); ctx.strokeStyle = '#a8c8ec'; ctx.globalAlpha = .5 * (1 - k) * rain; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(100 + i * 130, 1310 + 40 * hash(i + 2), 10 + 30 * k, 4 + 8 * k, 0, 0, 2 * PI); ctx.stroke(); }
      ctx.globalAlpha = 1;
    }
  }
  function night(ctx, t, o = {}) {
    ctx.fillStyle = '#04040c'; ctx.fillRect(X0, Y0, WW, HH);
    for (let i = 0; i < 30; i++) F(ctx, circ(1080 * hash(i + 70), 1300 * hash(i + 90), 1.5 + hash(i)), '#fff', .25 + .2 * Math.sin(t * 2 + i));
  }

  // ------------------------------------------------------------------ props
  function book(ctx, x, y, w, h, r = 0) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(r * PI / 180);
    const d = h * .16;
    rect(ctx, -w / 2 + 8, h / 2 - 6, w - 10, d, '#f3ead6');
    ctx.strokeStyle = '#cbbf9f'; ctx.lineWidth = Math.max(1, w / 160);
    for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-w / 2 + 12, h / 2 - 6 + d * i / 4); ctx.lineTo(w / 2 - 4, h / 2 - 6 + d * i / 4); ctx.stroke(); }
    F(ctx, rr(-w / 2, -h / 2, w, h, w * .03), '#e8743f');
    rect(ctx, -w / 2, -h / 2, w * .09, h, '#b4532e');
    rect(ctx, -w * .28, -h * .3, w * .62, h * .06, '#ffd7b8', .9); rect(ctx, -w * .2, -h * .16, w * .46, h * .04, '#ffd7b8', .9);
    F(ctx, P(`M${-w * .14} ${h * .3} L${w * .04} ${-h * .02} L${w * .22} ${h * .3} Z`), '#0b1026');
    F(ctx, P(`M${w * .04} ${-h * .02} L${w * .1} ${h * .08} L${-w * .02} ${h * .08} Z`), '#3ee6ff');
    rect(ctx, w * .3, -h / 2 - h * .02, w * .06, h * .34, '#3ee6ff');
    ctx.restore();
  }
  const TOWER_COL = ['#e8743f', '#4a6aa8', '#8e3a5a', '#c9b27a', '#1f7a4a', '#e8743f'];
  function bookTower(ctx, x, fy, t, o = {}) {
    const n = o.n || 5, s = o.s || 1, lean = o.lean || 0, fall = o.fall || 0;
    for (let i = 0; i < n; i++) {
      const w = (300 - 18 * (i % 3)) * s, h = 90 * s, k = clamp(fall * 1.4 - i * .08);
      const bx0 = x + (i % 2 ? 14 : -10) * s, by0 = fy - h / 2 - i * h;
      const dir = i % 2 ? 1 : -1, dist = (180 + 120 * hash(i + 4)) * s;
      const bx = bx0 + Math.sin(lean * PI / 180) * i * h + dir * dist * oC(k), by = lerp(by0, (o.floor == null ? fy : o.floor) - h / 2 - (i % 3) * 30 * s, k * k);
      const r = lean * (1 + i * .3) + dir * 80 * k + 10 * Math.sin(i * 9) * (1 - k) * 0;
      ctx.save(); ctx.translate(bx, by); ctx.rotate(r * PI / 180);
      F(ctx, rr(-w / 2, -h / 2, w, h, 8 * s), TOWER_COL[i % TOWER_COL.length]);
      rect(ctx, -w / 2 + 8 * s, -h / 2 + 10 * s, w - 16 * s, 12 * s, '#f3ead6', .9);
      rect(ctx, -w / 2 + 30 * s, -h * .05, w * .3, h * .2, '#ffd7b8', .7);
      rect(ctx, -w / 2, -h / 2, 16 * s, h, '#000', .2);
      ctx.restore();
    }
  }
  /* boulder: base disc + three removable chunks (top-left, top-right, front). broken[i] 0..1 = chunk i blown away */
  function boulder(ctx, x, y, r, t, o = {}) {
    const br = o.broken || [0, 0, 0], crack = o.crack || 0;
    ctx.save(); ctx.translate(x, y);
    const remain = 1 - (br[0] + br[1] + br[2]) / 3 * .55;
    ctx.scale(remain, remain); ctx.translate(0, r * (1 - remain) / remain);
    F(ctx, elp(0, r * .92, r * 1.1, r * .16), '#000', .35);
    F(ctx, P(`M${-r} ${r * .9} C${-r * 1.15} ${r * .2} ${-r * .8} ${-r * .8} ${-r * .1} ${-r * .95} C${r * .6} ${-r * 1.05} ${r * 1.12} ${-r * .3} ${r * 1.02} ${r * .9} Z`), '#5a5070');
    F(ctx, P(`M${r * .2} ${-r * .9} C${r * .7} ${-r * .9} ${r * 1.12} ${-r * .3} ${r * 1.02} ${r * .9} L${r * .45} ${r * .9} C${r * .7} ${r * .2} ${r * .6} ${-r * .4} ${r * .2} ${-r * .9} Z`), '#3e3656');
    F(ctx, P(`M${-r * .7} ${-r * .4} C${-r * .5} ${-r * .75} ${-r * .2} ${-r * .85} ${r * .05} ${-r * .85} C${-r * .2} ${-r * .7} ${-r * .45} ${-r * .55} ${-r * .55} ${-r * .3} Z`), '#7a6e94', .8);
    ctx.strokeStyle = '#ff9a6a'; ctx.globalAlpha = .55; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-r * .9, -r * .1); ctx.quadraticCurveTo(-r * .6, -r * .9, 0, -r * .95); ctx.stroke(); ctx.globalAlpha = 1;
    if (crack > 0) {
      ctx.strokeStyle = o.glow ? '#3ee6ff' : '#1a1430'; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      const L = crack;
      ctx.beginPath(); ctx.moveTo(0, -r * .95); ctx.lineTo(-r * .1 * L, -r * .5 * L); ctx.lineTo(r * .12 * L, -r * .1 * L); ctx.lineTo(-r * .05 * L, r * .4 * L); ctx.lineTo(r * .08 * L, r * .85 * L); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(r * .12 * L - r * .0, -r * .1 * L); ctx.lineTo(r * .55 * L, -r * .05 * L); ctx.lineTo(r * .9 * L, r * .2 * L); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-r * .1 * L, -r * .5 * L); ctx.lineTo(-r * .55 * L, -r * .35 * L); ctx.lineTo(-r * .85 * L, -r * .1 * L); ctx.stroke();
    }
    ctx.restore();
  }
  function cliff(ctx, x, top, bot, t) {
    F(ctx, P(`M${x} ${bot} L${x + 30} ${top + 200} L${x - 20} ${top} L1400 ${top - 40} L1400 ${bot} Z`), '#1e1a3a');
    F(ctx, P(`M${x} ${bot} L${x + 30} ${top + 200} L${x - 20} ${top} L${x + 80} ${top} L${x + 110} ${top + 200} L${x + 70} ${bot} Z`), '#2c2650');
    ctx.strokeStyle = '#ff9a6a'; ctx.globalAlpha = .6; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x, bot); ctx.lineTo(x + 30, top + 200); ctx.lineTo(x - 20, top); ctx.stroke(); ctx.globalAlpha = 1;
    for (let y = top + 60; y < bot; y += 130) { F(ctx, elp(x + 20 + 30 * hash(y), y, 26, 12), '#3a3462'); }
  }
  function cloud(ctx, x, y, s, t, o = {}) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    const rn = o.rain == null ? 1 : o.rain;
    if (rn > 0) { ctx.strokeStyle = '#9fdcff'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.globalAlpha = rn;
      for (let i = 0; i < 6; i++) { const ph = (t * 2.6 + i * .37) % 1; ctx.beginPath(); ctx.moveTo(-80 + i * 32, 40 + 120 * ph); ctx.lineTo(-86 + i * 32, 70 + 120 * ph); ctx.stroke(); } ctx.globalAlpha = 1; }
    const c = o.dark ? '#3a4058' : '#5d6582';
    [[-60, 0, 44], [-12, -26, 56], [46, -6, 46], [0, 12, 50], [-90, 14, 30], [86, 14, 30]].forEach(([cx, cy, r]) => F(ctx, circ(cx, cy, r), c));
    F(ctx, circ(-16, -36, 34), '#7a83a3');
    ctx.restore();
  }
  function zzz(ctx, x, y, t, k = 1) {
    if (k <= 0) return;
    for (let i = 0; i < 3; i++) {
      const ph = (t * .9 + i / 3) % 1, s = (22 + 18 * ph) * k;
      ctx.save(); ctx.translate(x + 40 * ph + 20 * Math.sin(ph * 6), y - 160 * ph); ctx.globalAlpha = Math.sin(PI * ph);
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 7; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-s, -s); ctx.lineTo(s, -s); ctx.lineTo(-s, s); ctx.lineTo(s, s); ctx.stroke(); ctx.restore();
    }
    ctx.globalAlpha = 1;
  }

  // ------------------------------------------------------------------ FX
  function focusLines(ctx, cx, cy, t, k, col = '#ffffff') {
    if (k <= 0) return;
    const f = Math.floor(t * 20);
    ctx.save(); ctx.globalAlpha = .55 * k; ctx.fillStyle = col;
    for (let i = 0; i < 46; i++) {
      const a = (i / 46) * 2 * PI + hash(f * 3 + i) * .1, r0 = 520 + 260 * hash(f + i * 7), w = .012 + .014 * hash(i + f);
      ctx.beginPath(); ctx.moveTo(cx + Math.cos(a - w) * 1800, cy + Math.sin(a - w) * 1800); ctx.lineTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0); ctx.lineTo(cx + Math.cos(a + w) * 1800, cy + Math.sin(a + w) * 1800); ctx.fill();
    }
    ctx.restore(); ctx.globalAlpha = 1;
  }
  function streaks(ctx, t, k, dir = 1, col = '#ffffff') {
    if (k <= 0) return;
    ctx.save();
    for (let i = 0; i < 22; i++) {
      const len = 260 + 420 * hash(i + 9), th = 4 + 7 * hash(i + 5), sp = 3200 + 1200 * hash(i);
      ctx.globalAlpha = (.25 + .3 * hash(i + 2)) * k; ctx.fillStyle = i % 4 ? col : '#3ee6ff';
      if (Math.abs(dir) === 1) { const y = -100 + 2100 * hash(i * 3.1), x = ((hash(i + 1) * 1600 - dir * sp * t) % 1600 + 1600) % 1600 - 300; ctx.fillRect(x, y, len, th); }
      else { const x = -100 + 1300 * hash(i * 3.1), y = ((hash(i + 1) * 2400 - Math.sign(dir) * sp * t) % 2400 + 2400) % 2400 - 300; ctx.fillRect(x, y, th, len); }
    }
    ctx.restore(); ctx.globalAlpha = 1;
  }
  function trailRibbon(ctx, pts, w, col = '#3ee6ff', a = .5) {
    if (pts.length < 2) return;
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (let i = 1; i < pts.length; i++) { ctx.globalAlpha = a * i / pts.length; ctx.strokeStyle = col; ctx.lineWidth = w * i / pts.length; ctx.beginPath(); ctx.moveTo(pts[i - 1][0], pts[i - 1][1]); ctx.lineTo(pts[i][0], pts[i][1]); ctx.stroke(); }
    ctx.restore(); ctx.globalAlpha = 1;
  }
  function flash(ctx, k, col = '#ffffff') { if (k <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = k; ctx.fillStyle = col; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); ctx.globalAlpha = 1; }
  function sparkle(ctx, x, y, r, col = '#3ee6ff', a = 1) {
    ctx.globalAlpha = a; ctx.fillStyle = col; ctx.beginPath();
    ctx.moveTo(x, y - r); ctx.lineTo(x + r * .22, y - r * .22); ctx.lineTo(x + r, y); ctx.lineTo(x + r * .22, y + r * .22); ctx.lineTo(x, y + r); ctx.lineTo(x - r * .22, y + r * .22); ctx.lineTo(x - r, y); ctx.lineTo(x - r * .22, y - r * .22); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
  }
  function aura(ctx, x, y, s, t, k) {
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    for (let L = 0; L < 3; L++) {
      const R = 230 - L * 50, col = ['rgba(62,230,255,.22)', 'rgba(62,230,255,.32)', 'rgba(190,250,255,.45)'][L];
      ctx.beginPath();
      for (let i = 0; i <= 28; i++) {
        const a = -PI / 2 + (i / 28 - .5) * 2 * PI, flick = Math.max(0, Math.sin(a * 5 + t * 14 + L * 2)) * 70 * (a > -PI && a < 0 ? 1 : .3) * k;
        const rx = R * .78 * k, ry = (R + flick) * k, px = Math.cos(a) * rx, py = -260 + Math.sin(a) * ry * 1.25;
        i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
      }
      ctx.closePath(); ctx.fillStyle = col; ctx.fill();
    }
    for (let i = 0; i < 16; i++) {
      const ph = (t * (.9 + .5 * hash(i)) + hash(i + 4)) % 1, px = (hash(i + 7) - .5) * 360, py = -40 - 560 * ph;
      sparkle(ctx, px, py, (10 + 10 * hash(i + 2)) * (1 - ph) * k, i % 3 ? '#3ee6ff' : '#ffffff', k);
    }
    ctx.restore(); ctx.globalAlpha = 1;
  }
  function burst(ctx, x, y, t, t0, o = {}) {
    const dur = o.dur || .7, k = seg(t, t0, t0 + dur); if (k <= 0 || k >= 1) return;
    const R = o.r || 420, col = o.col || '#3ee6ff', n = o.rays || 14;
    ctx.save(); ctx.translate(x, y);
    ctx.globalAlpha = (1 - k) * .8; ctx.fillStyle = col;
    for (let i = 0; i < n; i++) {
      const a = i / n * 2 * PI + t0, w = .07, r1 = R * (.35 + .9 * oC(k)), r0 = R * .2 * oC(k);
      ctx.beginPath(); ctx.moveTo(Math.cos(a - w) * r0, Math.sin(a - w) * r0); ctx.lineTo(Math.cos(a) * r1, Math.sin(a) * r1); ctx.lineTo(Math.cos(a + w) * r0, Math.sin(a + w) * r0); ctx.fill();
    }
    ctx.globalAlpha = 1 - k; ctx.strokeStyle = '#fff'; ctx.lineWidth = 14 * (1 - k); ctx.beginPath(); ctx.arc(0, 0, R * oC(k), 0, 2 * PI); ctx.stroke();
    ctx.restore(); ctx.globalAlpha = 1;
  }
  function debris(ctx, x, y, t, t0, o = {}) {
    const u = t - t0; if (u < 0 || u > 1.4) return;
    const n = o.n || 10, s = o.s || 1, col = o.col || '#5a5070', sp = o.spread || 1, up = o.up == null ? 1 : o.up;
    for (let i = 0; i < n; i++) {
      const vx = (hash(i + t0 * 7) - .5) * 1500 * sp, vy = -(500 + 900 * hash(i + 3 + t0)) * up, r = (14 + 26 * hash(i + 9)) * s;
      const px = x + vx * u, py = y + vy * u + 2600 * u * u, a = 1 - seg(u, 1, 1.4);
      ctx.save(); ctx.translate(px, py); ctx.rotate(u * (6 + 6 * hash(i)) * (i % 2 ? 1 : -1));
      F(ctx, P(`M${-r} ${-r * .3} L${-r * .2} ${-r} L${r} ${-r * .4} L${r * .7} ${r * .8} L${-r * .6} ${r * .6} Z`), i % 3 ? col : '#7a6e94', a);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }
  function dust(ctx, x, y, t, t0, s = 1) {
    const k = seg(t, t0, t0 + .5); if (k <= 0 || k >= 1) return;
    for (let i = 0; i < 7; i++) { const d = (i - 3) * 40 * s * (.4 + oC(k)), r = (26 + 12 * hash(i)) * s * (1 - .5 * k); F(ctx, circ(x + d * 1.6, y - 20 * s - 30 * s * oC(k) * hash(i + 2), r), '#d8cfe8', .7 * (1 - k)); }
  }
  function poof(ctx, x, y, t, t0, s = 1) {
    const k = seg(t, t0, t0 + .6); if (k <= 0 || k >= 1) return;
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    for (let i = 0; i < 9; i++) {
      const an = i / 9 * 2 * PI + hash(i) * .5, d = 40 + 110 * oC(k) * (.7 + .5 * hash(i + 3)), r = (34 + 20 * hash(i + 7)) * (1 - .6 * k) * (k < .15 ? k / .15 : 1);
      F(ctx, circ(Math.cos(an) * d, Math.sin(an) * d * .7, r), i % 3 ? '#ffffff' : '#bff6ff', .9 * (1 - k));
    }
    for (let i = 0; i < 6; i++) { const an = i / 6 * 2 * PI + .3, d = 60 + 170 * oC(k); sparkle(ctx, Math.cos(an) * d, Math.sin(an) * d * .8, 24 * (1 - k), '#3ee6ff', 1 - k); }
    ctx.restore(); ctx.globalAlpha = 1;
  }
  function impactStar(ctx, x, y, r, t, col = '#ffd27a') {
    ctx.save(); ctx.translate(x, y); ctx.rotate(Math.floor(t * 15) * .3);
    ctx.beginPath();
    for (let i = 0; i < 20; i++) { const a = i / 20 * 2 * PI, rr2 = i % 2 ? r * .5 : r; i ? ctx.lineTo(Math.cos(a) * rr2, Math.sin(a) * rr2) : ctx.moveTo(rr2, 0); }
    ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 6; ctx.stroke();
    ctx.restore();
  }
  function shake(t, HITS) {
    let dx = 0, dy = 0;
    HITS.forEach(([t0, amp, dur = .3]) => {
      if (t < t0 || t > t0 + dur) return;
      const e = amp * (1 - (t - t0) / dur), f = Math.floor(t * 30);
      dx += (hash(f + t0) - .5) * 2 * e; dy += (hash(f * 1.7 + t0 + 3) - .5) * 2 * e;
    });
    return { dx: Math.round(dx), dy: Math.round(dy) };
  }

  // ------------------------------------------------------------------ type + phone helpers
  const words = s => s.split(' ').map(w => `<span class="w">${w}</span>`).join(' ');
  function slam(el, t, times, o = {}) {
    const ws = el._w || (el._w = [...el.querySelectorAll('span.w')]);
    const out = o.out == null ? 1e9 : o.out, first = times[0];
    const fo = seg(t, out, out + .25);
    el.style.opacity = (t >= first - .001 || o.hold0 ? 1 - fo : 0).toFixed(3);
    el.style.transform = `translateY(${Math.round(-30 * iC(fo))}px)`;
    ws.forEach((w, i) => {
      const a = times[Math.min(i, times.length - 1)], k = o.hold0 && t <= a ? 1 : seg(t, a - .12, a);
      const y = Math.round(-90 * (1 - oC(k)) + 10 * tri(t, a, a + .16));
      w.style.opacity = (o.hold0 ? 1 : k).toFixed(3);
      w.style.transform = `translateY(${y}px)`;
    });
  }
  function tilt(el, t, a, o = {}) {
    const dur = o.dur || .6, k = oC(seg(t, a, a + dur)), ry = (o.ry == null ? -28 : o.ry) * (1 - k), rx = (o.rx == null ? 10 : o.rx) * (1 - k), rz = (o.rz || 0) * (1 - k);
    if (Math.abs(ry) + Math.abs(rx) + Math.abs(rz) < .01) return;
    el.style.transform = `perspective(2200px) rotateY(${ry.toFixed(2)}deg) rotateX(${rx.toFixed(2)}deg) rotate(${rz.toFixed(2)}deg) ` + el.style.transform;
  }

  S.world = { bedroom, rooftop, library, trail, night, book, bookTower, boulder, cliff, cloud, zzz,
    focusLines, streaks, ribbon: trailRibbon, flash, aura, burst, debris, dust, poof, sparkle, impactStar, shake, slam, words, tilt };
})();
