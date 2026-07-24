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
    timestamp: string;
    createdAt: string;
}

export interface MetrolacReadingRequest {
    loadId: string;
    temperature: number;
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

// ─── Rubber Solid Record ──────────────────────────────────────────────────────

export interface RubberSolidRecord {
    recordId: string;
    loadId: string;
    massKg: number;
    createdAt: string;
}

export interface RubberSolidRecordRequest {
    loadId: string;
    massKg: number;
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
