# BAD HABIT CLUB — relatable comedy shorts (Metricool brand 8048779, was "Habit Dojo")

Michael switched this channel on 2026-11-14 to **funny relatable cartoon shorts** starring our own original character **Gus**
(peach skin, purple hair tuft, orange hoodie, navy pants). The ninja series and the GTA news format are retired for this brand.
Never copy another creator's character, art style, catchphrases or jokes. Every joke is original.

## EVERY episode TALKS (Michael 2026-11-14: "add talking, moving… make it better… not just about habits, different stories")
- Characters speak real lines with lip-sync, and there is lots of motion: walking, jumps with squash/stretch, camera zooms/pans
  (`cam(z,cx,cy)`), head bob while talking, blinks, shakes, scrolling backgrounds. Follow **EP2 ("we have food at home")** as the model.
- Stories can be ANY relatable short skit (family, school, work, friends, food, money, phones, pets, siblings, dating, gym, gaming),
  not only habits. Cast: Gus (lead), Mom (`mom()`: curly auburn hair, glasses, teal cardigan), the talking food container (`container()`),
  Boss (square guy, tie). Add new original side characters as functions when a story needs them.
- Voices (talk.py CAST, Kokoro + pitch shift): gus=am_puck↑, mom=af_heart, mon=am_onyx↓ (monster/object), boss=bm_george, kid=af_sky↑.
- Script: `epN.script.json` = {cap, script:[["scene",name],["pause",s],["line",id,who,text(,pitch)],["sfx",name,offset],["mark",name]]}.
  `python3 talk.py epN` → `t/epN.json` (scene times, line times, mouth envelopes, sfx) + `out/epN_vo.wav`.
  In draw(t): `talkAt('gus',t)` → mouth 0..1 (use mouth:'talk', talk:G, bob:G*10), `LN(id).s/.e`, `MK(name)`, `SC(name)`, `during(id,t)`.
  Episode object: `{talk:'epN',cap,get sfx(){return TL.sfx},get dur(){return TL.dur},draw(t){...}}`.
- Keep lines short and punchy (2–8 words). 8–12 lines per episode. Best structure: setup → reaction → escalation → twist → tag joke at the end.
- Rectangles (fridges, buildings, signs, stoves) use `box()` / `quad()` — `blob()` only for round organic shapes.
- Check a 10–12 frame contact sheet before rendering: every face visible (nothing hidden behind props), text not overlapping.

## Format (`studio/bhc/index.html`)
- 1080x1920, 30 fps, 18–28 s. NO planner end card and no planner talk in the video (see CTA.md); the video ends on the tag joke.
- Top caption box the whole time: a relatable "me:" / "my brain at 3 AM:" / "nobody: / me:" setup line with one emoji.
- 4–6 scenes that **escalate** to an absurd punchline (time skips, "3 WEEKS LATER", Gus turning into dust, a skeleton, etc.).
- Big pop labels for gags (`label()`), speech bubbles (`bubble()`), clocks, TV, office/boss, phone, fridge, bed, gym — add new props as small functions.
- Gus rig: `gus(x,y,scale,{pose,eyes,mouth,blood,bags,droop,twitch,armL,armR,look,stache,prop,...})` — exaggerated faces sell the joke.
- Lines boil at 8 fps (BOIL). Sound: `sound.py` = plucky music bed + kit SFX + custom (ALARM, BIRDS, BLAH, SCRATCH); add new custom SFX there.
- Add each episode as `EPn={dur,cap,sfx:[[t,'name'],...],draw(t)}` and register it in `EPS`.

## Topic bank (any relatable story — habits are just one source)
food at home ✔ · siblings fighting over the front seat · group project where you do everything · "we need to talk" texts · pet judging you ·
dad and the thermostat · teacher says "pick a partner" · waiter says "enjoy your meal" → "you too" · alarm clock vs. you · online order arrives vs. the photo ·
mom on the phone switches voices · walking into a room and forgetting why · friend "5 minutes away" · grocery trip for 1 thing → $200 ·
more habit ideas:
one more episode · "5 more minutes" snooze · doomscrolling in bed · opening the fridge every 10 min · "I'll start Monday" diet ·
gym membership never used · procrastinating then panicking at 11:59 PM · impulse buying at 2 AM · "just checking one notification" ·
leaving laundry in the washer · 47 browser tabs · forgetting water all day · new planner, abandoned by Feb 3 · reading 1 page then phone ·
"quick nap" becomes 4 hours · budgeting then ordering takeout.

## Build
1. Write EPn in index.html. Check stills: `node st.mjs epN <times>` (serve studio/ on port 8766 first: `python3 -m http.server 8766` in studio/).
2. `node rend.mjs epN out/epN_v.mp4` (pipes frames to ffmpeg).
3. Dump `{dur,sfx}` from the page to `out/epN.json`, `python3 sound.py "$(cat out/epN.json)" out/epN.wav out/epN_vo.wav` (3rd arg mixes voices and ducks the music).
4. Mux video+audio (no end card), → `media/bhc/bhcNN.mp4`, commit + push.
   URL: `https://raw.githubusercontent.com/michaelcurry30/summitly-site/main/media/bhc/bhcNN.mp4`

## Posting
4 slots: 09:00 / 12:15 / 15:30 / 21:00 America/Chicago, Instagram REEL + YouTube short, autoPublish true, category COMEDY/ENTERTAINMENT.
Caption: the caption-box joke + emoji, newline, "tag someone who does this 😭" (or a "which one are you?" question), blank line,
the CTA line from `CTA.md` (pick the product matching the habit), newline `#badhabitclub #relatable #funny #animation #shorts` + 2 topic tags.
First comment: CTA.md first-comment line. YouTube title: `<joke in Title Case> 😭 #shorts`.
Slots still holding old Habit Dojo ninja posts stay as they are; fill only empty slots. Old GTA (neondrop) drafts never publish.

## Log
| id | topic | posted |
|---|---|---|
| bhc01 | one more episode, then bed | 2026-11-14 21:40 |
| bhc02 | mom: we have food at home (first talking ep) | 2026-11-15 18:30 |
