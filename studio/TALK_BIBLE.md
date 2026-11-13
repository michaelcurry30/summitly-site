# TALK BIBLE — two ninjas talking (dialogue videos)

A new format for the existing stick-ninja characters: the two ninjas have a short, funny, relatable **conversation**
that teaches one useful thing. Reference build: `talk-example/` (34.6 s, "my phone ate my whole day").
Format rules not listed here come from `STICK_BIBLE.md` and `kit/README.md` (1080x1920, 30 fps, frame-pure page,
`check_overlap` OK at `--step 0.0333`, mix.py QC).

## Never sound like an ad
- The products appear **inside the story**, the way anyone shows a friend their phone. Nobody names, praises or sells them.
- VO never says: the app name, "download", "free", "link in bio", prices, "Pro", features lists. At most a casual
  "I just start a 25-minute timer" while we SEE the real Summitly focus screen in his hands.
- No paywall, no prices, no store screens, no logo end card. The app header (SUMMITLY logo) is cropped out of the shot.
- Optional: one tiny, dim lowercase line at the very end (`free habit tracker in bio`, PM 34 px, ~1 s). Nothing bigger.
- The planner appears as a drawn printable page (HABIT TRACKER, M–S grid, checks drawn by a pen hand) on a desk.

## Characters (same rig, `kit/stick.js`, two palettes)
| who (sound.json) | look | role | voice |
|---|---|---|---|
| `KAI` (never named on screen) | the classic Stick Ninja: black, cyan headband (default palette) | calm friend who has figured it out, asks a question, gives the tips, does them | `am_michael`, speed 1.0 |
| `GOLD` (never named on screen) | same rig recoloured: deep red body/mask `#8e1b2f`, gold headband/rim `#ffd34d` | the friend who struggles, makes the jokes | `am_puck`, speed 1.0 |

- Recolour = `S.ninja.pose(t, {pal: GOLD})` where `GOLD = Object.assign({}, S.ninja.PAL, {...})` (see `talk-example/index.html`).
  `pal` keys: `ink ink2 rim tail belt scab band band2 mouth mouthIn`. Default palette is unchanged.
- **Talking**: `pose(t, {talk: 0..1})` opens a mouth shape on the mask. The page reads the real VO envelope
  from `timing.json` (`talk(who, t)`) and adds a small head bob — only the speaker moves his mouth, the other reacts
  (pose / face change) on the punchline.
- `am_adam` is banned by the kit; never clone a real voice.

## Script shape (30–40 s, ~14 short lines, ≤ 2.5 words/s of screen time)
1. Hook from GOLD at 0 s, a confession with a joke ("Bro… my phone ate my whole day."). Frame 0 = both ninjas + full hook caption.
2. GOLD explains (joke), KAI asks one short question, GOLD answers with a second joke.
3. KAI: "Tip one / Two / Three" — each tip is something we **see them physically do** (carry the phone to another room,
   the 25-min timer in POV hands, pen ticks on the paper tracker, push-ups).
4. Payoff joke from GOLD ("Day five… my phone thinks I moved out.").
5. KAI asks the viewer a question ("So… what app eats YOUR day?"). No "follow", no CTA in VO.
- Facts simple and true; no stats, no medical claims.

## Pipeline (from `studio/`)
```bash
export KOKORO_MODEL="$PWD/tts/kokoro.onnx" KOKORO_VOICES="$PWD/tts/voices.bin"
mkdir my-talk && ln -s ../kit my-talk/kit          # copy talk-example/{index.html,timing.py,script.json} as the start
python3 kit/sound/mix.py measure my-talk           # durations; then set each vo "t" (gaps .25–.9 s)
python3 talk-example/timing.py my-talk             # -> my-talk/timing.json (word onsets + 30 fps mouth envelope)
node talk-example/snap.mjs my-talk out.jpg 0 3 7.5 # quick stills while building
node kit/check_overlap.mjs my-talk --step 0.0333   # must print OK
node render.mjs my-talk && python3 kit/sound/mix.py my-talk
```
- Mispronounced words → `kit/sound/lexicon.json` (wrong phonemes → right). Added: "two A M", "Nooo".
- Captions: `CAPDEF = [[vo line, html, spoken-word index per shown word]]`; each word pops on its spoken onset.
  Big Shoulders at the top (y 262), ≤ 8 words, **one** highlighted word per caption: gold `.gd` when GOLD speaks,
  cyan `.cy` when KAI speaks. A caption block leaves .3 s before the next and .45 s before any vertical whip.
- A static `data-bg` shade behind the caption band keeps the set calm under the words.

## Scene list (talk-example) — at least one cut every 1–3 s
| t | set | what we see |
|---|---|---|
| 0–2.0 | bedroom, night | two-shot: GOLD on the stool scrolling (glow), KAI hands on hips (thumbnail) |
| 2.0–4.9 | bedroom close | GOLD close-up, wall clock spins 6 → 2, alarm shake on "2 AM" |
| 4.9–8.05 | bedroom floor | KAI points at the dusty dumbbell — it has eyes and watches GOLD; GOLD shrugs |
| 8.05–11.7 | bed | GOLD lying in bed, phone buzzing on the pillow by his face; KAI facepalms |
| 11.7–16.05 | hallway | tip 1: KAI carries the phone to the hall table and plugs it in; GOLD runs in "my baby!" |
| 16.05–20.65 | POV desk | tip 2: big ninja hands hold the phone with the REAL focus screen (25:00), tap, flip it face-down |
| 20.65–23.1 | library | GOLD works at the laptop, focus timer ring, phone face-down on the desk |
| 23.1–26.2 | desk top | tip 3: printable HABIT TRACKER page, pen hand draws checks on the beats |
| 26.2–28.6 | dawn | GOLD does push-ups, pops up "on purpose", KAI cheers |
| 28.6–31.15 | hallway | lonely phone with a sad face + cobweb, 5 green checks on the wall, GOLD waves |
| 31.15–end | dark glow | both face camera, the viewer question, tiny end line |

## Phone / hands rules
- Real screens only (`/home/claude/app/shots/before-10-focus.png`, `before-12-habits.png`, `before-11-tasks.png`), shown
  in a DOM phone tagged `data-words` with a `.sc` screen; crop away the header logo, toasts and anything Pro.
- Hands: palms + arms on a canvas **under** the phone, fingers/thumb on a canvas **over** it, clipped so they only touch
  the bezel — nothing ever covers the screenshot (check_overlap `SHOT`). Tap = thumb lift + phone dip + pulse ring.
- Don't copy any other brand's character, name or UI.

## Sound
`chill` bed at -15 dB under the dialogue (auto-ducked), whoosh on every cut, `ui_tap` on the tap, `pop` per check,
`notif_ding` for buzzes, `chime_up` on wins. SFX ≤ -11 dB while someone talks. QC: -15…-13 LUFS, TP ≤ -1.
