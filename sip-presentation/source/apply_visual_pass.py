"""Apply the visual-evidence pass to the presenter's own edited deck (Shreejita_SIP_Deck.pptx).

Edits only: real plant records on the material-flow, registers and architecture slides; verified
client names on "Where was I?"; removal of every repeated photograph; caption accuracy; image sources
in speaker notes. Everything else in the deck (landing page, order, video, text) is left untouched.

usage: python3 apply_visual_pass.py <in.pptx> <out.pptx>
"""
import sys, os, json, copy
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.oxml.ns import qn
from lxml import etree
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
REC = os.path.join(HERE, "records")
PH = os.path.join(HERE, "photos")
RATIO = json.load(open(os.path.join(REC, "ratios.json")))

SIGNAL, MUTE, TEXT, STEEL, RULE, PAPER, WHITE, FAINT = "E0561F", "6B7278", "1A1D21", "3E4750", "D6D8D6", "F4F4F1", "FFFFFF", "B9BEC2"
HEAD, BODY = "Cambria", "Calibri"
rgb = lambda h: RGBColor.from_string(h)


# ---------- helpers ----------
def shape_by_text(slide, start):
    for sh in slide.shapes:
        if sh.has_text_frame and sh.text_frame.text.startswith(start):
            return sh
    raise KeyError(start)


def remove(sh):
    el = sh._element
    el.getparent().remove(el)


def send_to_back(sh):
    tree = sh._element.getparent()
    tree.remove(sh._element)
    tree.insert(2, sh._element)  # after nvGrpSpPr and grpSpPr


def place(sh, x=None, y=None, w=None, h=None):
    if x is not None: sh.left = Inches(x)
    if y is not None: sh.top = Inches(y)
    if w is not None: sh.width = Inches(w)
    if h is not None: sh.height = Inches(h)


def set_size(sh, old, new):
    for p in sh.text_frame.paragraphs:
        for r in p.runs:
            if r.font.size is not None and abs(r.font.size.pt - old) < 0.01:
                r.font.size = Pt(new)


def textbox(slide, x, y, w, h, runs, size=11, align=None, anchor=MSO_ANCHOR.TOP):
    """runs: list of (text, dict(bold, italic, color, font, size, spacing))."""
    tb = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    tf.vertical_anchor = anchor
    p = tf.paragraphs[0]
    if align: p.alignment = align
    for text, o in runs:
        r = p.add_run()
        r.text = text
        f = r.font
        f.name = o.get("font", BODY)
        f.size = Pt(o.get("size", size))
        f.bold = o.get("bold", False)
        f.italic = o.get("italic", False)
        f.color.rgb = rgb(o.get("color", TEXT))
        if o.get("spacing"):
            r._r.get_or_add_rPr().set("spc", str(int(o["spacing"] * 100)))
    return tb


def rect(slide, x, y, w, h, fill=None, line=None, line_w=0.75, shadow=False):
    s = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(x), Inches(y), Inches(w), Inches(h))
    if fill: s.fill.solid(); s.fill.fore_color.rgb = rgb(fill)
    else: s.fill.background()
    if line: s.line.color.rgb = rgb(line); s.line.width = Pt(line_w)
    else: s.line.fill.background()
    spPr = s._element.spPr
    if shadow:
        eff = etree.SubElement(spPr, qn("a:effectLst"))
        sh = etree.SubElement(eff, qn("a:outerShdw"), blurRad="101600", dist="25400", dir="5400000", algn="bl", rotWithShape="0")
        clr = etree.SubElement(sh, qn("a:srgbClr"), val="000000")
        etree.SubElement(clr, qn("a:alpha"), val="18000")
    else:
        # suppress theme shadow/effects
        etree.SubElement(spPr, qn("a:effectLst"))
    s.text_frame.text = ""
    return s


def photo(slide, path, x, y, w):
    ar = RATIO.get(os.path.basename(path)) or (lambda im: im.width / im.height)(Image.open(path))
    h = w / ar
    rect(slide, x - 0.05, y - 0.05, w + 0.1, h + 0.1, fill=WHITE, line=RULE, shadow=True)
    slide.shapes.add_picture(path, Inches(x), Inches(y), Inches(w), Inches(h))
    return (x, y, w, h)


def cover_picture(slide, path, x, y, w, h):
    """Picture filling the box, cropped centrally (CSS 'cover')."""
    pic = slide.shapes.add_picture(path, Inches(x), Inches(y), Inches(w), Inches(h))
    im = Image.open(path); ar_i = im.width / im.height; ar_b = w / h
    if ar_i > ar_b:
        c = (1 - ar_b / ar_i) / 2; pic.crop_left = c; pic.crop_right = c
    else:
        c = (1 - ar_i / ar_b) / 2; pic.crop_top = c; pic.crop_bottom = c
    return pic


def mark(slide, r, b):
    x, y, w, h = r
    s = rect(slide, x + b[0] * w, y + b[1] * h, b[2] * w, b[3] * h, line=SIGNAL, line_w=2)
    return s


def pin(slide, n, cx, cy, d=0.3):
    o = slide.shapes.add_shape(MSO_SHAPE.OVAL, Inches(cx - d / 2), Inches(cy - d / 2), Inches(d), Inches(d))
    o.fill.solid(); o.fill.fore_color.rgb = rgb(SIGNAL)
    o.line.color.rgb = rgb(WHITE); o.line.width = Pt(1.5)
    etree.SubElement(o._element.spPr, qn("a:effectLst"))
    tf = o.text_frame
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    p = tf.paragraphs[0]; p.alignment = PP_ALIGN.CENTER
    r = p.add_run(); r.text = str(n)
    r.font.name = BODY; r.font.size = Pt(10); r.font.bold = True; r.font.color.rgb = rgb(WHITE)


def notes_edit(slide, replacements=(), src=None):
    tf = slide.notes_slide.notes_text_frame
    t = tf.text
    for a, b in replacements:
        assert a in t, a[:60]
        t = t.replace(a, b)
    if src and "IMAGE SOURCES" not in t:
        t = t.rstrip() + "\n\nIMAGE SOURCES\n" + src
    tf.text = t


def drop_unused_image_rels(slide):
    used = {el.get(qn("r:embed")) for el in slide._element.iter(qn("a:blip"))}
    used |= {el.get(qn("r:link")) for el in slide._element.iter(qn("a:blip"))}
    for rId, rel in list(slide.part.rels.items()):
        if rel.reltype.endswith("/image") and rId not in used:
            slide.part.drop_rel(rId)


CLIENT_SOURCES = (
    "Dabur India, Patanjali Ayurved, Amway India: named as contract-manufacturing clients in JHS Svendgaard's company profile "
    "(svendgaard.com/about.html) and investor material (svendgaard.com, Investor Presentation).\n"
    "Dabur partnership since 2000 and Amway collaboration: Manufacturing Today India, 'No shortcut, only perseverance: "
    "JHS Svendgaard's growth story' (manufacturingtodayindia.com/jhs-svendgaards-growth-story).\n"
    "Also listed by Sixth Sense Ventures (sixthsenseventures.com/portfolio/jhs-svendgaard-laboratories/).\n"
    "Patanjali products also appear on the plant's own FG production and traceability records photographed during the internship."
)


def main(src, dst):
    prs = Presentation(src)
    S = lambda title: next(s for s in prs.slides if any(sh.has_text_frame and sh.text_frame.text.startswith(title) for sh in s.shapes))

    # ---- "Where was I?": tighten the fact list, add verified client names
    s = S("Where was I?")
    labels = ["DEPARTMENT", "LOCATION", "PLANT", "DURATION"]
    values = ["Operations", "Kala-Amb, Himachal Pradesh", "Oral care", "Seven weeks"]
    for i, (l, v) in enumerate(zip(labels, values)):
        place(shape_by_text(s, l), y=3.3 + i * 0.66)
        place(shape_by_text(s, v), y=3.55 + i * 0.66)
    rule = s.shapes.add_connector(1, Inches(8.2), Inches(6.12), Inches(12.73), Inches(6.12))
    rule.line.color.rgb = rgb(RULE); rule.line.width = Pt(0.75)
    textbox(s, 8.2, 6.22, 4.5, 0.22, [("CONTRACT-MANUFACTURING CLIENTS, PUBLICLY REPORTED", dict(size=8.5, bold=True, color=MUTE, spacing=1.5))])
    for i, name in enumerate(["Dabur India", "Patanjali Ayurved", "Amway India"]):
        textbox(s, 8.2 + i * 1.55, 6.48, 1.5, 0.3, [(name, dict(font=HEAD, size=12.5, color=TEXT))])
    textbox(s, 8.2, 6.84, 2.5, 0.2, [("Sources in speaker notes", dict(size=7.5, italic=True, color=MUTE))])
    notes_edit(s, [
        ("I spent my time on the floor,", "JHS is a contract manufacturer: publicly reported clients include Dabur India, Patanjali Ayurved and Amway India, which you can see at the bottom right. I spent my time on the floor,"),
    ], src="Aerial view of the JHS Kala-Amb facility (image provided by the presenter; add its original credit if it came from JHS).\n\nCLIENT SOURCES\n" + CLIENT_SOURCES)

    # ---- "What does it look like on the ground?": one photograph only (skyline), no repeats
    s = S("What does it look like on the ground?")
    pics = [sh for sh in s.shapes if sh.shape_type == 13]
    yard, machine, skyline = pics  # left, top-right, bottom-right
    remove(yard); remove(machine); remove(skyline)
    sky = cover_picture(s, os.path.join(PH, "2.jpg"), 0, 0, 13.333, 7.5)
    send_to_back(sky)
    for sh in list(s.shapes):
        if sh.shape_type == 1 and abs(sh.left / 914400 - 8.28) < 0.02:  # the two caption bands on the right photos
            remove(sh)
    remove(shape_by_text(s, "Tube filling line, paste plant"))
    cap = shape_by_text(s, "Kala-Amb industrial belt from the plant roof")
    place(cap, x=8.3, y=7.0, w=4.4)
    cap.text_frame.paragraphs[0].alignment = PP_ALIGN.RIGHT
    drop_unused_image_rels(s)
    notes_edit(s, [
        ("These are photographs from the plant. On the left is the yard between production blocks, where material moves between stores, production and dispatch all day. Top right is a tube filling line in the paste plant: empty tubes come in from the hopper, then get filled, coded and sealed. Bottom right is the Kala-Amb industrial belt from the roof.",
         "This is the view from the plant roof: production blocks, stores and utilities, with the Kala-Amb industrial belt and the hills behind. Stores, production, QC, packing and dispatch are spread across the campus, and material moves between them all day."),
    ], src="Photograph from the plant roof, JHS Kala-Amb (image provided by the presenter).")

    # ---- Opener: the yard photograph instead of the (repeated) tube-filling photo
    s = S("A SUMMER INTERNSHIP PROJECT")
    old = next(sh for sh in s.shapes if sh.shape_type == 13)
    remove(old)
    send_to_back(cover_picture(s, os.path.join(PH, "3.jpg"), 0, 0, 13.333, 7.5))
    drop_unused_image_rels(s)
    notes_edit(s, [("This is an actual photograph from the plant, a tube filling line, not a stock image.",
                    "This is an actual photograph from the plant, the yard between production blocks, not a stock image.")],
               src="Photograph of the plant yard between production blocks, JHS Kala-Amb (image provided by the presenter).")

    # ---- Material flow: smaller record cards, two real records beneath their stages
    s = S("How does material move through the plant?")
    for sh in list(s.shapes):
        L, T = sh.left / 914400, sh.top / 914400
        if sh.shape_type == 1 and abs(T - 3.65) < 0.02:
            place(sh, y=3.55, h=1.3)
        elif sh.has_text_frame and sh.text_frame.text == "RECORD":
            place(sh, y=3.63)
        elif sh.has_text_frame and abs(T - 4.0) < 0.02:
            place(sh, y=3.88, h=0.95); set_size(sh, 12.5, 12)
    line = shape_by_text(s, "But those records did not automatically become one connected story.")
    place(line, y=6.6, h=0.45); set_size(line, 22, 20)
    x0, sp = 0.75, 2.07
    r1 = photo(s, os.path.join(REC, "rec_process_params_11jun_c.jpg"), x0 + 2 * sp - 0.1, 5.02, 2.95)
    textbox(s, r1[0], r1[1] + r1[3] + 0.08, 3.3, 0.22, [("At the machine: bristling process-parameter record, 11 Jun, shift A", dict(size=8.5, italic=True, color=MUTE))])
    r2 = photo(s, os.path.join(REC, "rec_fg_production_13jun_c.jpg"), x0 + 4 * sp - 0.1, 5.02, 2.95)
    textbox(s, r2[0], r2[1] + r2[3] + 0.08, 3.3, 0.22, [("After packing: FG production record, 13 Jun, shift A", dict(size=8.5, italic=True, color=MUTE))])
    notes_edit(s, [
        ("At every step, someone creates a record. So the plant",
         "At every step, someone creates a record. At the bottom are two of them as they actually look: the process-parameter record filled at the bristling machines, and the finished-goods production record filled after packing. So the plant"),
        ('LIKELY PANEL QUESTIONS & MY ANSWERS\nQ1. How did you map this flow?\nA: By walking the process, talking to the people in each function, and looking at the registers and formats they actually filled in.',
         "LIKELY PANEL QUESTIONS & MY ANSWERS\nQ1. How did you map this flow?\nA: By walking the process, talking to the people in each function, and looking at the registers and formats they actually filled in.\n\nQ2. What are the two forms at the bottom?\nA: Real plant formats. On the left, the bristling process-parameter record: speed and pressure for each tufting and trimming machine and the sealing temperatures, checked every shift. On the right, the FG production record: product, brushes per case, batch number and cases packed. They're filled by different people, at different points, on different sheets."),
    ], src="Plant record formats photographed during the internship (provided by the presenter): Bristling Process Parameter Monitoring Record (format JHS/QF/8.5.1-1, 11 Jun 2026, shift A); Production Record - FG (format JHS/QF/8.5.1-1/3, 13 Jun 2026, shift A).")

    # ---- Registers: real records replace the drawn cards
    s = S("Where was the information, and why was it slow to use?")
    for sh in list(s.shapes):
        L, T = sh.left / 914400, sh.top / 914400
        if L < 6.5 and 1.9 < T < 6.9:
            remove(sh)
    textbox(s, 0.6, 1.55, 6.2, 0.25, [("PLANT RECORDS, AS I FOUND THEM  ·  JUNE 2026", dict(size=9.5, bold=True, color=MUTE, spacing=1.5))])
    rt = photo(s, os.path.join(REC, "rec_traceability_p2_c.jpg"), 0.6, 1.95, 4.6)
    mark(s, rt, [0.10, 0.268, 0.145, 0.062]); mark(s, rt, [0.683, 0.272, 0.3, 0.05]); mark(s, rt, [0.0, 0.736, 1.0, 0.097])
    pin(s, 1, rt[0] + 0.12 * rt[2], rt[1] + 0.215 * rt[3]); pin(s, 2, rt[0] + rt[2] - 0.02, rt[1] + 0.736 * rt[3])
    textbox(s, 5.38, 1.95, 1.55, 2.6, [("Traceability report, bristling. ", dict(size=10, bold=True)),
                                        ("Its own headers say where each column comes from: the handle tag, the cap tag, incoming analytical reports, shift production formats. It is compiled by hand.", dict(size=10, color=STEEL))])
    rf = photo(s, os.path.join(REC, "rec_fg_production_11jun_c.jpg"), 0.6, 4.78, 3.5)
    mark(s, rf, [0.09, 0.61, 0.85, 0.095]); pin(s, 2, rf[0] + rf[2] - 0.02, rf[1] + 0.61 * rf[3])
    textbox(s, 4.35, 4.78, 2.55, 1.3, [("Written twice. ", dict(size=10.5, bold=True, color=SIGNAL)),
                                        ("11 June, JBCA260003, 25 cases: on the FG production record, and again in row 19 of the traceability report.", dict(size=10.5, color=STEEL))])
    textbox(s, 0.6, 6.45, 6.3, 0.45, [("SEPARATE REGISTERS  ", dict(size=9, bold=True, color=MUTE, spacing=1.5)),
                                       ("Production · Quality · Material · Downtime · Dispatch, each kept by its own function", dict(size=11.5))], anchor=MSO_ANCHOR.MIDDLE)
    notes_edit(s, [
        ("These are the five kinds of record I kept coming back to: production, quality, material, downtime and dispatch. Each one made sense on its own.",
         "These are real records from the bristling line. The first is the plant's own traceability report for Patanjali Triple Action, batch JBCA260003. Look at its headers: this column is 'data received from handle tag', this one 'from cap tag', these 'from shift production formats'. Someone builds this report by hand, from other records. And the same fact gets written twice. On 11 June, 25 cases of JBCA260003: once on the FG production record, and again in row 19 of the traceability report. The same page also shows one batch number running across several production days and colours, which is exactly why the batch number alone couldn't identify a run. Behind these are the five kinds of record I kept coming back to: production, quality, material, downtime and dispatch. Each one made sense on its own."),
        ("The registers are deliberately drawn scattered, with nothing joining them. That's the problem in one picture.",
         "Marker 2 appears on both records: the same fact, written by hand in two places. Nothing links them except a person copying it."),
    ], src="Plant records photographed during the internship (provided by the presenter): Traceability Report - Bristling, Patanjali Triple Action, batch JBCA260003 (format JHS/QF/8.5.1-1/9), rows 13-21; Production Record - FG, 11 Jun 2026, shift A (format JHS/QF/8.5.1-1/3).")

    # ---- Line study: accurate caption
    s = S("Main toothpaste line, paste plant")
    cap = shape_by_text(s, "Main toothpaste line, paste plant")
    cap.text_frame.paragraphs[0].runs[0].text = "Tube filling line, paste plant"
    notes_edit(s, src="Tube filling line, paste plant, JHS Kala-Amb (photograph provided by the presenter).")

    # ---- Architecture: narrower stack, paper traceability report as the "before"
    s = S("How did I structure it?")
    for sh in list(s.shapes):
        L, T, Wd = sh.left / 914400, sh.top / 914400, sh.width / 914400
        if sh.shape_type == 1 and abs(L - 0.6) < 0.02 and abs(Wd - 7.4) < 0.02:
            place(sh, w=6.75)
        elif sh.has_text_frame and abs(L - 0.9) < 0.02 and abs(Wd - 3.4) < 0.02:
            place(sh, w=3.1)
        elif sh.has_text_frame and abs(L - 4.2) < 0.02:
            place(sh, x=3.95, w=3.25); set_size(sh, 11.5, 10.5)
    place(shape_by_text(s, "WHAT EACH LAYER DOES"), x=7.75, w=5.0)
    roles = shape_by_text(s, "Master data defines")
    place(roles, x=7.75, y=2.25, w=5.0, h=2.3); set_size(roles, 13, 12)
    for p in roles.text_frame.paragraphs: p.space_after = Pt(5)
    cnt = shape_by_text(s, "27 worksheets")
    place(cnt, x=7.75, y=4.55, w=5.0, h=0.7); set_size(cnt, 15, 14)
    photo(s, os.path.join(REC, "rec_traceability_p1_c.jpg"), 7.75, 5.5, 2.95)
    textbox(s, 10.9, 5.45, 1.85, 1.55, [("Before: ", dict(size=9.5, bold=True)),
                                         ("the plant's paper traceability report for the same brush line. Its columns became register fields: handle lot, nylon and brass-wire lots, packing materials, machines.", dict(size=9.5, color=STEEL))])
    notes_edit(s, [("Data flows in one direction, from masters to registers to calculations to outputs.",
                    "Data flows in one direction, from masters to registers to calculations to outputs. Bottom right is the plant's own paper traceability report. I used its columns, like handle lot, nylon and brass-wire lots, packing materials and machines, as the fields in my registers, so the system records what the plant already tracks.")],
               src="Plant record photographed during the internship (provided by the presenter): Traceability Report - Bristling, Patanjali Triple Action, batch JBCA260003 (format JHS/QF/8.5.1-1/9), rows 1-7.")

    # ---- Learnings: no repeated photos; clean numbered cards
    s = S("What did the project teach me?")
    for sh in [sh for sh in s.shapes if sh.shape_type == 13]:
        remove(sh)
    drop_unused_image_rels(s)
    for i, (lab, sub, first) in enumerate([("THE PLANT", "Manufacturing understanding", "How material"),
                                          ("THE SYSTEM", "Technical understanding", "Data modelling"),
                                          ("THE MANAGER", "Managerial understanding", "Requirement gathering")]):
        x = 0.6 + i * 4.15
        card = rect(s, x, 1.75, 3.85, 4.75, fill=PAPER if i == 0 else WHITE, line=RULE)
        send_to_back(card)
        textbox(s, x + 0.3, 1.95, 1.5, 0.9, [(f"0{i + 1}", dict(font=HEAD, size=48, color=SIGNAL if i == 0 else FAINT))])
        place(shape_by_text(s, lab), x=x + 0.3, y=3.05, w=3.25)
        t = shape_by_text(s, sub); place(t, x=x + 0.3, y=3.37, w=3.25); set_size(t, 19, 17)
        b = shape_by_text(s, first); place(b, x=x + 0.3, y=4.05, w=3.25, h=2.3); set_size(b, 13, 14)
        for p in b.text_frame.paragraphs: p.space_after = Pt(10)

    # ---- Closing: no repeated aerial photo; plain dark slide
    s = S("“The bristles are getting off.”")
    for sh in list(s.shapes):
        if sh.shape_type == 13 or (sh.shape_type == 1 and sh.width / 914400 > 13):
            remove(sh)
    drop_unused_image_rels(s)
    bg = s.background.fill; bg.solid(); bg.fore_color.rgb = rgb("121518")

    prs.save(dst)
    print("saved", dst)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
