/** "12.4k" / "1.2M" style short LKR figure for axes and tight cards. */
export function compactNumber(value: number): string {
    const abs = Math.abs(value);
    const sign = value < 0 ? "-" : "";
    if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(1)}M`;
    if (abs >= 1_000) return `${sign}${(abs / 1_000).toFixed(abs >= 10_000 ? 0 : 1)}k`;
    return `${sign}${abs.toFixed(0)}`;
}

/** Percentage change of `current` against `previous`; null when there is nothing to compare with. */
export function percentChange(current: number, previous: number): number | null {
    if (previous === 0) return null;
    return ((current - previous) / Math.abs(previous)) * 100;
}

export function formatQuantity(value: number): string {
    return value.toLocaleString(undefined, { maximumFractionDigits: 1 });
}

export const PAY_TYPE_LABEL: Record<string, string> = {
    FIXED_MONTHLY: "Monthly salary",
    PER_TREE: "Per tree",
    HOURLY: "Hourly",
};

export const NO_WORK_LABEL: Record<string, string> = {
    rain: "Rain",
    sick: "Sick",
    public_holiday: "Public holiday",
    other: "Other",
    funeral: "Funeral",
    family_matter: "Family matter",
    kids: "Kids",
};

/** "2026-10" -> "Oct 26" */
export function shortMonthLabel(month: string): string {
    const [year, m] = month.split("-").map(Number);
    return new Date(year, m - 1, 1).toLocaleDateString(undefined, { month: "short", year: "2-digit" });
}
