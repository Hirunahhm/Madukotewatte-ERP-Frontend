/**
 * Madukotewatta Estates ERP — Design Token Reference
 * 
 * Single source of truth for colors, chart palettes, and elevation.
 * Import these into pages and components instead of using raw hex values.
 */

// ─── Brand Color Scale ────────────────────────────────────────────────
export const brandColors = {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
} as const;

// ─── Sidebar Theme ───────────────────────────────────────────────────
export const sidebarTheme = {
    bg: '#0d2117',   // deep forest green
    border: '#1a3828',
    activeBg: '#1a4a2e',
    activeText: '#4ade80',   // brand-400 — pops on dark bg
    inactiveText: '#86a898',
    labelText: '#4a7060',
    logo: {
        titleColor: '#d1fae5',  // emerald-100
        subtitleColor: '#4ade80',
    },
} as const;

// ─── Chart Color Palette ─────────────────────────────────────────────
// Use these in order for multi-series recharts
export const chartColors = {
    primary: '#22c55e',   // brand green
    secondary: '#34d399',   // emerald-400
    accent: '#86efac',   // brand-300
    warning: '#fbbf24',   // amber-400
    danger: '#f87171',   // red-400
    neutral: '#94a3b8',   // slate-400
    blue: '#60a5fa',   // blue-400
    cyan: '#06b6d4',   // cyan-500
} as const;

// Ordered palette for multi-series charts (pie, bar, etc.)
export const chartPalette = [
    chartColors.primary,
    chartColors.secondary,
    chartColors.warning,
    chartColors.blue,
    chartColors.danger,
    chartColors.neutral,
] as const;

// ─── Shadow Scale ────────────────────────────────────────────────────
export const shadows = {
    card: '0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07)',
    hero: '0 4px 6px -1px rgb(0 0 0 / 0.10), 0 2px 4px -2px rgb(0 0 0 / 0.10)',
    overlay: '0 20px 25px -5px rgb(0 0 0 / 0.20), 0 8px 10px -6px rgb(0 0 0 / 0.20)',
} as const;

// ─── Navigation Sections ─────────────────────────────────────────────
export const navSections = [
    {
        label: 'Operations',
        items: [
            { name: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
            { name: 'Employees', href: '/employees', icon: 'Users' },
            { name: 'Latex Production', href: '/latex-production', icon: 'Droplets' },
        ],
    },
    {
        label: 'Finance',
        items: [
            { name: 'Financials', href: '/financials', icon: 'TrendingUp' },
            { name: 'Cash & Assets', href: '/assets', icon: 'Briefcase' },
        ],
    },
    {
        label: 'Monitoring',
        items: [
            { name: 'Weather', href: '/weather', icon: 'CloudSun' },
        ],
    },
] as const;
