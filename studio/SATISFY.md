# SATISFY LAB (YouTube name "Satisfy Lab ASMR"; handle still @BadHabitClub, every @satisfylab* handle was refused) — satisfying 3D physics ASMR shorts (Metricool brand 8048779, was "Habit Dojo" / "Bad Habit Club")

Michael switched this channel on 2026-11-14 to oddly-satisfying 3D physics clips: a glossy sheet drops onto shapes,
and it gets heavier every round ("1 kg → 10 kg → 50 kg → 200 kg"). No voice. ASMR sound only.
The look and the scenes are our own. Never copy another creator's exact scene, colors, labels or footage.

## Pipeline (`studio/satisfy/`)
- `sim2.py <spec.json> <i>`: real cloth physics in Blender (`pip install --break-system-packages bpy==5.3.0`, Python 3.13).
  Exports per-frame cloth vertices to `data/<id>/<bin>.bin` and `data/<id>/scene.json`. About 60–90 s per round.
- `web/index.html`: three.js renderer (glossy clearcoat cloth, soft shadows, room reflections). Run `npm i three@0.170.0` in `web/` once.
  Serve `studio/` with `python3 -m http.server 8766`.
- `rend.mjs <spec.json> <out.mp4> [stills f1,f2]`: renders with Playwright + swiftshader, about 1.8 s per frame.
  Use the `stills` mode first and look at 6–8 frames before the full render.
- `sound.py <spec.json> <out.wav>`: ASMR sound (air whoosh as the sheet falls, wet squish on contact, stretchy creaks, soft chime each round, quiet pad).
- `make.sh <spec.json>`: runs everything. Output `out/<id>.mp4`.
- ep01.json is the model episode (5 spheres in a plus shape; 1 / 10 / 50 / 200 kg; red, teal, gold-metal, purple).

## Spec
```
{"id":"ep02","fov":40,"cam":[0,3.1,5.6,0.9],
 "obstacles":[{"type":"sphere|cube|cylinder|cone|torus","loc":[x,y,z],"size":s,"h":1,"minor":0.1,"rot":[rx,ry,rz]}],
 "tray":{"r":1.3},"cloth":{"size":2.3,"grid":78,"z0":2.9,"rot":[0.04,0.03,0.6]},
 "rounds":[{"bin":"r1","label":"1 kg","mass":0.3,"stiff":40,"bend":0.02,"frames":150,"color":"#b0001e"}, ...]}
```
Coordinates are Blender units, Z up. Keep obstacles within about 1.2 of the center and their tops near z 1.2–1.6.
- Heavier = higher `mass` and lower `stiff`. Proven ladder: (0.3, 40), (1, 15), (3, 6), (8, 2). Make the last round 165 frames so the drip finishes.
- Optional `metal` 0–1 on a round gives a liquid-metal look.

## Variety (each video has a NEW scene; log it below)
Obstacle ideas: a single big sphere; 3 stacked cubes; a ring of 6 cones (spikes); a torus on a pole; a 3×3 peg grid of thin cylinders;
stairs of cubes; a pyramid of spheres; two pillars with a gap; a cone tip; a cube tilted on its corner.
Label ideas: kg ladder, "silk → rubber → honey → liquid metal" material ladder, "1 sheet → 3 sheets" (later).
Colors: rotate jewel tones (ruby, teal, gold metal, violet, emerald, coral, cobalt). The background stays soft blue-grey.

## No planner talk in the video
The video has no CTA card and no voice. The planner pitch goes only in the caption line and the first comment (CTA.md),
framed for this channel: "📒 Satisfying, right? Make your days this smooth with my digital planners → link in bio".

## Posting
Slots 09:00 / 12:15 / 15:30 / 21:00 America/Chicago. Instagram REEL + YouTube short. autoPublish true. YouTube category ENTERTAINMENT. madeForKids false.
Caption: hook ("Wait for 200 kg 😮‍💨" / "Which weight was the most satisfying?") + newline + "🎧 sound on" + blank line + CTA line + newline
`#satisfying #asmr #oddlysatisfying #3danimation #physics #shorts` + 1–2 more.
First comment: CTA.md first-comment line (Daily Habit Builder or a bundle).
YouTube title: `<hook> #satisfying #shorts`.

## Log
| id | scene | posted |
|---|---|---|
| ep01 | 5 spheres in a plus, 1→200 kg | 2026-11-15 12:15 |
| ep02 | pyramid of 5 spheres; emerald, coral, cobalt, rose-gold metal | 2026-11-15 21:00 |
| ep03 | stack of 3 shrinking cubes; cyan, magenta, lime, silver metal | 2026-11-16 09:00 |
| ep04 | torus ring on a pole; yellow, violet, orange, emerald metal | 2026-11-16 12:15 |
| ep05 | ring of 6 cone spikes + tall center cone; hot pink, azure, amber, aqua metal | 2026-11-16 15:30 |
