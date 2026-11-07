"""dsp.py - tiny numpy/scipy DSP toolbox shared by sfxgen.py and music.py (48 kHz, float32, stereo = (n,2))."""
import numpy as np
from scipy import signal

SR = 48000


def tt(d):
    """time axis for d seconds"""
    return np.arange(int(round(d * SR))) / SR


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def env_ad(n, att, dec, curve=1.0):
    """attack (s) then exponential decay with time-constant dec (s)"""
    t = np.arange(n) / SR
    a = np.clip(t / max(att, 1e-4), 0, 1) ** curve
    return a * np.exp(-np.maximum(t - att, 0) / max(dec, 1e-4))


def env_adsr(n, a, d, s, r, gate):
    t = np.arange(n) / SR
    e = np.where(t < a, t / max(a, 1e-4), np.where(t < a + d, 1 - (1 - s) * (t - a) / max(d, 1e-4), s))
    rel = np.clip((t - gate) / max(r, 1e-4), 0, 1)
    return e * np.where(t > gate, 1 - rel, 1) ** 2


def fade(x, fin=0.003, fout=0.01):
    n = len(x)
    i, o = min(n, int(fin * SR)), min(n, int(fout * SR))
    if i > 0:
        x[:i] *= np.linspace(0, 1, i)[:, None] if x.ndim == 2 else np.linspace(0, 1, i)
    if o > 0:
        x[-o:] *= np.linspace(1, 0, o)[:, None] if x.ndim == 2 else np.linspace(1, 0, o)
    return x


def sweep_sine(f0, f1, d, curve='exp', phase=0.0):
    t = tt(d)
    p = t / d
    f = f0 * (f1 / f0) ** p if curve == 'exp' else f0 + (f1 - f0) * p
    return np.sin(2 * np.pi * np.cumsum(f) / SR + phase)


def fm_sine(fvec, phase=0.0):
    return np.sin(2 * np.pi * np.cumsum(fvec) / SR + phase)


def saw_additive(f, t, amp_fn=None, maxf=12000):
    """band-limited saw; amp_fn(k, fk, t) gives per-harmonic amplitude envelope (array)"""
    y = np.zeros_like(t)
    k = 1
    while k * f < maxf:
        a = (1.0 / k) if amp_fn is None else amp_fn(k, k * f, t)
        y += a * np.sin(2 * np.pi * k * f * t)
        k += 1
    return y


def noise(n, seed):
    return np.random.RandomState(seed).randn(n)


def bp(x, lo, hi, order=2):
    sos = signal.butter(order, [lo, min(hi, SR / 2 - 100)], 'band', fs=SR, output='sos')
    return signal.sosfilt(sos, x, axis=0)


def lp(x, fc, order=2):
    sos = signal.butter(order, min(fc, SR / 2 - 100), 'low', fs=SR, output='sos')
    return signal.sosfilt(sos, x, axis=0)


def hp(x, fc, order=2):
    sos = signal.butter(order, fc, 'high', fs=SR, output='sos')
    return signal.sosfilt(sos, x, axis=0)


def svf_bp(x, fc, q=2.0):
    """time-varying state-variable band-pass. fc: array (Hz) same length as x."""
    fc = np.broadcast_to(np.asarray(fc, float), x.shape)
    g = np.tan(np.pi * np.clip(fc, 20, SR * 0.45) / SR)
    k = 1.0 / q
    out = np.empty_like(x)
    ic1 = ic2 = 0.0
    for i in range(len(x)):
        gi = g[i]
        a1 = 1.0 / (1 + gi * (gi + k))
        v3 = x[i] - ic2
        v1 = a1 * ic1 + gi * a1 * v3
        v2 = ic2 + gi * v1
        ic1 = 2 * v1 - ic1
        ic2 = 2 * v2 - ic2
        out[i] = v1
    return out


def svf_lp(x, fc, q=0.707):
    fc = np.broadcast_to(np.asarray(fc, float), x.shape)
    g = np.tan(np.pi * np.clip(fc, 20, SR * 0.45) / SR)
    k = 1.0 / q
    out = np.empty_like(x)
    ic1 = ic2 = 0.0
    for i in range(len(x)):
        gi = g[i]
        a1 = 1.0 / (1 + gi * (gi + k))
        v3 = x[i] - ic2
        v1 = a1 * ic1 + gi * a1 * v3
        v2 = ic2 + gi * v1
        ic1 = 2 * v1 - ic1
        ic2 = 2 * v2 - ic2
        out[i] = v2
    return out


def stereo(x, pan=0.0, width=0.0, seed=0):
    """mono -> stereo with constant-power pan (-1..1, scalar or array) and optional Haas-ish width"""
    pan = np.asarray(pan, float)
    l = np.cos((pan + 1) * np.pi / 4) * np.sqrt(2)
    r = np.sin((pan + 1) * np.pi / 4) * np.sqrt(2)
    L, R = x * l, x * r
    if width > 0:
        d = int(0.0007 * SR * width) + 1
        R = np.concatenate([np.zeros(d), R[:-d]]) * (1 - 0.2 * width) + R * 0.2 * width
    return np.stack([L, R], 1)


_IR = {}


def reverb_ir(dur=1.6, damp=4500, seed=7, predelay=0.012):
    key = (dur, damp, seed, predelay)
    if key not in _IR:
        n = int(dur * SR)
        t = np.arange(n) / SR
        e = np.exp(-t * 6.9 / dur)
        ir = np.stack([noise(n, seed), noise(n, seed + 1)], 1) * e[:, None]
        ir = lp(ir, damp)
        # early reflections
        for k, (dt, g) in enumerate([(0.007, .5), (0.013, .4), (0.021, .3), (0.029, .25)]):
            i = int(dt * SR)
            ir[i, k % 2] += g
        pd = int(predelay * SR)
        ir = np.concatenate([np.zeros((pd, 2)), ir])
        ir /= np.sqrt((ir ** 2).sum() / 2)
        _IR[key] = ir
    return _IR[key]


def reverb(x, mix=0.2, dur=1.6, damp=4500, tail=True):
    if x.ndim == 1:
        x = stereo(x)
    ir = reverb_ir(dur, damp)
    wet = np.stack([signal.fftconvolve(x[:, c], ir[:, c]) for c in range(2)], 1)
    if not tail:
        wet = wet[:len(x)]
    else:
        x = np.concatenate([x, np.zeros((len(wet) - len(x), 2))])
    return x * (1 - mix * 0.5) + wet * mix * 0.35


def delay(x, t_s, fb=0.35, mix=0.3, n=5, pingpong=True, damp=5000):
    if x.ndim == 1:
        x = stereo(x)
    d = int(t_s * SR)
    out = np.concatenate([x, np.zeros((d * n, 2))])
    tap = x.copy()
    for k in range(1, n + 1):
        tap = lp(tap, damp, 1) * (1.0 if k == 1 else fb)
        if pingpong:
            tap = tap[:, ::-1]
        out[k * d:k * d + len(x)] += tap * mix
    return out


def soft_clip(x, drive=1.0):
    return np.tanh(x * drive) / np.tanh(drive)


def place(buf, t, x, g=1.0):
    """add x (mono or stereo) into stereo buf at time t (s); clips at buffer edges"""
    if x.ndim == 1:
        x = stereo(x)
    i = int(round(t * SR))
    j0 = max(0, -i)
    i0 = max(0, i)
    j = min(len(buf), i + len(x))
    if j > i0:
        buf[i0:j] += x[j0:j0 + (j - i0)] * g


def norm_peak(x, db=-1.0):
    p = np.max(np.abs(x)) + 1e-9
    return x * (10 ** (db / 20) / p)


def pitch_shift(x, semis):
    """resample-based (changes length) pitch shift"""
    if abs(semis) < 1e-3:
        return x
    r = 2 ** (semis / 12)
    n = int(len(x) / r)
    idx = np.arange(n) * r
    i0 = np.floor(idx).astype(int)
    fr = idx - i0
    i1 = np.minimum(i0 + 1, len(x) - 1)
    if x.ndim == 2:
        fr = fr[:, None]
    return x[i0] * (1 - fr) + x[i1] * fr


def write_wav(path, x):
    import soundfile as sf
    sf.write(path, np.asarray(x, np.float32), SR, subtype='FLOAT')


def read_wav(path):
    import soundfile as sf
    x, sr = sf.read(path, always_2d=True, dtype='float32')
    if sr != SR:
        from math import gcd
        g = gcd(sr, SR)
        x = signal.resample_poly(x, SR // g, sr // g, axis=0)
    if x.shape[1] == 1:
        x = np.repeat(x, 2, 1)
    return x.astype(np.float64)
