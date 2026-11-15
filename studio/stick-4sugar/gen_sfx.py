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
t = np.arange(int(.14 * SR)) / SR; n = rng.standard_normal(len(t))
save('crunch.wav', n * (rng.random(len(t)) > .7) * np.exp(-t * 26))
t = np.arange(int(.8 * SR)) / SR; n = rng.standard_normal(len(t)); n = n - np.convolve(n, np.ones(5) / 5, 'same')
save('rustle.wav', n * (rng.random(len(t)) > .55) * (.3 + .7 * np.abs(np.sin(2 * np.pi * 6 * t))) * np.sin(np.pi * t / .8))
t = np.arange(int(.7 * SR)) / SR; f = 140 + 60 * np.sin(2 * np.pi * 3 * t); ph = 2 * np.pi * np.cumsum(f) / SR
save('creak.wav', np.sign(np.sin(ph)) * (np.sin(2 * np.pi * 40 * t) > .2) * np.sin(np.pi * t / .7))
t = np.arange(int(.6 * SR)) / SR; x = np.zeros(len(t))
for k in range(14): s0 = int(rng.random() * .45 * SR); L = int(.06 * SR); x[s0:s0 + L] += np.sin(2 * np.pi * (900 + 1600 * rng.random()) * t[:L]) * np.exp(-t[:L] * 60)
save('clatter.wav', x)
print('sugar sfx ok')
