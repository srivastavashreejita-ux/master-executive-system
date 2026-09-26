"""Original score + SFX for the MES case-study film.
Everything here is synthesised from scratch with numpy/scipy, so the audio is
original work with no third-party licence. 120 BPM, 4/4, 24 bars = 48 s.
Usage: python3 make_audio.py <out_dir>"""
import sys, os, json, numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt, fftconvolve
SR = 48000; BPM = 120; BEAT = 60 / BPM; BAR = 4 * BEAT
LEN = 49.0                                   # 48 s + 1 s reverb tail
N = int(SR * LEN); rng = np.random.default_rng(7)
out = sys.argv[1] if len(sys.argv) > 1 else "."
def t_of(bar, beat=0.0): return (bar - 1) * BAR + beat * BEAT   # bar is 1-indexed
def lp(x, fc, o=2): return sosfilt(butter(o, fc, "low", fs=SR, output="sos"), x)
def hp(x, fc, o=2): return sosfilt(butter(o, fc, "high", fs=SR, output="sos"), x)
def bp(x, lo, hi): return sosfilt(butter(2, [lo, hi], "band", fs=SR, output="sos"), x)
def place(buf, snd, t, g=1.0):
    i = int(round(t * SR)); j = min(N, i + len(snd))
    if i < N: buf[i:j] += g * snd[: j - i]
def midi(m): return 440 * 2 ** ((m - 69) / 12)

# ---------- instruments
def kick(g=1.0):
    n = int(.45 * SR); tt = np.arange(n) / SR
    f = 44 + 70 * np.exp(-tt / .035); ph = 2 * np.pi * np.cumsum(f) / SR
    return g * (np.sin(ph) * np.exp(-tt / .16) + .15 * np.exp(-tt / .002) * rng.standard_normal(n))
def hat(g=1.0, d=.035):
    n = int(.12 * SR); tt = np.arange(n) / SR
    return g * hp(rng.standard_normal(n), 7000) * np.exp(-tt / d)
def clap(g=1.0):
    n = int(.3 * SR); tt = np.arange(n) / SR; x = bp(rng.standard_normal(n), 900, 2600)
    env = sum(np.exp(-np.clip(tt - o, 0, None) / .006) * (tt >= o) for o in (0, .011, .022)) * .5 + np.exp(-tt / .11) * (tt >= .022)
    return g * x * env
def saw(f, n, det=0.0):
    tt = np.arange(n) / SR; return 2 * ((tt * f * (1 + det)) % 1) - 1
def pluck(f, g=1.0, d=.22):
    n = int(.6 * SR); tt = np.arange(n) / SR
    x = (saw(f, n) * .6 + np.sin(2 * np.pi * f * tt)) * np.exp(-tt / d)
    return g * lp(x, 3200)
def bass_note(f, dur, g=1.0):
    n = int(dur * SR); tt = np.arange(n) / SR
    x = saw(f, n) * .7 + np.sin(2 * np.pi * f * tt) * .8
    env = np.minimum(1, tt / .005) * np.exp(-tt / (dur * .9))
    return g * lp(x * env, 420)
def pad_chord(notes, dur, fc):
    n = int(dur * SR); tt = np.arange(n) / SR; x = np.zeros(n)
    for m in notes:
        for d in (-.004, 0, .005): x += saw(midi(m), n, d)
    env = np.minimum(1, tt / .35) * np.minimum(1, (dur - tt) / .4).clip(0, 1)
    return lp(x * env / (3 * len(notes)), fc, 2)

# Dm - Bb - F - C  (i VI III VII), one chord per bar
PROG = [[50, 53, 57, 62], [46, 50, 53, 58], [53, 57, 60, 65], [48, 52, 55, 60]]
ROOT = [38, 34, 41, 36]

drums = np.zeros(N); bass = np.zeros(N); pad = np.zeros(N); arp = np.zeros(N); fx = np.zeros(N)
for bar in range(1, 25):
    ch = PROG[(bar - 1) % 4]; rt = ROOT[(bar - 1) % 4]; t0 = t_of(bar)
    # energy map (documented in the storyboard):
    full = 10 <= bar <= 20; build = 3 <= bar <= 8; brk = bar == 9
    # pad: filter opens through the film
    fc = {True: 2400}.get(full, 900 if bar <= 2 else 1400 if build else 700 if brk else 1800)
    if bar <= 23: place(pad, pad_chord(ch + [ch[0] + 12], BAR + .45, fc), t0, .55)
    else: place(pad, pad_chord(PROG[0] + [62 + 12], 3.0, 1200), t0, .5)
    # drums
    if build or full or bar in (21, 22):
        for b in range(4):
            if full or bar in (21, 22) or b in (0, 2): place(drums, kick(.9 if full else .6), t0 + b * BEAT)
    if bar == 23 or bar == 24: place(drums, kick(.8), t0)
    if full:
        for b in (1, 3): place(drums, clap(.35), t0 + b * BEAT)
    if build or full or bar in (21, 22):
        for e in range(8): place(drums, hat(.10 if e % 2 else .05), t0 + e * BEAT / 2)
    if full:
        for s in range(16):
            if s % 4 == 3: place(drums, hat(.05, .02), t0 + s * BEAT / 4)
    # bass: 8ths in the full section, whole notes in the build
    if full:
        for e in range(8): place(bass, bass_note(midi(rt), BEAT / 2 * .9), t0 + e * BEAT / 2, .5 if e % 2 else .7)
    elif build or bar in (21, 22, 23):
        place(bass, bass_note(midi(rt), BAR * .95), t0, .55)
    # arp: 16ths of chord tones
    if bar >= 3 and bar <= 22 and not brk:
        seq = [ch[0] + 12, ch[1] + 12, ch[2] + 12, ch[3] + 12]
        g = .16 if full else .09
        for s in range(16): place(arp, pluck(midi(seq[s % 4] + (12 if full and s % 8 == 7 else 0)), g), t0 + s * BEAT / 4)
    if bar in (1, 2):   # sparse "clock" ticks = data moving
        for e in range(8): place(arp, pluck(midi(74 if e % 4 == 0 else 81), .05, .06), t0 + e * BEAT / 2)

# riser across bars 8-9 into the drop at bar 10 (18.0 s); stops exactly on the downbeat
r0, r1 = t_of(8), t_of(10); n = int((r1 - r0) * SR); tt = np.arange(n) / SR
noise = rng.standard_normal(n); sweep = np.zeros(n)
for k in range(0, n, 2400):   # stepped band-pass sweep
    frac = k / n; lo = 300 + 5000 * frac ** 2
    seg = noise[k:k + 2400]; sweep[k:k + 2400] = bp(seg, lo, lo * 1.6)
place(fx, sweep * (tt / tt[-1]) ** 2.2 * .22, r0)
# soft sub-drop on 18.0 and final resolve on 46.0
for tt0, g in ((t_of(10), .9), (t_of(24), .6)):
    n = int(1.6 * SR); u = np.arange(n) / SR
    place(fx, g * np.sin(2 * np.pi * (38 + 30 * np.exp(-u / .05)) * u) * np.exp(-u / .5), tt0)

# space
ir_n = int(2.2 * SR); ir = rng.standard_normal(ir_n) * np.exp(-np.arange(ir_n) / SR / .55); ir = lp(ir, 5000) / 60
wet = fftconvolve(pad * .6 + arp, ir)[:N]
mix = drums * .9 + bass + pad * .8 + arp + fx + wet * .5
# fade: last bar fades to silence by 48.0 s
fade = np.ones(N); a, b = int(t_of(24, 1) * SR), int(48.0 * SR)
fade[a:b] = np.linspace(1, 0, b - a) ** 1.5; fade[b:] = 0; mix *= fade
mix = np.tanh(mix * 1.1) ; mix /= np.abs(mix).max() / .89
st = np.stack([mix, np.roll(mix, int(.0004 * SR)) * .98 + mix * .02], 1)[: int(48.0 * SR)]
sf.write(os.path.join(out, "audio", "mes_score_120bpm.wav"), st, SR, subtype="PCM_24")

# ---------- SFX (short, soft; peaks measured later)
def save(name, x):
    x = x / np.abs(x).max() * .5; sf.write(os.path.join(out, "sfx", name), x.astype(np.float32), SR, subtype="PCM_24")
u = np.arange(int(.05 * SR)) / SR
save("click.wav", hp(np.sin(2 * np.pi * 2400 * u) * np.exp(-u / .004) + .3 * rng.standard_normal(len(u)) * np.exp(-u / .002), 500))
u = np.arange(int(.06 * SR)) / SR
save("key.wav", bp(rng.standard_normal(len(u)), 1200, 5000) * np.exp(-u / .008) + .4 * np.sin(2 * np.pi * 180 * u) * np.exp(-u / .01))
u = np.arange(int(.35 * SR)) / SR
save("confirm.wav", (np.sin(2 * np.pi * 988 * u) * (u < .09) * np.exp(-u / .05) + np.sin(2 * np.pi * 1480 * u) * (u >= .08) * np.exp(-(u - .08).clip(0) / .09)) * np.minimum(1, u / .003))
u = np.arange(int(.6 * SR)) / SR; w = rng.standard_normal(len(u)); env = np.sin(np.pi * np.clip(u / .6, 0, 1)) ** 2
save("swoosh.wav", lp(w, 2500) * env * .6 + hp(w, 3000) * env * .15)
u = np.arange(int(.5 * SR)) / SR
save("data_tick.wav", sum(np.sin(2 * np.pi * f * u) * np.exp(-((u - o).clip(0)) / .03) * (u >= o) for f, o in ((1760, 0), (2217, .06), (2637, .12))))
print("ok")
