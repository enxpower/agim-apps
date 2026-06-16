# Repository Naming Review
## AGI&M Publishing Platform

**Version:** 1.0
**Branch:** docs/platform-hardening
**Status:** Pending Andy decision

---

## Background

The repository was originally created as `enxpower/agim-battery-sourcing` to house the battery sourcing workflow platform. Following a strategic expansion, the repository is now intended to become **AGI&M's long-term external publishing platform** — hosting all customer-facing HTML applications, tools, RFQ systems, configurators, portals, and other web products across all business verticals.

The current name `agim-battery-sourcing` no longer reflects this scope and will create confusion as additional modules are added.

---

## Naming Candidates

### Option A — `agim-battery-sourcing` (current, no change)

| | |
|---|---|
| **Pros** | Already exists; no GitHub rename action required; no broken references |
| **Cons** | Severely misleading — implies battery-only scope; will confuse future contributors, clients, and AGI&M staff when robotics/marine/calculator modules are added; does not reflect AGI&M's platform ambition |
| **Long-term maintainability** | Poor — the name will become increasingly misleading with each new module |
| **GitHub Pages** | No impact on current Pages URL (if custom domain is used); if relying on `github.io` subdomain path, rename would break it |
| **Verdict** | Not recommended for long-term use |

---

### Option B — `agim-platform`

| | |
|---|---|
| **Pros** | Short; clean; correctly signals a multi-product platform; scales to any future vertical |
| **Cons** | Slightly generic — "platform" is widely used; could be mistaken for an internal infrastructure repo |
| **Long-term maintainability** | Good |
| **GitHub Pages** | If using `enxpower.github.io/agim-platform` path, all internal links must include base path; custom domain eliminates this issue entirely |
| **Verdict** | Acceptable — second choice |

---

### Option C — `agim-publishing`

| | |
|---|---|
| **Pros** | Accurately describes the function (publishing customer-facing web products); clear to both technical and non-technical stakeholders |
| **Cons** | "Publishing" may sound like a CMS or content platform rather than an applications platform |
| **Long-term maintainability** | Good |
| **GitHub Pages** | Same as Option B |
| **Verdict** | Acceptable — third choice |

---

### Option D — `agim-apps`

| | |
|---|---|
| **Pros** | Short; modern; immediately communicates "web applications"; familiar convention (similar to `company-apps` repos across the industry) |
| **Cons** | May sound startup-oriented rather than industrial/professional; "apps" can imply mobile applications |
| **Long-term maintainability** | Good |
| **GitHub Pages** | Same as Option B |
| **Verdict** | Acceptable — fourth choice |

---

### Option E — `agim-portal`

| | |
|---|---|
| **Pros** | "Portal" is a B2B-appropriate term; implies a unified customer-facing entry point |
| **Cons** | Implies a single portal rather than a collection of independent applications; may be confused with an intranet or customer login system |
| **Long-term maintainability** | Moderate — the name may constrain perceived scope |
| **GitHub Pages** | Same as Option B |
| **Verdict** | Not recommended — too narrow in implication |

---

### Option F — `agim-studio`

| | |
|---|---|
| **Pros** | Creative; implies a workspace for producing outputs; used by some enterprise product companies |
| **Cons** | "Studio" carries design/creative connotations inconsistent with AGI&M's industrial engineering brand; sounds informal |
| **Long-term maintainability** | Moderate |
| **GitHub Pages** | Same as Option B |
| **Verdict** | Not recommended — tone mismatch |

---

### Option G — `agim-launchpad`

| | |
|---|---|
| **Pros** | Energetic; implies a base from which products are deployed |
| **Cons** | "Launchpad" sounds startup-oriented; does not convey professional procurement/engineering tools |
| **Long-term maintainability** | Moderate |
| **GitHub Pages** | Same as Option B |
| **Verdict** | Not recommended — tone mismatch |

---

### Option H — `op-agim.ca` *(following existing AGI&M convention)*

| | |
|---|---|
| **Pros** | Consistent with AGI&M's existing naming convention (`op-agim.ca` is the main site repo); immediately identifies which company this belongs to |
| **Cons** | The `op-` prefix implies "operations" or "website" — this repo is broader than just the website; could cause confusion with the main site repo |
| **Long-term maintainability** | Moderate |
| **GitHub Pages** | Same as Option B |
| **Verdict** | Not recommended — too close to main site repo naming |

---

## GitHub Pages Implications

GitHub Pages with a **custom domain** (`sourcing.agim.ca` or similar) eliminates any naming dependency — the repository name becomes irrelevant to the published URL. All internal asset links should use relative paths, not `github.io` paths.

GitHub Pages without a custom domain uses `enxpower.github.io/[repo-name]/` — in this case, renaming the repository breaks the Pages URL. **Since a custom domain is planned, renaming has zero functional impact on the published site.**

A GitHub repository rename:
- Automatically creates a redirect from the old name to the new name for all GitHub web URLs and git clone URLs
- Does **not** break existing clones (GitHub redirects transparently)
- Does **not** affect GitHub Pages if a custom domain is configured
- Does **not** affect any code or commit history

---

## Recommendation

**Rename to `agim-apps`.**

Rationale:
1. Short, unambiguous, and correctly scoped — implies multiple independent applications without over-constraining the type
2. Consistent with how professional engineering companies name multi-product web repositories
3. GitHub rename is safe given the planned custom domain setup
4. Avoids the confusion of a battery-specific name as the platform grows
5. The alternative `agim-platform` is also acceptable if Andy prefers a more formal tone

**Rename is optional if a custom domain is configured immediately** — the repository name becomes invisible to end users regardless. However, it remains visible to internal developers and in all GitHub URLs, so a clean name is still preferable.

---

## Decision Required

- [ ] Rename to `agim-apps` (recommended)
- [ ] Rename to `agim-platform` (alternative)
- [ ] Keep `agim-battery-sourcing` (not recommended)
- [ ] Other name: ___________

**Do not rename until this PR is approved.** Renaming is a single GitHub UI action and can be done by Andy in Settings → Repository name.

---

*Document owner: AGI&M ASSETS INC. | Version 1.0*
