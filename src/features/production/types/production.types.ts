// ─── Shared ──────────────────────────────────────────────────────────────────

export interface PageResponse<T> {
    content: T[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

// ─── Load ─────────────────────────────────────────────────────────────────────

export interface Load {
    loadId: string;
    loadType: string;
    startDate: string;
    endDate: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface LoadRequest {
    loadType: string;
    startDate: string;       // ISO date-time, e.g. "2026-07-25T06:00:00"
    endDate?: string | null;
    status?: string;
}

/** Aggregated stats for a single load — returned by GET /api/v1/loads/{id}/summary */
export interface LoadSummary {
    loadId: string;
    loadType: string;
    status: string;
    startDate: string;
    totalLatexCollected: number;
    totalAmmoniaUsed: number;
    recordCount: number;
    lastCollectionAt: string | null;
}

export interface VolumeTrend {
    name: string;
    actual: number;
    target: number | null;
}


// ─── Latex Record ─────────────────────────────────────────────────────────────

export interface LatexRecord {
    recordId: string;
    loadId: string;
    employeeId: string;
    employeeName: string;
    timestamp: string;
    latexAmount: number;
    ammoniaAmount: number;
    metrolacReadingId: string | null;
    createdAt: string;
}

export interface LatexRecordRequest {
    loadId: string;
    employeeId: string;
    timestamp: string;       // ISO date-time
    latexAmount: number;
    ammoniaAmount: number;
    metrolacReadingId?: string | null;
}

// ─── Metrolac Reading ─────────────────────────────────────────────────────────

export interface MetrolacReading {
    metrolacId: string;
    loadId: string;
    temperature: number;
    reading: number | null;
    timestamp: string;
    createdAt: string;
}

export interface MetrolacReadingRequest {
    loadId: string;
    temperature: number;
    reading?: number | null;
    timestamp: string;       // ISO date-time
}

// ─── Ammonia Record ───────────────────────────────────────────────────────────

export interface AmmoniaRecord {
    recordId: string;
    type: string;
    previousAmount: number;
    newAmount: number;
    timestamp: string;
    createdAt: string;
}

export interface AmmoniaRecordRequest {
    type: string;
    previousAmount: number;
    newAmount: number;
    timestamp: string;       // ISO date-time
}

/** Current tank stock — returned by GET /api/v1/ammonia-records/balance */
export interface AmmoniaBalance {
    currentStock: number;
    lastUpdated: string | null;
    changeVsLastWeekPercent: number;
}

/** Daily refill/usage totals — returned by GET /api/v1/ammonia-records/usage */
export interface AmmoniaUsagePoint {
    name: string;
    refill: number;
    out: number;
}

// ─── Rubber Solid Record ──────────────────────────────────────────────────────

export interface RubberSolidRecord {
    recordId: string;
    loadId: string;
    massKg: number;
    timestamp: string;
    createdAt: string;
}

export interface RubberSolidRecordRequest {
    loadId: string;
    massKg: number;
    timestamp: string;       // ISO date-time
}

/** Aggregated stats for a single load — returned by GET /api/v1/rubber-solid-records/load/{id}/summary */
export interface RubberLoadSummary {
    loadId: string;
    loadType: string;
    status: string;
    startDate: string;
    totalMassKg: number;
    recordCount: number;
    lastCollectionAt: string | null;
}

// ─── Calendar ─────────────────────────────────────────────────────────────────

export interface CalendarDay {
    calendarId: string;
    calendarDate: string;    // "YYYY-MM-DD"
    isHoliday: boolean;
    rained: boolean;
    isWorking: boolean;
    description: string | null;
    createdAt: string;
}

export interface CalendarRequest {
    calendarDate: string;    // "YYYY-MM-DD"
    isHoliday?: boolean;
    rained?: boolean;
    isWorking?: boolean;
    description?: string;
}
