# Storyboard — stick-twenty-second ("THE 20-SECOND RULE")
`kit/stick.js` + `kit/sound/`. Planner version (`variant.js`: APP_VERSION 0, PLANNER 1) → `out/stick-twenty-second-sound.mp4` → `media/stick-twenty-second.mp4`.
Scene times live in `SCENES` / `T` in index.html, fitted to the measured VO (`python3 kit/sound/mix.py measure stick-twenty-second`); captions = VO lines.
Story: Book slides 20 seconds closer → book up on a shelf vs phone in hand → phone wins → 'too much effort' → tiny friction bumps trip him → WORD CUT on EFFORT → book onto the pillow (good habit easier), phone into a box (bad habit harder) → reads at night → good choice is now the easy one → lesson 'Make it easy to start.'
End card: `S.endCardPlanner(stage)` at EC0 (VO "Grab the free habit tracker. Link in bio.", `sting` at EC0+.45).
Checks: `node kit/check_overlap.mjs stick-twenty-second --step 0.0333` OK; mix QC -14.5 LUFS, TP ≤ -1 dBFS.

## Facts / numbers ledger
| on screen | source | note |
|---|---|---|
| 20 SECONDS / 0:20 | Shawn Achor, The Happiness Advantage (2010), the "20-second rule" (lower activation energy for good habits, raise it for bad ones) | named rule, no statistic |
