# Storyboard — stick-environment ("PUT YOUR PHONE IN ANOTHER ROOM")
Built on `kit/stick.js` (Stick Ninja kit + the appended extensions: `rope`, `box`, `buzz`, `belt`, env `hall`, poses `tug`,
`yanked`, `carry`, `reachUp`) and `kit/sound/`. `kit` is a symlink to `../kit`. 26.5 s, 1080×1920, 30 fps.

## Source log
No source media. Every visual is drawn by `kit/stick.js`. Fonts from `kit/fonts`. No app, no brand, no logo, no store line;
the phone shows only the kit's blank gradient screen.

## VO (Kokoro; measured with `python3 kit/sound/mix.py measure stick-environment`)
Narrator `af_heart` 1.08 (line 8 at 0.98); NINJA = `blend:am_michael:0.6,am_puck:0.4` 1.0. 48 words / 26.5 s = 1.8 words/s.
Pronunciation checked with `kokoro().tokenizer.phonemize` (willpower, temptation, grabbing): all correct, no lexicon entry needed.

| # | start | dur | end | line | on screen |
|---|---|---|---|---|---|
| 0 | 0.15 | 1.45 | 1.60 | Can't stop grabbing your phone? | CAN'T STOP GRABBING / YOUR PHONE? (frame 0) |
| 1 | 2.30 | 1.48 | 3.78 | It's not a willpower problem. | IT'S NOT A / WILLPOWER PROBLEM. |
| 2 | 4.40 | 1.50 | 5.90 | Every buzz... pulls you back. | EVERY BUZZ… / PULLS YOU BACK. |
| 3 | 7.00 | 1.30 | 8.30 | You fight it... and lose. | YOU FIGHT IT… / AND LOSE. |
| 4 | 9.80 | 0.82 | 10.62 | (NINJA) Not anymore. | NOT / ANYMORE. + prop NOTIFICATIONS |
| 5 | 12.30 | 1.45 | 13.75 | Put your phone in another room. | PUT YOUR PHONE / IN ANOTHER ROOM. |
| 6 | 15.00 | 1.35 | 16.35 | Out of sight... out of reach. | OUT OF SIGHT. / OUT OF REACH. |
| 7 | 17.60 | 1.76 | 19.36 | Now focus is the easy choice. | NOW FOCUS IS / THE EASY CHOICE. |
| 8 | 20.60 | 2.14 | 22.74 | Don't fight temptation. Remove it. | DON'T FIGHT TEMPTATION. / REMOVE IT. |
| 9 | 24.00 | 0.90 | 24.90 | Follow for more. | chip FOLLOW FOR MORE |

## Shot list (26.5 s; 6 locations: bedroom at night, purple void, city rooftop, hallway = "another room", library, mountain dawn)
45 distinct visual changes; nothing holds > 1.3 s except the deliberate crouch pause before the cut (10.25–10.53).

| # | t (s) | location / shot | change | text |
|---|---|---|---|---|
| 1 | 0.00 | BEDROOM, medium | Ninja yanked through the air by a taut pink rope from his belt to the buzzing phone on the shelf; thumbnail frame | CAN'T STOP GRABBING / YOUR PHONE? |
| 2 | 0.50 | same | lands hard, camera tap | |
| 3 | 0.62 | same | turns, stretches up for the phone | |
| 4 | 0.95 | same | grabs it | |
| 5 | 1.15 | same | glazed scrolling, rope slack between phone and belt | |
| 6 | 2.20 | VOID (purple), wide | whip; tug-of-war: the Scroll Goblin vs the straining ninja (sweat) | IT'S NOT A |
| 7 | 3.00 | same | ninja digs in harder, slides back | WILLPOWER |
| 8 | 3.31 | same | the goblin yanks: ninja stumbles forward, camera punch | PROBLEM. |
| 9 | 3.70 | same | goblin laughs, ninja back to straining, worried | |
| 10 | 4.30 | BEDROOM, desk | whip; ninja typing, rope slack to the phone | |
| 11 | 4.41 | same | phone buzzes (vibration marks, glow), ninja startled | EVERY BUZZ… |
| 12 | 4.80 | same | the rope tightens | |
| 13 | 5.24 | same | YANK: he flies backwards off the stool | PULLS YOU |
| 14 | 5.60 | same | slams under the shelf, shake | BACK. |
| 15 | 5.62 | same | a book falls on him | |
| 16 | 5.75 | same | dizzy stars | |
| 17 | 6.90 | BEDROOM, tilted low angle close | cut; he gets up | YOU FIGHT IT… |
| 18 | 7.05 | same | pushes toward the desk against the taut, vibrating rope, sweating | |
| 19 | 7.50 | same | buzz again | AND |
| 20 | 7.73 | same | yanked back again, crash-lands | LOSE. |
| 21 | 8.20 | same | slump | |
| 22 | 8.40 | ROOFTOP at night | whip; he leaps in and lands | |
| 23 | 8.60 | same | the word NOTIFICATIONS flies in, buzzing | (prop) |
| 24 | 9.20 | same | ready stance, glare | |
| 25 | 9.82 | same | points at it | NOT / ANYMORE. |
| 26 | 10.25 | same | crouch; DELIBERATE PAUSE, music stops, slow push | |
| 27 | 10.53 | same | slash: draw + leap | |
| 28 | 10.85 | same | THE WORD CUT on NOTIFICATIONS: smear arc, 2-frame flash, 8 px shake, zoom punch, split along the slash, sparks | |
| 29 | 10.9–11.7 | same | halves slide apart, tumble and bounce on the roof; he lands, ready | |
| 30 | 11.75 | same | sheathes | |
| 31 | 12.20 | BEDROOM | whip; reaches up and grabs the phone | PUT YOUR PHONE |
| 32 | 12.70 | same | carries it at arm's length, disgusted, walks out left | IN ANOTHER |
| 33 | 13.30 | HALLWAY (another room) | whip; enters from the right with the phone | ROOM. |
| 34 | 13.45 | same | opens the wooden box on the side table | |
| 35 | 13.70 | same | drops the phone in | |
| 36 | 13.95 | same | slams the lid, sparks, shake | |
| 37 | 14.15 | same | turns and walks out right, rope trailing from the box | |
| 38 | 15.00 | BEDROOM | whip; walks in toward the desk, rope trailing off-screen to the other room | OUT OF SIGHT. |
| 39 | 15.45 | same | the rope goes taut and vibrates; he pushes, sweating, camera pushes in | OUT OF |
| 40 | 16.00 | same | SNAP: the rope breaks, flash, sparks, shake, he lurches forward free | REACH. |
| 41 | 16.40 | same | looks at the camera, proud | |
| 42 | 17.40 | LIBRARY, table + laptop | whip up; focused typing, focus rings, lines fill (a short rope stub still on his belt) | NOW FOCUS IS |
| 43 | 18.80 | same | check mark, camera tap | THE EASY CHOICE. |
| 44 | 19.40 | same | leans back, happy | |
| 45 | 20.30 | MOUNTAIN dawn | whip up; breathing calmly, rope stub hanging from the belt | DON'T FIGHT TEMPTATION. |
| 46 | 20.90 | same | looks down at the stub | |
| 47 | 21.75–22.11 | same | draws and slices the stub off; it falls | REMOVE IT. |
| 48 | 22.9 | same | sheathes | |
| 49 | 23.95 | same | | FOLLOW FOR MORE (chip) |
| 50 | 24.30 | same | wave | |
| 51 | 25.30–26.5 | same | button: proud pose, spark burst, zoom tap | |

## Layout / safe zone
Captions are DOM text (kit `kin`) in y 262–540, x 120–960. Phone, rope, box and word props stay below the caption band.
NOTIFICATIONS (size 110, 552 px wide in world) is framed by the camera at x ≈ 280–950 on screen at the widest
(zoom 1.23 with the punch). Zoom-checked with `node footage.mjs sheets out/stick-environment-x0.5.mp4 --every 0.1 --from 10.4 --to 12.0`.
`node kit/check_overlap.mjs stick-environment --step 0.0333` → OK.

## Sound (sound.json)
- Music: hype 118 bpm A minor 0–12.2 s with its crash on the cut (hit 10.85) and a record stop in the pause (10.3–10.83);
  chill 90 bpm C major while he moves the phone 12.2–17.4; hype 118 C major 17.4–26.5 with its hit on "Remove" (22.11).
- SFX: whoosh on every camera move; notification dings on every buzz; impacts on the yanks, the shelf slam, the book and the
  lid; the word-cut set (shing 10.63 → whoosh + slice + impact_hard 10.85 → land); the rope SNAP (impact_hard + slice); chime on
  the check; slice on the stub; neutral end button shing + chime_up at 25.3 (no brand sting). SFX gains capped (whooshes -9, impact_hard -11) so the master stays at true peak <= -1 dBFS..
- Master: -14 LUFS, true peak ≤ -2 dBTP.

## Facts / numbers ledger
No numbers on screen.
| claim on screen | source | note |
|---|---|---|
| "It's not a willpower problem." / "Don't fight temptation. Remove it." | James Clear, *Atomic Habits* (2018), ch. 6 "Motivation Is Overrated; Environment Often Matters More" and the inversion of the 1st law, "make it invisible"; Wendy Wood, *Good Habits, Bad Habits* (2019), on friction and context beating willpower. | Pop-science framing, no statistic. |
| "Put your phone in another room." / "Out of sight… out of reach." | Ward, Duke, Gneezy & Bos (2017), "Brain Drain: The Mere Presence of One's Own Smartphone Reduces Available Cognitive Capacity", *Journal of the Association for Consumer Research* 2(2): participants with the phone in another room did better than with it on the desk. | The advice only; no numbers from the study are shown. |

## App version (added) — out/stick-environment-app-sound.mp4
Same page and scenes: `stick-environment-app/` holds `variant.js` (`window.APP_VERSION = 1`), a symlink to this `index.html`, and
`sound.json` generated by `python3 kit/sound/app_version.py stick-environment 23.4`. Identical to the brand-neutral video up to the lesson;
the lesson captions leave at 23.1 s, the FOLLOW FOR MORE chip and VO are dropped, and at EC0 = 23.4 s the kit's
`endCardApp` plays for 3.3 s (slash wipe → ninja lands by the real icon, DOWNLOAD SUMMITLY / FREE ON THE APP STORE /
SEARCH "SUMMITLY", katana flourish pointing at the icon) with VO "Download Summitly. Free on the App Store." at EC0 + .3 and
the signature `sting` at the icon reveal (EC0 + .5). Duration 26.7 s. The brand-neutral render (`out/stick-environment-sound.mp4`) is unchanged.
