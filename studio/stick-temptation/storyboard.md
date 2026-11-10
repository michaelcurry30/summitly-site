# Storyboard — stick-temptation ("TEMPTATION BUNDLING")
`kit/stick.js` + `kit/sound/`. Planner version (`variant.js`: APP_VERSION 0, PLANNER 1) → `out/stick-temptation-sound.mp4` → `media/stick-temptation.mp4`.
Scene times live in `SCENES` / `T` in index.html, fitted to the measured VO (`python3 kit/sound/mix.py measure stick-temptation`); captions = VO lines.
Story: Gym bag waits, couch wins → 'I'm too tired' → never skip the favorite show → WORD CUT on TOO TIRED → only watch the show while working out / only play the podcast on the run → now he wants to go → 'researchers call it temptation bundling' → lesson 'Pair what you need with what you love.'
End card: `S.endCardPlanner(stage)` at EC0 (VO "Grab the free habit tracker. Link in bio.", `sting` at EC0+.45).
Checks: `node kit/check_overlap.mjs stick-temptation --step 0.0333` OK; mix QC -14.5 LUFS, TP ≤ -1 dBFS.

## Facts / numbers ledger
| on screen | source | note |
|---|---|---|
| "temptation bundling" | Milkman, Minson & Volpp (2014), "Holding the Hunger Games hostage at the gym", Management Science 60(2) | term + idea only, no numbers |
