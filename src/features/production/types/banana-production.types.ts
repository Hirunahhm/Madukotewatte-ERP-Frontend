export const BANANA_VARIETIES = [
    "Kolikuttu",
    "Ambul",
    "Seeni Kesel",
    "Anamalu",
    "Rathkesel",
    "Suwandel",
    "Other",
] as const;

export type BananaVariety = (typeof BANANA_VARIETIES)[number];

export interface BananaRecord {
    recordId: string;
    loadId: string;
    employeeId: string;
    employeeName: string;
    variety: string;
    varietyNote: string | null;
    bunchCount: number | null;
    massKg: number | null;
    timestamp: string;
    createdAt: string;
}

export interface BananaRecordRequest {
    loadId: string;
    employeeId: string;
    variety: string;
    varietyNote?: string | null;
    bunchCount?: number | null;
    massKg?: number | null;
    timestamp: string;       // ISO date-time
}

/** Aggregated stats for a single load — returned by GET /api/v1/banana-records/load/{id}/summary */
export interface BananaLoadSummary {
    loadId: string;
    loadType: string;
    status: string;
    startDate: string;
    totalMassKg: number;
    totalBunchCount: number;
    recordCount: number;
    lastCollectionAt: string | null;
}

/** Volume by variety over a period — returned by GET /api/v1/banana-records/variety-breakdown */
export interface BananaVarietyBreakdown {
    variety: string;
    totalMassKg: number;
    totalBunchCount: number;
    recordCount: number;
}
