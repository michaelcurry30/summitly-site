---
name: motion-video
description: Make a short animated video (MP4) from a project folder of reference images, raw footage and data — brief, storyboard, frame-pure HTML animation, frame-perfect render. Use for motion graphics, animated explainers, animated charts, or any Claude Motion-style video.
---

# Motion video

Turns one **project folder** (reference images, raw footage, data files) into a 1920×1080 MP4. The animation is a single `index.html` that is a **pure function of time**, rendered frame by frame by `render.mjs`. Invoked as `/motion-video <folder>` or by asking for a motion video from a folder.

## Layout

```
<workspace>/                 any folder; holds the tools and every project
  render.mjs  footage.mjs    copied in on first run (see Tools); recopy when they differ
  out/<project>.mp4          render output, plus <project>-sheet.jpg for review
  <project>/                 the user's folder: images, footage, data files
    brief.md                 the brief (user brings it, or Step 1 writes it)
    storyboard.md            source log + scene plan + numbers ledger (Step 2–3 write it; later runs reuse it)
    index.html               the animation
    footage/edited/          FilmCraft exports of tweaked clips (Step 4)
    edit/                    FilmCraft projects, <clip>_vN.fcproj (Step 4)
    frames/<clip>/           footage extracted to JPG sequences
    fonts/                   .woff2 files the page uses
    .review/                 contact sheets of source footage (scratch)
```

**Where to run.** Use whichever machine has `node`, `ffmpeg` and Playwright's Chromium (`node -e "import('playwright')"`). The cloud workspace has all three; a user's Mac usually needs `brew install ffmpeg && npm i playwright && npx playwright install chromium` in the workspace folder. When the folder is on the user's linked computer and the tools are not, stage the folder into the cloud workspace, work there, and write `index.html`, `storyboard.md` and the MP4 back beside the source.

## Steps

### 1. Brief

Read `<project>/brief.md`. It must answer all five:

| Field | Example | What it decides |
|---|---|---|
| **Who watches** | 40 people, once, standing | type size, scene count, density |
| **Where it plays** | big screen, no sound | captions carry all meaning; contrast |
| **How long** | 30 s, 16:9 | `DURATION`, scene budget |
| **Lead with** | the one number, and why | scene 1, the largest element on screen |
| **Use my files** | every number from the files | the numbers ledger is mandatory |
| *Look* (optional) | clean, or editorial film | `clean` unless the user asks for film grain, archival, editorial or B&W treatment; *editorial film* adds the section below |

Ask only for the missing fields, with AskUserQuestion (4 questions per call: merge Who + Where into one; **Use my files** defaults to "every number from the files"). When nobody is there to answer, infer from the folder, write the guess into `brief.md` under `## Assumptions`, and say so in the final reply. Write the completed brief to `brief.md`.
**Done when** `brief.md` has all five fields filled with specifics, no placeholders.

### 2. Source review (the token-heavy step — be frugal)

Reuse first: if `storyboard.md` exists and its source log's file sizes match `node footage.mjs probe <project>`, skip to Step 3.

1. `node footage.mjs probe <project>`: inventory with duration, resolution, fps, audio.
2. Images and data: read every image once; read every data file in full (numbers come from here).
3. Each video: `node footage.mjs scenes <clip>` for hard cuts, then `node footage.mjs sheets <clip> --every N` where N = 1 for clips ≤ 30 s, 2 for ≤ 2 min, 4 beyond. One sheet image = 16 timestamped moments; read every sheet.
4. **Zoom** only where the sheet is ambiguous: adjacent tiles differ sharply (fast motion), a cut lands between tiles, or the moment is a candidate for the edit. `node footage.mjs sheets <clip> --every 0.25 --from A --to B`. Never read raw frames one at a time.
5. Write the **source log** into `storyboard.md` (format below) as you go, so nothing has to be re-watched.
**Done when** every source file has a log entry, and every video's timeline is covered with no gap longer than the sampling interval.

### 3. Storyboard

Add to `storyboard.md`: scenes with start/end seconds, on-screen text (verbatim), which source each uses (file + in/out time), and motion. List any **footage tweaks** (Step 4) the user asked for, or that the review shows a scene needs, under `## FilmCraft tasks`, one line per clip: what changes and why. Budget: one idea per scene; on-screen time ≥ 1 s + 0.3 s per word; first scene delivers **Lead with** in the first 3 s. Then the **numbers ledger**: every number that will appear on screen → source file + exact location (row/column, page, timestamp). A number with no ledger row does not go on screen.
Send the storyboard to the user in a SendUserMessage before building when they are present; build on without waiting otherwise.
**Done when** scene times sum exactly to the brief's length and every on-screen number has a ledger row.

### 4. Footage tweaks in FilmCraft (only when `## FilmCraft tasks` has lines)

The split: **FilmCraft changes what is inside a clip** (trims, cutting UI waits or dead air, reordering takes, speed, grade, push-ins with motion blur, removing filler words, syncing a second recorder). **`index.html` owns everything laid over or between clips** (type, numbers, charts, scene transitions). Tweaks the review merely suggests are offered to the user first; edit only on a yes.

1. Load the **`filmcraft-editing`** skill and follow it. It owns the how: MCP vs `.fcproj`, never overwriting the user's projects, frame-snapped cuts, its checks. When it is not loadable, read `~/.claude/skills/filmcraft-editing/SKILL.md` on the Mac.
2. Keep the edit at `<project>/edit/<clip>_vN.fcproj` (next free N), so the original footage and earlier versions survive.
3. Export the whole edited sequence with `file.exportMedia` (h264, the source's fps, at least the size it is shown on the stage, `audio: false`, `wait: true`; confirm param names with `command_list {filter: "file.exportMedia"}`) to `<project>/footage/edited/<clip>_vN.mp4`.
4. Run `node footage.mjs sheets` on the export, then update the source log: edited file, its source, `.fcproj` path, what changed, new duration. From here on, storyboard in/out times refer to the edited file.

**Where it runs.** FilmCraft exists only on the user's Mac. In Claude Code on the Mac, run it directly. In a cloud session, use the linked computer's shell (`filmcraft-cli` headless: `exec`, `export`). When neither is reachable, leave the tasks in `storyboard.md`, tell the user to run them with `/filmcraft-editing` on the Mac, and build from the original footage meanwhile.
**Done when** every FilmCraft task has an edited export whose sheet shows the change, and the source log points the storyboard at it.

### 5. Build `index.html`

Extract the footage segments the storyboard uses (from `footage/edited/` when a clip was tweaked): `node footage.mjs extract <clip> <project>/frames/<name> --fps 30 --width <displayed width> --from A --to B` (only the used range, at the size it is shown). For typography and palette: with the *editorial film* look, follow **Editorial film look** below; otherwise read the `artifact-design` or `frontend-design` skill when one is listed. Write the page to the **render contract** below; start from the skeleton.

### 6. Render and verify

1. Fast pass: `node render.mjs <project> --scale 0.5`. Read `out/<project>-x0.5-sheet.jpg`. Fix and repeat until the sheet matches the storyboard.
2. Final: `node render.mjs <project>`. It fails loudly on any contract breach (network, missing file, page error, CSS animation, frames that change when re-seeked); fix the cause rather than the check.
3. Read the final sheet and check every on-screen number against the ledger.
4. Deliver: send `out/<project>.mp4` with SendUserFile (and write it back to the user's computer when the folder came from there). Offer `node render.mjs <project> --serve` for a live preview.
**Done when** the render prints `OK`, the sheet matches the storyboard scene by scene, and every number matches its ledger row.

## Render contract

- **One file**: `<project>/index.html`; a `#stage` exactly 1920×1080, `position:absolute` at 0,0, `overflow:hidden`. Outside capture mode it scales to the window.
- **Frame = f(t)**: `window.seek(t)` paints the exact frame for second `t`, synchronously, computing every property from `t` alone. Same t, same pixels, in any seek order. Exposes `window.DURATION`, `window.FPS` (30) and `window.ready` (a Promise that resolves after data, fonts and every image are loaded and `decode()`d).
- **Pure**: no CSS `animation`/`transition`, no `<video>`, no `Date`/`performance.now()`/`setTimeout` inside `seek`, no unseeded `Math.random` (use a seeded PRNG indexed by `t`). State carried from the previous frame is a bug.
- **Stable layers**: every element whose `transform` or `opacity` changes gets `will-change: transform, opacity` from frame 0. Without it Chromium re-rasterises text differently depending on earlier frames and the determinism check fails.
- **Footage** plays as a frame sequence from `frames/<clip>/` drawn to a `<canvas>` with `drawImage(FRAMES[floor((t - start) * 30)])`. (`<video>` seeking is async and inexact, and headless Chromium often cannot decode H.264.)
- **No network**: fonts are `.woff2` files in `fonts/` loaded with `@font-face` (system fonts differ between machines); no CDNs. Data files load with relative `fetch()`: the renderer serves the folder over local http.
- **No audio**. Source audio is dropped; with no sound, every point must be readable on screen. When a brief does want sound (a FilmCraft VO or synced track), add it after the render: `ffmpeg -i out/<project>.mp4 -i <audio> -c:v copy -c:a aac -shortest out/<project>-sound.mp4`, and keep the silent version.
- **Big-screen legibility** (scale to the brief): body text ≥ 56 px, the lead number ≥ 200 px, ≥ 96 px safe margins, contrast ≥ 7:1, ≤ 12 words on screen at once.
- **Timeline config**: scene start/end times live in one `SCENES` object at the top of the script, so a retime is a one-number edit.
- **Easing** on every move; scene transitions overlap 0.3–0.6 s rather than hard-cut, unless the brief wants cuts.
- **ES modules** are fine (`<script type="module">`); the renderer waits up to 5 s for `window.ready` to appear, then for it to resolve.

## Editorial film look

The look lives in the **`editorial-film-edit`** skill (when it is not loadable: `~/.claude/skills/editorial-film-edit/` on the Mac). Load it and read its `references/style-guide.md`, `references/reference-map.md` and `references/implementation-guide.md`; study the reference frame overviews, and use `node footage.mjs sheets <reference mp4> --every 0.1 --from A --to B --out <project>/.review` for the motion windows the map names (the skill folder may be read-only).

**Precedence.** Motion-video's brief and render contract govern format, duration, sound and the checks. The style guide governs the look: palette, three font roles, grain, bloom, bright B&W, text motion, collage and splits. When the project is really an edit of a presenter video with speech to keep, that skill leads instead: preserve the source's duration and sound, and mux the source audio onto the render (`ffmpeg -i out/<project>.mp4 -i <source> -map 0:v -map 1:a -c:v copy -c:a aac out/<project>-sound.mp4`). Word timings for its captions come from FilmCraft's `transcript.generate`.

**Building with its modules.** Copy `implementation/browser-reference/*.js` into `<project>/lib/` and import them as modules. In `seek(t)`: draw the frame into `picture.ctx`, then `picture.post(t, fx, FPS)` on a full-stage `<canvas>`; DOM text above that canvas stays free of grain. Pass every `fx` key explicitly, starting from the implementation guide's test values (`halation` and `vignette` default on; keep `film: 0`). Size the canvas before constructing `Picture`. Tested here: it captures correctly and passes the determinism check.

**Fonts.** Helvetica Neue, Didot and Menlo exist on the Mac, not in the cloud workspace. Render editorial finals on the Mac; a cloud render records each substitute font in `brief.md`, as the style guide requires.

**Speed.** The WebGL pass costs about 2 s per 1080p frame on the cloud workspace's software GL (a 30 s video is about 30 min); a Mac GPU is far faster. Iterate with `--scale 0.5` and `--from/--to`, and render the full length once.

**Extra checks** (from the style guide's acceptance list): grain differs between consecutive frames and is identical for the same frame; B&W has no colour cast; thin and white type stays legible; both sides of every transition look right (`node footage.mjs sheets out/<project>.mp4 --every 0.1 --from A --to B` around each one). Text behind a person needs a real mask, which this pipeline does not make; use the style guide's clean fallback. Sheets and metrics are not the same as watching: report which checks were done, and say that the user should watch it.

### Skeleton

```html
<!doctype html>
<html><head><meta charset="utf-8"><title>PROJECT</title>
<style>
  @font-face { font-family: Brand; src: url(fonts/Brand.woff2) format("woff2"); font-weight: 100 900; }
  html,body { margin:0; height:100%; background:#000; overflow:hidden }
  #stage { position:absolute; left:0; top:0; width:1920px; height:1080px; transform-origin:0 0; overflow:hidden;
           background:#0d1117; color:#f5f7fa; font-family: Brand, Helvetica, Arial, sans-serif }
  .abs { position:absolute; will-change:transform,opacity }   /* stable layers: required */
</style></head>
<body>
<div id="stage"> <!-- elements with class="abs" --> </div>
<script>
const SCENES = { lead: [0, 6], /* name: [start, end] in seconds */ };
window.FPS = 30; window.DURATION = 30;

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ease = x => 1 - Math.pow(1 - clamp(x), 3);              // easeOutCubic
const span = (t, [a, b]) => clamp((t - a) / (b - a));         // 0→1 across a scene
const $ = id => document.getElementById(id);
let DATA = {}, FRAMES = {};

async function loadFrames(name) {                              // frames/<name>/ from footage.mjs extract
  const m = await (await fetch(`frames/${name}/manifest.json`)).json();
  return Array.from({ length: m.count }, (_, i) => { const im = new Image(); im.src = `frames/${name}/${String(i + 1).padStart(5, '0')}.jpg`; return im; });
}
window.ready = (async () => {
  // DATA = parse(await (await fetch('data.csv')).text());    // every number from the files
  // FRAMES.clip = await loadFrames('clip');
  await Promise.all([...Object.values(FRAMES).flat(), ...document.images].map(im => im.decode()));
  await document.fonts.ready;
  seek(0);
})();

window.seek = t => {
  // compute every property from t; draw footage with ctx.drawImage(FRAMES.clip[Math.floor((t - start) * 30)], ...)
};

const fit = () => { const s = Math.min(innerWidth / 1920, innerHeight / 1080); $('stage').style.transform = `scale(${s})`; };
if (!location.search.includes('capture=1')) {                 // preview: fit + loop; the renderer never runs this
  addEventListener('resize', fit); fit();
  window.ready.then(() => { const t0 = performance.now(); const loop = n => { seek(((n - t0) / 1000) % DURATION); requestAnimationFrame(loop); }; requestAnimationFrame(loop); });
}
</script>
</body></html>
```

### storyboard.md format

```markdown
# Storyboard — <project>
## Source log
### footage/clip.mp4 (20.0 s, 1280x720, 24 fps, 6.4 MB, audio) — sampled every 2 s, zoomed 4–6 s
- 0:00–0:04  wide shot of clinic hallway, slow pan right; usable, steady
- 0:04–0:06  fast whip to monitor (zoomed): readout "128" legible at 0:05.25
### hero.jpg (1600x900) — patient at rehab station, right third empty (room for text)
### data.csv — rows: Patients monitored=128, Recovery gain=18%
## Scenes (total 30.0 s)
| # | start–end | on screen (verbatim) | source (in–out) | motion |
## Numbers ledger
| on screen | source | location |
| 18% | data.csv | row "Recovery gain", col value |
```

## Tools

`render.mjs` (render + checks) and `footage.mjs` (probe, sheets, scenes, extract) were tested together; change them only to fix a failure. Both live in this skill's `scripts/` folder; copy them into the workspace folder when absent or different.
