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
no zero days (stick-no-zero, end card c), deep work / go deep not long (stick-deep-work, end card d).
End-card rotation (a–e, see scheduled task): last used = d → next video uses e.
Short template generator: `python3 gen_short.py <name>` builds index.html + sound.json from `<name>/spec.py` (5 scenes: hook / problem / roof WORD CUT / fix / payoff + endCardPlanner a–e) after the VO lines are in sound.json.

## 4-panel topics made (channel "animatedstickhabit" — don't repeat)
4 ways to stop scrolling (phone), 4 students the night before the exam (study), 4 ways to build a habit (habit),
4 ways to beat procrastination (stick-4procrast), 4 ways to wake up early (stick-4wake), 4 ways to save money (stick-4save), 4 ways to read more books (stick-4read), 4 ways to drink more water (stick-4water), 4 ways to handle a bad day (stick-4badday),
4 ways to start the gym (stick-4gym, CTA 1), 4 ways to stop overthinking (stick-4overthink, CTA 2),
4 ways to clean your room (stick-4room, CTA 3), 4 ways to stop impulse buying (stick-4impulse, CTA 4),
4 ways to start journaling (stick-4journal, CTA 1), 4 ways to start a side hustle (stick-4hustle, CTA 2). Next video uses CTA 3.

CTA rotation (one per video, in order, continue across runs): 1 "📒 START TONIGHT · FREE TRACKER IN BIO", 2 "📒 DON'T WATCH IT. TRACK IT. · LINK IN BIO",
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
