# Industrial-Level Next.js Coding Guide for Estate ERP

## 1. Introduction
This document outlines the coding standards, architectural patterns, and best practices for developing the Frontend of the Estate ERP System using Next.js. The goal is to ensure a scalable, maintainable, highly performant, and secure application tailored to the complex needs of managing an estate (including staff, crops, machinery, and inventory).

## 2. Tech Stack Core
- **Framework:** Next.js (App Router)
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS + shadcn/ui (or a similar headless UI library)
- **State Management:** 
  - **Server State:** React Query (TanStack Query)
  - **Client State:** Zustand (for global UI states like sidebar toggles, theme)
- **Form Handling:** React Hook Form + Zod (for validation)
- **Linting & Formatting:** ESLint + Prettier

## 3. Project Architecture (Feature-Sliced Design)
For an ERP, organizing by feature (rather than tech type) is crucial to avoid unmanageable folders as the project scales.

```text
src/
├── app/                  # Next.js App Router (Pages, Layouts, Routing)
│   ├── (auth)/           # Authentication routes (login, forgot password)
│   ├── dashboard/        # Main ERP application routes
│   ├── api/              # Optional Next.js API routes (BFF pattern)
│   └── layout.tsx        # Root layout
├── features/             # Feature-based modules (Heart of the ERP)
│   ├── inventory/        # e.g., Estate Inventory Management
│   │   ├── components/   # UI components specific to inventory
│   │   ├── hooks/        # Custom hooks containing inventory business logic
│   │   ├── api/          # React Query hooks & fetch calls for inventory
│   │   ├── types/        # TypeScript interfaces/types for inventory
│   │   └── utils/        # Utility functions specifically for inventory
│   ├── staff/            # Estate Staff & Payroll Management
│   ├── crops/            # Harvest, Fields & Crop Management
│   └── machinery/        # Equipment Tracking & Maintenance
├── components/           # Shared/Generic UI Components (Buttons, Modals, Tables)
│   ├── ui/               # Base UI elements (e.g., shadcn components)
│   └── layout/           # Shared layout components (Sidebar, Topbar)
├── lib/                  # Third-party library configurations (Axios, etc.)
├── stores/               # Global Zustand stores (Auth, UI State)
├── types/                # Global TypeScript definitions
└── utils/                # Global utility functions (date formatting, currency, etc.)
```

## 4. Coding Conventions

### 4.1. Naming Conventions
- **Files/Folders:** `kebab-case` (e.g., `employee-list.tsx`, `use-auth.ts`).
- **Components/Interfaces/Types:** `PascalCase` (e.g., `EmployeeDataGrid`, `StaffMember`).
- **Variables/Functions:** `camelCase` (e.g., `formatCurrency`, `handleFormSubmit`).
- **Constants:** `UPPER_SNAKE_CASE` for global constant values (e.g., `MAX_UPLOAD_SIZE_MB`).

### 4.2. TypeScript Best Practices
- **Never use `any`**. Use `unknown` if the type is truly unknown, then narrow it down with type guards.
- Define explicit interfaces or types for all API responses, API payloads, and component props.
- Keep interfaces local to the feature if they are only used there. Move them to `src/types` only if globally shared.

### 4.3. UI and Logic Separation
Always use functional components. Separate the UI representation from the business logic using custom hooks.

```tsx
// ❌ Bad: Logic mixed with UI
export const InventoryList = () => {
  const [data, setData] = useState([]);
  useEffect(() => { fetch(...) }, []);
  return <div>{/* UI */}</div>;
};

// ✅ Good: Logic abstracted to a feature hook
import { useInventoryItems } from '@/features/inventory/hooks/useInventoryTools';
import { DataTable } from '@/components/ui/data-table';

export const InventoryList = () => {
  const { data, isLoading, error } = useInventoryItems();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;

  return <DataTable data={data} />;
};
```

## 5. State Management Strategy
ERP systems handle massive amounts of data. Using the right state tool is critical for performance avoiding unnecessary re-renders.

- **Use React Query for all API data (Server State).** It handles caching, pagination, re-fetching, deduplication, and background updates automatically.
- **Use Zustand only for global Client State** (e.g., sidebar toggled state, current active tenant, theme).
- **Use React Context sparingly**, mainly for dependency injection that rarely changes (like localization/themes).
- **Use local `useState`** for component-specific state (e.g., uncontrolled form inputs, toggling a local dropdown).

## 6. Performance Optimization
- **React Server Components (RSC):** In the App Router, components are Server Components by default. Keep them as Server Components to reduce JavaScript bundles sent to the client. This is especially useful for heavy table layouts or static dashboards.
- **Client Components:** Only add `"use client"` at the top of a file when you need interactivity (`useState`, `useEffect`, `onClick`, browser APIs). Move the `"use client"` boundary as far down the component tree as possible.
- **Data Fetching:** Fetch data parallelly where possible on the server using `Promise.all`.
- **Lazy Loading:** Use Next.js `dynamic()` imports for heavy client components (e.g., charts, maps, complex WYSIWYG editors) that are not immediately visible.

## 7. Form Handling & Validation
ERPs are heavily form-driven. A robust data entry system prevents corrupted estate data.
- Always use **React Hook Form** to manage form state without causing complete re-renders on keystrokes.
- Always use **Zod** schema validation. Define schemas in the feature's `types/` or `utils/` folder and share them with the backend if building a full-stack Next.js app or a Node backend.

## 8. Error Handling & Logging
- **API Errors:** Standardize API responses from the backend. Implement an Axios or Fetch interceptor to gracefully handle 401 (Unauthorized) and 403 (Forbidden) globally to force re-login.
- **Error Boundaries:** Use `error.tsx` and `global-error.tsx` in the Next.js App Router to catch rendering errors and prevent the whole app from white-screening.
- **User Feedback:** Provide user-friendly toast messages (e.g., "Failed to update inventory. Please try again.") instead of raw technical errors. Log the raw error to a service like Sentry.

## 9. Security Best Practices
- Never expose secret keys in client-side code. Only prefix with `NEXT_PUBLIC_` if it absolutely must be available on the client (like a Mapbox token).
- Protect internal backend APIs using HTTP-only cookies for authentication tokens, preventing XSS attacks.
- Ensure all mutation requests validate authorization rights on the backend, do not rely solely on hiding a button on the frontend. 

## 10. Commit Workflow
- Use strict commit message formatting (Conventional Commits):
  - `feat:` (New feature)
  - `fix:` (Bug fix)
  - `refactor:` (Refactoring production code)
  - `docs:` (Changes to the documentation)
- Example: `feat(staff): add overtime approval workflow`
- **Branch Naming:** `feature/estate-staff-module`, `bugfix/inventory-sync-error`.

## 11. Testing Strategy
- **Unit Testing:** `Vitest` or `Jest` for pure functions, utility methods, and complex custom hooks.
- **Component Testing:** `React Testing Library` for critical UI components.
- **End-to-End (E2E):** `Playwright` or `Cypress`. E2E tests are mandatory for critical ERP flows (e.g., Creating a Purchase Order, Approving Payroll, Submitting Harvest Records).
