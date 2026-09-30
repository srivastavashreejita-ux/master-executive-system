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
  photos: { opener: path.join(IMG, "3.jpg"), machine: path.join(IMG, "4.jpg"), aerial: path.join(IMG, "1.jpg"), yard: path.join(IMG, "3.jpg"), skyline: path.join(IMG, "2.jpg") },
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
  plantSay: "",
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
  // Real plant records photographed during the internship (cropped, upright)
  records: Object.fromEntries(Object.entries({
    params: "rec_process_params_11jun_c.jpg", fg13: "rec_fg_production_13jun_c.jpg", fg11: "rec_fg_production_11jun_c.jpg",
    trace1: "rec_traceability_p1_c.jpg", trace2: "rec_traceability_p2_c.jpg",
  }).map(([k, f]) => [k, { path: path.join(__dirname, "records", f), ar: require("./records/ratios.json")[f] }])),
  // Clients verified from public sources (not from the demonstration dataset). Logos are used only if present in logos/.
  clients: [
    { name: "Dabur India", logo: "dabur.png" },
    { name: "Patanjali Ayurved", logo: "patanjali.png" },
    { name: "Amway India", logo: "amway.png" },
  ],
  clientSources: [
    "Dabur India, Patanjali Ayurved, Amway India: named as contract-manufacturing clients in JHS Svendgaard's company profile (svendgaard.com/about.html) and investor material (svendgaard.com, Investor Presentation).",
    "Dabur partnership since 2000 and Amway collaboration: Manufacturing Today India, 'No shortcut, only perseverance: JHS Svendgaard's growth story' (manufacturingtodayindia.com/jhs-svendgaards-growth-story).",
    "Also listed as portfolio context by Sixth Sense Ventures (sixthsenseventures.com/portfolio/jhs-svendgaard-laboratories/).",
    "Patanjali products also appear on the plant's own FG production and traceability records photographed during the internship.",
  ].join("\n"),
  // Optional web photos for the moulding / tufting rows; filled in from photos/web_sources.json when the files exist
  webPhotos: (() => {
    const f = path.join(__dirname, "photos", "web_sources.json");
    if (!require("fs").existsSync(f)) return {};
    const j = JSON.parse(require("fs").readFileSync(f, "utf8"));
    const out = {};
    for (const [k, v] of Object.entries(j)) { const p = path.join(__dirname, "photos", v.file); if (require("fs").existsSync(p)) out[k] = { ...v, path: p }; }
    return out;
  })(),
};

require("./story1")(pres, ctx);
require("./story2")(pres, ctx);

require("fs").writeFileSync(path.join(__dirname, "notes.json"), JSON.stringify(require("./lib").NOTES, null, 1));
pres.writeFile({ fileName: path.join(__dirname, "..", "SIP_Story_Deck.pptx") }).then((f) => console.log("wrote", f));
