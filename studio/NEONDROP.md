# NEON DROP — GTA 6 news shorts (Metricool brand 8048779, was "Habit Dojo")

Michael switched this channel from the Habit Dojo ninja to **GTA 6 news / countdown / tips shorts** on 2026-11-14.
The ninja series and tip lists are retired. Old ninja posts in Metricool are **drafts** (draft: true): never publish them,
and treat a slot that only has a draft as EMPTY.

## Hard rules (legal)
- Original art only: the neon city / palms / pink car in `studio/neondrop/index.html`. **Never** use Rockstar's logo,
  key art, screenshots, trailer footage, character likenesses or the official "VI" logo style. "GTA 6" appears only as plain text in our own font.
- Every caption has the line `Unofficial fan channel. Not affiliated with Rockstar Games.`
- Facts only from sources found with web search that same run (official Rockstar Newswire / PlayStation / Xbox pages first,
  then major outlets: Forbes, IGN, GameSpot, TechRadar, Polygon). No leaks, no rumors stated as fact, no review scores you didn't verify.
  If something is a rumor, say "rumor" in the card and VO or skip it.

## Facts verified 2026-11-14 (re-check before reusing)
- Release Thu Nov 19 2026, midnight local time; U.S. storefronts key to Eastern: 12 AM ET / 11 PM CT Wed / 10 PM MT / 9 PM PT.
- PS5 + Xbox Series X|S. No PC announced. Not on PS4.
- Standard $79.99, Ultimate $99.99 (extra vehicles, weapons, apparel). Digital pre-orders: 1 month GTA+. Buy before Nov 20: Vintage Vice City Pack.
- Pre-load open since Nov 10; ~212 GB on PS5; boxed copies contain a download code, no disc.
- Setting: state of Leonida incl. Vice City; leads Jason and Lucia; rated M (17+).

## Video format (`studio/neondrop/`)
- `specs.json`: list of `{id:"ndNN", kicker, lines:[{vo, big, small, cta?}]}` — 5–6 lines, 16–24 s. Line 1 = hook (frame 0 is the thumbnail).
  Last line = CTA (`cta:1`, orange pill): "Follow for a new GTA 6 update every day." / "FOLLOW" / "DAILY GTA 6 NEWS", or a comment question.
  `big` ≤ ~12 characters, `small` ≤ ~32 characters, uppercase. Spell tricky names phonetically in `vo` only ("Lee-oh-nee-da", "Loo-see-ah"); write prices/sizes in words in `vo`.
- Build: `python3 vo.py ndNN` (Kokoro am_michael, speed 1.12 → `vo/ndNN.wav`, `t/ndNN.json`), serve studio/ on port 8766
  (`python3 -m http.server 8766` in studio/), `node rend.mjs ndNN ...`, `bash mux.sh ndNN` → `out/ndNN.mp4`.
  Check: one frame per line (`fr/ndNN/` mid-line frames) — text inside the frame, nothing overlapping.
- Publish: copy to `media/neondrop/ndNN.mp4`, commit + push, URL `https://raw.githubusercontent.com/michaelcurry30/summitly-site/main/media/neondrop/ndNN.mp4`.

## Posting
Slots 09:00 / 15:30 / 21:00 America/Chicago, Instagram REEL + YouTube short, autoPublish true, category GAMING.
Caption: `<hook> 🌴<emoji>` + newline + 1–2 sentences of the facts + newline + follow line + blank line +
`Unofficial fan channel. Not affiliated with Rockstar Games.` + newline + the Zero Frames CTA line + newline + `#gta6 #gtavi #gta #gaming` + 2 topic tags.
YouTube title: `<Hook In Title Case> #shorts`.

## Content ideas by phase
- Before Nov 19: daily countdown (N days), unlock times, editions, checklist, world/characters, platforms.
- Launch week: "it's out — first things to do", how to fix the download, how big the map is (only if officially stated), launch news.
- After launch: beginner tips, money tips, hidden features, official updates/patches, sales milestones, PC news — each sourced.

## Log
| id | topic | posted |
|---|---|---|
| nd01 | 5 days away: everything to know | 2026-11-14 15:30 |
| nd02 | unlock time by time zone | 2026-11-14 21:00 |
| nd03 | $80 or $100 edition | 2026-11-15 09:00 |
| nd04 | 4 things to do before launch | 2026-11-15 15:30 |
| nd05 | the world: Leonida, Jason & Lucia | 2026-11-15 21:00 |
| nd06 | 3 days left | 2026-11-16 09:00 |
