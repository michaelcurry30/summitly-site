# Summitly sound kit (`kit/sound/`)

Adds voiceover, an original music bed and SFX to a silent render, then masters and muxes it. Every sound is
generated in the container: Kokoro TTS (Apache-2.0) for the voice, numpy for the music and SFX. There are no
samples and no licences to track.

```
kit/sound/
  mix.py      CLI: measure | mix | sfx | voices
  music.py    procedural music bed (hype / chill)
  sfxgen.py   procedural SFX library -> sfx/<name>_<1..3>.wav + sfx/index.json
  dsp.py      shared numpy/scipy DSP helpers
  sfx/        rendered SFX (re-render with `python3 kit/sound/mix.py sfx`)
```

## Workflow (run from the workspace `mv/`)

1. **Write the script first** in `<project>/sound.json` (format below). Use short, punchy sentences with
   punctuation; "..." gives Kokoro a beat.
2. **Measure:** `python3 kit/sound/mix.py measure <project>` synthesizes each line (cached in
   `<project>/.sound/`) and prints its start, duration, end and the gap to the next line. It warns on
   overlaps and when the first line starts after 0.5 s.
3. **Fit the scenes to the voice.** Put the measured times into `SCENES` / `T` in `index.html` *before*
   you build the visuals. Each headline appears when its words are spoken. To find a word inside a line,
   look for the silent gaps in the cached `vo_*.wav`.
4. **Render** the silent video: `node render.mjs <project>`.
5. **Mix:** `python3 kit/sound/mix.py mix <project>` writes `out/<project>-sound.mp4` and prints a QC block,
   for example:
   `QC loudness -14.0 LUFS (ok) true peak -2.1 dBFS (ok)` and `durations video 20.000s audio 20.000s (equal)`.
   The run ends with `OK <path>`; it exits with code 2 if QC fails. The stems are kept in
   `<project>/.sound/`: `vo.wav`, `bed.wav`, `sfx.wav` and `premix.wav`.

## sound.json

```json
{
  "voice": "af_heart",
  "speed": 1.08,
  "vo": [
    {"t": 0.15, "text": "If I open TikTok... my ninja falls."},
    {"t": 3.15, "text": "So I press start.", "speed": 1.05, "gain": 0}
  ],
  "sfx": [
    {"t": 3.0,  "name": "whoosh_short", "gain": -6},
    {"t": 11.95, "name": "slice", "gain": -3, "v": 2, "pitch": -1},
    {"t": 16.85, "name": "sting", "gain": -1}
  ],
  "music": {"mood": "hype", "bpm": 118, "key": "A minor", "hit": 16.8, "stops": [[9.25, 10.95]], "gain": -9}
}
```

**Voice**
- `voice` takes a Kokoro id or a blend.
  - Default is `af_heart` (grade A).
  - Male options: `am_michael`, `am_puck`, `am_fenrir`.
  - Blend syntax: `"blend:am_michael:0.6,am_puck:0.4"`. This takes a weighted sum of the voice style vectors.
  - **`am_adam` is banned** (rated F+); the kit refuses it.
- `speed` is usually 1.05 to 1.12.
- Each line can override `speed` and `voice`, and set `gain` in dB.

**VO polish chain** (applied automatically), in order:
1. `highpass 80`
2. presence EQ: +2.5 dB at 3.5 kHz, -1.5 dB at 220 Hz
3. `deesser`
4. `acompressor` 3:1
5. a tiny room (`aecho 18 ms`)

**SFX cue fields**
- `t`: time in seconds.
- `name`: one of the sounds listed below.
- `gain`: dB, default -4.
- `v`: which variant to use (1 to 3). Without it, repeated cues cycle through the variants.
- `pitch`: semitones.
- `align` (default depends on the sound):
  - `start` (most sounds): the sound starts at `t`.
  - `cut` (whooshes): the whoosh's loudest moment lands **0.10 s before** `t`. Give the cut time and the kit
    puts the whoosh 80 to 120 ms early.
  - `end` (riser): the sound ends exactly at `t`, so put the riser's `t` on the moment it builds to.
  - `peak`: the loudest moment lands on `t`.

  Impacts belong exactly **on** the cut or hit (`start`).

**Music**
- `mood`:
  - `hype` (110 to 128 bpm, default 118): four-on-the-floor, clap, hats, offbeat pluck bass with sub,
    pumping supersaw pad, and a 3-3-2 pluck hook with ping-pong delay.
  - `chill` (85 to 95 bpm, default 90): swung groove, FM e-piano 7th chords, sine sub and a bell hook.
- `key`: for example `"A minor"`, `"C major"` or `"F#m"`. Minor keys use the i-VI-III-VII progression; major
  keys use I-V-vi-IV.
- `hit`: a downbeat lands exactly here, normally the end-card start. The bar before it gets a fill; the hit
  gets a crash and a big chord, then a sparse outro.
- `stops`: the bed drops to 10 % in these windows. Use it for a comedic "record stop", such as a fall.
- `gain`: bed level in dB, default -9.

The bed always matches the video length exactly, with a 0.3 s fade-in and a 1.2 s fade-out. In the mix it is
ducked under the VO (`sidechaincompress` threshold 0.03, ratio 8, attack 20 ms, release 350 ms).

**Master**
1. `amix normalize=0`
2. `alimiter 0.89`
3. two-pass `loudnorm I=-14 TP=-2 LRA=11 linear=true`
4. AAC 192 kbps, 48 kHz; the video stream is copied, not re-encoded

QC accepts -15 to -13 LUFS, a true peak of -1 dBFS or lower, and audio length equal to video length.

## SFX library (3 variants each, `sfx/<name>_<v>.wav`)

| name | use |
|---|---|
| `whoosh_short` / `whoosh_long` | scene cuts, fast moves (align `cut`) |
| `shing` | katana draw, metallic ring |
| `slice` | the cut itself (pair with `impact_hard` -8 dB) |
| `impact_soft` / `impact_hard` | landings, the phone arriving, big hits |
| `pop` | chips and badges popping in |
| `ui_tap` | toggles, button presses |
| `chime_up` | success, a toggle switching on, a level-up |
| `riser` | build into a reveal (align `end`) |
| `rewind` | tape-rewind chatter for a rewind effect |
| `notif_ding` | generic notification arriving |
| `flag_plant` | flag planted on the summit |
| `hop` / `land` | ninja jump take-off and landing |
| `uhoh` | worried wobble |
| `fall` | slide-whistle fall plus whoosh |
| `sting` (alias `logo_sting`) | **SIGNATURE**: katana shing plus a two-note rising bell (E5 to B5), about 1.3 s. Put it on **every end card**, at the end-card start. |

## Rules

- **VO starts within the first 0.5 s.** The hook is spoken while it is on screen in frame 0.
- **Every VO line is also on screen** as a headline, kicker or chip, with the same words or close enough to
  read the same. The ad must be fully understandable with the sound off; sound only adds to it.
- Keep the script at **2.5 words per second of video or fewer** (about 50 words for 20 s), with short lines
  and air between them. Measure, then fit the scenes; don't time-stretch the voice.
- One SFX per key action (hop, land, wobble, fall, rewind, slash, plant, pop). Whooshes come just before a
  cut, impacts land on it, and `sting` goes on the end card.
- Leave space around the VO: keep SFX gains at -6 dB or lower while someone is speaking, unless the sound is
  the punchline (the slash).
- Never use real brand sounds or jingles, and never use a cloned real person's voice.

**Master (update):** after the two-pass loudnorm the chain now adds `lowpass=16.5k` and a 4x-oversampled
`alimiter` at 0.63 (≈ -4 dBFS sample peak), so sharp transients (the word-cut `slice`, `sting`) can no longer push the
AAC true peak over -1 dBTP. Integrated loudness stays inside -15…-13 LUFS (≈ -14.5).
**Pronunciation:** `kit/sound/lexicon.json` (empty `{}` for now) adds entries to the built-in lexicon in `mix.py`.
Checked with espeak phonemes: "Summitly" → sˈʌmɪtli (SUM-it-lee), "App Store" → ˈæp stˈɔːɹ — both correct, no entry needed.
