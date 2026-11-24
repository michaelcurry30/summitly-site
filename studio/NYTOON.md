> **2026-11-21 — PLANNER TOONS (current):** Michael stopped selling Nah-You shirts and sells his DIGITAL PLANNERS on Gumroad again.
> **2026-11-23 (noon): Michael changed his mind — PLANNER TOONS stay. The art idea (studio/ART.md) is cancelled; never make art videos.**
> **Every video run: read "WHAT'S WORKING" below first and follow its rules for topics, hooks and slots (updated every Sunday from real view numbers).**

## WHAT'S WORKING (auto-updated weekly)
_First review runs Sunday 2026-11-29. Until then: keep the current mix._

> All 5 channels post the v2 toon style below (same characters), but every video sells a planner and is about STAYING ON TRACK.
> Never mention Nah-You, shirts or the Shopify store. Characters wear plain coloured tees (CAST print:null).
> In the story the character uses a digital planner once (`planner(x,y,s,t,{title,checked})` prop) and the script names the product once, naturally
> (e.g. "Kev checks off his habit planner…"). Add a short staying-on-track payoff line before the end card. End card: set window.PROD (product name in caps),
> window.PTITLE (2-word checklist title), window.PCOL (header colour), window.ENDCHAR (the channel's CAST entry). Model: nv01 (media/toons/pl01.mp4).
> Captions / first comment / product per topic: studio/CTA.md (the "no planner talk inside videos" rule is replaced for these toons by Michael 2026-11-21).
> Channel → character → main product: Rep Atlas 8097005 DRE (Fit & Strong Tracker) · Focus Forge 7858926 JAY (Daily Habit Builder / Study & Success Planner) ·
> animatedstickhabit 7993679 KEV (Break the Habit tracker) · What If Daily 7996103 RIO ("What if you…?" + Money Mastery / Life Reset / bundles) ·
> Satisfy Lab ASMR 8048779 TASHA (Life Reset Planner). Media go to media/toons/<id>.mp4 (ids keep the per-channel prefixes dr/jy/kv/ro/ts).
> Posting: 4 a day per channel (09:00, 12:00, 15:00, 19:30), each post to that channel's YouTube + Instagram. No TikTok.

> **2026-11-22 — VIRAL PACKAGING (required on every video, Michael asked for hooks/thumbnails/titles that go viral):**
> 1. **On-screen hook = thumbnail.** Put `"hook"` in the script json (`<id>.json`), 4–8 words, ONE `*highlight*` word (yellow). toon2.html draws it
>    big at the top from frame 0 (frame 0 is the Shorts/Reels cover) with a punch-in zoom on the character, and keeps it until the first line ends.
>    It must be a bolder, shorter claim than the spoken line, never a plain question that starts "Why does…". Good: "Your muscles grow when you *stop* training",
>    "People chose a *shock* over being bored", "1% better a day = *37x* in a year", "Your phone *didn't* actually buzz", "Do *this* every time you get a raise".
>    Patterns: surprising claim · "You've been doing X *wrong*" · number/result ("*37x*", "*6 weeks*") · "The *lazy* trick that…" · direct "you/your" · mild controversy.
>    Must be TRUE (only claim what the script proves). No product name, no character name, no "Did you know".
> 2. **First frame:** the character's face must be visible BELOW the headline (headline covers roughly the top 650 px after zoom) and show a strong
>    expression (shock / grin / smug). Default zoom focus is [540,980] at 1.6×; if the character isn't centred, set `"hookf":[x,y]` (and `"hookz"`) in the
>    script json. Check `node st.mjs "toon2.html?ep=<id>" 0,1.6` before rendering: face fully in frame, not under the text, text readable.
> 3. **First spoken line (≤ 12 words)** starts the payoff immediately: no greeting, no silence (voice starts < 0.4 s), lead with the surprising part.
>    What If Daily lines still open with "What if you…".
> 4. **YouTube title** ≤ 55 characters + " #shorts": curiosity gap or bold result, "you/your", 1 emoji max, no ALL CAPS sentences, no clickbait lies
>    (e.g. "Your muscles don't grow in the gym 😳 #shorts", "One text just ruined your study session 📱 #shorts").
> 5. **Caption line 1** = the same hook idea as the title (it's what shows under the Reel). Then the CTA line, then 5–7 hashtags.

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
| dr01 | Rep Atlas (2026-11-21 19:30) | Dre / Fit & Strong Tracker | the 21-day myth: habits took a median ~66 days (range 18-254) to feel automatic; one missed day didn't derail it — why people quit in week 3 |
| dr02 | Rep Atlas (2026-11-22 19:30) | Dre / Fit & Strong Tracker | delayed onset muscle soreness peaks ~1-3 days later; repeated bout effect = next round less sore |
| dr03 | Rep Atlas (2026-11-23 09:00) | Dre / Fit & Strong Tracker | rest days: muscle protein synthesis ~+50% at 4 h, roughly doubled (~+109%) at 24 h, nearly back to baseline by 36 h after heavy lifting (MacDougall et al. 1995) |
| dr04 | Rep Atlas (2026-11-23 12:00) | Dre / Fit & Strong Tracker | gym habit: 111 new gym members over 12 weeks; habit needed at least ~4 sessions/week for ~6 weeks (Kaushal & Rhodes 2015) — count the visits |
| dr05 | Rep Atlas (2026-11-23 15:00) | Dre / Fit & Strong Tracker | missed a week: reviews suggest strength in trained lifters mostly holds ~3 weeks off (McMaster et al. 2013); regaining is often faster (muscle memory) |
| dr06 | Rep Atlas (2026-11-23 19:30) | Dre / Fit & Strong Tracker | temptation bundling: gym-only audiobooks → ~51% more gym visits at first vs control, faded after the Thanksgiving break (Milkman, Minson & Volpp 2014) |
| dr07 | Rep Atlas (2026-11-24 09:00) | Dre / Fit & Strong Tracker | holiday weight gain: ~195 adults, avg ~0.37 kg (~0.8 lb) over the holidays, mostly not lost a year later (Yanovski et al. 2000, NEJM) — 2 logged workouts a week through Thanksgiving |
| dr08 | Rep Atlas (2026-11-24 12:00) | Dre / Fit & Strong Tracker | early strength gains mostly neural (nervous system recruits/syncs more fibres), visible growth later (Moritani & deVries 1979) — watch the numbers, not the mirror |
| dr09 | Rep Atlas (2026-11-24 15:00) | Dre / Fit & Strong Tracker | instigation vs execution habit: ~123 adults, only the habit of starting predicted exercise frequency (Gardner, Phillips & Judah 2016) — plan the start |
| dr10 | Rep Atlas (2026-11-24 19:30) | Dre / Fit & Strong Tracker | consistent workout time: ~375 NWCR members, ~68% exercised at a consistent time, linked to more activity (Schumacher et al. 2019, correlational) |
| dr11 | Rep Atlas (2026-11-25 09:00) | Dre / Fit & Strong Tracker | implementation intentions: ~250 young adults, ~35% of motivation-only group exercised vs ~91% who wrote day/time/place (Milne, Orbell & Sheeran 2002) |
| dr12 | Rep Atlas (2026-11-25 12:00) | Dre / Fit & Strong Tracker | fresh start effect: ~12,000 students at one university gym, visits ~+33% at start of a week, ~+47% start of semester (Dai, Milkman & Riis 2014) — every Monday page is a fresh start |
| dr13 | Rep Atlas (2026-11-25 15:00) | Dre / Fit & Strong Tracker | forecasting myopia: people predict they'll enjoy exercise less than they do because they picture the hard start; picturing the whole session helped (Ruby, Dunn et al. 2011) |
| dr14 | Rep Atlas (2026-11-25 19:30) | Dre / Fit & Strong Tracker | paying not to go to the gym: ~7,750 members at 3 US gyms, monthly members paid $17+ per visit vs $10 pass (DellaVigna & Malmendier 2006) — count visits, not payments |
| jy01 | Focus Forge (2026-11-21 19:30) | Jay / Daily Habit Builder | if-then plans: people act on intentions ~half the time (53%); across 94 studies implementation intentions gave a medium-large boost (d≈.65) |
| jy02 | Focus Forge (2026-11-22 09:00) | Jay / Study & Success Planner | testing effect: after 1 week, rereaders recalled ~40% vs ~61% for students who practised recall (Roediger & Karpicke 2006) |
| jy03 | Focus Forge (2026-11-22 15:00) | Jay / Life Reset Planner | fresh start effect: Google 'diet' searches ~+14% at start of each week, ~82% at new year (Dai, Milkman & Riis 2014) |
| jy04 | Focus Forge (2026-11-22 19:30) | Jay / Daily Habit Builder | progress principle: ~12,000 daily diary entries from 238 workers; on their best days the most common trigger was making progress, even small (Amabile & Kramer) |
| jy05 | Focus Forge (2026-11-23 09:00) | Jay / Daily Habit Builder | hourly diary study: ~43% of daily actions were habits, done while thinking about something else (Wood, Quinn & Kashy 2002) |
| jy06 | Focus Forge (2026-11-23 12:00) | Jay / Study & Success Planner | interruptions: office workers took ~23 min on average to get back to the original task; worked faster after interruptions but reported more stress (Mark et al.) |
| jy07 | Focus Forge (2026-11-23 15:00) | Jay / Break the Habit tracker | self-control: 205 adults beeped through the day; higher self-control = fewer temptation conflicts and less resisting (Hofmann et al. 2012) |
| jy08 | Focus Forge (2026-11-23 19:30) | Jay / Daily Habit Builder | progress monitoring: review of 138 studies, ~20,000 people; prompting people to monitor progress raised goal attainment, more when written down or shared (Harkin et al. 2016) |
| jy09 | Focus Forge (2026-11-24 09:00) | Jay / Study & Success Planner | spacing effect: review of 317 experiments, spaced study usually beat massed/cramming for recall (Cepeda et al. 2006) |
| jy10 | Focus Forge (2026-11-24 12:00) | Jay / Daily Habit Builder | goal gradient: coffee 'buy 10 get 1 free' card, visits came sooner as the card filled (Kivetz, Urminsky & Zheng 2006) — short streaks with a visible finish |
| jy11 | Focus Forge (2026-11-24 15:00) | Jay / Study & Success Planner | micro-breaks (≤10 min): 2022 meta-analysis, more vigor/less fatigue, performance gains smaller and mixed (Albulescu et al. 2022) |
| jy12 | Focus Forge (2026-11-24 19:30) | Jay / Daily Habit Builder | walking & creativity: Stanford studies (alternate uses), creative output ~60% higher while walking, even on a treadmill facing a blank wall; no real boost for one-right-answer tasks (Oppezzo & Schwartz 2014) |
| jy13 | Focus Forge (2026-11-25 09:00) | Jay / Study & Success Planner | production effect: 95 people, 4 ways (silent, someone else, own recording, aloud); reading aloud yourself remembered best (Forrin & MacLeod 2018, Waterloo) |
| jy14 | Focus Forge (2026-11-25 12:00) | Jay / Study & Success Planner | doodling: 40 people, dull 2.5-min phone message, shape-shaders recalled ~29% more on surprise test (Andrade 2010) |
| jy15 | Focus Forge (2026-11-25 15:00) | Jay / Study & Success Planner | expecting to teach: same passage, 'teach' group recalled more, better organised, esp. main points; nobody actually taught (Nestojko et al. 2014, WashU) |
| ts01 | Satisfy Lab (2026-11-21 19:30) | Tasha / Life Reset Planner | planning fallacy: thesis students guessed ~34 days, took ~55 on average; worst-case guesses still too hopeful, only ~30% on time (Buehler, Griffin & Ross 1994) |
| ts02 | Satisfy Lab (2026-11-22 09:00) | Tasha / Life Reset Planner | open loops: interrupted tasks tend to be remembered better (Zeigarnik); a specific plan largely removed the nagging-goal distraction (Masicampo & Baumeister 2011) |
| ts03 | Satisfy Lab (2026-11-22 15:00) | Tasha / Life Reset Planner | 'what the hell' effect: dieters who believed they'd broken their diet ate more, not less (Polivy & Herman) — one bad day is one box |
| ts04 | Satisfy Lab (2026-11-22 19:30) | Tasha / Life Reset Planner | bedtime to-do list: 57 young adults, 5 min writing before bed; to-do list group fell asleep ~9 min faster than 'done list' group, more specific = faster (Scullin et al. 2018) |
| ts05 | Satisfy Lab (2026-11-23 09:00) | Tasha / Life Reset Planner | endowed progress: car wash cards, 8 stamps blank ~19% finished vs 10 stamps with 2 pre-stamped ~34% (Nunes & Dreze 2006) — count what you already did |
| ts06 | Satisfy Lab (2026-11-23 12:00) | Tasha / Life Reset Planner | progress principle: ~12,000 diary entries from 238 workers; progress on meaningful work = top good-day booster, on ~3 of 4 best days (Amabile & Kramer) — weekly small wins |
| ts07 | Satisfy Lab (2026-11-23 15:00) | Tasha / Life Reset Planner | positive fantasies sap energy (Kappes & Oettingen 2011, NYU); mental contrasting goal → obstacle → if-then plan |
| ts08 | Satisfy Lab (2026-11-23 19:30) | Tasha / Life Reset Planner | mind wandering: ~2,250 adults pinged at random, minds wandered ~47% of the time, less happy on average while wandering (Killingsworth & Gilbert 2010, Harvard) — write loose thoughts down |
| ts09 | Satisfy Lab (2026-11-24 09:00) | Tasha / Life Reset Planner | self-compassion after failure: after a hard vocab test, self-compassion group chose to study longer than self-esteem/control groups (Breines & Chen 2012, UC Berkeley) — bad week reset |
| ts10 | Satisfy Lab (2026-11-24 12:00) | Tasha / Life Reset Planner | visual clutter: objects in view compete for neural representation, harder to focus (McMains & Kastner 2011, Princeton fMRI) — clear desk, one task |
| ts11 | Satisfy Lab (2026-11-24 15:00) | Tasha / Life Reset Planner | habit discontinuity: UK employees who had recently moved and cared about the environment drove to work less (Verplanken et al. 2008) — plan the new routine after a move |
| ts12 | Satisfy Lab (2026-11-24 19:30) | Tasha / Life Reset Planner | affect labeling: ~30 people in fMRI viewing angry/scared faces; picking a word for the feeling quieted amygdala response more than picking a name (Lieberman et al. 2007, UCLA) — name it, then plan it |
| ts13 | Satisfy Lab (2026-11-25 09:00) | Tasha / Life Reset Planner | weekly gratitude: students wrote gratitude vs hassles vs events once a week for 10 weeks; grateful group felt better about life, more optimistic, ~1.5 h more exercise/week vs hassles (Emmons & McCullough 2003) |
| ts14 | Satisfy Lab (2026-11-25 12:00) | Tasha / Life Reset Planner | nature walk: 38 city dwellers, 90-min walk in nature vs along a busy road; nature group reported less rumination + lower subgenual prefrontal activity (Bratman et al. 2015, Stanford, PNAS) — plan the walk |
| ts15 | Satisfy Lab (2026-11-25 15:00) | Tasha / Life Reset Planner | announced identity goals: in lab studies, when others noticed people's identity goal they then put in less effort (symbolic self-completion, Gollwitzer et al. 2009) — quiet goal, loud progress |
| kv01 | animatedstickhabit (2026-11-21 19:30) | Kev / Break the Habit tracker | snooze: in one survey of ~1,700 adults ~69% snoozed, snoozers spent ~22 min a morning on it (Sundelin et al. 2023); sleep inertia = brain needs a while to boot up |
| kv02 | animatedstickhabit (2026-11-22 09:00) | Kev / Break the Habit tracker | 'brain drain': ~800 people, phone in another room did better on memory/focus tests than phone on desk/pocket (Ward et al. 2017); later replications found smaller effects |
| kv03 | animatedstickhabit (2026-11-22 15:00) | Kev / Daily Habit Builder | procrastination: future self looks a lot like a stranger in brain scans (Ersner-Hershfield et al. 2009); feeling closer to future self → more patient choices; 5-minute start |
| kv04 | animatedstickhabit (2026-11-22 19:30) | Kev / Break the Habit tracker | phantom vibrations: ~290 undergrads, ~89% had felt them, about every 2 weeks, mostly not bothered (Drouin et al. 2012); notifications off |
| kv05 | animatedstickhabit (2026-11-23 09:00) | Kev / Break the Habit tracker | ultra-processed snacks: NIH inpatient study, 20 adults, ~500 more kcal/day on ultra-processed menu and ate faster (Hall et al. 2019); one bowl, bag in the kitchen |
| kv06 | animatedstickhabit (2026-11-23 12:00) | Kev / Break the Habit tracker | boredom: alone with thoughts up to 15 min, ~2/3 of men and ~1/4 of women gave themselves a mild shock (Wilson et al. 2014); wait one minute before grabbing the phone |
| kv07 | animatedstickhabit (2026-11-23 15:00) | Kev / Break the Habit tracker | "I don't" vs "I can't": ~120 students, nearly 2/3 of "I don't" group took granola bar vs <40% of "I can't" (Patrick & Hagtvedt 2012) |
| kv08 | animatedstickhabit (2026-11-23 19:30) | Kev / Break the Habit tracker | bedtime procrastination: ~180 adults, going to bed later than intended with no outside reason, linked to insufficient sleep and lower self-control (Kroese et al. 2014); phone charges outside the bedroom |
| kv09 | animatedstickhabit (2026-11-24 09:00) | Kev / Break the Habit tracker | email batching: 124 adults, week checking email 3x/day vs unlimited, lower daily stress when limited (Kushlev & Dunn 2015); notifications off, set inbox times |
| kv10 | animatedstickhabit (2026-11-24 12:00) | Kev / Break the Habit tracker | stale popcorn: habitual cinema snackers ate about as much week-old popcorn as fresh at the movies, not in a meeting room or with the non-dominant hand (Neal, Wood et al. 2011, USC); change the cue |
| kv11 | animatedstickhabit (2026-11-24 15:00) | Kev / Daily Habit Builder | procrastination: students who procrastinated reported less stress/symptoms early in term, more by the end, and lower grades (Tice & Baumeister 1997); one small step a day |
| kv12 | animatedstickhabit (2026-11-24 19:30) | Kev / Break the Habit tracker | eating lunch at a screen: people who played a computer game during lunch felt less full, remembered lunch less clearly and ate more biscuits at a later taste test (Oldham-Cooper et al. 2011, Bristol); eat screen-free |
| kv13 | animatedstickhabit (2026-11-25 09:00) | Kev / Study & Success Planner | screen attention: average time on one screen before switching ~2.5 min in 2004 → ~47 s in recent years (Gloria Mark, UC Irvine); one task, one tab, timer |
| kv14 | animatedstickhabit (2026-11-25 12:00) | Kev / Break the Habit tracker | phone use ~2x estimates: 23 adults 18-33, ~5 h/day, ~85 checks/day, many under 30 s (Andrews, Ellis et al. 2015); tally pickups, phone across the room |
| kv15 | animatedstickhabit (2026-11-25 15:00) | Kev / Break the Habit tracker | ignored notifications: texts/calls during a focus test raised errors even without answering or looking (Stothart, Mitchum & Yehnert 2015, Florida State); do not disturb in focus time |
| ro01 | What If Daily (2026-11-21 19:30) | Rio / Money Mastery Budget Planner | $5 a day ≈ $1,825/yr; at an assumed ~7%/yr (not guaranteed) ≈ $172k after 30 yrs, only ~$55k paid in — time does the work |
| ro02 | What If Daily (2026-11-22 09:00) | Rio / Money Mastery Budget Planner | forgotten subscriptions: 2022 C+R Research survey, people guessed ~$86/mo, actual ~$219/mo (≈$133/mo, ~$1,600/yr gap) |
| ro03 | What If Daily (2026-11-22 15:00) | Rio / Daily Habit Builder | 10 pages a day = 3,650 pages/yr ≈ 12 books of ~300 pages, ~1 book a month from ~15 min a night |
| ro04 | What If Daily (2026-11-22 19:30) | Rio / Money Mastery Budget Planner | credit card minimums: $3,000 at ~21% APR (Fed G.19: 20%+ lately), min = interest + 1% ($25 floor) ≈ 15 yrs + ~$4,200 interest; steady $100/mo ≈ 3.5 yrs |
| ro05 | What If Daily (2026-11-23 09:00) | Rio / Daily Habit Builder | 1% better a day: 1.01^365 ≈ 37.8, 0.99^365 ≈ 0.03 — maths metaphor, real life messier |
| ro06 | What If Daily (2026-11-23 12:00) | Rio / Money Mastery Budget Planner | Save More Tomorrow (Thaler & Benartzi 2004): savings rate ~3.5% → ~13.6% after 4 raises (~40 months), take-home pay didn't shrink |
| ro07 | What If Daily (2026-11-23 15:00) | Rio / Money Mastery Budget Planner | cash vs card: MIT sealed-bid auction for sold-out basketball tickets, card group bid up to ~2x (Prelec & Simester 2001) |
| ro08 | What If Daily (2026-11-23 19:30) | Rio / Money Mastery Budget Planner | 52-week ladder: $1+$2+…+$52 = $1,378; weeks 27-52 = $1,027 (~3/4 of it) |
| ro09 | What If Daily (2026-11-24 09:00) | Rio / Daily Habit Builder | implementation intentions (Milne, Orbell & Sheeran 2002, UK): wrote day/time/place → ~91% exercised in the week vs ~35-38% without a plan |
| ro10 | What If Daily (2026-11-24 12:00) | Rio / Money Mastery Budget Planner | food waste: USDA 30-40% of US food supply wasted; avg family of four loses ~$1,500/yr (≈$125/mo) |
| ro11 | What If Daily (2026-11-24 15:00) | Rio / Money Mastery Budget Planner | $400 emergency: Fed SHED 2025 (May 2026) 63% would cover it with cash or equivalent → >1 in 3 need another way; $20/wk = $1,040/yr |

Metricool tiktokData needs a "title" (else 'TikTok title is required'); use the hook line.

2026-11-20: Pinterest disconnected from Metricool (not used any more). Metricool brands renamed Nah-You, Nah-You Built Different, Nah-You Bad Habits, Nah-You What If, Nah-You Own The Room.


## REACH SETTINGS (Michael 2026-11-23: "turn on the settings that make Reels / Shorts get more views") — use on EVERY post
- Hook frame as cover: `"videoCoverMilliseconds": 400` in info (the punch-in headline frame = the thumbnail on the grid and in Shorts search).
- Instagram: `instagramData {"type":"REEL","showReelOnFeed":true,"isAiGenerated":true}` (Reel also shows on the main grid/feed).
- YouTube: `youtubeData {"type":"short","title":"<hook> #shorts","privacy":"public","madeForKids":false,"notifySubscribers":true,
  "category":<channel category>,"tags":[8-12 search phrases people really type, e.g. "habit tracker","digital planner","how to stay consistent", the topic words]}`.
- Captions: first line = the hook (it is what shows before "more"); one question to drive comments (e.g. "Which one are you? 👇"); 3-5 niche hashtags + #shorts, never 30 generic ones.
- Keep posting the 4 fixed times every day (consistency is what the algorithms reward); never re-post the same video.
