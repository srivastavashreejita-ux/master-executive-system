#!/usr/bin/env bash
# Re-create every screenshot in assets/screenshots from the real workbook.
#   1. LibreOffice Calc recalculates the workbook (it ships without cached values)
#   2. each sheet view / input state in tools/jobs2.json is exported to PDF
#   3. PDFs are rasterised at 200 dpi and trimmed; text anchors are measured
# Requires: libreoffice-calc, python3-uno, pymupdf, pillow, numpy, fonts-crosextra-carlito
set -euo pipefail
HERE="$(cd "$(dirname "$0")/.." && pwd)"; WORK="$(mktemp -d)"; cd "$WORK"
cp "$HERE/../JHS_MES_v3_0_SIP_Unit-I.xlsx" mes.xlsx
# the workbook uses Aptos Narrow; map it to the metric-compatible Carlito
mkdir -p ~/.config/fontconfig
[ -f ~/.config/fontconfig/fonts.conf ] || cat > ~/.config/fontconfig/fonts.conf <<'X'
<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "fonts.dtd"><fontconfig>
<alias binding="same"><family>Aptos Narrow</family><prefer><family>Carlito</family></prefer></alias>
<alias binding="same"><family>Calibri</family><prefer><family>Carlito</family></prefer></alias></fontconfig>
X
soffice --headless --invisible --norestore "--accept=socket,host=localhost,port=2002;urp;" >/dev/null 2>&1 &
LO=$!; sleep 8
python3 "$HERE/tools/recalc.py" mes.xlsx out
python3 "$HERE/tools/render.py" out/recalc.xlsx "$HERE/tools/jobs2.json" pdf2
kill $LO || true
python3 "$HERE/tools/rast2.py" pdf2 png2 200
python3 "$HERE/tools/anchors.py"
python3 - "$HERE" <<'PY'
import sys, json
from PIL import Image
H = sys.argv[1]
names = {"home":"ws_home","dashboard_all":"ws_dashboard_allbrands","dashboard_chicco":"ws_dashboard_chicco","oee":"ws_oee_dashboard","arch":"ws_architecture","master":"ws_master_traceability","master_status":"ws_master_traceability_status","raw_prod":"ws_raw_production","raw_handle":"ws_raw_handle","raw_qc":"ws_raw_qc","raw_disp":"ws_raw_dispatch","complaint":"ws_complaint_tool","reverse":"ws_reverse_trace","trace_found":"ws_trace_report_found","trace_empty":"ws_trace_report_empty"}
a = json.load(open("anchors.json")); out = {}
for k, v in names.items():
    Image.open(f"png2/{k}.png").convert("RGB").save(f"{H}/assets/screenshots/{v}.jpg", quality=90, optimize=True, progressive=True); out[v] = a[k]
json.dump(out, open(f"{H}/assets/screenshots/anchors.json", "w"), ensure_ascii=False, indent=0)
PY
echo "screenshots refreshed from $WORK"
