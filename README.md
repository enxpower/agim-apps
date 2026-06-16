# AGI&M Publishing Platform

**Owner:** AGI&M ASSETS INC.
**Status:** Architecture approved (PR #1 merged) — Platform hardening in progress (PR #2)
**Version:** 1.1

---

## Overview

This repository is AGI&M's **long-term external publishing platform**. It is the single canonical home for all AGI&M customer-facing web applications, tools, RFQ portals, inquiry systems, calculators, configurators, project portals, and other HTML-based products.

**Battery sourcing is the first module. It is not the defining scope of this repository.**

This platform is designed to scale across all AGI&M business verticals and application types under a single, consistent engineering and branding standard.

---

## Published Applications

| Module | Path | Status |
|--------|------|--------|
| Battery Sourcing — Drone Inquiry | `/battery/inquiry/` | Architecture complete — implementation pending |

*Additional modules will be listed here as they are added.*

---

## Repository Structure

```
/
├── README.md                          ← This file
├── CNAME                              ← GitHub Pages custom domain
├── .nojekyll                          ← Disables Jekyll processing
├── 404.html                           ← AGI&M branded 404 page (to be created)
│
├── docs/                              ← Governance and architecture documents
│   ├── PRD.md                         ← Battery sourcing PRD
│   ├── WORKFLOW.md                    ← Battery sourcing workflow
│   ├── DATA_MODEL.md                  ← Battery sourcing data model
│   ├── UX_STRATEGY.md                 ← Battery sourcing UX strategy
│   ├── RFQ_REQUIREMENTS.md            ← Battery sourcing RFQ intelligence
│   ├── IMPLEMENTATION_DECISIONS.md    ← Battery sourcing pending decisions
│   ├── REPOSITORY_STRATEGY.md         ← Platform architecture and structure
│   ├── REPOSITORY_NAMING_REVIEW.md    ← Repository naming recommendation
│   ├── HTML_ENGINEERING_STANDARDS.md  ← Mandatory standards for all projects
│   └── BRANDING_GOVERNANCE.md         ← AGI&M brand compliance and design tokens
│
├── shared/                            ← Shared assets (all applications may reference)
│   ├── css/
│   │   ├── tokens.css                 ← AGI&M design tokens
│   │   └── base.css                   ← Reset and base styles
│   ├── js/
│   │   └── utils.js                   ← Shared utilities
│   └── assets/
│       ├── agim-logo.svg
│       ├── agim-logo-white.svg
│       └── favicon.ico
│
├── battery/                           ← Battery sourcing module
│   └── inquiry/                       ← Customer intake portal (drone)
│       ├── index.html                 ← (not yet implemented)
│       ├── confirm.html               ← (not yet implemented)
│       └── og-image.png               ← (not yet implemented)
│
├── drone/                             ← Drone-specific applications (future)
├── robotics/                          ← Robotics applications (future)
├── marine/                            ← Marine applications (future)
├── calculators/                       ← Engineering calculators (future)
├── tools/                             ← Technical tools (future)
└── portals/                           ← Customer and project portals (future)
```

---

## Governance Documents

| Document | Purpose |
|----------|---------|
| `docs/REPOSITORY_STRATEGY.md` | Platform architecture, folder conventions, GitHub Pages strategy, migration path |
| `docs/HTML_ENGINEERING_STANDARDS.md` | Mandatory engineering standards — all projects must comply |
| `docs/BRANDING_GOVERNANCE.md` | AGI&M visual identity rules and design token system |
| `docs/REPOSITORY_NAMING_REVIEW.md` | Analysis and recommendation on repository naming |

---

## Engineering Standards Summary

Every project in this repository must comply with `docs/HTML_ENGINEERING_STANDARDS.md`.

Non-negotiable minimums:
- Responsive: Desktop, tablet, mobile verified
- No horizontal scrolling under any circumstance
- Complete OG/Twitter metadata + `og-image.png` (1200×630 PNG, absolute URL)
- English-first
- Professional industrial appearance — no startup aesthetics
- All brand colors via CSS variables from `shared/css/tokens.css`
- No API keys in client-side code
- `.nojekyll` present in repo root

---

## Language Policy

All UI, documentation, code comments, field labels, supplier-facing content, and customer-facing content must be in **English only** unless a specific project has an explicitly documented multilingual requirement.

---

## PR and Branch Policy

- No direct commits to `main`
- All changes via feature branch → Pull Request
- Draft PRs for all in-progress work
- HTML implementation is blocked until architecture PR is approved

---

## Repository Naming

The current name `agim-battery-sourcing` is under review. See `docs/REPOSITORY_NAMING_REVIEW.md` for the full analysis. Recommendation: rename to `agim-apps`. No rename has been executed — pending Andy decision.

---

*Document owner: AGI&M ASSETS INC. | Updated: 2026-06-16*
