# Data Model
## AGI&M Battery Sourcing Platform

**Version:** 1.0-draft
**Database target:** PostgreSQL (Phase 2+)
**Phase 1 note:** Phase 1 uses static GitHub Pages + form submission backend (Formspree / email). This schema is the target model for Phase 2 backend implementation. All entity names and field names are defined now to ensure the Phase 1 data structure can migrate cleanly.

---

## Entity Relationship Overview

```
Customer ──────────────── Inquiry
                             │
               ┌─────────────┼──────────────┐
               │             │              │
        ProductRequest   TechnicalSpec    RFQ
               │                          │
               │                   ┌──────┴──────┐
               │              RFQRecipient   Supplier
               │                          │
               │                    SupplierQuote
               │                          │
               └─────────────────── ComparisonResult
                                          │
                                   CustomerQuotation
                                          │
                                   RevisionHistory
```

---

## Table Definitions

### `customers`

Stores all customer contacts who have submitted inquiries.

```sql
CREATE TABLE customers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name    VARCHAR(255) NOT NULL,
  contact_name    VARCHAR(255),
  email           VARCHAR(255) NOT NULL,
  country         VARCHAR(100),
  phone           VARCHAR(50),
  source          VARCHAR(50),     -- 'portal', 'direct', 'referral'
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

### `inquiries`

The core record. One inquiry per customer submission. Immutable after creation.

```sql
CREATE TABLE inquiries (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_number   VARCHAR(40) UNIQUE NOT NULL,
                   -- Phase 2: server-generated, e.g. INQ-20260616-A3F9
                   -- Phase 1 (static site): client-generated timestamp+random suffix
  customer_id      UUID REFERENCES customers(id),
  status           VARCHAR(30) NOT NULL DEFAULT 'received',
                   -- received | under_review | rfq_sent | quotes_received
                   -- | quotation_ready | quoted | won | lost | cancelled
  application_type VARCHAR(100),   -- 'drone', 'robotics', 'agv', 'marine', etc.
  submitted_at     TIMESTAMPTZ NOT NULL,
                   -- locked at submission; never updated
  agim_owner       VARCHAR(100),
  priority         VARCHAR(20) DEFAULT 'standard',
                   -- standard | urgent | strategic
  internal_notes   TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Immutability enforcement (Phase 2)
-- No UPDATE permitted on submitted_at, inquiry_number, customer_id
-- Enforced at application layer; trigger can be added for additional protection
```

---

### `product_requests`

What the customer is actually asking for.

```sql
CREATE TABLE product_requests (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_id          UUID REFERENCES inquiries(id),
  customer_reference  VARCHAR(255),   -- e.g., '45300103-173Ah' as submitted
  quantity_per_year   INTEGER,
  target_price        DECIMAL(10, 4),
  target_price_unit   VARCHAR(20),    -- 'per_cell', 'per_Ah', 'per_kWh'
  dimension_flex      VARCHAR(20),    -- 'hard', 'small_flex', 'flexible'
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

### `technical_specs`

Detailed technical requirements linked to a product request.

```sql
CREATE TABLE technical_specs (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_request_id    UUID REFERENCES product_requests(id),
  nominal_voltage_v     DECIMAL(5, 3),
  chemistry             VARCHAR(20),
                        -- 'NMC', 'NCA', 'LFP', 'LTO', 'unsure', 'other'
  form_factor           VARCHAR(20),
                        -- 'likely_pouch', 'cylindrical', 'prismatic', 'blade',
                        -- 'confirmed_pouch', 'other', 'unknown'
                        -- NOTE: 'likely_pouch' is the correct default for
                        -- 38.5×300×103mm format until confirmed by datasheet
  capacity_ah           DECIMAL(8, 3),
  capacity_condition    VARCHAR(100),   -- e.g., '0.2C, 25°C'
  length_mm             DECIMAL(8, 2),
  width_mm              DECIMAL(8, 2),
  thickness_mm          DECIMAL(8, 2),
  discharge_c_cont      DECIMAL(5, 2),
  discharge_c_peak      DECIMAL(5, 2),
  charge_c_rate         DECIMAL(5, 2),
  cycle_life_target     INTEGER,
  temp_min_c            INTEGER,
  temp_max_c            INTEGER,
  certifications_req    JSONB,          -- e.g., ["UN38.3", "CE", "IEC62368"]
  tab_config            VARCHAR(100),
  additional_notes      TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

### `suppliers`

AGI&M's internal supplier database.

```sql
CREATE TABLE suppliers (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name        VARCHAR(255) NOT NULL,
  country             VARCHAR(100),
  city                VARCHAR(100),
  contact_name        VARCHAR(255),
  contact_email       VARCHAR(255),
  contact_phone       VARCHAR(50),
  specializations     JSONB,    -- e.g., ["pouch_NMC", "cylindrical_LFP"]
  tier                VARCHAR(20),
                      -- 'tier1', 'tier2', 'tier3', 'qualified', 'unqualified'
  audit_status        VARCHAR(20) DEFAULT 'not_audited',
                      -- 'audited', 'pending', 'not_audited'
  last_audit_date     DATE,
  relationship_notes  TEXT,
  active              BOOLEAN NOT NULL DEFAULT TRUE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

### `rfqs`

An RFQ is generated from an inquiry and distributed to suppliers.

```sql
CREATE TABLE rfqs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_number        VARCHAR(30) UNIQUE NOT NULL,  -- e.g., RFQ-20260616-0001
  inquiry_id        UUID REFERENCES inquiries(id),
  issued_at         TIMESTAMPTZ NOT NULL,
  deadline_at       TIMESTAMPTZ,
  rfq_document_url  VARCHAR(500),
  status            VARCHAR(20) NOT NULL DEFAULT 'draft',
                    -- 'draft', 'issued', 'closed'
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

### `rfq_recipients`

Tracks which suppliers received a given RFQ and whether they responded.

```sql
CREATE TABLE rfq_recipients (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id        UUID REFERENCES rfqs(id),
  supplier_id   UUID REFERENCES suppliers(id),
  sent_at       TIMESTAMPTZ,
  responded     BOOLEAN NOT NULL DEFAULT FALSE,
  responded_at  TIMESTAMPTZ
);
```

---

### `supplier_quotes`

Individual supplier responses to an RFQ.

```sql
CREATE TABLE supplier_quotes (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id                  UUID REFERENCES rfqs(id),
  supplier_id             UUID REFERENCES suppliers(id),
  inquiry_id              UUID REFERENCES inquiries(id),
  supplier_quote_ref      VARCHAR(100),   -- supplier's own quote number
  unit_price              DECIMAL(10, 4) NOT NULL,
  currency                CHAR(3) NOT NULL DEFAULT 'USD',
  incoterms               VARCHAR(20),    -- 'EXW', 'FOB', 'CIF', etc.
  port_of_departure       VARCHAR(100),
  moq                     INTEGER,
  sample_price            DECIMAL(10, 4),
  sample_lead_days        INTEGER,
  production_lead_days    INTEGER,
  certifications_avail    JSONB,
  quote_validity_days     INTEGER,
  capacity_confirmed_ah   DECIMAL(8, 3),
  chemistry_confirmed     VARCHAR(50),
  tech_notes              TEXT,
  received_at             TIMESTAMPTZ NOT NULL,
  entered_by              VARCHAR(100)    -- AGI&M staff member
);
```

---

### `comparison_results`

AGI&M's analysis output for a given inquiry.

```sql
CREATE TABLE comparison_results (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_id                UUID REFERENCES inquiries(id),
  generated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  generated_by              VARCHAR(100),
  recommended_supplier_id   UUID REFERENCES suppliers(id),
  recommendation_rationale  TEXT,
  comparison_data           JSONB,      -- full matrix snapshot at time of analysis
  agim_buy_price            DECIMAL(10, 4),
  agim_sell_price           DECIMAL(10, 4),
  margin_pct                DECIMAL(5, 2),
  status                    VARCHAR(20) NOT NULL DEFAULT 'draft'
                            -- 'draft', 'approved', 'superseded'
);
```

---

### `customer_quotations`

The customer-facing quotation generated by AGI&M.

```sql
CREATE TABLE customer_quotations (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_number    VARCHAR(30) UNIQUE NOT NULL,  -- e.g., QUO-20260616-0001
  inquiry_id          UUID REFERENCES inquiries(id),
  revision_number     INTEGER NOT NULL DEFAULT 1,
  issued_at           TIMESTAMPTZ NOT NULL,
  valid_until         DATE,
  unit_price          DECIMAL(10, 4),
  currency            CHAR(3) NOT NULL DEFAULT 'USD',
  lead_time_days      INTEGER,
  payment_terms       VARCHAR(300),
  incoterms           VARCHAR(20),
  quotation_doc_url   VARCHAR(500),
  status              VARCHAR(20) NOT NULL DEFAULT 'draft'
                      -- 'draft', 'sent', 'accepted', 'declined', 'expired', 'superseded'
);
```

---

### `revision_history`

Full audit trail for all commercial records.

```sql
CREATE TABLE revision_history (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type      VARCHAR(50) NOT NULL,  -- 'inquiry', 'quotation', 'rfq'
  entity_id        UUID NOT NULL,
  revision_number  INTEGER NOT NULL,
  changed_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  changed_by       VARCHAR(100),
  change_summary   TEXT,
  snapshot_data    JSONB NOT NULL,  -- complete state of the record at this revision
  reason           TEXT
);
```

---

## Design Notes

1. **UUIDs throughout** — no sequential integer PKs exposed externally; avoids enumeration attacks and supports future multi-tenant architecture
2. **JSONB for flexible arrays** — certifications, specializations, and comparison data stored as JSONB to allow flexibility without requiring schema migrations for each new certification type or spec field
3. **Immutability by convention** — `submitted_at` and `inquiry_number` are never updated after creation; enforced at application layer in Phase 2, with optional database trigger for enforcement
4. **`form_factor` uses `likely_pouch`** — the data model explicitly encodes uncertainty; a cell cannot be declared a pouch cell without datasheet confirmation
5. **Supplier identity isolated from RFQ** — the `rfq_recipients` join table means a supplier's identity is never embedded directly in the inquiry or technical spec records, supporting customer privacy

---

## Phase 1 Data Storage (Static Site)

Until the Phase 2 backend exists, submissions are stored as:

| Option | Mechanism | Tradeoffs |
|--------|-----------|-----------|
| Formspree | Form POST to Formspree endpoint | Free tier, email delivery, dashboard |
| Notion API | JavaScript POST to Notion database | Structured, queryable, requires API key in client (security risk) |
| Email only | `mailto:` fallback | No backend dependency, but unreliable and not structured |
| **Recommended** | **Formspree + AGI&M email notification** | Simple, reliable, structured enough for Phase 1 volume |

**Phase 1 immutability note:** True record immutability (INSERT-only, no UPDATE) requires a backend database. On a static site, the submission endpoint (Formspree) holds the canonical record. AGI&M must not modify received submissions and must treat the first-received record as authoritative.

---

*Document owner: AGI&M ASSETS INC.*
