# Storyboard — stick-phone-morning ("PHONE-FREE MORNINGS")
`kit/stick.js` + `kit/sound/`. Planner version (`variant.js`: APP_VERSION 0, PLANNER 1) → `out/stick-phone-morning-sound.mp4` → `media/stick-phone-morning.mp4`.
Scene times live in `SCENES` / `T` in index.html, fitted to the measured VO (`python3 kit/sound/mix.py measure stick-phone-morning`); captions = VO lines.
Story: Phone grabbed first thing → emails/news/notifications → morning belongs to everyone else (Scroll Goblin rope) → 'just a quick check' → 30 minutes later → WORD CUT on QUICK CHECK → phone in a box, 30-minute timer → water / stretch / plan → lesson 'Win the morning first. The phone can wait.'
End card: `S.endCardPlanner(stage)` at EC0 (VO "Grab the free habit tracker. Link in bio.", `sting` at EC0+.45).
Checks: `node kit/check_overlap.mjs stick-phone-morning --step 0.0333` OK; mix QC -14.5 LUFS, TP ≤ -1 dBFS.

## Facts / numbers ledger
| on screen | source | note |
|---|---|---|
| 30 MINUTES / 30:00 | a suggested routine length (the lesson), not a statistic | no claim attached |
