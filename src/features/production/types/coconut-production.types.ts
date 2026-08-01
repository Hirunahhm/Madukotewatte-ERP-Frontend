export const COCONUT_VARIETIES = [
    "Sri Lanka Tall",
    "King Coconut (Thembili)",
    "Green Dwarf",
    "Yellow Dwarf",
    "CRIC-65",
    "San Ramon",
    "Other",
] as const;

export type CoconutVariety = (typeof COCONUT_VARIETIES)[number];

export interface CoconutRecord {
    recordId: string;
    loadId: string;
    employeeId: string;
    employeeName: string;
    variety: string;
    varietyNote: string | null;
    nutCount: number | null;
    massKg: number | null;
    timestamp: string;
    createdAt: string;
}

export interface CoconutRecordRequest {
    loadId: string;
    employeeId: string;
    variety: string;
    varietyNote?: string | null;
    nutCount?: number | null;
    massKg?: number | null;
    timestamp: string;       // ISO date-time
}

/** Aggregated stats for a single load — returned by GET /api/v1/coconut-records/load/{id}/summary */
export interface CoconutLoadSummary {
    loadId: string;
    loadType: string;
    status: string;
    startDate: string;
    totalMassKg: number;
    totalNutCount: number;
    recordCount: number;
    lastCollectionAt: string | null;
}

/** Volume by variety over a period — returned by GET /api/v1/coconut-records/variety-breakdown */
export interface CoconutVarietyBreakdown {
    variety: string;
    totalMassKg: number;
    totalNutCount: number;
    recordCount: number;
}
