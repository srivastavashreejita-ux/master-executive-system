const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, ShadingType,
  BorderStyle, AlignmentType, LevelFormat, PageBreak, Footer, PageNumber, TableOfContents,
} = require("docx");
const V = require("./viva_content");
const NOTES = JSON.parse(fs.readFileSync(path.join(__dirname, "notes.json"), "utf8"));

const ORANGE = "C44A17", INK = "1A1D21", MUTE = "5F666C", TINT = "F3F4F2", SOFT = "FBE9E1";
const HEAD = "Cambria", BODY = "Calibri";
const W = 9026; // A4 text width with 1" margins (DXA)

const p = (text, o = {}) => new Paragraph({ spacing: { after: o.after ?? 120, before: o.before ?? 0 }, alignment: o.align,
  children: Array.isArray(text) ? text : [new TextRun({ text, font: BODY, size: o.size ?? 22, color: o.color ?? INK, bold: o.bold, italics: o.italics })] });
const r = (text, o = {}) => new TextRun({ text, font: o.font ?? BODY, size: o.size ?? 22, color: o.color ?? INK, bold: o.bold, italics: o.italics });
const h1 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 240, after: 160 }, children: [new TextRun({ text: t, font: HEAD, size: 36, color: INK })] });
const h2 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 280, after: 100 }, keepNext: true, children: [new TextRun({ text: t, font: HEAD, size: 28, color: ORANGE })] });
const label = (t) => new Paragraph({ spacing: { before: 100, after: 40 }, keepNext: true, children: [new TextRun({ text: t.toUpperCase(), font: BODY, size: 17, bold: true, color: MUTE, characterSpacing: 40 })] });
const bullet = (children) => new Paragraph({ numbering: { reference: "bul", level: 0 }, spacing: { after: 60 }, children: Array.isArray(children) ? children : [r(children)] });

const none = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const thin = { style: BorderStyle.SINGLE, size: 4, color: "D6D8D6" };
function box(lines, fill, o = {}) {
  return new Table({
    width: { size: W, type: WidthType.DXA }, columnWidths: [W],
    rows: [new TableRow({ children: [new TableCell({
      width: { size: W, type: WidthType.DXA }, shading: { type: ShadingType.CLEAR, color: "auto", fill },
      borders: { top: none, bottom: none, left: none, right: none },
      margins: { top: 120, bottom: 120, left: 200, right: 200 },
      children: lines.map((l) => new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: l, font: o.font ?? "Consolas", size: o.size ?? 20, color: INK, italics: o.italics })] })),
    })] })],
  });
}
function table(rows, widths, head) {
  const mk = (cells, isHead) => new TableRow({ tableHeader: isHead, children: cells.map((c, i) => new TableCell({
    width: { size: widths[i], type: WidthType.DXA },
    shading: isHead ? { type: ShadingType.CLEAR, color: "auto", fill: "2A3138" } : (i === 0 ? { type: ShadingType.CLEAR, color: "auto", fill: TINT } : undefined),
    borders: { top: thin, bottom: thin, left: thin, right: thin },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({ children: [new TextRun({ text: c, font: BODY, size: 20, bold: isHead || i === 0, color: isHead ? "FFFFFF" : INK })] })],
  })) });
  return new Table({ width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA }, columnWidths: widths,
    rows: [...(head ? [mk(head, true)] : []), ...rows.map((x) => mk(x, false))] });
}
const spacer = () => new Paragraph({ spacing: { after: 60 }, children: [] });

const body = [];
// Cover
body.push(new Paragraph({ spacing: { before: 2400, after: 120 }, children: [r("SUMMER INTERNSHIP PROJECT  ·  VIVA GUIDE", { size: 20, bold: true, color: ORANGE })] }));
body.push(new Paragraph({ spacing: { after: 240 }, children: [r("From a complaint to a system", { font: HEAD, size: 60 })] }));
body.push(p("Development of an Excel-based Manufacturing Execution System at JHS Svendgaard Laboratories Ltd., Operations Department, Kala-Amb, Himachal Pradesh", { size: 26, color: MUTE }));
body.push(p([r("Shreejita Srivastava", { bold: true }), r("  ·  MBA, IIIT Allahabad  ·  IMB2025026", { color: MUTE })], { before: 480 }));
body.push(p("Internal guide: Dr. Vineet Tiwari  ·  External guide: Mr. Paramveer Singh", { color: MUTE }));
body.push(p("Companion to SIP_Story_Deck.pptx (35 slides)", { color: MUTE, italics: true, before: 240 }));
body.push(new Paragraph({ children: [new PageBreak()] }));

body.push(h1("Contents"));
body.push(new TableOfContents("Contents", { hyperlink: true, headingStyleRange: "1-1" }));
body.push(p("If the contents list is empty, right-click it in Word and choose Update Field.", { italics: true, color: MUTE, size: 18 }));
body.push(new Paragraph({ children: [new PageBreak()] }));

// 1. 60 seconds
body.push(h1("1. The project in 60 seconds"));
body.push(p("Use this when the panel says “Tell us about your project” or “Summarise it.”"));
body.push(box([
  "I spent seven weeks in the Operations department at JHS's Kala-Amb plant. I started with a question: if a customer says “the bristles are getting off”, how do we find out what happened?",
  "The pack gives us four things: batch number, product, colour and manufacturing date. But batch numbers repeat, and the information we need sits in separate registers for production, quality, material, downtime and dispatch. The plant had the data; the problem was how it was connected.",
  "So I built an Excel-based MES: 27 sheets in five layers. The key design decision was to keep the printed batch number and add a unique internal Production Run ID that every record carries. From the four pack fields, the Trace Report finds the right run; the manufacturing record, complaint tool and reverse trace connect everything else. A second module calculates OEE, splitting losses into availability, performance and quality.",
  "It's a working prototype on a demonstration dataset, not an enterprise MES, and I haven't claimed any time savings. The biggest lesson: the hard part wasn't the workbook. It was understanding the operation well enough to know what the system needed to answer.",
], TINT, { font: BODY, size: 22 }));

// 2. Numbers
body.push(h1("2. Numbers to know cold"));
body.push(table(V.numbers, [2300, W - 2300], ["Item", "Figure"]));
body.push(spacer());
body.push(label("Traps to avoid"));
V.traps.forEach((t) => body.push(bullet(t)));
body.push(new Paragraph({ children: [new PageBreak()] }));

// 3. Concepts
body.push(h1("3. Concepts and formulas"));
body.push(p("For each concept: what it is, the formula as used in the workbook, the variables, a worked example from the workbook, why it matters, and a line you can say to the panel. Worked examples use the story case PR-2026-00630 wherever possible, so every answer ties back to the deck."));
V.concepts.forEach((c, i) => {
  body.push(h2(`${i + 1}. ${c.t}`));
  body.push(p(c.line));
  if (c.formula) { body.push(label("Formula")); body.push(box(c.formula.split("\n"), SOFT)); }
  if (c.vars.length) { body.push(label("Variables")); body.push(table(c.vars, [2200, W - 2200])); }
  body.push(label("Worked example")); body.push(p(c.ex));
  body.push(label("Why it matters")); body.push(p(c.why));
  body.push(label("How to explain it to the panel")); body.push(p("“" + c.say + "”", { italics: true }));
  if (c.note) { body.push(box([c.note], TINT, { font: BODY, size: 20, italics: true })); }
});
body.push(new Paragraph({ children: [new PageBreak()] }));

// 4. Questions
body.push(h1("4. Viva question bank"));
body.push(p("Model answers in your own voice. Keep each to 30–45 seconds, then stop and let the panel follow up."));
V.questions.forEach((q, i) => {
  body.push(new Paragraph({ spacing: { before: 200, after: 60 }, keepNext: true, children: [r(`Q${i + 1}. `, { bold: true, color: ORANGE }), r(q[0], { bold: true, font: HEAD, size: 24 })] }));
  body.push(p(q[1]));
});
body.push(new Paragraph({ children: [new PageBreak()] }));

// 5. Script
body.push(h1("5. Slide-by-slide speaker script"));
body.push(p("The same notes are in the deck's speaker notes. Read them aloud twice before the viva, then present from the slides, not from this page."));
NOTES.forEach((nt, i) => {
  body.push(h2(`Slide ${i + 1}  ·  ${V.slideTitles[i]}`));
  body.push(label("What I say")); nt.say.split("\n\n").forEach((para) => body.push(p(para)));
  body.push(label("Why it matters")); body.push(p(nt.why));
  body.push(label("What the panel should notice")); body.push(p(nt.notice));
  if ((nt.q || []).length) {
    body.push(label("Likely questions and my answers"));
    nt.q.forEach((q) => { body.push(p([r(q[0], { bold: true })], { after: 40 })); body.push(p(q[1])); });
  }
  body.push(label("Transition")); body.push(p(nt.next, { italics: true, color: MUTE }));
});

const doc = new Document({
  creator: "Shreejita Srivastava", title: "SIP Viva Guide",
  styles: {
    default: { document: { run: { font: BODY, size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: HEAD, size: 36 }, paragraph: { outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: HEAD, size: 28 }, paragraph: { outlineLevel: 1 } },
    ],
  },
  numbering: { config: [{ reference: "bul", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 440, hanging: 260 } } } }] }] },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ children: ["SIP Viva Guide  ·  ", PageNumber.CURRENT], font: BODY, size: 16, color: MUTE })] })] }) },
    children: body,
  }],
});
Packer.toBuffer(doc).then((b) => { fs.writeFileSync(path.join(__dirname, "..", "SIP_Viva_Guide.docx"), b); console.log("ok"); });
