# Main Dashboard (Overview) Implementation Guide

This document provides explicit instructions for polishing the primary **Dashboard Overview** screen (`/` route). Claude must follow these requirements strictly, adhering to Feature-Sliced Design (FSD), Next.js 15, and the project's visual theme.

## 1. Core Architectural & Theme Rules

- **Feature-Sliced Design:** All component modifications must occur within `src/features/overview/components/`.
- **Theming & Dark Mode:** Ensure total alignment with `src/lib/theme.ts`.
  - Always use `dark:` Tailwind classes.
  - Rely on `chartPalette` for multi-worker charts and `chartColors.primary` (Sales) vs `chartColors.warning` (Costs) for comparative charts.

---

## 2. Top-Level KPI Cards

The top row of the dashboard gives the estate manager an immediate snapshot of the day.

### A. Latex Stock Card
- **Component:** Locate the existing latex stock summary card.
- **Action:** Remove the "Mass" (kg) metric entirely to reduce clutter. Retain the "Metrolac Reading" and total volume (Litres).

### B. Today's Attendance Card
- **Component:** Locate or replace the current employee/attendance KPI card.
- **Action:** Instead of just showing a raw number (e.g., "5/7 Present"), upgrade this card to explicitly show *who* is present.
- **UI Execution:** Render a compact list, or a row of chips/avatars with the names of the tappers who have clocked in for the day.

### C. Untouched Cards
- **Weather Card:** Do not modify. Keep the current implementation.
- **Liquidity Distribution Card:** Do not modify. Keep the current implementation.

---

## 3. Main Data Visualizations

### A. Costs vs Sales Comparative Chart
- **Requirement:** A high-level financial health chart for the estate owner.
- **Component:** Build or swap the primary chart to a **Costs vs Sales** comparative visualization (e.g., a clustered Bar Chart or overlapping Area Chart).
- **Controls:** Include a time-scale toggle allowing the user to switch the data view between **Week, Month, and Year**.
- **Theming:** Use Brand Green (`chartColors.primary`) for Sales, and Amber/Slate (`chartColors.warning` or `chartColors.neutral`) for Costs so they are easily distinguishable.

### B. Worker Engagement Refactor
- **Problem:** The current Worker Engagement visualization is too abstract and hard to understand at a glance.
- **Requirement:** Replace it entirely with a direct, highly legible metric.
- **Action:** Build a clean Bar Chart (horizontal usually works best for names) or a detailed progress-bar list.
- **Data:** It must explicitly show the **Number of trees tapped by each worker over the last 7 days**.
- **Goal:** At a single glance, the estate manager should know exactly who the top performer of the week is based strictly on tree count.

---

### Final Code Quality Check for Claude
Before finalizing changes, verify:
1. Is the "Today's Attendance" card cleanly handling the UI if there are many (e.g., 10+) tappers present? (Ensure it doesn't break the card height).
2. Does the "Costs vs Sales" chart dynamically update its X-axis domain when toggling between Week/Month/Year?
3. Are all Recharts components properly wrapped in the `<NoSSR>` boundary to prevent Vercel build failures?
