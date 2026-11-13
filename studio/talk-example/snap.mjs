// snap.mjs <project> <out.jpg> t1 t2 ... : stills at given times -> grid (4 per row, 360x640 tiles). Dev helper.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, join, extname, sep } from 'node:path';
import { execFileSync } from 'node:child_process';
const [proj, out, ...ts] = process.argv.slice(2);
const folder = resolve(proj);
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2' };
const server = createServer(async (req, res) => {
  const p = resolve(folder, '.' + decodeURIComponent(new URL(req.url, 'http://x').pathname));
  try { const b = await readFile(p.endsWith(sep) ? join(p, 'index.html') : p); res.writeHead(200, { 'content-type': MIME[extname(p)] || 'application/octet-stream' }).end(b); }
  catch { res.writeHead(404).end(); }
}).listen(0, '127.0.0.1');
await new Promise(r => server.once('listening', r));
const { chromium } = await import('playwright');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
page.on('pageerror', e => console.log('PAGEERROR', e.message));
page.on('console', m => { if (m.type() === 'error') console.log('CONSOLE', m.text()); });
await page.goto(`http://127.0.0.1:${server.address().port}/index.html?capture=1`);
await page.waitForFunction(() => window.ready); await page.evaluate(() => window.ready);
const files = [];
for (const t of ts) { await page.evaluate(t => window.seek(+t), t); const f = `/tmp/claude-0/-home-claude/de0bb593-649c-5a9a-bc08-58d76073224a/scratchpad/tools/s_${t}.png`; await page.screenshot({ path: f }); files.push([t, f]); }
await browser.close(); server.close();
const py = `
from PIL import Image, ImageDraw
import sys
fs=${JSON.stringify(files)}
W,H=360,640; n=len(fs); c=min(4,n); r=(n+c-1)//c
g=Image.new('RGB',(W*c,H*r),'black'); d=ImageDraw.Draw(g)
for i,(t,f) in enumerate(fs):
  im=Image.open(f).convert('RGB').resize((W,H)); g.paste(im,((i%c)*W,(i//c)*H)); d.rectangle([(i%c)*W,(i//c)*H,(i%c)*W+70,(i//c)*H+22],fill='black'); d.text(((i%c)*W+4,(i//c)*H+4),str(t),fill='yellow')
g.save('${out}',quality=85)`;
execFileSync('python3', ['-c', py]);
console.log('wrote', out);
