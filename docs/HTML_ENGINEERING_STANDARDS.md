# HTML Engineering Standards
## AGI&M Publishing Platform — Mandatory Compliance Document

**Version:** 1.0
**Branch:** docs/platform-hardening
**Status:** Mandatory — applies to all HTML projects in this repository
**Enforcement:** No PR may be merged to `main` unless all applicable standards are met

---

## Purpose

This document defines the mandatory engineering standards that every HTML project published from this repository must satisfy. These standards exist to ensure that all AGI&M customer-facing applications are professional, consistent, accessible, performant, and maintainable — regardless of which team member or AI system produced them.

Compliance is verified by the developer/author before opening a PR. The PR description must include a completed checklist (see Section 12).

---

## Standard 1 — Responsive Design

**Rule:** Every page must be fully functional and visually correct at all three breakpoints.

| Breakpoint | Width Range | Behavior |
|------------|------------|---------|
| Mobile | < 768px | Single column layout; hamburger navigation if nav exists |
| Tablet | 768px – 1023px | Adapted layout; all content accessible without zooming |
| Desktop | ≥ 1024px | Full layout; maximum content width capped (typically 1280px or 1440px) |

**Testing requirement:**
- Chrome DevTools device simulation is not sufficient alone
- Must be verified on a real iOS device (iPhone Safari) or equivalent simulator
- Must be verified on Desktop Chrome and Mac Safari

---

## Standard 2 — No Horizontal Scrolling

**Rule:** Horizontal scrolling is strictly prohibited on all devices at all breakpoints under all circumstances.

**Implementation:**

```css
html,
body {
  overflow-x: hidden;
  max-width: 100%;
}

* {
  box-sizing: border-box;
}
```

All container elements must use `max-width: 100%` and `width: 100%` rather than fixed pixel widths that exceed the viewport.

**Common failure causes to prevent:**
- Fixed-width tables without `overflow-x: auto` wrapper
- Images without `max-width: 100%`
- Absolutely positioned elements extending beyond viewport
- Long unbreakable strings (URLs, codes) without `word-break: break-all` or `overflow-wrap: break-word`

---

## Standard 3 — Social Preview and Open Graph Metadata

**Rule:** Every `index.html` must include complete social preview metadata.

**Required meta tags:**

```html
<!-- Primary SEO -->
<title>Page Title — AGI&M</title>
<meta name="description" content="Clear, specific description (120–155 characters)">
<link rel="canonical" href="https://[domain]/[path]/">

<!-- Open Graph -->
<meta property="og:title" content="Page Title — AGI&M">
<meta property="og:description" content="Clear, specific description">
<meta property="og:image" content="https://[domain]/[path]/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="https://[domain]/[path]/">
<meta property="og:type" content="website">
<meta property="og:site_name" content="AGI&M">

<!-- Twitter / X Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Page Title — AGI&M">
<meta name="twitter:description" content="Clear, specific description">
<meta name="twitter:image" content="https://[domain]/[path]/og-image.png">

<!-- Favicon -->
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
```

**Social preview image rules:**
- Format: **PNG** (not SVG — SVG is not supported by most social platforms as og:image)
- Dimensions: **1200 × 630 pixels** exactly
- File name: `og-image.png` (consistent across all projects)
- URL in meta tag: **absolute URL** (e.g., `https://apps.agim.ca/battery/inquiry/og-image.png`) — never a relative path
- Content: Must clearly represent the page's purpose; no generic placeholder
- Background: Must render legibly when displayed at 300px wide (LinkedIn card size)

---

## Standard 4 — Language

**Rule:** All UI content, labels, field names, error messages, button text, status messages, and documentation must be in **English** unless a specific project has an explicit requirement for additional languages.

If a future project requires bilingual output:
- English is always the primary language
- Additional language is layered using CSS attribute selectors (`[data-lang="zh"]`) or a separate page
- Never mix languages within the same UI element

---

## Standard 5 — Professional Industrial Appearance

**Rule:** Every AGI&M application must read as a professional industrial engineering or procurement tool.

**Required:**
- Clean typography hierarchy (H1 → H2 → H3 → body; never skip levels)
- Consistent use of AGI&M design tokens from `shared/css/tokens.css`
- Generous whitespace (content must breathe; no crowded layouts)
- High contrast text (minimum 4.5:1 for body text, WCAG 2.1 AA)
- Tables and data presented in structured, aligned formats

**Prohibited:**
- Consumer-style animations (bouncing, spinning loaders, parallax scrolling)
- Gradient backgrounds unless part of confirmed AGI&M brand system
- Illustrations, cartoons, emoji in UI
- Startup-style color schemes (neon gradients, oversaturated palettes)
- Marketing copy inside functional tools
- Decorative elements that add no informational value

---

## Standard 6 — Minimalist Design

**Rule:** Every page must have a single clear primary purpose. Every element must earn its place.

- Maximum one primary CTA per screen
- Secondary actions are visually subordinate to the primary CTA
- No decorative sections that delay the user from reaching the primary action
- Hero section must communicate: what this is, who it is for, and what to do next — within 3 seconds of page load
- No auto-playing media
- No cookie banners unless legally required (GitHub Pages has no cookies by default)

---

## Standard 7 — Performance

**Rule:** Every page must load fast. First Contentful Paint target: < 1.5 seconds on 4G mobile.

**Requirements:**
- No external font CDN dependencies in Phase 1 (use system font stack as fallback)
- Images compressed before commit (PNG: use oxipng or equivalent; JPEG: 80% quality maximum)
- No unnecessary JavaScript libraries (do not include jQuery, Bootstrap JS, or similar for pages that do not need them)
- CSS must be minimal and scoped — no importing full frameworks for a single form
- Lazy-load images below the fold
- Minification is not required for Phase 1 (GitHub Pages serves raw files) but must not be blocked by architecture decisions

**System font stack (use until custom font is confirmed):**
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
             'Helvetica Neue', Arial, sans-serif;
```

---

## Standard 8 — No Unnecessary Animations

**Rule:** Animation must serve a functional purpose. It must never be purely decorative.

**Acceptable animations:**
- Form validation feedback (shake on error, green checkmark on success)
- Loading spinners when a network operation is genuinely in progress
- Smooth scroll to anchor within a page
- Focus ring transitions (accessibility)

**Prohibited:**
- Page entrance animations (fade-in on load, slide-in sections)
- Hover animations on non-interactive elements
- Scroll-triggered animations
- Continuous looping animations of any kind
- Transition durations > 200ms on interactive elements

---

## Standard 9 — Accessibility

**Rule:** All applications must meet WCAG 2.1 AA as a minimum.

**Required:**
- All `<img>` elements have `alt` attributes (descriptive, not "image" or empty unless decorative)
- All form inputs have associated `<label>` elements (linked via `for`/`id`)
- All form validation errors linked via `aria-describedby`
- Radio button groups use `<fieldset>` and `<legend>`
- Focus is visible at all times (never `outline: none` without a custom visible focus replacement)
- Tab order follows visual reading order
- Color is never the sole means of conveying information (always pair with text or icon)
- Minimum touch target size: 44 × 44 pixels (WCAG 2.5.5)
- All interactive elements are keyboard operable

---

## Standard 10 — AGI&M Branding Consistency

**Rule:** All applications must use the confirmed AGI&M design tokens. Never hardcode brand colors or typography in component-level CSS.

All color values are imported from `shared/css/tokens.css`:

```css
/* Correct */
color: var(--color-primary);

/* Prohibited */
color: #0B2545;
```

This ensures that a single update to `tokens.css` propagates consistently across all applications.

See `docs/BRANDING_GOVERNANCE.md` for full brand compliance rules.

---

## Standard 11 — GitHub Pages Compatibility

**Rule:** All code must function correctly when served from GitHub Pages (static file server, no server-side execution).

**Implications:**
- No PHP, no server-side rendering, no `.htaccess` rewrites
- No `fetch()` calls to localhost or private network addresses
- No environment variables (these are not available on static pages — API keys must never appear in client-side code)
- All form submissions must use an external endpoint (Formspree, Netlify Forms, or a dedicated API)
- All paths must be relative or use the confirmed absolute domain — never `github.io` paths in production code
- A `.nojekyll` file must be present in the repository root

---

## Standard 12 — Pre-Merge Self-Review Checklist

Every PR author must complete this checklist before marking a PR as ready for review.

```
AGIM HTML ENGINEERING STANDARDS — PRE-MERGE CHECKLIST

Project name: ___________
Branch: ___________
Date: ___________

RESPONSIVE
[ ] Tested on Desktop Chrome (≥1024px)
[ ] Tested on Tablet simulation (768px)
[ ] Tested on Mobile (real device or iPhone Safari simulator, <768px)
[ ] No layout breaks at any intermediate width

HORIZONTAL SCROLL
[ ] overflow-x: hidden on html and body
[ ] No fixed-width elements wider than viewport
[ ] All images have max-width: 100%
[ ] Long strings handled with word-break

METADATA
[ ] <title> present and accurate
[ ] <meta name="description"> present (120-155 chars)
[ ] og:title, og:description, og:image, og:url present
[ ] og:image is absolute URL to a 1200×630 PNG file
[ ] twitter:card and twitter:image present
[ ] favicon linked
[ ] canonical URL present

PERFORMANCE
[ ] No external font CDN (or justified exception documented)
[ ] Images compressed before commit
[ ] No unnecessary JS libraries
[ ] Page loads in < 2 seconds on simulated 4G

DESIGN
[ ] Single clear primary CTA per screen
[ ] No startup-style animations
[ ] No marketing copy in functional tool
[ ] Professional industrial appearance confirmed

ACCESSIBILITY
[ ] All images have alt attributes
[ ] All inputs have associated labels
[ ] Focus ring visible
[ ] Color not sole differentiator
[ ] Touch targets ≥ 44px

BRANDING
[ ] Color values use CSS variables from shared/css/tokens.css
[ ] AGI&M logo present where required
[ ] English-only (or documented exception)

GITHUB PAGES
[ ] .nojekyll present in repo root
[ ] No server-side dependencies
[ ] No API keys in client-side code
[ ] Form action points to approved external endpoint

FINAL
[ ] All above items checked
[ ] Ready to merge
```

---

*Document owner: AGI&M ASSETS INC. | Version 1.0 | Mandatory — no exceptions without documented justification*
