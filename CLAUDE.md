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

No test runner is configured yet (Playwright is prioritized for critical ERP flows per the coding guide).

## UI & Design System

- **shadcn/ui v4** is the primary component library (primitives from `@base-ui/react`).
- **Design Tokens:** `src/lib/theme.ts` is the central source of truth for brand colors, chart palettes, and secondary layout styles.
- **Theme:** Supports dark and light modes. The **Sidebar** is dark-themed by default (Deep Forest Green) while most content uses `dark:` Tailwind classes for consistency.
- **Components:** Live in `src/components/ui/`. Use `npx shadcn@latest add <component>` to add more.
- **Styling:** Tailwind v3.4. (`globals.css` uses HSL variables). Do NOT use v4 features like `@import "shadcn/tailwind.css"`.

## Architecture

### Feature-Sliced Design (Active)

The project follows high-modularity standards defined in `ERP_CODING_GUIDE.md`. Features live in `src/features/<domain>/` with its own internal structure:
- `components/` — UI components specific to the feature.
- `hooks/` — Custom hooks for feature-level business logic.
- `services/` — API calls and data transformation logic.
- `types/` — Feature-specific TypeScript interfaces.
- `utils/` — Feature-local helper functions.

**Current Features:** `employees`, `overview`, `financials`, `assets`, `weather`, `production`.

### Routing (Next.js App Router)

- `(auth)/` — login page with an atmospheric plantation-themed layout.
- `(dashboard)/` — ERP core with the shared `Sidebar` + `Topbar` + content shell.

### State Management

- **React Query:** Primary tool for all data fetching and server-state caching.
- **Zustand:** (`src/stores/`) Only for global, cross-cutting UI state (e.g., sidebar collapse).
- **useState:** Strictly for isolated component-level state.

## Coding Conventions

- **Naming:** `kebab-case` for files/folders; `PascalCase` for components/types; `camelCase` for variables/functions.
- **TypeScript:** Strict mode. Never use `any`. Use `unknown` + type guards for uncertainty.
- **Separation of Concerns:** Keep components lean; extract complex logic into hooks or services.
- **Server-First:** Default to Server Components; keep `"use client"` as far down the component tree as possible.

## Commit Convention

Conventional Commits format is mandatory:
- `feat(scope):`, `fix(scope):`, `refactor(scope):`, `docs(scope):`
- Example: `feat(staff): add overtime approval workflow`
