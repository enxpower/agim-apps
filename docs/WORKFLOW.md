# Sourcing Workflow Architecture
## AGI&M Battery Sourcing Platform

**Version:** 1.0-draft

---

## End-to-End Workflow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    AGI&M BATTERY SOURCING WORKFLOW                  │
└─────────────────────────────────────────────────────────────────────┘

  Stage 1          Stage 2           Stage 3          Stage 4
  ─────────        ─────────         ─────────         ─────────
  Customer    →   AGI&M         →   Supplier     →   AGI&M
  Inquiry         Review &           Quotation        Comparison
  Portal          RFQ Generation     Collection       & Analysis
                                                          │
                                                          ↓
                                                      Stage 5
                                                      ─────────
                                                      Customer
                                                      Quotation
                                                      Response
```

---

## Stage 1 — Customer Inquiry Portal

**Actor:** Customer (e.g., European drone manufacturer)

**Entry point:** Public URL (e.g., `sourcing.agim.ca/drone/inquiry/`)

**Process:**
1. Customer lands on intake form
2. Completes Contact Information section (name, company, email, country)
3. Completes Technical Requirements section (chemistry, voltage, capacity, dimensions, discharge rate, certifications, cycle life)
4. Completes Commercial Requirements section (annual volume, target price range, lead time)
5. Reviews summary screen
6. Submits — form locks, Inquiry ID generated, confirmation displayed
7. Customer receives email confirmation with Inquiry ID and submission summary

**Output:** Structured inquiry record with Inquiry ID

**Data visibility:** Customer-entered data is visible to AGI&M only. Customer identity is never forwarded to suppliers.

---

## Stage 2 — AGI&M Internal Review & RFQ Generation

**Actor:** AGI&M account manager

**Trigger:** Email notification received with submission payload

**Process:**
1. AGI&M reviews completeness of submission
2. Flags any ambiguities (e.g., capacity discrepancy between referenced cell numbers)
3. Adds internal notes: target margin, preferred suppliers, exclusions, urgency level
4. Selects supplier shortlist from internal supplier database
5. Generates RFQ document from intake data using AGI&M RFQ template
6. RFQ is tagged with the originating Inquiry ID

**Output:** Formatted RFQ document (PDF or structured email) ready for supplier distribution

**Internal only — never shared with customer or supplier in raw form**

---

## Stage 3 — Multi-Supplier Quotation Distribution

**Actor:** AGI&M account manager

**Process:**
1. AGI&M sends RFQ to selected suppliers via email (Phase 1)
2. Each supplier receives:
   - Anonymized technical requirements (customer identity withheld)
   - Volume estimate
   - Certification requirements
   - Delivery and lead time requirements
   - Response deadline (typically 5–10 business days)
   - AGI&M structured response template
3. Suppliers are tracked against the Inquiry ID in AGI&M's internal tracker

**Supplier count target:** 3–5 suppliers per RFQ to ensure meaningful comparison

**Output:** Distributed RFQ with response deadline established

---

## Stage 4 — Supplier Quote Collection & Entry

**Actor:** AGI&M account manager (entering supplier responses)

**Process:**
1. Supplier responses received by email
2. AGI&M enters each quote into internal comparison tracker (Phase 1: spreadsheet; Phase 2: database)
3. Each quote record captures:
   - Unit price (EXW / FOB Shenzhen)
   - Currency
   - MOQ
   - Sample availability and sample price
   - Sample lead time
   - Production lead time
   - Certifications available (UN38.3, CE, IEC 62368, etc.)
   - Capacity and chemistry confirmed
   - Quote validity period
   - Technical notes or deviations

**Output:** Populated supplier comparison dataset linked to Inquiry ID

---

## Stage 5 — AGI&M Comparison & Analysis

**Actor:** AGI&M account manager

**Process:**
1. Side-by-side comparison matrix generated (normalized to total landed cost where possible)
2. AGI&M adds qualitative assessment:
   - Supplier tier and audit status
   - Past relationship history
   - Delivery risk assessment
   - Certification risk assessment
3. AGI&M selects recommended option
4. Internal margin is applied to recommended supplier price
5. Customer-facing quotation drafted

**Output:** Internal comparison report + customer quotation draft

---

## Stage 6 — Customer Quotation Response

**Actor:** AGI&M account manager

**Process:**
1. AGI&M sends branded quotation to customer
2. Quotation references original Inquiry ID for traceability
3. Customer receives:
   - Technical specification confirmation
   - AGI&M unit price (supplier cost not disclosed)
   - Lead time
   - Certifications included
   - MOQ
   - Validity period
   - Payment terms
   - AGI&M recommendation note
4. Customer accepts, declines, or requests revision
5. Revision creates a new linked record (original Inquiry ID preserved)

**Output:** Accepted customer quotation → proceeds to order stage

---

## Revision Cycle

```
Original Inquiry (INQ-20260616-XXXX)
         │
         ├── Revision 1 (customer requests change)
         │       └── New submission linked to original ID
         │
         └── Revision 2 (if further change needed)
                 └── New submission linked to original ID

All revisions preserve the full original submission as an immutable record.
```

---

## Information Flow Diagram

```
                    ┌──────────────────┐
                    │    CUSTOMER       │
                    │  (European OEM)   │
                    └────────┬─────────┘
                             │ Submits intake form
                             ▼
                    ┌──────────────────┐
                    │  AGI&M INTAKE    │
                    │  PORTAL          │◄── Inquiry ID generated
                    └────────┬─────────┘    Timestamp locked
                             │
                    ┌────────▼─────────┐
                    │  AGI&M INTERNAL  │
                    │  REVIEW          │◄── Internal notes, margin,
                    └────────┬─────────┘    supplier shortlist
                             │
              ┌──────────────┼──────────────┐
              │              │              │
     ┌────────▼───┐  ┌───────▼────┐  ┌─────▼──────┐
     │ SUPPLIER A │  │ SUPPLIER B │  │ SUPPLIER C │
     │ (EVE etc.) │  │ (REPT etc.)│  │(Gotion etc)│
     └────────┬───┘  └───────┬────┘  └─────┬──────┘
              │              │              │
              └──────────────┼──────────────┘
                             │ Quotes returned
                    ┌────────▼─────────┐
                    │  AGI&M           │
                    │  COMPARISON      │◄── Margin applied
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │  CUSTOMER        │
                    │  QUOTATION       │◄── AGI&M branded
                    └──────────────────┘    Supplier cost never disclosed
```

---

## Privacy & Confidentiality Rules

| Information | Customer | AGI&M | Supplier |
|-------------|----------|-------|----------|
| Customer company name | ✅ Enters | ✅ Sees | ❌ Never |
| Customer contact email | ✅ Enters | ✅ Sees | ❌ Never |
| Technical requirements | ✅ Enters | ✅ Sees | ✅ Anonymized RFQ |
| Customer target price | ✅ Enters | ✅ Sees | ❌ Never |
| AGI&M internal margin | ❌ Never | ✅ Only | ❌ Never |
| Supplier raw quote price | ❌ Never | ✅ Sees | ✅ Enters |
| AGI&M quotation to customer | ✅ Receives | ✅ Generates | ❌ Never |
| Inquiry ID | ✅ Receives | ✅ Full access | Reference only |

---

*Document owner: AGI&M ASSETS INC.*
