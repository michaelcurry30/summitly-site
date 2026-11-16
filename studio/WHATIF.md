# WHAT IF DAILY (was "Quiet Progress") — "What if you…?" 3D shorts (Metricool brand 7996103, Instagram REEL + YouTube short, NO Facebook)
YouTube: name "What If Daily", handle @WhatIfDaily-c3r. Art: media/whatif_logo.png, media/whatif_banner.png (studio/whatif/brand/).

Michael switched Quiet Progress on 2026-11-15 to narrated "What if you…?" hypotheticals: a 3D person in a 3D world tries something
extreme, a narrator walks through what would REALLY happen, with word-by-word captions and red measurement callouts.
Topics do NOT have to be about habits (physics, body, space, animals, money, history, everyday myths…).
The format is a common genre. Never copy another creator's exact topic, script, character or scenes.

## Pipeline (`studio/whatif/`)
- `wiNN.json` = the script: `{"id","title","lines":[{"vo":"spoken text","cap":"optional on-screen text (digits)","gap":0.18}]}`.
  8–11 lines, 22–30 s. Line 1 is the hook and must start with "What if you". The last line is the payoff + "Follow for more what ifs."
- `python3 vo.py wiNN`: Kokoro am_michael narration → `out/wiNN_vo.wav` + `t/wiNN.json` (line + word times).
- `index.html`: three.js world (procedural city, sky, sun shadows), REAL HUMAN characters (Michael: never robots/mannequins): `person('michelle'|'soldier')`.
  An invisible Xbot plays the clip and each human bone copies it in world space: `play(p,'idle|walk|run|agree|sad_pose|sneak_pose',t)`; head shake = rotate `p.head` after play().
  Prefer 'michelle' (casual clothes); 'soldier' wears armor, use only if the story fits.
  captions (3 words at a time, the current word yellow), overlay helpers `redNum(text,x,y,size,alpha)`, `bracketV(x,y1,y2)`, `speedLines()`, `P(vec3)` → screen.
  Each episode is a function `wiNN(t)` that picks the shot by `lineAt(t)` and sets the camera, people and props. wi01 (penny from a skyscraper) is the model.
  Add the new function and route `window.render` by `EPID`. New props: build from three.js primitives (boxes, cylinders, spheres) with good materials.
- Look at 8–11 stills first: `node rend.mjs wiNN x 1.0,3.0,…` → `/tmp/wi_<t>.jpg`. Check: the subject is big and clear in every shot, nothing blocks the camera,
  callouts don't cover the subject, captions readable. Then `node rend.mjs wiNN out/wiNN_v.mp4` (~1.9 s/frame, ~25 min).
- Sound: write `out/wiNN_sfx.json` `{dur,sfx:[[t,name],…]}` (kit SFX names: whoosh_long, whoosh_short, pop, riser, air, impact_soft, impact_hard, soft_tap, chime_up, …),
  then `python3 ../bhc/sound.py "$(cat out/wiNN_sfx.json)" out/wiNN.wav out/wiNN_vo.wav` and mux:
  `ffmpeg -i out/wiNN_v.mp4 -i out/wiNN.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 160k -shortest -movflags +faststart media/whatif/wiNN.mp4`.

## Facts
Every number must be real: look it up with web search during the run and use round, hedged numbers ("about", "around").
No medical or dangerous how-to content; never suggest people try anything harmful. If it would kill you, say it plainly and move on.

## Topic bank (pick ones that can be shown with a city, a person and simple props)
penny from a skyscraper ✔ · the falling-elevator jump myth · sneezing with your eyes open · running across a city in a straight line ·
yelling from the top of a skyscraper (how far sound travels) · throwing a baseball off a skyscraper · how many balloons to lift a person ·
a mile-tall building · stacking every person on Earth · holding your breath underwater · a pool full of ball pits · digging straight down ·
walking around the Earth · jumping on the Moon · if you never cut your hair · eating only one food for a year · saving $1 a day for 50 years.

## Posting (no planner talk in the video)
Slots 09:00 / 12:15 / 15:30 / 21:00 America/Chicago, providers instagram + youtube ONLY (Facebook is disconnected), autoPublish true, category EDUCATION.
Caption: hook question + 🤔 + newline + one teaser line + newline "Follow for a new what if every day 👀" + blank line +
"📒 My digital planners → changinghabits4good.gumroad.com" + newline `#whatif #whatifdaily #physics #science #3danimation #shorts` + 2 topic tags.
YouTube title: the hook question in Title Case + " #shorts". First comment: CTA.md first-comment line.
(Michael plans a Skool community about AI content later. Until he says it's live, do NOT mention Skool or courses anywhere.)

## Log
| id | topic | posted |
|---|---|---|
| wi01 | penny dropped from a 1,300 ft skyscraper | 2026-11-16 09:00 |
