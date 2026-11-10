#!/usr/bin/env python3
"""music.py - original, procedurally synthesized music bed (numpy only, no samples).

    python3 kit/sound/music.py <out.wav> <duration_s> [hype|chill] [bpm] ["A minor"] [hit_s]

As a module: render_bed(duration, mood='hype', bpm=None, key='A minor', hit=None, stops=(), seed=1)
  - exactly `duration` seconds, stereo 48 kHz float, 0.3 s fade-in, 1.2 s fade-out, peak -1 dBFS
  - hype  (default 118 bpm, clamp 110-128): four-on-the-floor kick, clap 2/4, 8th/16th hats, offbeat
            pluck bass + sub, supersaw pad with sidechain pump, 3-3-2 pluck hook with ping-pong delay
  - chill (default 90 bpm, clamp 85-95): swung lo-fi pop groove, FM e-piano 7th chords, sine sub,
            soft bell hook, light pump
  - hit:   a downbeat is placed exactly on this time (use the end-card start). One bar before it a
           snare fill + filter lift; on it a crash + big chord, then a sparse outro.
  - stops: [[a, b], ...] the bed drops to ~10 % between a and b (a comedic "record stop" moment)
  - calm  (default 72 bpm, clamp 64-80; Quiet Progress): felt-piano 8th arpeggio, sparse high piano melody with
            delay, warm detuned pad, soft sub; no drums. seed picks progression rotation + arpeggio pattern.
"""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from dsp import (SR, tt, hz, env_ad, fade, fm_sine, noise, bp, lp, hp, stereo, reverb, delay,
                 soft_clip, norm_peak, write_wav, place)

PCS = {'C': 0, 'C#': 1, 'DB': 1, 'D': 2, 'D#': 3, 'EB': 3, 'E': 4, 'F': 5, 'F#': 6, 'GB': 6, 'G': 7,
       'G#': 8, 'AB': 8, 'A': 9, 'A#': 10, 'BB': 10, 'B': 11}


def parse_key(key):
    """'A minor' | 'C major' | 'Am' | 'F#m' | 'Eb'"""
    s = (key or 'A minor').strip()
    parts = s.split()
    note = parts[0]
    if len(parts) == 1 and len(note) > 1 and note.endswith('m'):
        return PCS[note[:-1].upper()], True
    q = parts[1].lower() if len(parts) > 1 else 'major'
    return PCS[note.upper()], q.startswith('min') or q == 'm'


def progression(pc, minor, sevenths=False):
    """4 chords: (root midi in bass octave, [chord tone pcs as midi near 60])"""
    if minor:
        degs = [(0, 'min'), (8, 'maj'), (3, 'maj'), (10, 'maj')]          # i VI III VII
    else:
        degs = [(0, 'maj'), (7, 'maj'), (9, 'min'), (5, 'maj')]           # I V vi IV
    Q = {'min': [0, 3, 7], 'maj': [0, 4, 7]}
    Q7 = {'min': [0, 3, 7, 10], 'maj': [0, 4, 7, 11]}
    out, prev = [], None
    for off, q in degs:
        r = (pc + off) % 12
        ints = (Q7 if sevenths else Q)[q]
        tones = [(r + i) % 12 for i in ints]
        # choose voicing (each tone placed in 55..74) closest to the previous chord
        best = None
        for base in range(52, 66):
            v = sorted([base + ((tn - base) % 12) for tn in tones])
            if v[-1] > 76:
                continue
            c = abs(np.mean(v) - (np.mean(prev) if prev else 62))
            if best is None or c < best[0]:
                best = (c, v)
        prev = best[1]
        bass = 36 + ((r - 36) % 12)
        if bass < 40:
            bass += 12
        out.append((bass, prev))
    return out


# ------------------------------------------------------------------ instruments
def kick(punch=1.0, dec=0.28):
    t = tt(0.45)
    f = 47 + 125 * np.exp(-t / 0.028) + 30 * np.exp(-t / 0.006)
    y = fm_sine(f) * env_ad(len(t), 0.0015, dec)
    y += hp(noise(len(t), 3), 2500) * env_ad(len(t), 0.0003, 0.0025) * 0.35 * punch
    return soft_clip(y * 1.25, 1.6)


def clap(seed=0):
    t = tt(0.45)
    n = len(t)
    nz = bp(noise(n, 40 + seed), 900, 5200)
    e = np.zeros(n)
    for k, dt in enumerate((0.0, 0.009, 0.018)):
        e += np.where(t >= dt, np.exp(-(t - dt) / 0.0045), 0) * (0.7 + 0.15 * k)
    e += np.where(t >= 0.025, np.exp(-(t - 0.025) / 0.11), 0) * 0.55
    body = np.sin(2 * np.pi * 195 * t) * env_ad(n, 0.001, 0.05) * 0.45
    return nz * e + body


def snare_soft(seed=0):
    t = tt(0.35)
    n = len(t)
    y = bp(noise(n, 60 + seed), 1500, 7000) * env_ad(n, 0.001, 0.07) * 0.8
    y += np.sin(2 * np.pi * 210 * t) * env_ad(n, 0.001, 0.045) * 0.6
    return y


def hat(open_=False, seed=0):
    t = tt(0.3 if open_ else 0.08)
    n = len(t)
    y = hp(noise(n, 80 + seed), 7500, 2)
    # a little metallic ring
    for f in (8200, 10450, 12800):
        y += np.sign(np.sin(2 * np.pi * f * t)) * 0.08
    y = hp(y, 6000)
    return y * env_ad(n, 0.0005, 0.11 if open_ else 0.022) * 0.4


def crash():
    t = tt(2.2)
    n = len(t)
    y = hp(noise(n, 99), 3500) * env_ad(n, 0.001, 0.75) * 0.4
    for f in (3150, 4610, 5980, 7340):
        y += np.sin(2 * np.pi * f * t + f) * env_ad(n, 0.001, 0.5) * 0.06
    return y


def saw_note(f, d, cutoff=2500.0, bright_decay=None, amp_dec=None, att=0.004, rel=0.04, maxf=9000):
    """band-limited saw with a 4-pole-ish spectral rolloff at `cutoff`; optional brightness decay"""
    t = tt(d + rel)
    y = np.zeros_like(t)
    k = 1
    while k * f < maxf:
        fk = k * f
        w = 1.0 / (1 + (fk / cutoff) ** 4)
        a = w / k
        if a < 1e-4:
            break
        if bright_decay:
            y += a * np.exp(-t * (fk / bright_decay)) * np.sin(2 * np.pi * fk * t + 0.3 * k)
        else:
            y += a * np.sin(2 * np.pi * fk * t + 0.3 * k)
        k += 1
    e = np.clip(t / att, 0, 1)
    if amp_dec:
        e = e * np.exp(-t / amp_dec)
    e = e * np.clip((d + rel - t) / rel, 0, 1)
    return y * e


def epiano(f, d, vel=1.0):
    t = tt(d + 0.3)
    I = 1.6 * vel * np.exp(-t / 0.25) + 0.15
    y = np.sin(2 * np.pi * f * t + I * np.sin(2 * np.pi * f * t))
    y += 0.3 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t / 0.4)
    y += 0.15 * np.sin(2 * np.pi * 7 * f * t) * np.exp(-t / 0.02) * vel        # tine bark
    e = env_ad(len(t), 0.002, 1.2) * np.clip((d + 0.3 - t) / 0.3, 0, 1)
    return y * e * (1 + 0.12 * np.sin(2 * np.pi * 4.5 * t))


def bell(f, d, dec=0.6):
    t = tt(d)
    I = 1.8 * np.exp(-t / (dec * 0.3))
    return np.sin(2 * np.pi * f * t + I * np.sin(2 * np.pi * f * 2 * t)) * env_ad(len(t), 0.002, dec)


# ------------------------------------------------------------------ arranger
def render_bed(duration, mood='hype', bpm=None, key='A minor', hit=None, stops=(), seed=1):
    mood = (mood or 'hype').lower()
    if mood == 'calm':                       # Quiet Progress bed (render_calm, appended below)
        return render_calm(duration, bpm, key, hit, stops, seed)
    chill = mood == 'chill'
    bpm = float(bpm or (90 if chill else 118))
    bpm = min(95, max(85, bpm)) if chill else min(128, max(110, bpm))
    beat = 60.0 / bpm
    bar = 4 * beat
    s16 = beat / 4
    pc, minor = parse_key(key)
    prog = progression(pc, minor, sevenths=chill)

    pre = 0.0
    if hit is not None and 0 < hit < duration:
        pre = (bar - hit % bar) % bar
    total = pre + duration + 2.5
    nbars = int(np.ceil(total / bar))
    hit_bar = int(round((pre + hit) / bar)) if hit is not None and 0 < hit < duration else None
    end_bar = int((pre + duration) / bar)

    N = int(total * SR) + SR
    drums, bass_b, pad_b, lead_b, fx_b = (np.zeros((N, 2)) for _ in range(5))
    swing = 0.33 if chill else 0.0

    def st(b, step):
        """time of 16th step in bar b (with swing on odd 8ths for chill)"""
        tt_ = b * bar + step * s16
        if swing and step % 4 == 2:
            tt_ += s16 * swing
        return tt_

    K = kick(1.0, 0.3 if not chill else 0.22)
    CL = [clap(i) for i in range(3)]
    SN = [snare_soft(i) for i in range(3)]
    HC = [hat(False, i) for i in range(4)]
    HO = hat(True, 1)

    lead_rng = np.random.RandomState(seed)
    for b in range(nbars):
        r, chord = prog[b % 4]
        outro = hit_bar is not None and b >= hit_bar
        fill = hit_bar is not None and b == hit_bar - 1 or (b % 8 == 7 and not outro)
        # ---------------- drums
        if not chill:
            if not outro:
                for s in (0, 4, 8, 12):
                    place(drums, st(b, s), K, 1.0)
                for s in (4, 12):
                    place(drums, st(b, s), CL[(b + s) % 3], 0.55)
                for s in range(16):
                    if s % 2 == 0 and s % 4 != 0:
                        continue
                    v = 0.32 if s % 4 == 2 else 0.13
                    if s % 4 == 2:
                        place(drums, st(b, s), HO, 0.2)
                    place(drums, st(b, s), HC[s % 4], v)
                if fill:
                    for s in (13, 14, 15):
                        place(drums, st(b, s), SN[s % 3], 0.25 + 0.1 * (s - 13))
            else:
                if b == hit_bar:
                    place(drums, st(b, 0), K, 1.1)
                    place(fx_b, st(b, 0), stereo(crash(), 0, .7), 0.38)
                place(drums, st(b, 8), K, 0.55)
                for s in (2, 6, 10, 14):
                    place(drums, st(b, s), HC[s % 4], 0.12)
        else:
            if not outro:
                for s in (0, 7, 10):
                    place(drums, st(b, s), K, 0.85 if s == 0 else 0.6)
                for s in (4, 12):
                    place(drums, st(b, s), SN[(b + s) % 3], 0.5)
                for s in range(0, 16, 2):
                    place(drums, st(b, s), HC[s % 4], 0.2 if s % 4 == 2 else 0.12)
                if fill:
                    place(drums, st(b, 14), SN[1], 0.25)
                    place(drums, st(b, 15), SN[2], 0.3)
            else:
                if b == hit_bar:
                    place(drums, st(b, 0), K, 1.0)
                    place(fx_b, st(b, 0), stereo(crash(), 0, .7), 0.25)

        # ---------------- bass
        f0 = hz(r)
        if not chill:
            if not outro:
                for s in (2, 6, 10, 14) + ((15,) if b % 2 else ()):
                    m = r + (12 if s == 15 else 0)
                    nb = saw_note(hz(m), s16 * 1.6, cutoff=900, bright_decay=1600, amp_dec=0.22)
                    place(bass_b, st(b, s), stereo(nb), 0.55)
                for s in (0, 4, 8, 12):                               # sub on the beat (ducked by pump)
                    tt_ = tt(beat * 0.95)
                    sub = np.sin(2 * np.pi * hz(r - 12) * tt_) * np.clip(tt_ / 0.01, 0, 1) * np.clip((beat * 0.95 - tt_) / 0.03, 0, 1)
                    place(bass_b, st(b, s), stereo(sub), 0.35)
            else:
                tt_ = tt(bar * 0.98)
                sub = np.sin(2 * np.pi * hz(r - 12) * tt_) * np.exp(-tt_ / 1.2) * np.clip(tt_ / 0.01, 0, 1)
                place(bass_b, st(b, 0), stereo(sub), 0.45 if b == hit_bar else 0.25)
        else:
            if not outro:
                for s, ln in ((0, 6), (7, 3), (10, 6)):
                    tt_ = tt(s16 * ln)
                    sub = (np.sin(2 * np.pi * hz(r - 12) * tt_) + 0.15 * np.sin(4 * np.pi * hz(r - 12) * tt_)) * np.clip(tt_ / 0.01, 0, 1) * np.clip((s16 * ln - tt_) / 0.03, 0, 1)
                    place(bass_b, st(b, s), stereo(sub), 0.6)
            elif b == hit_bar:
                tt_ = tt(bar)
                place(bass_b, st(b, 0), stereo(np.sin(2 * np.pi * hz(r - 12) * tt_) * np.exp(-tt_ / 1.5)), 0.5)

        # ---------------- pad / chords
        if b <= end_bar + 1:
            if not chill:
                dur = bar * (2.0 if outro else 1.0)
                if not outro or b == hit_bar:
                    for i, m in enumerate(chord + ([chord[0] + 12] if outro else [])):
                        for v, (det, pan) in enumerate(((1.0, -0.7), (1.0045, 0.7), (0.9958, 0.0))):
                            cut = 2600 if not fill else 2600 + 2400 * 1
                            x = saw_note(hz(m) * det, dur, cutoff=cut, att=0.03, rel=0.25)
                            place(pad_b, st(b, 0), stereo(x, pan), 0.06)
            else:
                for s, vel in ((0, 1.0), (6, 0.7)) if not outro else ((0, 1.0),):
                    d = s16 * (6 if s == 0 else 10) if not outro else bar * 1.8
                    for i, m in enumerate(chord):
                        place(pad_b, st(b, s) + i * 0.008, stereo(epiano(hz(m), d, vel), -0.3 + 0.2 * i), 0.13)

        # ---------------- lead hook
        tones = sorted(chord)[:3]
        tones = [m + 12 for m in tones] + [tones[0] + 24]
        if not chill:
            if not outro:
                steps = (0, 3, 6, 8, 11, 14)
                idx = (0, 1, 2, 3, 2, 1) if b % 2 == 0 else (3, 2, 1, 2, 0, 1)
                for s, ix in zip(steps, idx):
                    x = saw_note(hz(tones[ix]), s16 * 1.4, cutoff=3200, bright_decay=2400, amp_dec=0.16, att=0.002, rel=0.05)
                    x += saw_note(hz(tones[ix]) * 1.007, s16 * 1.4, cutoff=3200, bright_decay=2400, amp_dec=0.16, att=0.002, rel=0.05) * 0.6
                    place(lead_b, st(b, s), stereo(x, 0.15 if s % 2 else -0.15), 0.16)
            elif b == hit_bar:
                for i, m in enumerate((tones[0], tones[1], tones[2], tones[3])):
                    x = saw_note(hz(m), beat * 1.2, cutoff=3000, bright_decay=2400, amp_dec=0.35, att=0.002)
                    place(lead_b, st(b, i * 2), stereo(x, -0.3 + 0.2 * i), 0.15)
        else:
            if not outro:
                motif = ((0, 3), (3, 2), (6, 1), (10, 2)) if b % 2 == 0 else ((0, 2), (4, 1), (8, 0), (12, 1))
                for s, ix in motif:
                    place(lead_b, st(b, s), stereo(bell(hz(tones[ix] + 12), 0.9), 0.2 if ix % 2 else -0.2), 0.12)
            elif b == hit_bar:
                for i, ix in enumerate((0, 1, 2, 3)):
                    place(lead_b, st(b, i * 2), stereo(bell(hz(tones[ix] + 12), 1.2)), 0.12)

    t = np.arange(N) / SR
    # sidechain pump on the tonal buses (beat-synced, derived from the grid, not from audio)
    ph = ((t % beat) / beat)
    depth = 0.25 if chill else 0.55
    pump = 1 - depth * np.clip(1 - ph / 0.45, 0, 1) ** 2
    if hit_bar is not None:
        pump = np.where(t >= hit_bar * bar + bar, 1 - (1 - pump) * 0.3, pump)
    pump = pump[:, None]

    lead_b = delay(lead_b, s16 * 3, fb=0.35, mix=0.28, n=4)[:N]
    lead_b = reverb(lead_b, 0.35, 1.8, 6500, tail=False)
    pad_b = reverb(pad_b, 0.3, 2.2, 5000, tail=False)
    drum_rev = reverb(drums, 0.12, 0.9, 6000, tail=False)
    fx_b = reverb(fx_b, 0.3, 2.0, 7000, tail=False)
    bass_b = lp(bass_b, 2500)

    G = dict(drums=0.8, bass=0.4, pad=1.4, lead=1.8) if chill else dict(drums=0.5, bass=0.6, pad=1.1, lead=1.9)
    if os.environ.get('MUSIC_DEBUG'):
        for nm, bb in (('drums', drum_rev * G['drums']), ('bass', bass_b * pump * G['bass']), ('pad', pad_b * pump * G['pad']), ('lead', lead_b * G['lead']), ('fx', fx_b)):
            print(f'  {nm:6s} rms {20*np.log10(np.sqrt((bb**2).mean())+1e-9):6.1f} dB  peak {20*np.log10(np.abs(bb).max()+1e-9):5.1f} dB')
    mix = drum_rev * G['drums'] + bass_b * pump * G['bass'] + pad_b * pump * G['pad'] + lead_b * (1 - (1 - pump) * 0.5) * G['lead'] + fx_b
    mix = hp(mix, 28)
    mix = soft_clip(mix * 1.2, 1.3)

    # crop to the requested window
    i0 = int(round(pre * SR))
    n = int(round(duration * SR))
    out = mix[i0:i0 + n].copy()
    tl = np.arange(n) / SR
    g = np.ones(n)
    for a, b2 in stops or ():
        down = np.clip((tl - a) / 0.05, 0, 1)
        up = np.clip((tl - b2) / 0.12, 0, 1)
        g *= 1 - 0.9 * down * (1 - up)
    out *= g[:, None]
    out = norm_peak(out, -1.0)
    fi, fo = int(0.3 * SR), int(1.2 * SR)
    out[:fi] *= np.linspace(0, 1, fi)[:, None]
    out[-fo:] *= np.linspace(1, 0, fo)[:, None] ** 1.5
    return out



# ------------------------------------------------------------------ calm (Quiet Progress): slow piano + warm pad, no drums
def piano(f, d, vel=0.8, seed=0):
    """soft felt-piano voice: inharmonic partials, per-partial decay, gentle hammer, release after d"""
    t = tt(d + 2.2)
    y = np.zeros_like(t)
    B = 0.00035
    for n in range(1, 9):
        fn = n * f * np.sqrt(1 + B * n * n)
        if fn > 9000:
            break
        a = (vel ** (0.6 + 0.25 * n)) / n ** 1.35
        tau = 2.6 / (n ** 0.7) * (220.0 / max(f, 110)) ** 0.35
        y += a * np.sin(2 * np.pi * fn * t + 0.3 * n) * np.exp(-t / tau)
    y += 0.02 * vel * lp(noise(len(t), 400 + seed), 1800) * np.exp(-t / 0.015)
    att = np.clip(t / 0.006, 0, 1)
    rel = np.clip((d + 0.6 - t) / 0.6, 0, 1)
    return y * att * (0.35 + 0.65 * rel) * np.clip((d + 2.2 - t) / 0.3, 0, 1)


def pad_voice(f, d, seed=0):
    t = tt(d + 1.6)
    y = np.zeros_like(t)
    for k, det in enumerate((-0.11, 0.0, 0.12)):
        ff = f * 2 ** (det / 12)
        y += np.sin(2 * np.pi * ff * t + k) + 0.18 * np.sin(4 * np.pi * ff * t + k) + 0.06 * np.sin(6 * np.pi * ff * t)
    e = np.clip(t / 1.4, 0, 1) ** 1.5 * np.clip((d + 1.6 - t) / 1.6, 0, 1)
    return y * e * (1 + 0.05 * np.sin(2 * np.pi * 0.23 * t))


def render_calm(duration, bpm=None, key='D major', hit=None, stops=(), seed=1):
    bpm = float(bpm or 72)
    bpm = min(80, max(64, bpm))
    beat = 60.0 / bpm
    bar = 4 * beat
    s8 = beat / 2
    pc, minor = parse_key(key or 'D major')
    prog = progression(pc, minor, sevenths=True)
    rng = np.random.RandomState(seed)
    rot = int(rng.randint(0, 4))                       # the seed picks where in the progression the loop starts
    prog = prog[rot:] + prog[:rot]
    pre = 0.0
    if hit is not None and 0 < hit < duration:
        pre = (bar - hit % bar) % bar
    total = pre + duration + 3.0
    nbars = int(np.ceil(total / bar))
    hit_bar = int(round((pre + hit) / bar)) if hit is not None and 0 < hit < duration else None
    N = int(total * SR) + 4 * SR
    pia, pad, sub, bel = (np.zeros((N, 2)) for _ in range(4))
    patterns = [(0, 2, 1, 2, 3, 2, 1, 2), (0, 1, 2, 3, 2, 1, 2, 1), (0, 2, 3, 2, 1, 2, 3, 1)]
    pat = patterns[seed % len(patterns)]
    mel_rng = np.random.RandomState(seed * 7 + 3)
    for b in range(nbars):
        r, chord = prog[b % 4]
        tones = sorted(chord)
        arp = [tones[0], tones[1], tones[2], tones[-1]]
        t0 = b * bar
        intro = b * bar < pre + 1.5 * bar           # first bar(s): sparser
        # pad (whole bar, overlapping)
        for i, m in enumerate(tones[:3]):
            place(pad, t0, stereo(pad_voice(hz(m), bar * 1.05, b + i), -0.5 + 0.5 * i, 0.4), 0.05)
        # sub root
        x = tt(bar * 1.0)
        place(sub, t0, stereo(np.sin(2 * np.pi * hz(r - 12) * x) * np.clip(x / 0.3, 0, 1) * np.clip((bar - x) / 0.5, 0, 1)), 0.16)
        # piano arpeggio in 8ths (left hand-ish, one octave up from voicing bottom)
        for k in range(8):
            if intro and k % 2:
                continue
            m = arp[pat[k] % 4]
            vel = 0.55 + (0.15 if k == 0 else 0) + 0.05 * mel_rng.rand()
            place(pia, t0 + k * s8 + 0.004 * mel_rng.randn(), stereo(piano(hz(m), s8 * 1.6, vel, b * 8 + k), -0.25 + 0.07 * k), 0.16)
        # sparse melody: 2-3 notes per bar from the chord + scale neighbour, high register
        if not intro:
            choices = [tones[1] + 12, tones[2] + 12, tones[-1] + 12, tones[0] + 24]
            for k, pos in enumerate((0, 3, 6) if b % 2 == 0 else (0, 4)):
                m = choices[(b + k * 2 + seed) % len(choices)]
                place(bel, t0 + pos * s8, stereo(piano(hz(m), beat * 1.8, 0.62, 900 + b * 4 + k), 0.2), 0.12)
        if hit_bar is not None and b == hit_bar:
            for i, m in enumerate(tones + [tones[0] + 12, tones[1] + 24]):
                place(bel, t0 + i * 0.06, stereo(piano(hz(m + 12), bar, 0.7, 2000 + i), -0.4 + 0.2 * i), 0.09)
    pia = reverb(pia, 0.45, 2.8, 5500, tail=False)
    bel = delay(bel, beat * 0.75, fb=0.3, mix=0.22, n=3)[:N]
    bel = reverb(bel, 0.6, 3.4, 6000, tail=False)
    pad = reverb(lp(pad, 2200), 0.5, 3.6, 4000, tail=False)
    mix = pia * 1.0 + bel * 1.0 + pad * 1.0 + lp(sub, 300) * 1.0
    mix = hp(mix, 35)
    mix = soft_clip(mix * 1.1, 1.1)
    i0 = int(round(pre * SR))
    n = int(round(duration * SR))
    out = mix[i0:i0 + n].copy()
    if len(out) < n:
        out = np.concatenate([out, np.zeros((n - len(out), 2))])
    tl_ = np.arange(n) / SR
    g = np.ones(n)
    for a, b2 in stops or ():
        g *= 1 - 0.85 * np.clip((tl_ - a) / 0.3, 0, 1) * (1 - np.clip((tl_ - b2) / 0.4, 0, 1))
    out *= g[:, None]
    out = norm_peak(out, -1.0)
    fi, fo = int(0.12 * SR), int(1.0 * SR)
    out[:fi] *= np.linspace(0, 1, fi)[:, None]
    out[-fo:] *= np.linspace(1, 0, fo)[:, None] ** 1.3
    return out

if __name__ == '__main__':
    a = sys.argv[1:]
    if len(a) < 2:
        print(__doc__)
        sys.exit(1)
    x = render_bed(float(a[1]), a[2] if len(a) > 2 else 'hype', float(a[3]) if len(a) > 3 else None,
                   a[4] if len(a) > 4 else 'A minor', float(a[5]) if len(a) > 5 else None)
    write_wav(a[0], x)
    print(f'wrote {a[0]} {len(x) / SR:.3f}s')
