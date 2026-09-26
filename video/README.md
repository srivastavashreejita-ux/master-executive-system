# MES case-study film: production package

A 48-second, 1920×1080, 60 fps portfolio film about the JHS MES v3.0 workbook (`../JHS_MES_v3_0_SIP_Unit-I.xlsx`). Everything here was produced from an inspection of that workbook. Every interface on screen is a real render of it.

| Deliverable | File |
|---|---|
| Rendered film (48.0 s, H.264 + AAC, −14 LUFS) | `output/mes_case_study_48s.mp4` |
| Self-contained HTML (spec + player + deterministic `seek(t)` renderer, all assets embedded) | `mes_film_standalone.html` |
| Same HTML with full-resolution asset paths (used for rendering) | `mes_film.html` |
| Final Muse prompt | `muse_prompt.md` |
| Storyboard (shot-by-shot, beat-by-beat) | `storyboard.md` (generated from `storyboard.json`) |
| Asset manifest | `asset_manifest.csv` |
| Audio analysis (tempo, grid, drop, SFX peaks) | `assets/audio/analysis.json` |

---

## A. MES understanding

The repository holds a README and one workbook. The workbook has 27 sheets: 25 visible and 2 hidden (`OEE_Calculation` and `CHART_DATA`). It has 15 Excel Tables, 408 named ranges, 30 native charts and drop-down validation on every RAW entry sheet. Its own ARCHITECTURE, INSTRUCTIONS and BEGINNER GUIDE sheets document how it works.

- **Scope:** one plant (Kala Amb Unit-I), 6 lines, 27 machines and 15 SKUs. The product is **toothbrushes**: handle moulding and hygienic caps, then tufting, trimming, sealing and packing. The data covers 90 days (08 Jun – 05 Sep 2026) across three client-brand accounts (Amway, Chicco, Dabur).
- **Data flow** (ARCHITECTURE sheet): Vendor → GRN (AR number at receipt) → MRS (material issued to a batch) → RAW Handle → RAW Production → RAW QC (release gate) → RAW Dispatch. All of these feed MASTER TRACEABILITY, which feeds Trace Report, Reverse Trace and the Complaint Tool. The OEE engine and Master Traceability together feed the dashboards, analytics and alerts.
- **Design rule** (quoted): *"Nothing is typed twice. Every dashboard number is a SUMIFS or INDEX/MATCH over the RAW sheets."*
- **Join key:** Production Run ID (`PR-2026-00001`). Batch No. is printed on the pack and repeats by design. In the data, 762 runs share only 333 distinct batch numbers.
- **Iterations** (HOME sheet): v1.0 batch traceability framework → v2.0 reverse trace, trace report, complaint tool, dashboard → v2.1–2.4 OEE engine, machine master, dispatch, MRS, protection → v3.0 multi-brand filter context and a rebuilt OEE engine → v3.0 SIP single-plant refinement.
- **Live values after recalculation** (demo data): 762 runs, 632 of them fully traceable, overall OEE 72.5 %, 2,850,267 units produced.

### Discrepancies you should know about

1. **No Power Query.** The .xlsx contains no query, no connection part and no DataMashup. The workbook describes itself as formula-driven (SUMIFS / INDEX-MATCH). The repository README says "Power Query automation". The film does **not** claim Power Query. If a Power Query version exists elsewhere, add it and I can include it.
2. **No Outlook integration** exists in the workbook, so none is shown.
3. **Toothbrushes, not toothpaste or mouthwash.** JHS makes the full oral-care range, but this workbook models the toothbrush line.
4. **All operational data is fictional.** Every sheet says: *"Demonstration dataset — Amway, Chicco and Dabur are modelled as client brand accounts with fictional operational data. This is not real company data."* Real brand names (Amway, Chicco, Dabur, Glister, Babool, Meswak) and real vendor names (Toray, Perlon, Clariant, DuPont, Supreme Petrochem, Delhivery) appear next to invented numbers. The film keeps a persistent "demonstration dataset" label on screen. **Before publishing publicly, confirm with JHS that you may show their name, and consider anonymising the client brands.**
5. **Demo-data quirks, kept out of close-ups:**
   - Complaint types don't match their defect categories (e.g. "Bristles too hard" is filed under "SHORT QTY.").
   - Runs on QC hold show a dispatch date of "30-Dec-99", because a 0 is formatted as a date.
   - The default Reverse Trace run (PR-2026-00512) lists a masterbatch vendor as its bristle supplier. The film uses PR-2026-00003 instead.
   - The alert table is a static snapshot, as the workbook itself notes.
6. **The workbook stores no cached values.** It must be recalculated on open (Ctrl+Alt+F9 in Excel). The screenshots were taken after a full LibreOffice recalculation.

## B. Old process (reconstructed, and marked as such)

The repository contains **no document of JHS's pre-MES workflow**. What follows is inferred from the workbook's structure, its instructions and your description. It is not quoted from a source.

- Each department kept its own record: Stores (GRN, MRS), Moulding (handle and cap lots), Production (run records, including bristle and packing material), Quality (inspection and release) and Dispatch (shipment and invoice). These map one-to-one onto the RAW sheets and the INSTRUCTIONS sheet's "Daily operating routine".
- A trace needed identifiers that live in different records: Batch No → Run → Handle lot → resin, masterbatch and cap lots → QC release → dispatch and invoice.
- The batch number printed on the pack is not unique. The Trace Report says so itself: *"The same Batch No. is printed on packs made on different dates."* Resolving it needs product, colour and manufacturing date too.

## C. Problem (evidence-based)

The information existed, but it sat in separate records. A single trace had to cross every one of them, and the customer-facing identifier (Batch No.) is ambiguous: 333 batch numbers across 762 runs. There are no measured time-savings or baseline figures in the repository, so the film claims none.

## D. MES solution

One consolidation layer (MASTER TRACEABILITY, 78 columns, one row per run) joins every module on the Production Run ID. Search tools sit on top of it (Trace Report, Reverse Trace, Complaint Tool), and so do monitoring views (Executive, OEE, Analytics, Production, Machines, Quality, Downtime, Inventory, Alerts). All of it runs on formulas in Excel, the tool the plant already had. One filter context (brand · shift · date range) drives every dashboard.

## E. Verified features

| Feature | Where in the workbook |
|---|---|
| Batch traceability (forward: batch → components → QC → shipment, with downtime and MRS issues) | 🖨️ TRACE REPORT |
| Reverse traceability (run → component lots; handle lot → every affected run + good quantity exposed) | 🔄 REVERSE TRACE |
| Master traceability with completeness score (Fully / Partially Traceable, pending department) | 🔗 MASTER TRACEABILITY cols BV–BX |
| Data validation: Work Order Required, Run Not In QC, Handle Lot Required, Invalid Handle Lot, Quantity Mismatch, Duplicate Run ID | RAW Production col BF, Master col BY |
| Drop-down input validation from lookup lists | all RAW sheets, 📌 LOOKUP TABLES |
| OEE (availability × performance × quality, aggregated as a ratio of sums), machine utilisation | OEE_Calculation (hidden), 📈 OEE DASHBOARD, ⚙️ MACHINES |
| KPI dashboard with brand / shift / date filters, 30 native charts | 📊 DASHBOARD, 📉 ANALYTICS |
| Production order book, quality Pareto, downtime Pareto, inventory days-cover | 🏭 PRODUCTION, 🧪 QUALITY, ⛔ DOWNTIME ANALYSIS, 📦 INVENTORY |
| Market complaint → production run → CAPA | 🔍 COMPLAINT TOOL |
| Alert register (severity, owner, recommended action) | 🚨 ALERTS |
| **Not present:** Power Query, Outlook, macros/VBA, user authentication, audit trail (the last two are listed as known boundaries) | — |

## F. Stakeholders (named by the workbook's INSTRUCTIONS sheet)

| Role | What they do in the MES |
|---|---|
| Stores | Book vendor receipts against AR numbers (GRN); issue material to a batch (MRS) |
| Moulding | Record handle lot, resin, mould and cap data (RAW Handle) |
| Production | Record the run: quantities, machine, operator, times; log every stoppage |
| Quality | Inspect the batch and set QC and release status; the investigator uses Trace Report / Complaint Tool |
| Dispatch | Ship released batches and record delivery |
| Management | Read the numbers and work the alert list |

The film shows Production, Quality, Dispatch and Management.

## G. Video concept

**"Every batch leaves a trail."** The film follows one real batch, JHS-26003. We see where its records used to live (four separate registers), why tracing it was awkward (one batch number, many runs), and then the MES joining those records into one row per run. The centrepiece is a working trace. A batch number goes in and the real recalculated result comes out: run PR-2026-00003, handle lot HL-AMW-26-0061 and dispatch DN-26-00002. A match cut on the handle lot then opens Reverse Trace: 3 runs and 8,312 good units exposed. The grid of department registers returns later as the stakeholder grid, so the structure itself carries the idea of "fragmented, then connected".

## H. Storyboard

See `storyboard.md`. It has all 12 shots with time, bar, beat, visual, source asset, camera, transition, text, sound and purpose. The same data sits in `storyboard.json` and inside the HTML spec panel.

## I. Asset list

| Kind | What was used |
|---|---|
| Real screenshots | 15 renders of the workbook (`assets/screenshots/ws_*.jpg`, 200 dpi). Three are genuine alternate states produced by editing an input cell and recalculating: empty Trace Report search, Dashboard filtered to Chicco, Reverse Trace set to PR-2026-00003 |
| Real workbook views used | RAW Production / Handle / QC / Dispatch, Master Traceability (two views), Trace Report (two states), Reverse Trace, OEE Dashboard, Executive Dashboard (two states), Complaint Tool. Home and Architecture are included for reference |
| Real JHS visuals | **None used.** This environment's network policy blocked the JHS site (`svendgaard.com`) and all stock-media hosts. JHS photographs are copyrighted in any case and need written permission. The film never fabricates JHS imagery |
| Royalty-free footage | **None used** (hosts blocked). Optional slot: `assets/videos/`, see §L |
| Music | Original 120 BPM score, synthesised for this film (`tools/make_audio.py`). No third-party rights |
| SFX | Five original synthesised effects (click, key, confirm, swoosh, data tick) |
| Fonts | Inter (OFL 1.1); Carlito Bold (OFL 1.1), used only for the typed batch number so it matches the cell font |

### Music: the actual analysis (not assumed)

`tools/analyze_audio.py` measured the track with librosa. The stock beat tracker read 119.68 BPM with a sloppy grid because the intro has no kick. The script therefore fits the grid directly:

- **Tempo:** 120.00 BPM, found by searching tempo × phase against the onset envelope.
- **Phase:** re-fitted on a sub-150 Hz (kick-band) onset envelope, so 8th-note hats can't pull it onto the off-beat. They did, on the first pass.
- **Result:** first downbeat at **0.008 s**, median onset-to-grid error **2 ms**, energy jump (the drop) at **bar 10 = 18.0 s**.
- **Per-bar RMS:** intro 0.05–0.07 → build 0.17–0.18 → break 0.08 (bar 9) → drop 0.31 → body 0.24–0.26 → outro 0.17–0.20.
- **SFX peaks:** click 0.3 ms, key 1.8 ms, confirm 81 ms, data tick 61 ms, swoosh 307 ms. Cues are aligned on these.

To swap in a licensed track (Mixkit or Pixabay, for example), drop it in `assets/audio/`, run `analyze_audio.py` on it and re-mix. The mixer reads the measured offset.

## J. Final Muse prompt

See `muse_prompt.md`: one complete copy-paste prompt. Muse.ai is mainly a video host. If your tool can't follow a timeline this exact, upload `output/mes_case_study_48s.mp4` directly, or give the tool `mes_film_standalone.html` as the reference.

## K. Self-contained HTML

`mes_film_standalone.html` (about 9 MB) holds the storyboard, colours, typography, layout, transitions, SFX cue sheet and rendering instructions, the full animation logic, and every screenshot, font and the audio mix embedded as base64. Open it in a browser to play and scrub the film with audio and read the spec. Every frame is a pure function of `seek(t)`: no CSS animations, timers or random state, and nothing is carried between frames. Opacity is only ever applied to wrapper elements. Highlight boxes and the match cut use anchors measured in the rendered PDFs.

## L. Folder structure

```
video/
├── README.md                      this package
├── muse_prompt.md                 final prompt
├── storyboard.json                single source of truth (shots, text, SFX cues)
├── storyboard.md                  generated table
├── asset_manifest.csv             generated manifest
├── mes_film.html                  renderer (full-res asset paths)
├── mes_film_standalone.html       one-file hand-off (everything embedded)
├── assets/
│   ├── screenshots/               ws_*.jpg (15 real workbook renders) + anchors.json
│   ├── images/                    (empty) licensed stills only, e.g. JHS-approved photos
│   ├── videos/                    (empty) licensed manufacturing footage only
│   ├── audio/                     mes_score_120bpm.wav, analysis.json
│   ├── sfx/                       click, key, confirm, swoosh, data_tick (.wav)
│   └── fonts/                     Inter-Regular/Medium/SemiBold.otf, Carlito-Bold.ttf
├── tools/
│   ├── capture_workbook.sh        workbook → recalculated → PDF → 200 dpi JPEG + anchors
│   ├── recalc.py, render.py, jobs2.json, rast2.py, anchors.py
│   ├── make_audio.py              original score + SFX
│   ├── analyze_audio.py           tempo / grid / drop / SFX-peak analysis
│   ├── mix_audio.py               peak-aligned SFX, −14 LUFS / −1 dBTP
│   ├── film_template.html, build.py, gen_docs.py
│   └── render_video.py            headless Chromium → seek(t) → ffmpeg
└── output/
    ├── mes_case_study_48s.mp4     final film
    ├── mes_mix.m4a                final audio mix
    └── contact_sheet.jpg          the inspection frames
```

## M. Rendering commands

```bash
# 0. dependencies (Ubuntu); Chromium from Playwright, or set CHROMIUM_PATH
sudo apt-get install -y libreoffice-calc fonts-crosextra-carlito fonts-inter ffmpeg
pip install openpyxl pymupdf pillow numpy scipy soundfile librosa playwright fonttools brotli

cd video
# 1. (optional) re-capture every screenshot from the workbook
./tools/capture_workbook.sh
# 2. (optional) regenerate and re-analyse the audio
python3 tools/make_audio.py assets && python3 tools/analyze_audio.py assets
# 3. mix: trims to the measured downbeat, peak-aligns SFX, −14 LUFS / −1 dBTP
python3 tools/mix_audio.py
# 4. build both HTML files, and the docs
python3 tools/build.py && python3 tools/gen_docs.py
# 5. inspect representative stills BEFORE a full render
python3 tools/render_video.py --stills 1.8,5.8,13.5,17.9,19.9,24.5,31.8,32.9,34.6,35.8,39.5,47
# 6. render 2,880 frames at 60 fps (add --sub 3 for t±1/240 temporal-subframe motion blur)
python3 tools/render_video.py --fps 60
# 7. mux
ffmpeg -y -i output/mes_video_only.mp4 -i output/mes_mix.m4a -map 0:v -map 1:a \
       -c:v copy -c:a copy -shortest -movflags +faststart output/mes_case_study_48s.mp4
```

Adding licensed footage for the hook: extract frames with `ffmpeg -i clip.mp4 -vf fps=30,scale=1920:-2 assets/videos/hook/%04d.jpg`, add them to `SC` in `build.py`, and in scene S1 swap the frame's image source by `floor(t*30)`. That is the same deterministic `seek(t)` pattern.

## N. Licence and attribution

| Asset | Source | Licence | Commercial use | Used in |
|---|---|---|---|---|
| 15 workbook screenshots | Your workbook, rendered here | Your own work; contains fictional demo data and third-party brand names (see A.4) | Yes, subject to JHS's permission to show its name and workbook | S1–S11 |
| Music `mes_score_120bpm.wav` | Composed and synthesised for this film | Original, no third-party rights | Yes | whole film |
| SFX ×5 | Synthesised for this film | Original, no third-party rights | Yes | see cue sheet |
| Inter | Rasmus Andersson, via Ubuntu `fonts-inter` | SIL OFL 1.1 | Yes, embedding allowed | all text |
| Carlito Bold | Łukasz Dziedzic (Google Crosextra), via Ubuntu | SIL OFL 1.1 | Yes | typed batch number (S7) |
| JHS company imagery | not used | Copyright JHS; requires written permission | — | — |
| Stock footage / stock music | not used (blocked by network policy) | — | — | — |

Web research used only to confirm context: JHS manufactures oral-care products including toothbrushes at Kala Amb, Himachal Pradesh ([svendgaard.com](https://www.svendgaard.com/), [IIFL company summary](https://www.indiainfoline.com/company/jhs-svendgaard-laboratories-ltd/summary)).
