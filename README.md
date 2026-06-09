# Connecticut KUH Research Training Program (CKRT) — website

Source for the public website at **https://ckrt.org**, hosted on GitHub Pages.

The site is a small custom static site built with plain HTML/CSS. GitHub Pages'
built-in Jekyll engine is used only to share one navigation bar and footer across
every page — there is **no third-party theme** and no build step you run yourself.

## Editing content

Each page is a single file in this folder:

| Page | File |
| --- | --- |
| Home | `index.html` |
| About | `about.html` |
| Faculty & Mentors | `faculty.html` |
| Trainees | `trainees.html` |
| How to Apply | `apply.html` |
| Resources | `resources.html` |
| News & Events | `news.html` |
| Publications | `publications.html` |
| Contact | `contact.html` |

The top of each file has a small `--- ... ---` block (the "front matter") — leave it
alone and edit the HTML below it. Anything wrapped in a yellow dashed
"Placeholder" box on the live site is marked in the source with
`<div class="placeholder">…</div>` and is meant to be replaced.

- **Navigation menu** (the links in the header): edit the `nav:` list in `_config.yml`.
- **Site title, email, description**: also in `_config.yml`.
- **Colors and styling**: `assets/css/style.css` (the color palette is the `:root`
  block at the very top).
- **Images**: put files in `assets/img/` and reference them with
  `{{ '/assets/img/yourfile.jpg' | relative_url }}`.

## Publishing changes

Every commit pushed to the `main` branch is published automatically by GitHub Pages
within a minute or two. No manual build or deploy is needed.

## Custom domain

The `CNAME` file points the site at `ckrt.org`. DNS for `ckrt.org` must be configured
at the domain registrar — see `DEPLOY.md` for the exact records.

## Private grant documents

The `_private/` folder is **git-ignored** and never published. Keep source grant
materials there for local reference only.
