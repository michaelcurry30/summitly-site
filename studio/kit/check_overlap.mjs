#!/usr/bin/env node
// check_overlap.mjs — "nothing may ever cover a word" checker for Summitly ads (1080x1920).
//   node kit/check_overlap.mjs <project> [--step 0.1] [--from s] [--to s] [--tol 3] [--grid 14] [--shots]
// Serves <project>/ like render.mjs (local http server, ?capture=1), awaits window.ready, then for every t
// (0, step, 2*step, ... and the last frame) calls window.seek(t) and measures:
//   - every visible word: text nodes with non-whitespace (HTML and SVG <text>), effective opacity > 0.05,
//     not display:none / visibility:hidden. Rect = tight glyph box (Range.getClientRects + font metrics).
//   - at a grid of sample points inside each glyph box, document.elementsFromPoint() gives the paint stack:
//       COVER   a painted element (SVG shape, image, box with a background, canvas pixel, other text) is above the word;
//       BEHIND  a painted element is under the word and not hidden by the word's own chip/card background.
//     Ignored: the word's own ancestors/descendants, anything inside [data-bg] (sky, mountains, glows, tints),
//     svg roots, transparent boxes, elements at opacity <= 0.1, canvas pixels with alpha < 64.
//   - safe zone: words must stay inside x 120–960, y 240–1260, and out of the x > 780 / y > 840 corner.
//     --zone fourpanel (or a page that sets window.CHECK_ZONE = 'fourpanel', as kit/fourpanel.js does):
//     words inside x 60–1020, y 150–1260, no corner rule (FOURPANEL_BIBLE.md). --zone default forces the classic zone.
//     --zone dojo (kit/dojo.js): words inside x 100–980, y 220–1500, and out of the x > 860 / y > 1150 corner (DOJO_BIBLE.md).
//   - screenshots: elements tagged [data-words] (every kit phone) carry words as pixels; SHOT = anything from
//     outside the phone (ninja canvas, props, chips, other text) painted over the visible screen.
// Prints a table of violations (merged into time ranges) and exits 1 if there are any, 0 if clean.
// --shots writes out/<project>-overlap-<t>.png for the first frame of each violation range.
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { resolve, join, basename, extname, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : d; };
const FLAGS = ['--shots'];
const pos = args.filter((a, i) => !a.startsWith('--') && (!(args[i - 1] || '').startsWith('--') || FLAGS.includes(args[i - 1])));
const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
if (!pos[0]) { console.error('usage: node kit/check_overlap.mjs <project> [--step 0.1] [--from s] [--to s] [--tol 3] [--grid 14] [--shots] [--zone default|fourpanel|quiet|dojo]'); process.exit(2); }
let folder = resolve(pos[0]);
try { await readFile(join(folder, 'index.html')); } catch { folder = resolve(root, pos[0]); }
const name = basename(folder);
const step = +opt('step', 0.1), tol = +opt('tol', 3), grid = +opt('grid', 14);
const fail = m => { console.error('CHECK FAILED: ' + m); process.exit(2); };

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.csv': 'text/csv', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.otf': 'font/otf', '.mp4': 'video/mp4', '.webm': 'video/webm' };
const server = createServer(async (req, res) => {
  const p = resolve(folder, '.' + decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (p !== folder && !p.startsWith(folder + sep)) { res.writeHead(403).end(); return; }
  try { const b = await readFile(p.endsWith(sep) || p === folder ? join(p, 'index.html') : p);
    res.writeHead(200, { 'content-type': MIME[extname(p).toLowerCase()] || 'application/octet-stream' }).end(b); }
  catch { res.writeHead(404).end(); }
}).listen(0, '127.0.0.1');
await new Promise(r => server.once('listening', r));
const origin = `http://127.0.0.1:${server.address().port}`;

let chromium;
try { ({ chromium } = await import('playwright')); }
catch { try { ({ chromium } = await import('/opt/npm-tools/node_modules/playwright/index.mjs')); }
catch { fail('Playwright not found'); } }
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
const problems = [];
await page.route('**/*', r => { const u = r.request().url();
  if (u.startsWith(origin) || u.startsWith('data:') || u.startsWith('blob:')) return r.continue(); problems.push('blocked ' + u); return r.abort(); });
page.on('pageerror', e => problems.push('page error: ' + e.message));
await page.goto(origin + '/index.html?capture=1');
const meta = await page.evaluate(async () => {
  const t0 = Date.now();
  while (!window.ready && Date.now() - t0 < 5000) await new Promise(r => setTimeout(r, 50));
  await window.ready; await document.fonts.ready;
  return { dur: window.DURATION, fps: window.FPS, zone: window.CHECK_ZONE || 'default' };
}).catch(e => fail(e.message));
if (problems.length) fail(problems.join('\n  '));

// ------------------------------------------------------------------ safe zone (--zone overrides the page's window.CHECK_ZONE)
const ZONES = { default: { x0: 120, x1: 960, y0: 240, y1: 1260, corner: true }, fourpanel: { x0: 60, x1: 1020, y0: 150, y1: 1260, corner: false },
  quiet: { x0: 120, x1: 960, y0: 240, y1: 1260, corner: false },   // kit/quiet.js sets window.CHECK_ZONE = 'quiet' (QUIET_BIBLE.md)
  dojo: { x0: 100, x1: 980, y0: 220, y1: 1500, corner: { x: 860, y: 1150 } } };   // kit/dojo.js (DOJO_BIBLE.md): IG/YT buttons bottom-right
const zoneName = opt('zone', meta.zone);
if (!ZONES[zoneName]) fail(`unknown --zone ${zoneName} (${Object.keys(ZONES).join(', ')})`);
const zone = ZONES[zoneName];

// ------------------------------------------------------------------ in-page measurement
await page.addStyleTag({ content: '#stage, #stage * { pointer-events: auto !important }' });
await page.evaluate(({ tol, grid, zone }) => {
  const stage = document.getElementById('stage');
  const mctx = document.createElement('canvas').getContext('2d');
  let canCache = new Map();
  const isSvgRoot = e => e instanceof SVGSVGElement && !(e.parentNode instanceof SVGElement);
  const desc = e => {
    if (!e) return '?';
    let s = e.tagName.toLowerCase();
    if (e.id) s += '#' + e.id;
    const c = (e.getAttribute('class') || '').trim(); if (c) s += '.' + c.split(/\s+/).slice(0, 3).join('.');
    if (e.dataset && e.dataset.name) s += `[${e.dataset.name}]`;
    const tx = (e.textContent || '').trim().replace(/\s+/g, ' ');
    if (tx && !(e instanceof HTMLCanvasElement)) s += ` "${tx.slice(0, 28)}"`;
    const anc = e.closest && e.closest('[data-name]'); if (anc && anc !== e) s += ` in [${anc.dataset.name}]`;
    return s;
  };
  const effOp = e => {
    let o = 1;
    for (let x = e; x && x.nodeType === 1; x = x.parentElement) {
      const cs = getComputedStyle(x); if (cs.display === 'none') return 0; o *= parseFloat(cs.opacity);
      if (x === document.documentElement) break;
    }
    return o;
  };
  const alphaOf = c => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return c === 'transparent' ? 0 : 1; const p = m[1].split(/[ ,/]+/).filter(Boolean); return p.length > 3 ? parseFloat(p[3]) : 1; };
  function canvasAlpha(cv, x, y) {
    let d = canCache.get(cv);
    if (!d) { try { d = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height); } catch { d = null; } canCache.set(cv, d); }
    if (!d) return 255;
    const r = cv.getBoundingClientRect(), px = Math.floor((x - r.left) * cv.width / r.width), py = Math.floor((y - r.top) * cv.height / r.height);
    if (px < 0 || py < 0 || px >= cv.width || py >= cv.height) return 0;
    return d.data[(py * cv.width + px) * 4 + 3];
  }
  function collectTexts() {
    const out = [], w = document.createTreeWalker(stage, NodeFilter.SHOW_TEXT);
    for (let n = w.nextNode(); n; n = w.nextNode()) {
      if (!/\S/.test(n.data)) continue;
      const owner = n.parentElement; if (!owner || /^(STYLE|SCRIPT)$/.test(owner.tagName)) continue;
      const cs = getComputedStyle(owner);
      if (cs.visibility !== 'visible') continue;
      const op = effOp(owner); if (op <= .05) continue;
      let txt = n.data.trim(); if (cs.textTransform === 'uppercase') txt = txt.toUpperCase();
      const rects = [];
      if (owner instanceof SVGElement) {
        const r = owner.getBoundingClientRect(); if (r.width && r.height) rects.push({ x0: r.left, x1: r.right, y0: r.top, y1: r.bottom });
      } else {
        const a = n.data.search(/\S/), b = n.data.length - n.data.match(/\s*$/)[0].length;
        const rg = document.createRange(); rg.setStart(n, a); rg.setEnd(n, b);
        mctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        const m = mctx.measureText(txt), fa = m.fontBoundingBoxAscent, fd = m.fontBoundingBoxDescent, aa = m.actualBoundingBoxAscent, ad = m.actualBoundingBoxDescent;
        for (const r of rg.getClientRects()) {
          if (r.width < 1 || r.height < 1) continue;
          const k = r.height / (fa + fd);
          let y0, y1;
          if (k > .85 && k < 1.15) { const base = r.top + fa * k; y0 = base - aa * k; y1 = base + ad * k; }
          else { y0 = r.top + .15 * r.height; y1 = r.bottom - .15 * r.height; }   // rotated text: approximate
          rects.push({ x0: r.left, x1: r.right, y0, y1 });
        }
      }
      if (rects.length) out.push({ node: n, owner, txt: n.data.trim().replace(/\s+/g, ' '), rects, op });
    }
    return out;
  }
  function painted(e, x, y, texts) {
    if (e instanceof HTMLCanvasElement) return canvasAlpha(e, x, y) >= 64;
    if (e instanceof HTMLImageElement || e instanceof SVGImageElement || e instanceof HTMLVideoElement) return true;
    if (e instanceof SVGGraphicsElement && !(e instanceof SVGSVGElement) && !(e instanceof SVGGElement)) {
      if (e instanceof SVGTextContentElement) return false;            // other SVG text: handled as text
      return true;                                                     // hit test is on painted geometry
    }
    if (e instanceof SVGElement) return false;
    const cs = getComputedStyle(e);
    if (alphaOf(cs.backgroundColor) > .05 || cs.backgroundImage !== 'none') return true;
    const bw = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderLeftWidth);
    if (bw > 0 && alphaOf(cs.borderTopColor) > .05) {                  // border ring only
      const r = e.getBoundingClientRect(), b = parseFloat(cs.borderTopWidth) + 2;
      if (x - r.left < b || r.right - x < b || y - r.top < b || r.bottom - y < b) return true;
    }
    return false;
  }
  function opaqueBg(e, x, y) {        // a box background that hides what is painted under it (alpha >= .6)
    if (e instanceof HTMLCanvasElement) return canvasAlpha(e, x, y) >= 200;
    if (e instanceof HTMLImageElement) return true;
    if (e instanceof SVGElement) return false;
    const cs = getComputedStyle(e);
    return alphaOf(cs.backgroundColor) >= .6 || cs.backgroundImage.includes('gradient(') && !cs.backgroundImage.includes('radial');
  }
  function textAt(e, x, y, texts) {   // e owns a visible word whose glyph box contains (x, y)?
    for (const T of texts) if (T.owner === e) for (const r of T.rects) if (x >= r.x0 && x <= r.x1 && y >= r.y0 && y <= r.y1) return T;
    return null;
  }
  window.__checkFrame = t => {
    window.seek(t);
    canCache = new Map();
    const texts = collectTexts(), viol = [];
    const ignorable = e => e === document.documentElement || e === document.body || e === stage || isSvgRoot(e) ||
      (e.closest && e.closest('[data-bg]')) || getComputedStyle(e).visibility !== 'visible' || effOp(e) <= .1;
    for (const T of texts) {
      const label = T.txt.slice(0, 40);
      for (const r of T.rects) {
        // safe zone
        if (r.x0 < zone.x0 - tol || r.x1 > zone.x1 + tol || r.y0 < zone.y0 - tol || r.y1 > zone.y1 + tol)
          viol.push({ kind: 'SAFE', text: label, other: `glyphs x ${r.x0 | 0}–${r.x1 | 0} y ${r.y0 | 0}–${r.y1 | 0} outside x${zone.x0}–${zone.x1} y${zone.y0}–${zone.y1}` });
        else if (zone.corner && r.x1 > (zone.corner.x || 780) + tol && r.y1 > (zone.corner.y || 840) + tol)
          viol.push({ kind: 'SAFE', text: label, other: `glyphs x ${r.x0 | 0}–${r.x1 | 0} y ${r.y0 | 0}–${r.y1 | 0} in the x>${zone.corner.x || 780} / y>${zone.corner.y || 840} UI corner` });
        // overlap
        const x0 = r.x0 + tol, x1 = r.x1 - tol, y0 = r.y0 + tol, y1 = r.y1 - tol;
        if (x1 <= x0 || y1 <= y0) continue;
        const nx = Math.max(2, Math.ceil((x1 - x0) / grid) + 1), ny = Math.max(2, Math.ceil((y1 - y0) / grid) + 1);
        const hits = new Map();
        for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
          const x = x0 + (x1 - x0) * i / (nx - 1), y = y0 + (y1 - y0) * j / (ny - 1);
          if (x < 0 || y < 0 || x >= 1080 || y >= 1920) continue;
          const list = document.elementsFromPoint(x, y), idx = list.indexOf(T.owner), ownBg = opaqueBg(T.owner, x, y);
          if (idx < 0) continue;                                       // word clipped away at this point
          for (let k = 0; k < list.length; k++) {
            if (k === idx) continue;
            const e = list[k];
            const anc = e.contains(T.owner), des = T.owner.contains(e);
            if (k > idx && ownBg) break;                                 // the word's own chip/bubble background hides the rest
            if (k > idx && anc) { if (opaqueBg(e, x, y)) { break; } else continue; }   // card/chip ancestor background hides the rest
            if (anc || des || ignorable(e)) continue;
            let what = null;
            const ot = textAt(e, x, y, texts);
            if (ot && ot !== T) what = `text "${ot.txt.slice(0, 30)}"`;
            else if (painted(e, x, y, texts)) what = desc(e);
            if (!what) continue;
            const key = (k < idx ? 'COVER' : 'BEHIND') + '|' + what;
            hits.set(key, (hits.get(key) || 0) + 1);
          }
        }
        for (const [key, n] of hits) { const [kind, other] = key.split(/\|(.*)/s); viol.push({ kind, text: label, other, n }); }
      }
    }
    // screenshots ([data-words], e.g. every kit phone): their words are pixels, so nothing from outside the
    // phone may be painted over the visible screen area (the phone's own sheen / island / toggle are part of it)
    for (const ph of stage.querySelectorAll('[data-words]')) {
      if (getComputedStyle(ph).visibility !== 'visible' || effOp(ph) <= .05) continue;
      const scr = ph.querySelector('.sc') || ph, R = scr.getBoundingClientRect();
      const x0 = Math.max(0, R.left + tol), x1 = Math.min(1080, R.right - tol), y0 = Math.max(0, R.top + tol), y1 = Math.min(1920, R.bottom - tol);
      if (x1 <= x0 || y1 <= y0) continue;
      const g = grid * 1.5, nx = Math.max(2, Math.ceil((x1 - x0) / g) + 1), ny = Math.max(2, Math.ceil((y1 - y0) / g) + 1), hits = new Map();
      for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
        const x = x0 + (x1 - x0) * i / (nx - 1), y = y0 + (y1 - y0) * j / (ny - 1);
        const list = document.elementsFromPoint(x, y), idx = list.findIndex(e => ph.contains(e));
        if (idx < 0) continue;
        for (let k = 0; k < idx; k++) {
          const e = list[k];
          if (ph.contains(e) || e.contains(ph) || ignorable(e)) continue;
          const ot = textAt(e, x, y, texts);
          const what = ot ? `text "${ot.txt.slice(0, 30)}"` : painted(e, x, y, texts) ? desc(e) : null;
          if (what) hits.set(what, (hits.get(what) || 0) + 1);
        }
      }
      const img = ph.querySelector('img'), label = 'screenshot ' + ((img && img.getAttribute('src')) || '').split('/').pop();
      for (const [other, n] of hits) viol.push({ kind: 'SHOT', text: label, other, n });
    }
    return viol;
  };
}, { tol, grid, zone });

// ------------------------------------------------------------------ sweep
const dur = meta.dur, fps = meta.fps || 30;
const from = +opt('from', 0), to = Math.min(+opt('to', dur), dur);
const times = [];
for (let t = from; t < to - 1e-6; t += step) times.push(+t.toFixed(4));
const lastF = +((Math.ceil(to * fps) - 1) / fps).toFixed(4); if (!times.includes(lastF) && lastF >= from) times.push(lastF);
const open = new Map(), list = [];
for (const t of times) {
  const v = await page.evaluate(t => window.__checkFrame(t), t);
  for (const x of v) {
    const key = `${x.kind}|${x.text}|${x.other.replace(/\d+–\d+/g, '#')}`;
    const r = open.get(key);
    if (r && t - r.t1 <= step * 1.5 + 1e-6) { r.t1 = t; r.n = Math.max(r.n, x.n || 0); }
    else { const nr = { ...x, t0: t, t1: t, n: x.n || 0 }; open.set(key, nr); list.push(nr); }
  }
}
list.sort((a, b) => a.t0 - b.t0);
if (args.includes('--shots') && list.length) {
  await mkdir(join(root, 'out'), { recursive: true });
  for (const r of list.slice(0, 40)) {
    await page.evaluate(t => window.seek(t), r.t0);
    await page.screenshot({ path: join(root, 'out', `${name}-overlap-${r.t0.toFixed(2)}.png`) });
  }
}
await browser.close(); server.close();

const pad = (s, n) => String(s).length >= n ? String(s) : String(s) + ' '.repeat(n - String(s).length);
console.log(`check_overlap ${name}: ${times.length} frames (step ${step}s, ${from}–${to}s), tol ${tol}px, grid ${grid}px, zone ${zoneName}`);
if (!list.length) { console.log('OK  no word is covered, overlapped or outside the safe zone'); process.exit(0); }
console.log(pad('t (s)', 14) + pad('kind', 8) + pad('text', 34) + 'covering / problem');
for (const r of list)
  console.log(pad(r.t0 === r.t1 ? r.t0.toFixed(2) : `${r.t0.toFixed(2)}–${r.t1.toFixed(2)}`, 14) + pad(r.kind, 8) + pad(`"${r.text}"`, 34) + r.other + (r.n ? `  (${r.n} pts)` : ''));
console.log(`FAIL  ${list.length} violation range(s) in ${name}`);
process.exit(1);
