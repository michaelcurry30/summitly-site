# BAD HABIT CLUB — relatable comedy shorts (Metricool brand 8048779, was "Habit Dojo")

Michael switched this channel on 2026-11-14 to **funny relatable cartoon shorts** starring our own original character **Gus**
(peach skin, purple hair tuft, orange hoodie, navy pants). The ninja series and the GTA news format are retired for this brand.
Never copy another creator's character, art style, catchphrases or jokes. Every joke is original.

## Format (`studio/bhc/index.html`)
- 1080x1920, 30 fps, 18–25 s + the 3 s planner end card (`/home/claude/endcard/card.mp4`, rebuild from `card.html` + `vo.wav` if missing).
- Top caption box the whole time: a relatable "me:" / "my brain at 3 AM:" / "nobody: / me:" setup line with one emoji.
- 4–6 scenes that **escalate** to an absurd punchline (time skips, "3 WEEKS LATER", Gus turning into dust, a skeleton, etc.).
- Big pop labels for gags (`label()`), speech bubbles (`bubble()`), clocks, TV, office/boss, phone, fridge, bed, gym — add new props as small functions.
- Gus rig: `gus(x,y,scale,{pose,eyes,mouth,blood,bags,droop,twitch,armL,armR,look,stache,prop,...})` — exaggerated faces sell the joke.
- Lines boil at 8 fps (BOIL). Sound: `sound.py` = plucky music bed + kit SFX + custom (ALARM, BIRDS, BLAH, SCRATCH); add new custom SFX there.
- Add each episode as `EPn={dur,cap,sfx:[[t,'name'],...],draw(t)}` and register it in `EPS`.

## Topic bank (bad habits people relate to)
one more episode · "5 more minutes" snooze · doomscrolling in bed · opening the fridge every 10 min · "I'll start Monday" diet ·
gym membership never used · procrastinating then panicking at 11:59 PM · impulse buying at 2 AM · "just checking one notification" ·
leaving laundry in the washer · 47 browser tabs · forgetting water all day · new planner, abandoned by Feb 3 · reading 1 page then phone ·
"quick nap" becomes 4 hours · budgeting then ordering takeout.

## Build
1. Write EPn in index.html. Check stills: `node st.mjs epN <times>` (serve studio/ on port 8766 first: `python3 -m http.server 8766` in studio/).
2. `node rend.mjs epN out/epN_v.mp4` (pipes frames to ffmpeg).
3. Dump `{dur,sfx}` from the page to `out/epN.json`, `python3 sound.py "$(cat out/epN.json)" out/epN.wav`.
4. Concat video+audio with the end card (see bhc01 commit), → `media/bhc/bhcNN.mp4`, commit + push.
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
