# NAH-YOU TOONS — narrated cartoon shorts that sell Michael's Nah-You streetwear (all 5 channels, from 2026-11-20)

Michael 2026-11-20: every channel posts these narrated cartoon explainers (style he sent: one word on screen at a time, a narrator,
close-ups, X-ray/"inside the head" cutaways, a twist), each with a DIFFERENT character wearing a Nah-You piece. Stories do not
have to be basketball. ~22–27 s. The Shopify store link goes in every caption and bio: https://nah-you.myshopify.com
(no Gumroad planner CTA on these channels any more; never mention Skool or courses).


## STYLE v2 — USE THIS (Michael approved 2026-11-21, nv01 "why you wake up right before your alarm")
Page: `nytoon/toon2.html` (helpers + cast) + `nytoon/eps2.js` (model episode nv01). Each channel writes ONLY its own file and id prefix so parallel runs never collide:
DRE `eps2_dre.js` ids drNN · JAY `eps2_jay.js` jyNN · KEV `eps2_kev.js` kvNN · RIO `eps2_rio.js` roNN · TASHA `eps2_tasha.js` tsNN (start at 01; next = highest existing + 1). Register with `window.EPS=Object.assign(window.EPS||{},{id})`. Always `git pull --rebase` right before every push.
Look: our own simple character (round head, bean body in a Nah-You tee, thin stick limbs, expressive faces calm/smug/tired/sleep/shock/grin),
warm spotlit rooms, and 4-5 DIFFERENT visual set-pieces per video like the reference Michael sent (X-ray body + brain `kev(...,{xray:true,glow})`,
sleep/depth meter `sleepMeter`, evidence board `corkboard`, big tag labels `tag()`, close-ups via `cam()`); one word on screen at a time.
Story = one interesting TRUE fact explained (hedged, real numbers, look them up), ~30-37 s, 8 lines:
hook question → "that's not X, that's Y" → character puts on the Nah-You piece (say the product name once, naturally) → "here's what's going on" →
2-3 explanation lines with set-pieces → payoff line. End card shows the product + shop link (window.PROD).
Cast in toon2.html `CAST`: DRE (twists, Talk Less tee), JAY (buzz, Built Different print), KEV (curly, Talk Less tee), RIO (messy, You're Next tee),
TASHA (braids + hoops, Nah-You mark tee). Use `kev(x,y,s,{...CAST.RIO, face, armL, armR, pose, ...},t)` for any character; vary shirt/print per video.
New places/props: define them inside your channel's eps2_<ch>.js (don't edit toon2.html from a daily run).
Pipeline: `python3 vo.py <id> && python3 align.py <id>` (add unknown names/numbers to SUB in align.py) → stills with
`node st.mjs "toon2.html?ep=<id>" 1.5,5,10,15,20,27,32` (check: captions never cover faces or the shirt print, nothing important cut off at edges)
→ `node st.mjs "toon2.html?ep=<id>" render out/<id>_v.mp4` → sfx json (see out/nv01_sfx.json; 'ALARM','BLAH','BIRDS','SCRATCH' custom sounds exist) →
`python3 ../bhc/sound.py "$(cat out/<id>_sfx.json)" out/<id>.wav out/<id>_vo.wav` → mux to `../../media/nahyou/<id>.mp4` (same ffmpeg line as below).
The older flat style (index.html/eps.js, nyNN) below is retired; keep its posting rules.

## Channels
| Metricool blogId | channel (YouTube name) | character | format / topics | providers | YT category |
|---|---|---|---|---|---|
| 8097005 | Nah-You @NahYouOfficial (was Rep Atlas) | DRE (twists, brown skin) | street/sports stories, confidence, trash talk, comebacks | instagram, youtube | SPORTS |
| 7858926 | Nah-You Built Different @NahYouBuiltDifferent (was Focus Forge) | JAY (buzz, dark skin, tank) | discipline, habits, gym, 5 AM, money habits | instagram, youtube, tiktok | PEOPLE_BLOGS |
| 7993679 | Nah-You Bad Habits @NahYouBadHabits | KEV (curly hair, hoodie) | relatable funny bad habits explained (phones, snooze, procrastination) | instagram, youtube | COMEDY |
| 7996103 | Nah-You What If @NahYouWhatIf | RIO (messy black hair) | "What if you…?" — always open with "What if you", real numbers | instagram, youtube | EDUCATION |
| 8048779 | Satisfy Lab ASMR @BadHabitClub → rename to Nah-You Own The Room / @NahYouOwnTheRoom after Nov 29 (YouTube limit); IG nahyou.owntheroom | TASHA (braids, hoops, letterman) | confidence, social skills, first impressions, glow-ups | instagram, youtube | PEOPLE_BLOGS |
Rotate the outfit each video (tops: print 'talkless' | 'next' | 'built' on a tee; top:'tank'; top:'hoodie'; top:'letterman'; shirt colors) and say
which product in the caption + end card (window.PROD). Products: You're Next Tee, Talk Less Boxy Tee, Built Different Tank,
Nah-You Heavyweight Hoodie, Letterman Jacket, Windbreaker, Joggers, Fitted Cap, Dad Hat, Cuffed Beanie, High Tops.

## Pipeline (`studio/nytoon/`) — about 1 minute to render a video, free
1. Script `nyNN.json`: `{"id","voice":"am_michael","speed":1.06,"lines":[{"vo":..., "cap":optional digits version,"gap":opt}]}`
   exactly 8 lines (hook → setup → "here's why/what's happening" → X-ray explanation (2 lines) → contrast → twist → product payoff line).
   Facts must be true and hedged; no medical claims.
2. `python3 vo.py nyNN && python3 align.py nyNN` (narration + word timings).
3. Add `function nyNN(t)` to `eps.js` (copy ny04–ny08: `shotOf(t)` picks the line; places: room(), bedroom(t), gym(t), outCourt(t),
   party(t), xrayBg(t), blurBg(); helpers person(), label(), jag(), bubble(), battery(), phone(), ball(); set window.CAPY per shot
   so captions never cover faces or the shirt print; window.PROD = product for the end card) and register it in `window.EPS`.
   New places/props are welcome: add them to eps.js.
4. Serve studio/ (`python3 -m http.server 8766`), check stills: `./sheet.sh nyNN` → /tmp/sh_nyNN.jpg (faces in frame, print readable,
   nothing off-canvas, captions clear). Fix once.
5. Render + sound + mux:
   `node st.mjs "index.html?ep=nyNN" render out/nyNN_v.mp4`
   sfx json like out/ny05_sfx.json → `python3 ../bhc/sound.py "$(cat out/nyNN_sfx.json)" out/nyNN.wav out/nyNN_vo.wav`
   `ffmpeg -i out/nyNN_v.mp4 -i out/nyNN.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart ../../media/nahyou/nyNN.mp4`
6. Commit + push; media URL `https://raw.githubusercontent.com/michaelcurry30/summitly-site/<commit sha>/media/nahyou/nyNN.mp4`
   (use the commit sha, `main` URLs can lag a few minutes).

## Posting
Slots 09:00 / 15:00 / 19:30 America/Chicago (3 a day per channel: morning, afternoon, evening; Michael 2026-11-20). autoPublish true. instagramData {"type":"REEL","showReelOnFeed":true,"isAiGenerated":true};
youtube type short, title "<hook> #shorts", madeForKids false; tiktok (Focus Forge only) isAigc true, commercialContentOwnBrand true.
Caption: hook + emoji, optional 1 line, blank line, "👕 <Product> → link in bio" + newline "🛒 nah-you.myshopify.com", blank line, 6–7 hashtags incl. #nahyou #animation #shorts.
firstCommentText: "🛒 Shop Nah-You: https://nah-you.myshopify.com".
Old-format posts (workouts, physics ASMR, 3D what-ifs, stick figures, planner CTAs) still queued on these brands were set to draft on 2026-11-20; never publish drafts; a draft slot counts as EMPTY.

## Log
| id | channel | character / product | topic |
|---|---|---|---|
| ny04 | Nah-You | Dre / Talk Less tee | quiet guy vs trash talker |
| ny05 | Built Different Toons | Jay / Built Different tank | motivation battery vs habit autopilot |
| ny06 | Kev's Bad Habits | Kev / hoodie | 2 AM scrolling |
| ny07 | What If Daily | Rio / You're Next tee | 100 free throws a day for a year |
| ny08 | Satisfy Lab | Tasha / letterman | first impressions in seconds |
| nv01 | Nah-You Bad Habits (2026-11-21 09:00) | Kev / Talk Less tee | why you wake up right before your alarm (v2 style) |

2026-11-20: Pinterest disconnected from Metricool (not used any more). Metricool brands renamed Nah-You, Nah-You Built Different, Nah-You Bad Habits, Nah-You What If, Nah-You Own The Room.
