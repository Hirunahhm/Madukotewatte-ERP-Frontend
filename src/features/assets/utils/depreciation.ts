import { DEFAULT_USEFUL_LIFE_YEARS, type DepreciationMethod } from "@/features/assets/types/assets.types";

/** Minimal asset shape needed for the straight-line preview. */
export interface DepreciableAsset {
    acquisitionDate: string;
    acquisitionValue: number;
    residualValue: number;
    usefulLifeYears: number | null;
    depreciationMethod: DepreciationMethod;
}

function parts(date: string): { y: number; m: number; d: number } {
    const [y, m, d] = date.split("-").map(Number);
    return { y, m, d };
}

function daysInMonth(y: number, m: number): number {
    return new Date(y, m, 0).getDate();
}

/**
 * Mirrors the backend convention: monthly charge starting with the acquisition month (charged in full);
 * a month counts once its last day is reached; in the disposal month the full month is charged.
 */
function monthsCharged(a: DepreciableAsset, date: string, disposalDate: string | null): number {
    const acq = parts(a.acquisitionDate);
    const first = acq.y * 12 + (acq.m - 1);
    const dt = parts(date);
    let last: number;
    if (disposalDate && date >= disposalDate) {
        const dp = parts(disposalDate);
        last = dp.y * 12 + (dp.m - 1);
    } else if (dt.d === daysInMonth(dt.y, dt.m)) {
        last = dt.y * 12 + (dt.m - 1);
    } else {
        last = dt.y * 12 + (dt.m - 1) - 1;
    }
    return last < first ? 0 : last - first + 1;
}

export function accumulatedDepreciationAt(a: DepreciableAsset, date: string, disposalDate: string | null = null): number {
    if (a.acquisitionDate > date) return 0;
    if (a.depreciationMethod !== "STRAIGHT_LINE" || !a.usefulLifeYears || a.usefulLifeYears <= 0) return 0;
    const depreciable = Math.max(a.acquisitionValue - a.residualValue, 0);
    const total = a.usefulLifeYears * 12;
    const n = Math.min(monthsCharged(a, date, disposalDate), total);
    if (n <= 0) return 0;
    return Math.min(Math.round((depreciable * n / total) * 100) / 100, depreciable);
}

/** Net book value at the moment of disposal (cost less depreciation through the disposal month). */
export function nbvAtDisposal(a: DepreciableAsset, disposalDate: string): number {
    return a.acquisitionValue - accumulatedDepreciationAt(a, disposalDate, disposalDate);
}

export function defaultUsefulLife(category: string): number | null {
    return category in DEFAULT_USEFUL_LIFE_YEARS ? DEFAULT_USEFUL_LIFE_YEARS[category] : 5;
}
