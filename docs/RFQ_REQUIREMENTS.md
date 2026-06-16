# Battery Manufacturer Information Requirements
## AGI&M RFQ Intelligence Document

**Version:** 1.0-draft

---

## Context

This document captures the analysis of what a Chinese lithium battery cell manufacturer's sales engineer would require before issuing a meaningful quotation.

**Trigger inquiry received from customer:**

> *"We currently use: `45300103-173Ah` / `38.5 × 300 × 103 mm, 152Ah`. We are looking for cheaper alternatives or equivalent replacements."*

**Preliminary assessment of the reference cell:**

- Dimensions: 38.5 mm (thickness) × 300 mm (length) × 103 mm (width)
- This dimensional profile is **likely consistent with a pouch (laminate) cell format** — however this must be confirmed. The format cannot be declared definitively from dimensions alone without seeing the physical cell or an OEM datasheet.
- The capacity discrepancy (173Ah vs. 152Ah) is unexplained. These may represent different test conditions (e.g., 0.2C vs. 1C), two different part numbers, or a transcription error. This ambiguity must be resolved before RFQ generation.

**Conclusion:** This information is insufficient for any reputable Chinese battery manufacturer to issue a quotation. The structured intake questions below are required.

---

## Category A — Absolutely Required

*Information without which quotation is impossible.*

| # | Field | Reason |
|---|-------|--------|
| A1 | **Nominal cell voltage (V)** | Determines the chemistry family. A 3.2V cell is LFP; a 3.6–3.7V cell is NMC or NCA. These are entirely different products with different energy density, BMS compatibility, cycle life, and price structures. Without voltage, chemistry cannot be confirmed and any quote is meaningless. |
| A2 | **Cathode chemistry** | NMC, NCA, LFP, and LTO cells cannot be substituted for each other without system-level redesign. The customer must identify what they currently use, or state that they are open to alternatives and accept the performance trade-offs. |
| A3 | **Required capacity (Ah) and test condition** | The submitted inquiry references both 152Ah and 173Ah. These values must be reconciled. The actual capacity target and the C-rate at which it is measured (e.g., 0.2C at 25°C) must both be specified. |
| A4 | **Annual purchase volume (units/year)** | Price for 500 units/year bears no relationship to price for 50,000 units/year. Volume is the first filter applied by any factory sales engineer to determine whether to invest engineering time in a response. |
| A5 | **Required certifications** | UN38.3 is the minimum for international transport. European customers may require CE marking, IEC 62368-1, or EN 50604. Aviation-adjacent applications may require additional documentation. Certification requirements eliminate the majority of smaller suppliers immediately. |
| A6 | **Target price range** | "Cheap" is not a specification. Without a price anchor (e.g., target below $X/Ah or $Y/cell), suppliers cannot pre-qualify themselves. This wastes engineering time on both sides and is perceived as unprofessional. |

---

## Category B — Strongly Recommended

*Information that materially improves quotation accuracy.*

| # | Field | Reason |
|---|-------|--------|
| B1 | **Continuous and peak discharge C-rate** | Drone motors draw high peak current (commonly 5–15C peak). A standard 0.5C storage cell is a completely different product from a high-rate drone cell. Internal resistance spec, tab thickness, and electrolyte formulation are all affected. |
| B2 | **Cycle life target** | "80% capacity after N cycles at specified conditions" is the most important long-term cost driver. A 300-cycle cell vs. a 1,000-cycle cell can differ 40–80% in unit cost. Cycle life also determines which electrode formulation is appropriate. |
| B3 | **Operating temperature range** | Drones operating in northern Europe or alpine environments may encounter −20°C or lower. Desert or industrial environments may see +55°C. Temperature range affects electrolyte selection and separator specification. |
| B4 | **Charge C-rate** | Fast-charging capability (e.g., 2C charge for rapid field turnaround between flights) requires special electrode engineering and typically adds significant cost. If the customer charges slowly overnight, this is not a constraint. |
| B5 | **Dimensional flexibility** | Can the customer accept a cell that varies by ±2mm in any dimension, or is the exact 38.5 × 300 × 103 mm form factor a hard mechanical constraint? If flexible, the addressable supplier pool increases substantially. |
| B6 | **Tab configuration** | Pouch cells have a positive and negative tab. Tab position (same-side vs. opposite-side), tab material (aluminum positive / nickel-plated copper negative is standard), and tab dimensions affect pack assembly compatibility and must match the customer's existing module design if they are drop-in replacing. |
| B7 | **Required delivery lead time** | First article / NPI samples vs. production delivery have entirely different lead times (weeks vs. months). A customer requiring 4-week delivery will eliminate most non-stocking suppliers. |
| B8 | **Incoterms preference** | EXW, FOB Shenzhen, CIF Rotterdam — this changes total landed cost by 8–15% and determines who bears transport and customs risk. A European customer quoting EXW to CIF Rotterdam will see significant total cost difference. |

---

## Category C — Optional

*Useful at later stages; not required for an initial RFQ.*

| # | Field | When It Becomes Relevant |
|---|-------|--------------------------|
| C1 | Specific energy density target (Wh/kg) | Only if customer has a strict weight constraint that would cause rejection of otherwise compliant cells |
| C2 | Calendar life (years) | Important for storage ESS applications; less critical for high-cycle drone use |
| C3 | Self-discharge rate spec | Rarely a blocking factor in drone applications |
| C4 | DC internal resistance (mΩ) | Becomes relevant during DQE / qualification testing phase |
| C5 | Cell-level protection requirements | Typically managed at pack/BMS level, not cell level |
| C6 | Marking and labeling requirements | CE marking, country of origin — relevant at purchase order stage |
| C7 | Packaging preference (tray, blister, carton) | Logistics detail; not RFQ-blocking |
| C8 | Existing supplier relationships to exclude | Business context noted internally; does not affect initial RFQ |

---

## Minimum Viable Question Set

Following the principle: **"As simple as possible, but no missing critical information."**

The customer intake form must collect the following, split into two logical groups:

### Contact Information (separate section — not technical questions)

1. Company name
2. Contact name
3. Business email
4. Country

### Technical & Commercial Requirements (8 core decisions)

| # | Question | Input Type | Maps to Category |
|---|----------|------------|-----------------|
| 1 | What cathode chemistry does your current cell use? | Radio: NMC / NCA / LFP / LTO / Not sure | A2 |
| 2 | What is the nominal cell voltage? | Number field with hint | A1 |
| 3 | What is the required cell capacity (Ah)? | Number field + note to clarify 152 vs. 173Ah | A3 |
| 4 | Is the cell dimension a hard constraint? | Radio: Exact match / ±2mm flex / Flexible | B5 |
| 5 | What is the continuous discharge C-rate? | Radio: ≤1C / 1–3C / 3–10C / >10C / Not sure | B1 |
| 6 | What certifications are required? | Checkbox: UN38.3 / CE / IEC 62368 / None / Not sure | A5 |
| 7 | What is your estimated annual purchase volume? | Radio tier: <500 / 500–2k / 2k–10k / >10k | A4 |
| 8 | What is your target price range (USD per cell)? | Radio tier or free text | A6 |

**Total customer decisions: 4 contact fields + 8 technical/commercial decisions = 12 fields visible, but 8 are the core technical choices.**

> **Note on "8 questions" vs. "16 fields" in earlier drafts:** This document resolves that contradiction. The 4 contact fields are separated from the 8 technical/commercial requirement questions. The earlier draft conflated these and double-counted. The correct framing is: **4 contact fields + 8 requirement decisions**.

---

## Supplier RFQ Template Structure

When AGI&M sends an RFQ to suppliers, it should include:

1. **AGI&M header** (letterhead / branded)
2. **RFQ reference number** (linked to Inquiry ID — for internal tracking only; customer identity not disclosed)
3. **Application context** (e.g., "Drone power system, European OEM")
4. **Technical specification table** (populated from intake data)
5. **Commercial requirements** (volume, lead time, Incoterms, certifications)
6. **Response format requested** (unit price, MOQ, sample price, lead time, cert status, validity)
7. **Response deadline**
8. **AGI&M contact**

---

*Document owner: AGI&M ASSETS INC.*
