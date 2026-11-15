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
# extra project SFX (shared helper set for 4homework/4run/4walk/4skill)
t = np.arange(int(.5 * SR)) / SR
save('blip.wav', np.sign(np.sin(2 * np.pi * (660 + 440 * (t > .07) + 220 * (t > .14)) * t)) * .5 * env(len(t), .005, .1) * (t < .25))
t = np.arange(int(.5 * SR)) / SR
save('buzz.wav', np.sin(2 * np.pi * 150 * t) * (np.sin(2 * np.pi * 18 * t) > -.2) * (1 - (t > .22) * (t < .28)) * env(len(t), .01, .05))
t = np.arange(int(.12 * SR)) / SR; n = rng.standard_normal(len(t)); n = np.convolve(n, np.ones(30) / 30, 'same')
save('step.wav', (n + .6 * np.sin(2 * np.pi * 90 * t)) * np.exp(-t * 40))
t = np.arange(int(1.2 * SR)) / SR; x = np.zeros(len(t))
for k, f in enumerate([196, 247, 294, 392, 494, 587]):
    d = int(k * .012 * SR); x[d:] += np.sin(2 * np.pi * f * t[:len(t) - d]) * np.exp(-t[:len(t) - d] * 3) * (1 + .3 * np.sin(2 * np.pi * 2 * f * t[:len(t) - d]))
save('strum.wav', x)
t = np.arange(int(.6 * SR)) / SR; x = np.zeros(len(t))
for f in [196, 207, 277, 311]: x += np.sin(2 * np.pi * f * t) * np.exp(-t * 4)
save('clang.wav', x + .3 * rng.standard_normal(len(t)) * np.exp(-t * 30))
print('extra sfx ok')
