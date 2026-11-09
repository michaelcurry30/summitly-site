# Summitly ad kit (`mv/kit/`)

This folder holds two kits for vertical 1080×1920, 30 fps Summitly ads:

- a **visual kit**, `summit.js`, for frame-pure HTML that `render.mjs` can render;
- a **sound kit**, `sound/`, documented in [sound/README.md](sound/README.md).

The reference build is `mv/ninja-falls/` (`index.html`, `sound.json`, `storyboard.md`).

```
kit/
  summit.js            visual kit, global `Summit`
  check_overlap.mjs    REQUIRED pre-render check: no word covered / overlapped / outside the safe zone
  fonts/               Big Shoulders Display 800 (headlines), IBM Plex Mono 400 (kickers), Hanken Grotesk 600 (chips)
  assets/icon.png      app icon (end card)
  assets/app_s_*.png   app screenshots: run2 = focus screen with timer, Worth +60 m and the Strict mode row
  sound/               mix.py, music.py, sfxgen.py, sfx/
```

## New project in seven steps

```bash
cd mv && mkdir my-ad && ln -s ../kit my-ad/kit
```

1. Write `my-ad/brief.md` and the VO in `my-ad/sound.json`.
2. Measure the VO: `python3 kit/sound/mix.py measure my-ad`.
3. Write `my-ad/storyboard.md` with scene times fitted to the VO.
4. Build `my-ad/index.html` from the skeleton below. Preview it: `node render.mjs my-ad --scale 0.5`.
5. **REQUIRED before the final render:** `node kit/check_overlap.mjs my-ad --step 0.0333` must print `OK` (exit 0).
   Fix every row it prints, then run it again. See "Overlap check" below.
6. Render: `node render.mjs my-ad`.
7. Add the sound: `python3 kit/sound/mix.py mix my-ad`. This writes `out/my-ad-sound.mp4`.

The renderer serves only the project folder. The `kit` symlink makes the kit reachable from there as
`kit/...`.

## Overlap check (`kit/check_overlap.mjs`) — required

**Nothing may ever cover a word**: not the ninja, props, phone, moon, tent, sliced cards, chips, other text or
anything else, at any moment. The checker proves it before you render.

```bash
node kit/check_overlap.mjs <project>                 # step 0.1 s (quick)
node kit/check_overlap.mjs <project> --step 0.0333   # every frame (do this before the final render)
#   --from s --to s   limit the range     --tol 3   px tolerance     --grid 14   sample spacing in px
#   --shots           also save out/<project>-overlap-<t>.png for the first frame of each violation
```

It serves the project like `render.mjs` (1080×1920, `?capture=1`), awaits `window.ready`, and for every `t`
calls `window.seek(t)` and measures:

- **every visible word**: each text node with non-whitespace (HTML or SVG `<text>`), effective opacity > 0.05
  through all ancestors, not `display:none` / `visibility:hidden`. Its box is the tight glyph box
  (`Range.getClientRects` + font metrics).
- **what is painted there**: at a grid of points in each glyph box, `document.elementsFromPoint()` gives the
  paint stack. `COVER` = a painted element above the word (SVG shape, image, box with a background, canvas pixel
  with alpha ≥ 64, another word). `BEHIND` = a painted element under the word that the word's own chip / bubble /
  card background does not hide (e.g. a moon or tent behind a CTA). Both fail.
- **safe zone**: `SAFE` = glyphs outside x 120–960 / y 240–1260, or inside the x > 780 / y > 840 corner.
- **screenshots**: words inside images are pixels the DOM can't see, so every element tagged `data-words` (each
  kit phone sets it) is checked as a whole: `SHOT` = anything from outside the phone (ninja canvas, props, chips,
  captions, ripples, other text) painted over its visible screen. Create the phone **after** `S.canvas()` so the
  ninja and props pass behind it. The checker cannot see a screenshot whose own UI overlaps its text: look at
  every screenshot before using it, and re-shoot it from the app if anything sits on its words.

Ignored: the word's own ancestors and descendants, svg roots, transparent boxes, anything at opacity ≤ 0.1, and
everything inside an element tagged **`data-bg`**. The kit tags the sky, sun, stars, mountain layers, rock steps,
peak and snow (`data-bg="mountains"`), the phone glow (`glow`) and the rewind tint (`rewind`; its REWIND word is
still checked). Tag your own stage-wide backgrounds the same way (`el.dataset.bg = 'night'`). Never tag a prop,
the ninja canvas, a phone or a card to silence the checker; move or retime it instead.

It prints one row per violation range (`t`, kind, word, what covers it) and exits 1 if there are any.
Typical fixes: let the outgoing headline finish fading before the next one starts (no crossfades over the same
spot); lower a hop arc or a flag drop (`S.flagDrop(..., fall, h)`); lower the phone overshoot (`bounce`); layer a
slash under the card it cuts; fade a prop's words before it is sliced or leaves the safe zone.

## Skeleton

```html
<!doctype html><html><head><meta charset="utf-8"><title>My Ad</title>
<script src="kit/summit.js"></script></head>
<body><div id="stage"></div>
<script>
const SCENES = { hook: [0, 3], end: [17, 20] };
const S = Summit, { seg, oC, ioC, lerp } = S;
const stage = S.stage();                                    // injects fonts + kit CSS
const bg = S.mountains(stage, { peak: true });              // layers are stacked in creation order
const can = S.canvas(stage), ctx = can.getContext('2d');    // ninja + flag canvas
const hook = S.text(stage, '<div>IF I OPEN TIKTOK,</div><div class="or">MY NINJA FALLS.</div>', { top: 334, max: 150 });
const end = S.endCard(stage);
S.safeGuide(stage);                                         // only with ?guide=1 in the preview URL
function seek(t) {
  bg.seek(t, { dur: 20 });
  S.clear(ctx);
  S.ninja.draw(ctx, S.ninja.pose(t, { x: 420, y: 1265, s: .9, pose: 'idle' }));
  S.show(hook, t, 0, 2.8, { hold0: true });                 // frame 0 = full hook (thumbnail)
  end.seek(t, 17);
  S.hideInvisible(stage);
}
S.boot({ duration: 20, fps: 30, seek });
</script></body></html>
```

## API (all functions of `t`; nothing animates by itself)

| call | what it does |
|---|---|
| `S.stage()` | Returns `#stage` (1080×1920) and injects the fonts and CSS classes: `.head` (BS 800 headline), `.kick` (PM kicker, letter-spaced), `.chip`, `.or` (orange #ffb36b), `.cy` (cyan #3ee6ff), `.block` (centred, x 120–960). |
| `S.mountains(stage, {peak, steps})` → `bg.seek(t, o)` | Dawn layers: sky, sun, stars, far peak with flag, mid and near ridges. Also four climbing rock steps (`bg.steps`) and the **peak ledge / summit**, whose top is y 1180 across x 342–598. `o`: `camUp` 0–1 (camera climbs), `near` 0–1 (near ridge drops away), `peak` 0–1 (peak rises in), `peakY` px (extra offset; the far-peak flag fades out as it reaches 60 px, so it never pokes into the end-card chip), `snow` 0–1, `steps` (0–1 or one value per step), `stepsOut` 0–1, `dim` 0–1, `dur`. |
| `S.canvas(stage)`, `S.clear(ctx)` | Full-stage canvas for the ninja and flag. Clear it every frame. |
| `S.ninja.pose(t, o)` → `S.ninja.draw(ctx, n)` | **Summit Ninja.** Main fields of `o`: `x`, `y` (feet), `s` (scale), `pose`, `p` (seconds since the pose started), `air` (-1, or 0–1 jump phase), `bump` (squash). Overrides: `face`, `look: [ex, ey]`, `katana: 'back'\|'hand'\|'none'`, `flag`, `r` (lean, degrees), `spin` (degrees about the body centre), `shadow`, `sweat`, `armR`/`armL` offsets. **Poses:** `idle`, `climb`, `hop`, `worried` (wobble and sweat), `slash` (0–.35 s draw and raise, .35–.58 s slash), `plant` (raise the pole by .3 s, plant, then a proud fist from about .65 s), `proud`, `wave`, `fall` (tumbling, flailing, shocked). **Faces:** `n` (neutral), `w` (worried), `h` (happy), `s` (shocked), `d` (determined), `blink`. Size: at `s = 1` the ninja is about 510 px tall and the face sits about 383 px above the feet, so the face is at `y - 383*s`. |
| `S.track(KEYS)` → `at(t)` | Position track. `KEYS` is `[[t, x, feetY, scale, arc], ...]`. Returns `{x, y, s, air, bump}`. Use `arc > 0` for a hop or leap. Use `arc 0` for a straight move, which eases out going up and eases in going down. Feed the result into `pose()`. |
| `S.drawFlag(ctx, x, footY, t, wob, s)` and `S.flagDrop(t, tPlant, footY, fall=.2, h=520)` | Summit flag. `flagDrop` drops it in from `h` px above and wobbles it after it plants at `tPlant`. Use `h` ≈ 200–280 when a headline sits above the summit, so the falling flag never crosses it. |
| `S.phone(stage, {src, x, y, toggle:{x,y}})` → `.seek(t, {in, out, toggleAt, bounce, scale})` | Phone mockup with a lit cyan bezel and glow. It rises with overshoot at `in` and drops at `out`. `bounce` 0–1 scales the overshoot (default 1; use ≈ .25 when a headline sits just above). `scale` zooms the phone about its top-left corner: at the default 380×798 a screenshot is too small to read on a phone, so for screens that carry the story use `scale: 1.6` (x 352–960, top ≈ 644, running off the bottom edge) and zoom/pan the screenshot onto the key element (see `coach-sensei/lib.js` `screens(..., {ay, winH, scale})`). The optional strict-mode toggle flips on at `toggleAt`. On `app_s_run2.png` the toggle sits at screen position `{x: 290, y: 660}`. |
| `S.notif(stage, {app, when, text, x, y})` → `.seek(t, {in, nudge:[a,b], cut, exit})` | Generic notification card with a gradient play icon. Defaults: "Scroll · now / New videos for you". **Never show a real brand name or logo on it.** It drops in from 70 px above (never from off-screen). Its words fade out during the katana raise (`cut` − .12 → − .04), then at `cut` it splits along a diagonal and the blank halves fly left and right off-screen in the card's band. Create `S.slash` **before** the card so the blade is layered under it. |
| `S.slash(stage, {d})` → `.seek(t, t0, dur)` | Katana slash arc: a white core with a cyan glow that draws on, then fades. The default path matches the card cut at y 500. |
| `S.rewind(stage, {x, y})` → `.seek(t, a, b)`, `.jitter(t)` | VHS rewind overlay: cool tint, scanlines, tracking bars and a blinking "◀◀ REWIND" badge (default at 140, 1150; move it with `{x, y}` off any path the ninja takes). No blur. To show the rewind itself, evaluate your own `ninjaAt()` backwards (see ninja-falls). |
| `S.text(stage, html, {top, max, cls, color})` | Headline. Pass one line, or `<div>` lines (`class="or"` for orange, `data-max` for a per-line size). It auto-shrinks to fit 840 px. Use `max` 110–190. |
| `S.kicker(stage, txt, {top, color})`, `S.chip(stage, html, {top, left, size, cyan})` | Kicker and pill chip. `<b>` inside a chip renders in teal. |
| `S.show(el, t, a, b, {hold0, pop, dy, rot})` | Enters at `a` (0.35 s fade and slide) and leaves at `b` (0.3 s). `hold0` means already fully in at `a` (use it for the frame-0 hook). `pop` adds an overshoot. |
| `S.endCard(stage, {top=320, icon})` → `.seek(t, t0)` | **End card:** icon, "SUMMITLY", "FREE ON THE APP STORE" and a cyan chip reading SEARCH "SUMMITLY" (y 320–930; the wide kicker ends above y 840 so nothing sits in the x > 780 / y > 840 corner). Staggered pops from `t0`. Keep the ninja, flag and every prop (moon, tent…) below y ≈ 960 and out from behind the words (feet about 1300, `s` ≤ 0.5). Put the sound kit's `sting` at `t0`. |
| `S.safeGuide(stage)` | Safe-zone overlay, shown only when the URL contains `?guide=1`. |
| `S.boot({duration, fps, seek, ready})` | Render contract: `DURATION`, `FPS`, `STAGE_W/H`, `seek`, `ready`. It decodes images, loads fonts, fits headlines and paints t = 0. The preview loops when not capturing. |
| `S.hideInvisible(stage)` | Call it at the end of `seek`. Elements at opacity 0 leave the render tree. |
| Helpers | `clamp`, `seg(t, a, b)`, `oC`, `iC`, `ioC`, `oBack`, `lerp`, `tri(t, a, b)`, `hash(n)` (seeded, deterministic), `C` (palette). |

## Rules (TikTok / Reels / Shorts)

- **Nothing ever covers a word** (on top or behind, at any frame). `node kit/check_overlap.mjs <project> --step 0.0333`
  must print OK before the final render.
- **Readable screens:** a phone screenshot that carries the story is shown at `scale` ≈ 1.6 and zoomed onto the
  key element; never overlay captions, tap ripples, chips or props on the screenshot, and layer the phone above
  the ninja canvas. Use only clean screenshots (nothing in the app's own UI covering its text).

- **Frame 0 is the full hook**: headline plus the ninja on the dawn ledge. It doubles as the thumbnail.
- **Safe zone:** words, logo, CTA and the ninja's face stay inside x 120–960, y 240–1260. Nothing important
  at x > 780 below y 840, or in the bottom 660 px.
- Headlines 90–190 px, kickers and body text 40 px or more, 8 words or fewer on screen at once.
  High contrast: white or #ffb36b on navy.
- No blur, no confetti spam, no real brand logos. The word "TikTok" may appear in the hook line only.
  Notifications use the generic "Scroll" card.
- Every number on screen needs a source in the storyboard's numbers ledger. Approved so far: "+60 m" and
  "+25%" (both from `app_s_run2.png`).
- Motion: ease every move, use integer px for text (no scaling text), and give every animated element the
  `.abs` class (`will-change`).
- Sound: the VO starts by 0.5 s and every VO line is also on screen (see `sound/README.md`).

---

# Stick Ninja kit (`kit/stick.js`) — brand-neutral lesson videos

`stick.js` is a separate, self-contained kit (global `Stick`) for the STICK NINJA series (see `mv/STICK_BIBLE.md`):
animated habit / productivity / dopamine lessons with **no app, no brand, no store line and no logo end card**.
It does not load or change `summit.js`. Reference builds: `mv/stick-dopamine/` and `mv/stick-two-minute/`
(each has `brief.md`, `storyboard.md`, `sound.json`, `index.html`).

```bash
cd mv && mkdir my-lesson && ln -s ../kit my-lesson/kit
# brief.md -> sound.json (VO) -> python3 kit/sound/mix.py measure my-lesson -> storyboard.md -> index.html
node render.mjs my-lesson --scale 0.5                 # preview + sheet; zoom: node footage.mjs sheets out/my-lesson-x0.5.mp4 --every 0.1 --from A --to B
node kit/check_overlap.mjs my-lesson --step 0.0333    # must print OK
node render.mjs my-lesson && python3 kit/sound/mix.py my-lesson
```

Ending convention (replaces the Summitly end card): the lesson in one line + a small dark chip
`S.chip(stage, 'FOLLOW FOR <b>MORE</b>', {cls: 'dark'})`. End-button sound = `shing` + `chime_up` (never `sting`).

## Skeleton

```html
<script src="kit/stick.js"></script>
<div id="stage"></div>
<script>
const S = Stick, stage = S.stage();
const E = { bed: S.env(stage, 'bedroom'), roof: S.env(stage, 'rooftop') };   // environments first (back)
const W = S.world(stage);                                                    // then the world canvas + flash layer
const meter = S.meter(stage, { x: 132, y: 650 });                            // screen-space overlays
const head = S.kin(stage, '<div>PHONE AWAY.</div><div><i class="or">LET IT BE</i> BORING.</div>', { top: 268 });
const tl = S.ninja.timeline([[0, 'scroll', { swipes: [.4, 1.2] }], [2, 'slash'], [3.3, 'ready']]);
const SC = [
  { a: 0, b: 2.5, env: E.bed, cam: t => ({ x: 470, y: 1045, z: 1.4 }), draw(ctx, t) { S.ninja.draw(ctx, S.ninja.pose(t, { J: tl(t), x: 455, y: 1500, s: 1 })); } },
  { a: 2.5, b: 6, env: E.roof, whip: 'up', cam: t => ({ x: 540, y: 900, z: 1.2 }), draw(ctx, t) { /* ... */ } },
];
function seek(t) {
  W.seek(t, SC, { shake: [0, 0], flash: 0 });
  meter.seek(t, S.dopa([.4, 1.2]), { op: 1 });
  S.kinShow(head, t, 0, 2.2, { hold0: true, beats: [0, 0, 0, 0, 0] });
  S.hideInvisible(stage);
}
S.boot({ duration: 6, fps: 30, seek });
</script>
```

## API (everything is a pure function of `t`)

| call | what it does |
|---|---|
| `S.stage()`, `S.boot({duration, fps, seek, ready})`, `S.hideInvisible(stage)`, `S.safeGuide(stage)` | Same contract as summit.js (fonts BS/PM/HG, 1080×1920, `?guide=1` overlay). |
| `S.text(stage, html, {top, max})`, `S.kicker`, `S.chip(stage, html, {top, cls:'dark'\|'cyan', size})`, `S.show(el, t, a, b, {hold0, pop, dy, dx})` | Headline / kicker / chip / enter-leave. Colours: `.or` orange, `.cy` cyan, `.pk` pink. |
| `S.kin(stage, html, {top})` + `S.kinShow(el, t, a, b, {beats:[t per word], style:'pop'\|'slam'\|'rise', hold0})` | **Kinetic headline**: one span per word, each wiped on with `clip-path` on its own VO beat (glyphs never move more than a few px, so an entering word never overlaps a neighbour and passes `check_overlap`). Wrap words in `<i class="or">…</i>` to colour them. Leaves at `b` (0.25 s). |
| `S.env(stage, kind, opt)` | Flat set in **world coords** (floor at y 1500; art covers x −540…1620): `bedroom` (window + moon, shelf, desk 560–1030 with drawer and lamp, stool), `library` (shelves, arched window, `opt.day`), `rooftop` (skyline, moon, water tower, blinking antenna), `mountain` (dawn ridges, `envOpt: {rise}`), `feed` (inside the phone: blank feed cards that scroll with `envOpt: {scroll}`), `void` (`opt.bg`, `opt.glow`). Tagged `data-bg`; tops are darkened where captions sit. Not a will-change layer (the camera scales it). |
| `S.world(stage)` → `W.seek(t, SCENES, {shake:[dx,dy], flash, flashColor})` | **Camera + whip director.** `SCENES = [{a, b, env, cam(t)→{x, y, z, r}, envOpt(t), draw(ctx, t), whip}]`. The canvas is transformed by the scene camera, so `draw` works in world coords and stays crisp at any zoom. `whip` = how a scene enters at `a`: `left`/`right`/`up`/`down` (0.32 s, both scenes slide a full screen, drawn speed lines below y 720) or `cut`. Two scenes that share an env must use `cut`. |
| `S.ninja.timeline([[t0, pose, args, blend], ...])` → `J(t)` | Pose sequence; each pose gets `u = t - t0`; blends from the previous pose over `blend` s (default .18, eased). |
| `S.track([[t, x, y, s, arc], ...])` → `{x, y, s, air, vx, land}` | Position track (eased; `arc` > 0 = hop/leap). Spread it into `pose()` for landing squash, air stretch and tail drag. |
| `S.ninja.pose(t, {J, x, y, s, fx, face, look, sq, r, spin, vx, glow, ground, flip, props})` → `S.ninja.draw(ctx, n)` | **The Stick Ninja**: round black head, cyan headband with two flowing tails (secondary motion from `t` and `vx`), thick round-capped limbs (2-bone IK), cyan belt, katana on the back, cyan rim on the upper-left. About 440 px tall at `s = 1`; face ≈ 410·s above the feet (standing), ≈ 280·s when sitting. `fx: -1` faces left. Faces: `n h s d w g`(glazed) `c`(closed) `x`(dizzy) `f`(focused), auto-blink; `front` poses look at the camera. |
| Poses (`S.ninja.POSE`) | `idle breathe walk run jump crouch slash ready sheath point cheer pump kick throw sit type scroll slump stretch climb fall getup facepalm shrug look proud wave push crushed flat read reach sitBack`. Args: `scroll {swipes:[pose-local t], sit}`, `sit/type {dx, dy, lean, tilt, face}`, `read {sit}`, `point {ang}`, `reach {x, y}`, `crushed {k}`, `jump {ph, flip}`. `scroll` holds a phone (glow cone on the face), `read` holds a book (page flip via `flip`). |
| `slash` timing | 0–.08 reach for the hilt, .08–.28 draw + crouch (anticipation), .30–.42 strike with a drawn **smear crescent** (white core, cyan edge, no blur), hold, .9–1.25 recover to `ready`. `S.ninja.SLASH.uAt(deg)` = pose-local time when the sword hand is at angle `deg` (0 forward, −90 up); `S.ninja.reach(n)` = the blade circle `{cx, cy, R}` in world coords at that moment. |
| `S.wordcut({text, x, y, size, color, color2, side, depth, angle, off, seed})` → `wc.draw(ctx, t, {in, mode, cut, floor, wob, kick, fadeAt, out, from, rot0, h})` | **THE WORD CUT.** A solid extruded word (dark outline, gradient face, bevel, `depth` px extrusion) rendered crisp at the current zoom. Arrival `mode`: `drop` (falls `h` px with gravity, lands with squash), `fly` (slides in from `from` with overshoot), `pop`. At `cut`: 2 hot frames (word white, bright slit along the cut) → the word is split by two `clip` half-plane polygons along the exact cut line (`angle`°, through the centre + `off`) → 0.2 s clean-cut beat (the upper piece slips down the cut, sliver gap, the cut faces glint — a line composited `source-atop` so it lies only on the glyphs) → both halves fall with gravity and rotation (far half knocked along the blade, `kick`), optional `floor` bounce, `fadeAt`. Sparks (line streaks) + shards fly from the cut. `wc.shake(t, cut)` → 8 px decaying jitter, `wc.flash(t, cut)` → 2-frame accent flash; feed both to `W.seek`. |
| Aligning a cut with the blade | `HA` = hand angle at impact (−60…−70 gives a 20–30° descending cut above the head). `TS = TH - S.ninja.SLASH.uAt(HA)`; evaluate the ninja at `TH` (with its track), `RC = S.ninja.reach(n)`, then put the word at `RC.cx + RC.R·cos HA, RC.cy + RC.R·sin HA` with `angle: HA + 90`. See `stick-dopamine` (rooftop) and `stick-two-minute` (bedroom). |
| `S.meter(stage, {x, y, h, label})` → `.seek(t, fn, {op, dx, dy, shake, base})` and `S.dopa(SWIPES, {base, peak, crash, calm:[t0,t1], calmLevel})` | **Dopamine meter**: tube gauge (cyan → orange → pink, red outline when spiking, pointer) + a live 2.4 s trace, painted on its own canvas; label is DOM text (checked). `dopa()` builds the level: every swipe spikes (0.1 s) then crashes below the baseline, which sinks with each hit; `calm` eases to a steady level. No numbers or scale on purpose. |
| `S.goblin.draw(ctx, {x, y, s, t, face:'grin'\|'shock'\|'sad', armL, armR, squash, fx})` | **The Scroll Goblin**: chubby purple phone-bodied gremlin with a grinning screen face, horns, stubby limbs (optional extra). |
| Props | `S.phone(ctx, x, y, s, rot, {glow})`, `S.book(ctx, x, y, s, rot, {open, flip, col})`, `S.laptop(ctx, x, y, s, {on, lines})`, `S.check(ctx, x, y, s, k)`, `S.calPage(ctx, x, y, s, 'DAY 3', {rot, op, col})`, `S.sparks(ctx, t, t0, x, y, {...})`, `S.hearts(ctx, t, t0, x, y, {n, seed, s})`. |
| Helpers | `clamp seg oC iC ioC io oBack oElastic lerp tri hash V C FLOOR`. |

## Rules specific to the Stick kit
- **Words the ninja touches are props.** The physical words (TIKTOK, LATER, READ 50 PAGES…) and calendar sheets are
  drawn on the canvas, like a screenshot: keep the ninja's body off them except the blade at the cut, keep them below the
  caption band, and count them in the "≤ 8 words on screen" budget. Captions stay DOM text and must pass `check_overlap`.
- Captions of a scene must be gone (leave ≥ 0.45 s before) when the next scene enters with a vertical whip, and two
  consecutive caption blocks must not cross-fade in the same spot.
- Big ninja: frame the floor at screen y ≈ 1600–1720 so the figure is 550–650 px tall and the face stays above y 1260.
- Determinism: anything that changes every frame and is drawn by the browser (meter, env) is either canvas-painted or
  not a will-change layer. `render.mjs` must report identical re-seeked frames; run renders one at a time.

## Stick kit extensions (appended for videos 3–4; additive, nothing above changed)
Reference builds: `mv/stick-motivation/` (cloud, clock, meter relabelled MOTIVATION) and `mv/stick-environment/` (rope, hall, box).

| call | what it does |
|---|---|
| Poses | `tug {k, face}` lean back gripping a rope (trembles), `yanked` pulled backwards by the belt (hips lead, limbs trail), `chin {face}` sitting, chin on hand (bored), `carry {dx, dy, face, still}` walking with something held at arm's length, `reachUp {x, y, face}` stretching up on tiptoe. |
| `S.belt(n)` | World point of the ninja's belt (tie a rope there). |
| `S.rope(ctx, A, B, {len, t, vib, snap, keep, col, w})` | Pink braided rope A→B: sags when `|AB| < len`, taut + vibrating (`vib` 0–1) otherwise. `snap` = seconds since it snapped: both halves recoil with a decaying curl, the A half fades, the B half keeps a `keep` px stub. |
| `S.cloud(ctx, x, y, s, t, {face:'smug'\|'happy'\|'wink'\|'none', sparkle, rain, grey, op})` | THE MOTIVATION CLOUD: puffy lilac cloud with orbiting gold sparkles (radius ≈ 190·s), `rain` drops sparkles ≈ 420·s below, `grey` fizzles it. Keep it ≥ 200·s below the caption band. |
| `S.wallClock(ctx, x, y, s, hours)` | Wall clock showing `hours` (drive it with an accelerating function of t for "time passing"). |
| `S.box(ctx, x, y, s, lid)`, `S.door(ctx, x, y, s, open)`, `S.buzz(ctx, x, y, t, k)`, `S.star4(ctx, r, col)` | Lidded wooden box (bottom centre), door slab, vibration marks around a buzzing phone, 4-point sparkle. |
| `S.env(stage, 'hall')` | "Another room": open doorway (x 130–430), wainscot, sconce, picture frame, side table (x 640–940, top y 1250). Same contract as the other envs. |

## App versions + videos 5–7 (appended; additive, nothing above changed)

### App versions (`DOWNLOAD SUMMITLY` ending, see STICK_BIBLE "APP VERSION")
One page serves both channels. Each project loads `variant.js` before `kit/stick.js`:
`<project>/variant.js` sets `window.APP_VERSION = 0` (brand-neutral, FOLLOW FOR MORE) and the sibling folder
`<project>-app/` holds `variant.js` (`window.APP_VERSION = 1`), a symlink `index.html -> ../<project>/index.html`, the `kit`
symlink and its own `sound.json`. So `node render.mjs <project>-app` + `python3 kit/sound/mix.py <project>-app` write
`out/<project>-app.mp4` / `out/<project>-app-sound.mp4`, and the neutral render is untouched.
In the page: `const APP = !!window.APP_VERSION`; the lesson captions leave at `EC0 - .3`, the FOLLOW chip is skipped,
`const endCard = APP ? S.endCardApp(stage) : null` is created LAST and `endCard(t, EC0)` runs every frame; `DURATION = EC0 + 3.3`.
New videos may insert an app beat of `AB` s at `INS` (`L = x => x + AB` shifts everything after it; `AB = 0` in the neutral page).

| call | what it does |
|---|---|
| `S.endCardApp(stage)` → `ec(t, t0)` | **The app end card** (3.3 s, identical everywhere): katana-slash wipe to a navy card, the ninja leaps in (flip) onto a summit ledge, the real icon (`kit/assets/icon.png`, rounded, cyan glow) pops at t0+.5, DOWNLOAD / SUMMITLY (y ≈ 540–815), katana twirl → points at the icon (spark + shine), FREE ON THE APP STORE (t0+1.55) and the chip SEARCH "SUMMITLY" (t0+2.05) centred at x 430 (clear of the x>780/y>840 corner, all inside y 1260). VO "Download Summitly. Free on the App Store." at t0+.30; `sting` at t0+.50. Its decor is a data-bg software canvas (deterministic). |
| `kit/sound/app_version.py <project> <EC0>` | Writes `<project>-app/sound.json` from the neutral cue sheet: drops "Follow for more." and the sign-off SFX, ends the beds at EC0, adds a hype bed hitting the icon reveal and the end-card VO/SFX. `with_app_beat(cues, INS, AB, vo, sfx)` shifts cues for an inserted app beat (see `stick-*/sound_src.py`). |
| `S.appPhone(stage, {src, x, y, w, h, chin, crop:{x, y, s}})` → `.seek(t, {in, out, pan, panAt})` | A big phone (screen + chin with a home button) showing a window of a REAL screenshot (`data-words`), fade + rise in place (no scaling). Keep the screen bottom (y + 14 + h) above 1260 and x + w below 780; crop so the phone's island sits over no text. Real shots: `assets/app_s_focus10.png` (10:00 focus timer), `app_s_streak.png` (habits with 21/9/4 day streaks), `app_s_stack.png` (two stacked habits, 6 day streaks), re-shot from the app (`pro2/www`) with `mv/_shoot.mjs`. |
| Poses | `flourish {aim}` (katana twirl → thrust pointing), `hide {face}`, `eat`, `sweep`, `pushup`. |
| Props | `monster(ctx, x, y, s, t, {mood:'roar'\|'grin'\|'shock'\|'cute', roar, label})` THE TASK MONSTER (~590·s tall incl. horns); `timer(ctx, x, y, s, k, {label, size})`; `link(ctx, x, y, ang, s, face, o)` / `chain(ctx, P, n, s, {total, glowAt, op})`; `block(ctx, x, y, w, h, label, {icon, col, dark, studs, rot, sc})` (icons cup brush book stretch check plus; no label → big centred icon); `note`, `chips`, `mail`, `mug`, `brush`, `cutters`, `qmark`. |
| Envs | `kitchen` (counter top y 1236–1250 from x 380), `bath` (mirror, sink counter y 1232). |
| Lessons learned | Set `lineCap` / `lineJoin` explicitly in every canvas helper (the world's speed lines leave `lineCap='round'` on the context, which otherwise makes frames history-dependent). Canvas set dressing that reaches the caption band (a cliff, a rope) must fade out below screen y ≈ 600 (see `fadeUp` in `stick-chain`). Half-scale previews (`--scale 0.5`) can report GPU tile-seam drift that the full-scale render does not have; judge determinism on the final render. |

## Four-panel kit (`kit/fourpanel.js`, appended; additive, nothing above changed)
2×2 split-screen format for the "animatedstickhabit" channel — rules in `mv/FOURPANEL_BIBLE.md`. Load it after
`stick.js`. It only reads `Stick` and registers extra pose names (`q…`) in `Stick.ninja.POSE`; no other project changes.
References: `mv/stick-4phone-v2/`, `mv/stick-4study/`, `mv/stick-4habit/`.

```html
<script src="kit/stick.js"></script><script src="kit/fourpanel.js"></script>
<div id="stage"></div>
<script>
const S = Stick, F = FourPanel;
const T = { dur: 22.3, POWER: 15, stamps: [15.94, 16.41, 16.88, 17.34], hookOut: 17.55, les0: 17.81, cta: 19.4, lesOut: 21.55, reset: 21.57, hookIn: 21.8 };
const FP = F.create({ labels: ['A', 'B', 'LONG|NAME', 'WINNER'], hook: ['4 WAYS TO X.', '<i class="fp-hl" style="font-style:normal">ONLY 1</i> WORKS.'],
  lesson: ['LINE <i class="fp-hl">ONE</i>', 'LINE TWO.'], T, s: 1.3 });
const tl = [0, 1, 2, 3].map(i => S.ninja.timeline([[0, 'qType'], [1, 'qStare'], [T.reset, 'qType', {}, .5]]));
function draw(ctx, i, t, q) {                       // panel-local scene, already clipped + shaken
  F.desk(ctx, q, q.fx, q.fl, FP.s);
  const n = S.ninja.pose(t, { J: tl[i](t), x: q.fx, y: q.fl, s: FP.s });
  F.neon(ctx, n, q, FP.glow(i, t, { fail: 9, power: T.POWER }), {});
}
S.boot({ duration: T.dur, fps: 30, seek: t => FP.frame(t, { draw, glow: (i, t) => FP.glow(i, t, { fail: 9, power: T.POWER }) }), ready: FP.ready });
</script>
```

| call | what it does |
|---|---|
| `F.create(cfg)` → `FP` | Builds the whole format: bg canvas (`data-bg`), figure canvas, 4 labels, hook, lesson band, CTA pill; sets `window.CHECK_ZONE = 'fourpanel'`. `cfg`: `labels` (4; `|` = line break), `colors` (default yellow/blue/red/purple), `winner` (3), `hook` [2 html lines], `hookMax`, `lesson` [2 lines; `<i class="fp-hl">` = purple word], `lessonMax`, `cta` html, `labelSize`, `s` (figure scale, 1.3 seated / 1.15 standing), `T` (`dur, stamps[4], hookOut, les[] or les0 (+.22 s/word), lesOut, cta, reset, hookIn`). |
| `FP.Q[i]` | Panel: `x0 x1 y0 y1 w h`, `fl` (floor y), `fx` (default figure x), `lx ly` (label), `labBot` (first free y under the label), `col rgb`, `s`. |
| `FP.frame(t, {draw, glow, shake, flash})` | Paints a frame: panels + glow + borders, calls `draw(ctx, i, t, q)` clipped per panel (plus `shake(i,t)` px and an automatic stamp shake), ✗/✓ badges, label dimming, hook in/out, lesson band (opens from its centre line, words rise in on beats), CTA pill, `hideInvisible`. |
| `FP.ready` | Pass as `S.boot({ready})`: fits every line to 940 px and measures labels. |
| `FP.glow(i, t, {fail, power, build:[a,b]})` | Default glow curve: losers fade after `fail`; the winner builds over `build` and flashes at `power`; both ease back at the reset. `FP.resetK(t)` = 0→1 during the reset. |
| `F.neon(ctx, n, q, G, o)` | Neon stick figure from `Stick.ninja.pose` (`n.r` rotation supported); `o: {face, look, front, lit, dim, seed}`; returns `{hc, hand, handB}` in world px. Faces `n h s d w g c m x z b`. |
| Poses (seated unless noted) | `qType {rate, face, dy}`, `qWrite {rate, dy}`, `qStare`, `qGrab {x, y}`, `qScroll {d0, rate, face}`, `qPump`, `qUp`, `qSlam`, `qChin {face}`, `qSleep` (head on a desk at -200), `qNod {per}`, `qPanicSit`, `qCrumple {per}`, `qRelax`, `qDrink`, `qJitter`, `qCouch {face}` (couch, hip -84), `qLie {face}` / `qWreck` (on the back / floor), standing: `qPanic`, `qCurl {rate}`, `qJack {rate}`, `qLimp`, `qSquat {rate}`, `qFlex`, `qCross`, `qTick {x, y, per}`. Plus every `stick.js` pose (`walk`, `pushup`, `shrug`, `facepalm`, `reachUp`, `stretch`, `getup`, `crushed`, …). |
| Props | `desk(ctx, q, x, y, s, {top, laptop, stool})` → `{top}`, `laptopGlow`, `phone(ctx, x, y, r, k, {s, held})`, `buzz`, `notif` (blank bubble), `sweat`, `sparkle`, `tick` (floating ✓), `zzz`, `power(ctx, q, x, y, t, t0, until, z)` (winner burst), `impact` (radiating marks), `calendar(ctx, x, y, w, h, cols, rows, state(i)→''\|'v'\|'x'\|'gap', pop(i), {col})`, `can`, `paper(…, crumple)`, `bookStack`, `couch`, `bed` + `blanket`, `dumbbell`, `window2`, `bubble(ctx, x, y, 'TEXT', k, {size, z})` (short canvas word), `clock(ctx, x, y, z, hours, ring, t)` (alarm), `plant(ctx, x, y, z, grow, col, t)`, `badge`, `rr`, `shk`. Also usable: `Stick.cloud`, `Stick.timer`, `Stick.qmark`, `Stick.wallClock`. |

`check_overlap.mjs` now takes `--zone default|fourpanel` (default = the page's `window.CHECK_ZONE`, else the classic
x 120–960 / y 240–1260 + corner zone, so older projects are checked exactly as before).
