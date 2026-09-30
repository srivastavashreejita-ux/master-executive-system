// Speaker script (.docx) for the presenter's own deck, built from the aligned notes JSON.
// usage: node script_docx.js <notes.json> <out.docx>
const fs = require("fs");
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Footer, PageNumber, PageBreak, Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle } = require("docx");

const [, , IN, OUT] = process.argv;
const slides = JSON.parse(fs.readFileSync(IN, "utf8"));
const ORANGE = "C44A17", INK = "1A1D21", MUTE = "5F666C", TINT = "F3F4F2";
const HEAD = "Cambria", BODY = "Calibri", W = 9026;
const WPM = 130;

const r = (text, o = {}) => new TextRun({ text, font: o.font ?? BODY, size: o.size ?? 22, color: o.color ?? INK, bold: o.bold, italics: o.italics });
const p = (runs, o = {}) => new Paragraph({ spacing: { after: o.after ?? 100, before: o.before ?? 0, line: o.line }, keepNext: o.keepNext, children: Array.isArray(runs) ? runs : [r(runs, o)] });
const label = (t) => new Paragraph({ spacing: { before: 120, after: 40 }, keepNext: true, children: [r(t.toUpperCase(), { size: 16, bold: true, color: MUTE })] });
const words = (t) => (t || "").split(/\s+/).filter(Boolean).length;
const secs = (s) => Math.round((words(s["WHAT I SAY"]) / WPM) * 60);
const fmt = (sec) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;

const none = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const sayBox = (text) => new Table({
  width: { size: W, type: WidthType.DXA }, columnWidths: [W],
  rows: [new TableRow({ children: [new TableCell({
    width: { size: W, type: WidthType.DXA }, shading: { type: ShadingType.CLEAR, color: "auto", fill: TINT },
    borders: { top: none, bottom: none, left: none, right: none }, margins: { top: 140, bottom: 140, left: 220, right: 220 },
    children: text.split(/\n\n|\n/).filter(Boolean).map((para) => new Paragraph({ spacing: { after: 100, line: 300 },
      children: [r(para, { size: 25, italics: para.startsWith("[") })] })),
  })] })],
});

const total = slides.reduce((a, s) => a + secs(s), 0);
const body = [];
body.push(new Paragraph({ spacing: { before: 2200, after: 120 }, children: [r("SUMMER INTERNSHIP PROJECT  ·  SPEAKER SCRIPT", { size: 20, bold: true, color: ORANGE })] }));
body.push(new Paragraph({ spacing: { after: 200 }, children: [r("Development of an Excel-Based Manufacturing Execution System (MES)", { font: HEAD, size: 46 })] }));
body.push(p("JHS Svendgaard Laboratories Ltd., Kala-Amb  ·  1 June – 17 July 2026", { color: MUTE, size: 24 }));
body.push(p([r("Shreejita Srivastava", { bold: true }), r("  ·  MBA, IIIT Allahabad  ·  IMB2025026", { color: MUTE })], { before: 360 }));
body.push(p(`Script for Shreejita_SIP_Deck.pptx (${slides.length} slides). Estimated speaking time for the spoken parts: about ${Math.round(total / 60)} minutes at ${WPM} words a minute, plus the 40-second video.`, { color: MUTE, italics: true, before: 240 }));
body.push(label("How to use this script"));
["The grey box on each page is what you say. Read it aloud a few times, then speak from the slide, not from the page.",
 "The same text is in the deck's speaker notes, so Presenter View shows it on your laptop.",
 "Transitions are written for this deck's order: plant first, then the complaint, then the system.",
 "Likely questions come with short answers. Keep answers to 30–45 seconds, then stop."].forEach((t) => body.push(p([r("•  "), r(t)], { after: 60 })));

// running order table
body.push(label("Running order"));
const cw = [700, 6326, 2000];
const cell = (t, i, head) => new TableCell({ width: { size: cw[i], type: WidthType.DXA }, margins: { top: 50, bottom: 50, left: 100, right: 100 },
  shading: head ? { type: ShadingType.CLEAR, color: "auto", fill: "2A3138" } : undefined,
  children: [new Paragraph({ children: [r(t, { size: 19, bold: head, color: head ? "FFFFFF" : INK })] })] });
body.push(new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: cw,
  rows: [new TableRow({ tableHeader: true, children: ["#", "Slide", "Time"].map((t, i) => cell(t, i, true)) }),
    ...slides.map((s) => new TableRow({ children: [String(s.n), s.title, s.n === 20 ? fmt(secs(s)) + " + video" : fmt(secs(s))].map((t, i) => cell(t, i)) }))] }));

slides.forEach((s) => {
  body.push(new Paragraph({ children: [new PageBreak()] }));
  body.push(new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { after: 60 }, keepNext: true,
    children: [r(`Slide ${s.n}  `, { font: HEAD, size: 30, color: ORANGE }), r(s.title, { font: HEAD, size: 30 })] }));
  body.push(p(`about ${fmt(secs(s))}`, { color: MUTE, size: 18, after: 120 }));
  body.push(label("What I say"));
  body.push(sayBox(s["WHAT I SAY"] || ""));
  if (s["WHY IT MATTERS"]) { body.push(label("Why it matters")); body.push(p(s["WHY IT MATTERS"])); }
  if (s["WHAT THE PANEL SHOULD NOTICE"]) { body.push(label("What the panel should notice")); body.push(p(s["WHAT THE PANEL SHOULD NOTICE"])); }
  const qa = s["LIKELY PANEL QUESTIONS & MY ANSWERS"];
  if (qa && qa !== "—") {
    body.push(label("Likely questions and my answers"));
    qa.split(/\n\n/).forEach((blk) => {
      const m = blk.match(/^Q\d+\.\s*([\s\S]*?)\nA:\s*([\s\S]*)$/);
      if (m) { body.push(p([r(m[1], { bold: true })], { after: 30, keepNext: true })); body.push(p(m[2], { after: 110 })); }
      else body.push(p(blk));
    });
  }
  if (s["TRANSITION TO NEXT SLIDE"]) { body.push(label("Transition")); body.push(p(s["TRANSITION TO NEXT SLIDE"], { italics: true, color: MUTE })); }
  if (s["IMAGE SOURCES"]) { body.push(label("Image sources")); s["IMAGE SOURCES"].split("\n").filter(Boolean).forEach((l) => body.push(p(l, { size: 17, color: MUTE, after: 40 }))); }
});

const doc = new Document({
  creator: "Shreejita Srivastava", title: "SIP Speaker Script",
  styles: { default: { document: { run: { font: BODY, size: 22 } } },
    paragraphStyles: [{ id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: HEAD, size: 30 }, paragraph: { outlineLevel: 0 } }] },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1300, bottom: 1300, left: 1440, right: 1440 } } },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ children: ["SIP Speaker Script  ·  ", PageNumber.CURRENT], font: BODY, size: 16, color: MUTE })] })] }) },
    children: body,
  }],
});
Packer.toBuffer(doc).then((b) => { fs.writeFileSync(OUT, b); console.log("wrote", OUT, `(${slides.length} slides, ~${Math.round(total / 60)} min)`); });
