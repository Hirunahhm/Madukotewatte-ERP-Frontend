# Employee Payment Screen Implementation Guide

This guide details the explicit requirements for building the **Payment** sub-screen within the Employee Management module. Claude must follow these instructions strictly, adhering to the project's Feature-Sliced Design (FSD), Next.js 15 architecture, and the established visual theme.

## 1. Core Architectural & Theme Rules (MUST READ)

- **Feature-Sliced Design:** All components for this sub-screen must be organized into a dedicated sub-folder:
  - `src/features/employees/components/payment/`
- **Theming & Dark Mode:** Ensure total alignment with [src/lib/theme.ts](file:///e:/Porjects/Madukotawatte%20ERP/dashboard-frontend/src/lib/theme.ts).
  - Always use `dark:` Tailwind classes for seamless toggling (e.g., `bg-white dark:bg-gray-950`).
  - Use semantic colors correctly (e.g., green/emerald for "Paid Amount", amber/warning for "Active Loans").
  - Do strictly avoid hardcoded `#fff` or `#000` text/backgrounds.

---

## 2. Feature Implementation Steps

When the "Payment" tab (from Phase 10) is active, display the following components:

### A. Financial KPIs
- **Component:** `src/features/employees/components/payment/payment-kpis.tsx`
- **Requirement:** Display exactly four prominent metric cards for the current month:
  1. Total Salary Cost
  2. To Be Paid Amount
  3. Paid Amount
  4. Total Loan Amount Given (e.g., "Active Employee Loans")

### B. Salary Trend Chart
- **Component:** `src/features/employees/components/payment/salary-chart.tsx`
- **Requirement:** Add an Area or Bar chart showing total employee salaries over time.
- **Interactivity:** Include localized state (e.g., a dropdown or button group) that toggles the chart view between **Week**, **Month**, and **Year** timeframes. Ensure grid lines use `var(--chart-grid)`.

### C. Record Labour System
- **Requirement:** A dedicated system to log non-tapping labour work.
- **Action 1:** Add a standout "Record Labour" button. Clicking it opens a shadcn `Dialog`.
- **Action 2 (Dialog Fields):** 
  - Employee Name (shadcn `Select` dropdown)
  - Date (Date Picker)
  - Amount (Number input)
  - Worked Hours (Number input)
  - Type of Work (Text or Select)
  - Work Description (Textarea)
- **Action 3 (Payment Workflow):** The dialog must have two execution buttons: **"Add Record"** (queues it as unpaid) and **"Paid"**.
  - If the user clicks "Paid", dynamically reveal a **Payment Type** dropdown before final submission.
  - Payment Type Options: *Bank Transfer - BOC*, *Bank Transfer - Peoples*, *Bank Transfer - Seylan*, *Cash*.

### D. Loan Management System
- **Requirement:** A section dedicated to issuing and tracking employee advances/loans.
- **Action 1 (Give Loan Form):** Create a clean card or dialog form (`give-loan-form.tsx`) with:
  - Select Employee Name
  - Date
  - Loan Amount
  - Interest Rate
  - Installment Amount
- **Action 2 (Active Loans View):** Add a "View Current Employee Loans" button. Clicking it opens a `Dialog` or `Sheet` containing a table of dynamic mock data.
  - Columns: *Employee Name, Date, Loan Amount, Installment, Current Balance, Interest Rate, Status (Active / Not Active)*.

### E. Current Month Salary Table
- **Component:** `src/features/employees/components/payment/salary-table.tsx`
- **Requirement:** A comprehensive table summarizing the current month's payroll.
- **Columns:** *Name, Role, Total Salary, To Be Paid*.
- **Hover Interaction (Crucial):** Implement a shadcn `Tooltip` wrapped around the "Total Salary" value. When a user hovers over an employee's total salary, the tooltip must display the breakdown:
  - *Latex Salary: $X.XX*
  - *Labour Work Salary: $Y.YY*

---

### Final Code Quality Check for Claude
Before finalizing changes, verify:
1. Is the conditional "Payment Type" dropdown functioning properly in the Record Labour dialog?
2. Does the Salary Hover Tooltip render cleanly in both Light and Dark modes without Z-index clipping?
3. Are all new components cleanly isolated inside `src/features/employees/components/payment/`?
