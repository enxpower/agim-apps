# Implementation Decisions
## AGI&M Battery Sourcing Platform — First Module

**Version:** 1.1
**Status:** Decisions 1–8 pending Andy confirmation | Decisions 9–12 added in platform hardening review

---

## Decisions from PR #1 (Battery Sourcing Architecture)

These decisions must be confirmed before HTML implementation of the battery inquiry form begins.

---

### Decision 1 — Form Submission Backend (Phase 1)

**Question:** What service handles form POST submissions on the static GitHub Pages site?

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **Formspree** (recommended) | Free tier, form POST endpoint, email delivery + dashboard | No backend required, simple setup, structured data export | Free tier limits (50 submissions/month); data hosted on Formspree servers |
| Netlify Forms | Similar to Formspree, tied to Netlify hosting | Generous free tier | Requires moving hosting from GitHub Pages to Netlify |
| Notion API | JavaScript POST to Notion database | Structured and queryable | API key exposed in client-side JS — **security risk in Phase 1** |
| Email only (`mailto:`) | No backend | Zero dependency | Unreliable, not structured, poor UX |

**Recommendation:** Formspree (free tier) + AGI&M email notification. Upgrade to paid tier when volume exceeds 50 submissions/month.

**Security note:** The Notion API option requires embedding an API key in client-side JavaScript. This is not acceptable — any user who views page source can extract the key. Do not use the Notion API for form submission on a static site.

**Decision required:** ☐ Confirm Formspree / ☐ Alternative: ___________

---

### Decision 2 — Hosting Subdomain

**Question:** Where does this platform live?

| Option | Notes |
|--------|-------|
| `apps.agim.ca` | Reflects the platform's expanded scope (recommended given platform-first strategy) |
| `sourcing.agim.ca` | Narrower name — may feel limiting as non-sourcing modules are added |
| `rfq.agim.ca` | Even narrower — implies RFQ-only |
| Path on `agim.ca` | Shares root domain; requires coordination with main site repo |

**Recommendation updated (PR #2):** `apps.agim.ca` — better reflects the platform's multi-application scope. Battery inquiry would be at `https://apps.agim.ca/battery/inquiry/`.

**Decision required:** ☐ `apps.agim.ca` / ☐ `sourcing.agim.ca` / ☐ Other: ___________

---

### Decision 3 — Repository Visibility

**Current status:** Repository is **private**.

- Private: Protects architecture documents and commercial strategy
- Public: Not recommended — architecture documents contain sourcing strategy and internal workflow

**Recommendation:** Keep private.

**Note:** GitHub Pages serves public content from private repositories on paid GitHub plans. Repository being private does not prevent the published site from being publicly accessible.

**Decision required:** ☐ Keep private (recommended) / ☐ Make public

---

### Decision 4 — AGI&M Internal Notification Method

**Question:** When a form is submitted, how should AGI&M be notified?

| Option | Description |
|--------|-------------|
| Email via Formspree | Automatic email to AGI&M with full submission payload |
| Telegram bot notification | Push via Andy's existing Telegram bot infrastructure on VM |
| Phase 2 backend | Aggregates and notifies via all channels |

**Recommendation:** Phase 1 — Formspree email to `andy.gong@agim.ca`. Phase 2 — extend to Telegram once backend is established.

**Decision required:** ☐ Email only / ☐ Include Telegram in Phase 1 / ☐ Defer Telegram to Phase 2

---

### Decision 5 — AGI&M Brand Colors (Confirmation)

**Current status:** All color values in `docs/BRANDING_GOVERNANCE.md` and `shared/css/tokens.css` are marked **PROVISIONAL**.

**Action required before any CSS is written:**
1. Inspect live stylesheet at `https://agim.ca`
2. Extract confirmed design tokens
3. Update `shared/css/tokens.css` — remove `/* PROVISIONAL */` markers on confirmed values
4. Commit as `chore: confirm AGI&M brand tokens from agim.ca`

**Decision required:** ☐ Andy provides brand tokens directly / ☐ Authorize Claude to extract from agim.ca programmatically

---

### Decision 6 — Phase 1 Application Scope

**Question:** What is in scope for the first HTML implementation?

| Option | Description |
|--------|-------------|
| Battery inquiry form only | `/battery/inquiry/index.html` + `/battery/inquiry/confirm.html` |
| Platform shell + battery inquiry | Root `index.html` (platform directory) + battery inquiry as first listed application |

**Recommendation (updated in PR #2):** Build the **platform shell + battery inquiry** together. The platform shell is the root `index.html` that lists all available AGI&M applications. This costs minimal additional effort and establishes the correct architecture from day one.

**Decision required:** ☐ Battery inquiry only / ☐ Platform shell + battery inquiry (recommended)

---

### Decision 7 — Notification Email Address

**Question:** What is the From/Reply-To address for customer-facing email confirmations?

| Option | Notes |
|--------|-------|
| `sourcing@agim.ca` | Purpose-specific, professional — recommended |
| `info@agim.ca` | General inbox |
| `andy.gong@agim.ca` | Personal — not appropriate for platform-facing communications |

**Recommendation:** `sourcing@agim.ca` — configure as a Google Workspace alias or dedicated inbox.

**Decision required:** ☐ `sourcing@agim.ca` / ☐ Other: ___________

---

### Decision 8 — Target Price Radio Tier Calibration

**Question:** What USD/cell price tiers appear in the "Target Price Range" radio buttons?

Suggested tiers based on current large-format NMC pouch cell market context:

| Tier | Approximate Range |
|------|------------------|
| 1 | Below $35/cell |
| 2 | $35–$60/cell |
| 3 | $60–$100/cell |
| 4 | Above $100/cell |
| — | No target — please advise |

**Note:** These figures are volume-dependent estimates only. Must be validated against current market data before the form goes live.

**Decision required:** ☐ Confirm tiers / ☐ Use USD/Ah / ☐ Free text only

---

## New Decisions from PR #2 (Platform Hardening)

---

### Decision 9 — Repository Rename

**Question:** Should the repository be renamed from `agim-battery-sourcing` to a platform-appropriate name?

Full analysis in `docs/REPOSITORY_NAMING_REVIEW.md`.

**Recommendation:** Rename to `agim-apps`.

**Decision required:** ☐ Rename to `agim-apps` / ☐ Rename to `agim-platform` / ☐ Keep current name / ☐ Other: ___________

---

### Decision 10 — `.nojekyll` and `404.html` Foundation Files

**Question:** Should these platform foundation files be created in this PR or as the first action in the implementation PR?

| File | Purpose |
|------|---------|
| `.nojekyll` | Prevents GitHub Pages from running Jekyll processing |
| `404.html` | AGI&M branded 404 page for broken/invalid URLs |

**Recommendation:** Create both in the first implementation PR, before any application HTML. They are infrastructure, not application content.

**Decision required:** ☐ Create in implementation PR / ☐ Create now in this documentation PR

---

### Decision 11 — Shared CSS/JS Foundation

**Question:** Should `shared/css/tokens.css`, `shared/css/base.css`, and `shared/js/utils.js` be committed as empty scaffolds now, or created in the implementation PR?

**Recommendation:** Commit as empty scaffolds with comments in this PR (or the implementation PR) so the folder structure is visible in the repository and reviewers can see the intended architecture. Actual content is filled in implementation.

**Decision required:** ☐ Scaffold now / ☐ Create in implementation PR

---

### Decision 12 — Battery Module Path

**Question:** The existing `drone/inquiry/` folder was created in PR #1. Under the new platform-first architecture, battery sourcing lives at `battery/inquiry/`. Should the legacy `drone/inquiry/` folder be removed?

**Context:** The `drone/inquiry/README.md` was created as a placeholder. No HTML was ever implemented there. The platform-first structure places battery/drone sourcing at `battery/inquiry/` to decouple the application type (battery cells) from the customer vertical (drone manufacturer).

**Recommendation:** Move `drone/inquiry/README.md` content into `battery/inquiry/README.md` and delete `drone/inquiry/`. The `drone/` top-level folder is reserved for future drone-specific applications that are not battery sourcing.

**Decision required:** ☐ Move to `battery/inquiry/` and delete `drone/inquiry/` / ☐ Keep both / ☐ Other: ___________

---

## Implementation Authorization Gate

**No HTML, CSS, or JavaScript may be committed to `main` until:**

- [ ] Decisions 1–8 (battery sourcing module) are confirmed
- [ ] Decisions 9–12 (platform hardening) are confirmed
- [ ] PR #2 (`docs/platform-hardening`) is approved and merged

---

*Document owner: AGI&M ASSETS INC. | Version 1.1*
