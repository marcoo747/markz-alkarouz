# Prompt for Antigravity — Rental Returns Reconciliation Feature

## Context
This is an e-commerce rental website. Frontend: React + Vite. Backend: Laravel.
Repo: https://github.com/marcoo747/markz-alkarouz

Currently, when a customer's rented items are due back, the admin just clicks a single
"Done" button and the whole rental request status flips to done. This is too coarse —
it doesn't account for partial returns, missing items, or damaged items.

## Your task — DO NOT WRITE CODE YET
1. Explore the repository structure first. Specifically locate:
   - The model(s)/migration(s) representing a rental order and its line items
     (the individual products within a rental order, with quantities)
   - The current status field/enum used for rental order state
   - The admin controller/route/page currently handling marking a rental as "Done"
   - The relevant frontend admin pages/components for managing rentals
2. Based on what you find, write out a full implementation plan (data model changes,
   migrations, API endpoints, frontend components/pages, validation rules) following
   the functional requirements below.
3. Stop and present that plan to me. Do not write or modify any code until I explicitly
   approve the plan.
4. After I approve, implement it in clear incremental stages (e.g. migrations first,
   then backend endpoints + validation, then frontend), so I can review each stage.

If anything in the existing codebase conflicts with the requirements below (e.g. naming,
existing relationships, existing status enum usage elsewhere in the app), flag it in your
plan instead of guessing.

## Functional Requirements

### Single unified page
There is ONE page for reconciling returns — not separate "Missing" and "Damaged" pages.
All rental line items needing attention (and already-resolved ones) live here, filterable
by status (tabs or a filter dropdown: All / Pending / Returned / Missing / Damaged).

### Per-item return counter
Each rental line item shows a counter UI: `quantity_returned / quantity_rented`
(e.g. `3/4`). Admin can increment/decrement this (e.g. stepper or input), capped between
0 and `quantity_rented`.

### Comment + classification logic (this is the core behavior)
A message/comment icon on each item opens a modal/popover:

- **If `quantity_returned === quantity_rented` (fully returned):**
  - No classification needed.
  - Comment box is shown but OPTIONAL.

- **If `quantity_returned < quantity_rented` (partial or zero returned):**
  - The modal shows two selectable options at the top: **"Missing"** or **"Damaged"**
    (single choice — radio buttons or a toggle, not a checkbox/multi-select).
  - A comment textbox appears below the choice and is REQUIRED before saving.
  - This classification + comment applies to the entire remaining (un-returned) quantity
    of that line item — the system does not split the remaining quantity into separate
    missing vs. damaged sub-counts. (Known limitation — acceptable for v1.)

### Computed status (do not store status as a manually-set enum)
Status should be derived, not stored as a static field that can drift out of sync:
- `quantity_returned === quantity_rented` → **Returned**
- `quantity_returned < quantity_rented` AND classified as Missing → **Missing**
- `quantity_returned < quantity_rented` AND classified as Damaged → **Damaged**
- `quantity_returned < quantity_rented` AND NOT YET classified → **Pending** (needs admin action)

### Audit log — full history, not overwritten
Every time an admin logs a return action or sets/updates a classification + comment,
create a new log entry (admin id, timestamp, quantity_returned at that point,
classification if set, comment). The comment modal should show the FULL history of
log entries for that item, not just the latest one, with an input to add a new entry.

### Validation (enforce server-side, not just frontend)
- Comment is required when saving a classification (Missing/Damaged) on an item with
  `quantity_returned < quantity_rented`.
- Comment is optional when `quantity_returned === quantity_rented`.
- `quantity_returned` can never exceed `quantity_rented`.

### Inventory sync — missing/damaged items affect total stock
The product has a total stock quantity (e.g. 5 units of a product exist in inventory).
When a unit is classified as **Missing** or **Damaged** (i.e. it's the remaining
un-returned quantity on a line item), that quantity must be automatically deducted from
the product's available stock — because that unit is effectively unusable/unavailable
until resolved.

Example: Product has 5 total units. A customer rents 3. 2 come back fine, 1 is logged as
missing. The product's available stock should now show **4**, not 5 — because that 1
missing unit is gone from the usable pool until recovered.

- On the unified Missing/Damaged page, each item has a **"Return"** button.
- Clicking "Return" means the admin physically recovered or resolved that unit (customer
  found it / brought it back late / item got repaired). This should:
  1. Increment that line item's `quantity_returned` by the recovered amount (so
     `remaining` drops, removing it from the Missing/Damaged view once it hits 0).
  2. Add that quantity back to the product's available stock (back to 5 in the example).
  3. Create a new audit log entry (type: `recovered`) recording who did it and when.
- This requires the Product model to have a stock field, and the "available stock"
  shown anywhere in the storefront/admin must subtract currently-outstanding
  missing/damaged quantities across all rental items referencing that product — not
  just the raw stock column. Flag in your plan whether the existing Product model
  already has a stock/quantity field, and how storefront availability is currently
  calculated, since this logic needs to plug into that correctly without breaking it.

## Output format for the plan
Please structure your plan as:
1. Data model changes (migrations, with field names and types)
2. API endpoints (method, route, request body, response shape)
3. Frontend components/pages affected (what's new, what's modified)
4. Anything ambiguous or conflicting with the existing codebase that you need me to
   decide on before you proceed

Wait for my explicit "approved" before writing any code.
