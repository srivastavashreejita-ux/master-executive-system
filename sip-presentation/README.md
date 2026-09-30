# SIP presentation: "From a complaint to a system"

| File | What it is |
|---|---|
| `SIP_Story_Deck.pptx` | 38-slide story deck (14 acts) with full speaker notes on every slide |
| `SIP_Viva_Guide.docx` | Viva guide: 60-second pitch, JHS and what I learnt there, numbers to know, 20 concepts with formulas and worked examples, 22-question bank, slide-by-slide script |
| `source/` | Generator scripts, plant photos and screenshot crops used to build both files |

The whole deck follows one case from the workbook's demonstration dataset:
complaint CMP-26-0024 ("Bristle fall-out during use") → batch JHS-26433 (6 matches) →
four pack fields → PR-2026-00630 → handle lot HL-DBR-26-0519 → 3 runs, 8,698 good units exposed.

## Before presenting
- **Slide 19 (video):** no workflow video was supplied, so the slide has a styled placeholder frame.
  Insert the video in PowerPoint (Insert > Video > This Device), size it over the frame, and delete the small grey hint line.
- Photos used: the four plant photographs supplied (aerial, two rooftop views, tube filling line).
  Moulding, tufting and warehouse photos can be swapped into the mosaic on slide 9 if available.
- Slide 8 (Who is JHS?) uses public company facts (established 1997, contract manufacturer, clients such as Amway India and Dabur India). Confirm them with the external guide.

## Rebuilding
```bash
cd source
node build.js     # writes ../SIP_Story_Deck.pptx and notes.json
node viva.js      # writes ../SIP_Viva_Guide.docx (reads notes.json)
```
Requires `pptxgenjs` and `docx` (npm). `render_sheets.py` and `crop.py` regenerate the workbook
screenshots (LibreOffice + PyMuPDF + Pillow).

## Evidence images (visual pass)
- **Plant records** (`source/records/`): photographs of real plant formats provided by the presenter, rotated upright and cropped.
  Used once each: process-parameter record and FG production record (13 Jun) on slide 13; traceability report p.2 and FG production record (11 Jun) on slide 15; traceability report p.1 on slide 20.
- **No photograph repeats anywhere in the deck.** Zoomed crops of one MES screen appear only on the slide that explains that screen.
- **Moulding / tufting photos (slide 12):** save the images as `source/photos/moulding.jpg` and `source/photos/tufting.jpg`,
  copy `photos/web_sources.example.json` to `photos/web_sources.json` with the real caption, credit and URL, then rebuild.
  Slide 12 switches to its image layout automatically; the source goes into the speaker notes.
- **Client logos (slide 8):** save official logos as `source/logos/dabur.png`, `patanjali.png`, `amway.png` and rebuild. Without files, the slide shows names only.
  Clients were verified from public sources (listed in slide 8's speaker notes), not from the demonstration dataset.
