"""Build the film HTML from tools/film_template.html + storyboard.json + assets.
  mes_film.html             references ./assets (full-resolution; used for rendering)
  mes_film_standalone.html  everything embedded as base64 (screenshots downscaled, fonts
                            subset, final audio mix) — one portable file for review / hand-off
Usage: python3 tools/build.py"""
import json, base64, io, os
from PIL import Image
from fontTools import subset
from fontTools.ttLib import TTFont
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
J = lambda *p: os.path.join(ROOT, *p)
tpl = open(J("tools", "film_template.html"), encoding="utf-8").read()
story = json.load(open(J("storyboard.json"), encoding="utf-8"))
anchors = json.load(open(J("assets", "screenshots", "anchors.json"), encoding="utf-8"))
FONTS = [("Inter", 400, "Inter-Regular.otf"), ("Inter", 500, "Inter-Medium.otf"), ("Inter", 600, "Inter-SemiBold.otf"), ("Carlito", 700, "Carlito-Bold.ttf")]
b64 = lambda b: base64.b64encode(b).decode()

def faces(embed):
    css = []
    for fam, wt, fn in FONTS:
        if embed:
            f = TTFont(J("assets", "fonts", fn)); o = subset.Options(); o.flavor = "woff2"; o.layout_features = ["kern", "liga", "calt", "tnum"]
            s = subset.Subsetter(o); s.populate(unicodes=list(range(0x20, 0x7F)) + [0xA0, 0xB7, 0xD7, 0x2014, 0x2013, 0x2192, 0x2026, 0x2019])
            s.subset(f); buf = io.BytesIO(); f.flavor = "woff2"; f.save(buf)
            url = f"data:font/woff2;base64,{b64(buf.getvalue())}"; fmt = "woff2"
        else:
            url = f"assets/fonts/{fn}"; fmt = "opentype" if fn.endswith("otf") else "truetype"
        css.append(f"@font-face{{font-family:'{fam}';font-weight:{wt};font-style:normal;src:url({url}) format('{fmt}')}}")
    return "\n".join(css)

def screens(embed):
    out = {}
    for sid, a in anchors.items():
        p = J("assets", "screenshots", sid + ".jpg")
        if embed:
            im = Image.open(p); sc = min(1, 2400 / im.width); im = im.resize((round(im.width * sc), round(im.height * sc)), Image.LANCZOS)
            buf = io.BytesIO(); im.save(buf, "JPEG", quality=80, optimize=True, progressive=True)
            src = f"data:image/jpeg;base64,{b64(buf.getvalue())}"
        else: src = f"assets/screenshots/{sid}.jpg"
        out[sid] = {"src": src, "w": a["w"], "h": a["h"], "a": a["a"]}   # logical size stays full-res
    return out

for embed, name in ((False, "mes_film.html"), (True, "mes_film_standalone.html")):
    audio = None; mix = J("output", "mes_mix.m4a")
    if os.path.exists(mix): audio = f"data:audio/mp4;base64,{b64(open(mix,'rb').read())}" if embed else "output/mes_mix.m4a"
    data = "const STORY = " + json.dumps(story, ensure_ascii=False) + ";\nconst ASSETS = " + json.dumps({"screens": screens(embed), "audio": audio}, ensure_ascii=False) + ";"
    html = tpl.replace("/*__FONTFACES__*/", faces(embed)).replace("/*__DATA__*/", data)
    open(J(name), "w", encoding="utf-8").write(html)
    print(name, round(len(html.encode()) / 1e6, 2), "MB")
