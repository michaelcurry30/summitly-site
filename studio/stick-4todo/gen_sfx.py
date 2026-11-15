# project-only SFX (numpy) — shared set for stick-4motivation / 4late / 4todo / 4takeout
import numpy as np, soundfile as sf, os
SR = 48000; D = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'sfx'); os.makedirs(D, exist_ok=True)
rng = np.random.default_rng(7)
def env(n, a, r): e = np.ones(n); a = max(1, int(a * SR)); r = max(1, int(r * SR)); e[:a] = np.linspace(0, 1, a); e[-r:] *= np.linspace(1, 0, r); return e
def save(name, x): x = x / (np.max(np.abs(x)) + 1e-9) * .89; sf.write(os.path.join(D, name), np.stack([x, x], 1).astype(np.float32), SR)
def tt(d): return np.arange(int(d * SR)) / SR
def sweep(d, f0, f1, exp=True):
    t = tt(d); f = f0 * (f1 / f0) ** (t / d) if exp else f0 + (f1 - f0) * t / d; return t, 2 * np.pi * np.cumsum(f) / SR
t, ph = sweep(.55, 220, 220 * 2 ** 2.5)
save('powerup.wav', (np.sin(ph) + .4 * np.sin(2 * ph) + .08 * np.sign(np.sin(3 * ph))) * env(len(t), .01, .12))
t = tt(1.3); n = rng.standard_normal(len(t)); n = np.convolve(n, np.ones(60) / 60, 'same')
save('snore.wav', (n * (1 + np.sin(2 * np.pi * 38 * t)) + .5 * np.sin(2 * np.pi * 90 * t)) * np.sin(np.pi * t / 1.3) ** 2)
t = tt(.4)
save('coin.wav', (np.sin(2 * np.pi * 1975 * t) * (t < .08) + np.sin(2 * np.pi * 2637 * t) * (t >= .08)) * np.exp(-t * 9))
# crunch / chomp: three short filtered noise bites
t = tt(.32); n = rng.standard_normal(len(t)); n = n - np.convolve(n, np.ones(5) / 5, 'same'); g = np.zeros(len(t))
for a in (0, .1, .2): g += np.exp(-np.clip(t - a, 0, None) * 40) * (t >= a)
save('crunch.wav', n * g)
# charge: short rising blip (battery bar up)
t, ph = sweep(.18, 600, 1500); save('charge.wav', (np.sin(ph) + .3 * np.sin(2 * ph)) * env(len(t), .005, .05))
# drain: long falling tone with wobble
t, ph = sweep(.8, 900, 110); save('drain.wav', (np.sin(ph + 3 * np.sin(2 * np.pi * 9 * t))) * env(len(t), .01, .2))
# alarm beeps (4 beeps)
t = tt(.9); b = ((t % .22) < .12).astype(float); save('alarm.wav', np.sign(np.sin(2 * np.pi * 2000 * t)) * .5 * b * env(len(t), .005, .02))
# car honk
t = tt(.45); save('honk.wav', (np.sign(np.sin(2 * np.pi * 360 * t)) + np.sign(np.sin(2 * np.pi * 450 * t))) * env(len(t), .01, .05) * .5)
# paper rustle
t = tt(.3); n = rng.standard_normal(len(t)); n = n - np.convolve(n, np.ones(3) / 3, 'same')
save('rustle.wav', n * (.4 + .6 * np.abs(np.sin(2 * np.pi * 18 * t))) * env(len(t), .02, .1))
# sizzle (pan)
t = tt(.9); n = rng.standard_normal(len(t)); n = n - np.convolve(n, np.ones(4) / 4, 'same')
save('sizzle.wav', n * (.6 + .4 * (rng.random(len(t)) > .97)) * env(len(t), .05, .3))
# doorbell ding-dong
t = tt(1.0); save('doorbell.wav', (np.sin(2 * np.pi * 659 * t) * (t < .45) * np.exp(-t * 3) + np.sin(2 * np.pi * 523 * t) * (t >= .45) * np.exp(-(t - .45) * 3)))
# cash register cha-ching
t = tt(.6); bell = np.sin(2 * np.pi * 2637 * t) + .6 * np.sin(2 * np.pi * 3520 * t); n = rng.standard_normal(len(t)) * np.exp(-t * 40)
save('cashreg.wav', n * .6 + bell * np.exp(-np.clip(t - .08, 0, None) * 7) * (t > .08))
# gulp
t, ph = sweep(.25, 300, 175, exp=False); save('gulp.wav', np.sin(ph) * np.sin(np.pi * t / .25) ** 2)
print('sfx ok')
