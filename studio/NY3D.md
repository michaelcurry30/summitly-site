# NAH-YOU 3D — story shorts with the Nah-You crew (Michael's streetwear: https://nah-you.myshopify.com/collections/all)

Michael 2026-11-20: the faces don't have to look real, but the MOVEMENT must look like a real person (no stiff/broken arms),
voices must sound human, and every story needs several scenes, different days/times and real events that are fun to watch.

## Pipeline (`studio/ny3d/`)
- `lib.js` — world + people.
  - World: `makeWorld(R)` → `{S,setTime('morning'|'sunset'|'night'),netKick(amt,t),RIM}`. One city block: fenced street court (hoop z=-13),
    sidewalk/road/parked cars along z≈19–29, storefront row at z≈34 with a NAH-YOU shop sign, floodlights at night.
  - People: `person(S,opts)` = Ready Player Me body (`anim/Masculine.glb`), clothes painted into its own texture (skin tone, hair colour,
    painted beard, Nah-You print front/back), optional `hat:'beanie'|'dad'`. `p.setShirt(front,back)` (cached), `p.mouth(0..1)` (jaw morph),
    `p.look(vec3,amt)`, `p.head()`, `p.hand('Right'|'Left')`.
  - Motion: REAL MOTION CAPTURE from the Ready Player Me animation library (`anim/<category>/M_*.glb`), played on the native RPM skeleton
    (`rpm.glb`, invisible) and copied bone-by-bone in world space. `p.pose(t,[[start,'clip',{once,off,fade,speed}],...])` cross-fades clips.
    `CLIPS[k].userData.speed` = the clip's real ground speed (m/s): move characters at exactly that speed so feet never slide.
  - Licence: the RPM animations/avatars are free for commercial use WITH RPM avatars but may NOT be redistributed → `studio/ny3d/anim/` is git-ignored.
    Re-download: `git clone --depth 1 --filter=blob:none --sparse https://github.com/readyplayerme/animation-library` (`git sparse-checkout set masculine/glb`),
    copy `masculine/glb/*` to `anim/`; avatar FBX via `https://media.githubusercontent.com/media/readyplayerme/animation-library/master/masculine/fbx/Masculine_TPose.fbx`
    → convert with Blender bpy (import fbx, export glb) to `anim/Masculine.glb`.
- `cast.js` — the crew: **dre** (lead, beanie, YOU'RE NEXT), **kev** (best friend, cap, TALK LESS), **marcus** (rival, red tee, no Nah-You until the end),
  **jay** (BUILT DIFFERENT), **rio** (hype man, cap, N-Y mark). Keep them; add new people the same way.
- `talk.py <ep>` — natural Kokoro voices (dre am_michael, kev am_puck, marcus am_fenrir, rio am_eric, jay am_onyx; NO pitch shifting), small room
  reverb per scene → `t/<ep>.json` (scenes, lines, marks, mouth envelopes) + `out/<ep>_vo.wav`. Script = `<ep>.script.json` (`scene`,`pause`,`line`,`mark`).
- `<ep>.html` — the episode: one function per scene, each sets `W.setTime`, places people, `pose()` timelines, ball, camera shots.
  Overlays: day/time card at each scene start ("SATURDAY · 9:02 PM"), speaker-name captions, NAH-YOU watermark, end card with the product.
  Slow motion = `story(t)` time-map for the big moment.
- `sound.py <ep>` — original hip-hop beat that follows the story (light in the morning, full at practice, drops out before the big play,
  hits on the swish), ambience (traffic/birds, court, crowd babble from many real voices), crowd "ooh"/cheers, bounces, swish, riser, boom.
- Stills: `node st.mjs <ep>.html 1.0,3.0,...` → `/tmp/ny_<t>.jpg` (check every shot: faces in frame, nothing blocking, caption clear).
  Render: `QS="rs=0.75" node st.mjs <ep>.html render out/<ep>_v.mp4` (~2–3 s/frame on 2 CPUs — run nothing else heavy meanwhile).
  Mux: `ffmpeg -i out/<ep>_v.mp4 -i out/<ep>_mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart ../../media/nahyou/<ep>.mp4`
- Channel art: `brand.html?mode=pfp|banner&who=&crew=&tod=&col=&tag=&title=A|B&sub=x|y` via `node brand.mjs '[["out.png","query"],...]'`.

## Story rules
4 scenes, 30–40 s, each scene a different day/time and place, an event that escalates (challenge → practice → showdown → payoff),
one Nah-You product shown clearly (chest print in a close-up), dialogue 2–8 words per line, captions with speaker names. No real brands,
no real people, no copied characters. The ending shows the product name + "link in bio".

## Log
| id | story | file |
|---|---|---|
| ny01 | 2D cartoon "who's next?" (old engine, bhc) | media/nahyou/ny01.mp4 |
| ny02 | 3D: Monday street → Wednesday practice → Saturday night showdown ("Nah... you.") → "Where'd you get that shirt?" | media/nahyou/ny02.mp4 |
