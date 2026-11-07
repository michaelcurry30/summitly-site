#!/usr/bin/env python3
"""mix.py - Summitly sound kit: voiceover (Kokoro) + procedural music bed + SFX -> mastered MP4.

Run from the workspace (mv/):
    python3 kit/sound/mix.py measure <project>   # synth each VO line, print durations -> fit SCENES to the voice
    python3 kit/sound/mix.py mix <project>       # (default) build out/<project>-sound.mp4 + QC
    python3 kit/sound/mix.py sfx                 # re-render the SFX library (kit/sound/sfx/)
    python3 kit/sound/mix.py voices              # list Kokoro voice ids

Cue file <project>/sound.json (see README.md):
{
  "voice": "af_heart",                 # or "blend:am_michael:0.6,am_puck:0.4"   (never am_adam)
  "speed": 1.08,
  "cast":  {"NINJA": {"voice": "blend:am_michael:0.6,am_puck:0.4", "speed": 1.05}},   # optional per-character voices
  "vo":    [{"t": 0.15, "text": "If I open TikTok... my ninja falls."}, ...],   # optional per line: who, voice, speed, gain
  "sfx":   [{"t": 3.1, "name": "whoosh_short", "gain": -4}, ...],               # optional: v, align, pitch
           # or a project-local wav: {"t": 4.0, "file": "assets/sfx/rain.wav", "gain": -10}
  # "music" may also be a list of beds: [{"mood": "chill", "from": 0, "to": 12}, {"mood": "hype", "from": 12, "hit": 26}]
  "music": {"mood": "hype", "bpm": 118, "key": "A minor", "hit": 16.6, "stops": [[8.2, 9.4]], "gain": -9}
}
Input video: out/<project>.mp4 (silent render). Output: out/<project>-sound.mp4 (video stream copied,
AAC 192k 48 kHz, two-pass loudnorm -14 LUFS / TP -2, music ducked under the VO with sidechaincompress).
"""
import hashlib
import json
import os
import re
import subprocess
import sys

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from dsp import SR, read_wav, write_wav, place, pitch_shift  # noqa: E402

WS = os.path.abspath(os.path.join(HERE, '..', '..'))          # workspace (mv/)
TTS_MODEL = os.environ.get('KOKORO_MODEL', '/home/claude/tts/kokoro.onnx')
TTS_VOICES = os.environ.get('KOKORO_VOICES', '/home/claude/tts/voices.bin')
BANNED_VOICES = {'am_adam'}
SFX_DIR = os.path.join(HERE, 'sfx')
DEFAULT_ALIGN = {'whoosh_short': 'cut', 'whoosh_long': 'cut', 'riser': 'end', 'rewind': 'start'}
LEAD = 0.10   # whoosh peak lands this long before the cut


def die(msg):
    print('MIX FAILED: ' + msg, file=sys.stderr)
    sys.exit(1)


def run(cmd, capture=False):
    r = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if r.returncode != 0:
        die(' '.join(cmd[:6]) + ' ...\n' + r.stderr[-2000:])
    return r.stderr if capture else r


def proj_paths(project):
    pdir = project if os.path.isabs(project) else os.path.join(WS, project)
    pdir = os.path.abspath(pdir)
    name = os.path.basename(pdir.rstrip('/'))
    cache = os.path.join(pdir, '.sound')
    os.makedirs(cache, exist_ok=True)
    return pdir, name, cache


def load_cues(pdir):
    p = os.path.join(pdir, 'sound.json')
    if not os.path.exists(p):
        die(f'{p} not found')
    with open(p) as fh:
        return json.load(fh)


# ------------------------------------------------------------------ voice
_K = None


def kokoro():
    global _K
    if _K is None:
        from kokoro_onnx import Kokoro
        _K = Kokoro(TTS_MODEL, TTS_VOICES)
    return _K


def resolve_voice(spec):
    spec = spec or 'af_heart'
    if spec.startswith('blend:'):
        parts = [p.split(':') for p in spec[6:].split(',')]
        tot = sum(float(w) for _, w in parts)
        style = None
        for v, w in parts:
            if v in BANNED_VOICES:
                die(f'voice {v} is banned (rated F+)')
            s = kokoro().get_voice_style(v) * (float(w) / tot)
            style = s if style is None else style + s
        return style
    if spec in BANNED_VOICES:
        die(f'voice {spec} is banned (rated F+); use af_heart or a blend')
    return spec


# Pronunciation fixes: espeak (used by Kokoro) gets some words wrong.
# kit/sound/lexicon.json maps the WRONG phoneme string -> the RIGHT one (applied to the whole line).
# Add an entry whenever a word sounds wrong; check with:  python3 kit/sound/mix.py say "<text>"
LEXICON_DEFAULT = {
    "dˈɑːpɐmˌiːn": "dˈoʊpəmˌiːn",       # dopamine: DOH-puh-meen, not DAH-puh-meen
    "jˈuːs ðə": "jˈuːz ðə",              # "Use the ..." (verb) -> yooz
    "jˈuːs ɪt": "jˈuːz ɪt",
    "jˈuːs ɪɾ": "jˈuːz ɪɾ",
    "jˈɛss": "jˈɛs",                     # "Yesss"
}


def _lexicon():
    lex = dict(LEXICON_DEFAULT)
    p = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'lexicon.json')
    if os.path.exists(p):
        lex.update(json.load(open(p)))
    return lex


def fix_pronunciation(text):
    """returns a corrected phoneme string if any lexicon entry applies, else ''"""
    ph = kokoro().tokenizer.phonemize(text, 'en-us')
    new = ph
    for wrong, right in _lexicon().items():
        new = new.replace(wrong, right)
    return new if new != ph else ''


def synth_line(cache, text, voice, speed):
    """returns mono float64 at 48 kHz (cached)"""
    phon = fix_pronunciation(text)
    key = hashlib.sha1(json.dumps([text, voice, round(speed, 4), 'v2', phon]).encode()).hexdigest()[:16]
    path = os.path.join(cache, f'vo_{key}.wav')
    if not os.path.exists(path):
        from scipy.signal import resample_poly
        if phon:
            audio, sr = kokoro().create(phon, voice=resolve_voice(voice), speed=speed, lang='en-us', is_phonemes=True)
        else:
            audio, sr = kokoro().create(text, voice=resolve_voice(voice), speed=speed, lang='en-us')
        a = np.asarray(audio, np.float64)
        if sr != SR:
            from math import gcd
            g = gcd(sr, SR)
            a = resample_poly(a, SR // g, sr // g)
        # trim residual silence (-45 dB) at both ends, keep 15 ms
        thr = 10 ** (-45 / 20) * max(1e-6, np.abs(a).max())
        nz = np.nonzero(np.abs(a) > thr)[0]
        if len(nz):
            a = a[max(0, nz[0] - int(.015 * SR)): nz[-1] + int(.015 * SR)]
        write_wav(path, a)
    return read_wav(path)[:, 0]


def line_voice(cues, ln):
    """voice + speed for one vo item. Precedence: the item's own "voice"/"speed", then its "who" entry in the
    top-level "cast" map ({"NINJA": {"voice": ..., "speed": ...}}), then the top-level "voice"/"speed"."""
    voice, speed = cues.get('voice', 'af_heart'), float(cues.get('speed', 1.08))
    who = ln.get('who')
    if who is not None:
        cast = cues.get('cast') or {}
        if who not in cast:
            die(f"vo line '{ln.get('text', '')[:30]}': who='{who}' is not in \"cast\" ({', '.join(cast) or 'empty'})")
        voice, speed = cast[who].get('voice', voice), float(cast[who].get('speed', speed))
    return ln.get('voice', voice), float(ln.get('speed', speed))


def vo_lines(cues, cache):
    out = []
    for i, ln in enumerate(cues.get('vo', [])):
        voice, speed = line_voice(cues, ln)
        a = synth_line(cache, ln['text'], voice, speed)
        out.append(dict(i=i, t=float(ln['t']), text=ln['text'], audio=a, dur=len(a) / SR, gain=float(ln.get('gain', 0)),
                        who=ln.get('who', ''), voice=voice, speed=speed))
    return out


def words(text):
    return len(re.findall(r"[A-Za-z0-9']+", text))


def measure(project):
    pdir, name, cache = proj_paths(project)
    cues = load_cues(pdir)
    lines = vo_lines(cues, cache)
    print(f"VO for {name}: voice={cues.get('voice', 'af_heart')} speed={cues.get('speed', 1.08)}")
    multi = any(l['who'] or l['voice'] != lines[0]['voice'] for l in lines) if lines else False
    print(f"{'#':>2} {'start':>6} {'dur':>5} {'end':>6} {'gap':>5} {'w/s':>4}  " + ("who        " if multi else "") + "text")
    warn = []
    for k, l in enumerate(lines):
        end = l['t'] + l['dur']
        nxt = lines[k + 1]['t'] if k + 1 < len(lines) else None
        gap = (nxt - end) if nxt is not None else float('nan')
        wps = words(l['text']) / max(l['dur'], 1e-3)
        tag = f"{(l['who'] or l['voice'])[:10]:10s} " if multi else ''
        print(f"{k:>2} {l['t']:6.2f} {l['dur']:5.2f} {end:6.2f} {gap:5.2f} {wps:4.1f}  {tag}{l['text']}")
        if nxt is not None and gap < 0.05:
            warn.append(f'line {k} overlaps line {k + 1} by {-gap:.2f}s')
        if wps > 4.0:
            warn.append(f'line {k} is fast ({wps:.1f} words/s, spoken); keep scripts <= 2.5 words/s of screen time')
    if lines and lines[0]['t'] > 0.5:
        warn.append('first VO line starts after 0.5 s')
    total = sum(words(l['text']) for l in lines)
    if lines:
        print(f"total {total} words, VO {lines[0]['t']:.2f}-{lines[-1]['t'] + lines[-1]['dur']:.2f}s, summed speech {sum(l['dur'] for l in lines):.2f}s")
    for w in warn:
        print('WARN ' + w)
    return lines


# ------------------------------------------------------------------ sfx
def sfx_index():
    p = os.path.join(SFX_DIR, 'index.json')
    if not os.path.exists(p):
        import sfxgen
        sfxgen.render_all()
    with open(p) as fh:
        return json.load(fh)


def build_sfx(cues, dur, pdir=None):
    idx = sfx_index()
    buf = np.zeros((int(round(dur * SR)) + SR, 2))
    seen = {}
    placed = []
    for c in cues.get('sfx', []):
        if 'file' in c:                       # project-local sound: {"t", "file": "assets/sfx/rain.wav", "gain", "align"}
            fp = c['file'] if os.path.isabs(c['file']) else os.path.join(pdir or WS, c['file'])
            if not os.path.exists(fp):
                die(f"sfx file {fp} not found")
            x = read_wav(fp)
            semis = float(c.get('pitch', 0))
            if semis:
                x = pitch_shift(x, semis)
            t = float(c['t'])
            align = c.get('align', 'start')
            t0 = t - len(x) / SR if align == 'end' else t
            g = 10 ** (float(c.get('gain', -4)) / 20)
            place(buf, t0, x, g)
            placed.append((t0, os.path.basename(fp), os.path.basename(fp), align, c.get('gain', -4)))
            continue
        name = c['name']
        if name in ('logo_sting', 'signature'):
            name = 'sting'
        if name not in idx:
            die(f"unknown sfx '{name}'. Available: {', '.join(sorted(idx))}")
        n = seen.get(name, 0)
        seen[name] = n + 1
        vs = idx[name]
        meta = vs[(int(c['v']) - 1) % len(vs)] if 'v' in c else vs[n % len(vs)]
        x = read_wav(os.path.join(SFX_DIR, meta['file']))
        semis = float(c.get('pitch', 0))
        if semis:
            x = pitch_shift(x, semis)
        r = 2 ** (semis / 12)
        peak, length = meta['peak'] / r, len(x) / SR
        align = c.get('align', DEFAULT_ALIGN.get(name, 'start'))
        t = float(c['t'])
        if align == 'cut':
            t0 = t - LEAD - peak
        elif align == 'peak':
            t0 = t - peak
        elif align == 'end':
            t0 = t - length
        else:
            t0 = t
        g = 10 ** (float(c.get('gain', -4)) / 20)
        place(buf, t0, x, g)
        placed.append((t0, name, meta['file'], align, c.get('gain', -4)))
    return buf[:int(round(dur * SR))], placed


# ------------------------------------------------------------------ ffmpeg helpers
def probe_dur(path, stream='v:0'):
    r = run(['ffprobe', '-v', 'error', '-select_streams', stream, '-show_entries', 'stream=duration', '-of', 'csv=p=0', path])
    try:
        return float(r.stdout.strip().split('\n')[0])
    except ValueError:
        r = run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path])
        return float(r.stdout.strip())


def ebur(path):
    err = run(['ffmpeg', '-hide_banner', '-nostats', '-i', path, '-map', 'a:0', '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture=True)
    tail = err[err.rfind('Summary:'):]
    I = float(re.search(r'I:\s+(-?[\d.]+) LUFS', tail).group(1))
    LRA = float(re.search(r'LRA:\s+(-?[\d.]+) LU', tail).group(1))
    TP = float(re.search(r'Peak:\s+(-?[\d.inf]+) dBFS', tail).group(1))
    return I, TP, LRA


def mix(project):
    pdir, name, cache = proj_paths(project)
    cues = load_cues(pdir)
    video = os.path.join(WS, 'out', name + '.mp4')
    if not os.path.exists(video):
        die(f'{video} not found: render the silent video first (node render.mjs {name})')
    D = probe_dur(video)
    print(f'[mix] {name}: video {D:.3f}s')

    # 1. VO track (raw, placed), then polish chain in ffmpeg
    lines = vo_lines(cues, cache)
    vo = np.zeros((int(round(D * SR)) + SR, 2))
    for l in lines:
        if l['t'] + l['dur'] > D + 0.01:
            die(f"VO line {l['i']} ends at {l['t'] + l['dur']:.2f}s, after the video ({D:.2f}s)")
        place(vo, l['t'], l['audio'] / max(1e-6, np.abs(l['audio']).max()) * 0.7, 10 ** (l['gain'] / 20))
    for k in range(len(lines) - 1):
        if lines[k]['t'] + lines[k]['dur'] > lines[k + 1]['t'] + 0.02:
            print(f'  WARN VO line {k} overlaps line {k + 1}')
    vo_raw = os.path.join(cache, 'vo_raw.wav')
    write_wav(vo_raw, vo[:int(round(D * SR))])
    vo_wav = os.path.join(cache, 'vo.wav')
    run(['ffmpeg', '-v', 'error', '-y', '-i', vo_raw, '-af',
         'aformat=sample_rates=48000:channel_layouts=stereo,highpass=f=80,equalizer=f=3500:t=q:w=1.2:g=2.5,'
         'equalizer=f=220:t=q:w=1.0:g=-1.5,deesser,acompressor=threshold=-18dB:ratio=3:attack=5:release=80:makeup=2,'
         'aecho=0.8:0.5:18:0.08', '-c:a', 'pcm_f32le', vo_wav])

    # 2. music bed
    import music
    m = cues.get('music') or {}
    bed_wav = os.path.join(cache, 'bed.wav')
    if isinstance(m, list):
        # several beds, each {"mood", ..., "from": s, "to": s, "xfade": .5}: each is rendered for the full length
        # (so its bars stay on one grid) and windowed with equal-power crossfades centred on from / to.
        n = int(round(D * SR))
        bed = np.zeros((n, 2))
        tt = np.arange(n) / SR
        for b in m:
            x = music.render_bed(D, b.get('mood', 'hype'), b.get('bpm'), b.get('key', 'A minor'), b.get('hit'), b.get('stops', ()), int(b.get('seed', 1)))[:n]
            a, z, xf = float(b.get('from', 0)), float(b.get('to', D)), max(1e-3, float(b.get('xfade', .5)))
            w = np.clip((tt - (a - xf / 2)) / xf, 0, 1) if a > 0 else np.ones(n)
            if z < D:
                w = w * np.clip(((z + xf / 2) - tt) / xf, 0, 1)
            w = np.sin(w * np.pi / 2)
            bed[:len(x)] += x * w[:len(x), None] * 10 ** (float(b.get('gain', -9)) / 20)
        m = {'mood': '+'.join(b.get('mood', 'hype') for b in m), 'bpm': ''}
    elif m:
        bed = music.render_bed(D, m.get('mood', 'hype'), m.get('bpm'), m.get('key', 'A minor'), m.get('hit'), m.get('stops', ()), int(m.get('seed', 1)))
        bed *= 10 ** (float(m.get('gain', -9)) / 20)
    else:
        bed = np.zeros((int(round(D * SR)), 2))
    write_wav(bed_wav, bed)

    # 3. SFX track
    sfx, placed = build_sfx(cues, D, pdir)
    sfx_wav = os.path.join(cache, 'sfx.wav')
    write_wav(sfx_wav, sfx)

    # 4. premix: VO + ducked bed + SFX
    premix = os.path.join(cache, 'premix.wav')
    fc = (f"[0:a]aformat=sample_rates=48000:channel_layouts=stereo,apad,atrim=0:{D},asplit=2[vo][key];"
          f"[1:a]aformat=sample_rates=48000:channel_layouts=stereo,apad,atrim=0:{D}[mus];"
          f"[mus][key]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=350[duck];"
          f"[2:a]aformat=sample_rates=48000:channel_layouts=stereo,apad,atrim=0:{D}[sfx];"
          f"[vo][duck][sfx]amix=inputs=3:duration=first:normalize=0,alimiter=limit=0.89,atrim=0:{D}[mix]")
    run(['ffmpeg', '-v', 'error', '-y', '-i', vo_wav, '-i', bed_wav, '-i', sfx_wav, '-filter_complex', fc,
         '-map', '[mix]', '-c:a', 'pcm_f32le', premix])

    # 5. master: two-pass loudnorm, mux with the video copied
    err = run(['ffmpeg', '-hide_banner', '-nostats', '-i', premix, '-af', 'loudnorm=I=-14:TP=-2:LRA=11:print_format=json', '-f', 'null', '-'], capture=True)
    js = json.loads(err[err.rfind('{'):err.rfind('}') + 1])
    meas = (f"measured_I={js['input_i']}:measured_TP={js['input_tp']}:measured_LRA={js['input_lra']}:"
            f"measured_thresh={js['input_thresh']}:offset={js['target_offset']}")
    out = os.path.join(WS, 'out', name + '-sound.mp4')
    run(['ffmpeg', '-v', 'error', '-y', '-i', video, '-i', premix, '-filter_complex',
         f'[1:a]loudnorm=I=-14:TP=-2:LRA=11:{meas}:linear=true,lowpass=f=16500,aresample=192000,alimiter=limit=0.63:attack=0.5:release=60:level=false,aresample=48000,atrim=0:{D}[a]',   # 4x-oversampled safety limiter: true peak <= -1 dBTP
         '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000',
         '-movflags', '+faststart', out])

    # 6. QC
    I, TP, LRA = ebur(out)
    vd, ad = probe_dur(out, 'v:0'), probe_dur(out, 'a:0')
    print(f"[mix] VO lines {len(lines)}, SFX cues {len(placed)}, music {m.get('mood', '-')} {m.get('bpm', '')} bpm")
    for t0, nm, f, al, g in placed:
        print(f"      sfx {t0:6.2f}s  {f:22s} align={al:5s} gain={g}")
    ok_l = -15.0 <= I <= -13.0
    ok_p = TP <= -1.0
    ok_d = abs(vd - ad) <= 1.5 / 30 and abs(vd - D) < 0.01
    print(f"QC  loudness {I:.1f} LUFS ({'ok' if ok_l else 'OUT OF RANGE -15..-13'})  true peak {TP:.1f} dBFS "
          f"({'ok' if ok_p else 'TOO HOT > -1'})  LRA {LRA:.1f} LU")
    print(f"QC  durations video {vd:.3f}s audio {ad:.3f}s ({'equal' if ok_d else 'MISMATCH'})")
    print(('OK  ' if ok_l and ok_p and ok_d else 'QC FAILED  ') + out)
    if not (ok_l and ok_p and ok_d):
        sys.exit(2)


if __name__ == '__main__':
    a = sys.argv[1:]
    if not a:
        print(__doc__)
        sys.exit(1)
    if a[0] == 'measure':
        measure(a[1])
    elif a[0] == 'sfx':
        import sfxgen
        sfxgen.render_all()
        print('sfx rendered to', SFX_DIR)
    elif a[0] == 'voices':
        print(' '.join(sorted(kokoro().get_voices())))
    elif a[0] == 'mix':
        mix(a[1])
    else:
        mix(a[0])
