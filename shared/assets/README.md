# shared/assets/

This folder contains shared brand assets available to all AGI&M platform applications.

---

## Contents (To Be Added)

| File | Description | Status |
|------|-------------|--------|
| `agim-logo.svg` | Primary AGI&M logo (dark version — for light backgrounds) | ⚠️ Not yet added |
| `agim-logo-white.svg` | Reversed AGI&M logo (white — for dark backgrounds) | ⚠️ Not yet added |
| `favicon.ico` | AGI&M favicon (16×16, 32×32, 48×48 multi-size ICO) | ⚠️ Not yet added |
| `apple-touch-icon.png` | Apple touch icon (180×180 PNG) | ⚠️ Not yet added |

---

## How to Add Logo Files

Logo files must come from the official AGI&M brand source. Do not create or invent logo files.

**Process:**
1. Obtain SVG logo files from official AGI&M brand assets (agim.ca source or brand package)
2. Verify the files are correct and production-quality
3. Commit to this folder in a PR titled: `chore: add AGI&M brand assets to shared/assets/`
4. Update all application `<head>` sections to reference these files

**Until official logo files are added:**
- Applications may use a text-based wordmark (`AGI&M` in brand typography) as a temporary placeholder
- Never use an AI-generated, inferred, or approximated logo
- Never use a competitor's or third-party logo

---

## Usage in Applications

Reference shared assets using root-relative paths (when served via custom domain):

```html
<!-- Favicon -->
<link rel="icon" type="image/x-icon" href="/shared/assets/favicon.ico">
<link rel="apple-touch-icon" href="/shared/assets/apple-touch-icon.png">

<!-- Logo in HTML -->
<img src="/shared/assets/agim-logo.svg" alt="AGI&M" width="120" height="auto">
```

Or relative paths from within a module folder:

```html
<img src="../../shared/assets/agim-logo.svg" alt="AGI&M" width="120" height="auto">
```

---

## Logo Usage Rules

See `docs/BRANDING_GOVERNANCE.md` for the full logo usage specification including:
- Minimum size
- Clear space requirements
- Prohibited treatments
- Light vs. dark variant selection

---

*Document owner: AGI&M ASSETS INC.*
