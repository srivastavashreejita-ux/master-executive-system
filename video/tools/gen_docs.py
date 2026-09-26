"""Generate storyboard.md and asset_manifest.csv from storyboard.json and the asset folder."""
import json, os, csv, soundfile as sf
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); J = lambda *p: os.path.join(ROOT, *p)
st = json.load(open(J("storyboard.json"), encoding="utf-8"))
md = ["# 48-second storyboard", "", f"{st['meta']['bpm']} BPM · 1 bar = 2 s · 1 beat = 0.5 s · 24 bars · {st['meta']['resolution'][0]}×{st['meta']['resolution'][1]} @ {st['meta']['fps']} fps", "",
      "Generated from `storyboard.json` (the same data drives `mes_film.html`).", "",
      "| Shot | Time | Bars / beats | Section | Visual | Source asset | Camera | Transition | On-screen text | Sound | Purpose |", "|---|---|---|---|---|---|---|---|---|---|---|"]
esc = lambda s: str(s).replace("|", "\\|")
for s in st["shots"]:
    md.append(f"| {s['id']} | {s['t0']:.1f}–{s['t1']:.1f} s | {s['bars']} · {esc(s['beats'])} | {esc(s['section'])} | {esc(s['visual'])} | {esc(s['source'])} | {esc(s['camera'])} | {esc(s['transition'])} | {'<br>'.join(esc(x) for x in s['text'])} | {esc(s['sound'])} | {esc(s['purpose'])} |")
md += ["", "## SFX cue sheet (aligned on each file's measured peak)", "", "| Time | File | Gain |", "|---|---|---|"] + [f"| {c['t']:.3f} s | {c['file']} | {c['gain_db']} dB |" for c in st["sfx"]]
open(J("storyboard.md"), "w", encoding="utf-8").write("\n".join(md) + "\n")

def shots_using(name):
    return ", ".join(s["id"] for s in st["shots"] if name in s["source"] or name.replace(".jpg", "") in s["source"]) or "—"
rows = []; n = 0
WB = "Rendered from JHS_MES_v3_0_SIP_Unit-I.xlsx (this repository) after LibreOffice Calc 24.2 full recalculation; tools/capture_workbook.sh"
state = {"ws_trace_report_empty": "Input cells TRACE REPORT!A7 and A35 cleared, then recalculated",
         "ws_dashboard_chicco": "DASHBOARD!A6 (brand filter) set to Chicco, then recalculated",
         "ws_reverse_trace": "REVERSE TRACE!A7 set to PR-2026-00003 (the run followed in the film), then recalculated"}
for f in sorted(os.listdir(J("assets", "screenshots"))):
    if not f.endswith(".jpg"): continue
    n += 1; w, h = Image.open(J("assets", "screenshots", f)).size; b = f[:-4]
    rows.append([f"SC{n:02d}", f"assets/screenshots/{f}", f"image/jpeg {w}×{h}", WB + ("; " + state[b] if b in state else ""), "Your own work (workbook author). Contains fictional demonstration data only", "still", "Screen content", shots_using(b)])
for i, f in enumerate(sorted(os.listdir(J("assets", "sfx"))), 1):
    d = sf.info(J("assets", "sfx", f)).duration
    rows.append([f"FX{i:02d}", f"assets/sfx/{f}", "audio/wav 48 kHz", "Synthesised for this film by tools/make_audio.py", "Original work — no third-party rights; free for commercial use", f"{d:.2f} s", "Sound effect", "see SFX cue sheet"])
d = sf.info(J(st["meta"]["music"])).duration
rows.append(["MU01", st["meta"]["music"], "audio/wav 48 kHz 24-bit", "Composed and synthesised for this film by tools/make_audio.py", "Original work — no third-party rights; free for commercial use", f"{d:.2f} s", "Music bed, 120 BPM", "S1–S12"])
for i, f in enumerate(sorted(os.listdir(J("assets", "fonts"))), 1):
    lic = "SIL Open Font License 1.1 (Carlito, Google/Łukasz Dziedzic)" if "Carlito" in f else "SIL Open Font License 1.1 (Inter, Rasmus Andersson)"
    rows.append([f"FO{i:02d}", f"assets/fonts/{f}", "font", "Ubuntu packages fonts-inter / fonts-crosextra-carlito", lic + " — commercial use and embedding allowed", "—", "Typography" if "Inter" in f else "Typed batch number (matches workbook cell font)", "all" if "Inter" in f else "S7"])
with open(J("asset_manifest.csv"), "w", newline="", encoding="utf-8") as fh:
    w = csv.writer(fh); w.writerow(["asset_id", "filename", "type", "source", "license", "duration", "usage", "shots"]); w.writerows(rows)
print(len(rows), "assets")
