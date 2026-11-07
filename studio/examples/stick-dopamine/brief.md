# Brief — stick-dopamine ("YOUR BRAIN ON 'ONE MORE VIDEO'")

| Field | Answer |
|---|---|
| **Who watches** | Students and young adults scrolling TikTok / Reels / Shorts on a phone, often with the sound off; also readers of a habits ebook channel. Brand-neutral: no app, no store, no logo. |
| **Where it plays** | Vertical phone feed 9:16. Captions carry every spoken line. Safe zone: words and the ninja's face inside x 120–960, y 240–1260; no words at x > 780 below y 840; nothing important in the bottom 660 px. |
| **How long** | 27.5 s, 1080×1920, 30 fps, with VO (Kokoro af_heart 1.08; the ninja's two lines in the blend am_michael 0.6 + am_puck 0.4), music and SFX. |
| **Lead with** | Frame 0 = thumbnail: "YOUR BRAIN ON / “ONE MORE VIDEO”" over the stick ninja hunched at his desk at night, phone glowing on his glazed face, thumb mid-swipe. |
| **Use my files** | No source files. Only pop-science framing ("quick dopamine hit"), no statistics, no numbers on screen (see the numbers ledger in storyboard.md). |
| *Look* | STICK_BIBLE.md: dark navy cinematic flats (bedroom at night, inside the feed, city rooftop, mountain dawn, library), cyan #3ee6ff + orange #ffb36b, Big Shoulders Display 800 headlines, IBM Plex Mono kickers, Hanken Grotesk chips. Built on `kit/stick.js`. No blur, no confetti. |

## Story (one idea)
Problem: he can't stop swiping (meter spikes and crashes) → struggle: real work feels boring, "just one more…" → turn: he snaps out and slices the word TIKTOK → payoff: phone away, the meter settles, deep work pulls him in. Lesson line: "BOREDOM IS WHERE FOCUS STARTS." Sign-off: "FOLLOW FOR MORE".

## Assumptions
- "TikTok" appears only as a plain word (a physical word prop that gets sliced), never as a logo or UI.
- The physical words the ninja interacts with ("JUST ONE MORE", "TIKTOK") are props drawn on the canvas (objects in the scene, like a screenshot). Captions are DOM text and pass `check_overlap`.
