export type ReportPeriod =
    | { kind: "year"; year: number }
    | { kind: "quarter"; year: number; quarter: 1 | 2 | 3 | 4 };

export type ReportScope = "consolidated" | "financials" | "cash-debt" | "assets";

export type ReportFormat = "pdf" | "excel";

export interface ResolvedRange {
    from: string;
    to: string;
    label: string;
}
