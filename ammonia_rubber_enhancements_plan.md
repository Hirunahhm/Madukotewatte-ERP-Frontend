# Ammonia & Rubber Solids Implementation Guide

This guide outlines the explicit requirements for building out the **Ammonia Tracking** and **Rubber Solid Collection** sub-screens within the Latex Production module. Claude must follow these instructions strictly, adhering to the project's Feature-Sliced Design (FSD), Next.js 15 architecture, and the established visual theme.

## 1. Core Architectural & Theme Rules (MUST READ)

- **Feature-Sliced Design:** All components for these two screens must be organized into sub-folders within the production feature:
  - `src/features/production/components/ammonia/`
  - `src/features/production/components/rubber/`
- **Theming & Dark Mode:** The project supports seamless Light/Dark modes.
  - Rely on [src/lib/theme.ts](file:///e:/Porjects/Madukotawatte%20ERP/dashboard-frontend/src/lib/theme.ts) for chart colors (e.g., use `chartColors.cyan` for Ammonia and `chartColors.amber` for Rubber Solids to distinguish them from Latex).
  - Always use `dark:` Tailwind classes (e.g., `bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800`).
  - Recharts grids and axes must use `var(--chart-grid)` and `var(--chart-axis)` respectively.

---

## 2. Ammonia Tracking Screen Features

When the "Ammonia Tracking" tab/navigation is active, display the following components:

### A. Ammonia KPIs & Editable Ratio
- **Component:** `src/features/production/components/ammonia/ammonia-kpis.tsx`
- **Requirement 1 (Stock & Capacity):** Display the current Ammonia Stock (e.g., 200L) and Total Capacity (e.g., 1000L), similar to the latex UI.
- **Requirement 2 (Interactive Mix Ratio):** Display the current mixing ratio (default `25:1`). 
  - This ratio **must be editable** inline (e.g., an `Input` field or a clickable number that turns into an input).
  - Add a dynamic metric next to it that calculates: **"Max Tappable Latex Capacity"**. (Formula: `Ammonia Stock * Ratio`). Update this value instantly if the user changes the ratio.

### B. Ammonia Usage Chart
- **Component:** `src/features/production/components/ammonia/ammonia-usage-chart.tsx`
- **Requirement:** Add an Area or Bar chart showing daily ammonia usage.
- **Constraint:** Force the Recharts Y-Axis domain strictly to `[0, 100]`.

### C. Refill Entry & Historical Records
- **Data Entry Component:** `src/features/production/components/ammonia/ammonia-data-entry.tsx`
  - Fields: Date Picker, Type (Locked/Auto-selected to "Refill"), Amount in Litres (Number input).
- **Records Component:** `src/features/production/components/ammonia/ammonia-past-records.tsx`
  - Add a "View Past Records" table.
  - Include two filters at the top: **Filter by Date** (Date picker) and **Filter by Type** (shadcn `Select` dropdown - e.g., Refill vs Usage).

---

## 3. Rubber Solid Collection Screen Features

When the "Rubber Solid Collection" tab/navigation is active, display the following components:

### A. Rubber Solid KPIs
- **Component:** `src/features/production/components/rubber/rubber-kpis.tsx`
- **Requirement:** Display current stock specifically in **kg**.
- **Requirement:** Display the current Unit Price for Rubber Solids (e.g., `$0.85 / kg`).

### B. Collection Chart
- **Component:** `src/features/production/components/rubber/rubber-collection-chart.tsx`
- **Requirement:** Add an Area or Bar chart showing daily collection of solid scraps.
- **Constraint:** Force the Recharts Y-Axis domain strictly to `[0, 10]` (since scrap weights per day are much lower than liquid latex).

### C. Dedicated Solid Load Tracker
- **Component:** `src/features/production/components/rubber/rubber-load-tracker.tsx`
- **Requirement:** Implement a load tracker specifically for solid batches.
- **Action:** Include a `New Load` button that opens a shadcn `Dialog` to create a dispatch load. (Status options: *Sorting, Baled, Dispatched*).

### D. Scrap Data Entry & Historical Records
- **Data Entry Component:** `src/features/production/components/rubber/rubber-data-entry.tsx`
  - Fields: Date Picker, Mass (in kg - Number input).
- **Records Component:** `src/features/production/components/rubber/rubber-past-records.tsx`
  - Add a "View Past Records" table.
  - Include a single filter at the top: **Filter by Date** (Date picker).

---

### Final Code Quality Check for Claude
Before finalizing changes, verify:
1. Is the `25:1` ratio editable, and does it auto-calculate the total tappable capacity?
2. Are the Y-axes strictly bound to `0-100` and `0-10` respectively?
3. Do all components transition flawlessly when toggling the Dark Mode switch?
