// Acts 1–8: the question, the investigation, the plant, the discovery,
// the line study, the requirements, the build, the video.
const { C, F, W, H, notes, act, folio, question, pin, photo, box } = require("./lib");
const fs = require("fs");

module.exports = function (pres, ctx) {
  const P = ctx.photos;
  let n = ctx.startNo;

  // ───────────────── ACT 1 — THE QUESTION ─────────────────
  // 1. Full-bleed photograph
  {
    const s = pres.addSlide();
    s.background = { color: C.ink };
    s.addImage({ path: P.opener, x: 0, y: 0, w: W, h: H, sizing: { type: "cover", w: W, h: H } });
    s.addShape("rect", { x: 0, y: 0, w: W, h: H, fill: { color: "000000", transparency: 42 }, line: { type: "none" } });
    s.addShape("rect", { x: 0, y: 4.2, w: W, h: 3.3, fill: { color: "000000", transparency: 30 }, line: { type: "none" } });
    s.addText("A SUMMER INTERNSHIP PROJECT  ·  JHS SVENDGAARD LABORATORIES LTD.", {
      x: 0.6, y: 0.45, w: 10, h: 0.3, fontFace: F.body, fontSize: 10.5, color: "E4E6E8", charSpacing: 3, margin: 0, isTextBox: true,
    });
    s.addText("Imagine a customer\nsends us this.", {
      x: 0.6, y: 4.45, w: 9.5, h: 1.9, fontFace: F.head, fontSize: 54, color: C.white, margin: 0, valign: "top", isTextBox: true,
    });
    s.addText(`${ctx.me}  ·  ${ctx.programme}`, {
      x: 0.6, y: 6.7, w: 9, h: 0.3, fontFace: F.body, fontSize: 12, color: "C9CDD1", margin: 0, isTextBox: true,
    });
    notes(s, {
      say: `Good morning. Before I tell you about my internship, I want to start with a situation. Imagine a customer sends us a complaint about one of our products. That's where this whole project begins.`,
      why: `The panel sees a real JHS machine before they see a single bullet point. It signals that this is a story from the shop floor, not a report written from outside.`,
      notice: `This is an actual photograph from the plant, the yard between production blocks, not a stock image.`,
      q: [["Is this a real complaint?", "No. It's a traceability scenario I used to design and test the system. I'll use it all the way through because it shows exactly what the MES has to do."]],
      next: `So what does the complaint say?`,
      src: "Photograph of the plant yard between production blocks, JHS Kala-Amb (image provided by the presenter).",
    });
    folio(s, n++, true);
  }

  // 2. The complaint
  {
    const s = pres.addSlide();
    s.background = { color: C.ink };
    act(s, 1, "The question", true);
    s.addText("CUSTOMER COMPLAINT", {
      x: 1.2, y: 1.9, w: 6, h: 0.3, fontFace: F.body, fontSize: 11, bold: true, color: C.signal, charSpacing: 4, margin: 0, isTextBox: true,
    });
    s.addText("“The bristles are\ngetting off.”", {
      x: 1.2, y: 2.35, w: 11, h: 2.8, fontFace: F.head, fontSize: 72, italic: true, color: C.white, margin: 0, valign: "top", isTextBox: true,
    });
    s.addText("Product: toothbrush   ·   Evidence: the pack in the customer's hand", {
      x: 1.2, y: 5.35, w: 10, h: 0.35, fontFace: F.body, fontSize: 14, color: "AEB4B9", margin: 0, isTextBox: true,
    });
    s.addText("A traceability scenario used to design and test this project, not a specific complaint from my internship period.", {
      x: 1.2, y: 6.6, w: 10.5, h: 0.3, fontFace: F.body, fontSize: 10, italic: true, color: "7D858B", margin: 0, isTextBox: true,
    });
    notes(s, {
      say: `The complaint is short: "The bristles are getting off." For the customer, that's the whole story. For the plant, it's the start of an investigation. I want to be clear that this is a scenario I built the project around. It isn't a specific complaint that came in while I was there. But it's a very realistic one for a toothbrush manufacturer.`,
      why: `Bristle retention is a core quality parameter for a toothbrush. It points back to tufting, to materials like filament and anchor wire, to machine settings and to QC checks. So one sentence touches almost every department.`,
      notice: `The disclaimer at the bottom. I'm not overstating what happened during the internship.`,
      q: [
        ["Why this particular complaint?", "Because bristle pull-out can come from the handle material, the filament, the anchor wire or the tufting machine. To answer it you have to connect production, material and quality data, which is exactly what the system does."],
        ["Did JHS actually receive such complaints?", "I'm not claiming that. I used it as a design scenario to test whether the system could handle a realistic investigation."],
      ],
      next: `So the question for the plant is simple to say and hard to answer.`,
    });
    folio(s, n++, true);
  }

  // 3. The question
  {
    const s = pres.addSlide();
    s.background = { color: C.ink };
    act(s, 1, "The question", true);
    s.addText("How do we find out\nwhat happened?", {
      x: 0.6, y: 2.0, w: 7.6, h: 2.6, fontFace: F.head, fontSize: 50, color: C.white, margin: 0, valign: "top", isTextBox: true,
    });
    const qs = ["Which production run made it?", "Which materials went into it?", "What did QC record that day?", "Which machine, which shift?", "Where else did that batch go?"];
    qs.forEach((q, i) => {
      s.addText(q, {
        x: 8.7, y: 1.95 + i * 0.72, w: 4.2, h: 0.5, fontFace: F.body, fontSize: 16,
        color: i === 0 ? "D9DCDF" : ["B5BBC0", "979EA4", "7C8389", "626A70"][i - 1], margin: 0, isTextBox: true,
      });
    });
    s.addShape("line", { x: 8.35, y: 2.0, w: 0, h: 3.4, line: { color: "3A4148", width: 1 } });
    s.addText("Every one of these answers sits in a different record.", {
      x: 0.6, y: 5.6, w: 7.5, h: 0.4, fontFace: F.body, fontSize: 15, color: C.signal, margin: 0, isTextBox: true,
    });
    notes(s, {
      say: `How do we find out what happened? To investigate properly, you need to know which production run made this brush, which materials went into it, what QC recorded, which machine and shift were involved, and where else that batch was sent. I'm not going to answer this yet. First, let's look at what we actually have in hand.`,
      why: `This sets up the rest of the presentation. Everything I built is really an answer to this one question.`,
      notice: `The questions fade as they go down. The first one, identifying the production run, has to be answered before any of the others.`,
      q: [["Isn't this QA's job rather than Operations?", "QA owns the investigation, but it depends on production, warehouse and dispatch records. Operations is where those records are created, so that's where the connection has to be made."]],
      next: `The only thing we have is the pack. So what does the pack tell us?`,
    });
    folio(s, n++, true);
  }

  // ───────────────── ACT 2 — THE INVESTIGATION ─────────────────
  // 4. What the pack tells us
  {
    const s = pres.addSlide();
    s.background = { color: C.paper };
    act(s, 2, "The investigation");
    question(s, "What does the pack tell us?");
    // Pack drawing
    s.addShape("roundRect", { x: 0.9, y: 1.95, w: 4.6, h: 4.9, rectRadius: 0.25, fill: { color: C.white }, line: { color: C.faint, width: 1 },
      shadow: { type: "outer", color: "000000", opacity: 0.12, blur: 10, offset: 3, angle: 90 } });
    // brush silhouette
    s.addShape("roundRect", { x: 2.95, y: 2.35, w: 0.5, h: 3.2, rectRadius: 0.25, fill: { color: ctx.sample.colourHex }, line: { type: "none" } });
    s.addShape("roundRect", { x: 2.85, y: 2.3, w: 0.7, h: 0.95, rectRadius: 0.12, fill: { color: "E9ECEE" }, line: { color: C.faint, width: 0.75 } });
    for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++)
      s.addShape("ellipse", { x: 2.93 + c * 0.2, y: 2.4 + r * 0.2, w: 0.12, h: 0.12, fill: { color: "FFFFFF" }, line: { color: "A9B0B5", width: 0.5 } });
    // printed coding block
    s.addShape("rect", { x: 1.3, y: 5.75, w: 3.8, h: 0.85, fill: { color: "F1F2F3" }, line: { color: C.rule, width: 0.5 } });
    s.addText(`B.No. ${ctx.sample.batch}\nMfd.  ${ctx.sample.mfgPrinted}`, {
      x: 1.45, y: 5.8, w: 3.5, h: 0.75, fontFace: "Courier New", fontSize: 14, bold: true, color: C.text, margin: 0, valign: "middle", isTextBox: true,
    });
    s.addText(ctx.sample.productShort, { x: 1.2, y: 2.25, w: 1.5, h: 0.9, fontFace: F.body, fontSize: 11, bold: true, color: C.jhs, margin: 0, isTextBox: true });
    pin(s, 1, 5.1, 5.95); pin(s, 2, 1.25, 2.25); pin(s, 3, 3.65, 4.3); pin(s, 4, 5.1, 6.4);
    const fields = [
      ["Batch Number", `${ctx.sample.batch}`, "Printed on the pack"],
      ["Product", ctx.sample.product, "Pack front / SKU"],
      ["Colour", ctx.sample.colour, "The brush itself"],
      ["Manufacturing Date", ctx.sample.mfg, "Printed on the pack"],
    ];
    fields.forEach((f, i) => {
      const y = 2.05 + i * 1.18;
      pin(s, i + 1, 6.75, y + 0.3, 0.44);
      s.addText(f[0], { x: 7.25, y: y, w: 5.4, h: 0.4, fontFace: F.head, fontSize: 22, color: C.text, margin: 0, isTextBox: true });
      s.addText([{ text: f[1], options: { bold: true, color: C.text } }, { text: `   ${f[2]}`, options: { color: C.mute } }],
        { x: 7.25, y: y + 0.45, w: 5.4, h: 0.35, fontFace: F.body, fontSize: 13, margin: 0, isTextBox: true });
    });
    s.addText("Values from the demonstration dataset", { x: 0.9, y: 6.95, w: 4.6, h: 0.25, fontFace: F.body, fontSize: 9, italic: true, color: C.mute, margin: 0, isTextBox: true });
    notes(s, {
      say: `From the pack we realistically get four pieces of information. The batch number and manufacturing date are printed on it. The product name is on the front, and the colour you can see from the brush itself. That's all the customer can give us. The whole investigation has to start from these four fields.`,
      why: `The design of the system starts from what's physically available at the point of complaint, not from what would be convenient to have.`,
      notice: `Only two of the four fields are actually printed codes. Product and colour come from the pack and the brush.`,
      q: [["Why not print the Production Run ID on the pack?", "That would mean changing artwork and coding on the line, which is outside the scope of an internship and needs regulatory and marketing sign-off. So I designed the system to work with what's already printed."]],
      next: `The obvious move is to search by batch number. But that's where the first problem shows up.`,
    });
    folio(s, n++);
  }

  // 5. Batch number is not enough
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    act(s, 2, "The investigation");
    question(s, "Why isn't the Batch Number enough?");
    s.addText("Batch Number\nalone is\nnot enough.", {
      x: 0.6, y: 2.0, w: 5.2, h: 3.2, fontFace: F.head, fontSize: 48, color: C.signal, margin: 0, valign: "top", isTextBox: true,
    });
    s.addText(ctx.batchWhy, {
      x: 0.6, y: 5.35, w: 5.0, h: 1.4, fontFace: F.body, fontSize: 14, color: C.steel, margin: 0, valign: "top", isTextBox: true,
    });
    const hdr = ["Batch No.", "Product", "Colour", "Mfg. Date"].map((t) => ({
      text: t, options: { bold: true, color: C.white, fill: { color: C.steel }, fontSize: 12 },
    }));
    const rows = ctx.repeatRows.map((r, i) => [
      { text: r[0], options: { bold: true, color: C.signal, fill: { color: C.signalSoft } } },
      { text: r[1] }, { text: r[2] }, { text: r[3] },
    ]);
    s.addText("Search result for one batch number", { x: 6.6, y: 1.95, w: 6, h: 0.3, fontFace: F.body, fontSize: 12, bold: true, color: C.mute, margin: 0, isTextBox: true });
    s.addTable([hdr, ...rows], {
      x: 6.6, y: 2.35, w: 6.1, colW: [1.15, 2.75, 0.9, 1.3], rowH: 0.44,
      fontFace: F.body, fontSize: 11, color: C.text, border: { type: "solid", color: C.rule, pt: 0.75 }, valign: "middle", margin: 0.08,
    });
    s.addText(`${ctx.repeatRows.length} records. Same printed number. Which one is the customer holding?`, {
      x: 6.6, y: 2.5 + 0.44 * (ctx.repeatRows.length + 1), w: 6.1, h: 0.5, fontFace: F.head, fontSize: 16, italic: true, color: C.text, margin: 0, isTextBox: true,
    });
    s.addText("Demonstration dataset", { x: 6.6, y: 6.95, w: 3, h: 0.25, fontFace: F.body, fontSize: 9, italic: true, color: C.mute, margin: 0, isTextBox: true });
    notes(s, {
      say: `Naturally, the first thing you'd do is search by batch number. But batch numbers can repeat. ${ctx.batchWhySay} So a batch-number search can return several records, and you can't tell which one the customer is holding. If you pick the wrong one, you end up investigating the wrong production run. I'll be honest: I didn't know this at the start. I found it while testing the system, and it changed the design.`,
      why: `This is the key design insight of the project. If the identifier isn't unique, every lookup built on it is unreliable.`,
      notice: `The same printed batch number maps to more than one manufacturing occurrence.`,
      q: [
        ["Why doesn't the plant just make batch numbers unique?", "The batch coding follows the plant's existing convention, and it's tied to printed packaging and regulatory records. Changing it affects many departments. My approach was to leave the printed identifier alone and add a unique key inside the system."],
        ["How often did batch numbers actually repeat?", "I didn't do a formal frequency study. The point is structural: the convention allows repeats, so the system can't assume uniqueness."],
      ],
      next: `So if one field isn't enough, what is?`,
    });
    folio(s, n++);
  }

  // 6. Four fields → one occurrence
  {
    const s = pres.addSlide();
    s.background = { color: C.paper };
    act(s, 2, "The investigation");
    question(s, "What identifies one manufacturing occurrence?");
    const tiles = ["Batch\nNumber", "Product", "Colour", "Manufacturing\nDate"];
    const tw = 2.05, gap = 0.55, x0 = 0.6, y = 2.3;
    tiles.forEach((t, i) => {
      const x = x0 + i * (tw + gap);
      s.addShape("rect", { x, y, w: tw, h: 1.5, fill: { color: C.white }, line: { color: C.faint, width: 1 } });
      s.addText(t, { x, y, w: tw, h: 1.5, fontFace: F.head, fontSize: 19, color: C.text, align: "center", valign: "middle", margin: 0, isTextBox: true });
      if (i < 3) s.addText("+", { x: x + tw, y, w: gap, h: 1.5, fontFace: F.head, fontSize: 28, color: C.mute, align: "center", valign: "middle", margin: 0, isTextBox: true });
    });
    const ex = x0 + 4 * (tw + gap) - gap;
    s.addText("=", { x: ex, y, w: 0.55, h: 1.5, fontFace: F.head, fontSize: 30, color: C.signal, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addShape("rect", { x: ex + 0.6, y, w: 2.2, h: 1.5, fill: { color: C.ink }, line: { type: "none" } });
    s.addText([{ text: "One", options: { breakLine: true } }, { text: "production run" }], {
      x: ex + 0.6, y, w: 2.2, h: 1.5, fontFace: F.head, fontSize: 20, color: C.white, align: "center", valign: "middle", margin: 0, isTextBox: true,
    });
    s.addText([
      { text: "The Trace Report concept.  ", options: { bold: true, color: C.text } },
      { text: "Enter the four fields from the pack, and the system returns only the production records that match all four. The investigation starts from the right record instead of a list of possibilities.", options: { color: C.steel } },
    ], { x: 0.6, y: 4.3, w: 8.2, h: 1.0, fontFace: F.body, fontSize: 15, margin: 0, valign: "top", isTextBox: true });
    s.addText("To solve this, I first had to understand where the information was being created.", {
      x: 0.6, y: 5.8, w: 11.5, h: 0.6, fontFace: F.head, fontSize: 22, italic: true, color: C.signal, margin: 0, isTextBox: true,
    });
    notes(s, {
      say: `What actually identifies a single manufacturing occurrence is the combination of batch number, product, colour and manufacturing date. That's the idea behind what became the Trace Report. You enter the four fields from the pack, and it returns only the production records that match all four. But to build that, I couldn't just design a lookup. I had to understand where each of these pieces of information was being created in the plant.`,
      why: `This is the bridge from the problem to the plant. The requirement came from the complaint, but the solution depended on understanding the process.`,
      notice: `It's a composite identifier. None of the four fields is unique by itself, but together they point to one run.`,
      q: [
        ["What if the four fields still return two records?", "Then the Trace Report shows both, and the investigator uses the next level of detail, like line, shift or time, to narrow it down. The report is designed to show every match rather than silently picking the first one."],
        ["Why not just use batch plus date?", "Different products and colours can run on the same date under the same batch convention. Product and colour remove that ambiguity."],
      ],
      next: `So let me take you into the plant.`,
    });
    folio(s, n++);
  }

  // ───────────────── ACT 3 — ENTER THE PLANT ─────────────────
  // 7. Where I was
  {
    const s = pres.addSlide();
    s.background = { color: C.paper };
    s.addImage({ path: P.aerial, x: 0, y: 0, w: 7.6, h: H, sizing: { type: "cover", w: 7.6, h: H } });
    act(s, 3, "Enter the plant", false, 8.2);
    s.addText("Where was I?", { x: 8.2, y: 0.78, w: 4.6, h: 0.6, fontFace: F.head, fontSize: 30, color: C.text, margin: 0, isTextBox: true });
    s.addText("JHS Svendgaard\nLaboratories Ltd.", { x: 8.2, y: 1.9, w: 4.8, h: 1.2, fontFace: F.head, fontSize: 28, color: C.jhs, bold: true, margin: 0, valign: "top", isTextBox: true });
    const facts = [["Department", "Operations"], ["Location", "Kala-Amb, Himachal Pradesh"], ["Plant", ctx.plantDesc], ["Duration", ctx.duration]];
    facts.forEach((f, i) => {
      s.addText(f[0].toUpperCase(), { x: 8.2, y: 3.45 + i * 0.78, w: 4.6, h: 0.25, fontFace: F.body, fontSize: 9.5, bold: true, color: C.mute, charSpacing: 2, margin: 0, isTextBox: true });
      s.addText(f[1], { x: 8.2, y: 3.7 + i * 0.78, w: 4.6, h: 0.35, fontFace: F.body, fontSize: 15, color: C.text, margin: 0, isTextBox: true });
    });
    s.addText("JHS Kala-Amb facility", { x: 0.3, y: H - 0.45, w: 4, h: 0.25, fontFace: F.body, fontSize: 9, color: C.white, margin: 0, isTextBox: true });
    notes(s, {
      say: `I did my internship with JHS Svendgaard Laboratories, in the Operations department at their Kala-Amb plant in Himachal Pradesh. ${ctx.plantSay} I spent my time on the floor, understanding how planning, stores, production, QC, packing and dispatch actually work day to day.`,
      why: `The panel needs to know this is grounded in a real plant. The system was designed around JHS's actual flow.`,
      notice: `The aerial view: several production blocks, warehousing and utilities on one campus. Information has to move between all of them.`,
      q: [["What exactly was your role?", "I was an operations intern. I studied the process, observed a production line, gathered requirements from the people using the records, and designed and built the MES prototype."]],
      next: `Let me tell you briefly who JHS is.`,
      src: "Aerial view of the JHS Kala-Amb facility (image provided by the presenter; add its original credit if it came from JHS).",
    });
    folio(s, n++);
  }

  // 7a. Who is JHS?
  {
    const s = pres.addSlide();
    s.background = { color: C.paper };
    act(s, 3, "Enter the plant");
    question(s, "Who is JHS?");
    const facts = [
      ["Since 1997", "Started as a toothbrush manufacturer; now makes the full oral-care range."],
      ["Contract manufacturer", "Makes oral-care products for domestic and international brands, such as Amway India and Dabur India, as well as its own."],
      ["Kala-Amb, Himachal Pradesh", "Manufacturing location, where I was placed. Corporate office in New Delhi."],
    ];
    facts.forEach((f, i) => {
      const y = 1.75 + i * 1.25;
      s.addText(f[0], { x: 0.6, y, w: 4.3, h: 0.5, fontFace: F.head, fontSize: 22, color: i === 1 ? C.signal : C.text, margin: 0, isTextBox: true });
      s.addText(f[1], { x: 0.6, y: y + 0.5, w: 4.2, h: 0.85, fontFace: F.body, fontSize: 13, color: C.steel, margin: 0, valign: "top", isTextBox: true });
    });
    s.addText("THREE PRODUCT LINES, THREE KINDS OF PROCESS", { x: 5.4, y: 1.75, w: 7.3, h: 0.28, fontFace: F.body, fontSize: 10, bold: true, color: C.mute, charSpacing: 3, margin: 0, isTextBox: true });
    const lines = [
      ["Toothpaste", "High-volume lines", ["Dispensing", "Blending", "Homogenisation", "Tube filling"]],
      ["Toothbrushes", "Assembled from components", ["Handle moulding", "Tufting", "Trimming", "Cap assembly", "Packing"]],
      ["Mouthwash", "Lower-volume, order-based", ["Single line"]],
    ];
    lines.forEach((l, i) => {
      const y = 2.2 + i * 1.12;
      s.addShape("rect", { x: 5.4, y, w: 7.33, h: 0.98, fill: { color: i === 1 ? C.ink : C.white }, line: { color: i === 1 ? C.ink : C.rule, width: 0.75 } });
      s.addText([{ text: l[0], options: { bold: true, fontSize: 16, color: i === 1 ? C.white : C.text, breakLine: true } }, { text: l[1], options: { fontSize: 11, color: i === 1 ? "AEB4B9" : C.mute } }],
        { x: 5.6, y: y + 0.08, w: 1.8, h: 0.82, fontFace: F.body, margin: 0, valign: "middle", isTextBox: true });
      let cx = 7.45;
      l[2].forEach((st, j) => {
        const w = 0.2 + st.length * 0.068;
        s.addShape("roundRect", { x: cx, y: y + 0.3, w, h: 0.38, rectRadius: 0.19, fill: { color: i === 1 ? "2A3138" : C.paper }, line: { type: "none" } });
        s.addText(st, { x: cx, y: y + 0.3, w, h: 0.38, fontFace: F.body, fontSize: 10, color: i === 1 ? C.white : C.text, align: "center", valign: "middle", margin: 0, isTextBox: true });
        cx += w + (j < l[2].length - 1 ? 0.16 : 0);
        if (j < l[2].length - 1) s.addText("›", { x: cx - 0.16, y: y + 0.3, w: 0.16, h: 0.38, fontFace: F.body, fontSize: 12, color: C.signal, align: "center", valign: "middle", margin: 0, isTextBox: true });
      });
    });
    s.addText("When you manufacture under other companies' brands, being able to trace any pack back to the run that made it matters to the client as much as to the plant.", {
      x: 5.4, y: 5.5, w: 7.33, h: 0.65, fontFace: F.head, fontSize: 15, italic: true, color: C.steel, margin: 0, valign: "top", isTextBox: true,
    });
    // Verified contract-manufacturing clients: logo (if supplied in logos/) + name
    s.addShape("line", { x: 0.6, y: 6.25, w: 12.13, h: 0, line: { color: C.rule, width: 0.75 } });
    s.addText("CONTRACT-MANUFACTURING CLIENTS, PUBLICLY REPORTED", { x: 0.6, y: 6.38, w: 3.2, h: 0.5, fontFace: F.body, fontSize: 9, bold: true, color: C.mute, charSpacing: 2, margin: 0, valign: "middle", isTextBox: true });
    ctx.clients.forEach((c, i) => {
      const x = 4.05 + i * 2.35;
      const logo = require("path").join(__dirname, "logos", c.logo);
      let tx = x;
      if (fs.existsSync(logo)) {
        s.addImage({ path: logo, x, y: 6.4, w: 0.9, h: 0.46, sizing: { type: "contain", w: 0.9, h: 0.46 } });
        tx = x + 1.0;
      }
      s.addText(c.name, { x: tx, y: 6.38, w: 2.2 - (tx - x), h: 0.5, fontFace: F.head, fontSize: 14, color: C.text, margin: 0, valign: "middle", isTextBox: true });
    });
    s.addText("Sources in speaker notes", { x: 11.1, y: 6.95, w: 1.2, h: 0.22, fontFace: F.body, fontSize: 7.5, italic: true, color: C.mute, margin: 0, isTextBox: true });
    folio(s, n++);
    notes(s, {
      say: `Briefly, who JHS is. JHS Svendgaard started in 1997 as a toothbrush manufacturer and today makes the full oral-care range. A large part of its business is contract manufacturing: it makes toothpaste, toothbrushes and mouthwash for other brands, in India and abroad, as well as its own. The manufacturing is at Kala-Amb, where I was, and the corporate office is in New Delhi. The three product lines work very differently. Toothpaste runs on high-volume lines: dispensing, blending, homogenisation, then tube filling. A toothbrush is assembled from components: the handle is moulded, bristles are tufted and trimmed, then the cap goes on and it's packed. Mouthwash is a lower-volume, order-based single line. The point for my project is the last line on the slide. When the product carries a client's brand, a complaint is the client's complaint too, so traceability is part of the relationship, not an admin task.`,
      why: `It sets up why traceability matters commercially, not just operationally, before the panel sees any problem.`,
      notice: `The toothbrush line, highlighted, is the one the whole case study follows.`,
      q: [
        ["Which brands does JHS make for?", "Publicly reported clients include Dabur India, Patanjali Ayurved and Amway India; those are the three on the slide. The dashboard later in my deck uses Amway, Chicco and Dabur only as modelled accounts with fictional data, so I don't treat the demonstration data as evidence of who the clients are."],
        ["Why does contract manufacturing make traceability more important?", "Because the brand owner answers to the consumer. If a pack is complained about, the client will expect the manufacturer to identify the run, the materials and the QC record quickly, and to scope any recall precisely."],
      ],
      next: `Here's what that looks like on the ground.`,
      src: ctx.clientSources,
    });
  }

  // 9. Photo mosaic
  {
    const s = pres.addSlide();
    s.background = { color: C.ink };
    s.addImage({ path: P.skyline, x: 0, y: 0, w: W, h: H, sizing: { type: "cover", w: W, h: H } });
    s.addShape("rect", { x: 0.45, y: 5.05, w: 7.3, h: 1.95, fill: { color: "000000", transparency: 22 }, line: { type: "none" } });
    s.addText("What does it look like on the ground?", { x: 0.7, y: 5.2, w: 6.9, h: 0.5, fontFace: F.head, fontSize: 22, color: C.white, margin: 0, isTextBox: true });
    s.addText("Stores, production blocks, QC, packing and dispatch spread across one campus. Material moves between them all day, and each hand-over leaves a record behind.", {
      x: 0.7, y: 5.75, w: 6.9, h: 1.1, fontFace: F.body, fontSize: 13, color: "D5D9DC", margin: 0, valign: "top", isTextBox: true,
    });
    s.addText("Kala-Amb industrial belt from the plant roof", { x: 8.3, y: H - 0.5, w: 4.4, h: 0.25, fontFace: F.body, fontSize: 10, color: C.white, align: "right", margin: 0, isTextBox: true });
    folio(s, n++, true);
    notes(s, {
      say: `This is the view from the plant roof: production blocks, stores and utilities, with the Kala-Amb industrial belt and the hills behind. Stores, production, QC, packing and dispatch are spread across the campus, and material moves between them all day. Every one of those operations creates records: what was run, what material was used, what was rejected, when the machine stopped.`,
      why: `It shows the panel I was physically on the floor, and that the system is built around real operations.`,
      notice: `The scale: several blocks, several lines and several shifts. Connecting the information by hand is slow.`,
      q: [["Was the MES deployed on these lines?", "No. It's a working prototype built on the plant's process and record structure, and populated with a demonstration dataset, not the company's production records. Live deployment would be the next step."]],
      next: `So how did I spend my seven weeks there?`,
      src: "Photograph from the plant roof, JHS Kala-Amb (image provided by the presenter).",
    });
  }

  // 7b. Seven weeks
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    act(s, 3, "Enter the plant");
    question(s, "How did I spend seven weeks there?");
    s.addText("1 JUNE", { x: 0.6, y: 1.72, w: 2, h: 0.3, fontFace: F.body, fontSize: 10.5, bold: true, color: C.mute, charSpacing: 3, margin: 0, isTextBox: true });
    s.addText("17 JULY 2026", { x: 10.7, y: 1.72, w: 2.03, h: 0.3, fontFace: F.body, fontSize: 10.5, bold: true, color: C.mute, charSpacing: 3, align: "right", margin: 0, isTextBox: true });
    const ph = [
      ["Plant induction", "Supply chain, inbound and warehouse, the QC / QA / microbiology labs, paste, moulding and tufting"],
      ["Line study", "One 12-hour operating cycle on the main toothpaste line"],
      ["Problem definition", "Where information is created, and where it breaks"],
      ["Build", "The MES: 27 sheets, five layers"],
      ["Test & refine", "Scenario tests; identification logic reworked"],
    ];
    const pw = 12.13 / ph.length;
    ph.forEach((p, i) => {
      const x = 0.6 + i * pw;
      s.addShape("rect", { x: x + 0.02, y: 2.1, w: pw - 0.04, h: 0.16, fill: { color: i === 0 ? C.signal : i < 3 ? "8A949C" : C.ink }, line: { type: "none" } });
      s.addText(p[0], { x, y: 2.42, w: pw - 0.2, h: 0.4, fontFace: F.head, fontSize: 17, color: C.text, margin: 0, isTextBox: true });
      s.addText(p[1], { x, y: 2.85, w: pw - 0.25, h: 1.1, fontFace: F.body, fontSize: 12, color: C.steel, margin: 0, valign: "top", isTextBox: true });
    });
    s.addText("Sequence, not to scale", { x: 0.6, y: 4.0, w: 3, h: 0.25, fontFace: F.body, fontSize: 9, italic: true, color: C.mute, margin: 0, isTextBox: true });
    s.addShape("rect", { x: 0.6, y: 4.55, w: 7.4, h: 2.35, fill: { color: C.paper }, line: { type: "none" } });
    s.addText("“Exposure first, project second.”", { x: 0.85, y: 4.75, w: 7.0, h: 0.55, fontFace: F.head, fontSize: 22, italic: true, color: C.signal, margin: 0, isTextBox: true });
    s.addText("The brief was broad when I arrived. It only took its final shape once I understood how information actually moves through the plant.", {
      x: 0.85, y: 5.35, w: 6.9, h: 1.3, fontFace: F.body, fontSize: 14, color: C.text, margin: 0, valign: "top", isTextBox: true,
    });
    const g = [["ROLE", "Operations intern, Operations Department"], ["EXTERNAL GUIDE", "Mr. Paramveer Singh, Chief Executive Officer, JHS Svendgaard"], ["INTERNAL GUIDE", "Dr. Vineet Tiwari, Associate Professor, IIIT Allahabad"]];
    g.forEach((x, i) => {
      s.addText(x[0], { x: 8.45, y: 4.6 + i * 0.78, w: 4.3, h: 0.25, fontFace: F.body, fontSize: 9.5, bold: true, color: C.mute, charSpacing: 2, margin: 0, isTextBox: true });
      s.addText(x[1], { x: 8.45, y: 4.85 + i * 0.78, w: 4.3, h: 0.45, fontFace: F.body, fontSize: 12.5, color: C.text, margin: 0, valign: "top", isTextBox: true });
    });
    folio(s, n++);
    notes(s, {
      say: `This is how the seven weeks were spent, from the first of June to the seventeenth of July. It started with a structured plant induction: supply chain, inbound and warehouse, the quality labs, and the paste, moulding and tufting plants. Then I observed one full operating cycle on the main toothpaste line. From that came the problem definition, then the build, then testing and refinement. I want you to notice the order: exposure first, project second. The brief was broad when I arrived. It only took its final shape once I understood how information moves through the plant. My external guide was Mr. Paramveer Singh, and my internal guide was Dr. Vineet Tiwari.`,
      why: `It shows the project came out of the plant, not the other way round. It also answers "what did you actually do all day?" before anyone asks.`,
      notice: `The first bar, the induction, is highlighted. Everything else depended on it.`,
      q: [
        ["How much time did the induction take?", "It was the first part of the internship. I haven't put exact weeks on the slide because the phases overlapped. For example, I kept going back to the floor while building."],
        ["Was the MES your assigned project from day one?", "No. The brief was broad: understand how the plant operates and how information moves, then translate that into a working digital system. The MES took shape after the induction and the line study."],
      ],
      next: `The induction came first, and it taught me things I didn't expect.`,
    });
  }

  // 7c. What the induction taught me
  {
    const s = pres.addSlide();
    s.background = { color: C.paper };
    act(s, 3, "Enter the plant");
    question(s, "What did the induction teach me before the project began?");
    const cards = [
      ["Planning & procurement", "Planning and buying are deliberately separated. The plan says what is needed; procurement decides how to get it.", "Work orders that production runs are logged against"],
      ["Inbound & warehouse", "A material gets a traceable identity at the gate, before it's allowed into storage: verification, weighment, quarantine, sampling, a traceability label.", "The GRN register and lot identity from receipt"],
      ["QC laboratory", "Testing a material and releasing a batch are two different decisions, made and recorded separately.", "QC status and release status as separate fields"],
      ["Quality assurance", "Line clearance is graded, A and B. A retained sample of every batch is kept through expiry, so a complaint months later can be checked against evidence.", "Complaints linked to the exact run"],
      ["Maintenance & losses", "The plant measures its own losses through OEE and Total Productive Maintenance.", "Downtime as events; the OEE module"],
    ];
    const cw = 3.95, chh = 2.3, gx = 0.14, gy = 0.2;
    cards.forEach((c, i) => {
      const x = 0.6 + (i % 3) * (cw + gx), y = 1.75 + Math.floor(i / 3) * (chh + gy);
      s.addShape("rect", { x, y, w: cw, h: chh, fill: { color: C.white }, line: { color: C.rule, width: 0.75 } });
      s.addText(String(i + 1).padStart(2, "0"), { x: x + 0.22, y: y + 0.15, w: 0.6, h: 0.35, fontFace: F.head, fontSize: 15, color: C.faint, margin: 0, isTextBox: true });
      s.addText(c[0], { x: x + 0.72, y: y + 0.15, w: cw - 0.9, h: 0.35, fontFace: F.head, fontSize: 16, color: C.text, margin: 0, isTextBox: true });
      s.addText(c[1], { x: x + 0.22, y: y + 0.6, w: cw - 0.44, h: 1.15, fontFace: F.body, fontSize: 12, color: C.steel, margin: 0, valign: "top", isTextBox: true });
      s.addText([{ text: "LATER IN THE MES  ", options: { bold: true, color: C.signal, fontSize: 8.5, charSpacing: 1 } }, { text: c[2], options: { color: C.text, fontSize: 10.5 } }],
        { x: x + 0.22, y: y + chh - 0.5, w: cw - 0.44, h: 0.4, fontFace: F.body, margin: 0, valign: "top", isTextBox: true });
    });
    const x6 = 0.6 + 2 * (cw + gx), y6 = 1.75 + chh + gy;
    s.addShape("rect", { x: x6, y: y6, w: cw, h: chh, fill: { color: C.ink }, line: { type: "none" } });
    s.addText("THE COMMON THREAD", { x: x6 + 0.25, y: y6 + 0.2, w: cw - 0.5, h: 0.3, fontFace: F.body, fontSize: 10, bold: true, color: C.signal, charSpacing: 3, margin: 0, isTextBox: true });
    s.addText("Every record exists because some later activity will need it.", { x: x6 + 0.25, y: y6 + 0.6, w: cw - 0.5, h: 1.5, fontFace: F.head, fontSize: 19, color: C.white, margin: 0, valign: "top", isTextBox: true });
    folio(s, n++);
    notes(s, {
      say: `Before the project had a shape, the induction taught me how the functions around production work. In planning and procurement, planning and buying are deliberately kept separate: the plan says what's needed, procurement decides how to get it. At the inbound gate, a material gets its traceable identity before it's allowed into storage: it's verified, weighed, quarantined, sampled and labelled. In the QC lab, I learned that testing a material and releasing a batch are two different decisions, recorded separately. In QA, line clearance is graded, A and B, and a retained sample of every batch is kept through expiry, so a complaint months later can be checked against physical evidence. And the plant already measures its own losses through OEE and TPM. The common thread, and probably the most useful thing I learned there: every record exists because some later activity is going to need it.`,
      why: `This is manufacturing knowledge I didn't have before the internship, and each point later shaped a specific part of the system.`,
      notice: `The orange line at the bottom of each card. That's where the learning ended up in the MES.`,
      q: [
        ["What's the difference between QC and QA?", "QC tests: it checks a material or product against specification and records the result. QA decides: it reviews the batch record, line clearance and QC results, and releases or holds the batch. They're separate decisions, so the MES keeps QC status and release status as separate fields."],
        ["What is line clearance?", "Before a new batch starts, the line is checked and cleared of the previous product's materials, labels and documents, so nothing gets mixed up. At JHS it's graded into A and B levels. (Explain the A/B criteria as the plant's SOP defines them.)"],
        ["Why keep a retained sample?", "So that if a complaint arrives months later, QA can test the same batch against what the customer reports. It's physical evidence to go with the records."],
        ["What is TPM?", "Total Productive Maintenance: an approach where operators and maintenance work together to prevent losses, such as breakdowns, minor stops and speed loss, rather than only fixing failures. OEE is the measure it uses."],
      ],
      next: `Then came the three plants, where the product is actually made.`,
    });
  }

  // 8b. Plant exposure — observation → requirement
  {
    const s = pres.addSlide();
    s.background = { color: C.paper };
    act(s, 3, "Enter the plant");
    question(s, "What did the plant teach me about the system?");
    s.addText("WHAT I OBSERVED", { x: 2.95, y: 1.6, w: 4.6, h: 0.28, fontFace: F.body, fontSize: 10, bold: true, color: C.mute, charSpacing: 3, margin: 0, isTextBox: true });
    s.addText("WHAT THE MES HAD TO DO", { x: 8.1, y: 1.6, w: 4.6, h: 0.28, fontFace: F.body, fontSize: 10, bold: true, color: C.signal, charSpacing: 3, margin: 0, isTextBox: true });
    const rows = [
      ["01", "Paste plant", "Material gets a traceable identity at the weighbridge and keeps it through quarantine, sampling and release. QC testing and QA release are separate decisions.", "Key every register. Link each material issue to the run that used it. Record QC result and release separately."],
      ["02", "Moulding", "A brush first gets its identity at the handle lot. One moulding lot is consumed by one to three assembly runs.", "Carry the handle lot on every production record. Trace a lot to every run it reached."],
      ["03", "Tufting", "Filament is anchored into the handle and trimmed. Bristle retention is decided here.", "Record the tufting machine, bristle supplier, filament and anchor-wire lots, and classify defects by stage."],
    ];
    const web = ctx.webPhotos || {};
    const pics = [null, web.moulding, web.tufting];
    const withPics = pics.some((p) => p);
    const ox = 2.95, ow = withPics ? 3.5 : 4.7, ax = withPics ? 6.5 : 7.6, mx = withPics ? 6.95 : 8.1, mw = withPics ? 3.4 : 4.6;
    rows.forEach((r, i) => {
      const y = 2.05 + i * 1.55;
      if (i > 0) s.addShape("line", { x: 0.6, y: y - 0.2, w: 12.13, h: 0, line: { color: C.rule, width: 0.75 } });
      s.addText(r[0], { x: 0.6, y, w: 0.8, h: 0.6, fontFace: F.head, fontSize: 28, color: i === 2 ? C.signal : C.faint, margin: 0, valign: "top", isTextBox: true });
      s.addText(r[1], { x: 1.4, y: y + 0.05, w: 1.5, h: 0.5, fontFace: F.head, fontSize: 18, color: C.text, margin: 0, valign: "top", isTextBox: true });
      s.addText(r[2], { x: ox, y, w: ow, h: 1.2, fontFace: F.body, fontSize: withPics ? 12 : 13, color: C.steel, margin: 0, valign: "top", isTextBox: true });
      s.addText("\u2192", { x: ax, y, w: 0.45, h: 0.45, fontFace: F.body, fontSize: 18, color: C.signal, margin: 0, align: "center", isTextBox: true });
      s.addText(r[3], { x: mx, y, w: mw, h: 1.2, fontFace: F.body, fontSize: withPics ? 12 : 13, bold: true, color: C.text, margin: 0, valign: "top", isTextBox: true });
      const p = pics[i];
      if (p) {
        s.addImage({ path: p.path, x: 10.6, y: y - 0.08, w: 2.13, h: 1.12, sizing: { type: "cover", w: 2.13, h: 1.12 } });
        s.addText(`${p.caption}  \u00B7  ${p.credit}`, { x: 10.6, y: y + 1.07, w: 2.13, h: 0.2, fontFace: F.body, fontSize: 7.5, italic: true, color: C.mute, margin: 0, isTextBox: true });
      }
    });
    s.addText("Tufting is where the bristle complaint points. Every field on the manufacturing record can be traced back to something seen on the floor.", {
      x: 0.6, y: 6.45, w: 12.1, h: 0.45, fontFace: F.head, fontSize: 15, italic: true, color: C.steel, margin: 0, isTextBox: true,
    });
    folio(s, n++);
    notes(s, {
      say: `Then the three plants. This slide is the one the design rests on. My exposure was observational: I was there to understand where information is created, not to run equipment. In the paste plant, I saw that material gets a traceable identity at the weighbridge and keeps it through quarantine, sampling and release. I also saw that QC testing and QA release are two different decisions, recorded separately. In moulding, the brush first gets its identity at the handle lot, and one moulding lot feeds up to three assembly runs. That's why reverse traceability matters. And in tufting, bristle retention is decided at the anchoring operation, which is exactly what our complaint is about. The right-hand column is the point: each observation became a specific requirement for the system.`,
      why: `It shows the design came from the floor, not from a template.`,
      notice: `Row 03. The complaint from the opening slide leads straight here.`,
      q: [
        ["Did you work on the machines?", "No, the exposure was observational. I studied the process and the records each stage creates."],
        ["What's the difference between QC and QA?", "QC tests the material or product against specifications. QA decides whether the batch is released. They're different decisions, made by different people, and recorded separately, so the MES keeps them as separate fields."],
      ],
      next: `Put together, this is how material moves through the plant.`,
      src: (ctx.webPhotos && (ctx.webPhotos.moulding || ctx.webPhotos.tufting)) ? Object.values(ctx.webPhotos).filter(Boolean).map((p) => `${p.caption}: ${p.credit}, ${p.url}`).join("\n") : undefined,
    });
  }

  // 8. Material flow
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    act(s, 3, "Enter the plant");
    question(s, "How does material move through the plant?");
    s.addText("Every physical movement of material created a record.", {
      x: 0.6, y: 1.55, w: 12, h: 0.45, fontFace: F.body, fontSize: 17, color: C.steel, margin: 0, isTextBox: true,
    });
    const steps = [
      ["Planning", "Production plan", "What to make, how much, on which line"],
      ["Warehouse", "Material receipt & issue", "Which lots went to the floor"],
      ["Production", "Production log", "Output, shift, machine, run time"],
      ["QC / QA", "Inspection record", "Checks, rejections, release"],
      ["Packing", "Packing record", "Packed quantity, pack coding"],
      ["Dispatch", "Dispatch record", "Where each batch went"],
    ];
    const x0 = 0.75, sp = 2.07, yL = 3.05;
    s.addShape("line", { x: x0 + 0.25, y: yL, w: sp * 5, h: 0, line: { color: C.faint, width: 2 } });
    steps.forEach((st, i) => {
      const x = x0 + i * sp;
      s.addShape("ellipse", { x: x, y: yL - 0.25, w: 0.5, h: 0.5, fill: { color: i === 2 ? C.signal : C.ink }, line: { color: C.white, width: 2 } });
      s.addText(String(i + 1), { x, y: yL - 0.25, w: 0.5, h: 0.5, fontFace: F.body, fontSize: 13, bold: true, color: C.white, align: "center", valign: "middle", margin: 0, isTextBox: true });
      s.addText(st[0], { x: x - 0.1, y: 2.25, w: 1.95, h: 0.4, fontFace: F.head, fontSize: 18, color: C.text, margin: 0, isTextBox: true });
      s.addShape("rect", { x: x - 0.1, y: 3.55, w: 1.85, h: 1.3, fill: { color: C.paper }, line: { type: "none" } });
      s.addText("RECORD", { x: x + 0.02, y: 3.63, w: 1.6, h: 0.22, fontFace: F.body, fontSize: 8.5, bold: true, color: C.signal, charSpacing: 2, margin: 0, isTextBox: true });
      s.addText([{ text: st[1], options: { bold: true, color: C.text, breakLine: true } }, { text: st[2], options: { color: C.mute, fontSize: 11 } }],
        { x: x + 0.02, y: 3.88, w: 1.62, h: 0.95, fontFace: F.body, fontSize: 12, margin: 0, valign: "top", isTextBox: true });
    });
    // What two of those records actually look like (plant formats, June 2026)
    const R = ctx.records;
    const rp = photo(s, R.params.path, R.params.ar, x0 + 2 * sp - 0.1, 5.02, 2.95);
    s.addText("At the machine: bristling process-parameter record, 11 Jun, shift A", { x: rp.x, y: rp.y + rp.h + 0.08, w: 3.3, h: 0.22, fontFace: F.body, fontSize: 8.5, italic: true, color: C.mute, margin: 0, isTextBox: true });
    const rf = photo(s, R.fg13.path, R.fg13.ar, x0 + 4 * sp - 0.1, 5.02, 2.95);
    s.addText("After packing: FG production record, 13 Jun, shift A", { x: rf.x, y: rf.y + rf.h + 0.08, w: 3.3, h: 0.22, fontFace: F.body, fontSize: 8.5, italic: true, color: C.mute, margin: 0, isTextBox: true });
    s.addText("But those records did not automatically become one connected story.", {
      x: 0.6, y: 6.6, w: 12, h: 0.45, fontFace: F.head, fontSize: 20, italic: true, color: C.signal, margin: 0, isTextBox: true,
    });
    notes(s, {
      say: `This is the flow I mapped. Planning decides what to make. The warehouse receives and issues material. Production converts it, QC checks it, packing packs it, and dispatch sends it out. At every step, someone creates a record. At the bottom are two of them as they actually look: the process-parameter record filled at the bristling machines, and the finished-goods production record filled after packing. So the plant isn't short of records. But these records were created by different people, in different formats, at different times. They didn't automatically join up into one story you could follow from a complaint back to a machine and a material lot.`,
      why: `This is where I realised the problem wasn't a lack of data.`,
      notice: `Six stages, six records. The link between them is the part that's missing.`,
      q: [
        ["How did you map this flow?", "By walking the process, talking to the people in each function, and looking at the registers and formats they actually filled in."],
        ["What are the two forms at the bottom?", "Real plant formats. On the left, the bristling process-parameter record: speed and pressure for each tufting and trimming machine and the sealing temperatures, checked every shift. On the right, the FG production record: product, brushes per case, batch number and cases packed. They're filled by different people, at different points, on different sheets."],
      ],
      next: `And that's what led me to the real finding.`,
      src: "Plant record formats photographed during the internship (provided by the presenter): Bristling Process Parameter Monitoring Record (format JHS/QF/8.5.1-1, 11 Jun 2026, shift A); Production Record - FG (format JHS/QF/8.5.1-1/3, 13 Jun 2026, shift A).",
    });
    folio(s, n++);
  }

  // ───────────────── ACT 4 — THE DISCOVERY ─────────────────
  // 10. The statement
  {
    const s = pres.addSlide();
    s.background = { color: C.ink };
    act(s, 4, "The discovery", true);
    s.addText("THE PLANT HAD THE DATA.", {
      x: 0.6, y: 2.2, w: 12.2, h: 1.1, fontFace: F.head, fontSize: 50, color: C.white, margin: 0, isTextBox: true,
    });
    s.addText("THE PROBLEM WAS HOW\nTHE DATA WAS CONNECTED.", {
      x: 0.6, y: 3.35, w: 12.2, h: 2.1, fontFace: F.head, fontSize: 50, color: C.signal, margin: 0, valign: "top", isTextBox: true,
    });
    s.addText("What did I discover?", { x: 0.6, y: 6.2, w: 6, h: 0.35, fontFace: F.body, fontSize: 13, color: "7D858B", margin: 0, isTextBox: true });
    folio(s, n++, true);
    notes(s, {
      say: `This was the most important thing I learned in the first few weeks. The plant had the data. The problem was how the data was connected. I went in expecting to find missing information. What I actually found was information that existed but lived in separate places and couldn't easily be joined.`,
      why: `It changes the solution completely. If data is missing, you collect more. If it's disconnected, you need structure: keys, relationships and a consistent flow.`,
      notice: `This single sentence reframes the whole project.`,
      q: [["Isn't this true of most plants?", "Yes, and that's why it matters. It's a very common problem in plants that run on registers and spreadsheets. The fix isn't more data entry. It's connecting what already exists."]],
      next: `Let me show you what "disconnected" actually meant in practice.`,
    });
  }

  // 11. Fragmented registers
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    act(s, 4, "The discovery");
    question(s, "Where was the information, and why was it slow to use?", { w: 12.2 });
    const R = ctx.records;
    s.addText("PLANT RECORDS, AS I FOUND THEM  \u00B7  JUNE 2026", { x: 0.6, y: 1.55, w: 6.2, h: 0.25, fontFace: F.body, fontSize: 9.5, bold: true, color: C.mute, charSpacing: 2, margin: 0, isTextBox: true });
    const rt = photo(s, R.trace2.path, R.trace2.ar, 0.6, 1.95, 4.6);
    box(s, rt, [0.10, 0.268, 0.145, 0.062]); box(s, rt, [0.683, 0.272, 0.3, 0.05]);
    box(s, rt, [0.0, 0.736, 1.0, 0.097]);
    pin(s, 1, rt.x + 0.12 * rt.w, rt.y + 0.215 * rt.h, 0.3);
    pin(s, 2, rt.x + rt.w - 0.02, rt.y + 0.736 * rt.h, 0.3);
    s.addText([
      { text: "Traceability report, bristling. ", options: { bold: true, color: C.text } },
      { text: "Its own headers say where each column comes from: the handle tag, the cap tag, incoming analytical reports, shift production formats. It is compiled by hand.", options: { color: C.steel } },
    ], { x: 5.38, y: 1.95, w: 1.55, h: 2.6, fontFace: F.body, fontSize: 10, margin: 0, valign: "top", isTextBox: true });
    const rf = photo(s, R.fg11.path, R.fg11.ar, 0.6, 4.78, 3.5);
    box(s, rf, [0.09, 0.61, 0.85, 0.095]);
    pin(s, 2, rf.x + rf.w - 0.02, rf.y + 0.61 * rf.h, 0.3);
    s.addText([
      { text: "Written twice. ", options: { bold: true, color: C.signal } },
      { text: "11 June, JBCA260003, 25 cases: on the FG production record, and again in row 19 of the traceability report.", options: { color: C.steel } },
    ], { x: 4.35, y: 4.78, w: 2.55, h: 1.3, fontFace: F.body, fontSize: 10.5, margin: 0, valign: "top", isTextBox: true });
    s.addText([
      { text: "SEPARATE REGISTERS  ", options: { bold: true, color: C.mute, fontSize: 9, charSpacing: 2 } },
      { text: "Production \u00B7 Quality \u00B7 Material \u00B7 Downtime \u00B7 Dispatch, each kept by its own function", options: { color: C.text, fontSize: 11.5 } },
    ], { x: 0.6, y: 6.45, w: 6.3, h: 0.45, fontFace: F.body, margin: 0, valign: "middle", isTextBox: true });
    const chain = ["Manual searching", "Manual consolidation", "Delayed investigation", "Limited visibility"];
    chain.forEach((c, i) => {
      const y = 2.05 + i * 1.02;
      s.addShape("rect", { x: 7.1, y, w: 3.3, h: 0.68, fill: { color: i === 3 ? C.signal : C.ink }, line: { type: "none" } });
      s.addText(c, { x: 7.1, y, w: 3.3, h: 0.68, fontFace: F.body, fontSize: 15, bold: true, color: C.white, align: "center", valign: "middle", margin: 0, isTextBox: true });
      if (i < 3) s.addText("↓", { x: 7.1, y: y + 0.66, w: 3.3, h: 0.36, fontFace: F.body, fontSize: 16, color: C.mute, align: "center", valign: "middle", margin: 0, isTextBox: true });
    });
    s.addText([
      { text: "Not an absence-of-data problem.", options: { bold: true, color: C.text, breakLine: true } },
      { text: "A data-structure and information-flow problem: no common key, no automatic link between registers.", options: { color: C.steel } },
    ], { x: 10.75, y: 2.05, w: 2.1, h: 3.9, fontFace: F.body, fontSize: 13, margin: 0, valign: "top", isTextBox: true });
    folio(s, n++);
    notes(s, {
      say: `These are real records from the bristling line. The first is the plant's own traceability report for Patanjali Triple Action, batch JBCA260003. Look at its headers: this column is 'data received from handle tag', this one 'from cap tag', these 'from shift production formats'. Someone builds this report by hand, from other records. And the same fact gets written twice. On 11 June, 25 cases of JBCA260003: once on the FG production record, and again in row 19 of the traceability report. The same page also shows one batch number running across several production days and colours, which is exactly why the batch number alone couldn't identify a run. Behind these are the five kinds of record I kept coming back to: production, quality, material, downtime and dispatch. Each one made sense on its own. But to answer a question that crosses them, like our complaint, someone has to search each register manually, then consolidate what they find, usually by hand. That delays the investigation, and it means management only sees the full picture when someone has done that work. So the issue was structural. There was no common key and no automatic link between the registers.`,
      why: `This defines what the MES must fix: a shared key and connected flows, not just a nicer report.`,
      notice: `Marker 2 appears on both records: the same fact, written by hand in two places. Nothing links them except a person copying it.`,
      q: [
        ["Were these registers on paper or in Excel?", `${ctx.registerFormat} The two on this slide are paper formats, filled by hand and signed.`],
        ["Why does one batch number cover several days?", "On this line the batch JBCA260003 ran from 14 May to 13 June, across several production days, colours and handle lots. So a pack's batch number alone can't tell you which day, colour or handle lot you're looking at. That's the real-world version of what I showed with the demonstration data on slide 5."],
        ["Did you measure how long an investigation took?", "No, I didn't formally time it, so I won't put a number on it. What I observed was the number of steps and hand-offs involved."],
      ],
      next: `Alongside this, I did a line study, and that gave me a second, more measurable view of the same problem.`,
      src: "Plant records photographed during the internship (provided by the presenter): Traceability Report - Bristling, Patanjali Triple Action, batch JBCA260003 (format JHS/QF/8.5.1-1/9), rows 13-21; Production Record - FG, 11 Jun 2026, shift A (format JHS/QF/8.5.1-1/3).",
    });
  }

  // ───────────────── ACT 5 — THE LINE STUDY ─────────────────
  // 12. Twelve hours
  {
    const s = pres.addSlide();
    s.background = { color: C.paper };
    s.addImage({ path: P.machine, x: 0, y: 0, w: 3.7, h: H, sizing: { type: "cover", w: 3.7, h: H } });
    s.addShape("rect", { x: 0, y: H - 0.75, w: 3.7, h: 0.75, fill: { color: "000000", transparency: 35 }, line: { type: "none" } });
    s.addText("Tube filling line, paste plant", { x: 0.25, y: H - 0.55, w: 3.3, h: 0.3, fontFace: F.body, fontSize: 10, color: C.white, margin: 0, isTextBox: true });
    const X = 4.25, Wc = 8.48;
    s.addText([{ text: "ACT 05", options: { bold: true, color: C.signal } }, { text: "   THE LINE STUDY", options: { color: C.mute } }],
      { x: X, y: 0.38, w: 8, h: 0.3, fontFace: F.body, fontSize: 10.5, charSpacing: 3, margin: 0, isTextBox: true });
    question(s, "What did twelve hours on one line show me?", { x: X, w: Wc, size: 30 });
    const by = 2.3, bh = 0.85, tot = 720;
    let cx = X;
    [[675, C.ink], [30, C.signal], [15, "F09A6E"]].forEach((sg) => {
      const w = (sg[0] / tot) * Wc;
      s.addShape("rect", { x: cx, y: by, w, h: bh, fill: { color: sg[1] }, line: { color: C.paper, width: 1 } });
      cx += w;
    });
    s.addText("675 effective minutes", { x: X + 0.2, y: by, w: 5, h: bh, fontFace: F.body, fontSize: 15, bold: true, color: C.white, valign: "middle", margin: 0, isTextBox: true });
    s.addText("Lunch 30", { x: X + (675 / tot) * Wc - 0.6, y: by + bh + 0.08, w: 1.2, h: 0.3, fontFace: F.body, fontSize: 11, color: C.signal, bold: true, align: "center", margin: 0, isTextBox: true });
    s.addText("Tea 15", { x: X + Wc - 0.9, y: by - 0.34, w: 0.9, h: 0.3, fontFace: F.body, fontSize: 11, color: "C8693C", bold: true, align: "right", margin: 0, isTextBox: true });
    s.addText("Two shifts  ·  720 min", { x: X, y: by - 0.34, w: 3, h: 0.3, fontFace: F.body, fontSize: 10, color: C.mute, margin: 0, isTextBox: true });
    const col = (x, w, big, small, color) => {
      s.addText(big, { x, y: 3.85, w, h: 0.75, fontFace: F.head, fontSize: 36, color: color || C.text, margin: 0, isTextBox: true });
      s.addText(small, { x, y: 4.62, w, h: 0.55, fontFace: F.body, fontSize: 11, color: C.mute, margin: 0, valign: "top", isTextBox: true });
    };
    const op = (x, t) => s.addText(t, { x, y: 3.85, w: 0.4, h: 0.75, fontFace: F.head, fontSize: 28, color: C.mute, align: "center", margin: 0, isTextBox: true });
    col(X, 1.15, "720", "minutes available");
    op(X + 1.1, "−");
    col(X + 1.55, 1.2, "45", "planned breaks", C.signal);
    op(X + 2.7, "=");
    col(X + 3.15, 1.2, "675", "effective minutes");
    op(X + 4.3, "×");
    col(X + 4.75, 1.2, "100", "units / minute, rated speed");
    op(X + 5.9, "=");
    col(X + 6.3, 2.2, "67,500", "ideal units per day", C.jhs);
    s.addText("That's what the line could make running all 675 minutes at full speed with zero rejects.", {
      x: X, y: 5.75, w: Wc, h: 0.7, fontFace: F.head, fontSize: 17, italic: true, color: C.steel, margin: 0, valign: "top", isTextBox: true,
    });
    s.addText("One operating cycle observed during plant induction: actual plant observation, not the demonstration dataset.", {
      x: X, y: 6.85, w: Wc, h: 0.3, fontFace: F.body, fontSize: 9.5, italic: true, color: C.mute, margin: 0, isTextBox: true,
    });
    folio(s, n++);
    notes(s, {
      say: `During the plant induction, I observed one full operating cycle on the main toothpaste line. This is the one figure in the presentation that comes from actual plant observation rather than the demonstration dataset. Two shifts give 720 available minutes. Take away a 30-minute lunch and a 15-minute tea break, and you have 675 effective minutes. At the line's rated speed of 100 units a minute, the ideal is 67,500 units. That's the benchmark: every available minute, at full speed, with no rejects.`,
      why: `It gives a concrete, measurable baseline, and it separates planned time, which isn't a loss, from actual loss.`,
      notice: `Planned breaks are removed before calculating the ideal, so the benchmark is fair to the line.`,
      q: [
        ["Where did 100 units per minute come from?", "It's the rated speed of that line. In the MES, the equivalent figure is the ideal speed held in the machine master, not typed on each production record."],
        ["Why exclude breaks?", "Because they're planned. Loss is measured against the time the line was meant to run, so planned breaks aren't counted as downtime."],
        ["Is one cycle enough?", "Not for a performance conclusion, and I don't draw one. It was enough to show me the problem: working out the gap was simple, but explaining it wasn't."],
      ],
      next: `So what did the line actually produce?`,
      src: "Tube filling line, paste plant, JHS Kala-Amb (photograph provided by the presenter).",
    });
  }

  // 13. The gap
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    act(s, 5, "The line study");
    question(s, "So where did 27,500 units go?");
    s.addChart(pres.charts.BAR, [{ name: "Units", labels: ["Ideal output", "Actual output"], values: [67500, 40000] }], {
      x: 0.5, y: 1.8, w: 7.0, h: 4.4, barDir: "col", barGapWidthPct: 55,
      chartColors: ["B9C3CF", C.ink], valAxisHidden: true, valGridLine: { style: "none" }, catGridLine: { style: "none" },
      catAxisLabelColor: C.text, catAxisLabelFontFace: F.body, catAxisLabelFontSize: 14, catAxisLineShow: false,
      showValue: true, dataLabelPosition: "outEnd", dataLabelFontFace: F.body, dataLabelFontSize: 16, dataLabelColor: C.text, dataLabelFormatCode: "#,##0",
      showLegend: false, valAxisMinVal: 0, valAxisMaxVal: 75000,
    });
    s.addText("~27,500", { x: 8.0, y: 1.95, w: 4.8, h: 1.2, fontFace: F.head, fontSize: 66, color: C.signal, margin: 0, isTextBox: true });
    s.addText("units between ideal and actual", { x: 8.0, y: 3.1, w: 4.8, h: 0.4, fontFace: F.body, fontSize: 15, color: C.text, margin: 0, isTextBox: true });
    s.addText("~40.7%", { x: 8.0, y: 3.7, w: 4.8, h: 0.9, fontFace: F.head, fontSize: 44, color: C.text, margin: 0, isTextBox: true });
    s.addText("variance against ideal output\n(27,500 ÷ 67,500)", { x: 8.0, y: 4.55, w: 4.8, h: 0.6, fontFace: F.body, fontSize: 13, color: C.mute, margin: 0, valign: "top", isTextBox: true });
    s.addText("But one loss number can't tell you whether the line stopped, slowed down, or made rejects.", {
      x: 8.0, y: 5.4, w: 4.8, h: 0.9, fontFace: F.head, fontSize: 15, italic: true, color: C.steel, margin: 0, valign: "top", isTextBox: true,
    });
    s.addText("One line, one 12-hour shift, observed during the internship. A line-study observation, not a company-wide performance figure.", {
      x: 0.6, y: 6.75, w: 12, h: 0.3, fontFace: F.body, fontSize: 10, italic: true, color: C.mute, margin: 0, isTextBox: true,
    });
    folio(s, n++);
    notes(s, {
      say: `The line actually produced around 40,000 units. That's a gap of about 27,500 units, or roughly 40.7% below the ideal. I want to be careful here: this is one line on one shift that I observed. It's not a statement about JHS's overall performance. What interested me more was that this single number doesn't tell you why. Did the machine stop? Did it run slowly? Were units rejected? Without connected records, you can't split the gap.`,
      why: `This is the operational version of the same problem. The data exists, but it isn't structured to explain the loss.`,
      notice: `The caveat. I'm presenting an observation, not a KPI claim about the company.`,
      q: [
        ["Is 40% loss normal?", "It's not unusual for a single observed shift to include changeovers, minor stops and speed losses. But I wouldn't generalise from one shift. That would need data across many shifts."],
        ["How did you count actual output?", `${ctx.actualCountSource}`],
        ["Why ~ and not exact?", "The actual output was an approximate figure from the shift, so I kept the precision honest."],
      ],
      next: `At this point I had two problems: a traceability problem and a visibility problem. So I asked myself what a system would need to answer.`,
    });
  }

  // ───────────────── ACT 6 — THE QUESTION BECOMES A SYSTEM ─────────────────
  // 14. Requirements
  {
    const s = pres.addSlide();
    s.background = { color: C.ink };
    act(s, 6, "The question becomes a system", true);
    s.addText("So I asked myself:\nwhat would the system need to answer?", {
      x: 0.6, y: 0.85, w: 12, h: 1.5, fontFace: F.head, fontSize: 32, color: C.white, margin: 0, valign: "top", isTextBox: true,
    });
    const reqs = [
      "Can I identify the correct production run?",
      "Can I connect production with quality?",
      "Can I trace materials forward?",
      "Can I trace an implicated lot backwards?",
      "Can management see production and losses?",
      "Can I calculate OEE?",
    ];
    reqs.forEach((r, i) => {
      const col = i < 3 ? 0 : 1, row = i % 3;
      const x = 0.6 + col * 6.3, y = 2.85 + row * 1.25;
      s.addText(String(i + 1).padStart(2, "0"), { x, y, w: 0.9, h: 0.8, fontFace: F.head, fontSize: 34, color: C.signal, margin: 0, valign: "top", isTextBox: true });
      s.addText(r, { x: x + 1.0, y: y + 0.08, w: 5.0, h: 0.8, fontFace: F.head, fontSize: 19, color: C.white, margin: 0, valign: "top", isTextBox: true });
    });
    folio(s, n++, true);
    notes(s, {
      say: `So instead of starting with Excel, I started with questions. Can I identify the correct production run from a pack? Can I connect production with quality? Can I trace a material forward to see where it went? Can I trace an implicated lot backwards? Can management see production and losses without someone compiling a report? And can I calculate OEE to explain the gap I saw on the line? These six questions became my requirements.`,
      why: `Requirements came from real questions, not from features I wanted to build. It also gives me a way to test the system: does it answer each question?`,
      notice: `Questions 1 to 4 are about traceability, from the complaint. Questions 5 and 6 are about performance, from the line study.`,
      q: [["How did you validate these requirements?", "By discussing them with the operations team and checking them against the records they actually maintained, so the system could be fed from existing data."]],
      next: `Getting from these questions to a working system wasn't a straight line.`,
    });
  }

  // 15. Evolution
  {
    const s = pres.addSlide();
    s.background = { color: C.paper };
    act(s, 6, "The question becomes a system");
    question(s, "How did the project evolve?");
    const ev = [
      ["Process study", "Walked the flow, read the registers"],
      ["Requirements", "Six questions the system must answer"],
      ["Problem definition", "Disconnected records, non-unique key"],
      ["System design", "Five layers, one internal key"],
      ["Development", "Masters, registers, formulas, dashboards"],
      ["Testing", "Exposed repeating batch numbers"],
      ["Refinement", "Identification logic reworked"],
      ["Final MES", ctx.versionLabel],
    ];
    const x0 = 0.6, cw = 1.52, y = 3.1;
    ev.forEach((e, i) => {
      const x = x0 + i * cw;
      const last = i === ev.length - 1;
      s.addShape("rect", { x, y: y + (i % 2 ? 0 : 0), w: cw - 0.08, h: 0.12, fill: { color: last ? C.signal : i < 3 ? "8A949C" : C.ink }, line: { type: "none" } });
      s.addText(String(i + 1).padStart(2, "0"), { x, y: y - 0.75, w: cw - 0.1, h: 0.5, fontFace: F.head, fontSize: 24, color: last ? C.signal : C.faint, margin: 0, isTextBox: true });
      s.addText(e[0], { x, y: y + 0.3, w: cw - 0.15, h: 0.65, fontFace: F.head, fontSize: 15, color: C.text, margin: 0, valign: "top", isTextBox: true });
      s.addText(e[1], { x, y: y + 0.98, w: cw - 0.2, h: 1.0, fontFace: F.body, fontSize: 11, color: C.mute, margin: 0, valign: "top", isTextBox: true });
    });
    s.addText("Understand", { x: 0.6, y: 5.35, w: 4.4, h: 0.3, fontFace: F.body, fontSize: 10, bold: true, color: "8A949C", charSpacing: 3, margin: 0, isTextBox: true });
    s.addText("Build", { x: 0.6 + 3 * cw, y: 5.35, w: 4, h: 0.3, fontFace: F.body, fontSize: 10, bold: true, color: C.ink, charSpacing: 3, margin: 0, isTextBox: true });
    s.addText("Three of the eight phases happened before a single formula was written.", {
      x: 0.6, y: 6.0, w: 12, h: 0.5, fontFace: F.head, fontSize: 18, italic: true, color: C.steel, margin: 0, isTextBox: true,
    });
    folio(s, n++);
    notes(s, {
      say: `This is how the project actually evolved. The first three stages were about understanding: studying the process, turning it into requirements, and defining the real problem. Only then did I design the system, build it, test it and refine it. It wasn't linear. Several parts were rebuilt as my understanding improved. The biggest change came in testing: I found that batch numbers repeat, so in refinement I reworked the identification logic around four fields and an internal run key. The design changed because the evidence changed it.`,
      why: `It shows a structured approach and that the design came out of understanding the operation.`,
      notice: `The build phase starts at stage four.`,
      q: [
        ["How long did each phase take?", `${ctx.phaseTiming}`],
        ["What changed during refinement?", "The traceability logic. The first version searched on batch number. Testing showed the same batch number returning several runs, so I moved to four-field identification with a unique Production Run ID. I also tightened validation: every coded field became a dropdown from master data."],
      ],
      next: `Let me show you how I structured the system.`,
    });
  }

  // ───────────────── ACT 7 — THE BUILD ─────────────────
  // 16. Architecture
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    act(s, 7, "The build");
    question(s, "How did I structure it?");
    const L = ctx.layers;
    const x = 0.6, w0 = 6.75, h = 0.86, g = 0.2, y0 = 1.85;
    L.forEach((l, i) => {
      const y = y0 + i * (h + g);
      const fills = [C.ink, "2A3138", "3E4750", "56606A", "7A848D"];
      s.addShape("rect", { x, y, w: w0, h, fill: { color: i === 2 ? C.signal : fills[i] }, line: { type: "none" } });
      s.addText(l[0], { x: x + 0.3, y, w: 3.1, h, fontFace: F.body, fontSize: 15, bold: true, color: C.white, charSpacing: 2, valign: "middle", margin: 0, isTextBox: true });
      s.addText(l[1], { x: x + 3.35, y, w: w0 - 3.5, h, fontFace: F.body, fontSize: 10.5, color: "E8EAEC", valign: "middle", margin: 0, isTextBox: true });
      if (i < L.length - 1) s.addText("↓", { x: x + 0.3, y: y + h - 0.02, w: 0.4, h: g + 0.04, fontFace: F.body, fontSize: 11, color: C.mute, margin: 0, align: "left", valign: "middle", isTextBox: true });
    });
    s.addText("WHAT EACH LAYER DOES", { x: 7.75, y: 1.9, w: 5.0, h: 0.3, fontFace: F.body, fontSize: 10, bold: true, color: C.mute, charSpacing: 2, margin: 0, isTextBox: true });
    const roles = [
      ["Master data", "defines the allowed values once."],
      ["Transaction registers", "capture each event against those values."],
      ["Calculation", "joins and summarises the registers."],
      ["Presentation", "answers the questions: dashboards and trace reports."],
      ["Documentation", "explains how to use and maintain it."],
    ];
    s.addText(roles.map((r, i) => ({ text: `${r[0]} ${r[1]}`, options: { breakLine: i < roles.length - 1 } })), {
      x: 7.75, y: 2.25, w: 5.0, h: 2.3, fontFace: F.body, fontSize: 12, color: C.steel, margin: 0, valign: "top", paraSpaceAfter: 5, isTextBox: true,
    });
    s.addText(ctx.sheetCountLine, { x: 7.75, y: 4.55, w: 5.0, h: 0.7, fontFace: F.head, fontSize: 14, italic: true, color: C.text, margin: 0, valign: "top", isTextBox: true });
    const rp = photo(s, ctx.records.trace1.path, ctx.records.trace1.ar, 7.75, 5.5, 2.95);
    s.addText([
      { text: "Before: ", options: { bold: true, color: C.text } },
      { text: "the plant's paper traceability report for the same brush line. Its columns became register fields: handle lot, nylon and brass-wire lots, packing materials, machines.", options: { color: C.steel } },
    ], { x: 10.9, y: 5.45, w: 1.85, h: 1.55, fontFace: F.body, fontSize: 9.5, margin: 0, valign: "top", isTextBox: true });
    folio(s, n++);
    notes(s, {
      say: `I organised the workbook into five layers. Master data holds the reference lists: products, colours, machines, materials and ideal speeds. Transaction registers are where daily events are entered: production, quality, material issue, downtime and dispatch. The calculation layer joins and summarises those registers using formulas like SUMIFS, COUNTIFS and INDEX-MATCH. The presentation layer is what users see: dashboards, the trace report and the OEE view. Documentation explains how to use and maintain it. Data flows in one direction, from masters to registers to calculations to outputs. Bottom right is the plant's own paper traceability report. I used its columns, like handle lot, nylon and brass-wire lots, packing materials and machines, as the fields in my registers, so the system records what the plant already tracks.`,
      why: `Separating reference data, event data and calculations is basic data modelling. It keeps the system consistent and easier to maintain than one big sheet.`,
      notice: `The calculation layer, highlighted, is where the disconnected registers finally get joined.`,
      q: [
        ["Why separate master and transaction data?", "Master data changes rarely and should be entered once. If a product name is typed freely in every register, lookups break. Dropdowns pull from the master, so every register uses the same values."],
        ["Why not one big sheet?", "One sheet mixes reference data, events and calculations. It gets slow, hard to validate and easy to break. Layers keep each job separate."],
      ],
      next: `But the layers only work if the records can be linked. And that needs a key.`,
      src: "Plant record photographed during the internship (provided by the presenter): Traceability Report - Bristling, Patanjali Triple Action, batch JBCA260003 (format JHS/QF/8.5.1-1/9), rows 1-7.",
    });
  }

  // 17. Production Run ID
  {
    const s = pres.addSlide();
    s.background = { color: C.paper };
    act(s, 7, "The build");
    question(s, "What connects the records?");
    // left: batch number card
    s.addShape("rect", { x: 0.6, y: 1.95, w: 4.3, h: 4.4, fill: { color: C.white }, line: { color: C.faint, width: 1 } });
    s.addText("BATCH NUMBER", { x: 0.9, y: 2.2, w: 3.8, h: 0.3, fontFace: F.body, fontSize: 11, bold: true, color: C.mute, charSpacing: 3, margin: 0, isTextBox: true });
    s.addText("The printed identifier", { x: 0.9, y: 2.55, w: 3.8, h: 0.5, fontFace: F.head, fontSize: 22, color: C.text, margin: 0, isTextBox: true });
    s.addText([
      { text: "On the pack, customer-facing", options: { bullet: true, breakLine: true } },
      { text: "Follows the plant's coding convention", options: { bullet: true, breakLine: true } },
      { text: "Can repeat across products, colours and dates", options: { bullet: true, breakLine: true } },
      { text: "Stays as it is", options: { bullet: true, bold: true } },
    ], { x: 0.9, y: 3.25, w: 3.8, h: 2.6, fontFace: F.body, fontSize: 14, color: C.steel, margin: 0, paraSpaceAfter: 8, valign: "top", isTextBox: true });
    // right: hub
    const cx = 9.0, cy = 4.1;
    const spokes = [["Production", -90], ["Quality", -18], ["Dispatch", 54], ["Downtime", 126], ["Material", 198]];
    const R = 2.0;
    spokes.forEach(([t, a]) => {
      const rad = (a * Math.PI) / 180;
      const px = cx + R * Math.cos(rad), py = cy + R * Math.sin(rad) * 0.9;
      s.addShape("line", { x: Math.min(cx, px), y: Math.min(cy, py), w: Math.abs(px - cx) || 0.001, h: Math.abs(py - cy) || 0.001,
        flipH: px < cx !== py < cy ? true : false, line: { color: C.faint, width: 1.5 } });
      s.addShape("roundRect", { x: px - 0.8, y: py - 0.28, w: 1.6, h: 0.56, rectRadius: 0.28, fill: { color: C.white }, line: { color: C.steel, width: 1 } });
      s.addText(t, { x: px - 0.8, y: py - 0.28, w: 1.6, h: 0.56, fontFace: F.body, fontSize: 13, bold: true, color: C.text, align: "center", valign: "middle", margin: 0, isTextBox: true });
    });
    s.addShape("ellipse", { x: cx - 0.95, y: cy - 0.95, w: 1.9, h: 1.9, fill: { color: C.signal }, line: { color: C.white, width: 3 } });
    s.addText([{ text: "Production", options: { breakLine: true } }, { text: "Run ID", options: {} }], {
      x: cx - 0.95, y: cy - 0.95, w: 1.9, h: 1.9, fontFace: F.head, fontSize: 17, bold: true, color: C.white, align: "center", valign: "middle", margin: 0, isTextBox: true,
    });
    s.addText("Production Run ID = the internal system key", { x: 5.4, y: 6.45, w: 7.4, h: 0.45, fontFace: F.head, fontSize: 18, italic: true, color: C.text, align: "center", margin: 0, isTextBox: true });
    folio(s, n++);
    notes(s, {
      say: `This is the single most important design decision in the system. The batch number stays exactly as it is. It's printed on the pack and it's what the customer and regulators see. But inside the system, every production run gets its own Production Run ID, which is unique. ${ctx.runIdFormatSay} Every downstream record, quality checks, material issues, downtime and dispatch, carries that Run ID. So once the Trace Report identifies the right run from the four pack fields, everything else is connected through one key.`,
      why: `A key must be unique. Batch number is the printed identifier; Production Run ID is the relational key. Separating the two is what makes traceability reliable.`,
      notice: `Batch Number isn't replaced. The system translates from the printed identifier to the internal key.`,
      q: [
        ["Why can't Batch Number be the key?", "Because it can repeat. A key used for lookups must be unique, otherwise INDEX-MATCH returns the first match, which might be the wrong run."],
        ["How is the Run ID generated?", `${ctx.runIdGen}`],
        ["What stops two people creating the same Run ID?", "In the prototype, nothing physically stops it, but Master Traceability has a validation column that flags 'Duplicate Run ID' straight away. In a multi-user system, a database would generate the ID and enforce uniqueness. That's one of the limitations I'll come to."],
      ],
      next: `I could walk you through each module now. But I think it's easier if you see the flow first.`,
    });
  }

  // ───────────────── ACT 8 — THE REVEAL ─────────────────
  // 18. Video
  {
    const s = pres.addSlide();
    s.background = { color: C.ink };
    act(s, 8, "The reveal", true);
    s.addText("Before I show you the system…", { x: 0.6, y: 0.8, w: 12, h: 0.8, fontFace: F.head, fontSize: 36, color: C.white, margin: 0, isTextBox: true });
    s.addText("May I take approximately 40 seconds to show you the workflow?", { x: 0.6, y: 1.6, w: 12, h: 0.45, fontFace: F.body, fontSize: 17, color: "AEB4B9", margin: 0, isTextBox: true });
    const vx = 2.42, vy = 2.35, vw = 8.5, vh = 4.78;
    if (ctx.video) {
      s.addMedia({ type: "video", path: ctx.video.path, cover: ctx.video.cover, x: vx, y: vy, w: vw, h: vh });
    } else {
      s.addShape("rect", { x: vx, y: vy, w: vw, h: vh, fill: { color: "0B0D0F" }, line: { color: "3A4148", width: 1 } });
      s.addShape("ellipse", { x: vx + vw / 2 - 0.55, y: vy + vh / 2 - 0.75, w: 1.1, h: 1.1, fill: { color: C.signal }, line: { type: "none" } });
      s.addShape("triangle", { x: vx + vw / 2 - 0.16, y: vy + vh / 2 - 0.47, w: 0.48, h: 0.54, rotate: 90, fill: { color: C.white }, line: { type: "none" } });
      s.addText("MES workflow  ·  approx. 40 s", { x: vx, y: vy + vh / 2 + 0.55, w: vw, h: 0.35, fontFace: F.body, fontSize: 13, color: "AEB4B9", align: "center", margin: 0, isTextBox: true });
      s.addText("Insert > Video > This Device, then size it to this frame", { x: vx, y: vy + vh - 0.5, w: vw, h: 0.3, fontFace: F.body, fontSize: 10, italic: true, color: "5E666C", align: "center", margin: 0, isTextBox: true });
    }
    folio(s, n++, true);
    notes(s, {
      say: `Before I explain the individual modules: may I take approximately 40 seconds to show you a short workflow video? It will make the MES flow easier to understand before I explain the individual modules.\n\n[PLAY VIDEO]\n\nAFTER THE VIDEO: Now that you have seen the overall flow, let me show you what each part is doing.`,
      why: `Seeing the flow once gives the panel a mental map. The screenshots that follow then make sense as parts of one system instead of isolated sheets.`,
      notice: `The sequence: master data, registers, dashboard, trace report, retrieved record.`,
      q: [["Can we see it live in Excel?", "Yes, I have the workbook open and can show any sheet you'd like after the walkthrough."]],
      next: `Let's start where a manager would start: the dashboard.`,
    });
  }

  ctx.nextNo = n;
};
