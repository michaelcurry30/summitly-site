# project-only SFX (numpy): powerup.wav, snore.wav, scribble.wav, coin.wav, gulp.wav
import numpy as np, soundfile as sf, os
SR = 48000; D = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'sfx'); os.makedirs(D, exist_ok=True)
rng = np.random.default_rng(7)
def env(n, a, r): e = np.ones(n); a = int(a * SR); r = int(r * SR); e[:a] = np.linspace(0, 1, a); e[-r:] *= np.linspace(1, 0, r); return e
def save(name, x): x = x / (np.max(np.abs(x)) + 1e-9) * .89; sf.write(os.path.join(D, name), np.stack([x, x], 1).astype(np.float32), SR)
t = np.arange(int(.55 * SR)) / SR; f = 220 * 2 ** (t / .55 * 2.5); ph = 2 * np.pi * np.cumsum(f) / SR
save('powerup.wav', (np.sin(ph) + .4 * np.sin(2 * ph) + .25 * np.sign(np.sin(3 * ph)) * .3) * env(len(t), .01, .12))
t = np.arange(int(1.3 * SR)) / SR; n = rng.standard_normal(len(t)); n = np.convolve(n, np.ones(60) / 60, 'same')
save('snore.wav', (n * (1 + np.sin(2 * np.pi * 38 * t)) + .5 * np.sin(2 * np.pi * 90 * t)) * np.sin(np.pi * t / 1.3) ** 2)
t = np.arange(int(.35 * SR)) / SR; n = rng.standard_normal(len(t)); n = n - np.convolve(n, np.ones(8) / 8, 'same')
save('scribble.wav', n * (.5 + .5 * np.abs(np.sin(2 * np.pi * 14 * t))) * env(len(t), .01, .08))
t = np.arange(int(.4 * SR)) / SR
save('coin.wav', (np.sin(2 * np.pi * 1975 * t) * (t < .08) + np.sin(2 * np.pi * 2637 * t) * (t >= .08)) * np.exp(-t * 9))
t = np.arange(int(.25 * SR)) / SR; f = 300 - 500 * t; ph = 2 * np.pi * np.cumsum(f) / SR
save('gulp.wav', np.sin(ph) * np.sin(np.pi * t / .25) ** 2)
print('sfx ok')
# extra project SFX (shared across my 4-panel builds): zap, rain, alarm, sizzle, chop, kaching, crumple
t = np.arange(int(.5 * SR)) / SR; f = 900 * np.exp(-t * 6); ph = 2 * np.pi * np.cumsum(f) / SR
save('zap.wav', (np.sign(np.sin(ph)) * .5 + rng.standard_normal(len(t)) * .6) * np.exp(-t * 7))
t = np.arange(int(2.0 * SR)) / SR; n = rng.standard_normal(len(t)); n = n - np.convolve(n, np.ones(4) / 4, 'same')
drops = np.zeros(len(t)); idx = rng.integers(0, len(t) - 400, 60)
for k in idx: drops[k:k + 400] += np.sin(2 * np.pi * (2500 + rng.integers(0, 1500)) * np.arange(400) / SR) * np.exp(-np.arange(400) / 60)
save('rain.wav', (n * .5 + drops) * env(len(t), .3, .5))
t = np.arange(int(1.0 * SR)) / SR; b = np.sin(2 * np.pi * 2200 * t) + .6 * np.sin(2 * np.pi * 3300 * t)
save('alarm.wav', b * (np.sin(2 * np.pi * 16 * t) > 0) * env(len(t), .01, .1))
t = np.arange(int(1.2 * SR)) / SR; n = rng.standard_normal(len(t)); n = n - np.convolve(n, np.ones(3) / 3, 'same')
save('sizzle.wav', n * (.6 + .4 * rng.random(len(t)) ** 8) * env(len(t), .05, .3))
t = np.arange(int(.12 * SR)) / SR
save('chop.wav', (rng.standard_normal(len(t)) * .7 + np.sin(2 * np.pi * 180 * t)) * np.exp(-t * 45))
t = np.arange(int(.7 * SR)) / SR
save('kaching.wav', (np.sin(2 * np.pi * 2093 * t) * (t > .08) + np.sin(2 * np.pi * 2637 * t) * (t > .16) + rng.standard_normal(len(t)) * (t < .08) * .6) * np.exp(-np.maximum(t - .1, 0) * 5))
t = np.arange(int(.4 * SR)) / SR; n = rng.standard_normal(len(t)) * (rng.random(len(t)) > .7)
save('crumple.wav', np.convolve(n, np.ones(6) / 6, 'same') * env(len(t), .01, .1))
print('extra sfx ok')
