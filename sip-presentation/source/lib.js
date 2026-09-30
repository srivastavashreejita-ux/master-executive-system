// Shared design system for the SIP story deck
const C = {
  ink: "121518",      // near-black documentary background
  ink2: "1C2126",
  paper: "F4F4F1",    // light content background
  white: "FFFFFF",
  text: "1A1D21",
  mute: "6B7278",
  faint: "B9BEC2",
  rule: "D6D8D6",
  signal: "E0561F",   // safety orange — the "investigation" accent
  signalSoft: "FBE3D8",
  jhs: "1F4C94",      // JHS building blue, used sparingly
  jhsSoft: "DCE5F2",
  steel: "3E4750",
};
const F = { head: "Cambria", body: "Calibri" };
const W = 13.333, H = 7.5;

const NOTES = [];
function notes(slide, n) {
  NOTES.push(n);
  const qa = (n.q || []).map((x, i) => `Q${i + 1}. ${x[0]}\nA: ${x[1]}`).join("\n\n");
  slide.addNotes(
    `WHAT I SAY\n${n.say}\n\n` +
    `WHY IT MATTERS\n${n.why}\n\n` +
    `WHAT THE PANEL SHOULD NOTICE\n${n.notice}\n\n` +
    `LIKELY PANEL QUESTIONS & MY ANSWERS\n${qa || "—"}\n\n` +
    `TRANSITION TO NEXT SLIDE\n${n.next}` +
    (n.src ? `\n\nIMAGE SOURCES\n${n.src}` : "")
  );
}

// Act marker — the recurring "case file" motif
function act(slide, num, label, dark, x0) {
  slide.addText(
    [
      { text: `ACT ${String(num).padStart(2, "0")}`, options: { bold: true, color: C.signal } },
      { text: `   ${label.toUpperCase()}`, options: { color: dark ? "9AA1A7" : C.mute } },
    ],
    { x: x0 ?? 0.6, y: 0.38, w: 8, h: 0.3, fontFace: F.body, fontSize: 10.5, charSpacing: 3, margin: 0, isTextBox: true }
  );
}

function folio(slide, n, dark) {
  slide.addText(String(n).padStart(2, "0"), {
    x: W - 1.1, y: H - 0.55, w: 0.5, h: 0.25, fontFace: F.body, fontSize: 9,
    color: dark ? "7D858B" : C.faint, align: "right", margin: 0, isTextBox: true,
  });
}

// The slide's one question, as an editorial headline
function question(slide, text, o = {}) {
  slide.addText(text, {
    x: o.x ?? 0.6, y: o.y ?? 0.78, w: o.w ?? 12, h: o.h ?? 0.9,
    fontFace: F.head, fontSize: o.size ?? 32, color: o.color ?? C.text,
    bold: false, margin: 0, valign: "top", isTextBox: true,
  });
}

// Numbered annotation marker (orange disc) — used on every screenshot
function pin(slide, n, x, y, d = 0.36) {
  slide.addShape("ellipse", {
    x: x - d / 2, y: y - d / 2, w: d, h: d,
    fill: { color: C.signal }, line: { color: C.white, width: 1.5 },
  });
  slide.addText(String(n), {
    x: x - d / 2, y: y - d / 2, w: d, h: d, fontFace: F.body, fontSize: 11, bold: true,
    color: C.white, align: "center", valign: "middle", margin: 0, isTextBox: true,
  });
}

// Annotation legend row: pin + bold label + short explanation
function legend(slide, items, x, y, w, o = {}) {
  const gap = o.gap ?? 0.62;
  items.forEach((it, i) => {
    const yy = y + i * gap;
    pin(slide, it.n ?? i + 1, x + 0.18, yy + 0.18, 0.32);
    slide.addText(
      [
        { text: it.t, options: { bold: true, color: o.dark ? C.white : C.text, breakLine: true } },
        { text: it.d, options: { color: o.dark ? "AEB4B9" : C.mute } },
      ],
      { x: x + 0.5, y: yy - 0.02, w: w - 0.5, h: gap - 0.04, fontFace: F.body, fontSize: o.size ?? 12,
        margin: 0, valign: "top", isTextBox: true, paraSpaceAfter: 0 }
    );
  });
}

function frame(slide, x, y, w, h) {
  // soft shadowed white mount behind a screenshot
  slide.addShape("rect", {
    x, y, w, h, fill: { color: C.white }, line: { color: C.rule, width: 0.75 },
    shadow: { type: "outer", color: "000000", opacity: 0.18, blur: 8, offset: 2, angle: 90 },
  });
}

// Documentary photo or record: white mount + image at its native aspect ratio (w given)
function photo(slide, path, ar, x, y, w) {
  const h = w / ar;
  frame(slide, x - 0.05, y - 0.05, w + 0.1, h + 0.1);
  slide.addImage({ path, x, y, w, h });
  return { x, y, w, h };
}
function box(slide, r, b, color) {
  slide.addShape("rect", { x: r.x + b[0] * r.w, y: r.y + b[1] * r.h, w: b[2] * r.w, h: b[3] * r.h,
    fill: { type: "none" }, line: { color: color || C.signal, width: 2 } });
}
module.exports = { photo, box, NOTES, C, F, W, H, notes, act, folio, question, pin, legend, frame };
