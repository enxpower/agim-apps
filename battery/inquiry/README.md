# Battery Sourcing — Drone Inquiry Module

**Module:** Battery Sourcing
**Vertical:** Drone / UAV Lithium Battery Cells
**Platform path:** `/battery/inquiry/`
**Status:** Architecture approved (PR #1, PR #2) — implementation pending PR #3 approval

---

## Scope

This folder contains the customer-facing inquiry portal for the drone battery sourcing vertical. It is the first application module on the AGI&M publishing platform.

**First inquiry context:**

A European drone manufacturer submitted the following reference information:

- `45300103-173Ah`
- `38.5 × 300 × 103 mm, 152Ah`
- Statement: *"Cheap alternatives or equivalent replacements are acceptable."*

The intake form in this folder collects the minimum structured information required to generate a professional RFQ to Chinese lithium battery cell manufacturers.

---

## Path Note

This module lives at `battery/inquiry/` — not `drone/inquiry/`.

The top-level folder name reflects the **product category** (battery cells), not the customer vertical (drone manufacturer). This distinction is intentional:

- `battery/` = all battery cell sourcing inquiries, regardless of end application
- `drone/` = reserved for future drone-specific applications (not battery sourcing)

This separation allows the battery inquiry form to serve multiple customer verticals (drone, robotics, AGV, marine) from a single URL without path changes.

---

## Cell Format Note

Based on the dimensions provided (38.5 × 300 × 103 mm), the referenced cell is **likely a large-format pouch (laminate) cell**. This assessment is based on dimensional profile only and **must be confirmed** via the original OEM datasheet or physical inspection before any sourcing documentation declares it definitively as a pouch cell.

---

## Files (To Be Created in Implementation PR)

```
battery/inquiry/
├── README.md        ← This file
├── index.html       ← Customer intake form         [NOT YET IMPLEMENTED]
├── confirm.html     ← Submission confirmation page [NOT YET IMPLEMENTED]
└── og-image.png     ← 1200×630 PNG social preview  [NOT YET IMPLEMENTED]
```

---

## Implementation Gate

HTML implementation is blocked until:

- PR #3 (`chore/platform-foundation`) is approved and merged
- All 12 decisions in `docs/IMPLEMENTATION_DECISIONS.md` are confirmed by Andy
- AGI&M brand tokens are confirmed from `agim.ca` and `shared/css/tokens.css` is updated

See `docs/IMPLEMENTATION_DECISIONS.md` for the full decision list.

---

*Document owner: AGI&M ASSETS INC. | Migrated from drone/inquiry/ in chore/platform-foundation*
