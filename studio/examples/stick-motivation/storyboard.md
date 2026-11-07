# Storyboard — stick-motivation ("MOTIVATION IS A LIAR")
Built on `kit/stick.js` (Stick Ninja kit + the appended extensions: `cloud`, `wallClock`, poses `chin`, `reachUp`) and `kit/sound/`.
`kit` is a symlink to `../kit`. 28.5 s, 1080×1920, 30 fps.

## Source log
No source media. Every visual is drawn by `kit/stick.js`. Fonts from `kit/fonts`. No app, no brand, no logo, no store line.

## VO (Kokoro; measured with `python3 kit/sound/mix.py measure stick-motivation`)
Narrator `af_heart` 1.08 (line 9 at 0.98); NINJA = `blend:am_michael:0.6,am_puck:0.4` 1.0. 51 words / 28.5 s = 1.8 words/s.
Pronunciation checked with `kokoro().tokenizer.phonemize` (motivated, liar, excuse): all correct, no lexicon entry needed.

| # | start | dur | end | line | on screen |
|---|---|---|---|---|---|
| 0 | 0.15 | 1.63 | 1.78 | Still waiting to feel motivated? | STILL WAITING TO / FEEL MOTIVATED? (frame 0) |
| 1 | 2.30 | 1.37 | 3.67 | Motivation is a liar. ("liar" ≈ 3.07) | MOTIVATION / IS A LIAR. |
| 2 | 4.40 | 1.73 | 6.13 | It shows up... then floats away. | IT SHOWS UP… / THEN FLOATS AWAY. |
| 3 | 7.00 | 1.72 | 8.72 | So he waits... for the perfect mood. | SO HE WAITS… / FOR THE PERFECT MOOD. |
| 4 | 9.60 | 1.79 | 11.39 | His excuse? When I feel like it. | HIS EXCUSE? + prop WHEN I FEEL LIKE IT |
| 5 | 12.20 | 0.91 | 13.11 | (NINJA) No more waiting. | NO MORE / WAITING. |
| 6 | 14.60 | 1.31 | 15.91 | Start before you feel ready. | START BEFORE / YOU FEEL READY. |
| 7 | 17.00 | 1.18 | 18.18 | Action comes first... | ACTION / COMES FIRST… |
| 8 | 19.00 | 1.52 | 20.52 | then motivation catches up. | THEN MOTIVATION / CATCHES UP. |
| 9 | 22.80 | 2.37 | 25.17 | Action first. Motivation follows. | ACTION FIRST. / MOTIVATION FOLLOWS. |
| 10 | 26.00 | 0.90 | 26.90 | Follow for more. | chip FOLLOW FOR MORE |

## Shot list (28.5 s; 4 locations: city rooftop, library, bedroom at night, mountain dawn)
44 distinct visual changes; nothing holds > 1.3 s except the deliberate crouch pause before the cut (12.85–13.13).

| # | t (s) | location / shot | change | text |
|---|---|---|---|---|
| 1 | 0.00 | ROOFTOP, medium, slow push | Ninja mid-jump grabbing for the smug sparkly MOTIVATION CLOUD; thumbnail frame | STILL WAITING TO / FEEL MOTIVATED? |
| 2 | 0.25 | same | the cloud dodges right, out of reach | |
| 3 | 0.55 | same | lands with squash | |
| 4 | 0.97 | same | crouch, second jump | |
| 5 | 1.30 | same | the cloud zips right again, winks | |
| 6 | 1.75 | same | lands, slumps | |
| 7 | 2.20 | ROOFTOP, tilted low-angle close-up on the cloud | cut; ninja points at it | MOTIVATION |
| 8 | 3.07 | same | "liar": sparkles fizzle grey, wink, camera punch + shake, grey sparks | IS A LIAR. |
| 9 | 3.40 | same | the cloud zips off-screen | |
| 10 | 3.50 | same | facepalm | |
| 11 | 4.30 | LIBRARY, reading table | whip; reading on the stool | |
| 12 | 4.41 | same | the cloud drifts in from the right | IT SHOWS UP… |
| 13 | 4.75 | same | he sits up, shocked-happy | |
| 14 | 5.03 | same | he stands and reaches up for it | THEN FLOATS AWAY. |
| 15 | 5.25 | same | the cloud floats away, fades | |
| 16 | 5.85 | same | slump | |
| 17 | 6.90 | BEDROOM at night, wide | whip up; ninja on the stool, chin on hand; wall clock | SO HE WAITS… |
| 18 | 7.55 | same | clock hands spin faster and faster, lamp flickers (time passing) | |
| 19 | 7.90 | BEDROOM, face close-up | cut | FOR THE PERFECT MOOD. |
| 20 | 8.37 | same | eyes close, head droops | |
| 21 | 8.60 | same | z z z | |
| 22 | 9.40 | BEDROOM, close on ninja | cut | HIS EXCUSE? |
| 23 | 9.55 | same | camera pulls out to reveal the room | |
| 24 | 10.04 | same | the word WHEN I FEEL LIKE IT flies in, wobbling | (prop) |
| 25 | 10.05 | same | ninja startled | |
| 26 | 10.55 | same | leans back, comfy (the excuse feels nice) | |
| 27 | 11.45 | same | stands up | |
| 28 | 11.85 | same | glances at the camera | |
| 29 | 12.20 | same | points at the word | NO MORE / WAITING. |
| 30 | 12.85 | same | crouch; DELIBERATE PAUSE, music stops, slow push | |
| 31 | 13.13 | same | slash: draw + leap | |
| 32 | 13.45 | same | THE WORD CUT: smear arc, 2-frame flash, 8 px shake, zoom punch, split along the slash line, sparks + shards | |
| 33 | 13.5–14.4 | same | clean-cut beat, halves slide apart, fall and bounce on the floor; ninja lands, ready stance | |
| 34 | 14.50 | LIBRARY, table + laptop | whip up; walks in reluctantly | START BEFORE |
| 35 | 15.05 | same | flops onto the stool | YOU FEEL READY. |
| 36 | 15.30 | same | MOTIVATION meter rises in (almost empty) | |
| 37 | 15.50 | same | starts typing, worried face; first lines appear | |
| 38 | 16.90 | LIBRARY, close-up | cut; focused face, fast typing, focus rings, lines fill; meter creeping up | ACTION |
| 39 | 17.75 | same | check mark + meter jump + camera tap | COMES |
| 40 | 18.11 | same | second check + meter jump | FIRST… |
| 41 | 18.90 | MOUNTAIN dawn | whip; he practises a kata slash | THEN MOTIVATION |
| 42 | 19.60 | same | the cloud flies in from the right, happy, chasing him | |
| 43 | 20.46 | same | it catches up: golden sparkle rain, flash, meter fills (red-hot) | CATCHES UP. |
| 44 | 20.55–21.0 | same | he looks up, cheers | |
| 45 | 21.60 | same | camera rises / pulls out, sun rises | |
| 46 | 22.60 | ROOFTOP (callback to the hook) | whip up; he walks, the cloud follows him like a pet | ACTION FIRST. |
| 47 | 23.68 | same | | MOTIVATION FOLLOWS. |
| 48 | 24.45 | same | proud stance facing camera | |
| 49 | 25.10 | same | little cheer hop | |
| 50 | 25.95 | same | | FOLLOW FOR MORE (chip) |
| 51 | 26.30 | same | wave | |
| 52 | 27.20–28.5 | same | button: proud pose, spark burst, cloud bounce, zoom tap | |

## Layout / safe zone
Captions are DOM text (kit `kin`) in y 262–540, x 120–960. The cloud, word prop and meter gauge stay below the caption
band; the meter label is DOM text and is checked. WHEN I FEEL LIKE IT (size 96, 643 px wide in world) is centred by the
camera: 643 × 1.21 (max zoom with the punch) = 778 px, so x ≈ 150–930 on screen at its widest. Zoom-checked with
`node footage.mjs sheets out/stick-motivation-x0.5.mp4 --every 0.1 --from 13.0 --to 14.6`.
`node kit/check_overlap.mjs stick-motivation --step 0.0333` → OK.

## Sound (sound.json)
- Music: hype 118 bpm A minor 0–14.5 s with its crash on the cut (hit 13.45) and a record stop in the pause
  (12.9–13.42); a soft chill bed (90 bpm C major) while he starts, 14.5–18.9; hype 118 C major 18.9–28.5 with its drop
  on "catches up" (hit 20.46).
- SFX: whoosh on every camera move; land/hop on the jumps; impact on "liar"; chime when the cloud shows up; rewind chatter
  while the clock spins; the word-cut set (shing 13.23 → whoosh + slice + impact_hard 13.45 → land, halves hit the floor);
  pop + chime per check mark; riser into the sparkle rain + chime; neutral end button shing + chime_up at 27.2 (no brand sting). SFX gains capped (whooshes -9, impact_hard -11) so the master stays at true peak <= -1 dBFS..
- Master: -14 LUFS, true peak ≤ -2 dBTP.

## Facts / numbers ledger
No numbers on screen.
| claim on screen | source | note |
|---|---|---|
| "Action first. Motivation follows." / "Action comes first… then motivation catches up." | Mark Manson, *The Subtle Art of Not Giving a F\*ck* (2016), the "Do Something" principle: action → inspiration → motivation. Same idea in behavioural activation therapy (acting before the mood improves; e.g. Jacobson, Martell & Dimidjian, 2001, *Clinical Psychology: Science and Practice* 8(3)). | Pop-science framing, no medical claim, no statistic. |
| "Motivation is a liar." | the bible's video title (rhetorical framing of the claim above) | Opinion line, not a fact. |

## App version (added) — out/stick-motivation-app-sound.mp4
Same page and scenes: `stick-motivation-app/` holds `variant.js` (`window.APP_VERSION = 1`), a symlink to this `index.html`, and
`sound.json` generated by `python3 kit/sound/app_version.py stick-motivation 25.8`. Identical to the brand-neutral video up to the lesson;
the lesson captions leave at 25.5 s, the FOLLOW FOR MORE chip and VO are dropped, and at EC0 = 25.8 s the kit's
`endCardApp` plays for 3.3 s (slash wipe → ninja lands by the real icon, DOWNLOAD SUMMITLY / FREE ON THE APP STORE /
SEARCH "SUMMITLY", katana flourish pointing at the icon) with VO "Download Summitly. Free on the App Store." at EC0 + .3 and
the signature `sting` at the icon reveal (EC0 + .5). Duration 29.1 s. The brand-neutral render (`out/stick-motivation-sound.mp4`) is unchanged.
