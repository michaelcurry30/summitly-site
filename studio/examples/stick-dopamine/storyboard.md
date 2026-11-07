# Storyboard — stick-dopamine ("YOUR BRAIN ON 'ONE MORE VIDEO'")
Built on `kit/stick.js` (Stick Ninja kit) and `kit/sound/`. `kit` is a symlink to `../kit`. 27.5 s, 1080×1920, 30 fps.

## Source log
No source media. Every visual is drawn by `kit/stick.js` (environments, the ninja rig, props, word cut, dopamine
meter, scroll goblin). Fonts from `kit/fonts`. No app, no brand, no logo; "TIKTOK" appears only as a plain word prop.

## VO (Kokoro; measured with `python3 kit/sound/mix.py measure stick-dopamine`)
Narrator `af_heart` 1.08 (lines 9–10 slowed to 1.0 / 0.98 for weight); NINJA = `blend:am_michael:0.6,am_puck:0.4` 1.0.
56 words / 27.5 s = 2.0 words/s of video.

| # | start | dur | end | line | on screen |
|---|---|---|---|---|---|
| 0 | 0.15 | 2.02 | 2.17 | This is your brain on... one more video. | YOUR BRAIN ON / “ONE MORE VIDEO” |
| 1 | 3.00 | 1.07 | 4.07 | Swipe... spike. | SWIPE. SPIKE. |
| 2 | 4.50 | 1.09 | 5.59 | Swipe... crash. ("crash" ≈ 5.12) | SWIPE. CRASH. |
| 3 | 6.30 | 1.92 | 8.22 | Every swipe is a quick dopamine hit. ("quick" ≈ 7.38) | EVERY SWIPE = / A QUICK DOPAMINE HIT |
| 4 | 8.70 | 1.89 | 10.59 | So real work starts to feel boring. | REAL WORK FEELS… / BORING. |
| 5 | 11.00 | 0.95 | 11.95 | (NINJA) Just one more... | word prop JUST ONE MORE |
| 6 | 13.20 | 0.79 | 13.99 | (NINJA) Not today. | NOT TODAY. |
| 7 | 15.90 | 1.69 | 17.59 | Phone away. Let it be boring. ("Let" ≈ 16.8) | PHONE AWAY. / LET IT BE BORING. |
| 8 | 18.30 | 1.20 | 19.50 | The spikes calm down... | THE SPIKES / CALM DOWN. |
| 9 | 20.00 | 1.60 | 21.60 | and the work finally pulls him in. | AND THE WORK / PULLS HIM IN. |
| 10 | 22.50 | 1.66 | 24.16 | Boredom is where focus starts. | BOREDOM IS WHERE / FOCUS STARTS. |
| 11 | 25.40 | 0.90 | 26.30 | Follow for more. | chip FOLLOW FOR MORE |

## Shot list (27.5 s; 5 locations: bedroom at night, inside the feed, city rooftop, mountain dawn, library)
Every row is a distinct visual change (42 in total; never more than ~1.3 s without one, except the deliberate pause 13.95–14.45).

| # | t (s) | location / shot | change | text |
|---|---|---|---|---|
| 1 | 0.00 | BEDROOM, medium on the desk, slow push-in (z 1.40→1.50) | Ninja hunched over the phone (scroll pose, glazed eyes, cyan glow on the face), thumb mid-swipe, hearts pop out of the phone. Thumbnail frame. | YOUR BRAIN ON / “ONE MORE VIDEO” |
| 2 | 0.25 | same | swipe 1, hearts, meter-trace starts | |
| 3 | 0.90 | same | DOPAMINE METER rises in (left) | label DOPAMINE |
| 4 | 1.15 | same | swipe 2: meter spikes | |
| 5 | 1.95 | same | swipe 3: spike | |
| 6 | 2.20 | same → phone | camera rushes INTO the phone screen (zoom ×3) | |
| 7 | 2.60 | INSIDE THE FEED, wide | purple flash cut; huge blank feed cards scroll; ninja floats, still scrolling | |
| 8 | 3.05 | feed | swipe: cards jump, hearts, meter spikes | SWIPE. |
| 9 | 3.45 | feed | | SPIKE. (slam, pink) |
| 10 | 3.75 | feed | THE SCROLL GOBLIN pops up from below, grinning | |
| 11 | 4.55 | feed | swipe | SWIPE. |
| 12 | 5.12 | feed | CRASH: meter crashes below the baseline, ninja slumps and sinks, goblin laughs, meter shakes | CRASH. |
| 13 | 5.55 | feed | he grabs the phone again: frantic swipes 5.55, 5.95 | |
| 14 | 6.25 | feed, tilted close-up on face + phone (z 1.9, −5°) | hard cut with a flash frame | EVERY SWIPE = |
| 15 | 6.5–8.2 | close-up | rapid swipes every ~0.45 s, each spike smaller | A QUICK DOPAMINE HIT (beats) |
| 16 | 8.55 | BEDROOM, wide desk | whip up; he types slowly on the laptop, bored face | REAL WORK FEELS… |
| 17 | 9.55 | same | head droops onto the desk (eyes closed) | |
| 18 | 10.00 | same | | BORING. (cyan) |
| 19 | 10.35 | same | phone buzzes on the desk (glow + jitter), he jolts up | |
| 20 | 10.85 | BEDROOM, closer (z 1.42→1.50) | cut | |
| 21 | 10.95 | same | physical word JUST ONE MORE flies in and hovers, wobbling | (prop) |
| 22 | 11.30 | same | he reaches, phone in hand, eyes glazed | |
| 23 | 11.85 | same | JUST ONE MORE leaves; giant TIKTOK drops from above | (prop) |
| 24 | 12.43 | same | TIKTOK slams to a stop (squash, screen shake) | |
| 25 | 12.52 | same | SNAP OUT: determined eyes, shake lines, phone flicked back onto the desk | |
| 26 | 12.75 | CITY ROOFTOP at night, low wide (z 1.2) | whip up; TIKTOK hovers over the skyline; ninja lands in a crouch | |
| 27 | 13.20 | rooftop | | NOT TODAY. |
| 28 | 13.95 | rooftop | DELIBERATE PAUSE: music stops, slow push-in, crouch hold (anticipation) | |
| 29 | 14.13 | rooftop | slash begins: draw + leap (arc 300 px) | |
| 30 | 14.45 | rooftop | THE WORD CUT: smear arc, impact frame (2 frames white-hot word + accent flash + 8 px shake + zoom punch), word splits along the slash line | |
| 31 | 14.5–14.7 | rooftop | clean-cut beat: halves hold with a sliver gap, the upper half slides down the cut; sparks + shards; music drop | |
| 32 | 14.75 | rooftop | ninja lands on the far side; halves tumble with gravity and rotation, fade by 15.3 | |
| 33 | 15.45 | rooftop | sheathes the katana | |
| 34 | 15.80 | BEDROOM, medium (z 1.45→1.32) | whip left; drawer slides open, phone in hand | PHONE AWAY. |
| 35 | 16.45 | same | phone dropped in, drawer SLAMS (shake) | |
| 36 | 16.80 | same | | LET IT BE BORING. |
| 37 | 17.05 | same | he walks back and sits, relaxed | |
| 38 | 17.30 | same | meter returns: no spikes, level settling | label DOPAMINE |
| 39 | 18.15 | MOUNTAIN DAWN, medium | whip left; ninja breathing slowly, sun rising | THE SPIKES / CALM DOWN. |
| 40 | 19.90 | LIBRARY, desk, push-in z 1.32→1.55 | whip up; he types, focused; laptop lines fill; focus rings pulse | AND THE WORK / PULLS HIM IN. |
| 41 | 21.55 | library | green check mark pops | |
| 42 | 22.30 | MOUNTAIN DAWN, wide, sun up | whip up; stretch | BOREDOM IS WHERE / FOCUS STARTS. (word slams on the VO beats) |
| 43 | 23.40 | mountain | fist pump | |
| 44 | 24.05 | mountain | katana flourish (smear arc) | |
| 45 | 25.05 | mountain | sheathe | |
| 46 | 25.25 | mountain | | FOLLOW FOR MORE (chip) |
| 47 | 25.60 | mountain | waves at camera | |
| 48 | 26.40–27.5 | mountain | button: proud pose facing camera, spark burst, zoom tap at 26.6 | lesson + FOLLOW FOR MORE stay up |

## Layout / safe zone
Captions are DOM text (kit `kin`, per-word clip-path wipe so no word ever overlaps another) in y 262–720, x 120–960.
Dopamine meter x 132–440, y 650–1190 (label at the top). The ninja's face stays in y < 1260 in every shot (cameras
put the floor at screen y ≈ 1600–1720). Whip-pan speed lines are drawn only below y 720. The physical words
(JUST ONE MORE, TIKTOK) are canvas props placed below the caption band.
`node kit/check_overlap.mjs stick-dopamine --step 0.0333` → OK (see the run log in the final report).

## Sound (sound.json)
- Music: two beds. Hype 118 bpm A minor 0–15.8 s with its downbeat/crash on the cut (hit 14.45) and a record stop
  during the pause (13.95–14.42); then a warm chill bed (90 bpm C major) 15.8–27.5 s.
- SFX: whoosh on every camera move (2.6, 6.25, 8.55, 10.85, 12.75, 15.8, 18.15, 19.9, 22.3), ui_tap per swipe,
  pop / uhoh / impact on SPIKE, CRASH, BORING, notif_ding on the buzz, impact_hard on the TIKTOK slam,
  word cut set: riser → shing (draw 14.23) → whoosh + slice + impact_hard (14.45) → land, drawer slam, chime on the
  check mark. Neutral end button: shing + chime_up at 26.6 (no brand sting).
- Master: -14 LUFS, true peak ≤ -2 dBTP.

## Facts / numbers ledger
| on screen / claim | source | note |
|---|---|---|
| (no numbers on screen) | — | No digits appear anywhere in the video. |
| "Every swipe is a quick dopamine hit" | pop-science framing allowed by STICK_BIBLE.md rule 9 | General framing of novelty/reward on feeds; no medical claim, no statistic. |
| "The spikes calm down" | same | Shown as a stylised meter, not data. The meter has no scale or numbers. |

## App version (added) — out/stick-dopamine-app-sound.mp4
Same page and scenes: `stick-dopamine-app/` holds `variant.js` (`window.APP_VERSION = 1`), a symlink to this `index.html`, and
`sound.json` generated by `python3 kit/sound/app_version.py stick-dopamine 24.9`. Identical to the brand-neutral video up to the lesson;
the lesson captions leave at 24.6 s, the FOLLOW FOR MORE chip and VO are dropped, and at EC0 = 24.9 s the kit's
`endCardApp` plays for 3.3 s (slash wipe → ninja lands by the real icon, DOWNLOAD SUMMITLY / FREE ON THE APP STORE /
SEARCH "SUMMITLY", katana flourish pointing at the icon) with VO "Download Summitly. Free on the App Store." at EC0 + .3 and
the signature `sting` at the icon reveal (EC0 + .5). Duration 28.2 s. The brand-neutral render (`out/stick-dopamine-sound.mp4`) is unchanged.
