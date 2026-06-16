# UX Strategy
## AGI&M Battery Sourcing Platform — Customer Inquiry Portal

**Version:** 1.0-draft

---

## Design Principles

### 1. Professional Engineering Procurement Aesthetic

This platform must feel like a professional industrial procurement system — not a startup form, SaaS tool, or survey app. Every visual and interaction decision should reinforce AGI&M's positioning as a serious B2B engineering procurement company.

Tone references: Siemens supplier portal, ABB procurement interface, Mouser/DigiKey RFQ flow — but cleaner and more contemporary.

### 2. Radical Simplicity

Every field that does not serve a direct commercial or technical purpose must be removed. A form that takes 6 minutes to complete will have a significantly lower completion rate than one that takes 3 minutes.

### 3. Contact Before Technical

The form is split into two distinct sections presented sequentially:
- **Section 1:** Contact Information (4 fields — who you are)
- **Section 2:** Technical & Commercial Requirements (8 decisions — what you need)

This separation is deliberate. Contact fields are cognitively easy and establish rapport before asking technical questions. Mixing them creates form fatigue.

### 4. Radio Buttons Over Free Text

Wherever a constrained set of options exists (chemistry, C-rate, volume tier, lead time), radio buttons or checkboxes replace free-text input. This:
- Reduces completion friction
- Ensures data is structured and queryable
- Prevents factory-incompatible inputs (e.g., "fast" instead of a C-rate)
- Signals that AGI&M understands the domain

### 5. Context Hints on Every Technical Field

Technical fields include a discreet, non-intrusive hint that expands on hover or tap:

Example:
> **Nominal Cell Voltage**
> *Hint: 3.2V = LFP chemistry. 3.6–3.7V = NMC or NCA. If you are unsure, check your existing cell datasheet or BMS configuration.*

This helps non-technical procurement contacts complete the form without needing to escalate internally.

### 6. Respect for the User's Time

- No marketing copy inside the form
- No animations or transitions that delay progression
- No progress spinner unless a network operation is genuinely in progress
- Confirmation screen appears instantly after submission
- Inquiry ID is copyable with a single click

---

## Visual Identity

**Important:** AGI&M brand colors are to be read from the live site at `https://agim.ca` and confirmed before implementation. The values below are **provisional placeholders only**, documented here for structural purposes. They must be replaced with confirmed brand tokens before any CSS is written.

| Token | Provisional Value | Source |
|-------|-------------------|--------|
| `--color-primary` | `#0B2545` (provisional) | To be confirmed from agim.ca |
| `--color-secondary` | `#1B4F8A` (provisional) | To be confirmed from agim.ca |
| `--color-accent` | `#4A7FB5` (provisional) | To be confirmed from agim.ca |
| `--color-background` | `#F0F4F8` (provisional) | To be confirmed from agim.ca |
| `--color-surface` | `#FFFFFF` | Standard |
| `--color-text-primary` | `#0D1B2A` (provisional) | To be confirmed from agim.ca |
| `--color-text-secondary` | `#4A5568` | Standard gray |
| `--color-border` | `#CBD5E0` | Standard gray |
| `--color-error` | `#C53030` | Standard red |
| `--color-success` | `#276749` | Standard green |

> **Action required before implementation:** Read `agim.ca` stylesheet or design tokens. Replace all provisional values. Do not ship with unconfirmed brand colors.

**Typography:**
- Headings: To be confirmed from agim.ca (likely Inter or similar professional sans-serif)
- Body: System UI font stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`) as fallback
- No external font CDN dependencies in Phase 1 (performance and availability)
- Monospace for Inquiry ID display: `'JetBrains Mono', 'Fira Code', monospace`

**Design prohibitions:**
- No gradients except subtle background texture if used on agim.ca
- No box shadows except minimal card elevation (1px, very low opacity)
- No rounded corners > 4px (industrial aesthetic)
- No illustrations, icons that look consumer/startup
- No colored section headers beyond brand palette
- No emojis anywhere in the UI

---

## Form Architecture

### Section 1: Contact Information

| Field | Type | Required | Placeholder |
|-------|------|----------|-------------|
| Company Name | Text | Yes | Your organization name |
| Your Name | Text | Yes | First and last name |
| Business Email | Email | Yes | company@domain.com |
| Country | Select (dropdown) | Yes | Select your country |

Notes:
- Company name appears first to establish B2B context immediately
- Email validated against basic format; business email preferred (not enforced in Phase 1)
- Country selection uses ISO country list

### Section 2: Technical & Commercial Requirements

| # | Field | Type | Required |
|---|-------|------|----------|
| 1 | Cell Chemistry | Radio (NMC / NCA / LFP / LTO / Not sure) | Yes |
| 2 | Nominal Cell Voltage (V) | Number input + hint | Yes |
| 3 | Required Capacity (Ah) | Number input + clarification note | Yes |
| 4 | Cell Dimension Flexibility | Radio (Hard constraint / ±2mm acceptable / Flexible equivalent) | Yes |
| 5 | Continuous Discharge C-Rate | Radio (≤1C / 1–3C / 3–10C / >10C / Not sure) | Yes |
| 6 | Required Certifications | Checkbox (UN38.3 / CE / IEC 62368-1 / None / Not sure) | Yes |
| 7 | Annual Purchase Volume (units/year) | Radio tier (<500 / 500–2,000 / 2,000–10,000 / >10,000) | Yes |
| 8 | Target Price Range | Radio tier or free text | Yes |

Notes:
- Pre-fill dimension fields from URL parameter if customer is directed from a specific product inquiry link
- Capacity field includes an inline note: *"The reference cells show both 152Ah and 173Ah — please enter your actual target capacity."*
- Price range radio options to be calibrated against current NMC pouch cell market rates before implementation

### Additional Notes (Optional)

Single optional textarea (max 500 characters):
> *"Any additional context, constraints, or requirements not covered above."*

---

## Form Flow

```
[Landing / Context Screen]
        │
        ▼
[Section 1: Contact Information]
        │
    [Continue →]
        │
        ▼
[Section 2: Technical & Commercial Requirements]
        │
    [Review Summary →]
        │
        ▼
[Summary Review Screen]
 (all entries displayed, read-only)
        │
    [Submit Inquiry]
        │
        ▼
[Confirmation Screen]
 ✔ Inquiry submitted
 Inquiry ID: INQ-20260616-1718534400000-K7PX
 [Copy ID]
 You will receive a confirmation email at: user@company.com
 AGI&M will respond within 3–5 business days.
```

---

## Responsive Behavior

| Breakpoint | Layout |
|------------|--------|
| Desktop (≥1024px) | Two-column layout for contact fields; full-width for technical fields |
| Tablet (768–1023px) | Single column throughout; generous padding |
| Mobile (<768px) | Single column; minimum 48px touch targets; no horizontal scroll |

**Horizontal scroll:** Strictly prohibited. `overflow-x: hidden` applied at `html` and `body` level. All containers use `max-width: 100%`. No fixed-width elements.

---

## Submission & Confirmation Behavior

### Inquiry ID Generation (Phase 1 — Static Site)

```
Format:    INQ-[YYYYMMDD]-[unix_timestamp_ms]-[4-char-random-alphanumeric]
Example:   INQ-20260616-1718534400000-K7PX

Generation: JavaScript at moment of form submit
            Date: new Date() formatted YYYYMMDD
            Timestamp: Date.now() (milliseconds since epoch)
            Random suffix: 4 chars from [A-Z0-9] via crypto.getRandomValues()
```

**Known limitations of client-side ID generation:**
- Cannot guarantee sequential numbering
- Cannot guarantee global uniqueness across concurrent submissions (collision probability extremely low at expected Phase 1 volume)
- Client clock can be manipulated (does not affect AGI&M's server-side received timestamp)
- **Not a substitute for a backend-generated ID** — this is a Phase 1 pragmatic approach only

**True immutability requires Phase 2 backend.** In Phase 1, the Formspree submission timestamp is the authoritative record. AGI&M must not process duplicate submissions and must treat the first-received record as the canonical entry.

### Email Confirmation

Sent automatically via Formspree or equivalent:
- Subject: `AGI&M Battery Sourcing — Inquiry Received [INQ-20260616-XXXX-YYYY]`
- Content: Inquiry ID, submission summary (all fields), expected response time, AGI&M contact for urgent matters
- From: `sourcing@agim.ca` (to be confirmed)

---

## Accessibility Requirements

- All inputs have associated `<label>` elements
- Error messages are linked via `aria-describedby`
- Focus ring visible and high-contrast (not browser default)
- Tab order follows visual reading order
- Radio groups use `<fieldset>` and `<legend>`
- Color is never the sole means of conveying information
- Minimum contrast ratio 4.5:1 for body text, 3:1 for large text (WCAG 2.1 AA)

---

*Document owner: AGI&M ASSETS INC.*
