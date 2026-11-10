# QUIET PROGRESS — format bible (channel 3)

Calm, minimalist, glowing-purple **visual metaphors** about habits and progress. No voiceover, no faces, no brands.
Each video is 4–5 short metaphor scenes in a row, each one clean idea with 1–3 small soft labels, then a closing line
and the habit-tracker CTA. Brand art: `brand3/profile-quietprogress-1024.png`, `brand3/banner-quietprogress-2560x1440.png`.

Everything is built from a **scene library + assembler**, so a daily video needs no drawing or timing work:

```bash
cd mv
node make_quiet.mjs quiet-q07 --queue 6            # or: node make_quiet.mjs <project> <spec.json>
node render.mjs quiet-q07                          # silent MP4 + contact sheet (out/quiet-q07.mp4, -sheet.jpg)
node kit/check_overlap.mjs quiet-q07 --step 0.1    # must print OK (use --step 0.0333 for a final pass)
python3 kit/sound/mix.py quiet-q07                 # out/quiet-q07-sound.mp4, QC must print OK
```

`node make_quiet.mjs --list` prints every scene id with its default labels and length.
Reference builds: `mv/quiet-01/`, `mv/quiet-02/`, `mv/quiet-03/` (each holds only `spec.json`; `index.html` and
`sound.json` are generated). Do not hand-edit generated files: change `spec.json` (or the library) and re-run.

## The daily job (automated)

1. Pick the next unused entry of `mv/quiet_queue.json` (30 ready specs; `name` = project folder). If the queue is empty,
   write a new spec by the rules below (only scene ids from the library).
2. Run the four commands above. If `check_overlap` fails, do not post: shorten the failing label text in the spec
   (or swap the scene) and re-run. If the mix QC fails, re-run once; then report.
3. Open `out/<name>-sheet.jpg` and check: every scene reads at a glance, the hook is on frame 0, the CTA is visible.
4. Post `out/<name>-sound.mp4`. Caption: the hook + 3–5 hashtags (#habits #selfimprovement #discipline #growth #mindset).

## Spec format (`spec.json`)

```json
{
  "hook": "Success is built quietly.",                       // <= 6 words, sentence case, shown on frame 0
  "scenes": [                                                 // 4 or 5 library scenes, in order
    { "id": "perfectionism-vs-consistency" },
    { "id": "motivation-vs-discipline", "labels": { "a": "HYPE", "b": "HABIT" } },   // optional label override per slot
    { "id": "comfort-to-growth" },
    { "id": "procrastinate-overthink-do" }
  ],
  "closing": "Small steps. Every day.",                       // <= 6 words: the answer, shown with the CTA
  "music_seed": 1,                                            // varies the calm bed (progression start + arpeggio)
  "key": "D major",                                           // optional, default D major ("A minor", "C major", ...)
  "bpm": 72,                                                  // optional, 64-80
  "cta": "free habit tracker · link in bio",                  // optional (default shown)
  "watermark": "@quietprogress",                              // optional text, or false
  "close": 5.2                                                // optional closing-beat length (s)
}
```

`make_quiet.mjs` refuses a spec that breaks a rule: unknown id / slot, not 4–5 scenes, hook or closing over 6 words,
more than 6 label words in a scene, or a total outside 25–40 s.

## Format rules

- **Canvas** 1080×1920, 30 fps, 25–40 s (4 scenes ≈ 32 s, 5 scenes ≈ 38 s). Scenes are 6.5–7.5 s each; they cross-fade
  over 0.8 s (soft whoosh). The closing beat (5.2 s) continues the last scene in its "answer" state.
- **Frame 0** already shows scene 1 in motion plus the hook line (never an empty frame; it is the thumbnail).
- **Words:** ≤ 6 label words per scene (the hook on scene 1 and the CTA on the closing are extra). Labels are small,
  uppercase, letter-spaced Hanken Grotesk 600 (28–44 px), soft glow; the hook / closing line is 62–70 px sentence case.
- **Labels are never covered** (nothing drawn over or behind a word): `check_overlap` must print OK. Labels leave
  before the cross-fade starts and enter after it ends.
- **Safe zone:** all text inside x 120–960, y 240–1260 (`window.CHECK_ZONE = 'quiet'`, no corner rule).
  Layout grid: hook / closing y 270–420 (no art there), art y 450–1120 on the ground line y 1100, label band y 1140,
  CTA y 1150, watermark y 1222 (24 px, 50 % opacity).
- **Closing:** the last scene shows the answer (the good side wins, glows), then the closing line and a small but
  readable CTA "📒 free habit tracker · link in bio" (40 px; the notebook is drawn as an icon because the renderer has
  no emoji font). Closing words are an answer, not a question.
- **Loop:** the last 0.4 s cross-fade back into frame 0 (scene 1 + hook), so the video loops seamlessly.
- **Motion:** slow sine easing everywhere; nothing static for more than ~1.5 s (figures breathe, dust drifts, glows
  pulse, every scene has a main action). No camera blur, no shake, no flashes.
- **Look:** near-black indigo radial background with vignette; monochrome lavender → periwinkle (#cfc6ff → #6f5ce8),
  white highlights; gaussian bloom on everything drawn (soft glow); thin glowing ground lines; rounded 3D-ish figures
  (round head with a sphere gradient, tapered capsule limbs, far limbs darker); a light dust layer.
- **Content:** simple, true, no statistics or claims with numbers ("1%" only as the name of the idea), no brands,
  no faces, no text on props. One idea per scene; the metaphor must read with the sound off.
- **Sound:** no VO. Calm bed (`mood: calm`, slow felt piano + pad, 72 bpm, no drums) with a soft chord on the closing
  (`hit`), soft `air` whoosh on every scene change, small `soft_tap` / `soft_chime` / `shimmer` / `swell` / `flare` /
  `fizz` accents from each scene's cue list, a chime on the closing line. Mix ≈ −14 LUFS, true peak ≤ −1 dBFS
  (`mix.py` QC enforces it).

## Scene library (`kit/quiet.js`, `Quiet.SCENES`)

| id | s | label slots (defaults) | what happens |
|---|---|---|---|
| `perfectionism-vs-consistency` | 6.5 | a PERFECTIONISM, b CONSISTENCY | one figure keeps placing a block that wobbles and falls; the other adds a small block every half second, the tower grows tall |
| `motivation-vs-discipline` | 6.5 | a MOTIVATION, b DISCIPLINE | a huge flare with sparks fizzles to smoke (figure cheers, then slumps); a seated figure tends a small steady flame |
| `comfort-to-growth` | 7 | a COMFORT ZONE, b GROWTH ZONE | figure sits in the centre of three ground rings, stands, walks out; each ring lights as it crosses; it grows and glows outside |
| `procrastinate-overthink-do` | 7.5 | a PROCRASTINATING, b OVERTHINKING, c DOING | one reclines with a phone, one thinks under a tangled scribble, only DOING climbs the switchback trail to the summit (light rises) |
| `expectation-vs-reality` | 6.5 | a EXPECTATION, b REALITY | a straight rising line drawn fast vs a wavy line with dips that still ends higher; tiny walkers on both |
| `one-percent-rule` | 7 | a THE 1% RULE, b IT ADDS UP. | tiny steps placed one by one, the camera pulls back to reveal a huge staircase with the tiny figure on top |
| `seen-vs-hidden` | 7 | a WHAT PEOPLE SEE, b WHAT IT TOOK | a figure celebrates on a podium; below ground a long switchback tunnel is revealed and a tiny figure walks all of it up to the podium |
| `chase-vs-build` | 7 | top DON'T CHASE. BUILD., a CHASE, b BUILD | one runs and jumps after a floating orb that drifts away; the other builds steps, climbs, and the orb comes down to its hand |
| `confidence-vs-ego` | 6.5 | a CONFIDENCE, b EGO | two icebergs: small tip over a huge base vs big tip over almost nothing (wobbles); figures stand on each |
| `the-dip` | 6.5 | a THE DIP, b KEEP GOING | a walker goes down into a deep valley, slumps at the bottom, then climbs higher than it started |
| `roots-first` | 7 | a ROOTS FIRST, b THEN GROWTH | a figure tends a seed; roots spread underground for a long time, then the bamboo shoots up |
| `noise-vs-focus` | 6.5 | a NOISE, b FOCUS | a figure spins around inside a swarm of distractions; the other walks along a straight beam to the light |
| `consume-vs-create` | 6.5 | a CONSUME, b CREATE | content tiles stream into a seated figure's phone (it dims); the other places blocks that become a structure |
| `busy-vs-productive` | 6.5 | a BUSY, b PRODUCTIVE | one runs fast around a closed loop; the other walks slowly in a straight line and reaches the light |
| `small-habits-compound` | 6.5 | a SMALL HABITS, b BIG RESULTS | a figure pushes a tiny ball of light that grows huge as it rolls |
| `rest-dont-quit` | 6.5 | a REST, b DON'T QUIT | one walker sits on a bench, rests, then goes on and arrives; a faded figure turns back and disappears |

Label overrides must keep the meaning and fit the slot (labels auto-shrink to their width; prefer ≤ 14 characters).

### Adding a scene (when the library needs to grow)

Add `def('<id>', { title, dur, labels, slots, sfx, draw(ctx, lt, o), bg? })` in the scene section of `kit/quiet.js`:
- `draw` / `bg` are pure functions of the scene-local time `lt` (it runs past `dur` when the scene is last: keep a calm,
  moving answer state); `bg` paints atmosphere on the background layer (zone fills, water, underground).
- Use the helpers (`fig` + `POSE`, `ground`, `block`, `tower`, `stairs`, `orb`, `flame`, `rings`, `mountain`, `iceberg`,
  `road`, `poly`/`curve` paths, `scribble`, `sparks`, `smoke`, `dots`); keep art inside y 450–1120 and clear of the slots.
- Test it as the first AND the last scene of a spec (hook / closing / CTA bands), with `check_overlap --step 0.0333`,
  and look at the contact sheet. Then add it to the table above.

## 40 metaphor ideas (16 are built; the rest are candidates for new scenes)

Built: perfectionism vs consistency (towers) · motivation vs discipline (flare vs steady flame) · comfort zone → growth
zone (rings) · procrastinating / overthinking / doing (mountain) · expectation vs reality (lines) · the 1% rule
(staircase) · what people see vs what it took (podium + tunnel) · don't chase, build (orb) · confidence vs ego
(icebergs) · the dip · roots first (bamboo) · noise vs focus · consume vs create · busy vs productive · small habits
compound (growing ball of light) · rest, don't quit.

Candidates:
17. Starting vs waiting for the perfect moment (one waits at a start line for a light that never comes, one walks).
18. Two paths at a fork: easy now / hard later vs hard now / easy later (road splits, slopes swap).
19. Comparison: looking at someone else's lane makes you trip; eyes on your own lane.
20. Excuses vs reasons (a wall of blocks vs the same blocks laid as a bridge).
21. Planting today, shade years later (seed → tree, figure sits in its shade).
22. Talent vs effort (a fast starter stops; a steady walker passes).
23. One big push vs many small pushes (boulder rolls back vs a ramp of small steps).
24. Fear vs action (a huge shadow that shrinks to nothing when the figure steps toward it).
25. The habit loop (cue → routine → reward as three glowing nodes on a circle).
26. Breaking a habit chain (a chain of glowing links; one gap, then it continues).
27. Goals vs systems (a far star vs the road under your feet that keeps being laid).
28. Saying no (doors closing around one bright door left open).
29. Energy leaks (a vessel with many holes vs a sealed vessel filling with light).
30. Learning curve (a tangled line that straightens as you go).
31. Patience (an hourglass of light where the bottom becomes a staircase).
32. Showing up on bad days (rain on one figure, it still places one block).
33. Identity: "I do it" vs "I am it" (a costume vs a glowing core).
34. Distraction tax (each notification pebble adds weight to a backpack).
35. Small daily wins (a jar filling with glowing pebbles).
36. Letting go of the past (a figure drops a heavy chain and floats up a step).
37. Momentum (a heavy wheel that is slow to turn, then spins easily).
38. Focus beam vs scattered light (a magnifier gathers light into one burning point).
39. The plateau (a flat line that, zoomed out, is a step on a rising staircase).
40. Building in silence (a figure builds inside a dark room; the door opens on a finished tower).

## Files

- `kit/quiet.js` — engine (background, bloom, dust, cross-fading scene director), figure + poses, props, text helpers,
  the scene library, `timeline()` and `assemble()`. Documented in `kit/README.md` → "Quiet kit".
- `make_quiet.mjs` — the assembler (spec → project folder: `index.html`, `sound.json`, `kit` link).
- `quiet_queue.json` — 30 ready specs (unique scene combinations, hook + closing).
- `kit/sound/music.py` mood `calm`; `kit/sound/sfxgen.py` calm SFX (`air`, `soft_tap`, `soft_chime`, `shimmer`,
  `swell`, `flare`, `fizz`).
