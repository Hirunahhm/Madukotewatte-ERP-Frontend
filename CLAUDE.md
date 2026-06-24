# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Madukotewatta Estates** — an industrial-grade estate management ERP for a rubber plantation in Sri Lanka. Built with **Next.js 15 (App Router)**, **React 19**, TypeScript, Tailwind CSS, Zustand (client state), TanStack React Query (server state), React Hook Form + Zod (forms), and Recharts (charts).

## Commands

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # ESLint check
```

No test runner is configured yet (Playwright is prioritized for critical ERP flows per `ERP_CODING_GUIDE.md`).

## UI & Design System

- **shadcn/ui v4** is the primary component library (primitives from `@base-ui/react`).
- **Design Tokens:** `src/lib/theme.ts` is the single source of truth for brand colors (`brandColors`, `chartColors`, `chartPalette`), sidebar theme, and shadow scale. Import from there — never use raw hex values.
- **Theme:** Supports dark and light modes. The **Sidebar** uses custom CSS variables (`dark:bg-sidebar`, `dark:border-sidebar-border`, `dark:bg-sidebar-active`) defined in `globals.css`.
- **Styling:** Tailwind v3.4. (`globals.css` uses HSL CSS variables). Do NOT use v4 features like `@import "shadcn/tailwind.css"`.
- **Add components** with `npx shadcn@latest add <component>` — they land in `src/components/ui/`.
- **`NoSSR`** (`src/components/ui/no-ssr.tsx`) — wrap Recharts components in this to prevent hydration mismatches.
- **`PageHeader`** (`src/components/layout/page-header.tsx`) — use for the title/description/actions bar at the top of every dashboard page.

## Architecture

### Feature-Sliced Design

Features live in `src/features/<domain>/components/`. The `hooks/`, `services/`, `types/`, and `utils/` subdirectories are defined in `ERP_CODING_GUIDE.md` as the target structure but are not yet scaffolded — add them as complexity warrants.

**Current Features:**

| Feature | Route | Zustand tab key |
|---|---|---|
| `overview` | `/dashboard` | — |
| `employees` | `/employees` | `employeesTab`: `attendance \| payment` |
| `production` | `/latex-production` | `productionTab`: `latex \| ammonia \| rubber` |
| `financials` | `/financials` | `financialsTab`: `sales \| expenses \| stats` |
| `assets` | `/assets` | `assetsTab`: `assets \| liabilities \| stats` |
| `weather` | `/weather` | — |

### Page Pattern (RSC → Client boundary)

Every dashboard page follows this two-layer pattern:

```tsx
// app/(dashboard)/employees/page.tsx — thin Server Component
import { EmployeesPageClient } from "@/features/employees/components/employees-page-client";
export default function EmployeesPage() {
    return <EmployeesPageClient />;
}

// features/employees/components/employees-page-client.tsx — "use client", reads Zustand tab
"use client";
export function EmployeesPageClient() {
    const activeTab = useUiStore((state) => state.employeesTab);
    return activeTab === "attendance" ? <AttendanceView /> : <PaymentScreen />;
}
```

The page file stays a Server Component; the `*PageClient` component owns `"use client"` and drives tab rendering via the Zustand store.

### Routing (Next.js App Router)

- `(auth)/` — login page with plantation-themed layout.
- `(dashboard)/` — ERP core: shared `Sidebar` + `Topbar` + `<main>` + `<footer>`.

### State Management

- **Zustand** (`src/stores/ui-store.ts`) — one store for all global UI state: `isSidebarOpen`, and the active tab for each page (`productionTab`, `employeesTab`, `financialsTab`, `assetsTab`, `assetsTimeframe`).
- **React Query** — intended for all server/API state; not yet wired to a backend (mock/static data in components currently).
- **useState** — strictly for isolated component-level state.

## Coding Conventions

- **Naming:** `kebab-case` for files/folders; `PascalCase` for components/types; `camelCase` for variables/functions; `UPPER_SNAKE_CASE` for global constants.
- **TypeScript:** Strict mode. Never use `any`. Use `unknown` + type guards for uncertainty.
- **Separation of Concerns:** Keep components lean; extract business logic into hooks, API calls into services.
- **Server-First:** Default to Server Components; push `"use client"` as far down the tree as possible.

## Commit Convention

Conventional Commits format is mandatory:
- `feat(scope):`, `fix(scope):`, `refactor(scope):`, `docs(scope):`
- Branch naming: `feature/<slug>`, `bugfix/<slug>`
- Example: `feat(staff): add overtime approval workflow`
