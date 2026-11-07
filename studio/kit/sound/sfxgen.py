#!/usr/bin/env python3
"""sfxgen.py - procedural SFX library for the Summitly ads.

    python3 kit/sound/sfxgen.py            # (re)render every sound to kit/sound/sfx/<name>_<v>.wav + index.json

Every sound is generated from code (no samples, no licences to track). 3 variants each
(different seed + small pitch/length jitter). index.json stores each file's duration and its
loudest moment ("peak", s) so mix.py can align whooshes so their peak lands just before a cut.
"""
import json
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from dsp import (SR, tt, hz, env_ad, fade, sweep_sine, fm_sine, noise, bp, lp, hp, svf_bp, svf_lp,
                 stereo, reverb, delay, soft_clip, norm_peak, write_wav)

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'sfx')


def J(rng, a=0.06):
    """jitter factor 1 +- a"""
    return 1 + rng.uniform(-a, a)


# ---------------------------------------------------------------- whooshes
def _whoosh(d, f0, f1, peak_at, seed, q=1.6, pan=(-.6, .6), air=0.35):
    n = int(d * SR)
    t = np.arange(n) / SR
    p = t / d
    # asymmetric bell: slow swell, fast release (peak at peak_at)
    e = np.where(p < peak_at, (p / peak_at) ** 2.2, np.exp(-((p - peak_at) / (1 - peak_at)) * 4.5) * (1 - (p - peak_at) / (1 - peak_at) * 0.1))
    fc = np.where(p < peak_at, f0 * (f1 / f0) ** (p / peak_at), f1 * (f0 * 0.8 / f1) ** ((p - peak_at) / (1 - peak_at)))
    x = noise(n, seed)
    body = svf_bp(x, fc, q) * 1.0
    hiss = hp(noise(n, seed + 5), 3500) * air * e ** 1.5
    low = svf_bp(noise(n, seed + 9), fc * 0.35, 0.9) * 0.6
    y = (body + low) * e + hiss
    y = np.tanh(y * 1.4)
    pan_v = np.interp(p, [0, 1], pan)
    return stereo(y, pan_v, width=0.5)


def whoosh_short(rng, v):
    d = 0.42 * J(rng, .08)
    return _whoosh(d, 350 * J(rng), 2400 * J(rng, .15), 0.62, 100 + v, q=1.4, pan=(-.5 + .3 * v / 3, .5))


def whoosh_long(rng, v):
    d = 1.05 * J(rng, .08)
    return _whoosh(d, 180 * J(rng), 1600 * J(rng, .15), 0.72, 200 + v, q=1.2, pan=(.6, -.6) if v % 2 else (-.6, .6), air=.25)


# ---------------------------------------------------------------- blade
def _metal(d, base, seed, decay=0.9, partials=(1, 1.483, 2.17, 2.89, 3.71, 4.95, 6.02)):
    t = tt(d)
    rng = np.random.RandomState(seed)
    y = np.zeros_like(t)
    for k, r in enumerate(partials):
        f = base * r * (1 + rng.uniform(-.004, .004))
        beat = 1 + 0.25 * np.sin(2 * np.pi * rng.uniform(3, 9) * t + rng.uniform(0, 6))
        y += np.sin(2 * np.pi * f * t + rng.uniform(0, 6)) * np.exp(-t / (decay * (1.25 - k * 0.11))) * beat / (1 + k * 0.45)
    return y


def shing(rng, v):
    d = 1.1
    t = tt(d)
    base = 1850 * J(rng, .05)
    ring = _metal(d, base, 300 + v, decay=0.42 * J(rng, .1))
    ring *= np.clip(t / 0.004, 0, 1)
    # draw/scrape: rising band noise in the first 110 ms
    n = len(t)
    sc_n = int(0.12 * SR)
    sc = svf_bp(noise(sc_n, 310 + v), np.linspace(2500, 9000, sc_n), 3) * np.linspace(0.3, 1, sc_n) ** 2
    scrape = np.zeros(n)
    scrape[:sc_n] = sc
    y = np.zeros(n)
    off = int(0.08 * SR)
    y[off:] += ring[:n - off] * 0.55
    y += scrape * 0.8
    y = hp(y, 900)
    st = stereo(y, np.interp(t, [0, .1, 1.1], [-.4, .3, .1]), width=.8)
    return reverb(st, 0.35, 1.3, 7000)


def slice_(rng, v):
    d = 0.28
    n = int(d * SR)
    t = np.arange(n) / SR
    x = noise(n, 400 + v)
    fc = 9000 * (900 / 9000) ** (t / d) * J(rng)
    y = svf_bp(x, fc, 1.2) * np.exp(-t / 0.05) * np.clip(t / 0.003, 0, 1)
    # paper/cloth tear: short crackle
    cr = (noise(n, 410 + v) * (np.random.RandomState(420 + v).rand(n) > 0.985)) * np.exp(-t / 0.03)
    thunk = np.sin(2 * np.pi * 180 * t) * np.exp(-t / 0.03) * 0.5
    y = y * 1.2 + hp(cr, 2000) * 0.5 + thunk
    return reverb(stereo(np.tanh(y * 1.5), np.interp(t, [0, d], [-.7, .7])), .15, .6)


# ---------------------------------------------------------------- impacts
def impact_soft(rng, v):
    d = 0.55
    t = tt(d)
    f = 55 + 70 * np.exp(-t / 0.035) * J(rng, .1)
    body = fm_sine(f) * env_ad(len(t), 0.002, 0.12)
    thud = lp(noise(len(t), 500 + v), 900) * env_ad(len(t), 0.001, 0.03) * 1.5
    y = soft_clip(body + thud, 1.5)
    return reverb(stereo(y), .12, .5, 3000)


def impact_hard(rng, v):
    d = 1.2
    t = tt(d)
    f = 42 + 110 * np.exp(-t / 0.05) * J(rng, .1)
    sub = fm_sine(f) * env_ad(len(t), 0.001, 0.32)
    crack = bp(noise(len(t), 600 + v), 1200, 7000) * env_ad(len(t), 0.0005, 0.025) * 1.4
    mid = bp(noise(len(t), 610 + v), 150, 900) * env_ad(len(t), 0.001, 0.09) * 1.2
    y = soft_clip(sub * 1.2 + crack + mid, 2.2)
    return reverb(stereo(y, 0, .4), .3, 1.4, 3500)


def pop(rng, v):
    d = 0.16
    t = tt(d)
    f = 280 * J(rng, .15) + 900 * (1 - np.exp(-t / 0.012))
    y = fm_sine(f) * env_ad(len(t), 0.001, 0.035)
    click = hp(noise(len(t), 700 + v), 3000) * env_ad(len(t), 0.0003, 0.003) * 0.6
    return reverb(stereo(y + click), .12, .4)


def ui_tap(rng, v):
    d = 0.12
    t = tt(d)
    y = np.sin(2 * np.pi * 2300 * J(rng, .08) * t) * env_ad(len(t), 0.0004, 0.008)
    y += np.sin(2 * np.pi * 620 * J(rng, .08) * t) * env_ad(len(t), 0.0008, 0.02) * 0.7
    y += hp(noise(len(t), 800 + v), 4000) * env_ad(len(t), 0.0002, 0.002) * 0.4
    return stereo(y)


# ---------------------------------------------------------------- tonal
def bell(f, d, dec=0.9, idx=2.2, ratio=3.5):
    t = tt(d)
    I = idx * np.exp(-t / (dec * 0.35))
    mod = np.sin(2 * np.pi * f * ratio * t) * I
    y = np.sin(2 * np.pi * f * t + mod) * env_ad(len(t), 0.002, dec)
    y += np.sin(2 * np.pi * f * 2.0 * t) * env_ad(len(t), 0.001, dec * 0.4) * 0.25
    return y


def chime_up(rng, v):
    root = [76, 74, 79][v % 3]
    notes = [root, root + 4, root + 7, root + 12]
    d = 1.3
    buf = np.zeros((int(d * SR), 2))
    for i, m in enumerate(notes):
        b = stereo(bell(hz(m), d - i * .07, 0.45, 1.6, 2.0) * (0.8 - i * 0.08), -0.4 + 0.27 * i)
        s = int(i * 0.07 * SR)
        buf[s:s + len(b)] += b[:len(buf) - s]
    return reverb(buf, .35, 1.5, 7000)


def notif_ding(rng, v):
    a, b = [(83, 88), (81, 86), (84, 91)][v % 3]
    d = 1.0
    buf = np.zeros((int(d * SR), 2))
    for i, m in enumerate((a, b)):
        x = stereo(bell(hz(m), d - i * .11, 0.35, 1.2, 1.0) * .8)
        s = int(i * 0.11 * SR)
        buf[s:s + len(x)] += x[:len(buf) - s]
    return reverb(buf, .2, .9, 8000)


def riser(rng, v):
    d = [1.2, 1.0, 1.5][v % 3]
    t = tt(d)
    p = t / d
    e = p ** 2.4
    nz = svf_bp(noise(len(t), 900 + v), 400 * (9000 / 400) ** p, 2.0) * e
    tone_ = np.zeros_like(t)
    for k, det in enumerate((1, 1.006, 0.994)):
        tone_ += np.sin(2 * np.pi * np.cumsum(220 * det * (4.0 ** p ** 1.5)) / SR) / 3
    trem = 1 + 0.3 * np.sin(2 * np.pi * np.cumsum(4 + 22 * p) / SR)
    y = nz * 0.9 + tone_ * e * 0.35 * trem
    y[-int(0.004 * SR):] *= np.linspace(1, 0, int(0.004 * SR))
    return stereo(y, 0, .6)


def rewind(rng, v):
    """tape-rewind chatter: fast warbling pitch sweep up with gibberish modulation"""
    d = [0.9, 0.75, 1.1][v % 3]
    t = tt(d)
    p = t / d
    f = 160 * (6 ** p) * (1 + 0.35 * np.sin(2 * np.pi * np.cumsum(9 + 30 * p) / SR))
    y = np.zeros_like(t)
    ph = 2 * np.pi * np.cumsum(f) / SR
    for k in range(1, 9):
        y += np.sin(k * ph) / k
    am = 0.55 + 0.45 * np.sign(np.sin(2 * np.pi * np.cumsum(14 + 40 * p) / SR))
    y = lp(y * am, 3500) * np.clip(p / 0.08, 0, 1) * np.clip((1 - p) / 0.06, 0, 1)
    y += svf_bp(noise(len(t), 950 + v), 800 * (8 ** p), 1.5) * 0.3
    return reverb(stereo(soft_clip(y * 0.8, 1.4), np.interp(p, [0, 1], [.5, -.5])), .15, .6)


def flag_plant(rng, v):
    d = 0.9
    t = tt(d)
    thud = fm_sine(60 + 90 * np.exp(-t / 0.03) * J(rng)) * env_ad(len(t), 0.001, 0.11)
    knock = bp(noise(len(t), 1000 + v), 600, 2500) * env_ad(len(t), 0.0005, 0.02) * 1.2
    wood = np.sin(2 * np.pi * 410 * J(rng) * t) * env_ad(len(t), 0.001, 0.05) * 0.5
    # cloth flap: amplitude-modulated band noise after the hit
    fl = bp(noise(len(t), 1010 + v), 700, 4000) * (0.5 + 0.5 * np.sin(2 * np.pi * 13 * t)) ** 2
    fl *= np.clip((t - 0.06) / 0.05, 0, 1) * np.exp(-np.maximum(t - 0.06, 0) / 0.18) * 0.35
    y = soft_clip(thud + knock + wood + fl, 1.5)
    return reverb(stereo(y), .18, .8, 4000)


def hop(rng, v):
    """light jump: soft upward boop + cloth swish"""
    d = 0.3
    t = tt(d)
    f = 240 * J(rng, .1) * (2.6 ** (t / 0.12).clip(0, 1))
    y = fm_sine(f) * env_ad(len(t), 0.004, 0.05) * 0.5
    sw = svf_bp(noise(len(t), 1100 + v), np.linspace(1200, 4000, len(t)), 1.5) * env_ad(len(t), 0.03, 0.06) * 0.6
    return reverb(stereo(y + sw), .12, .5)


def land(rng, v):
    d = 0.25
    t = tt(d)
    y = lp(noise(len(t), 1200 + v), 1400) * env_ad(len(t), 0.001, 0.025) * 1.3
    y += fm_sine(70 + 60 * np.exp(-t / 0.02)) * env_ad(len(t), 0.001, 0.05) * 0.6
    return stereo(soft_clip(y, 1.3))


def uhoh(rng, v):
    """worried two-note wobble (marimba-ish, falling minor third, with vibrato)"""
    d = 0.9
    buf = np.zeros((int(d * SR), 2))
    base = [69, 67, 71][v % 3]
    for i, m in enumerate((base, base - 3)):
        tt_ = tt(0.5)
        f = hz(m) * (1 + 0.012 * np.sin(2 * np.pi * 7 * tt_))
        y = fm_sine(f) * env_ad(len(tt_), 0.004, 0.16) + fm_sine(f * 4) * env_ad(len(tt_), 0.001, 0.03) * 0.25
        s = int(i * 0.2 * SR)
        x = stereo(y * 0.7)
        buf[s:s + len(x)] += x[:len(buf) - s]
    return reverb(buf, .2, .8)


def fall(rng, v):
    """cartoon fall: descending slide whistle + long whoosh"""
    d = 1.1
    t = tt(d)
    p = t / d
    f = 1400 * J(rng, .05) * (0.18 ** p)
    y = fm_sine(f * (1 + 0.01 * np.sin(2 * np.pi * 6 * t))) * np.clip(p / 0.05, 0, 1) * (1 - p) ** 0.6 * 0.35
    w = _whoosh(d, 900, 300, 0.5, 1300 + v, 1.0, air=.15)
    return stereo(y) + w * 0.8


def sting(rng, v):
    """SIGNATURE logo sting: katana shing + two-note rising bell (E5 -> B5) with shimmer, ~1.3 s"""
    d = 2.0
    buf = np.zeros((int(d * SR), 2))
    s = shing(np.random.RandomState(5), 0) * 0.8
    buf[:min(len(s), len(buf))] += s[:len(buf)]
    for i, (m, at) in enumerate(((76, 0.16), (83, 0.42))):
        b = bell(hz(m), 1.4, 0.7, 1.4, 2.0) + bell(hz(m + 12), 1.4, 0.45, 0.8, 2.0) * 0.3
        x = stereo(b * 0.75, -0.25 + 0.5 * i, .6)
        k = int(at * SR)
        buf[k:k + len(x)] += x[:len(buf) - k]
    # sub swell under the second note
    t = tt(d)
    sub = np.sin(2 * np.pi * hz(40) * t) * np.clip((t - 0.4) / 0.05, 0, 1) * np.exp(-np.maximum(t - 0.4, 0) / 0.35) * 0.5
    buf += stereo(sub)
    out = reverb(buf, .35, 1.8, 7500, tail=False)
    return fade(out, 0.001, 0.4)


GENS = {
    'whoosh_short': whoosh_short, 'whoosh_long': whoosh_long, 'shing': shing, 'slice': slice_,
    'impact_soft': impact_soft, 'impact_hard': impact_hard, 'pop': pop, 'ui_tap': ui_tap,
    'chime_up': chime_up, 'riser': riser, 'notif_ding': notif_ding, 'flag_plant': flag_plant,
    'hop': hop, 'land': land, 'uhoh': uhoh, 'fall': fall, 'rewind': rewind, 'sting': sting,
}
LEVEL = {'ui_tap': -6, 'pop': -4, 'land': -5, 'hop': -4}   # peak dBFS per family (default -1)


def render_all():
    os.makedirs(OUT, exist_ok=True)
    index = {}
    for name, g in GENS.items():
        for v in (1, 2, 3):
            rng = np.random.RandomState(hash(name) % 1000 + v * 7919 if False else (sum(map(ord, name)) * 31 + v))
            x = g(rng, v)
            x = fade(np.asarray(x, float), 0.0005, 0.02)
            x = norm_peak(x, LEVEL.get(name, -1.0))
            # trim trailing near-silence
            a = np.abs(x).max(1)
            nz = np.nonzero(a > 10 ** (-70 / 20))[0]
            x = x[:nz[-1] + 1] if len(nz) else x
            env = np.convolve(a[:len(x)] ** 2, np.ones(480) / 480, 'same')
            f = f'{name}_{v}.wav'
            write_wav(os.path.join(OUT, f), x)
            index.setdefault(name, []).append({'file': f, 'dur': round(len(x) / SR, 4), 'peak': round(int(np.argmax(env)) / SR, 4)})
    with open(os.path.join(OUT, 'index.json'), 'w') as fh:
        json.dump(index, fh, indent=1)
    return index


if __name__ == '__main__':
    idx = render_all()
    for k, vs in idx.items():
        print(f"{k:13s} " + '  '.join(f"{v['file']} {v['dur']:.2f}s pk@{v['peak']:.2f}" for v in vs))
