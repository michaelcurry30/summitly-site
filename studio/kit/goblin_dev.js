/* ==== SUMMIT NINJA show kit (EP1 agent): Scroll Goblin, titleCard, nextTime, speech bubbles, camera, whip-pan,
 * notification shurikens, zoomable phone screens, ninja over-the-shoulder head. Appended to summit.js; every
 * function is a pure function of t (no timers, no state between frames). ====
 *   S.goblin.pose(t, o) -> S.goblin.draw(ctx, g)     the SCROLL GOBLIN (canvas): purple phone-shaped gremlin
 *   S.goblin.eyes(ctx, x, y, s, t, o)                 only his glowing eyes (teasers in the dark)
 *   S.titleCard(stage, n, title) -> seek(t, t0, t1)   "SUMMIT NINJA" + "EPISODE N · TITLE" sting band (≈1.5 s)
 *   S.nextTime(stage, line, o) -> seek(t, t0, t1)     "NEXT TIME ON SUMMIT NINJA…" + line over a dark fade
 *   S.say(stage, html, o) -> seek(t, a, b)            speech bubble (who: ninja | goblin | sensei | narrator)
 *   S.cam(keys) -> at(t), S.camCSS(c, dx, dy)          camera keys [t, zoom, focusX, focusY, dur]; apply to world
 *   S.whip(stage) -> { seek(t, list) -> {dx, dy} }    whip-pan streak overlay + camera offset between shots
 *   S.shuriken(stage, text) -> seek(t, o)             notification card thrown like a shuriken (spins, lands, bounces)
 *   S.screens(phone, srcs) -> seek(t, cuts, zooms)     crossfading, zoomable screenshots inside an S.phone
 *   S.ninjaBack(ctx, x, y, s, t, o)                    back of the ninja's head (over-the-shoulder shots)
 */
(function () {
  'use strict';
  const S = window.Summit;
  if (!S || S.goblin) return;
  const { clamp, seg, oC, iC, ioC, oBack, lerp, tri, hash } = S;
  const PI = Math.PI;
  const P = d => new Path2D(d);
  const rr = (x, y, w, h, r) => { const p = new Path2D(); p.roundRect(x, y, w, h, r); return p; };
  const circ = (x, y, r) => { const p = new Path2D(); p.arc(x, y, r, 0, 2 * PI); return p; };
  const elp = (x, y, rx, ry, rot = 0) => { const p = new Path2D(); p.ellipse(x, y, rx, ry, rot, 0, 2 * PI); return p; };

  // ------------------------------------------------------------------ CSS
  (function css() {
    if (document.getElementById('summit-show-css')) return;
    const st = document.createElement('style'); st.id = 'summit-show-css';
    st.textContent = `
.say { position:absolute; will-change:transform,opacity; box-sizing:border-box; padding:20px 36px 18px; border-radius:46px; background:#fff; color:#0b1026;
  font:800 64px/0.95 BS; text-transform:uppercase; white-space:nowrap; text-align:center; border:7px solid #0b1026; box-shadow:0 12px 0 rgba(0,0,0,.32) }
.say.ninja { box-shadow:0 0 0 6px #3ee6ff, 0 14px 0 rgba(0,0,0,.32) }
.say.goblin { background:#f1e6ff; color:#2a0e5c; border-color:#3c1489; box-shadow:0 0 0 6px #b57bff, 0 14px 0 rgba(0,0,0,.32) }
.say.sensei { background:#f3f1ea; color:#1f2430; border-color:#2b3140; box-shadow:0 0 0 6px #c9d3dd, 0 14px 0 rgba(0,0,0,.32) }
.say.narrator { background:#0b1026; color:#ffd7b8; border-color:#ffb36b; font:400 44px/1.15 PM; letter-spacing:.06em; padding:22px 34px }
.say .tail { position:absolute; top:100%; margin-top:-7px; overflow:visible }
.s-title { left:0; width:1080px; height:330px; background:linear-gradient(180deg,#070b1d,#151a3f); box-shadow:inset 0 7px 0 #3ee6ff, inset 0 -7px 0 #3ee6ff }
.s-title .wm { position:absolute; left:120px; width:840px; top:34px; text-align:center }
.s-title .ep { position:absolute; left:120px; width:840px; top:222px; text-align:center; font:400 40px PM; letter-spacing:.06em; color:#ffd7b8; white-space:nowrap }
.shk { position:absolute; height:118px; box-sizing:border-box; border-radius:30px; background:#f4f6fb; box-shadow:0 10px 0 rgba(0,0,0,.25), 0 0 0 5px rgba(181,123,255,.55);
  padding:0 34px 0 124px; display:flex; align-items:center; font:600 46px HG; color:#0b1026; white-space:nowrap; transform-origin:50% 50%; will-change:transform,opacity }
.shk .ic { position:absolute; left:20px; top:19px; width:80px; height:80px; border-radius:22px; background:linear-gradient(135deg,#ff5f8f,#7b5cff) }
.shk .dot { position:absolute; right:-6px; top:-6px; width:26px; height:26px; border-radius:50%; background:#ff4d6d; border:4px solid #fff }
.s-zw { position:absolute; left:0; top:0; width:356px; transform-origin:0 0; will-change:transform }
.s-zw img { position:absolute; left:0; top:0; width:356px; display:block; will-change:opacity }
.s-ring { position:absolute; box-sizing:border-box; border:4px solid #3ee6ff; border-radius:999px; will-change:opacity }
.s-tap { position:absolute; width:60px; height:60px; margin:-30px 0 0 -30px; border-radius:50%; border:5px solid #fff; box-sizing:border-box; will-change:transform,opacity }
.s-check { position:absolute; border-radius:50%; background:#3ee6ff; will-change:transform,opacity }
`;
    document.head.appendChild(st);
  })();

  // ------------------------------------------------------------------ THE SCROLL GOBLIN
  /* Units at s = 1: feet at (0,0), body (a glowing phone) 224 x 296, ears to ≈ 385 px above the feet,
   * face (screen centre) ≈ 215·s above the feet. Keep the face inside the safe zone (x ≤ 780 when low).
   * o: { x, y (feet), s, pose, p (s since pose start), face, look:[ex,ey], air, bump, r (lean deg), glow 0..1,
   *      armL/armR (outward deg offsets), shadow }
   * poses: idle (bob), pop (springs up from behind cover: squash → stretch), throw (p: wind-up 0–.22, release
   *   .22–.34 — spawn the card at p = .3 — recover to .7), laugh (belly bounce), taunt (hands on hips, sway),
   *   shock (arms up), shrink (wobble + shock), sulk, ride (sitting, legs dangling), angry (stomps).
   * faces: grin, sly, laugh, shock, angry, sulk, blink.  Arms: outward angle from straight down (0 down, 90 out, 180 up, <0 across the belly). */
  function gpose(t, o = {}) {
    const p = o.p || 0, air = o.air == null ? -1 : o.air, bump = o.bump || 0;
    const st = air >= 0 ? Math.sin(PI * air) : 0;
    const bob = Math.sin(2 * PI * 1.3 * t);
    let sx = (1 + .1 * bump - .05 * st) * (1 - .015 * bob), sy = (1 - .14 * bump + .09 * st) * (1 + .025 * bob);
    let armL = 24 + 6 * bob, armR = 24 - 6 * bob, legL = 0, legR = 0, r = o.r || 0, face = 'grin', hop = 0;
    let look = o.look || [0, 0], sweat = 0;
    if (air >= 0) { armL += 60 * st; armR += 60 * st; legL = -10 * st; legR = -10 * st; }
    switch (o.pose || 'idle') {
      case 'pop': {
        const b = seg(p, .1, .5);
        sy *= p < .1 ? lerp(1, .6, oC(p / .1)) : lerp(.6, 1, oBack(b)); sx *= p < .1 ? lerp(1, 1.3, oC(p / .1)) : lerp(1.3, 1, oBack(b));
        armL = lerp(140, armL, oC(seg(p, .2, .6))); armR = lerp(140, armR, oC(seg(p, .2, .6)));
        face = p < .35 ? 'shock' : 'grin'; break;
      }
      case 'throw': {
        const w = ioC(seg(p, 0, .22)), rl = oC(seg(p, .22, .34)), rc = ioC(seg(p, .34, .7));
        armR = lerp(lerp(armR, 165, w), -55, rl); armR = lerp(armR, 24, rc);
        armL = lerp(armL, 70, w * (1 - rc));
        r += -12 * w * (1 - rl) + 14 * rl * (1 - rc);
        sx *= 1 + .1 * w * (1 - rl) - .06 * rl * (1 - rc); sy *= 1 - .1 * w * (1 - rl) + .1 * rl * (1 - rc);
        face = p < .22 ? 'sly' : p < .75 ? 'laugh' : 'grin'; break;
      }
      case 'laugh': {
        const k = Math.abs(Math.sin(2 * PI * 2.4 * p)); hop = -16 * k; sy *= 1 - .07 * (1 - k); sx *= 1 + .05 * (1 - k);
        armL = -40 + 8 * k; armR = -40 + 8 * k; face = 'laugh'; break;
      }
      case 'taunt': { const w = Math.sin(2 * PI * 1.6 * p); r += 7 * w; armL = 20 + 30 * w; armR = 20 - 30 * w; face = 'sly'; break; }
      case 'shock': { const k = oBack(seg(p, 0, .25)); armL = lerp(armL, 150, k); armR = lerp(armR, 150, k); sy *= 1 + .08 * tri(p, 0, .3); face = 'shock'; break; }
      case 'shrink': {
        const w = Math.sin(2 * PI * 5 * p) * Math.exp(-p * 2.5); r += 10 * w; sx *= 1 + .08 * w; sy *= 1 - .08 * w;
        armL = 130 + 20 * w; armR = 130 - 20 * w; face = 'shock'; sweat = 1; break;
      }
      case 'sulk': { armL = -30; armR = -30; sy *= .96; face = 'sulk'; look = o.look || [-4, 8]; break; }
      case 'ride': { const w = Math.sin(2 * PI * 1.4 * t); legL = 18 * w; legR = -18 * w; armL = 50; armR = 50; break; }
      case 'angry': { const k = Math.abs(Math.sin(2 * PI * 3 * p)); hop = -10 * k; armL = 100 + 30 * k; armR = 100 + 30 * k; face = 'angry'; r += 4 * Math.sin(2 * PI * 6 * p); break; }
    }
    if (o.face) face = o.face;
    if (face === 'grin' || face === 'sly' || face === 'angry') {        // blink every ~2.6 s
      const ph = (t + (o.blinkSeed || 0)) % 2.6; if (ph > 2.48) face = 'blink';
    }
    return { t, x: o.x || 0, y: (o.y || 0) + hop * (o.s || 1), s: o.s || 1, sx, sy, r, armL: armL + (o.armL || 0), armR: armR + (o.armR || 0),
      legL, legR, face, look, glow: o.glow == null ? 1 : o.glow, shadow: o.shadow == null ? 1 : o.shadow, sweat: o.sweat == null ? sweat : o.sweat, air };
  }

  const INK = '#240b45';
  function gdraw(ctx, g) {
    const f = (p, c, a = 1) => { ctx.globalAlpha = a; ctx.fillStyle = c; ctx.fill(p); ctx.globalAlpha = 1; };
    const k = (p, c, w, a = 1) => { ctx.globalAlpha = a; ctx.strokeStyle = c; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke(p); ctx.globalAlpha = 1; };
    ctx.save(); ctx.translate(g.x, g.y); ctx.scale(g.s, g.s);
    if (g.shadow > 0) f(elp(0, 0, 112, 16), '#000', .35 * g.shadow * (g.air >= 0 ? .6 : 1));
    ctx.rotate(g.r * PI / 180); ctx.scale(g.sx, g.sy);
    if (g.glow > 0) {                                                    // soft halo, alpha kept low
      const gr = ctx.createRadialGradient(0, -200, 40, 0, -200, 270);
      gr.addColorStop(0, `rgba(196,130,255,${(.24 * g.glow).toFixed(3)})`); gr.addColorStop(1, 'rgba(196,130,255,0)');
      ctx.fillStyle = gr; ctx.fillRect(-300, -480, 600, 560);
    }
    // legs
    [[-46, g.legL], [46, g.legR]].forEach(([lx, lr]) => {
      ctx.save(); ctx.translate(lx, -60); ctx.rotate(lr * PI / 180);
      f(rr(-17, -14, 34, 66, 17), '#3b1d75'); f(elp(lx < 0 ? -6 : 6, 52, 31, 13), '#22104a'); ctx.restore();
    });
    // ears (behind the body)
    f(P('M-92 -296 L-156 -388 L-44 -330 Z'), '#6d43d6'); f(P('M-92 -306 L-136 -366 L-62 -330 Z'), '#ff8fd0');
    f(P('M92 -296 L156 -388 L44 -330 Z'), '#6d43d6'); f(P('M92 -306 L136 -366 L62 -330 Z'), '#ff8fd0');
    // body = phone
    const body = rr(-112, -338, 224, 296, 62);
    const bg = ctx.createLinearGradient(0, -338, 0, -42); bg.addColorStop(0, '#9d70ff'); bg.addColorStop(1, '#5a2bc4');
    ctx.fillStyle = bg; ctx.fill(body); k(body, '#251050', 9);
    f(rr(-122, -276, 12, 44, 6), '#3a1a7a'); f(rr(-122, -222, 12, 30, 6), '#3a1a7a'); f(rr(110, -262, 12, 54, 6), '#3a1a7a');
    f(P('M-96 -300 C-80 -330 -40 -332 -10 -330 C-60 -320 -84 -300 -92 -270 Z'), '#c7a6ff', .55);  // rim light
    // screen glow
    const scr = rr(-90, -314, 180, 250, 44);
    const sg = ctx.createRadialGradient(0, -200, 10, 0, -200, 170);
    sg.addColorStop(0, '#fff0ff'); sg.addColorStop(.5, lerpC('#b98cf0', '#e3b6ff', g.glow)); sg.addColorStop(1, '#7a45e0');
    ctx.fillStyle = sg; ctx.fill(scr);
    f(rr(-30, -304, 60, 16, 8), '#251050');                              // island
    // face
    drawFace(ctx, g, f, k);
    // badge
    f(circ(102, -330, 21), '#ff4d6d'); k(circ(102, -330, 21), '#fff', 5);
    // arms (in front)
    [[-1, g.armL], [1, g.armR]].forEach(([sd, a]) => {
      const sx0 = sd * 104, sy0 = -178, rad = a * PI / 180, ex = sx0 + sd * Math.sin(rad) * 78, ey = sy0 + Math.cos(rad) * 78;
      k(P(`M${sx0} ${sy0} L${ex.toFixed(1)} ${ey.toFixed(1)}`), '#251050', 38); k(P(`M${sx0} ${sy0} L${ex.toFixed(1)} ${ey.toFixed(1)}`), '#7a4ce0', 26);
      f(circ(ex, ey, 21), '#9d70ff'); k(circ(ex, ey, 21), '#251050', 6);
    });
    if (g.sweat > 0) { const sw = P('M118 -300 C128 -284 134 -274 126 -266 C118 -260 108 -268 112 -280 Z'); f(sw, '#bff6ff', g.sweat); k(sw, '#3ee6ff', 3, g.sweat); }
    ctx.restore();
  }
  function lerpC(a, b, p) {
    const A = [1, 3, 5].map(i => parseInt(a.substr(i, 2), 16)), B = [1, 3, 5].map(i => parseInt(b.substr(i, 2), 16));
    return 'rgb(' + A.map((v, i) => Math.round(lerp(v, B[i], clamp(p)))).join(',') + ')';
  }
  function drawFace(ctx, g, f, k) {
    const [lx, ly] = g.look, face = g.face, EY = -228;
    const brow = d => k(P(d), INK, 11);
    const eyes = (rx, ry, pr, lid) => {
      [-40, 40].forEach(ex => {
        f(elp(ex, EY, rx, ry), '#fff'); k(elp(ex, EY, rx, ry), INK, 5);
        ctx.save(); ctx.clip(elp(ex, EY, rx, ry));
        f(circ(ex + lx, EY + ly + 3, pr), INK); f(circ(ex + lx + pr * .35, EY + ly - pr * .3, pr * .38), '#fff');
        if (lid) {                                                       // upper lid: lid 0..1 of the eye, slant toward the nose
          const sl = ex < 0 ? 1 : -1, top = EY - ry - 2, cut = EY - ry + 2 * ry * lid;
          f(P(`M${ex - rx - 2} ${top} L${ex + rx + 2} ${top} L${ex + rx + 2} ${cut + sl * 7} L${ex - rx - 2} ${cut - sl * 7} Z`), '#c79cf6');
          k(P(`M${ex - rx - 2} ${cut - sl * 7} L${ex + rx + 2} ${cut + sl * 7}`), INK, 5);
        }
        ctx.restore();
      });
    };
    const grin = (open) => {
      const m = P(`M-70 -168 Q0 -150 70 -168 Q54 ${-118 + open} 0 ${-112 + open} Q-54 ${-118 + open} -70 -168 Z`);
      f(m, INK); ctx.save(); ctx.clip(m);
      f(P('M-70 -170 L70 -170 L70 -156 L58 -146 L47 -158 L35 -146 L23 -158 L12 -146 L0 -158 L-12 -146 L-23 -158 L-35 -146 L-47 -158 L-58 -146 L-70 -156 Z'), '#fff');
      f(elp(0, -116 + open, 30, 14 + open * .3), '#ff6fa8'); ctx.restore(); k(m, INK, 5);
    };
    switch (face) {
      case 'laugh':
        brow('M-66 -282 Q-42 -296 -18 -284 M18 -284 Q42 -296 66 -282');
        k(P('M-62 -224 Q-40 -252 -18 -224 M18 -224 Q40 -252 62 -224'), INK, 10);
        grin(16); break;
      case 'shock':
        brow('M-68 -292 Q-44 -306 -20 -294 M20 -294 Q44 -306 68 -292');
        eyes(31, 35, 8, 0);
        f(elp(0, -136, 18, 24), INK); f(elp(0, -128, 10, 10), '#ff6fa8'); break;
      case 'angry':
        brow('M-68 -286 L-18 -262 M18 -262 L68 -286');
        eyes(26, 28, 12, .3);
        f(rr(-56, -164, 112, 38, 14), INK); f(rr(-48, -158, 96, 26, 8), '#fff'); k(P('M-24 -158 V-132 M0 -158 V-132 M24 -158 V-132 M-48 -145 H48'), INK, 4); break;
      case 'sulk':
        brow('M-66 -266 L-18 -282 M18 -282 L66 -266');
        eyes(25, 27, 11, .5);
        k(P('M-34 -138 Q0 -160 34 -138'), INK, 9); break;
      case 'blink':
        brow('M-66 -280 L-18 -270 M18 -270 L66 -280');
        k(P('M-62 -228 Q-40 -220 -18 -228 M18 -228 Q40 -220 62 -228'), INK, 9);
        grin(0); break;
      case 'sly':
        brow('M-68 -276 L-18 -262 M18 -262 L68 -276');
        eyes(27, 30, 12, .45); grin(4); break;
      default:                                                           // grin
        brow('M-66 -280 L-18 -270 M18 -270 L66 -280');
        eyes(27, 30, 13, .22); grin(6);
    }
  }
  /* S.goblin.eyes(ctx, x, y, s, t, { open 0..1, look:[x,y] }): just the eyes, glowing in the dark (teasers) */
  function geyes(ctx, x, y, s, t, o = {}) {
    const open = clamp(o.open == null ? 1 : o.open, 0, 1.3), [lx, ly] = o.look || [0, 0];
    if (open <= .01) return;
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    for (let i = 5; i >= 1; i--) {                                      // concentric glow rings (no blur filter)
      ctx.globalAlpha = .07 * open; ctx.fillStyle = '#c77dff';
      ctx.fill(elp(-70, 0, 46 + i * 14, (34 + i * 12) * open)); ctx.fill(elp(70, 0, 46 + i * 14, (34 + i * 12) * open));
    }
    ctx.globalAlpha = 1;
    [-70, 70].forEach(ex => {
      const sl = ex < 0 ? 1 : -1, e = new Path2D();
      e.moveTo(ex - 50, 6 * open); e.quadraticCurveTo(ex, -44 * open + sl * 0, ex + 50, 6 * open); e.quadraticCurveTo(ex, 40 * open, ex - 50, 6 * open);
      ctx.save(); ctx.translate(0, 0); ctx.rotate(sl * .12);
      ctx.fillStyle = '#ffe9ff'; ctx.fill(e);
      ctx.save(); ctx.clip(e); ctx.fillStyle = '#7b2cff'; ctx.fill(circ(ex + lx, 4 + ly, 22)); ctx.fillStyle = '#12051f'; ctx.fill(circ(ex + lx, 4 + ly, 11)); ctx.restore();
      ctx.restore();
    });
    ctx.restore();
  }
  S.goblin = { pose: gpose, draw: gdraw, eyes: geyes };

  // ------------------------------------------------------------------ title card
  /* S.titleCard(stage, n, title, { top = 560 }) -> { seek(t, t0, t1) }
   * A navy band with cyan edges slides in from the left at t0 (katana-shing: put sfx 'shing' at t0 + .22),
   * "SUMMIT NINJA" wordmark + "EPISODE N · TITLE" kicker rise in, a blade glint sweeps, texts fade before t1,
   * band leaves to the right by t1. Same design in every episode. Keep other words and the canvas off the band. */
  function titleCard(parent, n, title, o = {}) {
    const top = o.top == null ? 560 : o.top;
    const band = S.el(parent, 'div', 'abs s-title', `top:${top}px;opacity:0`);
    const glint = S.svg(band, 'abs', `<path d="M-40 304 L1120 292" stroke="#3ee6ff" stroke-width="16" stroke-linecap="round" opacity=".5"/><path d="M-40 304 L1120 292" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`, 'overflow:visible;left:0;top:0;width:1080px;height:330px');
    glint.setAttribute('width', 1080); glint.setAttribute('height', 330);
    const wm = S.el(band, 'div', 'abs wm head', 'opacity:0', `<div><span data-max="170">SUMMIT <span class="cy" style="display:inline">NINJA</span></span></div>`);
    const ep = S.el(band, 'div', 'abs ep', 'opacity:0', `EPISODE ${n} · ${String(title).toUpperCase()}`);
    const gp = [...glint.querySelectorAll('path')];
    return {
      els: [band, wm, ep],
      seek(t, t0, t1) {
        const inn = oC(seg(t, t0, t0 + .24)), out = iC(seg(t, t1 - .22, t1));
        band.style.opacity = t >= t0 && t <= t1 ? 1 : 0;
        band.style.transform = `translateX(${Math.round(-1100 * (1 - inn) + 1100 * out)}px)`;
        const tf = 1 - seg(t, t1 - .5, t1 - .3);
        S.show(wm, t, t0 + .26, 1e9, { dy: 34 }); wm.style.opacity = (parseFloat(wm.style.opacity) * tf).toFixed(3);
        S.show(ep, t, t0 + .4, 1e9, { dy: -20 }); ep.style.opacity = (parseFloat(ep.style.opacity) * tf).toFixed(3);
        const L = 1170, sp = oC(seg(t, t0 + .2, t0 + .38)), so = 1 - seg(t, t0 + .45, t0 + .8);
        gp.forEach(p => { p.style.strokeDasharray = `${L} ${L}`; p.style.strokeDashoffset = (L * (1 - sp)).toFixed(1); });
        glint.style.opacity = (t >= t0 + .2 ? so : 0).toFixed(3);
      }
    };
  }
  S.titleCard = titleCard;

  // ------------------------------------------------------------------ next time teaser
  /* S.nextTime(stage, line, { top = 300, max = 120, dim = 1 (darkness 0..1) }) -> { dark, kick, line, seek(t, t0, t1) }
   * Creates (in this order) a stage-wide dark fade (data-bg), the kicker "NEXT TIME ON SUMMIT NINJA…" and an
   * orange headline `line`. Create it after the world canvas so the darkness covers the scene; draw glowing eyes
   * (S.goblin.eyes) on a canvas created after it, away from the words. */
  function nextTime(parent, line, o = {}) {
    const top = o.top == null ? 300 : o.top;
    const dark = S.el(parent, 'div', 'abs full', 'background:radial-gradient(ellipse at 50% 45%,rgba(10,6,28,.86),rgba(3,3,10,.97) 70%);opacity:0');
    dark.setAttribute('data-bg', 'teaser');
    const kick = S.kicker(parent, 'NEXT TIME ON SUMMIT NINJA…', { top, style: 'letter-spacing:.1em;color:#3ee6ff' });
    const head = S.text(parent, `<div class="or">${line}</div>`, { top: top + 74, max: o.max || 120 });
    return {
      dark, kick, line: head,
      seek(t, t0, t1) {
        dark.style.opacity = ((o.dim == null ? 1 : o.dim) * seg(t, t0, t0 + .3) * (1 - seg(t, t1 - .1, t1 + .2))).toFixed(3);
        S.show(kick, t, t0 + .1, t1 - .25, { dy: 20 });
        S.show(head, t, t0 + .3, t1 - .25, { dy: 30 });
      }
    };
  }
  S.nextTime = nextTime;

  // ------------------------------------------------------------------ speech bubbles
  /* S.say(stage, html, { who = 'ninja', x, y, right, tail: { x, dir: -1|1, up, len } , size, style }) -> { el, seek(t, a, b, { shake }) }
   * Opaque comic bubble; x/y = top-left (or `right` = distance of its right edge from the stage's right edge).
   * tail.x = px from the bubble's left edge, dir = which way the tip leans, up = tail on top (speaker above).
   * Pops in at a (0.3 s overshoot rise), leaves at b (0.2 s). Keep it clear of faces, the phone and other words. */
  const BUBBLE_COL = { ninja: ['#fff', '#0b1026'], goblin: ['#f1e6ff', '#3c1489'], sensei: ['#f3f1ea', '#2b3140'], narrator: ['#0b1026', '#ffb36b'] };
  function say(parent, html, o = {}) {
    const who = o.who || 'ninja';
    const pos = o.right != null ? `right:${o.right}px` : `left:${o.x == null ? 160 : o.x}px`;
    const e = S.el(parent, 'div', `say ${who}`, `${pos};top:${o.y == null ? 300 : o.y}px;opacity:0;${o.size ? `font-size:${o.size}px;` : ''}${o.style || ''}`, html);
    if (o.tail !== false && who !== 'narrator') {
      const tl = o.tail || {}, [bgc, bdc] = BUBBLE_COL[who] || BUBBLE_COL.ninja, len = tl.len || 54, d = tl.dir == null ? -1 : tl.dir;
      const tip = 22 + d * 30;
      const sv = S.svg(e, 'tail', `<path d="M0 0 L${tip} ${len} L44 0" fill="${bgc}" stroke="${bdc}" stroke-width="7" stroke-linejoin="round"/><path d="M4 -1 L40 -1" stroke="${bgc}" stroke-width="10"/>`, `overflow:visible;left:${tl.x == null ? 60 : tl.x}px;width:44px;height:${len}px;${tl.up ? `top:auto;bottom:100%;margin-bottom:-7px;transform:scaleY(-1)` : ''}`);
      sv.setAttribute('width', 44); sv.setAttribute('height', len);
    }
    return {
      el: e,
      seek(t, a, b, so = {}) {
        const pin = seg(t, a, a + .12), pout = seg(t, b, b + .2), op = pin * (1 - pout);
        const y = (1 - oBack(seg(t, a, a + .32))) * 46 - 22 * iC(pout);
        const sh = so.shake ? Math.round(7 * Math.sin(2 * PI * 14 * (t - a)) * (1 - seg(t, a, a + .5))) : 0;
        e.style.opacity = op.toFixed(3);
        e.style.transform = `translate(${sh}px,${Math.round(y)}px)`;
      }
    };
  }
  S.say = say;

  // ------------------------------------------------------------------ camera
  /* S.cam(KEYS) -> at(t) = { z, fx, fy, tx, ty }   KEYS: [[t, zoom, focusX, focusY, dur = .6], ...]
   * Each key means "arrive at this framing by t", moving (ease in-out) over the `dur` seconds before it; dur 0 = cut.
   * The focus point (world px) lands at the stage centre (540, 960), clamped so the 1080x1920 world always fills
   * the frame (zoom ≥ 1). Apply with el.style.transform = S.camCSS(c, dx, dy) (transform-origin 0 0) and
   * ctx.setTransform(c.z, 0, 0, c.z, c.tx + dx, c.ty + dy) for canvas layers; S.camPt(c, x, y) maps a world point. */
  function cam(KEYS) {
    const frame = (z, fx, fy) => {
      const tx = clamp(540 - fx * z, 1080 - 1080 * z, 0), ty = clamp(960 - fy * z, 1920 - 1920 * z, 0);
      return { z, fx, fy, tx, ty };
    };
    return t => {
      let i = 0; while (i + 1 < KEYS.length && t >= KEYS[i + 1][0]) i++;      // last key already reached
      const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
      if (a === b) return frame(a[1], a[2], a[3]);
      const d = b[4] == null ? .6 : b[4], st = Math.max(a[0], b[0] - d), p = d <= 0 || b[0] <= st ? (t >= b[0] ? 1 : 0) : ioC(seg(t, st, b[0]));
      // interpolate the resulting translation (not the focus) so zooms stay steady
      const A = frame(a[1], a[2], a[3]), B = frame(b[1], b[2], b[3]);
      return { z: lerp(A.z, B.z, p), fx: lerp(a[2], b[2], p), fy: lerp(a[3], b[3], p), tx: lerp(A.tx, B.tx, p), ty: lerp(A.ty, B.ty, p) };
    };
  }
  S.cam = cam;
  S.camCSS = (c, dx = 0, dy = 0) => `translate(${(c.tx + dx).toFixed(2)}px,${(c.ty + dy).toFixed(2)}px) scale(${c.z.toFixed(4)})`;
  S.camPt = (c, x, y, dx = 0, dy = 0) => ({ x: x * c.z + c.tx + dx, y: y * c.z + c.ty + dy });

  // ------------------------------------------------------------------ whip pan
  /* S.whip(stage) -> { seek(t, WHIPS) -> { dx, dy } }   WHIPS: [[tCut, dir], ...], dir 'l' | 'r' | 'u' | 'd' (direction the
   * camera pans). Over .16 s before tCut the shot slides out, the streak overlay peaks at the cut (switch shots
   * exactly at tCut), and the next shot slides in over .2 s. Add the returned offset to the camera (camCSS / ctx).
   * Put sfx whoosh_short (align cut) on tCut. No blur: just speed streaks. */
  function whip(parent) {
    const wrap = S.el(parent, 'div', 'abs full', 'opacity:0;overflow:hidden'); wrap.setAttribute('data-bg', 'whip');
    const h = S.el(wrap, 'div', 'abs', 'left:-1080px;top:0;width:3240px;height:1920px;background:repeating-linear-gradient(180deg,rgba(255,210,170,.0) 0 26px,rgba(255,210,170,.55) 26px 30px,rgba(62,230,255,.0) 30px 71px,rgba(62,230,255,.45) 71px 74px,rgba(20,18,50,.0) 74px 120px),linear-gradient(90deg,#1a1640,#3a2a64 50%,#1a1640)');
    const v = S.el(wrap, 'div', 'abs', 'left:0;top:-1920px;width:1080px;height:5760px;background:repeating-linear-gradient(90deg,rgba(255,210,170,0) 0 26px,rgba(255,210,170,.55) 26px 30px,rgba(62,230,255,0) 30px 71px,rgba(62,230,255,.45) 71px 74px,rgba(20,18,50,0) 74px 120px),linear-gradient(180deg,#1a1640,#3a2a64 50%,#1a1640)');
    return {
      el: wrap,
      seek(t, W) {
        let dx = 0, dy = 0, op = 0, vert = false, ph = 0;
        for (const [w, d] of W) {
          if (t < w - .16 || t > w + .2) continue;
          const sx = d === 'l' ? 1 : d === 'r' ? -1 : 0, sy = d === 'u' ? 1 : d === 'd' ? -1 : 0;
          const off = t < w ? -1250 * iC(seg(t, w - .16, w)) : 1250 * (1 - oC(seg(t, w, w + .2)));
          dx = sx * off; dy = sy * off; vert = !!sy;
          op = Math.max(op, seg(t, w - .1, w - .03) * (1 - seg(t, w + .04, w + .14)));
          ph = (t - w) * (sx || sy) * 5200;
        }
        wrap.style.opacity = op.toFixed(3);
        h.style.opacity = vert ? 0 : 1; v.style.opacity = vert ? 1 : 0;
        h.style.transform = `translateX(${Math.round(ph % 1080)}px)`; v.style.transform = `translateY(${Math.round(ph % 1920)}px)`;
        return { dx, dy };
      }
    };
  }
  S.whip = whip;

  // ------------------------------------------------------------------ notification shuriken
  /* S.shuriken(stage, text) -> { el, seek(t, o) }   generic notification card ("Scroll" style, never a real brand)
   * o: { t0 (thrown), t1 (lands), from:[cx,cy], to:[cx,cy] (card centre, stage px), spin (turns, default 1), arc px,
   *      bounce: tHit (deflects off a shield: flies up-and-away and fades), dir (-1/1 bounce side), out (fade-out time) }
   * Its words are hidden while it spins (blank card) and fade in as it lands, so they never leave the safe zone.
   * Card width ≈ 120 + 25 px per character; keep landed cards inside x 120–960 and apart from each other. */
  const STAR = '<svg width="80" height="80" style="position:absolute;left:0;top:0"><path d="M40 10 L48 32 L70 40 L48 48 L40 70 L32 48 L10 40 L32 32 Z" fill="#fff"/></svg>';
  function shuriken(parent, txt) {
    const e = S.el(parent, 'div', 'shk', 'left:0;top:0;opacity:0', `<div class="ic">${STAR}</div><span>${txt}</span><div class="dot"></div>`);
    const word = e.querySelector('span');
    let W = 0, H = 118;
    return {
      el: e,
      seek(t, o) {
        if (!W) W = e.offsetWidth || 700;
        const t0 = o.t0, t1 = o.t1, k = seg(t, t0, t1), ee = oC(k), spin = o.spin == null ? 1 : o.spin;
        const [fx, fy] = o.from, [tx, ty] = o.to;
        let x = lerp(fx, tx, ee), y = lerp(fy, ty, ee) - (o.arc == null ? 140 : o.arc) * Math.sin(PI * k);
        let rot = -360 * spin * (1 - ee) + (t > t1 ? -3 + 3 * Math.sin(2 * PI * 1.1 * (t - t1)) : -3);
        if (t > t1) y += 5 * Math.sin(2 * PI * .9 * (t - t1));
        let op = t >= t0 ? seg(t, t0, t0 + .06) : 0, wop = seg(k, .72, .95);
        const safeK = (cx, cy) => o.safe ? seg(Math.min(cx - W / 2 - 125, 955 - cx - W / 2, cy - 250 - H / 2 + 59, 1250 - cy - H / 2), 0, 25) : 1;
        if (o.bounce != null && t >= o.bounce) {
          const u = t - o.bounce, d = o.dir || 1;
          x += d * 900 * u; y += -700 * u + 1400 * u * u; rot += d * 540 * u;
          op *= 1 - seg(u, .1, .28); wop *= 1 - seg(u, 0, .08);
        }
        if (o.out != null) { op *= 1 - seg(t, o.out, o.out + .25); wop *= 1 - seg(t, o.out - .05, o.out + .1); y -= 40 * iC(seg(t, o.out, o.out + .25)); }
        wop *= safeK(x, y) * (Math.abs(((rot % 360) + 540) % 360 - 180) < 14 ? 1 : 0);   // words only while upright and inside the safe zone
        e.style.opacity = op.toFixed(3); word.style.opacity = wop.toFixed(3);
        e.style.transform = `translate(${Math.round(x - W / 2)}px,${Math.round(y - H / 2)}px) rotate(${rot.toFixed(2)}deg)`;
      }
    };
  }
  S.shuriken = shuriken;

  // ------------------------------------------------------------------ zoomable phone screens
  /* S.screens(phone, srcs, { natW = 880, natH = 1912 }) -> { zw, imgs, add(html, style), seek(t, cuts, zooms), map(t, zooms, sx, sy) }
   * Replaces the S.phone screenshot with stacked screenshots inside a zoom wrapper.
   *   cuts:  [[t, index], ...] crossfade (0.2 s) to screenshot `index` at t (the first entry shows from the start)
   *   zooms: [[t, z, fx, fy], ...] arrive by t (0.6 s ease); fx/fy = focus in ORIGINAL screenshot px, placed at the
   *          screen point o.ax/o.ay (default screen centre 178, 387). Overlays added with add() zoom with the image
   *          (their coordinates are in unzoomed screen px: 356 wide).  map() -> screen-space point within the phone. */
  function screens(phone, srcs, o = {}) {
    const natW = o.natW || 880, natH = o.natH || 1912, K = 356 / natW, AX = o.ax == null ? 178 : o.ax, AY = o.ay == null ? 387 : o.ay;
    const sc = phone.el.querySelector('.sc'), sheen = sc.querySelector('.sheen');
    const old = sc.querySelector('img'); if (old) old.remove();
    const tog = sc.querySelector('.s-tog');
    const zw = document.createElement('div'); zw.className = 's-zw'; zw.style.height = Math.round(natH * K) + 'px';
    sc.insertBefore(zw, sheen);
    const imgs = srcs.map(s => { const im = document.createElement('img'); im.src = s; im.alt = ''; zw.appendChild(im); return im; });
    if (tog) zw.appendChild(tog);                                         // strict toggle zooms with the screenshot
    const zoomAt = (t, Z) => {
      let i = 0; while (i + 1 < Z.length && t >= Z[i + 1][0]) i++;
      const a = Z[i], b = Z[Math.min(i + 1, Z.length - 1)], p = a === b ? 0 : ioC(seg(t, Math.max(a[0], b[0] - .6), b[0]));
      return { z: lerp(a[1], b[1], p), fx: lerp(a[2], b[2], p), fy: lerp(a[3], b[3], p) };
    };
    const frame = (t, Z) => {
      const { z, fx, fy } = zoomAt(t, Z), w = 356 * z, h = natH * K * z;
      return { z, tx: clamp(AX - fx * K * z, 356 - w, 0), ty: clamp(AY - fy * K * z, 774 - h, 0) };
    };
    return {
      zw, imgs, K,
      add(html, style) { const d = document.createElement('div'); d.innerHTML = html; const e = d.firstElementChild; if (style) e.setAttribute('style', style); zw.appendChild(e); return e; },
      seek(t, cuts, Z) {
        const f = frame(t, Z);
        zw.style.transform = `translate(${f.tx.toFixed(2)}px,${f.ty.toFixed(2)}px) scale(${f.z.toFixed(4)})`;
        imgs.forEach((im, i) => {
          let op = 0;
          cuts.forEach(([ct, idx], j) => {
            const nx = cuts[j + 1];
            if (idx === i && t >= (j === 0 ? -1e9 : ct) && !(nx && t >= nx[0] + .2)) op = Math.max(op, j === 0 ? 1 : seg(t, ct, ct + .2));
          });
          im.style.opacity = op.toFixed(3); im.style.zIndex = String(cuts.findIndex(c => c[1] === i) + 1);
        });
      },
      map(t, Z, sx, sy) { const f = frame(t, Z); return { x: 12 + f.tx + sx * K * f.z, y: 12 + f.ty + sy * K * f.z }; }
    };
  }
  S.screens = screens;

  // ------------------------------------------------------------------ ninja, back of the head (over-the-shoulder)
  /* S.ninjaBack(ctx, x, y, s, t, { r, nod }) — the hero seen from behind: hood, cyan headband knot with fluttering tails,
   * shoulders. (x, y) = centre of the head; at s = 1 the head is 224 px wide. */
  function ninjaBack(ctx, x, y, s, t, o = {}) {
    const f = (p, c, a = 1) => { ctx.globalAlpha = a; ctx.fillStyle = c; ctx.fill(p); ctx.globalAlpha = 1; };
    ctx.save(); ctx.translate(x, y + (o.nod || 0)); ctx.scale(s, s); ctx.rotate((o.r || 0) * PI / 180);
    f(P('M-230 420 C-220 220 -150 130 0 120 C150 130 220 220 230 420 Z'), '#1c2130');      // shoulders
    f(P('M60 140 C150 150 210 220 226 420 L120 420 C120 300 100 200 60 140 Z'), '#10131b');
    f(P('M-220 300 C-200 200 -140 150 -60 136'), '#3ee6ff', 0); ctx.strokeStyle = '#3ee6ff'; ctx.lineWidth = 6; ctx.globalAlpha = .8; ctx.stroke(P('M-222 330 C-206 214 -140 152 -56 138')); ctx.globalAlpha = 1;
    f(circ(0, 0, 112), '#1c2130'); f(P('M40 -104 A112 112 0 0 1 60 96 A124 124 0 0 0 40 -104 Z'), '#10131b');
    f(P('M-80 -78 A112 112 0 0 1 0 -112 C-50 -100 -76 -80 -96 -50 Z'), '#2c3446');
    f(P('M-112 -26 C-50 -46 50 -46 112 -26 L110 4 C50 -16 -50 -16 -110 4 Z'), '#3ee6ff');   // headband
    const w = 2 * PI * 1.8, a = Math.sin(w * t) * 10, b = Math.sin(w * t + 1.3) * 14;
    f(P(`M6 -14 C40 ${10 + a} 70 ${40 + b} 96 ${90 + b} C80 ${60 + a} 50 ${30 + a} 10 0 Z`), '#3ee6ff');
    f(P(`M-6 -14 C-30 ${16 + b} -40 ${50 + a} -36 ${104 + a} C-50 ${70 + b} -40 ${30 + a} -14 0 Z`), '#3ee6ff');
    f(circ(0, -10, 16), '#22b8d6');
    ctx.strokeStyle = '#3ee6ff'; ctx.lineWidth = 5; ctx.globalAlpha = .9; ctx.stroke(P('M104 -40 A112 112 0 0 1 70 86')); ctx.globalAlpha = 1;
    ctx.restore();
  }
  S.ninjaBack = ninjaBack;

  // ------------------------------------------------------------------ camera-safe background painter
  /* S.bgCanvas(root) -> { draw(ctx, cam, dx, dy) }
   * Zooming DOM/SVG layers with a camera transform re-rasterises them differently depending on earlier frames
   * (the render's determinism check fails). Instead: build the kit layers inside `root` as usual (S.mountains(root)),
   * call bg.seek(t, o) every frame, then bgc.draw(ctx, c) paints every visible layer of `root` (SVG paths / rects /
   * circles with their gradients, gradient or solid divs) onto a canvas under the camera — crisp at any zoom and
   * frame-pure. `root` itself is set to opacity 0 (it stays in the DOM only as the source of shapes). */
  function bgCanvas(root) {
    root.style.opacity = 0;
    const bbox = new Map(), grads = new Map();
    const num = (e, a, d = 0) => { const v = e.getAttribute(a); return v == null ? d : parseFloat(v); };
    const parseTr = s => {
      let x = 0, y = 0, m;
      if ((m = /translate\(\s*(-?[\d.]+)px\s*,\s*(-?[\d.]+)px/.exec(s))) { x = +m[1]; y = +m[2]; }
      else if ((m = /translateY\(\s*(-?[\d.]+)px/.exec(s))) y = +m[1];
      else if ((m = /translateX\(\s*(-?[\d.]+)px/.exec(s))) x = +m[1];
      return [x, y];
    };
    const stops = str => { const out = [], re = /(rgba?\([^)]+\)|#[0-9a-fA-F]{3,8})\s+([\d.]+)%/g; let m; while ((m = re.exec(str))) out.push([+m[2] / 100, m[1]]); return out; };
    function paint(ctx, e, svgRoot) {
      if (e.getAttribute('opacity') === '0') return;
      const tag = e.tagName.toLowerCase();
      if (tag === 'defs' || tag === 'lineargradient' || tag === 'stop') return;
      ctx.save();
      const op = e.getAttribute('opacity'); if (op != null) ctx.globalAlpha *= parseFloat(op);
      const tr = e.getAttribute('transform'); let m;
      if (tr && (m = /translate\(\s*(-?[\d.]+)[ ,]+(-?[\d.]+)\s*\)/.exec(tr))) ctx.translate(+m[1], +m[2]);
      if (tag === 'g') { [...e.children].forEach(ch => paint(ctx, ch, svgRoot)); ctx.restore(); return; }
      let path = null;
      if (tag === 'path') path = new Path2D(e.getAttribute('d'));
      else if (tag === 'rect') { path = new Path2D(); path.rect(num(e, 'x'), num(e, 'y'), num(e, 'width'), num(e, 'height')); }
      else if (tag === 'circle') { path = new Path2D(); path.arc(num(e, 'cx'), num(e, 'cy'), num(e, 'r'), 0, 2 * PI); }
      if (path) {
        const fill = e.getAttribute('fill');
        if (fill && fill !== 'none') {
          const g = /url\(#([^)]+)\)/.exec(fill);
          if (g) {
            const gd = svgRoot.querySelector('#' + g[1]) || document.getElementById(g[1]);
            if (!bbox.has(e)) bbox.set(e, e.getBBox());
            const b = bbox.get(e);
            const gr = ctx.createLinearGradient(b.x + b.width * num(gd, 'x1'), b.y + b.height * num(gd, 'y1'), b.x + b.width * num(gd, 'x2', 1), b.y + b.height * num(gd, 'y2'));
            gd.querySelectorAll('stop').forEach(s => {
              const c = s.getAttribute('stop-color'), so = s.getAttribute('stop-opacity');
              let col = c; if (so != null) { const h = c.replace('#', ''); col = `rgba(${parseInt(h.substr(0, 2), 16)},${parseInt(h.substr(2, 2), 16)},${parseInt(h.substr(4, 2), 16)},${so})`; }
              gr.addColorStop(parseFloat(s.getAttribute('offset')), col);
            });
            ctx.fillStyle = gr;
          } else ctx.fillStyle = fill;
          ctx.fill(path);
        }
        const st = e.getAttribute('stroke');
        if (st && st !== 'none') { ctx.strokeStyle = st; ctx.lineWidth = num(e, 'stroke-width', 1); ctx.lineCap = 'butt'; ctx.stroke(path); }
      }
      ctx.restore();
    }
    return {
      draw(ctx, c, dx = 0, dy = 0) {
        ctx.save(); ctx.setTransform(c.z, 0, 0, c.z, c.tx + dx, c.ty + dy);
        [...root.children].forEach(e => {
          if (e.style.display === 'none') return;           // (visibility is last frame's hideInvisible: never read it)
          const op = e.style.opacity === '' ? 1 : parseFloat(e.style.opacity); if (!(op > 0)) return;
          const [x, y] = parseTr(e.style.transform || '');
          ctx.save(); ctx.globalAlpha = op; ctx.translate(x, y);
          if (e instanceof SVGSVGElement) [...e.children].forEach(ch => paint(ctx, ch, e));
          else {
            const cs = getComputedStyle(e), L = parseFloat(cs.left) || 0, Tp = parseFloat(cs.top) || 0, W = parseFloat(cs.width), H = parseFloat(cs.height);
            if (cs.backgroundImage.startsWith('radial-gradient')) {
              const gr = ctx.createRadialGradient(L + W / 2, Tp + H / 2, 0, L + W / 2, Tp + H / 2, Math.min(W, H) / 2);
              stops(cs.backgroundImage).forEach(([o, col]) => gr.addColorStop(o, col));
              ctx.fillStyle = gr; ctx.fillRect(L, Tp, W, H);
            } else if (cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)') { ctx.fillStyle = cs.backgroundColor; ctx.fillRect(L, Tp, W, H); }
          }
          ctx.restore();
        });
        ctx.restore();
      }
    };
  }
  S.bgCanvas = bgCanvas;
})();
