/* ==== SUMMIT NINJA show kit, part 2 (EP1/EP3 agent): canvas WORLDS + FX + action helpers. Frame-pure. ====
 * Requires the goblin block (S.goblin, S.cam ...). Everything draws onto a 2D canvas in WORLD px (1080x1920 frame);
 * apply the camera with S.camApply(ctx, c, dx, dy) first. Tag the background canvas data-bg; draw characters/FX on
 * a second (untagged) canvas.
 *   S.world.bedroom(ctx, t, { dark, glow })      night bedroom: window + city, desk, lamp, books (+ S.world.bedroomFg desk front)
 *   S.world.cliffs(ctx, t, { scroll, warm })     dawn cliffs: sky, sun, 3 parallax ranges, run ledges (S.world.cliffY(x, scroll))
 *   S.world.feed(ctx, t, { scroll, pulse })      neon "inside the feed" void: perspective grid + blank feed cards scrolling
 *   S.world.wall(ctx, t, { scroll, warm })       vertical rock wall with hand holds (climb shots)
 *   S.world.summit(ctx, t, { rise, burst })      sunrise summit above a sea of clouds; ledge top y 1240 across x 300–780
 *   S.world.rooftop(ctx, t, { scroll, storm })   night city rooftops (rain-ready); roof tops via S.world.roofY(x, scroll)
 *   S.world.ridge(ctx, t, { storm, scroll })     storm ridge (storm 1 = dark purple storm, 0 = clear gold dawn)
 *   S.fx.speed / rain / bolt / aura / sparks / puff / rays / cloud / flame / spiral / stars
 *   S.shake(t, hits, amp) -> {dx, dy}             6-10 px decaying shake after each hit time
 *   S.flash(t, hits) -> 0..1                      1-2 frame impact flash (draw on the BG canvas: never over words)
 *   S.runPose(t, o)                               ninja run cycle (pose object for S.ninja.draw)
 *   S.drawN(ctx, n, mirror) / S.drawG(ctx, g, mirror)   draw ninja / goblin mirrored about their own x
 */
(function () {
  'use strict';
  const S = window.Summit;
  if (!S || S.world) return;
  const { clamp, seg, oC, iC, ioC, oBack, lerp, tri, hash } = S;
  const PI = Math.PI;
  const P = d => new Path2D(d);
  const circ = (x, y, r) => { const p = new Path2D(); p.arc(x, y, r, 0, 2 * PI); return p; };
  const elp = (x, y, rx, ry, rot = 0) => { const p = new Path2D(); p.ellipse(x, y, rx, ry, rot, 0, 2 * PI); return p; };
  const rr = (x, y, w, h, r) => { const p = new Path2D(); p.roundRect(x, y, w, h, r); return p; };
  const F = (ctx, p, c, a = 1) => { ctx.globalAlpha = a; ctx.fillStyle = c; ctx.fill(p); ctx.globalAlpha = 1; };
  const K = (ctx, p, c, w, a = 1) => { ctx.globalAlpha = a; ctx.strokeStyle = c; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke(p); ctx.globalAlpha = 1; };
  const lg = (ctx, x0, y0, x1, y1, stops) => { const g = ctx.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, c]) => g.addColorStop(o, c)); return g; };
  const mix = (a, b, p) => {
    const A = [1, 3, 5].map(i => parseInt(a.substr(i, 2), 16)), B = [1, 3, 5].map(i => parseInt(b.substr(i, 2), 16));
    return '#' + A.map((v, i) => Math.round(lerp(v, B[i], clamp(p))).toString(16).padStart(2, '0')).join('');
  };
  const W = 1080, H = 1920, M = 600;     // M: margin painted around the frame so camera shake / zoom-out never shows an edge
  S.camApply = (ctx, c, dx = 0, dy = 0) => ctx.setTransform(c.z, 0, 0, c.z, c.tx + dx, c.ty + dy);
  S.mixC = mix;

  function sky(ctx, top, mid, bot) { ctx.fillStyle = lg(ctx, 0, -M, 0, H + M, [[0, top], [.5, mid], [1, bot]]); ctx.fillRect(-M, -M, W + 2 * M, H + 2 * M); }
  function stars(ctx, t, n, a, y1 = 900, seed = 1) {
    for (let i = 0; i < n; i++) {
      const x = hash(i * 3.1 + seed) * (W + 400) - 200, y = hash(i * 7.7 + seed) * y1 - 200, tw = .5 + .5 * Math.sin(t * 3 + i);
      F(ctx, circ(x, y, 1.5 + 2.5 * hash(i + 9)), '#fff', a * (.35 + .65 * tw));
    }
  }
  // a ridge line across the frame: deterministic jagged silhouette
  function range(ctx, y, amp, step, seed, col, off = 0) {
    const p = new Path2D(); p.moveTo(-M, H + M);
    const o = ((off % (step * 64)) + step * 64) % (step * 64);
    for (let x = -M - step * 2; x <= W + M + step * 2; x += step) {
      const i = Math.floor((x + o) / step), fr = ((x + o) / step) - i;
      const h0 = hash(i * 1.37 + seed), h1 = hash((i + 1) * 1.37 + seed);
      p.lineTo(x, y - amp * lerp(h0, h1, fr));
    }
    p.lineTo(W + M, H + M); p.closePath(); ctx.fillStyle = col; ctx.fill(p);
  }

  // ------------------------------------------------------------------ BEDROOM (night, front view)
  function bedroom(ctx, t, o = {}) {
    const dark = o.dark || 0;
    sky(ctx, mix('#262a5e', '#06061a', dark), mix('#1d2050', '#05051a', dark), mix('#14163a', '#030312', dark));
    // window with city + moon
    ctx.save(); ctx.translate(150, 600);
    F(ctx, rr(-18, -18, 456, 556, 22), mix('#3b3f80', '#14143a', dark));
    ctx.save(); ctx.clip(rr(0, 0, 420, 520, 10));
    ctx.fillStyle = lg(ctx, 0, 0, 0, 520, [[0, '#0b0f33'], [1, mix('#3a2f7a', '#120d2e', dark)]]); ctx.fillRect(0, 0, 420, 520);
    stars(ctx, t, 30, .8 * (1 - dark * .5), 560, 4);
    F(ctx, circ(310, 110, 54), '#fff3d6', 1 - dark * .6); F(ctx, circ(292, 98, 50), '#0b0f33', .0);
    for (let i = 0; i < 9; i++) {                                         // city blocks with lit windows
      const bx = i * 50 - 10, bh = 120 + 160 * hash(i + 2), by = 520 - bh;
      F(ctx, rr(bx, by, 46, bh + 20, 3), mix('#171a44', '#0a0a20', dark));
      for (let w = 0; w < 10; w++) { const wx = bx + 8 + (w % 3) * 12, wy = by + 14 + Math.floor(w / 3) * 26; if (hash(i * 13 + w) > .45) F(ctx, rr(wx, wy, 7, 11, 1), '#ffcf7a', .8 * (1 - dark * .7)); }
    }
    if (o.rain) { rain(ctx, t, { n: 40, a: .6 * o.rain, len: 50, slant: .2 }); }
    if (o.flashW) { ctx.globalAlpha = o.flashW; ctx.fillStyle = '#e9e4ff'; ctx.fillRect(0, 0, 420, 520); ctx.globalAlpha = 1; }
    ctx.restore();
    F(ctx, rr(200, -18, 20, 556, 4), mix('#3b3f80', '#14143a', dark)); F(ctx, rr(-18, 250, 456, 20, 4), mix('#3b3f80', '#14143a', dark));
    ctx.restore();
    F(ctx, rr(110, 1150, 520, 30, 6), mix('#3b3f80', '#14143a', dark));
    // poster (mountain doodle) + shelf
    ctx.save(); ctx.translate(690, 620); ctx.rotate(.04);
    F(ctx, rr(0, 0, 230, 300, 8), mix('#ff9f6b', '#3a2244', dark)); F(ctx, P('M20 260 L100 110 L140 170 L170 130 L215 260 Z'), mix('#2a2f6a', '#151533', dark)); F(ctx, P('M100 110 L122 150 L86 150 Z'), '#fff', 1 - dark * .6);
    ctx.restore();
    F(ctx, rr(640, 1020, 330, 18, 4), mix('#5a3a2c', '#24170f', dark));
    [[660, 80, '#3ee6ff'], [700, 96, '#ff7aa8'], [744, 70, '#ffb36b'], [790, 88, '#9d70ff']].forEach(([x, h, c]) => F(ctx, rr(x, 1020 - h, 36, h, 4), mix(c, '#20203a', .35 + dark * .5)));
    // lamp cone (warm)
    if (dark < 1) {
      ctx.save(); ctx.globalAlpha = .22 * (1 - dark);
      ctx.fillStyle = lg(ctx, 0, 820, 0, 1260, [[0, '#ffd59a'], [1, 'rgba(255,213,154,0)']]);
      ctx.fill(P('M800 830 L560 1260 L1080 1260 L960 830 Z')); ctx.restore();
    }
    // lamp
    K(ctx, P('M940 1250 L940 960 L880 860'), mix('#2b2f55', '#141428', dark), 16);
    F(ctx, P('M800 870 L960 800 L990 860 L840 920 Z'), mix('#ffb36b', '#40301a', dark));
    F(ctx, elp(890, 1252, 70, 14), mix('#2b2f55', '#141428', dark));
    // desk top
    F(ctx, rr(-M, 1240, W + 2 * M, 40, 6), mix('#8a5a3c', '#2a1a12', dark));
    // books stack (homework) on the right
    [[650, 1196, 230, '#3ee6ff'], [670, 1160, 200, '#ff7aa8'], [640, 1124, 220, '#ffb36b'], [665, 1092, 180, '#9d70ff']].forEach(([x, y, w, c]) => {
      F(ctx, rr(x, y, w, 44, 6), mix(c, '#1a1a33', .25 + dark * .6)); F(ctx, rr(x + 10, y + 8, w - 20, 8, 3), '#fff', .3 * (1 - dark));
    });
    // homework paper
    ctx.save(); ctx.translate(220, 1226); ctx.rotate(-.05); F(ctx, rr(0, 0, 220, 26, 3), mix('#f4f6fb', '#3a3a50', dark));
    ctx.restore();
  }
  function bedroomFg(ctx, t, o = {}) {
    const dark = o.dark || 0;
    F(ctx, rr(-M, 1276, W + 2 * M, H + M - 1276, 0), mix('#5e3d2a', '#1d120c', dark));
    F(ctx, rr(-M, 1276, W + 2 * M, 14, 0), mix('#3e271a', '#120b07', dark));
    F(ctx, rr(120, 1330, 360, 120, 12), mix('#6d4934', '#22150e', dark)); F(ctx, rr(600, 1330, 360, 120, 12), mix('#6d4934', '#22150e', dark));
    F(ctx, rr(270, 1380, 60, 14, 7), '#d4a24c', 1 - dark * .6); F(ctx, rr(750, 1380, 60, 14, 7), '#d4a24c', 1 - dark * .6);
  }
  /* phone lying on the desk (glow 0..1 purple when the goblin is inside) */
  function deskPhone(ctx, x, y, s, t, glow = 0, tilt = 0) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(tilt);
    if (glow > 0) { const g = ctx.createRadialGradient(0, -40, 10, 0, -40, 260); g.addColorStop(0, `rgba(190,120,255,${.55 * glow})`); g.addColorStop(1, 'rgba(190,120,255,0)'); ctx.fillStyle = g; ctx.fillRect(-300, -320, 600, 560); }
    F(ctx, rr(-70, -150, 140, 150, 22), '#151827'); F(ctx, rr(-60, -142, 120, 134, 16), mix('#1b1f36', '#c9a2ff', glow));
    ctx.restore();
  }

  // ------------------------------------------------------------------ DAWN CLIFFS (side view runner)
  function cliffY(x, scroll) {                       // ground top at world x (gaps return 9999)
    const u = x + scroll, seg_ = 520, i = Math.floor(u / seg_), fr = u - i * seg_;
    if (fr > 400 && hash(i * 2.3 + 1) > .25) return 9999;   // gap
    return 1300 - 60 * Math.round(hash(i * 5.1) * 2);
  }
  function cliffs(ctx, t, o = {}) {
    const sc = o.scroll || 0, warm = o.warm == null ? 1 : o.warm;
    sky(ctx, mix('#2b2466', '#33307a', 1 - warm), mix('#ff8f6b', '#6a4aa0', 1 - warm), mix('#ffd59a', '#2a2a6a', 1 - warm));
    stars(ctx, t, 26, .5, 600, 2);
    const g = ctx.createRadialGradient(700, 1000, 20, 700, 1000, 420); g.addColorStop(0, 'rgba(255,240,200,.95)'); g.addColorStop(.25, 'rgba(255,200,140,.5)'); g.addColorStop(1, 'rgba(255,170,120,0)');
    ctx.fillStyle = g; ctx.fillRect(200, 500, 1000, 1000);
    F(ctx, circ(700, 1000, 90), '#fff2d0');
    range(ctx, 1050, 360, 180, 3, '#6b4f9e', sc * .12);
    range(ctx, 1180, 260, 130, 7, '#46367a', sc * .3);
    range(ctx, 1330, 160, 90, 11, '#2c2457', sc * .55);
    // run ledges
    const seg_ = 520, i0 = Math.floor((sc - M) / seg_) - 1;
    for (let i = i0; i < i0 + 6; i++) {
      const x0 = i * seg_ - sc, top = 1300 - 60 * Math.round(hash(i * 5.1) * 2), gap = hash(i * 2.3 + 1) > .25, w = gap ? 400 : seg_;
      const p = new Path2D(); p.moveTo(x0, top); p.lineTo(x0 + w, top); p.lineTo(x0 + w - 30, top + 120); p.lineTo(x0 + w - 10, H + M); p.lineTo(x0 + 20, H + M); p.lineTo(x0 + 30, top + 140); p.closePath();
      F(ctx, p, '#1b1638'); F(ctx, rr(x0, top - 6, w, 18, 8), '#ff9f7a', .9); F(ctx, rr(x0 + 10, top + 12, w - 20, 10, 5), '#100c26', .6);
    }
  }

  // ------------------------------------------------------------------ NEON FEED VOID
  function feed(ctx, t, o = {}) {
    const sc = o.scroll || 0, pulse = o.pulse || 0;
    sky(ctx, '#12052e', '#2a0b5c', '#0a0320');
    // perspective grid floor + ceiling
    ctx.save(); ctx.strokeStyle = '#b26bff'; ctx.lineWidth = 3;
    for (let k = 0; k < 2; k++) {
      const hy = k ? 760 : 1160, dir = k ? -1 : 1;
      for (let i = -14; i <= 14; i++) { ctx.globalAlpha = .35; ctx.beginPath(); ctx.moveTo(540 + i * 12, hy); ctx.lineTo(540 + i * 260, hy + dir * 1400); ctx.stroke(); }
      for (let j = 0; j < 14; j++) { const z = ((j + (sc / 120) % 1) / 14), y = hy + dir * 1400 * z * z; ctx.globalAlpha = .45 * z; ctx.beginPath(); ctx.moveTo(-M, y); ctx.lineTo(W + M, y); ctx.stroke(); }
    }
    ctx.restore();
    // feed cards streaming upward (blank: no words, no brands)
    for (let i = 0; i < 16; i++) {
      const lane = i % 4, x = [60, 330, 600, 860][lane] + 30 * Math.sin(i), sp = 1 + hash(i) * .8;
      const y = ((hash(i * 9.1) * 2600 - sc * sp) % 2600 + 2600) % 2600 - 400;
      const s = .6 + .5 * hash(i + 3);
      ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate((hash(i + 5) - .5) * .3);
      F(ctx, rr(-120, -150, 240, 300, 26), '#2c1260', .85); K(ctx, rr(-120, -150, 240, 300, 26), '#c88bff', 4, .7);
      F(ctx, rr(-100, -130, 200, 170, 16), lg(ctx, -100, -130, 100, 40, [[0, '#ff5f8f'], [1, '#7b5cff']]), .8);
      F(ctx, P('M-20 -80 L30 -45 L-20 -10 Z'), '#fff', .8);
      F(ctx, rr(-100, 60, 150, 16, 8), '#c88bff', .5); F(ctx, rr(-100, 90, 100, 16, 8), '#c88bff', .35);
      F(ctx, P('M80 70 C80 56 100 56 100 70 C100 56 120 56 120 70 C120 86 100 96 100 102 C100 96 80 86 80 70 Z'), '#ff6fa8', .9);
      ctx.restore();
    }
    if (pulse > 0) { ctx.globalAlpha = .25 * pulse; ctx.fillStyle = '#ff5fd0'; ctx.fillRect(-M, -M, W + 2 * M, H + 2 * M); ctx.globalAlpha = 1; }
  }

  // ------------------------------------------------------------------ ROCK WALL (climb)
  function wall(ctx, t, o = {}) {
    const sc = o.scroll || 0, warm = o.warm == null ? .6 : o.warm;
    sky(ctx, mix('#3a2a7a', '#ff9a6b', warm * .5), mix('#ff9a6b', '#ffd59a', warm), '#ffe2b0');
    range(ctx, 1500 + sc * .1, 300, 160, 21, '#6b4f9e', 0);
    // wall body (right two thirds)
    const p = new Path2D(); p.moveTo(250, -M);
    for (let y = -M; y <= H + M; y += 80) { const i = Math.floor((y - sc) / 80); p.lineTo(250 + 40 * hash(i * 3.3), y); }
    p.lineTo(W + M, H + M); p.lineTo(W + M, -M); p.closePath();
    F(ctx, p, '#3a2c66');
    for (let k = 0; k < 26; k++) {                                         // cracks + holds scrolling down
      const y = ((hash(k * 4.4) * 2800 + sc) % 2800 + 2800) % 2800 - 500, x = 320 + hash(k * 2.2) * 700;
      F(ctx, elp(x, y, 34 + 20 * hash(k), 18, .3 * hash(k + 1)), '#251c48'); F(ctx, elp(x - 6, y - 6, 24 + 14 * hash(k), 10, .3 * hash(k + 1)), '#5b4794', .9);
      K(ctx, P(`M${x + 60} ${y + 30} l40 70 l-20 60`), '#2a2052', 6, .8);
    }
    F(ctx, P(`M250 -${M} L300 -${M} L300 ${H + M} L250 ${H + M} Z`), '#ff9f7a', .25 + .35 * warm);
  }

  // ------------------------------------------------------------------ SUMMIT (sunrise above clouds)
  function summit(ctx, t, o = {}) {
    const rise = o.rise == null ? 1 : o.rise, burst = o.burst || 0;
    sky(ctx, mix('#2a2a6a', '#ff8a5b', rise * .6), mix('#6a4aa0', '#ffc27a', rise), mix('#ffb36b', '#fff0c8', rise));
    rays(ctx, 540, 1000 - 200 * rise, t, .3 + .5 * burst, '#fff2c8');
    const g = ctx.createRadialGradient(540, 1060 - 220 * rise, 20, 540, 1060 - 220 * rise, 520); g.addColorStop(0, 'rgba(255,248,220,1)'); g.addColorStop(.2, 'rgba(255,220,160,.6)'); g.addColorStop(1, 'rgba(255,190,130,0)');
    ctx.fillStyle = g; ctx.fillRect(-M, 300, W + 2 * M, 1500);
    F(ctx, circ(540, 1060 - 220 * rise, 110), '#fffaf0');
    range(ctx, 1320, 220, 150, 31, '#a77cc7', t * 6);
    // cloud sea
    for (let i = 0; i < 14; i++) { const x = ((i * 160 + t * 18 * (1 + hash(i))) % 1700) - 300, y = 1330 + 40 * hash(i + 2); F(ctx, elp(x, y, 160, 60), '#fff1e2', .9); }
    // summit ledge
    const p = P('M200 1960 L300 1250 L380 1236 L700 1236 L790 1250 L880 1960 Z');
    F(ctx, p, '#3a2c66'); F(ctx, P('M300 1250 L380 1236 L700 1236 L790 1250 L760 1290 L330 1290 Z'), '#f4f6ff');
    F(ctx, P('M330 1290 L760 1290 L740 1320 L350 1320 Z'), '#c9c6ee', .8);
    if (burst > 0) { ctx.globalAlpha = .5 * burst; ctx.fillStyle = '#fff6dc'; ctx.fillRect(-M, -M, W + 2 * M, H + 2 * M); ctx.globalAlpha = 1; }
  }

  // ------------------------------------------------------------------ NIGHT ROOFTOPS (city)
  function roofY(x, scroll) { const u = x + scroll, sg = 460, i = Math.floor(u / sg), fr = u - i * sg; if (fr > 360) return 9999; return 1290 - 70 * Math.round(hash(i * 3.7 + 2) * 2); }
  function rooftop(ctx, t, o = {}) {
    const sc = o.scroll || 0, st = o.storm == null ? 1 : o.storm;
    sky(ctx, mix('#2a2a6a', '#16123a', st), mix('#5a3f8f', '#2a1f55', st), mix('#ff9f7a', '#3a2a66', st));
    stars(ctx, t, 30, .6 * (1 - st), 700, 6);
    for (let k = 0; k < 3; k++) {                                     // skyline layers
      const sp = [.1, .25, .5][k], col = [mix('#3c3270', '#241d4a', st), mix('#2c2458', '#1b1640', st), mix('#1f1944', '#120e2e', st)][k], base = [1150, 1220, 1290][k];
      const bw = [90, 120, 150][k], o0 = sc * sp, i0 = Math.floor((o0 - M) / bw);
      for (let i = i0; i < i0 + Math.ceil((W + 2 * M) / bw) + 2; i++) {
        const x = i * bw - o0, h = 140 + 380 * hash(i * 1.9 + k * 11) * (1 - k * .2);
        F(ctx, rr(x, base - h, bw - 8, h + 900, 2), col);
        if (k < 2) for (let w = 0; w < 12; w++) { if (hash(i * 31 + w + k) > .6) F(ctx, rr(x + 12 + (w % 3) * 24, base - h + 20 + Math.floor(w / 3) * 40, 12, 18, 2), '#ffcf7a', .55 - .25 * st); }
      }
    }
    // runnable roofs
    const sg = 460, i0 = Math.floor((sc - M) / sg) - 1;
    for (let i = i0; i < i0 + 6; i++) {
      const x0 = i * sg - sc, top = 1290 - 70 * Math.round(hash(i * 3.7 + 2) * 2);
      F(ctx, rr(x0, top, 360, H + M, 0), mix('#2a2050', '#15112e', st)); F(ctx, rr(x0 - 10, top - 14, 380, 22, 4), mix('#ffb36b', '#7b6aa8', st * .7));
      F(ctx, rr(x0 + 40, top - 70, 60, 56, 4), mix('#3a2f6a', '#1f1a40', st));  // vent
      F(ctx, rr(x0 + 250, top - 120, 10, 106, 3), '#5b4794'); F(ctx, rr(x0 + 230, top - 130, 50, 14, 4), '#5b4794');  // antenna
    }
  }

  // ------------------------------------------------------------------ STORM RIDGE
  function ridge(ctx, t, o = {}) {
    const st = o.storm == null ? 1 : o.storm, sc = o.scroll || 0;
    sky(ctx, mix('#ffb36b', '#1a1440', st), mix('#ffd59a', '#2c2260', st), mix('#fff0c8', '#3a2f6a', st));
    if (st < 1) {
      const g = ctx.createRadialGradient(540, 1000, 20, 540, 1000, 600); g.addColorStop(0, `rgba(255,248,220,${1 - st})`); g.addColorStop(1, 'rgba(255,200,140,0)');
      ctx.fillStyle = g; ctx.fillRect(-M, 200, W + 2 * M, 1600); F(ctx, circ(540, 1000, 100), '#fffaf0', 1 - st);
      rays(ctx, 540, 1000, t, .5 * (1 - st), '#fff2c8');
    }
    range(ctx, 1150, 380, 170, 41, mix('#c58fb8', '#3a2f6a', st), sc * .15);
    range(ctx, 1280, 240, 120, 43, mix('#8a5fa8', '#251d4a', st), sc * .35);
    // ridge path the ninja runs on
    const p = new Path2D(); p.moveTo(-M, H + M);
    for (let x = -M; x <= W + M; x += 40) p.lineTo(x, 1330 - 40 * Math.sin((x + sc) / 240) - 20 * Math.sin((x + sc) / 90));
    p.lineTo(W + M, H + M); p.closePath(); F(ctx, p, mix('#4a3577', '#15102e', st));
    // storm clouds top
    if (st > 0) for (let i = 0; i < 9; i++) { const x = ((i * 170 + t * 30) % 1500) - 200, y = 160 + 90 * hash(i * 2.7); cloud(ctx, x, y, 1.3, t, 1, st); }
  }
  const ridgeY = (x, sc) => 1330 - 40 * Math.sin((x + sc) / 240) - 20 * Math.sin((x + sc) / 90);

  // ------------------------------------------------------------------ FX
  function rays(ctx, cx, cy, t, a, col) {
    if (a <= 0) return;
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * .12);
    for (let i = 0; i < 16; i++) { ctx.rotate(PI / 8); ctx.globalAlpha = a * (i % 2 ? .35 : .6); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(1800, -110); ctx.lineTo(1800, 110); ctx.closePath(); ctx.fill(); }
    ctx.restore(); ctx.globalAlpha = 1;
  }
  /* speed lines: dir 'l'|'r'|'u'|'d' (direction the lines stream TOWARD), area [x0,y0,x1,y1] */
  function speed(ctx, t, o = {}) {
    const n = o.n || 26, col = o.col || '#ffffff', a = o.a == null ? .7 : o.a, [x0, y0, x1, y1] = o.area || [-200, 0, 1280, 1920], d = o.dir || 'l';
    const horiz = d === 'l' || d === 'r', sg = d === 'l' || d === 'u' ? -1 : 1, v = o.v || 4200;
    ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, x1 - x0, y1 - y0); ctx.clip();
    for (let i = 0; i < n; i++) {
      const len = 120 + 320 * hash(i * 1.3), th = 4 + 8 * hash(i * 2.9), span = horiz ? x1 - x0 + len : y1 - y0 + len;
      const pos = ((hash(i * 5.3) * span + sg * t * v * (.6 + .6 * hash(i))) % span + span) % span;
      ctx.globalAlpha = a * (.4 + .6 * hash(i + 7)); ctx.fillStyle = col;
      if (horiz) ctx.fill(rr(x0 + pos - len, y0 + hash(i * 3.7) * (y1 - y0), len, th, th / 2));
      else ctx.fill(rr(x0 + hash(i * 3.7) * (x1 - x0), y0 + pos - len, th, len, th / 2));
    }
    ctx.restore(); ctx.globalAlpha = 1;
  }
  function rain(ctx, t, o = {}) {
    const n = o.n || 120, col = o.col || '#b9c6ff', a = o.a == null ? .55 : o.a, sl = o.slant == null ? .25 : o.slant, len = o.len || 70;
    ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = o.w || 4; ctx.lineCap = 'round';
    for (let i = 0; i < n; i++) {
      const sp = 2400 + 1200 * hash(i * 1.7), y = ((hash(i * 3.3) * 2400 + t * sp) % 2400) - 300, x = hash(i * 7.1) * 1500 - 300 - (y * sl);
      ctx.globalAlpha = a * (.5 + .5 * hash(i)); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - len * sl, y + len); ctx.stroke();
    }
    ctx.restore(); ctx.globalAlpha = 1;
  }
  function bolt(ctx, x0, y0, x1, y1, seed, a = 1, w = 14) {
    if (a <= 0) return;
    const p = new Path2D(); p.moveTo(x0, y0); const n = 9;
    for (let i = 1; i < n; i++) { const u = i / n; p.lineTo(lerp(x0, x1, u) + (hash(seed * 7 + i) - .5) * 160, lerp(y0, y1, u)); }
    p.lineTo(x1, y1);
    K(ctx, p, '#b9a8ff', w * 3, .35 * a); K(ctx, p, '#e9e4ff', w, a); K(ctx, p, '#fff', w * .4, a);
  }
  /* glowing cyan focus aura / shield around (x, y) radius r; k 0..1 strength; ring = timer ring ticks */
  function aura(ctx, x, y, r, t, k = 1) {
    if (k <= 0) return;
    ctx.save();
    for (let i = 4; i >= 1; i--) { ctx.globalAlpha = .08 * k; ctx.fillStyle = '#3ee6ff'; ctx.fill(circ(x, y, r + i * 22)); }
    ctx.globalAlpha = .18 * k; ctx.fillStyle = '#9ff4ff'; ctx.fill(circ(x, y, r));
    ctx.globalAlpha = k; ctx.strokeStyle = '#3ee6ff'; ctx.lineWidth = 10; ctx.stroke(circ(x, y, r));
    ctx.strokeStyle = '#e8fdff'; ctx.lineWidth = 3; ctx.stroke(circ(x, y, r - 4));
    ctx.translate(x, y); ctx.rotate(t * .8);
    for (let i = 0; i < 48; i++) { ctx.rotate(PI / 24); ctx.globalAlpha = k * (i % 4 ? .5 : 1); ctx.fillStyle = '#bff8ff'; ctx.fillRect(r + 16, -3, i % 4 ? 16 : 30, 6); }
    ctx.restore(); ctx.globalAlpha = 1;
  }
  function sparks(ctx, x, y, t, t0, col = '#fff6b0', n = 12, seed = 1) {
    const u = t - t0; if (u < 0 || u > .45) return;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * 2 * PI + hash(seed + i), sp = 500 + 600 * hash(seed * 3 + i), d = sp * u, L = 40 * (1 - u / .45);
      const cx = x + Math.cos(a) * d, cy = y + Math.sin(a) * d + 600 * u * u;
      K(ctx, P(`M${cx} ${cy} L${cx - Math.cos(a) * L} ${cy - Math.sin(a) * L}`), col, 7, 1 - u / .45);
    }
  }
  function puff(ctx, x, y, t, t0, s = 1, col = '#e9e2ff') {
    const u = (t - t0) / .5; if (u < 0 || u > 1) return;
    for (let i = 0; i < 6; i++) { const a = PI + (i / 5) * PI, d = 90 * oC(u) * s; F(ctx, circ(x + Math.cos(a) * d * 1.6, y + Math.sin(a) * d * .4, (26 + 10 * hash(i)) * s * (1 - u * .6)), col, .7 * (1 - u)); }
  }
  function cloud(ctx, x, y, s, t, dark = 1, a = 1) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    const c1 = mix('#ffffff', '#3b3170', dark), c2 = mix('#e9eef8', '#2a2256', dark);
    [[-110, 20, 80], [-40, -20, 100], [50, -10, 90], [120, 25, 70], [0, 30, 110]].forEach(([cx, cy, r]) => F(ctx, circ(cx, cy, r), c2, a));
    [[-100, 10, 66], [-36, -30, 84], [48, -22, 74], [110, 16, 56]].forEach(([cx, cy, r]) => F(ctx, circ(cx, cy - 6, r), c1, a));
    ctx.restore();
  }
  /* streak flame: k 0..1 size/brightness (0 = almost out, flickering) */
  function flame(ctx, x, y, s, t, k = 1) {
    const fl = Math.sin(t * 17) * .06 + Math.sin(t * 29) * .04, h = (.4 + .6 * k) * (1 + fl);
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s * h);
    const g = ctx.createRadialGradient(0, -40, 10, 0, -60, 260); g.addColorStop(0, `rgba(255,120,160,${.5 * k})`); g.addColorStop(1, 'rgba(255,120,160,0)'); ctx.fillStyle = g; ctx.fillRect(-260, -320, 520, 420);
    F(ctx, P(`M0 -230 C40 -160 110 -120 100 -40 C94 20 50 50 0 50 C-50 50 -94 20 -100 -40 C-106 -100 -50 -110 -40 -170 C-20 -130 -10 -120 0 -230 Z`), mix('#ff6fa8', '#5a4b7a', 1 - k));
    F(ctx, P(`M0 -120 C24 -80 60 -60 54 -10 C50 26 26 40 0 40 C-26 40 -50 26 -54 -10 C-56 -50 -20 -60 0 -120 Z`), mix('#ffd0e4', '#8a7aa8', 1 - k));
    ctx.restore();
  }
  function spiral(ctx, x, y, r, t, col = '#c88bff') {
    const p = new Path2D(); for (let a = 0; a < 6 * PI; a += .2) { const rr_ = r * a / (6 * PI); const px = x + Math.cos(a + t * 12) * rr_, py = y + Math.sin(a + t * 12) * rr_; a === 0 ? p.moveTo(px, py) : p.lineTo(px, py); }
    K(ctx, p, col, 5);
  }

  // ------------------------------------------------------------------ action helpers
  function shake(t, hits, amp = 9) {
    let dx = 0, dy = 0;
    for (const h of hits) { const u = t - h; if (u < 0 || u > .3) continue; const e = 1 - u / .3; dx += amp * e * Math.sin(u * 95); dy += amp * .7 * e * Math.cos(u * 77); }
    return { dx: Math.round(dx), dy: Math.round(dy) };
  }
  function flash(t, hits) { let a = 0; for (const h of hits) { const u = t - h; if (u >= 0 && u < .067) a = Math.max(a, 1 - u / .1); } return a; }
  function runPose(t, o = {}) {
    const ph = ((t * (o.rate || 3.2)) % 1), stride = Math.sin(ph * 2 * PI);
    const n = S.ninja.pose(t, Object.assign({}, o, { pose: 'hop', air: (ph < .5 ? ph * 2 : (ph - .5) * 2), r: (o.r == null ? 12 : o.r) }));
    n.y -= Math.abs(stride) * 16 * (o.s || 1); n.legL = 34 * stride; n.legR = -34 * stride; n.armR = -50 * stride; n.armL = 50 * stride;
    return n;
  }
  function drawN(ctx, n, mirror) { if (!mirror) return S.ninja.draw(ctx, n); ctx.save(); ctx.translate(n.x, 0); ctx.scale(-1, 1); ctx.translate(-n.x, 0); S.ninja.draw(ctx, n); ctx.restore(); }
  function drawG(ctx, g, mirror) { if (!mirror) return S.goblin.draw(ctx, g); ctx.save(); ctx.translate(g.x, 0); ctx.scale(-1, 1); ctx.translate(-g.x, 0); S.goblin.draw(ctx, g); ctx.restore(); }
  /* impact star (comic "POW" burst shape, no text) */
  function pow(ctx, x, y, r, t, t0, col = '#fff6b0') {
    const u = (t - t0) / .25; if (u < 0 || u > 1) return;
    const p = new Path2D(); for (let i = 0; i < 20; i++) { const a = i / 20 * 2 * PI, rad = (i % 2 ? .5 : 1) * r * oBack(Math.min(1, u * 2)); i ? p.lineTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad) : p.moveTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad); }
    p.closePath(); F(ctx, p, col, 1 - u * u); K(ctx, p, '#0b1026', 6, 1 - u * u);
  }
  /* smear arc behind a fast move (drawn shape, not blur) */
  function smear(ctx, x0, y0, x1, y1, w, col = '#ffffff', a = .5) {
    const p = new Path2D(); const nx = -(y1 - y0), ny = x1 - x0, L = Math.hypot(nx, ny) || 1, ux = nx / L * w, uy = ny / L * w;
    p.moveTo(x0, y0); p.quadraticCurveTo((x0 + x1) / 2 + ux, (y0 + y1) / 2 + uy, x1 + ux * .5, y1 + uy * .5); p.lineTo(x1 - ux * .5, y1 - uy * .5); p.quadraticCurveTo((x0 + x1) / 2 - ux, (y0 + y1) / 2 - uy, x0, y0); F(ctx, p, col, a);
  }

  S.world = { bedroom, bedroomFg, deskPhone, cliffs, cliffY, feed, wall, summit, rooftop, roofY, ridge, ridgeY, sky, range };
  S.fx = { speed, rain, bolt, aura, sparks, puff, rays, cloud, flame, spiral, stars, pow, smear };
  S.shake = shake; S.flash = flash; S.runPose = runPose; S.drawN = drawN; S.drawG = drawG;
})();
