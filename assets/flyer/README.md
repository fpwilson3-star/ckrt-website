# Application flyer

`CKRT-application-flyer.html` is the **source of truth** for the downloadable
`assets/CKRT-application-flyer.pdf`. Edit the HTML, then re-render the PDF.

## Regenerate the PDF

Using Microsoft Edge (Windows) headless — run from the repo root:

```bash
"/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" \
  --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="C:/Users/fpwil/CKRT website/assets/CKRT-application-flyer.pdf" \
  "file:///C:/Users/fpwil/CKRT website/assets/flyer/CKRT-application-flyer.html"
```

Google Chrome works the same way (swap the executable path).

The output PDF is intentionally allowed past `.gitignore` (which blocks `*.pdf`)
via the `!assets/CKRT-application-flyer.pdf` exception — it is a public,
shareable asset, not a grant document. Keep the PDF in sync with the HTML when
you commit changes.

# Application cover sheet (fillable PDF)

`cover-sheet.js` is the **source of truth** for the fillable AcroForm
`assets/CKRT-application-cover-sheet.pdf` (the "general applicant information"
form). Edit fields/layout there, then rebuild with Node:

```bash
cd assets/flyer
npm install        # first time only; installs pdf-lib (node_modules is gitignored)
npm run build      # writes ../CKRT-application-cover-sheet.pdf
```

This PDF is allowed past `.gitignore` via the
`!assets/CKRT-application-cover-sheet.pdf` exception. Keep it in sync with
`cover-sheet.js` when you commit, and re-check it for label overlaps after
changing any field text.
