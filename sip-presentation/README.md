# SIP presentation: "From a complaint to a system"

| File | What it is |
|---|---|
| `SIP_Story_Deck.pptx` | 35-slide story deck (14 acts) with full speaker notes on every slide |
| `SIP_Viva_Guide.docx` | Viva guide: 60-second pitch, numbers to know, 20 concepts with formulas and worked examples, 22-question bank, slide-by-slide script |
| `source/` | Generator scripts, plant photos and screenshot crops used to build both files |

The whole deck follows one case from the workbook's demonstration dataset:
complaint CMP-26-0024 ("Bristle fall-out during use") → batch JHS-26433 (6 matches) →
four pack fields → PR-2026-00630 → handle lot HL-DBR-26-0519 → 3 runs, 8,698 good units exposed.

## Before presenting
- **Slide 19 (video):** no workflow video was supplied, so the slide has a styled placeholder frame.
  Insert the video in PowerPoint (Insert > Video > This Device), size it over the frame, and delete the small grey hint line.
- Photos used: the four plant photographs supplied (aerial, two rooftop views, tube filling line).
  Moulding, tufting and warehouse photos can be swapped in on slides 9–10 if available.

## Rebuilding
```bash
cd source
node build.js     # writes ../SIP_Story_Deck.pptx and notes.json
node viva.js      # writes ../SIP_Viva_Guide.docx (reads notes.json)
```
Requires `pptxgenjs` and `docx` (npm). `render_sheets.py` and `crop.py` regenerate the workbook
screenshots (LibreOffice + PyMuPDF + Pillow).
