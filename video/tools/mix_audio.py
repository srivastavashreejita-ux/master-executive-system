"""Mix music + SFX from storyboard.json, using measured values from assets/audio/analysis.json:
  • music trimmed by first_downbeat_s so bar 1 beat 1 = t 0
  • each SFX placed so its measured PEAK (not its file start) lands on the cue time
  • loudness normalised to -14 LUFS integrated, -1 dBTP (two-pass ffmpeg loudnorm)
Usage: python3 tools/mix_audio.py"""
import json, os, subprocess, re, numpy as np, soundfile as sf
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); J = lambda *p: os.path.join(ROOT, *p)
st = json.load(open(J("storyboard.json"))); an = json.load(open(J("assets", "audio", "analysis.json")))
music, sr = sf.read(J(st["meta"]["music"]), always_2d=True)
off = int(round(an["first_downbeat_s"] * sr)); music = music[off:]
N = int(st["meta"]["duration_s"] * sr); mix = np.zeros((N, 2)); mix[:min(N, len(music))] = music[:N]
for c in st["sfx"]:
    s, r = sf.read(J("assets", "sfx", c["file"]), always_2d=True); assert r == sr
    start = int(round((c["t"] - an["sfx"][c["file"]]["peak_s"]) * sr)); g = 10 ** (c["gain_db"] / 20)
    s = np.repeat(s[:, :1], 2, 1) * g; a = max(start, 0); b = min(N, start + len(s))
    mix[a:b] += s[a - start:b - start]
fade = np.ones(N); k = int(.05 * sr); fade[-k:] = np.linspace(1, 0, k); mix *= fade[:, None]
tmp = J("output", "mix_raw.wav"); sf.write(tmp, mix, sr, subtype="PCM_24")
p1 = subprocess.run(["ffmpeg", "-hide_banner", "-i", tmp, "-af", "loudnorm=I=-14:TP=-1:LRA=11:print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
m = json.loads(re.search(r"\{[^{}]*\"input_i\"[^{}]*\}", p1, re.S).group(0))
af = f"loudnorm=I=-14:TP=-1:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true"
subprocess.run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", tmp, "-af", af, "-ar", "48000", J("output", "mes_mix.wav")], check=True)
subprocess.run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", J("output", "mes_mix.wav"), "-c:a", "aac", "-b:a", "192k", J("output", "mes_mix.m4a")], check=True)
os.remove(tmp)
chk = subprocess.run(["ffmpeg", "-hide_banner", "-i", J("output", "mes_mix.wav"), "-af", "loudnorm=print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
mm = json.loads(re.search(r"\{[^{}]*\"input_i\"[^{}]*\}", chk, re.S).group(0))
print("music offset trimmed:", an["first_downbeat_s"], "s | final integrated", mm["input_i"], "LUFS, true peak", mm["input_tp"], "dBTP")
