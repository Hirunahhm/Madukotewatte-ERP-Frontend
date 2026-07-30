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

## Environment

```
# .env.local (server-only — no NEXT_PUBLIC_ prefix)
AUTH_API_URL=http://localhost/api/v1
```

All backend calls go through Next.js API routes (BFF pattern). Never call the Java backend directly from client components.

## UI & Design System

- **shadcn/ui v4** is the primary component library (primitives from `@base-ui/react`).
- **Design Tokens:** `src/lib/theme.ts` is the single source of truth for brand colors (`brandColors`, `chartColors`, `chartPalette`), sidebar theme, and shadow scale. Import from there — never use raw hex values.
- **Theme:** Light mode (white-based, subtle emerald accents) + dark mode (deep forest green). The **Sidebar** uses custom CSS variables (`dark:bg-sidebar`, `dark:border-sidebar-border`, `dark:bg-sidebar-active`) defined in `globals.css`.
- **Styling:** Tailwind v3.4 (`globals.css` uses HSL CSS variables). Do NOT use v4 features like `@import "shadcn/tailwind.css"`.
- **Add components** with `npx shadcn@latest add <component>` — they land in `src/components/ui/`.
- **`NoSSR`** (`src/components/ui/no-ssr.tsx`) — wrap Recharts components in this to prevent hydration mismatches.
- **`PageHeader`** (`src/components/layout/page-header.tsx`) — use for the title/description/actions bar at the top of every dashboard page.

## Architecture

### Backend-for-Frontend (BFF) Pattern

The client **never** calls the Java backend directly. All API calls flow through Next.js API routes:

```
Client → /api/<service>/<action>  (Next.js route)
              ↓
         AUTH_API_URL (Java backend, server-side only)
```

This allows the JWT token to be stored as an **httpOnly cookie** (set by the Next.js route, never visible to client JS).

**Existing API routes:**
- `src/app/api/auth/login/route.ts` — proxies to Java `/auth/login`, sets `auth_token` httpOnly cookie
- `src/app/api/auth/logout/route.ts` — clears the `auth_token` cookie

When adding new backend integrations, follow this same pattern: create a Next.js route in `src/app/api/`, call the backend server-side using `AUTH_API_URL`, and pass results to the client without exposing credentials.

### Route Protection via `src/lib/proxy.ts`

`proxy.ts` (not Next.js `middleware.ts`) provides server-side auth guards called directly from Server Component layouts:

```ts
requireAuth()  // redirects to /login if auth_token cookie missing
requireGuest() // redirects to /dashboard if auth_token cookie present
```

- `(dashboard)/layout.tsx` calls `requireAuth()` — protects all dashboard routes
- `(auth)/layout.tsx` calls `requireGuest()` — redirects logged-in users away from login

Because these layouts use cookies(), all dashboard routes render as **dynamic** (server-rendered per request), not static.

### Feature-Sliced Design

Features live in `src/features/<domain>/` with subdirectories added as complexity warrants:

```
src/features/<domain>/
├── components/   — UI components
├── hooks/        — custom hooks with business logic
├── services/     — fetch calls to Next.js API routes (never direct to backend)
├── types/        — TypeScript interfaces
└── utils/        — feature-local helpers
```

**Current features and their routes:**

| Feature | Route | Zustand tab key |
|---|---|---|
| `auth` | `/login` | — |
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

The auth feature follows the same pattern: `app/(auth)/login/page.tsx` is a thin shell that renders `<LoginForm />` from `features/auth/components/login-form.tsx`.

### State Management

- **Zustand `ui-store`** (`src/stores/ui-store.ts`) — sidebar state + active tab for each page (`productionTab`, `employeesTab`, `financialsTab`, `assetsTab`, `assetsTimeframe`).
- **Zustand `auth-store`** (`src/stores/auth-store.ts`) — in-memory `{ username, role, isAuthenticated }`. The JWT token itself is **never** stored here — it lives in the httpOnly cookie. Call `setUser()` after successful login, `clearUser()` on logout.
- **React Query** — intended for all server/API state; not yet wired to a backend (mock/static data in most feature components currently).
- **useState** — strictly for isolated component-level state.

### Auth Flow Summary

1. User submits login form → `features/auth/services/auth-service.ts` calls `POST /api/auth/login`
2. Next.js route (`app/api/auth/login/route.ts`) calls Java backend, receives JWT, sets httpOnly cookie `auth_token`
3. Client receives `{ username, role }` only — token is never in JS
4. `auth-store.setUser(username, role)` updates in-memory state → redirect to `/dashboard`
5. On every dashboard page load, `proxy.ts:requireAuth()` checks the cookie server-side
6. Sign Out: `auth-service.logoutUser()` → `POST /api/auth/logout` (clears cookie) → `auth-store.clearUser()` → redirect to `/login`

## Coding Conventions

- **Naming:** `kebab-case` for files/folders; `PascalCase` for components/types; `camelCase` for variables/functions; `UPPER_SNAKE_CASE` for global constants.
- **TypeScript:** Strict mode. Never use `any`. Use `unknown` + type guards for uncertainty.
- **Separation of Concerns:** Keep components lean; extract business logic into hooks, API calls into services.
- **Server-First:** Default to Server Components; push `"use client"` as far down the tree as possible.
- **Services call Next.js API routes, not the backend directly.** Never use `AUTH_API_URL` or any backend URL in a `"use client"` file.

## Commit Convention

Conventional Commits format is mandatory:
- `feat(scope):`, `fix(scope):`, `refactor(scope):`, `docs(scope):`
- Branch naming: `feature/<slug>`, `bugfix/<slug>`
- Example: `feat(staff): add overtime approval workflow`
