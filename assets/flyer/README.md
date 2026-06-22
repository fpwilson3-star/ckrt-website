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
