> **CANCELLED 2026-11-23 — Michael went back to digital planners. Do NOT make or schedule art videos.**

# ART TOONS — all 5 channels (Michael, 2026-11-23)

Every channel now sells Michael's ORIGINAL ART PRINTS from his Shopify store **Wall Drop Studio**
(https://artpicstudio.myshopify.com — printed and shipped by Printful). The planner toons are retired:
no more Gumroad / planner CTAs in new videos.

Format: a ~20 s Short. The channel's character says **"I want to draw something."**, draws one of the store's posters on an
easel (sketch → colour reveal with a moving pencil arm), the action happens (ball flies, sun sets…), a big punch word, then
"What should I draw next? Tell me in the comments." End card: the framed print + "GET THE PRINT · LINK IN BIO".

## Channels
| channel | Metricool blogId | character (`char`) | id prefix | voice | posters to rotate |
|---|---|---|---|---|---|
| Rep Atlas (YT + IG rep_atlas) | 8097005 | DRE | atdr | am_michael | net, swing, down, corner, field, outwork |
| Focus Forge (YT + IG focusforge_3030) | 7858926 | JAY | atjy | am_michael | outwork, down, mountains, desert, field, net |
| animatedstickhabit (YT + IG) | 7993679 | KEV | atkv | am_michael | balloons, desert, city, corner, swing, moon |
| What If Daily (YT + IG whatif.daily.3d) | 7996103 | RIO | atro | am_michael | moon, city, balloons, mountains, golden, desert |
| Satisfy Lab (YT + IG satisfylabasmr_1) | 8048779 | TASHA | atts | af_heart | golden, mountains, moon, balloons, desert, city |

## Store products (poster id → product page)
| poster | product | link |
|---|---|---|
| golden | Golden Hour — Couple at Sunset | https://artpicstudio.myshopify.com/products/golden-hour-couple-at-sunset-art-print |
| moon | To The Moon & Back — Couple on the Moon | https://artpicstudio.myshopify.com/products/to-the-moon-back-couple-on-the-moon-art-print |
| mountains | Somewhere Quiet — Mountain Lake Sunset | https://artpicstudio.myshopify.com/products/somewhere-quiet-mountain-lake-sunset-art-print |
| city | City Lights — Night Skyline | https://artpicstudio.myshopify.com/products/city-lights-night-skyline-art-print |
| desert | Desert Nights — Cactus & Full Moon | https://artpicstudio.myshopify.com/products/desert-nights-cactus-full-moon-art-print |
| balloons | Rise Above — Hot Air Balloons | https://artpicstudio.myshopify.com/products/rise-above-hot-air-balloons-art-print |
| net | Nothing But Net — Retro Basketball | https://artpicstudio.myshopify.com/products/nothing-but-net-retro-basketball-sunset-poster |
| swing | Swing For The Fences — Retro Baseball | https://artpicstudio.myshopify.com/products/swing-for-the-fences-retro-baseball-poster |
| down | Never Stay Down — Boxing Gloves | https://artpicstudio.myshopify.com/products/never-stay-down-boxing-gloves-motivational-poster |
| corner | Top Corner — Retro Soccer | https://artpicstudio.myshopify.com/products/top-corner-retro-soccer-poster |
| outwork | Outwork Everyone — Gym Motivation | https://artpicstudio.myshopify.com/products/outwork-everyone-gym-motivation-poster |
| field | Leave It On The Field — Retro Football | https://artpicstudio.myshopify.com/products/leave-it-on-the-field-retro-football-poster |
Prints: 12×18 $24.99 · 16×24 $32.99 · 24×36 $44.99.

## Pipeline (`studio/nytoon/`, ~2 min per video)
1. Script `<id>.json` (model: `atts01.json`): fields `id, char, voice, speed (1.0–1.04), hook (≤8 words, one *highlight* word), hookf [430,1000],
   poster, punch (big word on the reveal, e.g. "SWISH!", "GOLDEN!", "KNOCKOUT!"), next ("WHAT NEXT?")` and EXACTLY 7 lines:
   0 "I want to draw something." · 1 what kind of thing / feeling · 2 first layer (sky, court…) · 3 second layer · 4 the action
   (for sports a "Three, two, one." countdown works; the countdown badge shows only if the line has "three … one") ·
   5 the punch line said aloud (short, `"gap":0.5`) · 6 "What should I draw next? Tell me in the comments."
   Make every script different (new angle, new feeling, new words); never copy a logged script.
2. `python3 vo.py <id> && python3 align.py <id>`
3. No JS to write: every id starting with `at` uses the generic `artx()` episode in eps2_art.js. Never edit toon2.html or eps2_art.js in a scheduled run.
4. Render: `node st.mjs "toon2.html?ep=<id>" render out/<id>_v.mp4`; check 3 stills (1 s, middle, end card).
5. Sound: `python3 art_sfx.py <id> && python3 ../bhc/sound.py "$(cat out/<id>_sfx.json)" out/<id>.wav out/<id>_vo.wav`
6. Mux: `ffmpeg -i out/<id>_v.mp4 -i out/<id>.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart ../../media/art_toons/<id>.mp4`

## Posting
4 a day: 09:00, 12:00, 15:00, 19:30 America/Chicago. YouTube + Instagram only (no TikTok, no Facebook). autoPublish true.
Caption: hook + emoji · blank · "🖼️ <Product name> — get the print, link in bio" · "🛒 artpicstudio.myshopify.com" · blank · 5-7 hashtags
(#art #drawing #wallart #artprint #animation #shorts + one topic tag). First comment: "🖼️ Get this print: <product link>".
YouTube short, title "<hook> #shorts", madeForKids false, category ENTERTAINMENT. Instagram REEL, showReelOnFeed true, isAiGenerated true.
Never mention Gumroad, planners, Nah-You, Skool or courses. No real people, celebrities, athletes, team names or logos.

## Log
| id | channel | poster | hook |
|---|---|---|---|
| ar01 | Rep Atlas (sample) | net | He turned one pencil into wall art |
| atts01 | Satisfy Lab (test, not posted) | golden | She drew the sunset you wish you saw |
