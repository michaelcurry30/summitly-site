# Storyboard — stick-pay-first ("PAY YOURSELF FIRST")
`kit/stick.js` + `kit/sound/`. Planner version (`variant.js`: APP_VERSION 0, PLANNER 1) → `out/stick-pay-first-sound.mp4` → `media/stick-pay-first.mp4`.
Scene times live in `SCENES` / `T` in index.html, fitted to the measured VO (`python3 kit/sound/mix.py measure stick-pay-first`); captions = VO lines.
Story: Payday money flies away (coffee, takeout, cart) → plans to save what's left → nothing left (moth) → 'I'll save next month' → months fly → WORD CUT on NEXT MONTH → flip it: coin into the jar first → payday: sweep some into savings → spend what's left guilt free → lesson 'Save first. Spend what's left.'
End card: `S.endCardPlanner(stage)` at EC0 (VO "Grab the free habit tracker. Link in bio.", `sting` at EC0+.45).
Checks: `node kit/check_overlap.mjs stick-pay-first --step 0.0333` OK; mix QC -14.5 LUFS, TP ≤ -1 dBFS.

## Facts / numbers ledger
| on screen | source | note |
|---|---|---|
| pay yourself first | common personal-finance principle (e.g. Clason, The Richest Man in Babylon, 1926) | no numbers, no returns promised |
