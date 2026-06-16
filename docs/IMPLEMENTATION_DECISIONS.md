# Implementation Decisions
## AGI&M Battery Sourcing Platform

**Version:** 1.0-draft
**Status:** Awaiting Andy approval

---

These decisions must be confirmed before HTML/CSS/JS implementation begins.

---

## Decision 1 — Form Submission Backend (Phase 1)

**Question:** What service handles form POST submissions on the static GitHub Pages site?

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **Formspree** (recommended) | Free tier, form POST endpoint, email delivery + dashboard | No backend required, simple setup, structured data export | Free tier limits (50 submissions/month); data hosted on Formspree servers |
| Netlify Forms | Similar to Formspree, tied to Netlify hosting | Generous free tier | Requires moving hosting from GitHub Pages to Netlify |
| Notion API | JavaScript POST to Notion database | Structured and queryable | API key exposed in client-side JS — security risk in Phase 1 |
| Email only (`mailto:`) | No backend | Zero dependency | Unreliable, not structured, poor UX |

**Recommendation:** Formspree (free tier) + AGI&M email notification. Upgrade to paid tier ($10/month) when volume exceeds 50/month.

**Decision required:** ☐ Confirm Formspree / ☐ Alternative

---

## Decision 2 — Hosting Subdomain

**Question:** Where does this platform live?

| Option | Notes |
|--------|-------|
| `sourcing.agim.ca` | Clean, purpose-specific, keeps main agim.ca unaffected |
| `rfq.agim.ca` | Alternative naming convention |
| Path on `agim.ca` (e.g., `agim.ca/sourcing/`) | Shares root domain; requires coordination with main site repo |
| Separate GitHub Pages repo with custom domain | Cleanest isolation |

**Recommendation:** `sourcing.agim.ca` — dedicated subdomain, independent CNAME, zero interference with main site.

**Decision required:** ☐ `sourcing.agim.ca` / ☐ Other: ___________

---

## Decision 3 — Repository Visibility

**Current status:** Repository created as **private**.

**Question:** Should this remain private?

- Private: Protects workflow architecture from competitors
- Public: Not recommended — architecture documents contain commercial strategy

**Recommendation:** Keep private. GitHub Pages works with private repos on paid plans.

**Decision required:** ☐ Keep private / ☐ Make public

---

## Decision 4 — AGI&M Internal Notification Method

**Question:** When a form is submitted, how should AGI&M be notified?

| Option | Description |
|--------|-------------|
| Email (via Formspree) | Automatic email to `sourcing@agim.ca` or Andy's email with full submission data |
| Notion database entry | Submission written to a Notion page/database (requires client-side Notion API — security tradeoff) |
| Telegram bot notification | Push notification via Andy's existing ARCBOS Telegram bot infrastructure |
| All of the above (Phase 2) | Backend aggregates and notifies via all channels |

**Recommendation:** Phase 1 — Formspree email notification to `andy.gong@agim.ca`. Phase 2 — extend to Telegram and/or Notion.

**Decision required:** ☐ Email only / ☐ Include Telegram / ☐ Include Notion

---

## Decision 5 — AGI&M Brand Colors

**Question:** What are the confirmed AGI&M brand colors for use in this platform's CSS?

**Current status:** All colors in `UX_STRATEGY.md` are marked **provisional**. They were inferred from design context and must not be used in production CSS without confirmation.

**Action required before implementation:**
- Read CSS/stylesheet from `https://agim.ca`
- Extract `--color-*` CSS variables or equivalent hex values
- Update `UX_STRATEGY.md` with confirmed values
- Define CSS design token file before writing any component CSS

**Decision required:** ☐ Confirm Andy provides brand tokens / ☐ Claude reads agim.ca and extracts programmatically

---

## Decision 6 — Phase 1 Scope: Drone Only vs. Generic Shell

**Question:** Should the Phase 1 implementation be:

| Option | Description |
|--------|-------------|
| **Drone vertical only** | `/drone/inquiry/index.html` — simplest, fastest to ship |
| Generic shell + drone as first vertical | Root portal at `/index.html` + drone as first vertical — correct architecture from day one |

**Recommendation:** Build the generic shell (root `index.html` listing available verticals) with drone as the only active vertical. This costs < 1 hour of additional work and prevents architectural debt.

**Decision required:** ☐ Drone only / ☐ Generic shell + drone

---

## Decision 7 — Notification Email Address

**Question:** What is the From/Reply-To address for customer-facing confirmations?

| Option | Notes |
|--------|-------|
| `sourcing@agim.ca` | Purpose-specific, professional |
| `info@agim.ca` | General inbox |
| `andy.gong@agim.ca` | Personal — not recommended for platform |

**Recommendation:** `sourcing@agim.ca` — set up as a Google Workspace alias or dedicated inbox.

**Decision required:** ☐ `sourcing@agim.ca` / ☐ Other: ___________

---

## Decision 8 — Target Price Radio Tier Calibration

**Question:** What USD/cell price tiers should appear on the radio button for "Target Price Range"?

This requires current NMC pouch cell market pricing context. Suggested calibration based on current market:

| Tier | Approximate USD/cell (152–173Ah NMC pouch) |
|------|---------------------------------------------|
| Tier 1 | Below $35/cell |
| Tier 2 | $35–$60/cell |
| Tier 3 | $60–$100/cell |
| Tier 4 | Above $100/cell |
| No target | Please advise |

**Note:** These figures are approximate and must be validated against current market rates before shipping. Cell pricing is highly volume-dependent.

**Decision required:** ☐ Confirm tiers / ☐ Use USD/Ah instead of USD/cell / ☐ Leave as free text only

---

## Implementation Authorization

All 8 decisions above must be confirmed before work begins on:

- [ ] `drone/inquiry/index.html`
- [ ] `assets/css/base.css`
- [ ] `assets/css/components.css`
- [ ] `assets/js/inquiry-engine.js`
- [ ] `assets/js/form-state.js`

**Current status: Architecture PR open — awaiting review and approval.**

---

*Document owner: AGI&M ASSETS INC.*
