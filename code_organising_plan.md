# Feature-Sliced Architecture Refactoring Plan

The current codebase has "fat pages" where UI, state (currently hardcoded), and layout are tightly coupled within `src/app/(dashboard)/*`. To align with the [ERP_CODING_GUIDE.md](file:///e:/Porjects/Madukotawatte%20ERP/dashboard-frontend/ERP_CODING_GUIDE.md) and prepare for backend integration, we will adopt a Feature-Sliced Design (FSD).

This plan outlines how we will extract the monolithic [page.tsx](file:///e:/Porjects/Madukotawatte%20ERP/dashboard-frontend/src/app/page.tsx) files into modular, reusable components within the `src/features/` directory.

## User Review Required

> [!NOTE]
> Review the proposed directory structure below. The goal is to make the `app/(dashboard)/*/page.tsx` files act strictly as "shells" that import components from `features/`. Data will remain hardcoded for now, but will be encapsulated within the feature components to make swapping to an API seamless later.

## Proposed Changes

We will create a `src/features/` folder and migrate each page one by one.

### 1. Employees Feature (`src/features/employees/`)

To answer your question: **YES, absolutely!** A true Feature-Slicing approach means each feature folder should act like a "mini-application". When we integrate the backend later, we will add:
- `src/features/employees/hooks/` (e.g., `use-employees.ts`, `use-attendance.ts`)
- `src/features/employees/types/` (e.g., `employee.ts`, `attendance-record.ts`)
- `src/features/employees/api/` (or `services/`) (e.g., `get-employees.ts`) (let's go with services name that's a better name )

For this refactoring phase, we will focus on extracting the UI into `components/` while leaving space for those other folders.

We will break down [src/app/(dashboard)/employees/page.tsx](file:///e:/Porjects/Madukotawatte%20ERP/dashboard-frontend/src/app/%28dashboard%29/employees/page.tsx).

- **[NEW]** `src/features/employees/components/employee-header.tsx`: Contains the title, active staff badge, and the "VIEW STATS FOR" filters.
- **[NEW]** `src/features/employees/components/top-performers.tsx`: Contains the 3 cards showing the top-tier tappers.
- **[NEW]** `src/features/employees/components/productivity-chart.tsx`: Contains the BarChart showing weekly attendance/productivity.
- **[NEW]** `src/features/employees/components/average-productivity.tsx`: Contains the single KPI card for "Average Productivity".
- **[NEW]** `src/features/employees/components/employee-table.tsx`: Contains the search bar, filter button, and the shadcn `Table` displaying the employee roster.
- **[MODIFY]** [src/app/(dashboard)/employees/page.tsx](file:///e:/Porjects/Madukotawatte%20ERP/dashboard-frontend/src/app/%28dashboard%29/employees/page.tsx): Will be cleared of all markup and instead import and stack the components above.

### 2. Dashboard / Overview Feature (`src/features/overview/`)

We will break down [src/app/(dashboard)/dashboard/page.tsx](file:///e:/Porjects/Madukotawatte%20ERP/dashboard-frontend/src/app/%28dashboard%29/dashboard/page.tsx).

- **[NEW]** `src/features/overview/components/kpi-cards.tsx`: The top 4 metrics (Total Latex, Total Mass, Avg Metrolac).
- **[NEW]** `src/features/overview/components/weather-widget.tsx`: The live weather and 5-day forecast at the top.
- **[NEW]** `src/features/overview/components/yield-trend-chart.tsx`: The main area chart for production yield.
- **[NEW]** `src/features/overview/components/financial-health.tsx`: The Liquidity Distribution donut and Expense bars.
- **[NEW]** `src/features/overview/components/workforce-engagement.tsx`: The 28-day active tapper grid.
- **[MODIFY]** [src/app/(dashboard)/dashboard/page.tsx](file:///e:/Porjects/Madukotawatte%20ERP/dashboard-frontend/src/app/%28dashboard%29/dashboard/page.tsx): Convert to a shell assembling these components.

### 3. Financials Feature (`src/features/financials/`)

We will break down [src/app/(dashboard)/financials/page.tsx](file:///e:/Porjects/Madukotawatte%20ERP/dashboard-frontend/src/app/%28dashboard%29/financials/page.tsx).

- **[NEW]** `src/features/financials/components/financials-header.tsx`: Header and date filters.
- **[NEW]** `src/features/financials/components/revenue-chart.tsx`: The area chart showing total revenue and avg price.
- **[NEW]** `src/features/financials/components/expenditure-breakdown.tsx`: The blocky grid showing Labor, Chemicals, Maintenance, etc.
- **[NEW]** `src/features/financials/components/transaction-ledger.tsx`: The data table for all income/expense movements.
- **[MODIFY]** [src/app/(dashboard)/financials/page.tsx](file:///e:/Porjects/Madukotawatte%20ERP/dashboard-frontend/src/app/%28dashboard%29/financials/page.tsx): Convert to a shell.

### 4. Assets Feature (`src/features/assets/`)

We will break down [src/app/(dashboard)/assets/page.tsx](file:///e:/Porjects/Madukotawatte%20ERP/dashboard-frontend/src/app/%28dashboard%29/assets/page.tsx).

- **[NEW]** `src/features/assets/components/liquidity-overview.tsx`: The massive "$1,248,500.00" card.
- **[NEW]** `src/features/assets/components/add-asset-form.tsx`: The inline form to add new assets.
- **[NEW]** `src/features/assets/components/liquidity-history-chart.tsx`: The step-after area chart.
- **[NEW]** `src/features/assets/components/recent-injections-table.tsx`: The table of recent asset injections.
- **[NEW]** `src/features/assets/components/asset-kpis.tsx`: The bottom row of minor metrics (MTD Yield, Asset Count, Available Cash).
- **[MODIFY]** [src/app/(dashboard)/assets/page.tsx](file:///e:/Porjects/Madukotawatte%20ERP/dashboard-frontend/src/app/%28dashboard%29/assets/page.tsx): Convert to a shell.

### 5. Weather Feature (`src/features/weather/`)

We will break down [src/app/(dashboard)/weather/page.tsx](file:///e:/Porjects/Madukotawatte%20ERP/dashboard-frontend/src/app/%28dashboard%29/weather/page.tsx).

- **[NEW]** `src/features/weather/components/live-weather.tsx`: The giant 28°C card with humidity/wind grids.
- **[NEW]** `src/features/weather/components/next-24-hours.tsx`: The horizontally scrolling hourly forecast.
- **[NEW]** `src/features/weather/components/outlook-5-day.tsx`: The 5 daily cards.
- **[NEW]** `src/features/weather/components/satellite-radar.tsx`: The mock radar screen.
- **[NEW]** `src/features/weather/components/active-alerts.tsx`: The warning banners.
- **[NEW]** `src/features/weather/components/air-quality.tsx`: The AQI gauge.
- **[MODIFY]** [src/app/(dashboard)/weather/page.tsx](file:///e:/Porjects/Madukotawatte%20ERP/dashboard-frontend/src/app/%28dashboard%29/weather/page.tsx): Convert to a shell.

### 6. Latex Production Feature (`src/features/production/`)

We will break down [src/app/(dashboard)/latex-production/page.tsx](file:///e:/Porjects/Madukotawatte%20ERP/dashboard-frontend/src/app/%28dashboard%29/latex-production/page.tsx).

- **[NEW]** `src/features/production/components/production-kpis.tsx`: Current price and yield delta.
- **[NEW]** `src/features/production/components/volume-trends-chart.tsx`: Actual vs Target area chart.
- **[NEW]** `src/features/production/components/load-tracker.tsx`: The Metrolac testing list.
- **[NEW]** `src/features/production/components/direct-data-entry.tsx`: The quick input form.
- **[NEW]** `src/features/production/components/production-chronology.tsx`: The calendar grid showing collection days vs rain days.
- **[MODIFY]** [src/app/(dashboard)/latex-production/page.tsx](file:///e:/Porjects/Madukotawatte%20ERP/dashboard-frontend/src/app/%28dashboard%29/latex-production/page.tsx): Convert to a shell.

## Verification Plan

### Manual Verification
1. I will execute this refactor one page at a time (e.g., starting with Employees).
2. After refactoring a page, I will verify that the UI looks **exactly identical** to how it looks right now—there should be zero visual changes.
3. The hardcoded data arrays (e.g., `chartData`, `employees`) will be kept inside the new feature components, so the [page.tsx](file:///e:/Porjects/Madukotawatte%20ERP/dashboard-frontend/src/app/page.tsx) becomes incredibly clean. This isolates the data where it belongs, ready for React Query hooks later.
