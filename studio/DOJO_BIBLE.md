# HABIT DOJO — format bible (channel 4: Instagram + YouTube Shorts)

"Animated tip list": a green/orange ninja head (the channel's profile picture, drawn as vectors) cuts in 4–6 short
tips one by one over a sunset dojo sky, then a lesson line and the tracker CTA. No voiceover. Brand art:
`brand4/profile-habitdojo-1024.png`, `brand4/banner-habitdojo-2560x1440.png`. Renderer `kit/dojo.js`, assembler
`make_dojo.mjs`. A video needs only a ~10-line spec: no design, drawing or timing work.

## The 4 commands (run from `studio/`)

```bash
node make_dojo.mjs dojo-q07 --queue 6              # or: node make_dojo.mjs <name> <spec.json>
node render.mjs dojo-q07                           # out/dojo-q07.mp4 + out/dojo-q07-sheet.jpg
node kit/check_overlap.mjs dojo-q07 --step 0.1     # must print OK (--step 0.0333 for a final pass)
python3 kit/sound/mix.py dojo-q07                  # out/dojo-q07-sound.mp4, QC must print OK
```

`<name>` becomes the project folder `studio/<name>/` (spec.json, generated index.html + sound.json, `kit -> ../kit`).
Do not hand-edit generated files: change the spec (or `kit/dojo.js`) and re-run.

## Daily job

1. Take the next `dojo_queue.json` entry whose `name` is not in `DOJO_DONE.txt` (N = its 0-based index); append the
   name to `DOJO_DONE.txt`. Queue empty → write a new spec by the rules below.
2. Run the 4 commands. `check_overlap` fails → shorten the failing text in the spec and re-run. Mix QC fails → re-run once.
3. Look at `out/<name>-sheet.jpg`: hook readable on frame 0, every item fully visible, lesson + CTA visible.
4. Post `out/<name>-sound.mp4` with the caption template below.

## Spec (`spec.json`)

```json
{
  "name": "dojo-q01",
  "hook": "5 habits that fix your morning",
  "items": ["Drink water first", "Make your bed", "Get some sunlight", "Move for 5 minutes", "Plan your top 3 tasks"],
  "lesson": "Win the first hour, win the day.",
  "cta": "📒 FREE HABIT TRACKER · LINK IN BIO",
  "music_seed": 1
}
```

- `hook` ≤ 44 chars (aim ≤ 32), shown in caps; the leading number is orange (or mark words orange with `*word*`).
  The number must match the item count.
- `items` 4–6 lines, ≤ 28 chars each (30 is the hard limit; long lines auto-shrink), simple and true, no stats or
  medical claims, no brands.
- `lesson` one short sentence ≤ 72 chars (aim ≤ 40). `cta` ≤ 46 chars; the leading 📒 is drawn as a vector notebook.
- `music_seed` integer: odd = `hype` (112–123 bpm), even = `chill` lo-fi (88–93 bpm); also rotates the key.
  Optional overrides: `mood`, `bpm`, `key`.

## Format rules

- 1080×1920, 30 fps, 18–24 s (4 items 18.1 s, 5 items 20.4 s, 6 items 22.7 s). Loops cleanly back to frame 0.
- **Frame 0 = thumbnail:** sky + mountains, big ninja head, hook in Big Shoulders 800 caps (≤ 170 px, ≤ 3 lines).
- 1.0–1.75 s: the hook shrinks into the header (top left) and the ninja flies top-right.
- Items every 2.3 s from 1.9 s: an orange/white slash streak cuts across the empty row, then the card pops (orange
  numbered badge + Hanken 600 line, 64 px), soft `pop`, small camera nudge. The ninja reacts in rotation:
  slash (katana arc over the head) → bounce → nod → headband flick. Previous items stay; layout fits 6.
- Lesson line (Hanken 56 px) + CTA pill (green, orange border) after the last item; the list dims slightly.
- Last 1 s: content fades, hook + ninja return to the frame-0 layout (whoosh) → seamless loop.
- **Safe zone** (`window.CHECK_ZONE = 'dojo'`): all text inside x 100–980, y 220–1500, and never in the IG/YT button
  corner x > 860 & y > 1150. Nothing ever covers a word (streaks are gone before the card appears). No blur.
- Look: navy → purple → sunset sky, stars, drifting embers, two purple mountain ranges, glow behind the ninja.
  Ninja = green circle mask #18785A, orange headband #FF8A2E with two waving tails, cream slit, dark eyes with white
  glints, angry brows (blinks, squints on reactions).
- Sound: music bed with a downbeat hit on the lesson, `shing` on frame 0, `whoosh_short` + `pop` per item, reaction
  SFX (`shing` / `hop` / `ui_tap`), `chime_up` on the lesson, `pop` on the CTA, `whoosh_long` on the loop return.
  Mix ≈ −14 LUFS, true peak ≤ −1 dBFS (mix.py QC).

## CTA rotation (queue entries rotate in this order)

1. "📒 FREE HABIT TRACKER · LINK IN BIO" (default)
2. "📒 START TONIGHT · FREE TRACKER IN BIO"
3. "📒 DAY ONE STARTS NOW · LINK IN BIO"
4. "📒 SMALL STEPS ADD UP · TRACKER IN BIO"

## Caption template

```
<Hook in sentence case> 🥷
<Lesson line>
Save this and try one tonight. Free habit tracker: link in bio.
#habits #discipline #selfimprovement #productivity #habitdojo
```
(Swap 1–2 hashtags for the topic: #morningroutine #focus #studytips #moneyhabits #fitness #nightroutine.)

## Files

`kit/dojo.js` (renderer: background, vector ninja, reactions, layout, `timeline()` + `assemble()`), `make_dojo.mjs`,
`dojo_queue.json` (40 specs), `DOJO_DONE.txt` (used queue names), `kit/check_overlap.mjs` zone `dojo`.
Reference builds: `dojo-01..03/` (queue entries 0–2).
