export const MANIOC_VARIETIES = [
    "Kirikawadi",
    "MU-51",
    "Suranimala",
    "Ambakumbura",
    "CARI-555",
    "Other",
] as const;

export type ManiocVariety = (typeof MANIOC_VARIETIES)[number];

export interface ManiocRecord {
    recordId: string;
    loadId: string;
    employeeId: string;
    employeeName: string;
    variety: string;
    varietyNote: string | null;
    massKg: number;
    timestamp: string;
    createdAt: string;
}

export interface ManiocRecordRequest {
    loadId: string;
    employeeId: string;
    variety: string;
    varietyNote?: string | null;
    massKg: number;
    timestamp: string;       // ISO date-time
}

/** Aggregated stats for a single load — returned by GET /api/v1/manioc-records/load/{id}/summary */
export interface ManiocLoadSummary {
    loadId: string;
    loadType: string;
    status: string;
    startDate: string;
    totalMassKg: number;
    recordCount: number;
    lastCollectionAt: string | null;
}

/** Volume by variety over a period — returned by GET /api/v1/manioc-records/variety-breakdown */
export interface ManiocVarietyBreakdown {
    variety: string;
    totalMassKg: number;
    recordCount: number;
}
