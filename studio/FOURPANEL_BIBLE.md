# FOUR-PANEL BIBLE — channel "animatedstickhabit"

The format rules for the 4-panel split-screen stick-figure videos. A weekly automated job builds new videos from this
file. Character rig and canvas rules come from `STICK_BIBLE.md` (stick figure, pose library, pure-of-t rendering).
**Not used in this format:** THE WORD CUT, the app end card, "FOLLOW FOR MORE", voiceover.

Reference builds (copy one to start): `mv/stick-4phone-v2/` (desk + phone), `mv/stick-4study/` (desk + in-panel scene
change to a bedroom), `mv/stick-4habit/` (standing workouts, couch, 10-day calendar strip, two-line label).
Kit: `mv/kit/fourpanel.js` (global `FourPanel`, documented in `mv/kit/README.md`, section "Four-panel kit").

## The idea
One title: **"4 WAYS TO … ONLY 1 WORKS."** Four people try four approaches side by side, at the same time. Three lose in
three **different, funny** ways; the fourth (always bottom-right, purple) quietly does the right thing and wins. The
viewer reads all four stories at once, so every panel must be readable on its own at a glance, with the sound off.

## Frame layout (1080 × 1920, fills the whole frame)
| zone | where | what |
|---|---|---|
| hook band | y 168–333 | two lines, BS 800, fitted to ≤ 940 px: line 1 the setup (≈ 84 px), line 2 "**ONLY 1** WORKS." (≈ 96–100 px, "ONLY 1" in the winner purple) |
| grid | x 20–1060, y 340–1880 | 2×2 panels 514 × 764, 12 px gaps, radius 26, dark navy with a radial glow in the panel colour |
| floor | `q.fl = q.y0 + 700` | a thin coloured floor line; 64 px of dark floor below it |
| labels | `q.lx = q.x0 + 40`, `q.ly = q.y0 + 22` | top-left corner of each panel, BS 800 60 px in the panel colour; long names split in two lines with `|` (54 px) |
| badges | right of each label | ✗ (red) / ✓ (green), r 36, pop in at the stamps |
| lesson band | full width, y 884–1096 | opaque band (border in the winner colour) over the grid centre / the lower part of the top row: two lines ≈ 100 px |
| CTA pill | hook band, y ≈ 196–290 | "📒 FREE HABIT TRACKER · **LINK IN BIO**", HG 600 ≈ 48–50 px (≥ 44 px), appears after the hook has left |

**Panel order and colours (fixed):** top-left yellow `#ffd23f`, top-right blue `#3fa9ff`, bottom-left red `#ff3b4e`,
bottom-right purple `#b26bff` = **the one that works**. Loser 1–3 fill the other panels.

## Figures
- One neon stick figure per panel (`FourPanel.neon`): white core, panel-colour outline, layered stroke glow, white head
  with drawn faces (`n h s d w g c m x z b`). No blur filters.
- **BIG**: each figure about 60–70 % of the panel height. Seated scenes `s: 1.3` (desk scenes), standing / workout
  scenes `s: 1.15` (head stays under a prop strip below the label). Never smaller.
- Losers' glow fades to ≈ 0.45 after their fail moment; the winner's glow builds slowly, then a **POWER** moment
  (≈ 15 s): border flash, burst rings, rising sparkles, glow ×2, the figure stands and flexes. The winner always glows
  brighter at the end.

## Story beats (18–24 s; reference timing 22.3 s at 128 bpm)
| t (s) | beat |
|---|---|
| 0 | **Frame 0 = thumbnail**: full hook + all four figures in the same start pose (desk / standing). |
| 1.0 | **GO**: all four start their approach at once. |
| 1–9 | each panel shows its approach; a visible change in every panel at least every ~1 s (new pose, prop, pop, impact, bubble, check, calendar cell). |
| 8.5–11 | the three losers fail, each at its own moment and in its own funny way (snap and grab, fall asleep, panic, buried in paper, wrecked on the floor, cobwebs…). |
| 11–14.5 | losers stay in their failure (still animated), the winner keeps compounding (stack grows, checks fill, plant grows). |
| 14.53–15.0 | music stop, riser → **15.0 POWER** (winner). |
| 15.94 / 16.41 / 16.88 / 17.34 | stamps: ✗ ✗ ✗ then ✓ (loser labels dim to 65 %). |
| 17.55 | hook leaves; 17.81 + 0.2 s per word: lesson words slam in on the band (≤ 7 words, two lines, key words purple). |
| 19.3–19.4 | CTA pill pops in the hook band. |
| 21.55 | lesson + CTA leave; 21.57 **reset**: every panel eases back to its frame-0 pose (0.45 s, rewind sound); 21.8 hook back in. The last frame matches frame 0, so the video loops. |

Lessons: one short line, true and simple, no statistics or numbers (e.g. "SMALL DAILY STUDY BEATS ONE BIG CRAM.").
Canvas words (speech bubbles like "5 MORE MIN", "2 HOURS!") are allowed, short, and count toward ≤ 8 words on screen.

## TikTok UI (mandatory)
- TikTok's buttons sit over the **bottom-right panel** (x > ≈ 930, y ≈ 1000–1600) and its caption over the bottom
  strip. So: the bottom-right label stays at its top-left; the bottom-right figure's **face stays left of x ≈ 780**
  (figure x ≤ `q.x0 + 220`); key props of that panel stay left of x ≈ 930 where possible.
- All DOM words (four labels, hook, lesson, CTA) inside **x 60–1020** and **y ≤ 1260**. Only bottom-row panel *content*
  (figures, props — never words) goes below y 1260.
- `node kit/check_overlap.mjs <project> --step 0.0333` must print **OK**. `fourpanel.js` sets
  `window.CHECK_ZONE = 'fourpanel'`, so the checker uses x 60–1020 / y 150–1260 without the x > 780 corner rule
  (or force it with `--zone fourpanel`). Nothing may sit under or over a word: keep canvas drawing (props, glow,
  wipes, calendars) out of the label boxes; the lesson band and the CTA pill are opaque so the grid behind them is fine.

## Sound (no voiceover)
Kit hype bed, 128 bpm, `gain -5`, `stops: [[14.53, 15.0]]` (record stop before POWER). SFX on every beat: GO whoosh,
one sound per key action in each panel (buzz, can, crumple, page, pops, chimes on checks, uhoh on fails, impacts on
falls), `riser` (align end) + `powerup.wav` + `impact_hard` at POWER, `impact_soft`+`uhoh` on each ✗ stamp,
`chime_up`+`pop` on ✓, whoosh+impact on the lesson, `pop`+`chime_up` on the CTA, `rewind` at the reset, whoosh on the
hook return. Project-only sounds are generated with numpy in `<project>/gen_sfx.py` into `<project>/sfx/` and cued
with `{"t", "file": "sfx/x.wav", "gain"}`. Write the cue sheet with a `<project>/sound_src.py` that mirrors the page's
`T` (see the references). Mix QC: ≈ -14 LUFS, true peak ≤ -1 dBFS, audio length = video length.

## Build checklist (per video)
```bash
cd mv && mkdir stick-4xyz && ln -s ../kit stick-4xyz/kit
# index.html from a reference (FourPanel.create + per-panel draw), sound_src.py (+ gen_sfx.py if needed)
node render.mjs stick-4xyz --scale 0.5          # read out/stick-4xyz-x0.5-sheet.jpg as a harsh TikTok viewer
node kit/check_overlap.mjs stick-4xyz --step 0.0333   # must print OK
node render.mjs stick-4xyz && python3 stick-4xyz/sound_src.py && python3 kit/sound/mix.py stick-4xyz
```
Sheet review: big readable figures; each panel's story clear without sound; a change every ~1 s in every panel; no
two consecutive seconds look the same; the winner obviously wins; last frame = first frame.
