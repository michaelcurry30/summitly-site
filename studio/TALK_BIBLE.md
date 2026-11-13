# TALK BIBLE — the ninja and his friend talking (dialogue videos)

A dialogue format for the existing character: the **cyan-headband black Stick Ninja is the only ninja**. He talks with
regular (non-ninja) stick people in a short, funny, relatable conversation that teaches one useful thing.
Reference build: `talk-example/` (39.6 s, "my phone ate my whole day").
Format rules not listed here come from `STICK_BIBLE.md` and `kit/README.md` (1080x1920, 30 fps, frame-pure page,
`check_overlap` OK at `--step 0.0333`, mix.py QC).

## Never sound like an ad
- The products appear **inside the story**, the way anyone shows a friend their phone. Nobody names, praises or sells them.
- VO never says: the app name, "download", "free", "link in bio", prices, "Pro", features lists. At most a casual
  "I just start a 25-minute timer" while we SEE the real Summitly focus screen in his hands.
- No paywall, no prices, no store screens, no logo end card. The app header (SUMMITLY logo) is cropped out of the shot.
- Optional: one tiny, dim lowercase line at the very end (`free habit tracker in bio`, PM 34 px, ~1 s). Nothing bigger.
- The planner appears as a drawn printable page (HABIT TRACKER, M–S grid, checks drawn by a pen hand) on a desk.

## Characters (one rig, `kit/stick.js`)
| who (sound.json) | look | role | voice |
|---|---|---|---|
| `KAI` (never named on screen) | the Stick Ninja as-is: black, cyan headband (default palette). The ONLY ninja. | calm friend who figured it out; asks, gives the tips, does them | `am_michael`, speed 0.98 |
| `FRIEND` (never named) | a regular stick guy: orange hoodie, blue cap, jeans, skin face, no mask/headband/katana | the one who struggles, makes the jokes | `am_puck`, speed 1.02 |

- Regular people = `S.ninja.pose(t, {pal: P})` with `P = Object.assign({}, S.ninja.PAL, {civ: 1, ink: hoodie, ink2, rim, skin, cap, leg, leg2, mouth})`
  (`civ` turns off headband, tails, katana and belt, thickens the torso into a hoodie and draws a face + cap — see `civFace`
  in kit/stick.js). Give each extra person a different hoodie/cap colour; a third person may pop in for one line.
- **Talking**: `pose(t, {talk: 0..1})` opens the mouth (mask fold on the ninja, a real mouth on regular people). The page
  reads the VO envelope from `timing.json` (`talk(who, t)`) and adds a small head bob — only the speaker's mouth moves.
- Kokoro voice grades: am_michael / am_fenrir / am_puck are the best male voices (C+); am_eric / am_liam are weaker (D);
  `am_adam` is banned by the kit (F+). Never clone a real voice.

## Natural dialogue rules
- Write it like two friends actually talk: contractions, casual words, small fillers where they'd really be said
  ("like", "wait", "honestly", "uh", "bro", "man"), short back-and-forth, reactions instead of announcements.
- Nobody reads a card: no "Tip one:" labels in the VO, no slogans. The tip is an answer to a real question
  ("Real question. Where does your phone sleep?" → "Uh… next to my face?" → "Yeah, that's the problem.").
- One interruption per video: the cut-off line ends in "—" and the next line starts after only ~0.04 s.
- Pauses: 0.25–0.5 s between turns, 0.04 s on interruptions, 0.6 s before a scene change. Split any line over ~2.5 s
  into two TTS chunks with ~0.25 s between. Shape intonation with commas, "…" and "?".
- Speed 0.95–1.05. Check phonemes with `mix.kokoro().tokenizer.phonemize(text, 'en-us')`; fix in `kit/sound/lexicon.json`
  (current fixes: "two A M", "Nooo").
- Captions are sentence case (Hanken Grotesk 600, class `talkcap`), one highlighted word: orange `.or` when the friend
  speaks, cyan `.cy` when the ninja speaks.

## Script shape (30–40 s, ~14 short lines, ≤ 2.5 words/s of screen time)
1. Hook from the friend at 0 s, a confession ("Okay, my phone literally ate my whole day."). Frame 0 = the ninja + the friend + full hook caption.
2. The friend explains (joke), the ninja asks a short question, the friend answers with a second joke.
3. Three tips told as answers, each something we **see them physically do** (carry the phone to the hallway,
   the 25-min timer in POV hands, pen ticks on the paper tracker, push-ups).
4. Payoff joke from the friend ("Day five… my phone thinks I moved out.").
5. The ninja asks the viewer ("Your turn. What app eats your day?"). No "follow", no CTA in VO.
- Facts simple and true; no stats, no medical claims.

## Pipeline (from `studio/`)
```bash
export KOKORO_MODEL="$PWD/tts/kokoro.onnx" KOKORO_VOICES="$PWD/tts/voices.bin"
mkdir my-talk && ln -s ../kit my-talk/kit          # copy talk-example/{index.html,timing.py,sound.json} as the start
python3 kit/sound/mix.py measure my-talk           # durations; then set each vo "t" (gaps .25–.9 s)
python3 talk-example/timing.py my-talk             # -> my-talk/timing.json (word onsets + 30 fps mouth envelope)
node talk-example/snap.mjs my-talk out.jpg 0 3 7.5 # quick stills while building
node kit/check_overlap.mjs my-talk --step 0.0333   # must print OK
node render.mjs my-talk && python3 kit/sound/mix.py my-talk
```
- Mispronounced words → `kit/sound/lexicon.json` (wrong phonemes → right). Added: "two A M", "Nooo".
- Captions: `CAPDEF = [[vo line, html, spoken-word index per shown word]]`; each word pops on its spoken onset.
  Sentence case at the top (y 270), ≤ 8 words, **one** highlighted word per caption. A caption block leaves .3 s before the next and .45 s before any vertical whip.
- A static `data-bg` shade behind the caption band keeps the set calm under the words.

## Scene list (talk-example) — at least one cut every 1–3 s
| t | set | what we see / hear |
|---|---|---|
| 0–2.45 | bedroom, night | two-shot: the friend on the stool scrolling, the ninja hands on hips — "Okay, my phone literally ate my whole day." (thumbnail) |
| 2.45–5.4 | bedroom close | friend close-up, clock spins 6 → 2, alarm shake — "I opened it for one second… now it's two AM." |
| 5.4–9.45 | bedroom floor | the ninja points at the dusty dumbbell with eyes — "Wait. Didn't you have a workout today?" / "Yeah… it's still waiting for me." |
| 9.45–15.3 | bed | friend in bed, phone buzzing on the pillow, cut-in on "Uh… next to my face?", facepalm, "Yeah, that's the problem." |
| 15.3–20.65 | hallway | the ninja plugs the phone in on the hall table — "Tonight, it sleeps in the hallway." / "Wait, the hall—" / "The hallway." / "Man… that's cold." |
| 20.65–26.35 | POV desk | ninja hands hold the phone with the REAL focus screen (25:00), tap, flip it face-down |
| 26.35–28.6 | library | friend works, timer ring, phone face-down — "Twenty-five? Honestly… I can do that." |
| 28.6–31.55 | desk top | printable HABIT TRACKER, pen hand draws checks — "Then you check it off on paper. Every day." |
| 31.55–33.95 | dawn | friend push-ups, the ninja cheers — "Bro, I did push-ups. Like, on purpose." |
| 33.95–36.3 | hallway | lonely phone with a sad face, 5 checks on the wall — "Day five… my phone thinks I moved out." |
| 36.3–39.6 | dark glow | both face camera — "Your turn. What app eats your day?" + tiny end line |

## Phone / hands rules
- Real screens only (`/home/claude/app/shots/before-10-focus.png`, `before-12-habits.png`, `before-11-tasks.png`), shown
  in a DOM phone tagged `data-words` with a `.sc` screen; crop away the header logo, toasts and anything Pro.
- Hands: palms + arms on a canvas **under** the phone, fingers/thumb on a canvas **over** it, clipped so they only touch
  the bezel — nothing ever covers the screenshot (check_overlap `SHOT`). Tap = thumb lift + phone dip + pulse ring.
- Don't copy any other brand's character, name or UI.

## Sound
`chill` bed at -15 dB under the dialogue (auto-ducked), whoosh on every cut, `ui_tap` on the tap, `pop` per check,
`notif_ding` for buzzes, `chime_up` on wins. SFX ≤ -11 dB while someone talks. QC: -15…-13 LUFS, TP ≤ -1.
