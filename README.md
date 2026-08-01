# Madukotewatta Estates — Dashboard Frontend

Industrial-grade estate management ERP frontend for a rubber plantation in Sri Lanka. Built with **Next.js 15 (App Router)**, **React 19**, TypeScript, Tailwind CSS, Zustand, TanStack React Query, React Hook Form + Zod, and Recharts.

The app never talks to the Java backend directly — every request goes through a Next.js API route acting as a Backend-for-Frontend (BFF), so the auth token stays server-side in an httpOnly cookie.

## Tech Stack

- **Framework:** Next.js 15 (App Router), React 19, TypeScript (strict)
- **Styling:** Tailwind CSS v3.4 + [shadcn/ui](https://ui.shadcn.com/) (`@base-ui/react` primitives)
- **Client state:** Zustand
- **Server state:** TanStack React Query
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts

## Getting Started

```bash
npm install
npm run dev       # start the dev server at http://localhost:3000
npm run build     # production build
npm run start     # start the production server
npm run lint       # ESLint check
```

### Environment

Create `.env.local` (never committed) with:

```
# Server-only — no NEXT_PUBLIC_ prefix, so it's never exposed to the browser
AUTH_API_URL=http://localhost:<backend-port>/api/v1
```

Point `AUTH_API_URL` at wherever the [Java backend](../estate-erp-service-java) is running locally.

## Architecture

### Backend-for-Frontend (BFF)

```
Client → /api/<service>/<action>  (Next.js route)
              ↓
         AUTH_API_URL (Java backend, server-side only)
```

The JWT issued by the backend is set as an httpOnly cookie by the Next.js route and is never visible to client-side JS.

### Route protection

`src/lib/proxy.ts` provides server-side auth guards (`requireAuth()`, `requireGuest()`) called from Server Component layouts — not Next.js `middleware.ts`. Because these layouts read cookies, all dashboard routes render dynamically (per-request).

### Feature-Sliced Design

Each domain lives under `src/features/<domain>/` with `components/`, `hooks/`, `services/`, `types/`, and `utils/` subfolders as needed.

| Feature | Route | Description |
|---|---|---|
| `auth` | `/login` | Login/session handling |
| `overview` | `/dashboard` | Financial health, workforce engagement, weather summary |
| `employees` | `/employees` | Attendance, payroll, loans, transactions |
| `production` | `/latex-production` | Latex, ammonia, and rubber solid collection |
| `production` | `/crop-production` | Banana, coconut, and manioc harvest tracking |
| `financials` | `/financials` | Sales, expenses, financial stats |
| `assets` | `/assets` | Cash & debt, fixed asset register, reports |
| `weather` | `/weather` | Climate & forecasting |

### Page pattern

Every dashboard route is a thin Server Component that renders a `"use client"` page component reading the relevant Zustand tab state, e.g.:

```tsx
// app/(dashboard)/employees/page.tsx
export default function EmployeesPage() {
    return <EmployeesPageClient />;
}
```

## Contributing

See [`CLAUDE.md`](./CLAUDE.md) for full architectural conventions, naming rules, and coding standards.

Commits follow [Conventional Commits](https://www.conventionalcommits.org/): `feat(scope):`, `fix(scope):`, `refactor(scope):`, `docs(scope):`.
