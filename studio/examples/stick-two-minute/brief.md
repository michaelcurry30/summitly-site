# Brief — stick-two-minute ("THE 2-MINUTE RULE")

| Field | Answer |
|---|---|
| **Who watches** | Students and young adults on TikTok / Reels / Shorts, often sound-off; also readers of a habits ebook channel. Brand-neutral: no app, no store, no logo. |
| **Where it plays** | Vertical phone feed 9:16. Captions carry every spoken line. Safe zone: words and the ninja's face inside x 120–960, y 240–1260; no words at x > 780 below y 840; nothing important in the bottom 660 px. |
| **How long** | 29.5 s, 1080×1920, 30 fps, with VO (Kokoro af_heart 1.08; the ninja's "Nope." in the blend am_michael 0.6 + am_puck 0.4), music and SFX. |
| **Lead with** | Frame 0 = thumbnail: "NOT TOO HARD. / TOO BIG." over the stick ninja straining under a giant physical word "READ 50 PAGES". |
| **Use my files** | No source files. Numbers on screen only where ledgered in storyboard.md: "2-MINUTE" (James Clear, *Atomic Habits*, 2018, ch. 13 "The Two-Minute Rule"; origin David Allen, *Getting Things Done*, 2001), "1 PAGE" (Clear's own example "Read one page"), "50 PAGES" and the "DAY n" counters are illustrative story props, not statistics. |
| *Look* | STICK_BIBLE.md: dark cinematic flats (library, bedroom at night, a calm void with a calendar, mountain dawn, city rooftop), cyan #3ee6ff + orange #ffb36b, Big Shoulders Display 800 / IBM Plex Mono / Hanken Grotesk. Built on `kit/stick.js`. No blur, no confetti. |

## Story (one idea)
Problem: a huge goal ("READ 50 PAGES") crushes him on day one → struggle: by day two it's "LATER" → turn: he slices LATER and uses the two-minute rule, shrinking the habit to "READ 1 PAGE" → payoff: he does it every day, the book stack grows into a tower. Lesson line: "MAKE IT SO SMALL / YOU CAN'T SAY NO." Sign-off: "FOLLOW FOR MORE".

## Assumptions
- On-screen the lesson line is 8 words; when "FOLLOW FOR MORE" arrives the first half ("MAKE IT SO SMALL") steps aside so no more than 8 words are on screen.
- The physical words (READ 50 PAGES, LATER, READ 1 PAGE) and calendar sheets are canvas props; captions are DOM text and pass `check_overlap`.
