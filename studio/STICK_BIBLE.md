# STICK NINJA — content series bible (brand-neutral: works for the app channel AND the ebook channel)

Purpose: short animated lessons on habits, productivity, dopamine, distractions and motivation. NO app ads: no "Summitly", no "App Store", no "Free", no phone screenshots of the app, no logo end card. The videos must fit an ebook channel as well as the app channel.

Format: vertical 1080x1920, 30 fps, 25–35 s, built with the motion-video pipeline (mv/render.mjs, frame-pure index.html), sound via mv/kit/sound/mix.py, mandatory `node kit/check_overlap.mjs <project> --step 0.0333` = OK.

## Character: the STICK NINJA (the owner prefers the stick-figure style)
- Clean stick figure: round black head with a cyan headband + flowing tails, thick black limbs (round caps), cyan belt line, katana on the back. Expressive with simple eyes/brows in the mask slit. Thick, confident line weight (~16–22 px at full size), subtle cyan rim on one side so it pops on dark backgrounds.
- Rigged with 2-bone IK limbs and a pose library (reuse/adapt the rig in /tmp/claude-0/-home-claude/de0bb593-649c-5a9a-bc08-58d76073224a/scratchpad/new/ninja_kit.js: ik(), POSE {idle, run, jump, slash, point, cheer, kick, throw}, mixT blending) — add: sit-at-desk, scroll-phone (hunched, glazed eyes), slump, stretch, breathe, walk, climb, fall, get-up, facepalm, shrug, look-at-camera.
- Optional recurring extras: THE SCROLL GOBLIN (small chubby purple phone-shaped gremlin, mischievous) as the face of distraction; a DOPAMINE METER (vertical gauge that spikes and crashes).
- Put the character and helpers in mv/kit/stick.js (new file, documented in mv/kit/README.md). Do not change the older kit/summit.js behaviour.

## Signature move: THE WORD CUT
When the character is distracted, the distraction appears as a big physical word (e.g. "TIKTOK", "SCROLL", "JUST ONE MORE", "NOTIFICATIONS", "LATER") and the ninja SLICES it: anticipation crouch → smear arc (drawn shape, no blur) → impact frame (1–2 frames accent flash + 8 px shake) → the word splits along the exact slash line into two halves (clip-path polygons along the cut), halves slide apart and tumble/fall with gravity and rotation, a few sparks/shards, sound: whoosh + shing + slice. The cut must look precise and satisfying, like a real blade through a solid object. Plain text only, no logos.

## Look
- Dark, cinematic, clean: deep navy/ink backgrounds with soft gradients and simple flat environments (bedroom desk at night, library, city rooftop, mountain dawn), cyan accent #3ee6ff + warm orange #ffb36b, Big Shoulders Display 800 headlines, IBM Plex Mono kickers, Hanken Grotesk captions (fonts in mv/kit/fonts).
- "Realistic" motion = believable physics and timing: weight shifts, anticipation, follow-through on headband tails, gravity on falling objects, ease in/out everywhere, holds on key poses, secondary motion. No blur ever. No confetti spam.

## ENERGY RULES (mandatory)
1. A new visual change every 0.8–1.5 s; no shot holds still > 1.5 s except one deliberate dramatic pause.
2. The ninja is always doing something physical. Big silhouettes, squash & stretch, smear frames, impact frames.
3. At least 3 locations or set changes per video; varied shots (wide, close-up on face, low angle, split screen), camera always drifting/pushing, whip-pans between scenes.
4. One idea per video, told as a mini story: relatable problem → struggle → turn (the lesson) → payoff. A joke beat and something at stake.
5. Hook in the first 1.5 s with motion already happening at frame 0; frame 0 must also work as a thumbnail (headline + character mid-action, no words covered).
6. Kinetic typography synced to the voice (≤ 8 words on screen), every spoken line readable on screen, nothing ever covers a word.
7. Sound: narrator Kokoro "af_heart" speed ~1.08 (optionally the ninja's own voice "blend:am_michael:0.6,am_puck:0.4"), energetic music with a drop at the climax or a warm swell, whoosh on every camera move, impact on every hit, the word-cut sound set.
8. ENDING (replaces the old app end card): the lesson in one punchy line + a small neutral sign-off "FOLLOW FOR MORE" (no brand, no store, no app). The last frame should feel like a satisfying button, not an ad.
9. Facts: keep claims simple and accurate (pop-science framing like "quick dopamine hits" is fine; no medical claims, no fake statistics). Any number on screen must come from a cited, well-known source written in storyboard.md, or be avoided.
10. Before finishing, review the contact sheet as a harsh TikTok viewer; if any 2 seconds look like the 2 before, change them.

## Videos (first batch)
1. stick-dopamine — "YOUR BRAIN ON 'ONE MORE VIDEO'": ninja at desk, phone pulls him in, dopamine meter spikes and crashes each swipe, words fly in ("TIKTOK", "JUST ONE MORE"), he snaps out and slices "TIKTOK" with the word cut, puts the phone away, meter settles, he gets into deep work, payoff: "Boredom is where focus starts."
2. stick-two-minute — "THE 2-MINUTE RULE": ninja facing a giant habit ("READ 50 PAGES") that crushes him; shrinks it to "READ 1 PAGE", does it easily, repeats daily (calendar days fly), habit grows naturally; slices "LATER". Payoff: "Make it so small you can't say no."
3. stick-motivation — "MOTIVATION IS A LIAR": ninja waits for motivation (a sparkly cloud that never arrives), slices "WHEN I FEEL LIKE IT", starts anyway, motivation shows up after he starts. Payoff: "Action first. Motivation follows."
4. stick-environment — "PUT YOUR PHONE IN ANOTHER ROOM": willpower vs environment; ninja keeps getting yanked by the phone's pull (a rope), moves phone to another room, the rope snaps, he works; slices "NOTIFICATIONS". Payoff: "Don't fight temptation. Remove it."

## APP VERSION (added): "DOWNLOAD SUMMITLY" ending
The owner now wants the app call-to-action at the end of the app-channel versions. Keep the brand-neutral originals (out/<project>-sound.mp4) for the ebook channel and make an APP VERSION of each video: out/<project>-app-sound.mp4.
- After the lesson line, a 3–3.5 s END CARD (add endCardApp(t, t0) to kit/stick.js so every video uses the identical design): the stick ninja lands next to the real app icon (mv/kit/assets/icon.png, rounded-square with soft cyan glow), headline "DOWNLOAD SUMMITLY", sub-line "FREE ON THE APP STORE", small "SEARCH \"SUMMITLY\"". All inside the safe zone at mid-height (y ≈ 600–1150), nothing covering words. The ninja does a quick katana flourish that ends pointing at the icon.
- VO for the end card (narrator af_heart): "Download Summitly. Free on the App Store."
- SFX: the signature sting (katana shing + two-note rising chime) on the icon reveal.
- New videos made for the app channel may include ONE short beat (2–3 s) before the end card showing how Summitly helps with that lesson, using a REAL app screenshot in a phone held by the ninja (mv/kit/assets, /tmp/claude-0/-home-claude/de0bb593-649c-5a9a-bc08-58d76073224a/scratchpad/new/app_s_*.png) — nothing drawn over words in the screenshot; only numbers visible in the screenshot. Do not mention Pro-only features (coach, quit tracker, camp shop) since they aren't live yet; free features only: focus timer, tasks, habits + streaks, levels, rain sound.
