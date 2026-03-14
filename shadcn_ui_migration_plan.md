# shadcn/ui Migration Plan

This document outlines the systematic approach to migrating our existing custom Tailwind CSS components to **shadcn/ui** primitives, as mandated by our [ERP_CODING_GUIDE.md](file:///e:/Porjects/Madukotawatte%20ERP/dashboard-frontend/ERP_CODING_GUIDE.md).

## Goal Description

We have successfully built out the core layouts and features of the AgriManage ERP using raw Tailwind CSS. To improve maintainability, accessibility, and consistency as the application scales, we will migrate these custom implementations to `shadcn/ui` components. This will give us a robust design system foundation while preserving our custom dark green (`brand`) aesthetics.

## Proposed Changes

We will execute this migration in three phases to ensure stability.

### Phase 1: Initialization & Theming

1.  **Initialize shadcn/ui**
    *   Run `npx shadcn-ui@latest init` in the `dashboard-frontend` directory.
    *   Configure `components.json` to use our existing setup (`src/components`, CSS variables, etc.).
2.  **Preserve Brand Colors**
    *   Carefully merge shadcn's generated `globals.css` with our custom `brand` color variables.
    *   Ensure `tailwind.config.ts` correctly aliases shadcn's semantic colors (e.g., `primary`) to our `brand` colors where appropriate, or keep them separate but harmonious.

### Phase 2: Installing Primitives

We will install the core components needed to replace our current custom UI elements:
*   `button`
*   `card`
*   `input`
*   `table`
*   `badge`
*   `dropdown-menu` (for the Topbar user profile)
*   `select` (for the Assets page asset type selector)
*   `avatar` (for the Topbar user profile)

### Phase 3: Component Refactoring

We will systematically go through our files and replace the raw HTML elements with shadcn primitives.

#### [MODIFY] Global Layouts
*   **`src/components/layout/topbar.tsx`**: Replace the search `<input>` with Shadcn `<Input>`. Replace the user profile dropdown with `<DropdownMenu>` and `<Avatar>`.
*   **`src/components/layout/sidebar.tsx`**: Use Shadcn `<Button variant="ghost">` or similar for navigation links if appropriate, though custom styling might remain mostly intact for the bespoke sidebar look.

#### [MODIFY] Feature Pages
*   **`src/app/(auth)/login/page.tsx`**: Replace form inputs with `<Input>` and the submit button with `<Button>`.
*   **`src/app/(dashboard)/assets/page.tsx`**: Refactor the KPI boxes into `<Card>`. Update the "Add Asset" inputs to `<Input>` and `<Select>`. Update the "Recent Injections" table to `<Table>`.
*   **`src/app/(dashboard)/dashboard/page.tsx`**: Refactor KPI boxes to `<Card>`.
*   **`src/app/(dashboard)/employees/page.tsx`**: Refactor stats cards to `<Card>`. Convert the large employee roster table to the `<Table>` component. Update status pills to `<Badge>`.
*   **`src/app/(dashboard)/financials/page.tsx`**: Convert the transaction ledger to `<Table>`. Refactor layout boxes to `<Card>`.
*   **`src/app/(dashboard)/latex-production/page.tsx`**: Replace data entry inputs with `<Input>` and submit buttons with `<Button>`.
*   **`src/app/(dashboard)/weather/page.tsx`**: Wrap weather widgets in `<Card>` components.

## Verification Plan

### Manual Verification
*   Run `npm run dev` and visually inspect every replaced component on every route (`/`, `/dashboard`, `/employees`, `/assets`, `/latex-production`, `/financials`, `/weather`).
*   Ensure the custom dark green `brand` theme is not lost or overwritten by default shadcn gray/zinc themes.
*   Verify that responsive layouts (grid columns, flexboxes) remain intact after exchanging raw `<div>`s for `<Card>`s.
*   Check interactive elements (Dropdowns, Selects) to ensure their overlay menus function correctly.
