# Drone Battery Inquiry — Vertical README

**Vertical:** Drone / UAV Lithium Battery Cells
**Status:** Architecture defined — implementation pending PR approval

---

## Scope

This folder contains the customer-facing inquiry portal for the drone battery sourcing vertical.

**First inquiry context:**

A European drone manufacturer submitted the following reference information:

- `45300103-173Ah`
- `38.5 × 300 × 103 mm, 152Ah`
- Statement: *"Cheap alternatives or equivalent replacements are acceptable."*

The intake form in this folder collects the minimum structured information required to generate a professional RFQ to Chinese lithium battery cell manufacturers.

---

## Files (Post-Implementation)

```
drone/inquiry/
├── index.html      ← Customer intake form (not yet implemented)
├── confirm.html    ← Submission confirmation page (not yet implemented)
└── og-image.png    ← 1200×630 social preview image (not yet implemented)
```

---

## Cell Format Note

Based on the dimensions provided (38.5 × 300 × 103 mm), the referenced cell is **likely a large-format pouch (laminate) cell**. This assessment is based on dimensional profile only and **must be confirmed** via the original OEM datasheet or physical inspection before any sourcing documentation declares it definitively as a pouch cell.

---

## Implementation Gate

No HTML, CSS, or JavaScript will be written until the architecture PR is approved.

See `docs/IMPLEMENTATION_DECISIONS.md` for the 8 decisions required before build begins.

---

*Document owner: AGI&M ASSETS INC.*
