# Invoice Generator — Product Spec (v1)

A Progressive Web Application for creating and managing invoices, clients, and organizations.

**PWA install behavior (in scope for v1):**
- App is installable to the home screen / app drawer via a `manifest.json` (name, icons, theme colors) and a basic service worker (no offline data sync required — just enough to satisfy installability).
- On Android/Chrome, the browser's native "Add to Home Screen" prompt is used, optionally backed by a custom in-app "Install App" button (via the `beforeinstallprompt` event).
- On iOS/Safari, no automatic prompt is available — include a short in-app hint directing users to Share → "Add to Home Screen."
- Full offline usage (viewing/creating invoices without a connection, background sync) is **not** in scope for v1 — see Later Discussion.

---

## 0. Global Navigation

- A **bottom navigation bar**, present across the app (except perhaps auth screens), with 2 options:
  - **Invoices** → Invoice List page
  - **Clients** → Client List page
- The active tab is highlighted based on the current route (any invoice-related route — list,
  details, form — keeps "Invoices" highlighted; same logic for Clients).
- The Settings/Organization entry point (mentioned in the Organization module) stays a separate
  icon/button on each page — it is not part of the bottom nav's 2 options.

---

## 1. Invoice Module

### 1a. Invoice List Page

**Layout**
- Page title "Invoices" with an **Add Invoice** button.
- A custom calendar component — defaults to the current month's data.
- Below the calendar, 3 summary cards:
  - Total invoice count
  - Paid invoice count
  - Unpaid invoice count
- A tabs section: **All** (default) / **Paid** / **Unpaid**.
- Below the tabs, a list of Invoice Cards showing:
  - Invoice number
  - Invoice generated date
  - Invoice amount
  - Status chip (Draft / Active / Partially Paid / Paid)
  - Client name & GST number (if GST invoice)
  - GST flag (indicates whether the invoice includes GST)
- Custom pagination: current page number, next/previous, first/last.
- Empty state screen when no data is available.

**Behavior / Flow**
- Switching tabs (All/Paid/Unpaid) **does not** change the calendar's selected month/date range — it only resets pagination to page 1 and re-filters the existing date range by status.
- No search bar on this page — finding a specific invoice by number isn't a realistic user flow. To find a client's invoices, the user navigates to that Client's Details page instead.
- No sorting for v1 (default order — likely newest first).
- Clicking a card navigates to the Invoice Details page.

---

### 1b. Invoice Details Page

**Layout**
- Page title "Invoice Details", **Download** button, and a dropdown with: Mark as Paid, Delete, Copy, Edit.
- Invoice details card:
  - Invoice number
  - Invoice amount
  - Invoice status
  - Created at date
  - Client name
  - GST number
- Items table:
  - Item name
  - HSN/SAC code
  - Quantity
  - GST (if applicable)
  - Rate
  - Total per item
- Invoice subtotal
- Invoice total

**Behavior / Flow**
- No due date, no payment-details section, no notes field, no audit trail — out of scope for v1.
- **Delete** is disabled/hidden for invoices in Paid or Partially Paid status (see state machine below).
- **Edit** is disabled for invoices that are soft-deleted and in Draft status (see below) — user can only Copy such an invoice.

---

### 1c. Invoice Form (Create / Copy / Edit)

**Layout**
- Title: "New Invoice" (for Add New and Copy), or "Edit Invoice" (for Edit).
- Invoice number field (editable).
- Client search dropdown:
  - Typing triggers an API search.
  - If a matching client is found, selecting it auto-fills name, address, GST number, state, contact details.
  - If no match is found, an **Add Client** option appears in the dropdown → navigates to Add Client page → on save, returns to the invoice form with the new client's data pre-filled.
- GST invoice toggle/flag.
- Items table (empty state by default):
  - Item name
  - HSN/SAC code
  - Quantity
  - GST flag (if applicable)
  - Rate
  - Total per item (auto-calculated)
  - Delete item button
- **Add Item** button below the table.
- GST split (CGST + SGST vs IGST) — calculated automatically based on whether the client's state matches the organization's state (see GST Logic below).
- Subtotal
- Total
- Signature selector
- Two save actions: **Save as Draft** and **Create Invoice** (moves it to Active).
- No discount field (neither per-item nor invoice-level) in v1.

**Invoice numbering**
- On **Add New** or **Copy**, the invoice number auto-increments from the organization's current series.
- On **Edit**, the invoice number is fixed and does **not** re-increment, regardless of other changes made.

**GST Logic**
- Requires a `state` and `country` field on both Organization and Client.
- If Client's state == Organization's state → split GST into CGST + SGST.
- If Client's state ≠ Organization's state (same country) → apply IGST.
- Cross-country invoicing is not handled in v1 (flagged for later — would need export-invoice rules).

**Invoice Status State Machine**
- **Draft** → editable, can be hard-deleted, can be moved to Active.
- **Active (Unpaid)** → editable, soft-delete only, can move to Partially Paid or Paid.
- **Partially Paid** → soft-delete only (no hard delete once any payment has been recorded), can move to Paid.
- **Paid** → cannot be deleted at all (soft or hard); read-only.
- Any invoice (in any status) can be **Copied** — copying always creates a brand-new Draft invoice with a new invoice number, regardless of the source invoice's current status.
- Soft-deleted **Draft** invoices cannot be edited further — the only available action is to create a Copy.

> ⚠️ **Open item:** "Partially Paid" as a status implies some amount has been received, but the spec currently has no payment-details/amount-tracking field. At minimum, an `amount_paid` field is likely needed on the Invoice to determine and display Partially Paid vs Paid — even without a full payment history/notes log. Recommend deciding this before building.

---

## 2. Client Module

*(Previously called "Vendor" — renamed here since this party is being invoiced, not paid by the organization. If "Vendor" is intentional in your business context, keep the original term.)*

### 2a. Client List Page
- Page title "Clients".
- Client cards showing: Name, GST number (if present), Address, Contact details, Email, Total pending invoice count.
- Cards are clickable → navigates to Client Details page.
- Pagination.

### 2b. Client Details Page
- Title with Delete and Edit buttons.
- Client details card: Name, GST no., Address, Contact details, Email, Total pending invoice count.
- Tabs: All / Paid / Unpaid, each showing counts.
- A custom calendar beside the tabs (scoped to this client's invoices).
- Invoice cards (same format as Invoice List page).
- Pagination for this invoice section.

### 2c. Add / Edit Client
- Fields: Name, GST number (if present), Address, State, Country, Contact details, Email.
- More fields to be added later as needed.

**Behavior / Flow**
- **Validation:** GST number format validation, plus duplicate detection on GST number and client name (scoped per-organization, since multi-org is supported — see Org Module).
- **Delete:**
  - If the client has zero invoices (including zero soft-deleted invoices) → permanently deleted.
  - If the client has any invoice history (active or soft-deleted) → soft-deleted only. A soft-deleted client cannot have new invoices created against them, but their historical invoices remain visible/intact.

---

## 3. Organization Module

- Every page has a Settings button leading to the Organization page.
- Edit Organization form fields:
  - Org name
  - Address, State, Country
  - GST number (if present)
  - Org logo
  - Org contact details
  - Signature image (no encryption required for v1)
  - Bank details (parked — collected but not used/displayed in invoice flow yet)
  - Invoice number series/prefix (resets or continues per new year — TBD)
  - More fields to be added later as needed.

**Multi-Organization Support**
- A user can belong to and manage multiple organizations.
- Clients and Invoices are scoped per-organization (not shared across orgs a user belongs to).
- Invoice numbering series is independent per organization.
- GST split logic uses the *currently active* organization's state as the reference point.
- All list pages, dashboards, and calendars operate within the context of the currently selected organization (implies an org switcher in the UI).
- Roles/permissions across multiple users on one org are not yet defined — flagged for later.

---

## 4. Later Discussion / Deferred Items

These are acknowledged but intentionally out of scope for the first build:

**Auth**
- Sign up via Google, and via email + password.
- Forgot password flow.
- Email verification.
- Account linking when the same email is used for both Google sign-up and email/password sign-up.
- Session handling / token refresh.

**PWA-specific**
- Offline behavior — viewing/creating invoices offline with sync-on-reconnect (typically the core reason to build as a PWA; worth revisiting if this stays deferred long-term).
- Push notifications (e.g., payment reminders).

**Other future considerations**
- Export invoices/clients to CSV or Excel.
- Email/share invoice directly to client (beyond just download).
- Analytics/dashboard view (revenue over time, top clients).
- Confirmation dialogs for all delete actions.
- Currency support — INR only for v1, vs. configurable per organization later (relevant once multi-country orgs are considered).

---
