# 48-second storyboard

120 BPM · 1 bar = 2 s · 1 beat = 0.5 s · 24 bars · 1920×1080 @ 60 fps

Generated from `storyboard.json` (the same data drives `mes_film.html`).

| Shot | Time | Bars / beats | Section | Visual | Source asset | Camera | Transition | On-screen text | Sound | Purpose |
|---|---|---|---|---|---|---|---|---|---|---|
| S1 | 0.0–4.0 s | 1–2 · 1.1 → 2.4 | Hook | Full-bleed RAW Production register (real rows: run IDs, batch numbers, handle lots) under a navy scrim; slow lateral pan | ws_raw_production.jpg | z 0.92, pan cx 1050 → 2300 px over 4 s, ease-in-out | Fade up from black 0–0.6 s; text masks up and out at 3.5 s; hard cut on bar 3 | KALA AMB UNIT-I  ·  TOOTHBRUSH MANUFACTURING (0.5 s)<br>Every batch leaves a trail (1.0 s)<br>Across moulding, production, quality and dispatch (2.0 s) | Score intro: pad + clock ticks | Establish the real shop-floor record and the idea of a trail |
| S2 | 4.0–10.0 s | 3–5 · 3.1 → 5.4 | Old process | Four separate RAW registers in a 2×2 grid, one per beat: Production, Handle & cap, Quality, Dispatch — each with its real record count | ws_raw_production.jpg, ws_raw_handle.jpg, ws_raw_qc.jpg, ws_raw_dispatch.jpg | Each panel z 0.40 on the header + first rows, slow drift right | Panels rise 24 px + fade on beats 3.1, 3.2, 3.3, 3.4; headline swaps on bars 4 and 5 | The information existed (6.0 s)<br>Kept in separate registers (8.0 s)<br>762 runs · 410 handle lots · 762 inspections · 632 shipments | Kick + hats enter (build); data tick on 4.0 | Information existed — but departmentally |
| S3 | 10.0–14.0 s | 6–7 · 6.1 → 7.4 | Problem | Bar 6: trace chain Batch No → Production run → Handle lot → QC release → Shipment, each node labelled with the register it lives in. Bar 7: evidence — the Trace Report's own warning that one batch number is printed on packs from different dates | Typography; ws_trace_report_found.jpg (top strip) | Evidence frame on the title + warning strip, z ≈ 1.14 | Nodes on 8th notes; connectors draw; hard cut on bar 7 | A single trace crossed every register (11.0 s)<br>One batch number, many runs (12.0 s)<br>333 batch numbers across 762 production runs in the dataset (12.5 s) | Build continues; data tick on 10.0 | Show the friction with evidence, not drama |
| S4 | 14.0–18.0 s | 8–9 · 8.1 → 9.4 | Question | Near-black stage; the four register panels as faint ghosts converge to the centre panel rectangle | The four RAW screenshots at 10–60 % opacity | Ghost panels ease from grid positions into the Master Traceability frame rect (match cut) | Text masks out at 17.3 s; ghosts land exactly on the next shot's frame at 18.0 s | What if every record<br>was already joined | Break: kick drops out bar 9, riser into the drop, whoosh peak at 17.95 s | The pivot — sets up the solution |
| S5 | 18.0–24.0 s | 10–12 · 10.1 → 12.4 | Solution reveal | Bar 10: Master Traceability, then push in to Production Run ID column. Bar 11: the traceability + validation status columns (Fully Traceable / Valid). Bar 12: the workbook's documented data flow as typography — GRN → MRS → RAW Handle → RAW Production → RAW QC → RAW Dispatch → Master Traceability → Trace Report · Reverse Trace · Complaint Tool · Dashboards | ws_master_traceability.jpg, ws_master_traceability_status.jpg, ARCHITECTURE sheet wording | z 0.377 (fit width) → 0.765 on the key column; cut to status view z 0.73 | Drop on 18.0 (match cut from ghosts); hard cut on 20.0 and 22.0 | MASTER TRACEABILITY<br>One row per production run (18.25 s)<br>Joined from every module by Run ID (20.0 s)<br>632 of 762 runs fully traceable, handle lot to dispatch (21.0 s)<br>ARCHITECTURE · AS DOCUMENTED IN THE WORKBOOK (22.0 s) | Drop: full groove + sub hit on 18.0 | Fragmented → connected, shown with the real consolidation layer |
| S6 | 24.0–30.0 s | 13–15 · 13.1 → 15.4 | What the MES connects | Six verified modules, one every two beats: Batch trace, Reverse trace, OEE, Validation, Complaints, Dashboards — real sheet close-ups on the right, name + one-line function on the left | ws_trace_report_found, ws_reverse_trace, ws_oee_dashboard, ws_master_traceability_status, ws_complaint_tool, ws_dashboard_allbrands | Each close-up drifts +8 % zoom over its 1 s | Hard cuts on beats 1 and 3 of each bar; masked title reveal | 01 Batch trace — Batch number to components, QC and shipment<br>02 Reverse trace — Handle lot to every run it reached<br>03 OEE — Availability × performance × quality per run<br>04 Validation — Missing QC, invalid handle lot, quantity mismatch, duplicate run ID<br>05 Complaints — Market complaint to the run that made it<br>06 Dashboards — Plant KPIs filtered by brand, shift and date | Soft click on each cut | Only features verified in the workbook |
| S7 | 30.0–36.0 s | 16–18 · 16.1 → 18.4 | Live working | Trace Report, empty search (real recalculated state) → cursor clicks BATCH NO. → JHS-26003 typed on 16th notes → Enter → real recalculated state: 1 matching record, run PR-2026-00003 → camera glides to the dossier: handle lot HL-AMW-26-0061, dispatch DN-26-00002, Delivered → match cut on the handle lot into Reverse Trace → 3 runs, 8,312 good units exposed | ws_trace_report_empty.jpg, ws_trace_report_found.jpg, ws_reverse_trace.jpg | z 1.02 on search strip → z 0.833 on dossier (33.0–33.9 s) → reverse trace placed so its HL-AMW-26-0061 lands on the same screen point (measured anchors), then eases to z 0.78 | State swap on the Enter beat (32.5 s); match cut at 34.5 s | Enter a batch number<br>The matching production run is found<br>Components, QC and shipment in one record<br>Reverse trace from the handle lot<br>3 runs · 8,312 good units exposed | Cursor click 31.0, keystrokes 31.0–32.0 on 16ths, Enter + confirm 32.5, whoosh peak 34.5, data tick 35.5 | The most convincing section: real inputs, real recalculated outputs |
| S8 | 36.0–40.0 s | 19–20 · 19.1 → 20.4 | Stakeholders | 2×2 echo of the old-process grid, now labelled by who uses each part (from the workbook's Daily Operating Routine): Production, Quality, Dispatch, Management. Bar 20: the Management panel expands; the brand filter is switched from All Brands to Chicco and the KPIs recalculate (real second state) | ws_raw_production, ws_raw_qc, ws_raw_dispatch, ws_dashboard_allbrands → ws_dashboard_chicco | Grid z 0.40; expanded dashboard z 0.753 | Panels on beats; expansion 38.0–38.5; state swap on 39.0 | Each department keeps its register<br>PRODUCTION Records each run<br>QUALITY Sets QC and release status<br>DISPATCH Ships released batches<br>MANAGEMENT Reads KPIs and alerts<br>One filter recalculates every KPI | Click 38.75, confirm 39.0 | Who benefits — only roles the workbook names |
| S9 | 40.0–42.0 s | 21 · 21.1 → 21.4 | Impact | Three evidence-based outcome lines on dark, faint dashboard behind | Typography | Static | Masked reveals on beats 1, 2, 3 | WHAT THE SYSTEM ENABLES<br>Batch to shipment in one record<br>Component lot to every affected run<br>OEE calculated from the run records | Groove thins out | Qualitative value — no invented ROI |
| S10 | 42.0–44.0 s | 22 · 22.1 → 22.4 | Vision | Operational data → Connected records → Decision support, with the module that does each step | Typography | Static | Nodes on beats 1, 2, 3; connector draws | Operational data / RAW registers<br>Connected records / Master Traceability<br>Decision support / Dashboards and alerts | — | Operations + Data + Technology bridge |
| S11 | 44.0–46.0 s | 23 · 23.1 → 23.4 | Closing | Executive Dashboard hero, slow push-in | ws_dashboard_allbrands.jpg | z 0.597 → 0.75 | Cut on 44.0 | From records to visibility | Resolve chord | Land the message on the real interface |
| S12 | 46.0–48.0 s | 24 · 24.1 → 24.4 | End card | Title card, fade to black | Typography | Static | Fade to black 47.3–48.0 | Manufacturing Execution System<br>JHS Svendgaard Laboratories Limited<br>Operations Internship Project  ·  Shreejita Srivastava<br>Built in Microsoft Excel  ·  Demonstration dataset | Final low hit on 46.0, fade | Attribution |

## SFX cue sheet (aligned on each file's measured peak)

| Time | File | Gain |
|---|---|---|
| 4.000 s | data_tick.wav | -20 dB |
| 10.000 s | data_tick.wav | -20 dB |
| 17.950 s | swoosh.wav | -18 dB |
| 22.000 s | data_tick.wav | -22 dB |
| 24.000 s | click.wav | -24 dB |
| 25.000 s | click.wav | -24 dB |
| 26.000 s | click.wav | -24 dB |
| 27.000 s | click.wav | -24 dB |
| 28.000 s | click.wav | -24 dB |
| 29.000 s | click.wav | -24 dB |
| 31.000 s | click.wav | -14 dB |
| 31.125 s | key.wav | -18 dB |
| 31.250 s | key.wav | -18 dB |
| 31.375 s | key.wav | -18 dB |
| 31.500 s | key.wav | -18 dB |
| 31.625 s | key.wav | -18 dB |
| 31.750 s | key.wav | -18 dB |
| 31.875 s | key.wav | -18 dB |
| 32.000 s | key.wav | -18 dB |
| 32.125 s | key.wav | -18 dB |
| 32.500 s | key.wav | -16 dB |
| 32.500 s | confirm.wav | -17 dB |
| 34.500 s | swoosh.wav | -20 dB |
| 35.500 s | data_tick.wav | -18 dB |
| 38.750 s | click.wav | -14 dB |
| 39.000 s | confirm.wav | -18 dB |
