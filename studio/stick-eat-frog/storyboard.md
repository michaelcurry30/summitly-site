# Storyboard — stick-eat-frog ("EAT THE FROG")
`kit/stick.js` + `kit/sound/`. Planner version (`variant.js`: APP_VERSION 0, PLANNER 1) → `out/stick-eat-frog-sound.mp4` → `media/stick-eat-frog.mp4`.
Scene times live in `SCENES` / `T` in index.html, fitted to the measured VO (`python3 kit/sound/mix.py measure stick-eat-frog`); captions = VO lines.
Story: Giant ESSAY frog lands on the desk → dodges it all day (emails, notes, snacks) → frog just sits there → 'I'll do it tonight' → exhausted at night → WORD CUT on TONIGHT → morning: grabs the frog and throws it out (check) → energy full → rest of the day feels easy → lesson 'Hardest thing first. Every morning.'
End card: `S.endCardPlanner(stage)` at EC0 (VO "Grab the free habit tracker. Link in bio.", `sting` at EC0+.45).
Checks: `node kit/check_overlap.mjs stick-eat-frog --step 0.0333` OK; mix QC -14.5 LUFS, TP ≤ -1 dBFS.

## Facts / numbers ledger
| on screen | source | note |
|---|---|---|
| eat the frog | Brian Tracy, Eat That Frog! (2001): do the most important/hardest task first | technique, no numbers |
