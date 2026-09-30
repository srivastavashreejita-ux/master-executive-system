// Acts 9–14: the system comes alive, OEE, what changed, learning, limits, ending.
const { C, F, W, H, notes, act, folio, question, pin, legend, frame } = require("./lib");

// Place a screenshot inside a box, preserving aspect ratio; returns rendered rect
function placeShot(s, shot, bx, by, bw, bh, o = {}) {
  let w = bw, h = bw / shot.ar;
  if (h > bh) { h = bh; w = bh * shot.ar; }
  const x = o.alignLeft ? bx : bx + (bw - w) / 2, y = by + (bh - h) / 2;
  frame(s, x - 0.06, y - 0.06, w + 0.12, h + 0.12);
  s.addImage({ path: shot.path, x, y, w, h });
  return { x, y, w, h };
}
function pinsOn(s, r, pts, startAt = 1) {
  pts.forEach((p, i) => pin(s, startAt + i, r.x + p[0] * r.w, r.y + p[1] * r.h));
}
// Highlight box on a screenshot region (relative coords)
function mark(s, r, box) {
  s.addShape("rect", { x: r.x + box[0] * r.w, y: r.y + box[1] * r.h, w: box[2] * r.w, h: box[3] * r.h,
    fill: { type: "none" }, line: { color: C.signal, width: 2 } });
}

module.exports = function (pres, ctx) {
  const S = ctx.shots, P = ctx.photos;
  let n = ctx.nextNo;

  // ───────────────── ACT 9 — THE SYSTEM COMES ALIVE ─────────────────
  const DEMO = "Demonstration dataset: fictional operational data modelled on client brand accounts. Not the company's production records.";
  const demo = (s, dark, y) => s.addText(DEMO, { x: 0.6, y: y ?? 7.05, w: 10.5, h: 0.25, fontFace: F.body, fontSize: 9, italic: true, color: dark ? "6F777D" : C.mute, margin: 0, isTextBox: true });
  const label = (s, t, x, y, w, color) => s.addText(t, { x, y, w: w ?? 6, h: 0.28, fontFace: F.body, fontSize: 10, bold: true, color: color ?? C.signal, charSpacing: 2, margin: 0, isTextBox: true });

  // 19. Dashboard — full-width crop, legend grid below
  {
    const s = pres.addSlide();
    s.background = { color: C.paper };
    act(s, 9, "The system comes alive  ·  dashboard");
    question(s, "Can management see the overall picture?", { size: 28 });
    const r = placeShot(s, S.dash_top, 0.6, 1.55, 12.13, 3.45);
    pinsOn(s, r, [[0.16, 0.335], [0.17, 0.61], [0.53, 0.61], [0.675, 0.61], [0.82, 0.61], [0.95, 0.61], [0.83, 0.895], [0.93, 0.895]]);
    const items = [
      { t: "Filters", d: "Brand, plant, shift, period. One block re-drives ten pages." },
      { t: "Actual vs planned", d: "Units produced against the schedule." },
      { t: "Production efficiency", d: "Actual ÷ planned." },
      { t: "OEE", d: "Availability × performance × quality." },
      { t: "Yield", d: "Good ÷ total produced." },
      { t: "Rejection rate", d: "Rejected ÷ produced." },
      { t: "Downtime", d: "Minutes lost, from the downtime log." },
      { t: "Alerts", d: "Open critical exceptions needing action today." },
    ];
    items.forEach((it, i) => {
      const x = 0.6 + (i % 4) * 3.07, y = 5.3 + Math.floor(i / 4) * 0.75;
      pin(s, i + 1, x + 0.16, y + 0.17, 0.32);
      s.addText([{ text: it.t, options: { bold: true, color: C.text, breakLine: true } }, { text: it.d, options: { color: C.mute } }],
        { x: x + 0.45, y: y - 0.02, w: 2.55, h: 0.7, fontFace: F.body, fontSize: 11.5, margin: 0, valign: "top", isTextBox: true });
    });
    demo(s);
    folio(s, n++);
    notes(s, {
      say: `This is the management dashboard, where a manager would start. The filter block at the top lets you choose the brand account, plant, shift and date range, and that one filter drives this page and nine others. Below it: actual against planned output, production efficiency, OEE, yield and rejection rate, then downtime and open critical alerts. None of these numbers is typed. Each one is calculated from the production, quality and downtime records under the current filter. And I want to say this clearly: the workbook uses a demonstration dataset, not JHS's production records, so these are not company results.`,
      why: `It answers requirement five: can management see production and losses without someone compiling a report first?`,
      notice: `"Records in scope: 1,529" at the top right. You always know the basis of the figure you're looking at.`,
      q: [
        ["How are the dashboard numbers calculated?", "SUMIFS and COUNTIFS over the calculation layer, using the same four filter criteria. For example, actual production is SUMIFS of total output where brand, shift and date fall within the filter. Ratios like efficiency are a ratio of two SUMIFS, never an average of percentages."],
        ["How do the alerts work?", "The Alerts sheet raises exceptions from the records: machine breakdowns above a threshold, batches that failed release, low inventory. Each has a severity, a recommended action, an owner and a status. The dashboard counts the open critical ones."],
        ["Is this real data?", `No. It's a demonstration dataset, with Amway, Chicco and Dabur modelled as client accounts and fictional operational data. The design is real; the numbers are for demonstration. The only figure in the deck from actual observation is the line study.`],
      ],
      next: `A dashboard number is only useful if you can go from it to the records behind it.`,
    });
  }

  // 20. Production + Quality — two columns, full screen + magnified zoom
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    act(s, 9, "The system comes alive  ·  drill-down");
    question(s, "Can we drill from a KPI to the records behind it?", { size: 28, w: 12.2 });
    const cw = 5.85, x2 = 0.6 + cw + 0.43;
    label(s, "PRODUCTION", 0.6, 1.5);
    label(s, "QUALITY", x2, 1.5);
    const r1 = placeShot(s, S.prod_full, 0.6, 1.85, cw, 2.3, { alignLeft: true });
    mark(s, r1, [0, 0.77, 0.365, 0.23]);
    const r2 = placeShot(s, S.qual_full, x2, 1.85, cw, 2.55, { alignLeft: true });
    mark(s, r2, [0.005, 0.6, 0.373, 0.39]);
    // zooms
    s.addText("↓  zoom", { x: 0.6, y: r1.y + r1.h + 0.1, w: 2, h: 0.25, fontFace: F.body, fontSize: 10, color: C.signal, bold: true, margin: 0, isTextBox: true });
    const z1 = placeShot(s, S.prod_zoom, 0.6, r1.y + r1.h + 0.45, cw, 1.0, { alignLeft: true });
    s.addText([
      { text: "Order drill-down.  ", options: { bold: true, color: C.text } },
      { text: "Pick a production order and see every run that fulfilled it, each with its own Production Run ID.", options: { color: C.steel } },
    ], { x: 0.6, y: z1.y + z1.h + 0.18, w: cw, h: 0.7, fontFace: F.body, fontSize: 12.5, margin: 0, valign: "top", isTextBox: true });
    s.addText("↓  zoom", { x: x2, y: r2.y + r2.h + 0.1, w: 2, h: 0.25, fontFace: F.body, fontSize: 10, color: C.signal, bold: true, margin: 0, isTextBox: true });
    const z2 = placeShot(s, S.qual_pareto, x2, r2.y + r2.h + 0.45, 3.4, 6.95 - (r2.y + r2.h + 0.45), { alignLeft: true });
    s.addText([
      { text: "Defect Pareto.  ", options: { bold: true, color: C.text } },
      { text: "Defects ranked by batches affected, so attention goes where most of the loss is. Each bar drills down to its batches.", options: { color: C.steel } },
    ], { x: z2.x + z2.w + 0.3, y: z2.y, w: 12.73 - (z2.x + z2.w + 0.3), h: 1.6, fontFace: F.body, fontSize: 12.5, margin: 0, valign: "top", isTextBox: true });
    folio(s, n++);
    notes(s, {
      say: `Behind the dashboard sit the modules. On the left is Production: the order book and schedule adherence. The useful part is the drill-down. A production order is a commercial commitment, a production run is a physical event, so if an order is short you can immediately see the runs that produced it, each with its Production Run ID. On the right is Quality: release performance and a defect Pareto. Instead of reporting only a rejection percentage, it ranks defect categories by batches affected, which is the analysis approach I saw used on the floor. Both modules drill down to the individual batches.`,
      why: `This is requirement two: connecting production with quality. The Run ID appears in both.`,
      notice: `The orange boxes show where each zoom comes from. The Run ID column in the drill-down is the thread that connects everything.`,
      q: [
        ["How do you stop a QC entry pointing to a run that doesn't exist?", "The Run ID in the QC register isn't a dropdown in this version. Instead, validation columns flag problems: 'Run Not In QC', 'Duplicate Run ID', 'Invalid Handle Lot' and 'Quantity Mismatch'. In a database, this would be a foreign-key constraint. It's one of the things I'd strengthen."],
        ["Who enters this data?", "The same people who fill the registers today: production supervisors, QC inspectors and dispatch. Users only type into the transaction registers, and coded fields such as product, machine and defect are dropdowns from master data."],
      ],
      next: `Now back to the complaint. Which manufacturing occurrence are we investigating?`,
    });
  }

  // 21. Trace Report — batch number alone
  {
    const s = pres.addSlide();
    s.background = { color: C.paper };
    act(s, 9, "The system comes alive  ·  trace report");
    question(s, "Which manufacturing occurrence are we investigating?", { size: 28, w: 12.2 });
    label(s, "STEP 1  ·  SEARCH ON THE BATCH NUMBER ONLY", 0.6, 1.5);
    const r0 = placeShot(s, S.t6_search, 0.6, 1.85, 12.13, 0.45);
    mark(s, r0, [0.002, 0.33, 0.1, 0.64]); mark(s, r0, [0.834, 0.33, 0.164, 0.64]);
    label(s, "STEP 2  ·  WHAT COMES BACK", 0.6, 2.62);
    const r = placeShot(s, S.t6_table, 0.6, 2.97, 7.4, 1.5, { alignLeft: true });
    mark(s, r, [0, 0.49, 1, 0.125]);
    s.addText("6", { x: 8.55, y: 2.5, w: 1.6, h: 1.7, fontFace: F.head, fontSize: 110, color: C.signal, margin: 0, valign: "top", isTextBox: true });
    s.addText("records for one printed batch number", { x: 10.0, y: 2.95, w: 2.8, h: 0.8, fontFace: F.head, fontSize: 17, color: C.text, margin: 0, valign: "top", isTextBox: true });
    s.addText("3 products  ·  4 colours  ·  6 dates, June to September", { x: 8.6, y: 4.2, w: 4.2, h: 0.35, fontFace: F.body, fontSize: 13, color: C.steel, margin: 0, isTextBox: true });
    s.addText([
      { text: "The report shows every match instead of picking one. ", options: { bold: true, color: C.text } },
      { text: "Silently choosing the first match would send the investigation to the wrong run, the wrong machine and the wrong material lot. Only product, colour and date tell these six apart. The customer's pack is record 3.", options: { color: C.steel } },
    ], { x: 0.6, y: 5.1, w: 12.1, h: 1.0, fontFace: F.body, fontSize: 14.5, margin: 0, valign: "top", isTextBox: true });
    demo(s);
    folio(s, n++);
    notes(s, {
      say: `So here's the Trace Report, with our complaint. I've entered only the batch number from the pack, JHS-26433, and left product and colour as "All" on purpose. Six production records come back: three different products, four colours, six dates from June to September. Any of them could be the brush the customer is holding. I actually discovered this during testing, not at the design stage. It's why the identification logic was reworked. And the report deliberately returns every match rather than choosing one.`,
      why: `This is the evidence for the most important design decision in the project.`,
      notice: `The "Matching records: 6" counter. The user knows immediately whether the search has been narrowed enough.`,
      q: [
        ["Why do batch numbers repeat?", "They're printed codes drawn from a finite annual series, so the same number comes round again through the year, often on a different product and colour. In the demonstration dataset, 364 batch numbers cover 1,529 runs, and each recurs three to six times."],
        ["Which formula finds the matches?", "Each row in Master Traceability has a match flag: 1 if batch, product and colour match (where 'All' acts as a wildcard) and the date is within the range. The report lists the k-th match with INDEX and SMALL(IF(flag=1, row number), k), and the counter is COUNTIF of the flag."],
      ],
      next: `So let's add what else is on the pack.`,
    });
  }

  // 22. Four fields → one key
  {
    const s = pres.addSlide();
    s.background = { color: C.ink };
    act(s, 9, "The system comes alive  ·  trace report", true);
    s.addText("Add product, colour and date. One record. One key.", { x: 0.6, y: 0.78, w: 12.2, h: 0.6, fontFace: F.head, fontSize: 28, color: C.white, margin: 0, isTextBox: true });
    label(s, "ALL FOUR FIELDS FROM THE PACK", 0.6, 1.62);
    const r0 = placeShot(s, S.t1_search, 0.6, 1.97, 12.13, 0.45);
    mark(s, r0, [0.002, 0.33, 0.83, 0.64]);
    label(s, "MATCHING PRODUCTION RECORD", 0.6, 2.75);
    placeShot(s, S.t1_row, 0.6, 3.1, 7.4, 0.6, { alignLeft: true });
    label(s, "STEP 3  ·  OPEN THE RECORD", 0.6, 4.05);
    const rk = placeShot(s, S.t1_key, 0.6, 4.4, 7.4, 0.4, { alignLeft: true });
    mark(s, rk, [0.225, 0.05, 0.36, 0.9]);
    s.addText("→", { x: 8.2, y: 3.9, w: 0.6, h: 0.8, fontFace: F.head, fontSize: 36, color: C.signal, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText("PRODUCTION RUN ID", { x: 8.95, y: 3.55, w: 3.9, h: 0.3, fontFace: F.body, fontSize: 10.5, bold: true, color: "AEB4B9", charSpacing: 3, margin: 0, isTextBox: true });
    s.addText("PR-2026-00630", { x: 8.95, y: 3.85, w: 3.9, h: 0.8, fontFace: F.head, fontSize: 36, color: C.signal, margin: 0, isTextBox: true });
    s.addText("Printed identifier in, internal key out. Everything downstream is joined on this.", { x: 8.95, y: 4.7, w: 3.8, h: 0.8, fontFace: F.body, fontSize: 13, color: "D5D9DC", margin: 0, valign: "top", isTextBox: true });
    s.addText("Batch No. + Product + Colour + Manufacturing Date  →  matching production record  →  Production Run ID", {
      x: 0.6, y: 5.9, w: 12.1, h: 0.4, fontFace: F.body, fontSize: 14, bold: true, color: C.white, margin: 0, isTextBox: true,
    });
    demo(s, true);
    folio(s, n++, true);
    notes(s, {
      say: `Now I add the other three fields from the pack: Dabur Red Toothbrush, Medium; colour red; manufacturing date 14 July. Matching records: one. When I open it, the system resolves the unique Production Run ID, PR-2026-00630. That's the hand-off I described earlier: the printed identifier goes in, the internal key comes out, and everything downstream is joined on that key.`,
      why: `It answers requirement one, and it's the direct answer to the question I opened with.`,
      notice: `The key is resolved by the system, not typed by the investigator.`,
      q: [
        ["What if the four fields still return two records?", "The report shows both, and the investigator picks the right one using the record number. It never silently chooses. In the demonstration data, the four fields were enough to separate every repeat I tested."],
        ["Why a date range rather than one date?", "Sometimes the customer's pack is damaged or the date is partly legible, so the report takes a from-to range. When the date is clear, from and to are the same day, as here."],
      ],
      next: `So what can we see once we have that key?`,
    });
  }

  // 23. Retrieved record — full width with pins
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    act(s, 9, "The system comes alive  ·  manufacturing record");
    question(s, "Once we find the right record, what can we see?", { size: 28, w: 12.2 });
    const r = placeShot(s, S.t1_record, 0.6, 1.55, 12.13, 2.95);
    pinsOn(s, r, [[0.33, 0.035], [0.68, 0.035], [0.985, 0.035], [0.33, 0.487], [0.68, 0.487], [0.985, 0.487]]);
    const blocks = [
      ["Product", "SKU, colour, variant, batch, brand"],
      ["Manufacturing", "Date, plant, line, machine, shift, operator"],
      ["Production", "Planned, actual, good, rejected, efficiency, yield"],
      ["Quality", "Inspection, defect, severity, decision, release"],
      ["Material genealogy", "Handle lot, resin, masterbatch, mould, bristle supplier, filament"],
      ["Machine & dispatch", "Downtime, OEE for the run, dispatch, customer, invoice"],
    ];
    blocks.forEach((b, i) => {
      const x = 0.6 + (i % 3) * 4.1, y = 4.85 + Math.floor(i / 3) * 0.95;
      pin(s, i + 1, x + 0.16, y + 0.17, 0.32);
      s.addText([{ text: b[0], options: { bold: true, color: i === 4 ? C.signal : C.text, breakLine: true } }, { text: b[1], options: { color: C.mute } }],
        { x: x + 0.45, y: y - 0.02, w: 3.5, h: 0.85, fontFace: F.body, fontSize: 12, margin: 0, valign: "top", isTextBox: true });
    });
    demo(s);
    folio(s, n++);
    notes(s, {
      say: `This is the retrieved manufacturing record for PR-2026-00630. It comes in six blocks: product, manufacturing, production, quality, material genealogy, and machine and dispatch. Below these, the sheet also lists the stoppages logged against the run and the materials issued to it. Before, each of these blocks meant a separate search in a separate register. Now it's one view, and every field is a live lookup on the Run ID from Master Traceability.`,
      why: `This is the connected story that didn't exist before, and it's the core output of the traceability module.`,
      notice: `Block 5, material genealogy. That's what makes reverse traceability possible later.`,
      q: [
        ["How is all this pulled together?", "Master Traceability holds one consolidated row per production run, 78 columns wide, built from the registers with INDEX-MATCH on the Run ID. The report then looks up that one row."],
        ["What is material genealogy?", "It's the record of which input lots went into which output: here the handle lot, the resin grade and lot, masterbatch, mould, bristle supplier and filament reference. It's like a family tree for the product."],
      ],
      next: `For a bristle complaint specifically, let me zoom into the parts an investigator would look at first.`,
    });
  }

  // 24. Zoom — what matters for loose bristles
  {
    const s = pres.addSlide();
    s.background = { color: C.paper };
    act(s, 9, "The system comes alive  ·  zoom");
    question(s, "For loose bristles, where would QA look first?", { size: 28, w: 12.2 });
    const cw = 5.9;
    label(s, "WHERE AND WHEN IT WAS MADE", 0.6, 1.5);
    const r1 = placeShot(s, S.t1_mfg, 0.6, 1.85, cw, 2.3, { alignLeft: true });
    mark(s, r1, [0, 0.43, 1, 0.1]); mark(s, r1, [0, 0.525, 1, 0.1]); mark(s, r1, [0, 0.62, 1, 0.1]);
    label(s, "WHAT WENT INTO IT", 0.6 + cw + 0.33, 1.5);
    const r2 = placeShot(s, S.t1_mat, 0.6 + cw + 0.33, 1.85, cw, 2.6, { alignLeft: true });
    mark(s, r2, [0, 0.115, 1, 0.08]); mark(s, r2, [0, 0.755, 1, 0.08]); mark(s, r2, [0, 0.835, 1, 0.08]);
    const yT = Math.max(r1.y + r1.h, r2.y + r2.h) + 0.75;
    s.addShape("line", { x: 0.6, y: yT - 0.3, w: 12.13, h: 0, line: { color: C.rule, width: 0.75 } });
    const pts = [
      ["Tufting machine DBR-TUF-11, shift A", "Bristle retention is set at the anchoring operation, so the machine and shift come first."],
      ["Handle lot HL-DBR-26-0519", "Where the brush's identity begins, and the lot we can trace forward."],
      ["Bristle supplier and filament AR number", "The filament lot itself, if the anchoring was sound."],
    ];
    pts.forEach((p, i) => {
      const x = 0.6 + i * 4.1;
      s.addText([{ text: p[0], options: { bold: true, color: C.text, breakLine: true } }, { text: p[1], options: { color: C.steel } }],
        { x, y: yT, w: 3.85, h: 1.3, fontFace: F.body, fontSize: 12.5, margin: 0, valign: "top", isTextBox: true });
    });
    s.addText("Three registers before. One record now.", { x: 0.6, y: 6.2, w: 12.1, h: 0.5, fontFace: F.head, fontSize: 20, italic: true, color: C.signal, margin: 0, isTextBox: true });
    demo(s);
    folio(s, n++);
    notes(s, {
      say: `For this complaint, bristles coming out, bristle retention is set at the tufting stage, where the filament is anchored into the handle. That's something I saw in the tufting plant. So QA would look first at where and when it was made: the tufting machine, DBR-TUF-11, shift A, and the operator. Then at what went into it: the handle lot, the bristle supplier and the filament reference. All of it is on one record now, instead of in three registers.`,
      why: `It connects the system back to what I observed on the floor. The fields in the record were chosen because of what matters in tufting and moulding.`,
      notice: `These are zoomed crops of the same record, so they're readable.`,
      q: [
        ["Does the system tell you the root cause?", "No. It gives the investigator the right record and the connected data. Root-cause analysis is still QA's job. In this demonstration case, the root cause recorded in the complaint register is filament lot moisture above specification."],
        ["Why these fields and not others?", "They came from the plant exposure: in tufting, retention depends on the anchoring; in moulding, identity begins at the handle lot. The record was designed around those observations."],
      ],
      next: `So let's close the loop on the complaint itself.`,
    });
  }

  // 25. Complaint tool
  {
    const s = pres.addSlide();
    s.background = { color: C.ink };
    act(s, 9, "The system comes alive  ·  complaint tool", true);
    s.addText("Can we investigate the complaint end to end?", { x: 0.6, y: 0.78, w: 12.2, h: 0.6, fontFace: F.head, fontSize: 28, color: C.white, margin: 0, isTextBox: true });
    const flow = ["Complaint", "Pack information", "Four-field ID", "Trace Report", "Correct record", "Investigation"];
    const fw = 1.87, fg = 0.18;
    flow.forEach((f, i) => {
      const x = 0.6 + i * (fw + fg);
      s.addShape("rect", { x, y: 1.55, w: fw, h: 0.52, fill: { color: i === 0 ? C.signal : "2A3138" }, line: { type: "none" } });
      s.addText(f, { x, y: 1.55, w: fw, h: 0.52, fontFace: F.body, fontSize: 12.5, bold: true, color: C.white, align: "center", valign: "middle", margin: 0, isTextBox: true });
      if (i < flow.length - 1) s.addText("›", { x: x + fw, y: 1.55, w: fg, h: 0.52, fontFace: F.body, fontSize: 16, color: C.signal, align: "center", valign: "middle", margin: 0, isTextBox: true });
    });
    label(s, "COMPLAINT CMP-26-0024", 0.6, 2.35);
    const r1 = placeShot(s, S.c_L, 0.6, 2.7, 5.0, 2.4, { alignLeft: true });
    mark(s, r1, [0, 0.47, 0.56, 0.1]); mark(s, r1, [0.54, 0.83, 0.46, 0.1]);
    label(s, "LINKED TO THE RUN, LIVE FROM MASTER TRACEABILITY", 5.95, 2.35);
    const r2 = placeShot(s, S.c_R, 5.95, 2.7, 6.78, 1.75, { alignLeft: true });
    mark(s, r2, [0.455, 0.18, 0.54, 0.12]); mark(s, r2, [0.455, 0.87, 0.54, 0.12]);
    s.addText([
      { text: "“Bristle fall-out during use”  →  ", options: { color: C.white, italic: true } },
      { text: "JHS-26433  →  PR-2026-00630  →  DBR-TUF-11, handle lot HL-DBR-26-0519  →  ", options: { color: "D5D9DC" } },
      { text: "root cause: filament lot moisture above specification", options: { color: C.signal, bold: true } },
    ], { x: 0.6, y: Math.max(r1.y + r1.h, r2.y + r2.h) + 0.45, w: 12.13, h: 0.9, fontFace: F.body, fontSize: 16, margin: 0, valign: "top", isTextBox: true });
    demo(s, true);
    folio(s, n++, true);
    notes(s, {
      say: `This brings us back to where we started. The Complaint Tool holds the market complaint register. Complaint CMP-26-0024 in the demonstration data says: "Bristle fall-out during use." The complaint is logged with what the customer reported: batch, product, colour, manufacturing date. The Trace Report identifies the run, and the complaint then carries the Production Run ID, PR-2026-00630. So the manufacturing record behind it, the plant, line, machine, shift, operator, handle lot and QC status, is drawn live from Master Traceability. The corrective action is then tracked to closure against it. In this case the recorded root cause is filament lot moisture above specification.`,
      why: `It closes the loop the opening slide created. The question "How do we find out what happened?" now has a concrete path.`,
      notice: `The flow at the top is the opening story, now running as a system. Reading the pack is still a human step: there's no image recognition anywhere in the project.`,
      q: [
        ["Does the system read the customer's photograph?", "No. There's no image recognition, computer vision or automatic batch extraction. Reading the four fields from the pack is a human step that takes a few seconds."],
        ["Is CMP-26-0024 a real complaint?", "No. It's a record in the demonstration dataset. I used it because it matches the scenario I opened with."],
      ],
      next: `And if the investigation implicates a material lot, the question flips: where else did that lot go?`,
    });
  }

  // 26. Reverse trace
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    act(s, 9, "The system comes alive  ·  reverse trace");
    question(s, "If a material lot is implicated, where else did it go?", { size: 28, w: 12.2 });
    label(s, "DIRECTION 1  ·  PRODUCTION RUN → COMPONENTS  (what went into it)", 0.6, 1.5, 9);
    const r1 = placeShot(s, S.r_dir1, 0.6, 1.85, 12.13, 1.5);
    mark(s, r1, [0.002, 0.345, 0.3, 0.155]);
    label(s, "DIRECTION 2  ·  COMPONENT LOT → EVERY RUN IT REACHED  (what it affected)", 0.6, 3.6, 9);
    const r2 = placeShot(s, S.r_dir2, 0.6, 3.95, 12.13, 1.65);
    mark(s, r2, [0.002, 0.135, 0.24, 0.225]); mark(s, r2, [0.39, 0.135, 0.605, 0.225]);
    const yS = r2.y + r2.h + 0.35;
    s.addText("3", { x: 0.6, y: yS - 0.1, w: 0.8, h: 0.9, fontFace: F.head, fontSize: 48, color: C.signal, margin: 0, isTextBox: true });
    s.addText("production runs reached by this one handle lot", { x: 1.35, y: yS + 0.05, w: 3.3, h: 0.65, fontFace: F.body, fontSize: 12.5, color: C.text, margin: 0, valign: "top", isTextBox: true });
    s.addText("8,698", { x: 4.9, y: yS - 0.1, w: 2.2, h: 0.9, fontFace: F.head, fontSize: 48, color: C.signal, margin: 0, isTextBox: true });
    s.addText("good units exposed. Recall scoped, not estimated.", { x: 7.05, y: yS + 0.05, w: 2.6, h: 0.65, fontFace: F.body, fontSize: 12.5, color: C.text, margin: 0, valign: "top", isTextBox: true });
    s.addText("In this prototype, direction 2 is keyed on the handle lot. The same formula pattern extends to filament and brass-wire lots.", {
      x: 9.9, y: yS, w: 2.85, h: 0.85, fontFace: F.body, fontSize: 10.5, italic: true, color: C.mute, margin: 0, valign: "top", isTextBox: true,
    });
    demo(s);
    folio(s, n++);
    notes(s, {
      say: `The Reverse Trace sheet works in two directions. Direction one goes from our production run back to its components: the handle lot, resin, masterbatch, mould, bristle supplier, filament and brass wire. Direction two flips it. Take a component lot, here the handle lot HL-DBR-26-0519, and it lists every other run that lot reached: three runs, with 8,698 good units exposed, and where each one was dispatched. That's the recall-readiness question. The scope of a recall is calculated, not estimated. One honest point: in this prototype, direction two is keyed on the handle lot, because that's where a brush's identity begins, and one moulding lot feeds one to three assembly runs. Tracing by filament lot would use exactly the same pattern on a different column.`,
      why: `Investigating one complaint is useful. Containing a problem across every affected batch is what really protects the customer and the brand.`,
      notice: `The dispatch numbers in the last column. You can go straight from a suspect lot to the shipments that need to be held or recalled.`,
      q: [
        ["What's the difference between forward and reverse traceability?", "Backward, or upstream, goes from a finished product to its inputs: what went into it. Forward, or downstream, goes from an input lot to every product and shipment it reached. In my workbook, the 'Reverse Trace' sheet does both; I call the lot-to-runs direction reverse traceability because it runs opposite to the complaint investigation."],
        ["How does it find the runs?", "COUNTIF of the handle lot in Master Traceability gives the number of runs, SUMIFS of good quantity gives the exposure, and INDEX with SMALL(IF(...)) lists each run."],
        ["The root cause was a filament lot, but you traced a handle lot. Why?", "Because in this version direction two is built on the handle lot. Extending it to the filament AR number is the same formula on another column. I'd add that next."],
      ],
      next: `So traceability tells us where a product came from. But there was a second question from the line study.`,
    });
  }

  // ───────────────── ACT 10 — OEE ─────────────────
  // 24. The second question
  {
    const s = pres.addSlide();
    s.background = { color: C.paper };
    act(s, 10, "A second question");
    s.addText("Traceability tells us where the product came from.", { x: 0.6, y: 1.0, w: 12, h: 0.6, fontFace: F.head, fontSize: 26, color: C.mute, margin: 0, isTextBox: true });
    s.addText("But what tells us how efficiently it was produced?", { x: 0.6, y: 1.6, w: 12, h: 0.7, fontFace: F.head, fontSize: 32, color: C.text, margin: 0, isTextBox: true });
    const parts = [
      ["Availability", "Run time", "Planned production time", "Did the line run when it was supposed to?", "Stops"],
      ["Performance", "Ideal cycle time × Total count", "Run time", "When it ran, did it run at full speed?", "Slow running"],
      ["Quality", "Good count", "Total count", "Of what it made, how much was good?", "Rejects"],
    ];
    const cw = 3.2, g = 0.55, y = 3.0;
    parts.forEach((p, i) => {
      const x = 0.6 + i * (cw + g);
      s.addText(p[0], { x, y, w: cw, h: 0.5, fontFace: F.head, fontSize: 24, color: C.text, margin: 0, isTextBox: true });
      s.addText(p[1], { x, y: y + 0.7, w: cw, h: 0.4, fontFace: F.body, fontSize: 13.5, color: C.text, align: "center", margin: 0, isTextBox: true });
      s.addShape("line", { x: x + 0.2, y: y + 1.15, w: cw - 0.4, h: 0, line: { color: C.text, width: 1.25 } });
      s.addText(p[2], { x, y: y + 1.2, w: cw, h: 0.4, fontFace: F.body, fontSize: 13.5, color: C.text, align: "center", margin: 0, isTextBox: true });
      s.addText(p[3], { x, y: y + 1.85, w: cw, h: 0.6, fontFace: F.body, fontSize: 12.5, italic: true, color: C.steel, margin: 0, valign: "top", isTextBox: true });
      s.addText(`LOSS: ${p[4].toUpperCase()}`, { x, y: y + 2.5, w: cw, h: 0.3, fontFace: F.body, fontSize: 10, bold: true, color: C.signal, charSpacing: 2, margin: 0, isTextBox: true });
      if (i < 2) s.addText("×", { x: x + cw, y, w: g, h: 1.6, fontFace: F.head, fontSize: 30, color: C.mute, align: "center", valign: "middle", margin: 0, isTextBox: true });
    });
    s.addShape("rect", { x: 11.8 - 0.05, y: y - 0.05, w: 1.15, h: 1.7, fill: { color: C.ink }, line: { type: "none" } });
    s.addText("= OEE", { x: 11.75, y: y - 0.05, w: 1.15, h: 1.7, fontFace: F.head, fontSize: 20, bold: true, color: C.white, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText("It splits the line study's single ~27,500-unit gap into three losses you can act on.", {
      x: 0.6, y: 6.3, w: 12, h: 0.45, fontFace: F.head, fontSize: 17, italic: true, color: C.signal, margin: 0, isTextBox: true,
    });
    folio(s, n++);
    notes(s, {
      say: `Traceability tells us where a product came from. But the line study raised a different question: how efficiently was it produced? That's what OEE, Overall Equipment Effectiveness, answers. It's Availability times Performance times Quality. Availability is run time over planned production time, so did the line run when it should have? Performance is ideal cycle time times total count over run time, so when it ran, did it run at full speed? Quality is good count over total count, so of what it made, how much was good? Multiply them and you get OEE. It takes the one loss number from the line study and splits it into stops, slow running and rejects.`,
      why: `A single gap number tells you there's a problem. OEE tells you which kind of problem, which tells you who should act: maintenance, process or quality.`,
      notice: `Each factor maps to a type of loss. That's why it's useful for managers, not just a formula.`,
      q: [
        ["Why multiply rather than average?", "Because losses compound. If you only run 80% of the time, at 90% speed, with 95% good, you only get 0.8 × 0.9 × 0.95 = 68% of ideal good output."],
        ["What's a good OEE?", "85% is often quoted as world-class for discrete manufacturing, but I'd use it as a reference point, not a target, without knowing the line and product mix."],
        ["Is Performance the same as efficiency?", "No. Performance compares actual speed with ideal speed during run time only. Production efficiency, in my dashboard, compares actual output with planned output."],
      ],
      next: `Here's how that looks in the system.`,
    });
  }

  // 28. OEE dashboard — full-width crop with the workbook's own numbers below
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    act(s, 10, "A second question");
    question(s, "How efficiently did the lines perform?", { size: 28 });
    const r = placeShot(s, S.oee_top, 0.6, 1.5, 12.13, 3.75);
    pinsOn(s, r, [[0.12, 0.62], [0.28, 0.62], [0.445, 0.62], [0.61, 0.62], [0.14, 0.905], [0.3, 0.905], [0.46, 0.905], [0.625, 0.905]]);
    const yF = r.y + r.h + 0.35;
    const cards = [
      ["Availability", "620,878 ÷ 733,920", "84.6%", "run minutes ÷ planned minutes  (pins 2, 5, 6)"],
      ["Performance", "actual ÷ ideal capability", "89.6%", "ideal speed from the machine master  (pin 3)"],
      ["Quality", "5,703,481 ÷ 5,842,931", "97.6%", "good ÷ total produced  (pin 4)"],
      ["OEE", "0.846 × 0.896 × 0.976", "74.0%", "the three losses multiplied  (pin 1)"],
    ];
    cards.forEach((c, i) => {
      const x = 0.6 + i * 3.07, last = i === 3;
      s.addShape("rect", { x, y: yF, w: 2.9, h: 1.35, fill: { color: last ? C.ink : C.paper }, line: { type: "none" } });
      s.addText(c[0].toUpperCase(), { x: x + 0.18, y: yF + 0.1, w: 2.6, h: 0.25, fontFace: F.body, fontSize: 9.5, bold: true, charSpacing: 2, color: last ? C.signal : C.mute, margin: 0, isTextBox: true });
      s.addText(c[2], { x: x + 0.18, y: yF + 0.33, w: 1.3, h: 0.5, fontFace: F.head, fontSize: 24, color: last ? C.white : C.text, margin: 0, isTextBox: true });
      s.addText(c[1], { x: x + 1.35, y: yF + 0.38, w: 1.5, h: 0.45, fontFace: F.body, fontSize: 10, color: last ? "D5D9DC" : C.steel, margin: 0, valign: "middle", isTextBox: true });
      s.addText(c[3], { x: x + 0.18, y: yF + 0.88, w: 2.6, h: 0.4, fontFace: F.body, fontSize: 9.5, italic: true, color: last ? "AEB4B9" : C.mute, margin: 0, valign: "top", isTextBox: true });
    });
    demo(s);
    folio(s, n++);
    notes(s, {
      say: `This is the OEE module. For the filter selected, it shows OEE, 74%, and its three parts: availability 84.6%, performance 89.6% and quality 97.6%. The second row shows where they come from: 733,920 minutes planned, 620,878 minutes actually running, and the downtime split into unplanned and planned. Two technical points matter here. First, ideal speed is a property of the machine, held in the machine master, not typed on the production record. Otherwise performance measures the data entry rather than the equipment. Second, when I combine runs, I add up the minutes and the units first and then divide. That's a ratio of sums, not an average of each run's percentage. And to be explicit: this is calculated from recorded data. There's no SCADA, PLC or IoT connection.`,
      why: `It connects back to the line study. The single gap now has a structure: how much was stops, how much was speed and how much was rejects.`,
      notice: `84.6% × 89.6% × 97.6% = 74.0%. The arithmetic can be checked on the slide.`,
      q: [
        ["Why ratio of sums instead of average of ratios?", "Averaging percentages gives a short run the same weight as a long one. Say run A is 1 hour at 50% availability and run B is 9 hours at 90%. The simple average is 70%, but the real figure is (0.5 + 8.1) ÷ 10 = 86%. Summing first gives the correct weighted result."],
        ["Where do run time and downtime come from?", "Scheduled minutes come from the production record. Every stoppage is logged in the Downtime register as an event with the Run ID, category, reason and minutes. SUMIFS of downtime by Run ID gives the loss, and run time is scheduled minus downtime."],
        ["Is 74% good?", "85% is often quoted as world-class, and the dashboard shows it as a reference. But this is demonstration data, so I wouldn't draw a conclusion about JHS from it."],
      ],
      next: `So, with traceability and OEE in place, what actually changed?`,
    });
  }

  // ───────────────── ACT 11 — WHAT CHANGED ─────────────────
  {
    const s = pres.addSlide();
    s.background = { color: C.paper };
    act(s, 11, "What changed?");
    question(s, "What changed?", { size: 36 });
    const rows = [
      ["Disconnected information", "Connected information"],
      ["Manual investigation", "Structured retrieval"],
      ["Batch-number searching", "Four-field identification + Production Run ID"],
      ["Manual reporting", "Dashboard-based reporting"],
      ["A single loss number", "Availability + Performance + Quality"],
      ["Manual material investigation", "Reverse traceability"],
    ];
    s.addText("BEFORE", { x: 0.6, y: 1.75, w: 4, h: 0.3, fontFace: F.body, fontSize: 10, bold: true, color: C.mute, charSpacing: 3, margin: 0, isTextBox: true });
    s.addText("WITH THE MES", { x: 6.2, y: 1.75, w: 4, h: 0.3, fontFace: F.body, fontSize: 10, bold: true, color: C.signal, charSpacing: 3, margin: 0, isTextBox: true });
    rows.forEach((r, i) => {
      const y = 2.15 + i * 0.72;
      s.addShape("line", { x: 0.6, y: y + 0.66, w: 12.1, h: 0, line: { color: C.rule, width: 0.75 } });
      s.addText(r[0], { x: 0.6, y, w: 4.6, h: 0.6, fontFace: F.body, fontSize: 16, color: C.mute, valign: "middle", margin: 0, isTextBox: true });
      s.addText("→", { x: 5.3, y, w: 0.7, h: 0.6, fontFace: F.body, fontSize: 18, color: C.signal, align: "center", valign: "middle", margin: 0, isTextBox: true });
      s.addText(r[1], { x: 6.2, y, w: 6.5, h: 0.6, fontFace: F.head, fontSize: 19, color: C.text, valign: "middle", margin: 0, isTextBox: true });
    });
    s.addText("I didn't formally measure time saved, so I'm not claiming a percentage. What changed is how the information is structured.", {
      x: 0.6, y: 6.6, w: 12, h: 0.4, fontFace: F.body, fontSize: 11.5, italic: true, color: C.mute, margin: 0, isTextBox: true,
    });
    folio(s, n++);
    notes(s, {
      say: `So what changed? Information that used to live in separate registers is now connected through one key. An investigation is a structured retrieval rather than a manual search. Instead of searching by batch number, we identify the run with four fields and a Production Run ID. Reporting comes from a dashboard rather than manual compilation. A single loss number becomes availability, performance and quality. And material investigations can be done with reverse traceability. I haven't put a percentage on any of this, because I didn't formally measure time saved, and I don't want to claim a number I can't defend.`,
      why: `It's honest about the impact. The change is structural, and that's what the project can defensibly claim.`,
      notice: `No invented ROI.`,
      q: [
        ["So how do you know it's better?", "Each of the six requirements can now be answered from the workbook, which I tested with scenarios. The next step would be to time investigations before and after in a pilot."],
        ["How would you measure impact if you had more time?", "Time from complaint to identified run, time to produce the daily report, and the number of manual look-ups per investigation, before and after a pilot."],
      ],
      next: `Beyond the system, the project taught me a lot.`,
    });
  }

  // ───────────────── ACT 12 — WHAT I LEARNT ─────────────────
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    act(s, 12, "What I learnt");
    question(s, "What did the project teach me?", { size: 30 });
    const cols = [
      ["THE PLANT", "Manufacturing understanding", "01",
        ["How material, people and machines actually move", "Where records are created, and why", "Traceability as a quality obligation", "OEE and where time really goes"]],
      ["THE SYSTEM", "Technical understanding", "02",
        ["Data modelling: masters vs. transactions", "Why a system key must be unique", "Validation before calculation", "Testing with real scenarios"]],
      ["THE MANAGER", "Managerial understanding", "03",
        ["Requirement gathering from users", "A system is only useful if people adopt it", "Scoping under time and tool constraints", "Being honest about what it can't do"]],
    ];
    const cw = 3.85, g = 0.3;
    cols.forEach((c, i) => {
      const x = 0.6 + i * (cw + g);
      s.addShape("rect", { x, y: 1.75, w: cw, h: 4.75, fill: { color: i === 0 ? C.paper : C.white }, line: { color: C.rule, width: 0.75 } });
      s.addText(c[2], { x: x + 0.3, y: 1.95, w: 1.5, h: 0.9, fontFace: F.head, fontSize: 48, color: i === 0 ? C.signal : C.faint, margin: 0, valign: "top", isTextBox: true });
      s.addText(c[0], { x: x + 0.3, y: 3.05, w: cw - 0.6, h: 0.3, fontFace: F.body, fontSize: 11, bold: true, color: C.signal, charSpacing: 3, margin: 0, isTextBox: true });
      s.addText(c[1], { x: x + 0.3, y: 3.37, w: cw - 0.6, h: 0.45, fontFace: F.head, fontSize: 17, color: C.text, margin: 0, isTextBox: true });
      s.addText(c[3].map((b, j) => ({ text: b, options: { bullet: true, breakLine: j < c[3].length - 1 } })), {
        x: x + 0.3, y: 4.05, w: cw - 0.6, h: 2.3, fontFace: F.body, fontSize: 14, color: C.steel, margin: 0, paraSpaceAfter: 10, valign: "top", isTextBox: true,
      });
    });
    folio(s, n++);
    notes(s, {
      say: `I'd put what I learned at three levels. At the plant level, I learned how a manufacturing operation actually works: how material moves, where records are created, why traceability is a quality obligation and not just a nice-to-have, and where time is really lost on a line. At the system level, I learned data modelling: separating master and transaction data, why a key has to be unique, why validation has to come before calculation, and how to test with realistic scenarios. And at the manager level, I learned that requirements come from users, that a system is only useful if people will actually fill it in, and how to scope a project under real time and tool constraints.`,
      why: `The learning maps directly to the three things an MBA operations role needs: process knowledge, analytical tools and managing change.`,
      notice: `Each learning is tied to something specific in the project.`,
      q: [
        ["What was the most difficult part?", "Understanding the operation well enough to know which questions mattered, and designing around the fact that batch numbers repeat. The Excel part was easier once that was clear."],
        ["What would you do differently?", "I'd involve the end users earlier in testing, and I'd plan a small pilot to measure before-and-after time."],
      ],
      next: `I also want to be honest about what this system is, and what it isn't.`,
    });
  }

  // ───────────────── ACT 13 — THE LIMIT ─────────────────
  {
    const s = pres.addSlide();
    s.background = { color: C.paper };
    act(s, 13, "The limit");
    question(s, "What this system is, and what it isn't.", { size: 30 });
    s.addShape("rect", { x: 0.6, y: 1.65, w: 5.8, h: 1.25, fill: { color: C.ink }, line: { type: "none" } });
    s.addText([{ text: "THIS IS", options: { fontSize: 10, bold: true, color: C.signal, charSpacing: 3, breakLine: true } },
      { text: "A practical, working Excel-based MES prototype.", options: { fontFace: F.head, fontSize: 19, color: C.white } }],
      { x: 0.85, y: 1.7, w: 5.4, h: 1.15, fontFace: F.body, margin: 0, valign: "middle", isTextBox: true });
    s.addShape("rect", { x: 6.9, y: 1.65, w: 5.8, h: 1.25, fill: { color: C.white }, line: { color: C.faint, width: 1 } });
    s.addText([{ text: "THIS IS NOT", options: { fontSize: 10, bold: true, color: C.mute, charSpacing: 3, breakLine: true } },
      { text: "A full enterprise MES.", options: { fontFace: F.head, fontSize: 19, color: C.text } }],
      { x: 7.15, y: 1.7, w: 5.4, h: 1.15, fontFace: F.body, margin: 0, valign: "middle", isTextBox: true });
    s.addText("LIMITATIONS", { x: 0.6, y: 3.25, w: 5, h: 0.3, fontFace: F.body, fontSize: 10, bold: true, color: C.mute, charSpacing: 3, margin: 0, isTextBox: true });
    const lim = [
      ["Scalability", "Excel slows down as registers grow"],
      ["Concurrent use", "Not built for many users editing at once"],
      ["User roles", "No role-based access control"],
      ["Audit trail", "No record of who changed what"],
      ["Manual entry", "Only as good as the data typed in"],
      ["No real-time capture", "No direct machine connection"],
    ];
    lim.forEach((l, i) => {
      const x = 0.6 + (i % 3) * 4.1, y = 3.65 + Math.floor(i / 3) * 0.95;
      s.addText([{ text: l[0], options: { bold: true, color: C.text, breakLine: true } }, { text: l[1], options: { color: C.mute } }],
        { x, y, w: 3.9, h: 0.8, fontFace: F.body, fontSize: 13, margin: 0, valign: "top", isTextBox: true });
    });
    s.addText("FUTURE SCOPE", { x: 0.6, y: 5.75, w: 5, h: 0.3, fontFace: F.body, fontSize: 10, bold: true, color: C.signal, charSpacing: 3, margin: 0, isTextBox: true });
    const fut = ["Barcode", "RFID", "SQL", "IoT", "ERP", "Power BI", "Predictive analytics"];
    let fx = 0.6;
    fut.forEach((f) => {
      const w = 0.35 + f.length * 0.105;
      s.addShape("roundRect", { x: fx, y: 6.15, w, h: 0.48, rectRadius: 0.24, fill: { color: C.white }, line: { color: C.signal, width: 1 } });
      s.addText(f, { x: fx, y: 6.15, w, h: 0.48, fontFace: F.body, fontSize: 12.5, bold: true, color: C.text, align: "center", valign: "middle", margin: 0, isTextBox: true });
      fx += w + 0.2;
    });
    folio(s, n++);
    notes(s, {
      say: `This is a practical, working Excel-based MES prototype. It isn't a full enterprise MES, and I don't want to present it as one. Excel will slow down as the registers grow. It isn't built for many users editing at the same time. There are no user roles and no audit trail. It depends on people entering data correctly, and it doesn't capture data directly from machines. The future path is clear, though. Barcodes or RFID to capture batch and material data at source, SQL for the data layer, IoT for machine run time and counts, integration with ERP, Power BI for reporting, and eventually predictive analytics on downtime and quality.`,
      why: `Being clear about limits makes the claims I do make more credible.`,
      notice: `The data model, meaning the masters, the registers and the Run ID, carries over to any of the future platforms. Only the tool changes.`,
      q: [
        ["Why Excel then?", "It's what the plant already uses, it needs no new licences or IT approval, and it let me build and test a working prototype within the internship. The design is what matters, and it transfers."],
        ["How scalable is this?", "Fine for a prototype and a pilot on a few lines. For plant-wide, multi-user use, the registers should move to a database, with Excel or Power BI on top."],
      ],
      next: `So, to finish.`,
    });
  }

  // ───────────────── ACT 14 — FINAL INSIGHT ─────────────────
  {
    const s = pres.addSlide();
    s.background = { color: C.ink };
    act(s, 14, "Final insight", true);
    s.addText("The hardest part wasn't\nbuilding the workbook.", {
      x: 0.6, y: 2.3, w: 12, h: 2.4, fontFace: F.head, fontSize: 54, color: C.white, margin: 0, valign: "top", isTextBox: true,
    });
    folio(s, n++, true);
    notes(s, {
      say: `If I had to sum up the whole internship in one line: the hardest part wasn't building the workbook.\n\n[PAUSE]`,
      why: `The pause lets the panel anticipate the answer.`,
      notice: `—`,
      q: [],
      next: `(Advance.)`,
    });
  }
  {
    const s = pres.addSlide();
    s.background = { color: C.ink };
    act(s, 14, "Final insight", true);
    s.addText("It was understanding the operation well enough to know what the system needed to answer.", {
      x: 0.6, y: 1.3, w: 11.6, h: 2.3, fontFace: F.head, fontSize: 38, color: C.white, margin: 0, valign: "top", isTextBox: true,
    });
    const ch = ["Manufacturing understanding", "Structured data", "Traceability", "Decision support"];
    const cw = 2.75, g = 0.33;
    ch.forEach((c, i) => {
      const x = 0.6 + i * (cw + g);
      s.addShape("rect", { x, y: 4.4, w: cw, h: 1.0, fill: { color: i === 3 ? C.signal : "2A3138" }, line: { type: "none" } });
      s.addText(c, { x: x + 0.15, y: 4.4, w: cw - 0.3, h: 1.0, fontFace: F.body, fontSize: 15, bold: true, color: C.white, align: "center", valign: "middle", margin: 0, isTextBox: true });
      if (i < 3) s.addText("→", { x: x + cw, y: 4.4, w: g, h: 1.0, fontFace: F.body, fontSize: 16, color: C.signal, align: "center", valign: "middle", margin: 0, isTextBox: true });
    });
    folio(s, n++, true);
    notes(s, {
      say: `It was understanding the operation well enough to know what the system needed to answer. Once I understood the plant, I could structure the data. Once the data was structured, traceability was possible. And once it was traceable and measurable, it could support decisions.`,
      why: `It ties the whole story together: the plant came first, the tool came second.`,
      notice: `The chain reads left to right as the story of the project.`,
      q: [["What was your personal contribution?", "The process study, the line observation, the requirement definition, the data model including the Production Run ID and the four-field trace logic, building all the sheets and formulas, and the testing and refinement."]],
      next: `So, back to the complaint.`,
    });
  }
  // Close: loop back to the opening
  {
    const s = pres.addSlide();
    s.background = { color: C.ink };
    s.addText("“The bristles are getting off.”", { x: 0.6, y: 1.2, w: 12, h: 0.7, fontFace: F.head, fontSize: 26, italic: true, color: "D5D9DC", margin: 0, isTextBox: true });
    s.addText("Now we know where to look.", { x: 0.6, y: 1.9, w: 12, h: 0.7, fontFace: F.head, fontSize: 26, color: C.white, margin: 0, isTextBox: true });
    s.addText("Thank you.", { x: 0.6, y: 4.3, w: 12, h: 1.2, fontFace: F.head, fontSize: 66, color: C.white, margin: 0, isTextBox: true });
    s.addText("Questions welcome.", { x: 0.6, y: 5.5, w: 12, h: 0.5, fontFace: F.body, fontSize: 20, bold: true, color: C.white, margin: 0, isTextBox: true });
    s.addText(`${ctx.me}  ·  ${ctx.programme}`, { x: 0.6, y: 6.7, w: 12, h: 0.3, fontFace: F.body, fontSize: 12, color: "C9CDD1", margin: 0, isTextBox: true });
    notes(s, {
      say: `We started with a customer saying, "The bristles are getting off," and a plant that had the data but no easy way to connect it. Now, from the four fields on the pack, we can find the right production run, see its materials, quality and machine history, and trace any suspect material to every batch it touched. Thank you. I'm happy to take your questions, or to show you any part of the workbook live.`,
      why: `It closes the loop the opening created.`,
      notice: `The ending answers the opening question.`,
      q: [["See the viva guide for the full question bank.", "—"]],
      next: `Questions.`,
    });
  }
};
