#!/usr/bin/env node
// render.mjs — render <folder>/index.html to <this script's dir>/out/<folder>.mp4
//   node render.mjs <folder> [--from s] [--to s] [--scale 0.5]    render (partial / half-res for fast previews)
//   node render.mjs <folder> --serve [--port 8080]                 live preview in a browser, data files load
// Contract the page must meet: 1920x1080 stage (or window.STAGE_W x window.STAGE_H, or --size WxH); window.DURATION, window.FPS, window.ready (Promise),
// window.seek(t) paints the exact frame for second t, synchronously. Same t, same pixels. No network.
// The folder is served from a local http server (so fetch('data.csv') works); any other request fails the render.
// Afterwards: re-seeks sample frames out of order and fails if any pixels differ (state leaking between frames).
// Also writes out/<folder>-sheet.jpg: one tile per second, for reviewing the result without watching it.
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { spawn, execFileSync } from 'node:child_process';
import { resolve, join, basename, extname, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : d; };
const folder = resolve(args.find((a, i) => !a.startsWith('--') && !(args[i - 1] || '').startsWith('--')) || '.');
const name = basename(folder).replace(/[^\w.-]+/g, '-');
const outDir = join(dirname(fileURLToPath(import.meta.url)), 'out');
const scale = +opt('scale', 1);
const fail = m => { console.error('RENDER FAILED: ' + m); process.exit(1); };

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.csv': 'text/csv', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.otf': 'font/otf', '.mp4': 'video/mp4', '.webm': 'video/webm' };
const server = createServer(async (req, res) => {
  const p = resolve(folder, '.' + decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (p !== folder && !p.startsWith(folder + sep)) { res.writeHead(403).end(); return; }
  try { const b = await readFile(p.endsWith(sep) || p === folder ? join(p, 'index.html') : p);
    res.writeHead(200, { 'content-type': MIME[extname(p).toLowerCase()] || 'application/octet-stream' }).end(b); }
  catch { res.writeHead(404).end(); }
}).listen(args.includes('--serve') ? +opt('port', 8080) : 0, '127.0.0.1');
await new Promise(r => server.once('listening', r));
const origin = `http://127.0.0.1:${server.address().port}`;
if (args.includes('--serve')) { console.log(`preview: ${origin}/index.html  (Ctrl+C to stop)`); await new Promise(() => {}); }

let chromium;
try { ({ chromium } = await import('playwright')); }
catch { try { ({ chromium } = await import('/opt/npm-tools/node_modules/playwright/index.mjs')); }
catch { fail('Playwright not found. Run: npm i playwright && npx playwright install chromium'); } }
try { execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' }); } catch { fail('ffmpeg not on PATH (macOS: brew install ffmpeg)'); }

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: scale });
const problems = [];
await page.route('**/*', r => {
  const u = r.request().url();
  if (u.startsWith(origin) || u.startsWith('data:') || u.startsWith('blob:')) return r.continue();
  problems.push('network request blocked: ' + u); return r.abort();
});
page.on('requestfailed', r => { if (r.url().startsWith(origin)) problems.push('missing file: ' + r.url().slice(origin.length)); });
page.on('response', r => { if (r.status() >= 400) problems.push(`HTTP ${r.status()}: ${r.url().replace(origin, '')}`); });
page.on('pageerror', e => problems.push('page error: ' + e.message));
page.on('console', m => { if (m.type() === 'error') problems.push('console error: ' + m.text()); });

await page.goto(origin + '/index.html?capture=1');
const meta = await page.evaluate(async () => {
  const t0 = Date.now();
  while (!window.ready && Date.now() - t0 < 5000) await new Promise(r => setTimeout(r, 50));
  await Promise.race([window.ready, new Promise((_, j) => setTimeout(() => j(new Error('window.ready did not resolve in 30s')), 30000))]);
  await document.fonts.ready;
  const bad = [...document.images].filter(i => !i.complete || !i.naturalWidth).map(i => i.getAttribute('src'));
  const css = document.getAnimations().filter(a => a.playState === 'running').length;
  return { fps: window.FPS, dur: window.DURATION, seek: typeof window.seek, bad, css, w: window.STAGE_W || 1920, h: window.STAGE_H || 1080 };
}).catch(e => fail(e.message));
if (meta.seek !== 'function' || !(meta.dur > 0) || !(meta.fps > 0)) fail('page must define window.seek(t), window.DURATION > 0 and window.FPS > 0');
if (meta.bad.length) problems.push('images not loaded at ready: ' + meta.bad.join(', '));
if (meta.css) problems.push(`${meta.css} running CSS/Web animation(s): drive all motion from seek(t) instead`);
if (problems.length) fail('\n  ' + problems.join('\n  '));
{ const [sw, sh] = (opt('size', '') || `${meta.w}x${meta.h}`).split('x').map(Number);   // stage size: --size WxH, else window.STAGE_W/H
  if (!(sw > 0 && sh > 0)) fail('bad stage size'); await page.setViewportSize({ width: sw, height: sh }); }

const fps = meta.fps, from = +opt('from', 0), to = Math.min(+opt('to', meta.dur), meta.dur);
const first = Math.round(from * fps), last = Math.round(to * fps);  // frames [first, last)
const shot = async t => { await page.evaluate(t => window.seek(t), t); return page.screenshot({ type: 'png', animations: 'disabled', caret: 'hide' }); };
const hash = b => createHash('sha1').update(b).digest('hex');
await mkdir(outDir, { recursive: true });
const mp4 = join(outDir, name + (from || to < meta.dur ? `-${from}-${to}` : '') + (scale !== 1 ? `-x${scale}` : '') + '.mp4');

const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
  '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '16', '-movflags', '+faststart', mp4], { stdio: ['pipe', 'inherit', 'inherit'] });
const ffDone = new Promise((r, j) => ff.on('close', c => c ? j(new Error('ffmpeg exited ' + c)) : r()));
const hashes = new Map(), started = Date.now();
for (let i = first; i < last; i++) {
  const buf = await shot(i / fps);
  if ((i - first) % Math.max(1, Math.floor((last - first) / 8)) === 0 || i === last - 1) hashes.set(i, hash(buf));
  if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  if ((i - first) % (fps * 5) === 0) process.stdout.write(`\r  frame ${i - first + 1}/${last - first}`);
}
ff.stdin.end(); await ffDone;
console.log(`\r  ${last - first} frames in ${((Date.now() - started) / 1000).toFixed(0)}s`);

// Determinism: same t, same pixels, regardless of what was painted before.
const sample = [...hashes.keys()].reverse();
const drift = [];
for (const i of sample) if (hash(await shot(i / fps)) !== hashes.get(i)) drift.push((i / fps).toFixed(2) + 's');
if (problems.length) console.warn('WARNINGS during render:\n  ' + problems.join('\n  '));
await browser.close(); server.close();
if (drift.length) fail(`not a pure function of t: frames at ${drift.join(', ')} changed when re-seeked out of order. ${mp4} was written but is suspect.`);

// Review sheet: exact frames at 0, every, 2*every… s (select, not fps=, which shifts frames under their labels).
const sheet = mp4.replace(/\.mp4$/, '-sheet.jpg'), every = Math.max(1, Math.ceil((to - from) / 48));  // ≤ 48 tiles
const tiles = Math.ceil((to - from) / every), cols = Math.min(4, tiles), rows = Math.ceil(tiles / cols);
execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', mp4, '-vf',
  `select='isnan(prev_selected_t)+gte(t-prev_selected_t,${every}-0.001)',scale=480:-2,` +
  `drawtext=text='%{pts\\:hms}':x=8:y=8:fontsize=22:fontcolor=white:box=1:boxcolor=black@0.6,tile=${cols}x${rows}:padding=4`,
  '-fps_mode', 'vfr', '-frames:v', '1', '-q:v', '4', sheet]);
console.log(`OK  ${mp4}\n    ${sheet}  (one tile per ${every}s, for review)\n    determinism: ${sample.length} frames re-seeked out of order, identical`);
