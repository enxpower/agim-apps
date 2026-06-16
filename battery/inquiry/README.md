# Battery Sourcing — Inquiry Module

**Platform path:** `/battery/inquiry/`
**Status:** Production — implemented in `feat/battery-inquiry-form`

## Files

| File | Purpose |
|------|--------|
| `index.html` | Customer intake form |
| `confirm.html` | Submission confirmation page |
| `css/form.css` | Scoped form styles |
| `js/form.js` | ID generation, validation, state persistence |
| `assets/og-image.svg` | 1200×630 social preview image |

## Notes

- Cell format noted as "likely pouch" — must be confirmed via OEM datasheet
- Form submission via Formspree (endpoint to be configured in `js/form.js`)
- Inquiry ID is client-generated (Phase 1 limitation — see PRD §6)
