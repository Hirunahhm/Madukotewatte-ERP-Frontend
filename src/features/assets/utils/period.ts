import { toLocalDateInputValue } from "@/lib/utils";

export type PeriodPreset =
    | "this-month" | "last-month"
    | "this-quarter" | "last-quarter"
    | "this-year" | "last-year"
    | "this-fy" | "last-fy"
    | "custom";

export const PERIOD_PRESET_LABEL: Record<PeriodPreset, string> = {
    "this-month": "This month",
    "last-month": "Last month",
    "this-quarter": "This quarter",
    "last-quarter": "Last quarter",
    "this-year": "This calendar year",
    "last-year": "Last calendar year",
    "this-fy": "This financial year (Apr-Mar)",
    "last-fy": "Last financial year (Apr-Mar)",
    custom: "Custom range",
};

export interface DateRange {
    from: string;
    to: string;
}

function iso(year: number, monthIndex: number, day: number): string {
    return toLocalDateInputValue(new Date(year, monthIndex, day));
}

/** Resolves a preset to inclusive from/to dates (YYYY-MM-DD). Custom returns the supplied range. */
export function resolvePeriod(preset: PeriodPreset, custom: DateRange, today: Date = new Date()): DateRange {
    const y = today.getFullYear();
    const m = today.getMonth();
    switch (preset) {
        case "this-month":
            return { from: iso(y, m, 1), to: iso(y, m + 1, 0) };
        case "last-month":
            return { from: iso(y, m - 1, 1), to: iso(y, m, 0) };
        case "this-quarter": {
            const q = Math.floor(m / 3) * 3;
            return { from: iso(y, q, 1), to: iso(y, q + 3, 0) };
        }
        case "last-quarter": {
            const q = Math.floor(m / 3) * 3 - 3;
            return { from: iso(y, q, 1), to: iso(y, q + 3, 0) };
        }
        case "this-year":
            return { from: iso(y, 0, 1), to: iso(y, 12, 0) };
        case "last-year":
            return { from: iso(y - 1, 0, 1), to: iso(y - 1, 12, 0) };
        case "this-fy": {
            const start = m >= 3 ? y : y - 1;
            return { from: iso(start, 3, 1), to: iso(start + 1, 3, 0) };
        }
        case "last-fy": {
            const start = (m >= 3 ? y : y - 1) - 1;
            return { from: iso(start, 3, 1), to: iso(start + 1, 3, 0) };
        }
        default:
            return custom;
    }
}
