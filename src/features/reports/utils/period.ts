import type { ReportPeriod, ResolvedRange } from "@/features/reports/types/report.types";

const QUARTER_BOUNDS: Record<1 | 2 | 3 | 4, [string, string]> = {
    1: ["01-01", "03-31"],
    2: ["04-01", "06-30"],
    3: ["07-01", "09-30"],
    4: ["10-01", "12-31"],
};

export function resolvePeriod(period: ReportPeriod): ResolvedRange {
    if (period.kind === "year") {
        return {
            from: `${period.year}-01-01`,
            to: `${period.year}-12-31`,
            label: `FY ${period.year}`,
        };
    }
    const [start, end] = QUARTER_BOUNDS[period.quarter];
    return {
        from: `${period.year}-${start}`,
        to: `${period.year}-${end}`,
        label: `Q${period.quarter} ${period.year}`,
    };
}
