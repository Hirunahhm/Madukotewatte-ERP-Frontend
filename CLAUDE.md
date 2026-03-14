# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AgriManage ERP — an estate management dashboard for a rubber plantation (Sri Lanka). Built with Next.js 14 App Router, TypeScript, Tailwind CSS, Zustand (client state), TanStack React Query (server state), React Hook Form + Zod (forms), and Recharts (charts).

## Commands

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # ESLint check
```

No test runner is configured yet (Jest/Vitest/Playwright are planned per the coding guide).

## Architecture

### Routing (Next.js App Router)

Two route groups:
- `(auth)/` — login page with dark/moody theme
- `(dashboard)/` — main ERP shell with `Sidebar` + `Topbar` + page content

Root `page.tsx` redirects to `/login`.

### State Management

- **Zustand** (`src/stores/`) — only for global UI state (sidebar open/close). Never use for server data.
- **React Query** — for all API data fetching once the backend is integrated (not yet wired up; pages currently use static mock data).
- **`useState`** — component-local state only.

### Feature-Sliced Design (planned)

Per `ERP_CODING_GUIDE.md`, features should live in `src/features/<domain>/` with sub-folders: `components/`, `hooks/`, `api/`, `types/`, `utils/`. Currently all business logic is embedded directly in page components — new modules should follow this pattern.

### Path Aliases

Use `@/*` → `src/*` for all imports (configured in `tsconfig.json`).

### Styling

- Tailwind CSS with a custom `brand` green palette (defined in `tailwind.config.ts`).
- Use the `cn()` helper from `src/lib/utils.ts` (wraps `clsx` + `tailwind-merge`) to compose class names.
- CSS custom properties in `globals.css` support dark/light theming.

## Coding Conventions

From `ERP_CODING_GUIDE.md`:

- **Files/folders:** `kebab-case`
- **Components/interfaces/types:** `PascalCase`
- **Functions/variables:** `camelCase`
- **Global constants:** `UPPER_SNAKE_CASE`
- **Never use `any`** — use `unknown` with type guards when the type is uncertain.
- Keep `"use client"` as far down the component tree as possible; default to Server Components.
- Separate UI from logic: extract business logic into custom hooks inside the feature's `hooks/` folder.

## Commit Convention

Conventional Commits format is required:
- `feat(scope):`, `fix(scope):`, `refactor(scope):`, `docs(scope):`
- Example: `feat(staff): add overtime approval workflow`

Branch naming: `feature/<name>` or `bugfix/<name>`.
