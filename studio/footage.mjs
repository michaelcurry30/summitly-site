#!/usr/bin/env node
// footage.mjs — look at source media cheaply, then turn clips into frame sequences.
//   node footage.mjs probe   <folder>                         list every media file: kind, duration, size, fps, audio
//   node footage.mjs sheets  <video> [--every 2] [--from s --to s] [--out dir]   4x4 contact sheets, timestamp burned in
//   node footage.mjs scenes  <video> [--threshold 0.3]        timestamps of hard cuts
//   node footage.mjs extract <video> <outDir> [--fps 30] [--width 1920] [--from s --to s]
//                                                             JPG sequence + manifest.json for index.html to play
// Sheets go to <video's folder>/.review/<clip>/, or <--out dir>/<clip>/ (use --out for read-only folders). Requires ffmpeg + ffprobe.
import { execFileSync, spawnSync } from 'node:child_process';
import { readdirSync, statSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join, basename, dirname, extname, resolve } from 'node:path';

const [cmd, ...argv] = process.argv.slice(2);
const pos = argv.filter((a, i) => !a.startsWith('--') && !(argv[i - 1] || '').startsWith('--'));
const opt = (k, d) => { const i = argv.indexOf('--' + k); return i >= 0 ? argv[i + 1] : d; };
const VIDEO = new Set(['.mp4', '.mov', '.m4v', '.webm', '.mkv', '.avi', '.gif']);
const IMAGE = new Set(['.jpg', '.jpeg', '.png', '.webp', '.svg', '.heic']);

function probe(file) {
  const j = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-print_format', 'json', '-show_format', '-show_streams', file]));
  const v = j.streams.find(s => s.codec_type === 'video');
  const a = j.streams.find(s => s.codec_type === 'audio');
  const [n, d] = (v?.avg_frame_rate || '0/1').split('/').map(Number);
  return { dur: +(j.format.duration || 0), w: v?.width, h: v?.height, fps: d ? +(n / d).toFixed(2) : 0, audio: !!a, codec: v?.codec_name };
}
function walk(dir) {
  return readdirSync(dir).flatMap(f => {
    const p = join(dir, f);
    if (f.startsWith('.') || f === 'node_modules' || f === 'frames') return [];   // frames/ = our extracted sequences
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}
function sheets(file, every, from, to, tag) {
  const out = join(opt('out') ? resolve(opt('out')) : join(dirname(file), '.review'), basename(file, extname(file)) + (tag ? '-' + tag : ''));
  rmSync(out, { recursive: true, force: true }); mkdirSync(out, { recursive: true });
  const range = [...(from != null ? ['-ss', String(from)] : []), ...(to != null ? ['-to', String(to)] : [])];
  const vf = `select='isnan(prev_selected_t)+gte(t-prev_selected_t,${every})',scale=480:-2,` +
    `drawtext=text='%{pts\\:hms}':x=8:y=8:fontsize=22:fontcolor=white:box=1:boxcolor=black@0.6,tile=4x4:padding=4:color=black`;
  execFileSync('ffmpeg', ['-v', 'error', '-y', ...range, '-i', file, '-copyts', '-vf', vf, '-fps_mode', 'vfr', '-q:v', '4', join(out, 'sheet_%02d.jpg')]);
  const n = readdirSync(out).length;
  console.log(`${n} sheet(s), one tile per ${every}s, 16 tiles each -> ${out}`);
}

if (cmd === 'probe') {
  const root = resolve(pos[0] || '.');
  for (const f of walk(root)) {
    const e = extname(f).toLowerCase(), rel = f.slice(root.length + 1);
    if (VIDEO.has(e)) {
      const p = probe(f);
      console.log(`VIDEO ${rel}  ${p.dur.toFixed(1)}s  ${p.w}x${p.h}  ${p.fps}fps  ${p.codec}  audio:${p.audio ? 'yes' : 'no'}`);
    } else if (IMAGE.has(e)) {
      let s = ''; try { const p = probe(f); s = `${p.w}x${p.h}`; } catch {}
      console.log(`IMAGE ${rel}  ${s}`);
    } else console.log(`FILE  ${rel}  ${(statSync(f).size / 1024).toFixed(0)}KB`);
  }
} else if (cmd === 'sheets') {
  const from = opt('from'), to = opt('to');
  sheets(resolve(pos[0]), +opt('every', 2), from, to, from != null ? `${from}-${to ?? 'end'}` : '');
} else if (cmd === 'scenes') {
  const r = spawnSync('ffmpeg', ['-hide_banner', '-i', resolve(pos[0]), '-vf', `select='gt(scene,${opt('threshold', 0.3)})',showinfo`, '-f', 'null', '-'], { encoding: 'utf8', maxBuffer: 1 << 28 });
  const ts = [...r.stderr.matchAll(/pts_time:([\d.]+)/g)].map(m => (+m[1]).toFixed(2));
  console.log(ts.length ? `cuts at: ${ts.join('s, ')}s` : 'no hard cuts found');
} else if (cmd === 'extract') {
  const [file, outDir] = [resolve(pos[0]), resolve(pos[1])];
  const fps = +opt('fps', 30), width = +opt('width', 1920), from = opt('from'), to = opt('to');
  rmSync(outDir, { recursive: true, force: true }); mkdirSync(outDir, { recursive: true });
  const range = [...(from != null ? ['-ss', String(from)] : []), ...(to != null ? ['-to', String(to)] : [])];
  execFileSync('ffmpeg', ['-v', 'error', '-y', ...range, '-i', file, '-vf', `fps=${fps},scale=${width}:-2`, '-q:v', '3', join(outDir, '%05d.jpg')]);
  const count = readdirSync(outDir).filter(f => f.endsWith('.jpg')).length;
  const p = probe(join(outDir, '00001.jpg'));
  writeFileSync(join(outDir, 'manifest.json'), JSON.stringify({ fps, count, width: p.w, height: p.h, source: basename(file), from: from ?? 0 }, null, 2));
  console.log(`${count} frames @ ${fps}fps (${p.w}x${p.h}) -> ${outDir}`);
} else {
  console.log(readFileHelp());
}
function readFileHelp() { return 'usage: node footage.mjs probe|sheets|scenes|extract ... (see header of this file)'; }
