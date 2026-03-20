# Latex Production Implementation Guide 

This guide outlines the exact requirements for enhancing the **Latex Production** module. Claude must follow these instructions strictly, adhering to the project's Feature-Sliced Design (FSD), Next.js 15 architecture, and the established visual theme.

## 1. Core Architectural Rules (MUST READ)

- **Feature-Sliced Design:** All work must happen within `src/features/production/`. Do not pollute `src/app/` or `src/components/` unless adding a generic shadcn UI primitive.
- **Component Isolation:** Create specific files in `src/features/production/components/` for new forms, dialogs, and widgets. 
- **Theming & Dark Mode:** The project supports a seamless Light/Dark mode.
  - Rely on `src/lib/theme.ts` for chart colors (e.g., `chartColors.emerald`).
  - Always use `dark:` Tailwind classes (e.g., `bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`).
  - Do strictly avoid hardcoded `#fff` or `#000` text/backgrounds.

---

## 2. Feature Implementation Steps

### A. Sub-Navigation (Top Bar)
- **Requirement:** Remove the existing generic search bar at the very top of the production page.
- **Action:** Replace it with a sleek sub-navigation bar (Tabs or Pill buttons) containing three links/views:
    1. Latex Production
    2. Ammonia Tracking
    3. Rubber Solid Collection
- **Hint:** Use localized `useState` to toggle the active view, or use standard anchor tags if they will eventually be separate routes.

### B. Latex Data Entry & Historical View
- **Requirement:** Upgrade the `direct-data-entry.tsx` component.
- **Action 1 (Form):** Convert plain text inputs to proper fields. 
  - Employee Name (Dropdown using shadcn `Select`)
  - Date (Date Picker)
  - Litres (Number input)
  - Mass (Number input)
  - Ammonia (Number input)
  - Metrolac Reading (Number input)
- **Action 2 (History):** Add a tertiary button: `View Past Data`.
  - Clicking this must open a shadcn `Dialog` or `Sheet` containing a `Table`.
  - The table must display mock historical rows mirroring the fields above.
  - Include basic pagination UI (Next/Prev buttons).

### C. Separate Metrolac Reading Entry
- **Requirement:** Create a dedicated entry zone specifically for raw Metrolac tests, separate from the primary latex data entry.
- **Action:** Create `metrolac-entry-form.tsx`.
  - Fields required: Metrolac Reading, Date, Recorded Temperature.
  - Layout it compactly, perhaps alongside or below the main data entry card.

### D. Advanced Load Tracker
- **Requirement:** The existing load tracker must become interactive.
- **Action 1 (Create):** Add a `Create New Load` button to the `load-tracker.tsx` header.
- **Action 2 (Dialog):** When clicked, open a shadcn `Dialog` (`load-dialog.tsx`) with the following fields:
  - Start Date
  - Load Type
  - Load ID
  - Status (Dropdown: *In Progress*, *Completed*, *Scheduled*)
- **Action 3 (Edit):** Existing load rows in the tracker should be clickable. Clicking a row opens the exact same `Dialog` but populated with the row's data, allowing the user to change the Status dropdown.

### E. Graph & KPI Enhancements
- **Requirement:** Adjust the volume graph and add storage capacity metrics.
- **Action 1 (Graph):** In `volume-trends-chart.tsx`, force the Recharts Y-Axis domain strictly to `[0, 300]`. Ensure the grid lines use `var(--chart-grid)` for dark mode support.
- **Action 2 (KPIs):** Create `stock-capacity-kpis.tsx` to display:
  - **Current Latex Stock** (e.g., heavily stylized visual metric).
  - **Current Latex Capacity** (e.g., a progress bar showing stock vs total silo capacity).

### F. Interactive Chronology Calendar
- **Requirement:** The calendar (`production-chronology.tsx`) needs dense data visualization.
- **Action 1 (Legend Updates):** Ensure the legend clearly delineates: Public Holidays, Leave Days, Rain Days, and No Tapping Days. Update the mock square colors accordingly.
- **Action 2 (Hover/Click Data):** When a specific day is clicked or hovered (use shadcn `Tooltip` or `HoverCard`), display a breakdown of tapper collections (e.g., *Siti: 12L, Arjun: 14L*). Add a small indicator (like a colored dot) to days that have collection data.
- **Action 3 (Controls):** Add dropdowns to the calendar header to allow changing the **Year** and **Month** to view historical layouts.
- **Action 4 (View Toggle):** Add a toggle switch to flip the calendar between a **30-Day Month View** and a **7-Day Week View**.

---

### Final Code Quality Check for Claude
Before finalizing changes, verify:
1. Are there any hydration errors caused by unclosed tags?
2. Does every new component look native in both Light Mode AND Dark Mode?
3. Have all new components been properly placed inside `src/features/production/components/`?
