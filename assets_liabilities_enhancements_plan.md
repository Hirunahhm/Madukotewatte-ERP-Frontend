# Assets and Liabilities Implementation Guide

This document provides explicit instructions for overhauling the existing "Cash and Assets" module into a comprehensive **Assets and Liabilities** suite. Claude must follow these requirements strictly, adhering to Feature-Sliced Design (FSD), Next.js 15, and the project's visual theme.

## 1. Core Architectural & Theme Rules

- **Feature-Sliced Design:** Keep the core feature folder named `src/features/assets/` to prevent breaking existing routes, but logically separate the new UI into `components/assets/` and `components/liabilities/`.
- **Theming & Dark Mode:** Ensure total alignment with `src/lib/theme.ts`.
  - Always use `dark:` Tailwind classes.
  - Use `chartColors.primary` (Green) for Assets/Credits and `chartColors.danger` or `warning` (Red/Amber) for Liabilities/Debts.
- **Sidebar Change:** Locate `src/components/layout/sidebar.tsx` and change the navigation label from "Cash and Assets" to **"Assets and Liabilities"**.

---

## 2. Global Navigation & Controls
At the very top of the page (`page.tsx` or main layout component):
1. **Global Timeframe Toggle:** Create a prominent pill/tab selector with options: **Monthly, Quarterly, Annually**. This state must be passed down and affect the data shown in all KPI cards.
2. **Sub-Nav Bar:** Below the timeframe toggle, implement the secondary navigation with three options:
   - **Assets** (Default)
   - **Liabilities**
   - **Stats** (When selected, just display an empty state or card saying "Coming Soon").

---

## 3. Assets Screen (`components/assets/`)

When the "Assets" tab is active, display the following:

### A. Asset KPIs & Balances
- **Top KPIs:** Build three metric cards that react to the Global Timeframe toggle: *Cash In Hand, Bank Balance, Pending Cash Flows*.
- **Individual Bank Balances:** Add a secondary visually distinct section (or row of cards) explicitly showing the current balance of: *BOC, Seylan, and Peoples* bank accounts.
- **Outflows Card:** Add a summary card specifically detailing "Recent Cash Outflows".

### B. Charts & Data Entry
- **Liquidity Chart:** Re-purpose the existing chart to show liquidity history. Must include localized toggles for **Week, Month, Year** views.
- **Cash Withdrawal Record:** Create a data entry form containing:
  - Date (Date Picker)
  - Amount (Number input)
  - Asset Type (Dropdown: *BOC, Seylan, Peoples, Cash In Hand*)
  - "Record Withdrawal" Button.

### C. Bank Transactions Table
- **Requirement:** A dedicated table to monitor all banking activity.
- **Filters Required:** 
  1. Select Bank (Dropdown)
  2. Select Type (Credit vs Debit)
- **Columns:** *Date, Last Amount, Amount, New Amount, Type (Credit/Debit)*. Use Tailwind colors to make Credits green and Debits red.

---

## 4. Liabilities Screen (`components/liabilities/`)

When the "Liabilities" tab is active, display the following:

### A. Liability KPIs
- **Top KPIs:** Build three metric cards representing Current Outstandings (reacting to the Global Timeframe toggle): *Current Loans, Peoples Credit Card, Sampath Credit Card*.
- **Borrows Card:** Create an informational card summarizing "Borrows and Credit Growths" metrics.

### B. Charts & Data Entry
- **Credit Growth Chart:** Add a Line or Area chart visualizing total credit growth. Include localized toggles for **Week, Month, Year** views.
- **Standard Liability Form:** An entry row/form for recording new debts:
  - *Date, Type, Amount, Interest Rate, Principal Amount, Transfer Type* -> "Record" button.
- **Recurring Payments Form:** A specialized, simplified entry row specifically for logging recurring credit card payments (e.g., *Date, Card, Amount*).

### C. Credit Card Transactions Table
- **Requirement:** A table mirroring the bank table, but strictly for credit cards.
- **Filters Required:** 
  1. Select Credit Card (Sampath, Peoples)
  2. Date Range Picker (shadcn specific component)
- **Data:** Show a standard ledger view of Credits and Debits for the selected card.

---

### Final Code Quality Check for Claude
Before finalizing changes, verify:
1. Does the Global Timeframe (Monthly/Quarterly/Annually) correctly sit *above* the Sub-Nav and affect the KPIs beneath it?
2. Are the credit card limits and warnings correctly using `chartColors.danger` or `warning` from `theme.ts`?
3. Has the sidebar label been successfully renamed to "Assets and Liabilities"?
