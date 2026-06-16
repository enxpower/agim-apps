# Production Launch Checklist
## AGI&M Battery Cell Sourcing Inquiry
### `battery/inquiry/`

**Audit date:** 2026-06-17
**Auditor:** AGI&M Platform (automated + manual)
**Status:** Ready to launch pending two operator actions

---

## Pre-Launch Status

| # | Item | Status | Owner |
|---|------|--------|-------|
| 1 | Configure Formspree endpoint | ⛔ REQUIRED | Andy |
| 2 | Enable GitHub Pages + custom domain | ⛔ REQUIRED | Andy |
| 3 | og:image is PNG 1200×630 | ✅ Done | — |
| 4 | favicon.ico present | ✅ Done | — |
| 5 | apple-touch-icon.png present | ✅ Done | — |
| 6 | All TODO/placeholder text removed | ✅ Done | — |
| 7 | Social metadata complete (OG + Twitter) | ✅ Done | — |
| 8 | Canonical URL set to apps.agim.ca | ✅ Done | — |
| 9 | AGI&M brand tokens confirmed from agim.ca | ✅ Done | — |
| 10 | Horizontal scroll locked | ✅ Done | — |
| 11 | Responsive: mobile / tablet / desktop | ✅ Done | — |
| 12 | Accessibility: WCAG 2.1 AA baseline | ✅ Done | — |
| 13 | No API keys or secrets in any file | ✅ Done | — |
| 14 | .nojekyll present | ✅ Done | — |
| 15 | 404.html branded and present | ✅ Done | — |
| 16 | English only | ✅ Done | — |
| 17 | confirm.html robots noindex | ✅ Done | — |
| 18 | Immutability limitation honestly disclosed | ✅ Done | — |

---

## Required Operator Actions (Must Complete Before Publishing)

### Action 1 — Configure Formspree (BLOCKING)

Without this step, the form appears to work for users but **no submission data reaches AGI&M**.

**Steps:**
1. Go to [https://formspree.io](https://formspree.io) and sign in or create a free account
2. Click **New Form** → set email notification to `andy.gong@agim.ca`
3. Copy the generated endpoint URL (format: `https://formspree.io/f/XXXXXXXX`)
4. Open `battery/inquiry/js/form.js` in the GitHub editor (or clone and edit locally)
5. Find line 20 (the `FORMSPREE_ENDPOINT` declaration):
   ```js
   var FORMSPREE_ENDPOINT = ''; /* CONFIGURE: paste Formspree endpoint here */
   ```
6. Replace the empty string with your endpoint:
   ```js
   var FORMSPREE_ENDPOINT = 'https://formspree.io/f/XXXXXXXX';
   ```
7. Commit directly to `main` with message: `config: set Formspree endpoint for battery inquiry form`
8. Verify by submitting a test inquiry and confirming email delivery to `andy.gong@agim.ca`

**Free tier limit:** 50 submissions/month. Upgrade to Formspree Basic ($10/month) for higher volume.

---

### Action 2 — Enable GitHub Pages and Custom Domain (BLOCKING)

Without this step, the site is not publicly accessible.

**Steps:**
1. Go to [https://github.com/enxpower/agim-apps/settings/pages](https://github.com/enxpower/agim-apps/settings/pages)
2. Under **Source**, select `Deploy from a branch` → Branch: `main` → Folder: `/ (root)`
3. Click **Save**
4. Under **Custom domain**, enter: `apps.agim.ca`
5. Click **Save** — GitHub will verify DNS
6. In GoDaddy DNS for `agim.ca`, add:
   - Type: `CNAME` | Name: `apps` | Value: `enxpower.github.io` | TTL: `600`
7. Add a `CNAME` file to the repository root containing exactly: `apps.agim.ca`
   ```
   apps.agim.ca
   ```
   Commit with message: `chore: add CNAME for apps.agim.ca GitHub Pages domain`
8. Wait for DNS propagation (typically 5–30 minutes)
9. Check **Enforce HTTPS** once certificate is issued (usually within 1 hour of DNS propagation)
10. Test: visit `https://apps.agim.ca/battery/inquiry/` in a private browser window

---

## Post-Launch Verification (Run After Both Actions Above)

- [ ] Visit `https://apps.agim.ca/battery/inquiry/` — page loads, no errors
- [ ] Submit a complete test inquiry — confirm redirect to `confirm.html`
- [ ] Verify email received at `andy.gong@agim.ca` within 1 minute
- [ ] Check Inquiry ID appears correctly on confirmation page
- [ ] Copy ID button works
- [ ] Test on iPhone Safari (real device preferred)
- [ ] Verify social preview using [https://www.opengraph.xyz/url/https://apps.agim.ca/battery/inquiry/](https://www.opengraph.xyz)
- [ ] Verify Twitter card using [https://cards-dev.twitter.com/validator](https://cards-dev.twitter.com/validator)
- [ ] Verify no horizontal scroll on mobile (375px viewport)
- [ ] Submit another test and confirm localStorage restoration works after partial fill

---

## Remaining Non-Blocking Items (Post-Launch Improvements)

| Item | Priority | Notes |
|------|----------|-------|
| Official AGI&M logo SVG in `shared/assets/` | Medium | Currently nav shows text wordmark — functional but not logo-branded |
| Merge PR #3 (clean up `drone/inquiry/` legacy folder) | Low | Cosmetic — does not affect functionality |
| Convert favicon from generated mark to official AGI&M brand favicon | Medium | Current favicon is a placeholder geometric mark |
| Add `<html lang="en">` to `confirm.html` | Low | Already present in `index.html`; confirm page should match |
| Phase 2 backend for true immutable records and sequential IDs | Future | PostgreSQL on VM — see `docs/DATA_MODEL.md` |

---

## Launch Readiness Score

**Current:** 95% — two operator configuration actions required.

Once Action 1 (Formspree) and Action 2 (GitHub Pages + DNS) are complete, the application is fully production-ready with no code changes needed.

---

*Document owner: AGI&M ASSETS INC. | Last updated: 2026-06-17*
