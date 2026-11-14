# HABIT DOJO — THE SERIES (story episodes)

Habit Dojo (Metricool brand **8048779**, Instagram + YouTube) posts an episodic animated action series.
**One new episode every day at 15:30 America/Chicago.** (09:00 and 21:00 stay tip-list videos, see DOJO_BIBLE.md.)
Every episode: ~26–34 s, 1080×1920, 30 fps, narrator + character voices + music + SFX, ends on a cliffhanger
that names the next villain, then an end card "NEXT · EPISODE N · <VILLAIN>" + chip "FOLLOW SO YOU DON'T MISS IT".

## Cast (never change)
- **The Ninja** (hero) — kit stick ninja with the DOJO palette:
  `{ ink:'#17785a', ink2:'#11593f', rim:'#ffb36b', tail:'#ff8a2b', belt:'#ff8a2b', scab:'#0d3b2c', band:'#ff8a2b', band2:'#c9661b', mouth:'#0d3b2c', mouthIn:'#05060a' }`
  Voice: `blend:am_michael:0.6,am_puck:0.4`, speed 1.02.
- **The Master** — golden spirit ninja (SPIRIT palette, alpha .82, scale 1.6) in a warm void (`void`, bg #1a0f08, glow #ff8a2b);
  the ninja kneels (crouch). Voice `bm_george` speed 0.95. He always gives the habit technique (the lesson).
- **Narrator** — `am_michael` speed 1.08.
- Villain voices used so far: GOBLIN am_puck 1.18 · OGRE am_onyx 0.82 · PHANTOM bf_isabella 0.86 · SLIME am_puck 1.28 · TITAN am_onyx 0.8 · SHOGUN am_fenrir 0.84.

## Episode recipe (copy the newest `studio/dojo-epNN/` folder and edit)
Beats: 1 hook (title card over villain + ninja, frame 0 = thumbnail) → 2 setup → 3 villain attacks (villain line) →
4 consequence → 5 ninja frustrated line → 6 Master gives the technique (2–3 kin cards) → 7 ninja applies it →
8 villain protests → 9 **sword slash cutting the villain's catchword** (kit wordcut, rooftop) + ninja one-word line →
10 victory + narrator states the result → 11 villain cliffhanger line naming the NEXT villain → 12 end card.
Workflow per episode:
1. `sound.json` (cast + vo lines) → `python3 kit/sound/mix.py measure dojo-epNN` → re-time lines back to back (0.2–0.3 s gaps) → set SCENES to the timings.
2. `index.html`: helper block (glow, villain drawers) is copied from previous episodes; each new villain gets its own canvas drawer function.
   Call `document.fonts.load('800 40px BS')` right after `S.stage()` when canvas text is drawn.
3. Stills check (look at them), then `node kit/check_overlap.mjs dojo-epNN --step 0.0333` must print OK
   (usual fix: end a kin card 0.1–0.2 s earlier so its fade doesn't overlap the next card or a scene cut).
4. Add SFX list (whoosh on cuts, pop on appearances, shing+slice on the cut, impact_hard on the villain reveal, riser before it), `music.hit` = slash time.
5. `node render.mjs dojo-epNN` then `python3 kit/sound/mix.py mix dojo-epNN` (QC must say OK; if true peak too hot lower slice/impact gains by 3 dB).
   A render "not a pure function of t: frames at 0.00s" warning alone is a known first-frame flake; check frame 0 of the mp4 looks right and continue.
6. Copy `out/dojo-epNN-sound.mp4` to `media/dojo-series/dojo-epNN.mp4`, commit + push, verify the raw URL returns 200:
   `https://raw.githubusercontent.com/michaelcurry30/summitly-site/main/media/dojo-series/dojo-epNN.mp4`
7. Schedule on Metricool brand 8048779 at 15:30 America/Chicago (replace the tip-list post in that slot if there is one, else create):
   instagram REEL (showReelOnFeed true, isAiGenerated false) + youtube short (title "Habit Dojo Ep. N: <Title> #shorts", category FILM_ANIMATION, madeForKids false), autoPublish true.
   Caption: `Episode N: <Title> 🥷<emoji>\n<2 sentence story hook + the master's lesson>\nEpisode N+1 drops tomorrow. Follow so you don't miss it 👀\n\n🎬 Made with AI. Learn to make videos like this: Zero Frames course, FREE for the first 10 members (then $49/mo) → link in bio\n#habitdojo #ninja #animation #series <3 topic tags>`
   First comment: `🎬 Learn how I make these videos. Zero Frames course, FREE for the first 10 members (then $49/mo): skool.com/zero-frames-7491/about`
   (If the course has switched to paid, use the same CTA lines the other Habit Dojo posts use at that time.)
8. Append the episode to the log below and commit.

## Season 1 — "The Shogun's Monsters" (DONE)
| Ep | Title | Lesson | Catchword cut | Posted |
|---|---|---|---|---|
| 1 | The Scroll Goblin | phone in another room | ONE MORE | 2026-11-14 |
| 2 | The Snooze Ogre | alarm across the room, feet on the floor, 5-4-3-2-1 | SNOOZE | 2026-11-15 |
| 3 | The Later Phantom | 2-minute start | LATER | 2026-11-16 |
| 4 | The Sugar Slimes | hide the candy, fruit in sight | JUNK | 2026-11-17 |
| 5 | The Couch Titan | lay out clothes, then just 10 minutes | COUCH | 2026-11-18 |
| 6 | The Shadow Shogun (finale) | never miss twice | QUIT | 2026-11-19 |
Finale ends with the Shogun's cracked mask re-igniting: "This isn't over, ninja. Season two."

## Season 2 — "The Shogun's Return" (NEXT: start at S2 Ep 1 on 2026-11-20)
The Shogun rebuilds his clan with *mind* monsters. Episode numbering restarts: kicker "HABIT DOJO · SEASON 2 · EPISODE N".
| Ep | Villain | Attack | Master's technique | Catchword |
|---|---|---|---|---|
| 1 | The Doubt Demon (whispering shadow with many mouths) | "you can't" self-talk | add "yet" + write one win every night | CAN'T |
| 2 | The Comparison Clone (mirror copy of the ninja that's always ahead) | comparing to others online | compare only to yesterday's you | THEM |
| 3 | The Burnout Beast (smoking iron bull) | training too hard, no rest | rest is training: schedule a rest day | MORE |
| 4 | The Money Moth (glowing moth that eats coins) | impulse buying | the 24-hour rule | BUY |
| 5 | The Night Owl Wraith (owl ghost with screen eyes) | staying up late | screens off one hour before bed, same bedtime | 1 AM |
| 6 | The Excuse Imp (tiny devil with a list) | "I'm too busy" | schedule it like a meeting | BUSY |
| 7 | Finale: The Shogun's Mirror | the ninja doubts who he is | identity: "I am someone who shows up" | QUIT (mirror shatters) → tease Season 3 |
After Season 2, plan Season 3 the same way (6–7 villains, each = one habit lesson, finale ties back to the Shogun) and add it here.

## Episode log
(append: season, ep, title, date, media file)
- S1E1–S1E6: media/dojo-series/dojo-ep01.mp4 … dojo-ep06.mp4
