# CHOSEN BIBLE SHORTS — all 5 channels (Michael, 2026-11-27)

Every channel now posts short animated Bible stories in the "storybook sketch" style Michael approved
(sample: media/bible/bb01.mp4 Jesus calms the storm, media/bible/bs01.mp4 David and Goliath).
They promote Michael's Christian clothing brand **Chosen** (black clothes, white lettering).
Planner toons, art videos, Gumroad, Nah-You, Skool and courses are RETIRED: never mention them.

Store (bio link): https://wearchosenclothing.com

## Channels (each has its own series so no two channels tell the same story)
| channel | Metricool blogId | id prefix | series (pick stories ONLY from this list's theme) |
|---|---|---|---|
| Rep Atlas (YT + IG rep_atlas) | 8097005 | br | Old Testament heroes: David, Daniel, Joseph, Gideon, Samson, Elijah, Jonah, Joshua, Nehemiah |
| Focus Forge (YT + IG focusforge_3030) | 7858926 | bf | Miracles of Jesus (Gospels) |
| animatedstickhabit (YT + IG) | 7993679 | bk | Parables and teachings of Jesus |
| What If Daily (YT + IG whatif.daily.3d) | 7996103 | bw | Beginnings: Creation, Eden, Noah, Babel, Abraham, Isaac, Jacob, Moses and the Exodus |
| Satisfy Lab (YT + IG satisfylabasmr_1) | 8048779 | bt | Women of faith and the early church: Ruth, Esther, Hannah, Deborah, Mary, Martha, Acts, Paul |
Check the LOG below and never repeat a story already told on any channel.

## Bible accuracy (most important rule)
- Tell what the text actually says. Read the passage first (e.g. web search "<book> <chapter> WEB" / biblegateway) and keep the order of events.
- Direct quotes: use the World English Bible (public domain) wording or a very close, plain paraphrase. Never invent quotes, numbers or details.
- If something is tradition or uncertain (e.g. Goliath's exact height), hedge ("about", "the text says").
- No denominational arguments, no politics, no mocking anyone. Respectful, hopeful tone.

## Script (<id>.json) — copy studio/nytoon/bs01.json as the model
`{"id","voice":"am_michael","speed":1.0,"ref":"1 SAMUEL 17","hook":"... *one* word starred","lines":[...]}` with 10-12 lines, ~45-55 s:
- line 0: modern hook to the viewer ("Ever feel like...?") — no scene/cast needed (bedroom at night, guy in the CHOSEN hoodie).
- lines 1..n-2: the story. Each line: `{"vo", "scene", "cast":[...], "cam":[zoom,cx,cy], "fx":[...], "title"}`.
  Put `"title":"<BOOK CH:V>"` on line 1. Scenes, cast names, poses and fx are listed at the top of studio/nytoon/bible_story.js.
  Feet sit on y≈1400 (default); x between 150 and 930; s 0.7-0.85 (a giant up to 1.15). Max 3 people per line. Vary the camera:
  wide [1,540,860], medium [1.4,x,800], close-up [1.7-2,x,720]. Talking characters use pose "talk" or "speak":1. A lying figure's head is
  ~0.75*s*1000 px to the LEFT of x, so put it at x≥850.
- last line: modern application ("Whatever giant you're facing today...") — bright morning bedroom, guy waves.
No JS to write: every id without its own function uses the generic story() engine. Never edit bible.html, bible_eps.js or bible_story.js in a scheduled run.

## Pipeline (studio/nytoon/, server: `cd studio && python3 -m http.server 8766 &`)
1. `python3 vo.py <id> && python3 align.py <id>`
2. stills: `node st.mjs "bible.html?ep=<id>" 2,<3 middle times>,<end+1> x` → /tmp/nt_<t>.jpg; look at them (faces not hidden, people on screen).
3. `node st.mjs "bible.html?ep=<id>" render out/<id>_v.mp4`
4. `python3 bible_sfx.py <id> && python3 ../bhc/sound.py "$(cat out/<id>_sfx.json)" out/<id>.wav out/<id>_vo.wav`
5. `ffmpeg -i out/<id>_v.mp4 -i out/<id>.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart ../../media/bible/<id>.mp4`

## Posting (Metricool createScheduledPost)
2 a day per channel: 12:00 and 19:30 America/Chicago. YouTube + Instagram only (never TikTok/Facebook). autoPublish true.
Media: https://raw.githubusercontent.com/michaelcurry30/summitly-site/<commit sha>/media/bible/<id>.mp4
Caption: `<hook without *> ✝️` · blank · one line with the verse reference and a question for comments (e.g. "1 Samuel 17. What giant are you facing?") · blank ·
`✝️ Wear your faith: Chosen clothing → link in bio` · blank · 5-7 hashtags (#bible #biblestories #jesus #faith #christian #shorts + one story tag).
First comment: `✝️ Shop the Chosen collection (tees, hoodies, hats & more): <store link>`.
YouTube: type short, title "<hook> #shorts", madeForKids false, category EDUCATION, tags 8-12 (bible story, <names>, <book>, christian, faith, jesus, chosen), notifySubscribers true.
Instagram: REEL, showReelOnFeed true, isAiGenerated true. videoCoverMilliseconds 400.

## LOG
| id | channel | story | ref | hook |
|---|---|---|---|---|
| bb01 | sample | Jesus calms the storm | Mark 4:35-41 | Jesus slept through a deadly storm |
| bs01 | sample | David and Goliath | 1 Samuel 17 | A shepherd boy against a giant |
