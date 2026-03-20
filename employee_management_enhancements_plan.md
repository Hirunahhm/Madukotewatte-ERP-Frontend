# Employee Management Upgrade Guide

This guide details the exact requirements for revamping the **Employee Management** screen. Claude must follow these instructions strictly, adhering to the project's Feature-Sliced Design (FSD), Next.js 15 architecture, and the established visual theme.

## 1. Core Architectural & Theme Rules (MUST READ)

- **Feature-Sliced Design:** All work must happen within `src/features/employees/components/`. Modify existing files (like `employee-table.tsx` or `employee-header.tsx`) and add new files alongside them.
- **Theming & Dark Mode:** Ensure total alignment with `src/lib/theme.ts`.
  - Always use `dark:` Tailwind classes for seamless toggling (e.g., `bg-white dark:bg-gray-900`).
  - Use `chartPalette` for multi-colored chart elements.
  - Never use hardcoded white (`#fff`) or black (`#000`).

---

## 2. Feature Implementation Steps

### A. View Controls & KPI Sub-Navigation
- **Sub-Navigation Addition:** Create a sub-navigation bar (Tabs or Pills) beneath the page header with two views:
  1. **Attendance and Labour** (The default page content).
  2. **Payment**.
- **Component Deletion:** Locate and permanently remove any toggle or component labeled "view stats for monthly annual life time". Keep the individual "Top Performers" employee cards intact.

### B. "Record No Work" Action Card
- **Requirement:** Find the KPI card currently displaying "Total Estate Yield" and completely replace it with a **"Record No Work"** action card.
- **Action:** This card should contain actionable chips or buttons for estate-wide halting of work.
- **Data Points:** Give the user these exact choices: *Rain, Dry season, Religious Celebration, Funeral, All Sick, Government Holiday, Public Holiday.*
- **Coloring:** Style this card using a neutral or muted alert color (e.g., based on `chartColors.neutral` or a secondary gray/amber) so that it looks like an administrative action, not a critical system error (`danger`).

### C. Dynamic Productivity Chart
- **Component:** Upgrading `productivity-chart.tsx`.
- **Action 1 (Y-Axis):** Ensure the Y-Axis domain spans strictly from `[0, 2000]`.
- **Action 2 (Dynamic X-Axis):** Implement dropdown controls (or generic state) that alter the chart's time scale:
  - If a **Month** is selected -> Show trees tapped *per week*.
  - If a **Year** is selected -> Show trees tapped *per month*.
  - By default, show trees tapped *per day* for the current week.
- **Action 3 (Colors):** Use a `BarChart` where every stacked or grouped bar belonging to a specific employee uses a completely different color. Iterate through the `chartPalette` array defined in `theme.ts` to assign these dynamically.

### D. Mark Attendance Dialog & Table Updates
- **Component:** Upgrading `employee-table.tsx`.
- **Action 1 (Cleanup):** Delete the "Bulk Attendance" button. In the table rows, replace the simple right-arrow action with a distinct **"Mark Attendance"** button.
- **Action 2 (Dialog Creation):** Clicking "Mark Attendance" must open a sophisticated shadcn `Dialog` (`attendance-dialog.tsx`).
- **Dialog Layout Part 1 (Present):** Standard entry with fields: 
  - Date
  - Employee Name (Dropdown, locked to the selected row's employee if opened from the table)
  - Number of Trees Tapped (Number input)
  - **Record Button**
- **Dialog Layout Part 2 (Absent):** Below the Present section, add an "Absent" section or toggle.
  - If marked absent, display a grid of clickable reasons: *Sick, Rain, Other, Public Holiday, Funeral, Family Matter, Kids*.

### E. Add Employee Form
- **Action:** When the generic "Add Employee" button at the top of the table is clicked, open an `add-employee-dialog.tsx` shadcn `Dialog`.
- **Fields Required:**
  - Name (Text)
  - Date of joining (Date Picker)
  - Salary (Number/Currency)
  - Position (Dropdown or Text)

---

### Final Code Quality Check for Claude
Before finalizing changes, verify:
1. Is the Bar Chart properly utilizing `chartPalette` from `theme.ts` to differentiate employees?
2. Does the "Mark Attendance" dialog clearly separate the inputs for a working tapper vs an absent tapper?
3. Do all new dialogs and inputs correctly support the dark mode toggle?
employee_management_enhancements_plan.md