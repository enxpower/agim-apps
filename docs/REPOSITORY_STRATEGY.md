# Repository Strategy
## AGI&M Publishing Platform

**Version:** 1.0
**Branch:** docs/platform-hardening
**Status:** Approved architecture — active governance document

---

## Strategic Purpose

This repository is AGI&M's **long-term external publishing platform**. It serves as the single canonical home for all customer-facing web applications, tools, portals, RFQ systems, calculators, configurators, dashboards, and other HTML-based products published under the AGI&M brand.

Battery sourcing is the **first module**. It is not the defining scope of this repository.

---

## Governing Principle

> One repository. Many independent applications. One shared standard.

Each application in this repository:
- Is fully self-contained in its own folder
- Has no runtime dependencies on other applications in the repository
- Complies with the AGI&M HTML Engineering Standards (see `docs/HTML_ENGINEERING_STANDARDS.md`)
- Follows AGI&M Branding Governance (see `docs/BRANDING_GOVERNANCE.md`)
- Is independently deployable via GitHub Pages

---

## Repository Structure

```
/
├── README.md                          ← Repository overview and index
├── CNAME                              ← GitHub Pages custom domain
│
├── docs/                              ← Governance and architecture documents
│   ├── PRD.md                         ← Battery sourcing PRD (first module)
│   ├── WORKFLOW.md                    ← Battery sourcing workflow
│   ├── DATA_MODEL.md                  ← Battery sourcing data model
│   ├── UX_STRATEGY.md                 ← Battery sourcing UX strategy
│   ├── RFQ_REQUIREMENTS.md            ← Battery sourcing RFQ intelligence
│   ├── IMPLEMENTATION_DECISIONS.md    ← Battery sourcing pending decisions
│   ├── REPOSITORY_STRATEGY.md         ← This document
│   ├── REPOSITORY_NAMING_REVIEW.md    ← Naming recommendation
│   ├── HTML_ENGINEERING_STANDARDS.md  ← Mandatory standards for all projects
│   └── BRANDING_GOVERNANCE.md         ← AGI&M brand compliance rules
│
├── shared/                            ← Shared assets available to all applications
│   ├── css/
│   │   ├── tokens.css                 ← AGI&M design tokens (colors, typography, spacing)
│   │   └── base.css                   ← Reset and base styles
│   ├── js/
│   │   └── utils.js                   ← Shared utilities (form validation, ID generation, etc.)
│   └── assets/
│       ├── agim-logo.svg              ← Primary AGI&M logo
│       ├── agim-logo-white.svg        ← Reversed logo for dark backgrounds
│       └── favicon.ico                ← AGI&M favicon (shared baseline)
│
├── battery/                           ← Battery sourcing module
│   └── inquiry/                       ← Customer intake portal
│       ├── index.html
│       ├── confirm.html
│       ├── og-image.png               ← 1200×630 social preview
│       └── assets/                    ← Module-specific overrides if needed
│
├── drone/                             ← Drone-specific inquiry (future)
│   └── inquiry/
│       ├── index.html
│       ├── og-image.png
│       └── README.md
│
├── robotics/                          ← Robotics RFQ (future)
│   └── inquiry/
│
├── marine/                            ← Marine battery RFQ (future)
│   └── inquiry/
│
├── calculators/                       ← Engineering calculators (future)
│   ├── battery-energy/
│   ├── cell-matching/
│   └── cost-estimator/
│
├── tools/                             ← Technical tools (future)
│   └── spec-converter/
│
└── portals/                           ← Customer and project portals (future)
    ├── onboarding/
    └── project-status/
```

---

## Folder Naming Conventions

| Rule | Detail |
|------|--------|
| All lowercase | `battery/`, not `Battery/` |
| Hyphens, no underscores | `og-image.png`, not `og_image.png` |
| Descriptive and stable | Folder names become URLs — choose carefully, they are permanent |
| No version numbers in folder names | Use git tags for versioning, not `/battery-v2/` |
| Each application = one folder | Never mix two applications in one folder |

---

## Application Independence Rule

Each application folder must be **fully independently functional**:

- It must work if all other folders in the repository are deleted
- It must not import CSS or JS from sibling application folders
- It **may** reference shared assets in `/shared/` using relative paths (e.g., `../../shared/css/tokens.css`)
- It must have its own `og-image.png`, `index.html`, and complete OG/Twitter metadata

---

## Shared Assets Policy

The `/shared/` folder contains assets that all applications may reference:

| Asset | Purpose | Rule |
|-------|---------|------|
| `shared/css/tokens.css` | AGI&M design tokens | All applications must import this; never hardcode brand colors |
| `shared/css/base.css` | CSS reset and base styles | Recommended for all applications |
| `shared/js/utils.js` | Common utilities | Optional; use only what is needed |
| `shared/assets/agim-logo.svg` | Primary logo | Use for all AGI&M-branded applications |

Applications may maintain their own local `assets/` subfolder for module-specific images, icons, and supplementary assets.

---

## GitHub Pages Strategy

### Custom Domain (Required)

All published applications are served via a custom domain. GitHub Pages is configured with a `CNAME` file in the repository root.

**Recommended domain:** `sourcing.agim.ca` or `apps.agim.ca`

This means the battery inquiry form will be accessible at, for example:
`https://apps.agim.ca/battery/inquiry/`

And a future robotics RFQ would be:
`https://apps.agim.ca/robotics/inquiry/`

### Path-Based Routing

All routing is path-based within a single GitHub Pages site. There is no server-side routing. All pages are static HTML files. Any "routing" is achieved through folder structure and direct links.

### 404 Handling

GitHub Pages serves a default 404 page unless a `404.html` is present in the repository root. A branded AGI&M `404.html` must be created as part of the platform foundation before any public launch.

### No Jekyll Processing

Include a `.nojekyll` file in the repository root to prevent GitHub Pages from processing the site through Jekyll. This is required to ensure folders beginning with `_` (if any) are served correctly, and to prevent unintended template processing.

---

## Future Migration Path

This repository is designed to migrate to a dedicated server without structural changes:

- All paths are relative — no absolute `github.io` URLs in code
- No server-side features assumed (no PHP, no SSR, no session management in Phase 1)
- Static files can be served from any web server (Nginx, Apache, Cloudflare Pages, etc.)
- Form submission backend is decoupled from the static site — swapping Formspree for a dedicated API requires only changing the form `action` attribute

When traffic or feature requirements exceed GitHub Pages capabilities, the entire `/` folder can be copied to a server and served identically.

---

## New Module Onboarding Checklist

When adding a new application to this repository:

- [ ] Create a new folder under the appropriate category (`battery/`, `drone/`, `calculators/`, etc.)
- [ ] Add `index.html` with complete OG/Twitter metadata
- [ ] Add `og-image.png` (1200×630, PNG, absolute URL in meta tag)
- [ ] Reference `shared/css/tokens.css` for brand colors
- [ ] Pass all checks in `docs/HTML_ENGINEERING_STANDARDS.md`
- [ ] Test on Desktop Chrome, Mac Safari, and iPhone Safari before merge
- [ ] Add a card to the root `index.html` platform directory (once that page exists)
- [ ] Open a PR — no direct commits to `main`

---

## PR and Branch Policy

| Rule | Detail |
|------|--------|
| No direct commits to `main` | All changes via PR |
| Branch naming | `feat/[module]-[description]`, `docs/[description]`, `fix/[module]-[description]` |
| PR review | At minimum, self-review using the HTML engineering standards checklist |
| Draft PRs | Used for all in-progress work; converted to ready when complete |
| Merge strategy | Squash and merge for feature branches; merge commit for documentation branches |

---

*Document owner: AGI&M ASSETS INC. | Version 1.0*
