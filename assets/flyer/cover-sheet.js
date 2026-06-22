// Source of truth for the fillable application cover sheet
// (assets/CKRT-application-cover-sheet.pdf). Edit fields/layout here, then
// rebuild with `npm run build` from assets/flyer/. See README.md.

const fs = require('fs');
const path = require('path');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');

// --- Brand palette (matches assets/css/style.css) ---
const NAVY = rgb(0x16 / 255, 0x31 / 255, 0x4d / 255);
const TEAL = rgb(0x1f / 255, 0x8a / 255, 0x82 / 255);
const INK  = rgb(0x20 / 255, 0x26 / 255, 0x2e / 255);
const MUTED = rgb(0x5a / 255, 0x66 / 255, 0x72 / 255);
const LINE = rgb(0xdf / 255, 0xe4 / 255, 0xea / 255);
const FIELDBG = rgb(0xf7 / 255, 0xf9 / 255, 0xfa / 255);

const PAGE_W = 612, PAGE_H = 792;      // US Letter
const MX = 50;                          // left/right margin
const CONTENT_W = PAGE_W - 2 * MX;

async function main() {
  const pdf = await PDFDocument.create();
  pdf.setTitle('CKRT Application Cover Sheet');
  pdf.setSubject('General applicant information');
  pdf.setCreator('Connecticut KUH Research Training Program');

  const helv = await pdf.embedFont(StandardFonts.Helvetica);
  const helvB = await pdf.embedFont(StandardFonts.HelveticaBold);
  const timesB = await pdf.embedFont(StandardFonts.TimesRomanBold);

  const form = pdf.getForm();
  const page = pdf.addPage([PAGE_W, PAGE_H]);
  let y = PAGE_H - MX;

  // --- Masthead ---
  // CK mark
  page.drawRectangle({ x: MX, y: y - 38, width: 38, height: 38, color: NAVY });
  page.drawRectangle({ x: MX + 5, y: y - 33, width: 28, height: 28, borderColor: TEAL, borderWidth: 2 });
  page.drawText('CK', { x: MX + 8, y: y - 27, size: 16, font: timesB, color: rgb(1, 1, 1) });

  const tx = MX + 52;
  page.drawText('YALE & UCONN HEALTH', { x: tx, y: y - 8, size: 7.5, font: helvB, color: TEAL });
  page.drawText('Connecticut KUH Research Training Program', { x: tx, y: y - 24, size: 14, font: timesB, color: NAVY });
  page.drawText('Application Cover Sheet — General Applicant Information', { x: tx, y: y - 38, size: 9.5, font: helv, color: MUTED });

  y -= 52;
  page.drawLine({ start: { x: MX, y }, end: { x: PAGE_W - MX, y }, thickness: 2, color: TEAL });
  y -= 22;

  // --- Layout helpers ---
  const LABEL_SZ = 8.5;
  const FIELD_H = 17;
  const GAP = 12;       // gap below a field block
  const LABEL_GAP = 3;  // gap between label and its field

  function sectionHeading(text) {
    y -= 6;
    page.drawText(text, { x: MX, y, size: 11, font: timesB, color: NAVY });
    y -= 5;
    page.drawLine({ start: { x: MX, y }, end: { x: PAGE_W - MX, y }, thickness: 0.75, color: LINE });
    y -= 14;
  }

  function label(text, x, atY) {
    page.drawText(text, { x, y: atY, size: LABEL_SZ, font: helvB, color: MUTED });
  }

  // One labeled text field spanning a given x..width
  function textField(name, lab, x, w) {
    label(lab, x, y);
    const f = form.createTextField(name);
    try { f.setFontSize(10); } catch (_) {}
    f.addToPage(page, {
      x, y: y - LABEL_GAP - FIELD_H, width: w, height: FIELD_H,
      borderColor: LINE, borderWidth: 1, backgroundColor: FIELDBG,
    });
    return FIELD_H + LABEL_GAP;
  }

  // Full-width single field; advances y
  function rowFull(name, lab) {
    textField(name, lab, MX, CONTENT_W);
    y -= LABEL_GAP + FIELD_H + GAP;
  }

  // Two fields side by side; advances y
  function rowTwo(a, b) {
    const gutter = 16;
    const w = (CONTENT_W - gutter) / 2;
    textField(a.name, a.label, MX, w);
    textField(b.name, b.label, MX + w + gutter, w);
    y -= LABEL_GAP + FIELD_H + GAP;
  }

  // Three fields side by side; advances y
  function rowThree(a, b, c) {
    const gutter = 14;
    const w = (CONTENT_W - 2 * gutter) / 3;
    textField(a.name, a.label, MX, w);
    textField(b.name, b.label, MX + w + gutter, w);
    textField(c.name, c.label, MX + 2 * (w + gutter), w);
    y -= LABEL_GAP + FIELD_H + GAP;
  }

  // A row of checkboxes under a label; advances y
  function checkboxRow(lab, boxes, note) {
    label(lab, MX, y);
    y -= LABEL_GAP + 13;
    let x = MX;
    const size = 11;
    for (const b of boxes) {
      const cb = form.createCheckBox(b.name);
      cb.addToPage(page, { x, y: y - 1, width: size, height: size, borderColor: MUTED, borderWidth: 1 });
      page.drawText(b.label, { x: x + size + 5, y: y, size: 9.5, font: helv, color: INK });
      x += size + 9 + b.label.length * 5.0 + 16;
    }
    if (note) {
      y -= 14;
      page.drawText(note, { x: MX, y, size: 8, font: helv, color: MUTED });
    }
    y -= GAP + 4;
  }

  // ===================== APPLICANT =====================
  sectionHeading('Applicant');
  rowTwo(
    { name: 'fullName', label: 'FULL NAME (LAST, FIRST, MI)' },
    { name: 'preferredName', label: 'PREFERRED NAME / PRONOUNS (OPTIONAL)' },
  );
  rowTwo(
    { name: 'email', label: 'EMAIL' },
    { name: 'phone', label: 'PHONE' },
  );
  rowFull('currentInstitution', 'CURRENT INSTITUTION');
  rowTwo(
    { name: 'departmentProgram', label: 'DEPARTMENT / PROGRAM' },
    { name: 'currentPosition', label: 'CURRENT POSITION / TITLE' },
  );

  // ================ CAREER STAGE & ELIGIBILITY ================
  sectionHeading('Career stage & eligibility');
  checkboxRow('APPLICANT TRACK', [
    { name: 'trackPredoc', label: 'Predoctoral' },
    { name: 'trackPostdocMD', label: 'Postdoctoral physician-scientist' },
    { name: 'trackPostdocPhD', label: 'Postdoctoral PhD scientist' },
  ]);
  rowTwo(
    { name: 'degreeHeld', label: 'HIGHEST DEGREE HELD (PhD / MD / DO) & YEAR' },
    { name: 'degreeEnrolled', label: 'IF ENROLLED: PROGRAM & EXPECTED COMPLETION' },
  );
  checkboxRow('CITIZENSHIP / RESIDENCY', [
    { name: 'citizenUS', label: 'U.S. citizen' },
    { name: 'citizenPR', label: 'Permanent resident (green card)' },
  ], 'TL1 appointment is limited to U.S. citizens and permanent residents, per NIH NRSA policy.');

  // ================ RESEARCH & MENTORSHIP ================
  sectionHeading('Research & mentorship');
  checkboxRow('KUH DISCIPLINE', [
    { name: 'discNephrology', label: 'Nephrology' },
    { name: 'discHematology', label: 'Classical (benign) hematology' },
    { name: 'discUrology', label: 'Benign urology' },
  ]);
  rowFull('researchArea', 'PROPOSED RESEARCH AREA / PROJECT TITLE');
  rowThree(
    { name: 'mentorName', label: 'PRIMARY MENTOR — NAME' },
    { name: 'mentorInstitution', label: 'INSTITUTION' },
    { name: 'mentorEmail', label: 'EMAIL' },
  );
  rowTwo(
    { name: 'mentor2Name', label: 'SECONDARY MENTOR — NAME (OPTIONAL)' },
    { name: 'mentor2Email', label: 'SECONDARY MENTOR — EMAIL (OPTIONAL)' },
  );
  rowTwo(
    { name: 'signature', label: 'APPLICANT NAME (CONFIRMS INFORMATION IS ACCURATE)' },
    { name: 'date', label: 'DATE' },
  );

  // --- Footer ---
  const fy = MX - 8;
  page.drawLine({ start: { x: MX, y: fy + 14 }, end: { x: PAGE_W - MX, y: fy + 14 }, thickness: 0.75, color: LINE });
  page.drawText('Include this cover sheet as the first page of your Part I application materials.', { x: MX, y: fy, size: 8.5, font: helv, color: MUTED });
  page.drawText('Submit to apply@ckrt.org  ·  ckrt.org', { x: MX, y: fy - 12, size: 8.5, font: helvB, color: NAVY });

  // Make form fields render their styling consistently
  form.updateFieldAppearances(helv);

  const bytes = await pdf.save();
  const out = path.resolve(__dirname, '../CKRT-application-cover-sheet.pdf');
  fs.writeFileSync(out, bytes);
  console.log('Wrote', out, '(' + bytes.length + ' bytes), y ended at', Math.round(y));
}

main().catch((e) => { console.error(e); process.exit(1); });
