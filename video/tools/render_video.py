"""Deterministic frame renderer: headless Chromium → seek(t) → screenshot → ffmpeg.
Usage:
  python3 tools/render_video.py --stills 0.3,2,5,...        # inspection stills → output/stills/
  python3 tools/render_video.py [--fps 60] [--sub 1|3]      # full render → output/mes_video_only.mp4
--sub 3 renders sub-frames at t-1/240, t, t+1/240 and averages them (motion blur)."""
import argparse, os, subprocess, sys, io, time, numpy as np
from PIL import Image
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); J = lambda *p: os.path.join(ROOT, *p)
ap = argparse.ArgumentParser(); ap.add_argument("--fps", type=int, default=60); ap.add_argument("--sub", type=int, default=1)
ap.add_argument("--stills"); ap.add_argument("--dur", type=float, default=48.0); ap.add_argument("--html", default="mes_film.html")
a = ap.parse_args()
with sync_playwright() as p:
    exe = os.environ.get("CHROMIUM_PATH") or next((c for c in ("/opt/pw-browsers/chromium-1194/chrome-linux/chrome", "/opt/pw-browsers/chromium") if os.path.isfile(c)), None)
    br = p.chromium.launch(executable_path=exe, args=["--allow-file-access-from-files", "--disable-gpu-vsync"])
    pg = br.new_page(viewport={"width": 1920, "height": 1080}, device_scale_factor=1)
    pg.goto("file://" + J(a.html) + "?render=1"); pg.evaluate("window.__ready")
    def shot(t):
        pg.evaluate(f"seek({t})")
        return pg.screenshot(type="png", clip={"x": 0, "y": 0, "width": 1920, "height": 1080})
    if a.stills:
        os.makedirs(J("output", "stills"), exist_ok=True)
        for s in a.stills.split(","):
            open(J("output", "stills", f"t{float(s):06.2f}.png"), "wb").write(shot(float(s))); print("still", s)
        br.close(); sys.exit()
    n = int(round(a.dur * a.fps)); outp = J("output", "mes_video_only.mp4")
    ff = subprocess.Popen(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", "1920x1080",
        "-r", str(a.fps), "-i", "-", "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-pix_fmt", "yuv420p", "-movflags", "+faststart", outp], stdin=subprocess.PIPE)
    offs = [0.0] if a.sub == 1 else list(np.linspace(-1 / 240, 1 / 240, a.sub))
    t0 = time.time()
    for i in range(n):
        t = i / a.fps
        acc = None
        for o in offs:
            im = np.asarray(Image.open(io.BytesIO(shot(min(max(t + o, 0), a.dur - 1e-4)))).convert("RGB"), dtype=np.float32)
            acc = im if acc is None else acc + im
        ff.stdin.write((acc / len(offs)).round().astype(np.uint8).tobytes())
        if i % 300 == 0: print(f"frame {i}/{n}  {time.time() - t0:.0f}s", flush=True)
    ff.stdin.close(); ff.wait(); br.close(); print("wrote", outp)
