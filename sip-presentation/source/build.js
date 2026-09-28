const pptxgen = require("pptxgenjs");
const path = require("path");
const IMG = path.join(__dirname, "photos");
const crops = require("./crops/index.json");
const shots = {};
for (const [k, v] of Object.entries(crops)) shots[k] = { path: path.join(__dirname, v.path), ar: v.ar };

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "Shreejita Srivastava";
pres.title = "From a complaint to a system: SIP at JHS Svendgaard Laboratories";

const ctx = {
  me: "Shreejita Srivastava",
  programme: "MBA, IIIT Allahabad  ·  IMB2025026  ·  SIP 2026",
  photos: { opener: path.join(IMG, "4.jpg"), machine: path.join(IMG, "4.jpg"), aerial: path.join(IMG, "1.jpg"), yard: path.join(IMG, "3.jpg"), skyline: path.join(IMG, "2.jpg") },
  shots,
  sample: { batch: "JHS-26433", product: "Dabur Red Toothbrush — Medium", productShort: "Dabur Red\nToothbrush\nMedium", colour: "Red", colourHex: "C8322B", mfg: "14-Jul-26", mfgPrinted: "14/07/2026" },
  batchWhy: "Batch numbers are printed codes drawn from a finite annual series. The same number comes round again later in the year, often on a different product and colour.",
  batchWhySay: "They're printed codes from a finite annual series, so the same number recurs later in the year, often on a different product and a different colour.",
  repeatRows: [
    ["JHS-26433", "Dabur Red Toothbrush — Soft", "White", "12-Jun-26"],
    ["JHS-26433", "Dabur Red Toothbrush — Medium", "Black", "27-Jun-26"],
    ["JHS-26433", "Dabur Red Toothbrush — Medium", "Red", "14-Jul-26"],
    ["JHS-26433", "Babool Family Pack Toothbrush", "Violet", "31-Jul-26"],
    ["JHS-26433", "Babool Family Pack Toothbrush", "Violet", "18-Aug-26"],
    ["JHS-26433", "Dabur Red Toothbrush — Soft", "White", "04-Sep-26"],
  ],
  plantDesc: "Oral care: toothpaste, toothbrushes, mouthwash",
  plantSay: "JHS is an oral-care manufacturer making toothpaste, toothbrushes and mouthwash, with its corporate office in New Delhi.",
  duration: "Seven weeks, 1 June – 17 July 2026",
  registerFormat: "Both. Each function kept its own departmental register or spreadsheet. The records were generally accurate. The issue was that they weren't connected to each other.",
  actualCountSource: "It's the output registered for that cycle, about 40,000 units. That's why I keep the approximate figure rather than implying false precision.",
  versionLabel: "JHS MES v3.0, 27 sheets",
  phaseTiming: "I didn't run it as fixed time-boxes. Roughly, the first weeks went on the plant induction, process study and requirements. Building and testing followed, and the identification logic was reworked late, once testing exposed the batch-number problem.",
  layers: [
    ["MASTER DATA", "Machine master with ideal speeds and OEE targets, SKU catalogue, lines, defects, materials, every dropdown source"],
    ["TRANSACTION REGISTERS", "RAW Production, Handle, QC, Dispatch, Downtime, Material Requirement Slip, GRN: the only sheets users type into"],
    ["CALCULATION", "OEE_Calculation and Master Traceability: one consolidated row per production run"],
    ["PRESENTATION", "Dashboard, OEE, Production, Quality, Downtime, Inventory, Alerts, Trace Report, Reverse Trace, Complaint Tool"],
    ["DOCUMENTATION", "Architecture, Instructions, Beginner Guide"],
  ],
  sheetCountLine: "27 worksheets. No macros. Data flows one way, so a dashboard figure and a trace record can't disagree.",
  runIdFormatSay: "It looks like PR-2026-00630.",
  runIdGen: "It's assigned when the run is logged in RAW Production, in the format PR-year-sequence. Master Traceability then validates it: a 'Duplicate Run ID' flag if it appears twice, and the production register flags a run with no QC record, an invalid handle lot or a quantity mismatch.",
  startNo: 1,
};

require("./story1")(pres, ctx);
require("./story2")(pres, ctx);

require("fs").writeFileSync(path.join(__dirname, "notes.json"), JSON.stringify(require("./lib").NOTES, null, 1));
pres.writeFile({ fileName: path.join(__dirname, "..", "SIP_Story_Deck.pptx") }).then((f) => console.log("wrote", f));
