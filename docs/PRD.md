# Product Requirements Document (PRD)
## AGI&M Battery Sourcing & Quotation Workflow Platform

**Version:** 1.0-draft
**Status:** Pending approval
**Date:** 2026-06-16

---

## 1. Problem Statement

AGI&M sources lithium battery cells from Chinese manufacturers for international customers. Without a structured intake process, incoming customer inquiries lack the technical information that battery manufacturers require to issue meaningful quotations.

Approaching Chinese battery factories with incomplete information signals unprofessionalism and causes unnecessary back-and-forth delays.

**Immediate trigger:** A European drone manufacturer submitted the following reference information only:

- `45300103-173Ah`
- `38.5 × 300 × 103 mm, 152Ah`
- Statement: *"Cheap alternatives or equivalent replacements are acceptable."*

This information is insufficient for any reputable Chinese battery cell manufacturer to provide an accurate quotation.

---

## 2. Business Objective

Build a complete, professional, and reusable battery sourcing workflow platform:

```
Customer Inquiry
→ Requirement Collection
→ AGI&M Internal RFQ Generation
→ Multi-Supplier Quotation Collection
→ AGI&M Comparison & Analysis
→ Customer Quotation Response
```

This is not a one-time form. It is a long-term AGI&M sourcing platform reusable across all future battery sourcing verticals.

---

## 3. Target Verticals

| Vertical | Priority |
|----------|----------|
| Drone batteries | Phase 1 (current) |
| Robotics / AGV batteries | Phase 2 |
| Marine batteries | Phase 2 |
| Industrial ESS batteries | Phase 3 |
| eVTOL batteries | Phase 3 |

---

## 4. Functional Requirements

### 4.1 Customer Inquiry Portal

- Publicly accessible, no login required
- Mobile-first responsive design (desktop, tablet, mobile)
- No horizontal scrolling on any device
- Form split into two logical groups:
  - **Contact Information** (separate from technical requirements)
  - **Technical & Commercial Requirements**
- Every field has a clearly stated business purpose
- Smart radio/checkbox inputs to minimize free-text entry
- Context-sensitive hints on every technical field
- Browser local storage preserves partial completion (no account required)
- Submission generates a unique Inquiry ID (see Section 6 for ID strategy)
- Immutable after submission (see Section 6)
- Confirmation screen + email confirmation sent automatically

### 4.2 AGI&M Internal Workflow

- Email notification to AGI&M on each submission
- AGI&M internal review: completeness check, priority flag, supplier shortlist selection
- RFQ document generated from intake data
- RFQ distributed to selected suppliers

### 4.3 Supplier Quotation Collection

- Suppliers receive anonymized RFQ (customer identity not disclosed)
- Structured response format (initially email template; future: supplier portal)
- AGI&M enters supplier responses into comparison tracker

### 4.4 Comparison & Analysis

- Side-by-side comparison matrix (price, MOQ, lead time, certifications, supplier tier)
- AGI&M adds qualitative risk notes
- Internal margin applied
- Recommended option documented with rationale

### 4.5 Customer Quotation Response

- AGI&M-branded quotation document
- References original Inquiry ID (full audit trail)
- Delivered as PDF or secure link
- Contains: pricing, specs, lead time, certifications, MOQ, validity, payment terms

---

## 5. Non-Functional Requirements

| Requirement | Specification |
|-------------|---------------|
| Language | English only — all UI, labels, records, supplier and customer content |
| Brand | AGI&M visual identity — *colors to be confirmed against live site assets before implementation* |
| Performance | Form page load < 2 seconds on 4G mobile |
| Accessibility | WCAG 2.1 AA minimum, keyboard navigable, sufficient contrast |
| Browser support | Chrome (latest), Safari (latest), Edge (latest), iOS Safari, Android Chrome |
| Horizontal scroll | Strictly prohibited on all breakpoints |
| Data integrity | Submissions are immutable records (see Section 6) |
| Privacy | Customer identity never disclosed to suppliers without explicit authorization |

---

## 6. Inquiry ID and Immutability Strategy

### 6.1 Phase 1 (Static GitHub Pages)

On a static GitHub Pages site, no server-side state is available at submission time. Therefore:

- **Inquiry ID format:** `INQ-[YYYYMMDD]-[timestamp_ms]-[4-char-random]`
  - Example: `INQ-20260616-1718534400000-K7PX`
- This ID is generated client-side in JavaScript at the moment of form submission
- It is displayed on the confirmation screen and included in the confirmation email
- **Limitation acknowledged:** Client-side IDs cannot guarantee global uniqueness or sequential numbering. Collision probability is acceptably low for expected inquiry volume.
- **True immutability is not achievable on a static site.** The submission backend (email, Formspree, or Notion API) becomes the record of truth. AGI&M must treat the first-received submission as authoritative and not process duplicates.

### 6.2 Phase 2 (Backend API)

- Inquiry ID is generated server-side with guaranteed uniqueness
- Submissions are written to a PostgreSQL database as immutable records (`INSERT` only, no `UPDATE` on submitted records)
- Revisions create new child records linked to the original Inquiry ID
- Full audit log maintained

### 6.3 Revision Policy

- No editing after submission, in any phase
- Customer must submit a new inquiry referencing the original Inquiry ID
- AGI&M links revisions in internal tracking

---

## 7. Scope Boundaries

| In Scope (Phase 1) | Out of Scope (Phase 1) |
|--------------------|------------------------|
| Customer intake form (drone vertical) | Supplier login portal |
| Submission confirmation + email | Automated comparison engine |
| Inquiry ID generation (client-side) | Customer status tracker |
| AGI&M email notification | PDF quotation generation |
| Architecture documentation | AI-assisted RFQ enrichment |
| Drone vertical only | Other battery verticals |

---

## 8. Success Criteria

- A customer can submit a complete drone battery inquiry in under 5 minutes
- AGI&M receives all information required to generate a professional RFQ to Chinese battery manufacturers without any follow-up questions
- The submitted record serves as a permanent commercial reference
- The platform architecture supports future vertical expansion without schema changes

---

*Document owner: AGI&M ASSETS INC. | Next review: upon PR approval*
