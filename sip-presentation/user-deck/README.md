# Presenter's own deck (35 slides)

| File | What it is |
|---|---|
| `Shreejita_SIP_Deck.pptx` | The presenter's edited deck (landing page, own order, embedded video) with the visual-evidence pass applied |
| `Shreejita_SIP_Speaker_Script.docx` | Slide-by-slide speaker script for this deck's order, with running order and timings |

Changes made to the presenter's file (9 slides; the other 26 are unchanged in content):
- **2** Where was I?: verified client names (Dabur India, Patanjali Ayurved, Amway India), sources in notes
- **3** On the ground: single rooftop photo (was a 3-photo mosaic that repeated other slides)
- **6** Opener: plant-yard photo (tube-filling photo was used four times)
- **12** Material flow: process-parameter record and FG production record under their stages
- **14** Registers: bristling traceability report and FG record with "compiled by hand" and "written twice" annotations
- **15** Line study: caption corrected to "Tube filling line, paste plant"
- **18** Architecture: paper traceability report as the "before"
- **32** Learnings: numbered cards instead of repeated photos
- **35** Closing: plain dark slide instead of the repeated aerial photo

Speaker notes: image sources added; transitions aligned to this deck's order; landing-page notes added.

Rebuild from the presenter's original upload:
```bash
cd ../source
python3 apply_visual_pass.py <original.pptx> /tmp/visual.pptx
python3 script_for_user_deck.py /tmp/visual.pptx ../user-deck/Shreejita_SIP_Deck.pptx user_deck_notes.json
node script_docx.js user_deck_notes.json ../user-deck/Shreejita_SIP_Speaker_Script.docx
```
