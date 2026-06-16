# Branding Governance
## AGI&M Publishing Platform

**Version:** 1.0
**Branch:** docs/platform-hardening
**Status:** Active governance document

---

## Purpose

This document defines the rules for applying AGI&M visual identity across all applications published from this repository. All developers and AI systems producing HTML for this platform must follow these rules without exception.

---

## Brand Authority

The authoritative AGI&M brand source is the live website at **`https://agim.ca`**.

Before writing any CSS that references brand colors, typography, or spacing:
1. Inspect the live `agim.ca` stylesheet
2. Extract the confirmed design tokens
3. Update `shared/css/tokens.css` with confirmed values
4. All project CSS then references `shared/css/tokens.css` — never hardcoded values

**No brand values may be assumed, inferred, or invented.** If the confirmed values are not yet available, use the provisional placeholders in `shared/css/tokens.css` and mark them explicitly as `/* PROVISIONAL — confirm from agim.ca before launch */`.

---

## Design Token File

All AGI&M brand values are defined in one file: `shared/css/tokens.css`

This file is the single source of truth for the entire platform.

**Current token status: PROVISIONAL — must be confirmed from agim.ca before any public launch**

```css
/* ==========================================================================
   AGI&M Design Tokens
   Source: agim.ca (to be confirmed before production use)
   Status: PROVISIONAL — do not use in production without confirmation
   Last updated: 2026-06-16
   ========================================================================== */

:root {

  /* --- Color: Brand Primary --- */
  --color-primary:           #0B2545; /* PROVISIONAL */
  --color-primary-hover:     #0e2e54; /* PROVISIONAL */
  --color-secondary:         #1B4F8A; /* PROVISIONAL */
  --color-accent:            #4A7FB5; /* PROVISIONAL */

  /* --- Color: Backgrounds --- */
  --color-bg-page:           #F0F4F8; /* PROVISIONAL */
  --color-bg-surface:        #FFFFFF;
  --color-bg-subtle:         #E8EDF3; /* PROVISIONAL */

  /* --- Color: Text --- */
  --color-text-primary:      #0D1B2A; /* PROVISIONAL */
  --color-text-secondary:    #4A5568;
  --color-text-muted:        #718096;
  --color-text-inverse:      #FFFFFF;

  /* --- Color: Borders --- */
  --color-border:            #CBD5E0;
  --color-border-strong:     #A0AEC0;
  --color-border-focus:      #4A7FB5; /* PROVISIONAL — use accent for focus ring */

  /* --- Color: Semantic --- */
  --color-success:           #276749;
  --color-success-bg:        #F0FFF4;
  --color-error:             #C53030;
  --color-error-bg:          #FFF5F5;
  --color-warning:           #C05621;
  --color-warning-bg:        #FFFAF0;
  --color-info:              #2B6CB0;
  --color-info-bg:           #EBF8FF;

  /* --- Typography --- */
  --font-family-heading:     -apple-system, BlinkMacSystemFont, 'Segoe UI',
                              Roboto, 'Helvetica Neue', Arial, sans-serif;
                              /* PROVISIONAL — confirm from agim.ca */
  --font-family-body:        -apple-system, BlinkMacSystemFont, 'Segoe UI',
                              Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-family-mono:        'JetBrains Mono', 'Fira Code', 'Cascadia Code',
                              'Courier New', monospace;

  --font-size-xs:    0.75rem;   /*  12px */
  --font-size-sm:    0.875rem;  /*  14px */
  --font-size-base:  1rem;      /*  16px */
  --font-size-lg:    1.125rem;  /*  18px */
  --font-size-xl:    1.25rem;   /*  20px */
  --font-size-2xl:   1.5rem;    /*  24px */
  --font-size-3xl:   1.875rem;  /*  30px */
  --font-size-4xl:   2.25rem;   /*  36px */
  --font-size-5xl:   3rem;      /*  48px */

  --font-weight-regular:  400;
  --font-weight-medium:   500;
  --font-weight-semibold: 600;
  --font-weight-bold:     700;
  --font-weight-black:    900;

  --line-height-tight:    1.25;
  --line-height-snug:     1.375;
  --line-height-normal:   1.5;
  --line-height-relaxed:  1.625;

  /* --- Spacing --- */
  --space-1:    0.25rem;   /*  4px */
  --space-2:    0.5rem;    /*  8px */
  --space-3:    0.75rem;   /* 12px */
  --space-4:    1rem;      /* 16px */
  --space-5:    1.25rem;   /* 20px */
  --space-6:    1.5rem;    /* 24px */
  --space-8:    2rem;      /* 32px */
  --space-10:   2.5rem;    /* 40px */
  --space-12:   3rem;      /* 48px */
  --space-16:   4rem;      /* 64px */
  --space-20:   5rem;      /* 80px */
  --space-24:   6rem;      /* 96px */

  /* --- Layout --- */
  --max-width-content:   720px;
  --max-width-wide:      1024px;
  --max-width-full:      1280px;

  /* --- Borders --- */
  --radius-sm:   2px;
  --radius-md:   4px;
  --radius-lg:   6px;
  /* Note: AGI&M industrial aesthetic — keep border-radius minimal (≤6px) */

  /* --- Shadows --- */
  --shadow-sm:   0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md:   0 2px 4px 0 rgba(0, 0, 0, 0.08);
  /* Note: Use sparingly — AGI&M aesthetic is flat/minimal, not material design */

  /* --- Transitions --- */
  --transition-fast:    150ms ease;
  --transition-normal:  200ms ease;
  /* Note: All transitions ≤ 200ms. No easing curves that feel "bouncy." */

  /* --- Form Elements --- */
  --input-height:         48px;   /* Minimum touch target compliance */
  --input-padding-x:      var(--space-4);
  --input-padding-y:      var(--space-3);
  --input-border:         1px solid var(--color-border);
  --input-border-focus:   2px solid var(--color-border-focus);
  --input-bg:             var(--color-bg-surface);
  --input-radius:         var(--radius-md);

  /* --- Z-Index Scale --- */
  --z-base:       0;
  --z-raised:     10;
  --z-overlay:    100;
  --z-modal:      200;
  --z-toast:      300;
  --z-tooltip:    400;

}
```

---

## Logo Usage Rules

### Primary Logo (`shared/assets/agim-logo.svg`)

- Use on white or light backgrounds (`--color-bg-page`, `--color-bg-surface`)
- Minimum width: 120px
- Clear space: equal to the height of the "A" letterform on all sides
- Never stretch, skew, rotate, or modify proportions

### Reversed Logo (`shared/assets/agim-logo-white.svg`)

- Use on dark backgrounds (`--color-primary`, `--color-secondary`, dark overlays)
- Same clear space and size rules apply

### Prohibited Logo Treatments

- No drop shadows on the logo
- No colorization (logo must appear in its original form only)
- No placement on busy or low-contrast backgrounds
- No logo inside a colored box or badge unless that treatment is part of the confirmed brand system

---

## Typography Rules

### Heading Hierarchy

```
H1 — Page title (one per page only)
H2 — Major section headings
H3 — Subsection headings
H4 — Minor groupings
```

- Never skip heading levels (H1 → H3, skipping H2, is a violation)
- Headings use `--font-weight-bold` (700) or `--font-weight-semibold` (600)
- Body text uses `--font-weight-regular` (400)
- Labels and UI elements use `--font-weight-medium` (500)

### Type Scale Application

| Use | Token |
|-----|-------|
| Page hero title | `--font-size-4xl` or `--font-size-5xl` |
| Section heading | `--font-size-2xl` or `--font-size-3xl` |
| Card title | `--font-size-xl` |
| Body text | `--font-size-base` |
| Form labels | `--font-size-sm` (uppercase tracking) or `--font-size-base` |
| Helper text / hints | `--font-size-sm` in `--color-text-muted` |
| Inquiry ID / codes | `--font-family-mono`, `--font-size-sm` |

---

## Color Application Rules

### Primary Color (`--color-primary`)

Use for: Primary CTA buttons, navigation background, key headings

### Secondary Color (`--color-secondary`)

Use for: Secondary buttons, links, hover states on primary elements

### Accent Color (`--color-accent`)

Use for: Focus rings, active states, small UI highlights

### Background (`--color-bg-page`)

Use for: Page background. Never use white (`#ffffff`) directly as the page background — always use the token.

### Prohibited Color Combinations

- Do not place `--color-text-muted` text on `--color-bg-subtle` (insufficient contrast)
- Do not use semantic colors (success/error/warning/info) for decorative purposes
- Do not introduce new colors not defined in this token system without updating `tokens.css` and documenting the reason

---

## New Application Branding Checklist

Before launching any new application in this repository:

- [ ] All color values use CSS variables from `shared/css/tokens.css`
- [ ] All provisional token values have been confirmed from `agim.ca` OR are explicitly marked provisional in code comments
- [ ] Correct AGI&M logo variant used for background
- [ ] Heading hierarchy is correct (H1 → H2 → H3, no skips)
- [ ] Font family references the token (not hardcoded family names)
- [ ] No new colors introduced without updating `tokens.css`
- [ ] No rounded corners > `--radius-lg` (6px)
- [ ] No transitions > 200ms
- [ ] No decorative animations

---

## Token Confirmation Process

When `agim.ca` brand colors are ready to be confirmed:

1. Inspect `agim.ca` in browser DevTools → Sources → find main CSS file
2. Extract all `--color-*`, `--font-*`, `--space-*` custom properties
3. Open a PR with the title `chore: confirm AGI&M brand tokens from agim.ca`
4. Update `shared/css/tokens.css` — remove all `/* PROVISIONAL */` comments where values are confirmed
5. Merge to `main`
6. All applications immediately inherit confirmed values (no per-application changes needed)

---

*Document owner: AGI&M ASSETS INC. | Version 1.0*
