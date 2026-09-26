"""Analyse the music bed and SFX from the actual audio (not assumptions).
Outputs assets/audio/analysis.json: tempo, beat times, first downbeat, per-bar RMS
energy, detected drop bar, and each SFX's peak offset (used to align hits).
Re-run this on any replacement track; the renderer reads MUSIC_OFFSET from it.
Usage: python3 analyze_audio.py <assets_dir> [music.wav]"""
import sys, os, json, glob, numpy as np, librosa, soundfile as sf
A = sys.argv[1]; path = sys.argv[2] if len(sys.argv) > 2 else os.path.join(A, "audio", "mes_score_120bpm.wav")
y, sr = librosa.load(path, sr=None, mono=True)
oenv = librosa.onset.onset_strength(y=y, sr=sr, hop_length=256)
tempo, beats = librosa.beat.beat_track(onset_envelope=oenv, sr=sr, hop_length=256, start_bpm=120, tightness=200)
bt = librosa.frames_to_time(beats, sr=sr, hop_length=256)
tempo = float(np.atleast_1d(tempo)[0])
period = 60 / tempo
# Grid fit: search tempo (±3 BPM around the tracker) and phase that maximise
# onset strength sampled on the grid. More robust than beat_track on sparse intros.
ot = librosa.frames_to_time(np.arange(len(oenv)), sr=sr, hop_length=256)
def grid_score(per, ph):
    ts = np.arange(ph, ot[-1], per); idx = np.searchsorted(ot, ts).clip(0, len(oenv)-1)
    return oenv[idx].sum() / len(ts)
best = max(((grid_score(60/b, ph), 60/b, ph) for b in np.arange(round(tempo)-3, round(tempo)+3.001, 0.02)
            for ph in np.arange(0, 60/b, 0.002)), key=lambda r: r[0])
tracker_tempo = tempo; period = best[1]; tempo = 60 / period
# Phase: re-fit on a LOW-BAND onset envelope (kick drum < 150 Hz) so 8th-note hats
# cannot pull the grid onto the off-beat.
mel = librosa.feature.melspectrogram(y=y, sr=sr, hop_length=256, n_mels=64, fmax=150)
oenv_low = librosa.onset.onset_strength(S=librosa.power_to_db(mel), sr=sr, hop_length=256)
def grid_score_low(ph):
    ts = np.arange(ph, ot[-1], period); idx = np.searchsorted(ot, ts).clip(0, len(oenv_low)-1)
    return oenv_low[idx].sum() / len(ts)
phase0 = max(np.arange(0, period, 0.002), key=grid_score_low)
bt_tracker = bt; bt = np.arange(phase0, len(y)/sr, period)
# downbeat: the beat phase (0..3) with the most low-frequency energy (kick on 1)
S = np.abs(librosa.stft(y, n_fft=2048, hop_length=256)); low = S[:12].sum(0)
lowt = librosa.frames_to_time(np.arange(len(low)), sr=sr, hop_length=256)
def e_at(t): return low[np.argmin(abs(lowt - t))]
scores = [np.mean([e_at(t) for t in bt[k::4]]) for k in range(4)]
db_idx = int(np.argmax(scores)); first_downbeat = float(bt[db_idx] - 4 * period * int(bt[db_idx] // (4 * period)))
bar = 4 * period; nb = int(len(y) / sr // bar)
rms = [float(np.sqrt(np.mean(y[int(i*bar*sr):int((i+1)*bar*sr)] ** 2))) for i in range(nb)]
jump = np.diff(rms); drop_bar = int(np.argmax(jump)) + 2   # 1-indexed bar where energy jumps most
sfx = {}
for f in sorted(glob.glob(os.path.join(A, "sfx", "*.wav"))):
    s, r = sf.read(f); s = s if s.ndim == 1 else s.mean(1)
    env = np.abs(s); sfx[os.path.basename(f)] = {"peak_s": round(float(np.argmax(env) / r), 4), "dur_s": round(len(s) / r, 3), "peak_dbfs": round(float(20*np.log10(env.max())), 2)}
res = {"file": os.path.basename(path), "duration_s": round(len(y) / sr, 3), "tempo_bpm": round(tempo, 2),
       "beat_period_s": round(period, 4), "first_downbeat_s": round(first_downbeat, 4),
       "tracker_tempo_bpm": round(tracker_tempo, 2), "tracker_beats": len(bt_tracker), "grid_beats": len(bt), "beat_times_s": [round(float(t), 3) for t in bt],
       "onset_to_grid_error_ms_median": round(float(np.median(np.abs(((librosa.frames_to_time(librosa.onset.onset_detect(onset_envelope=oenv, sr=sr, hop_length=256), sr=sr, hop_length=256) - first_downbeat + period/4) % (period/2)) - period/4))) * 1000, 2),
       "bar_rms": [round(v, 4) for v in rms], "drop_bar": drop_bar, "drop_time_s": round(first_downbeat + (drop_bar - 1) * bar, 3),
       "sfx": sfx}
json.dump(res, open(os.path.join(A, "audio", "analysis.json"), "w"), indent=1)
print({k: v for k, v in res.items() if k != "beat_times_s"})
