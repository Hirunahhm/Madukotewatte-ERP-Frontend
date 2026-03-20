# Financial Tracking Implementation Guide

This document provides explicit instructions for overhauling the **Financial Tracking** module (currently the "Rubber Sales" page). Claude must follow these requirements strictly, adhering to Feature-Sliced Design (FSD), Next.js 15, and the project's visual theme.

## 1. Core Architectural & Theme Rules

- **Feature-Sliced Design:** All components must live in `src/features/financials/components/`. Organize them into two new sub-folders: `sales/` and `expenses/`.
- **Theming & Dark Mode:** Ensure total alignment with `src/lib/theme.ts`.
  - Always use `dark:` Tailwind classes for seamless toggling (e.g., `bg-white dark:bg-gray-950`).
  - Use semantic `chartColors` carefully. Sales should lean towards `brandColors` (Green/Emerald), while Expenses can utilize `warning` or `neutral` palettes.

---

## 2. Global Navigation
- **Sub-Nav Bar:** At the top of the financials page, implement a Tab or Pill navigation menu with three options:
  1. **Sales Tracking** (Default)
  2. **Expenses Tracking**
  3. **Stats** (When selected, just display an empty state or card saying "Coming Soon").

---

## 3. Sales Tracking Screen (`components/sales/`)

This screen re-purposes the existing Rubber Sales layout but significantly expands its scope.

### A. Sales KPIs & UI Cleanup
- **Remove:** Delete the current "Export Ledger" and "Add Transaction" buttons at the top of the page.
- **KPIs:** Build three new KPI cards: *Total Sales, Payments Received, To Be Received*.
- **Revenue Distribution Card:** Take the existing "Expense tracking" pie/donut card, rename it to **Sales Tracking** (or Revenue Distribution), and update the legend to show: *Latex Sales, Rubber Solid Sales, Manioc Sales, Banana Sales, Coconut Sales*.

### B. "Record a Sale" Multi-Form
- **Requirement:** A complex data entry system for recording diverse estate yields.
- **Action 1 (Selector):** Create a horizontal button group (or tabs) to select the sale category: *Latex, Rubber Solid, Manioc, Coconut, Banana*.
- **Action 2 (Dynamic Fields):**
  - **If Latex is selected:** Show *Load ID, Date, Litres, Mass, Metrolac Reading, Total Amount, Unit Price*.
  - **If Rubber Solid is selected:** Show *Load ID, Mass, Unit Price, Date, Amount*.
- **Action 3 (Payment Workflow):** The form must have two submission buttons:
  - **"Record Sale"** -> Saves the sale as an unpaid receivable.
  - **"Payment Received"** -> Clicking this dynamically reveals three final fields before submission: *Date, Amount, Payment Type (Dropdown: Cash, Bank Transfer)*.

### C. Sales Table
- **Requirement:** Update the existing table to display these diverse sales records.
- **Action:** In the "Actions" column, add a **"Mark Payment"** button.
- **Dialog:** When "Mark Payment" is clicked, open a shadcn `Dialog` with the payment form (*Date, Amount, Payment Type*) to settle outstanding receivables.

---

## 4. Expense Tracking Screen (`components/expenses/`)

When the "Expenses Tracking" tab is active, display the following components:

### A. Expense KPIs & Chart
- **KPIs:** Implement three metric cards: *Total Expenses, Paid Amount, To Be Paid Amount*.
- **Expense Chart:** Add a Bar or Area chart visualizing total expenses. Include a timeframe toggle for **Week, Month, Year**.
- **Distribution Card:** Create an expense breakdown card (similar to the sales one) showing different types of estate expenses (e.g., Fertilizer, Maintenance, Utilities).

### B. Record Expense System
- **Action 1 (Form):** Create a dedicated form with: *Date, Type (Select Dropdown), Description*.
- **Action 2 (Workflow):** Similar to the sales form, provide two buttons:
  - **"Record Expense"** -> Logs it as an unpaid payable.
  - **"Paid"** -> Clicking this reveals the final fields: *Date, Expense Amount, Transaction Type (Dropdown: Bank Transfers, Credit Card, Cash)*.

### C. Expenses Table
- **Requirement:** A table mirroring the sales table but dedicated strictly to expenses.
- **Action:** Add a **"Mark Payment"** button in the Action column that opens the payment dialog to clear pending payables.

---

### Final Code Quality Check for Claude
Before finalizing changes, verify:
1. Does the "Record a Sale" form dynamically switch its input fields based on whether Latex or Rubber Solid is selected?
2. Are the "Payment Workflow" dropdowns correctly hidden until the user explicitly clicks the "Paid" or "Payment Received" buttons?
3. Have all old, hardcoded "Rubber Sales" elements been successfully purged or migrated to `src/features/financials/`?
