# Summitly Studio — stick-ninja video pipeline

Everything a fresh Claude session needs to make new STICK NINJA videos and queue them in Metricool.

## One-time setup in a fresh container (run from this `studio/` folder)
```bash
pip install --break-system-packages kokoro-onnx==0.6.1 scipy numpy soundfile
mkdir -p node_modules && ln -sfn "$(npm root -g)/playwright" node_modules/playwright && ln -sfn "$(npm root -g)/playwright-core" node_modules/playwright-core
export KOKORO_MODEL="$PWD/tts/kokoro.onnx" KOKORO_VOICES="$PWD/tts/voices.bin"
which ffmpeg && node -e "import('playwright').then(()=>console.log('pw ok'))"
```
Fonts are in `kit/fonts`, SFX in `kit/sound/sfx`, the TTS model in `tts/`.

## Rules
- `STICK_BIBLE.md` = the series rules (look, ENERGY RULES, WORD CUT, endings, APP VERSION section). Follow it exactly.
- `skill/SKILL.md` = the motion-video skill (brief → storyboard → frame-pure index.html → render → verify).
- `kit/README.md` = the stick kit API (`kit/stick.js`), overlap checker, end cards. `kit/sound/README.md` = sound (mix.py, pronunciation lexicon).
- `examples/` = 7 finished, approved videos (brief, storyboard, sound.json, index.html). Match their quality.

## Make a video (project folder `studio/<name>/` with `ln -s ../kit kit`)
1. brief.md, storyboard.md (≥ 20 distinct changes, 3+ locations, VO lines, facts ledger), sound.json
2. `python3 kit/sound/mix.py measure <name>` → fit timings to the real VO
3. index.html → `node render.mjs <name> --scale 0.5` → review sheet → fix
4. `node kit/check_overlap.mjs <name> --step 0.0333` must print OK
5. `node render.mjs <name>` → `python3 kit/sound/mix.py <name>` (≈ -14 LUFS, true peak ≤ -1 dBFS)
6. App version per the bible's APP VERSION section (see examples' variant.js / kit/sound/app_version.py)

## Publish
Copy finished MP4s to `../media/<name>.mp4` (and `<name>-app.mp4`), commit and push to `main`. Public URL:
`https://raw.githubusercontent.com/michaelcurry30/summitly-site/main/media/<name>.mp4` — give that URL to Metricool.

## Planner end card
`S.endCardPlanner(stage)` (kit/stick.js EXTENSIONS 4): FREE HABIT TRACKER / LINK IN BIO, 3.0 s, VO "Grab the free habit tracker. Link in bio." Used by the planner-channel videos (stick-phone-morning, stick-temptation, stick-pay-first, stick-eat-frog, stick-twenty-second).

## Topics already made (don't repeat)
dopamine ("one more video"), 2-minute rule, motivation is a liar, phone in another room, why you procrastinate, don't break the chain, habit stacking, phone-free mornings, temptation bundling (workouts), pay yourself first (money), eat the frog, the 20-second rule, single-tasking (stick-single-task, end card a), done beats perfect (stick-done-perfect, end card b),
no zero days (stick-no-zero, end card c), deep work / go deep not long (stick-deep-work, end card d),
can't focus after scrolling / boredom builds focus (stick-scroll-focus, end card e), the Sunday reset (stick-sunday-reset, end card a),
never miss twice (workouts, stick-never-miss-twice, end card b), track every dollar (money, stick-track-money, end card c).
2026-11-16 run (gen_short2.py / mk_short.py / finish_short.sh: 15–16 s, NO planner card, ends on lesson + FOLLOW FOR MORE): the 5-second rule (stick-five-second), identity-based habits (stick-identity), the 1% rule (stick-one-percent), sleep and focus (stick-sleep-focus), the 3-task day (stick-three-tasks), morning light walk (stick-morning-light), quick hits vs real focus / dopamine swaps (stick-quick-hits), 25-minute focus sprints (stick-focus-sprint), active recall / test yourself (stick-active-recall), subscription check (stick-subscriptions), add one rep / progressive overload (stick-one-more-rep), keep small promises / discipline (stick-small-promises), notifications off (stick-notifs-off), the done list (stick-done-list), short deadlines / Parkinson's law (stick-deadline). (stick-if-then built but failed audio QC: true peak ~0 dBFS — not published.)
New short: write `<name>/spec.py` (P with vo[5], heads[6], cut, envs, keys, js — see these examples) then `./finish_short.sh <name>`.
End-card rotation (a–e, see scheduled task): last used = c → next video uses d.
Short template generator: `python3 gen_short.py <name>` builds index.html + sound.json from `<name>/spec.py` (5 scenes: hook / problem / roof WORD CUT / fix / payoff + endCardPlanner a–e) after the VO lines are in sound.json.

## 4-panel topics made (channel "animatedstickhabit" — don't repeat)
4 ways to stop scrolling (phone), 4 students the night before the exam (study), 4 ways to build a habit (habit),
4 ways to beat procrastination (stick-4procrast), 4 ways to wake up early (stick-4wake), 4 ways to save money (stick-4save), 4 ways to read more books (stick-4read), 4 ways to drink more water (stick-4water), 4 ways to handle a bad day (stick-4badday),
4 ways to start the gym (stick-4gym, CTA 1), 4 ways to stop overthinking (stick-4overthink, CTA 2),
4 ways to clean your room (stick-4room, CTA 3), 4 ways to stop impulse buying (stick-4impulse, CTA 4),
4 ways to start journaling (stick-4journal, CTA 1), 4 ways to start a side hustle (stick-4hustle, CTA 2).
2026-11-15 run (pill "FOLLOW FOR MORE", no planner talk in videos): 4 ways to start your morning (stick-4morning), 4 ways to focus while studying (stick-4focus),
4 ways to go to bed on time (stick-4bedtime), 4 ways to quit sugar (stick-4sugar), 4 ways to get back on track (stick-4backontrack), 4 ways to meal prep (stick-4mealprep),
4 ways to plan your week (stick-4week), 4 ways to stick to a budget (stick-4budget), 4 ways to do homework (stick-4homework), 4 ways to start running (stick-4run),
4 ways to walk more (stick-4walk), 4 ways to learn a new skill (stick-4skill), 4 ways to stay motivated (stick-4motivation), 4 ways to stop being late (stick-4late),
4 ways to handle a to-do list (stick-4todo), 4 ways to stop ordering takeout (stick-4takeout).
Label tip: in two-line labels make line 2 the longer line, or the ✗/✓ badge covers line 1 and check_overlap fails.

CTA rotation (RETIRED 2026-11-14 — the pill now says "FOLLOW FOR MORE"; was one per video): 1 "📒 START TONIGHT · FREE TRACKER IN BIO", 2 "📒 DON'T WATCH IT. TRACK IT. · LINK IN BIO",
3 "📒 DAY ONE STARTS NOW · LINK IN BIO", 4 "📒 SMALL STEPS ADD UP · FREE TRACKER IN BIO". Videos before stick-4gym used the default pill.

## Habit Dojo (channel 4: animated tip lists, no VO)
Rules, spec format, CTA rotation and caption template: `DOJO_BIBLE.md`. Renderer `kit/dojo.js` (vector ninja head from
`brand4/`, sunset dojo sky, list builds up item by item), assembler `make_dojo.mjs`, 40 ready specs in `dojo_queue.json`,
used entries in `DOJO_DONE.txt`. One video = 4 commands from `studio/`:
```bash
node make_dojo.mjs <name> --queue N ; node render.mjs <name> ; node kit/check_overlap.mjs <name> --step 0.1 ; python3 kit/sound/mix.py <name>
```
→ `out/<name>-sound.mp4` (18–24 s, loops). check_overlap zone `dojo`: text x 100–980, y 220–1500, not x > 860 & y > 1150.
Made: dojo-01 (morning, q01), dojo-02 (focus, q02), dojo-03 (scrolling, q03). Next queue index: 3.
