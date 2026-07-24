import type {
    PageResponse,
    Load, LoadRequest,
    LatexRecord, LatexRecordRequest,
    MetrolacReading, MetrolacReadingRequest,
    AmmoniaRecord, AmmoniaRecordRequest,
    RubberSolidRecord, RubberSolidRecordRequest,
    CalendarDay, CalendarRequest,
} from "@/features/production/types/production.types";

async function handleResponse<T>(res: Response): Promise<T> {
    if (res.status === 204) return undefined as T;
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? "An unexpected error occurred.");
    return data as T;
}

// ─── Loads ────────────────────────────────────────────────────────────────────

export async function getLoads(params?: { page?: number; size?: number }): Promise<PageResponse<Load>> {
    const qs = new URLSearchParams();
    if (params?.page !== undefined) qs.set("page", String(params.page));
    if (params?.size !== undefined) qs.set("size", String(params.size));
    const res = await fetch(`/api/loads?${qs.toString()}`);
    return handleResponse(res);
}

export async function createLoad(payload: LoadRequest): Promise<Load> {
    const res = await fetch("/api/loads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

export async function updateLoad(id: string, payload: Partial<LoadRequest>): Promise<Load> {
    const res = await fetch(`/api/loads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

export async function deleteLoad(id: string): Promise<void> {
    const res = await fetch(`/api/loads/${id}`, { method: "DELETE" });
    return handleResponse(res);
}

// ─── Latex Records ────────────────────────────────────────────────────────────

export async function getLatexRecords(params?: { page?: number; size?: number }): Promise<PageResponse<LatexRecord>> {
    const qs = new URLSearchParams();
    if (params?.page !== undefined) qs.set("page", String(params.page));
    if (params?.size !== undefined) qs.set("size", String(params.size));
    const res = await fetch(`/api/latex-records?${qs.toString()}`);
    return handleResponse(res);
}

export async function getLatexRecordsByLoad(loadId: string): Promise<LatexRecord[]> {
    const res = await fetch(`/api/latex-records/load/${loadId}`);
    return handleResponse(res);
}

export async function createLatexRecord(payload: LatexRecordRequest): Promise<LatexRecord> {
    const res = await fetch("/api/latex-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

// ─── Metrolac Readings ────────────────────────────────────────────────────────

export async function getMetrolacReadings(params?: { page?: number; size?: number }): Promise<PageResponse<MetrolacReading>> {
    const qs = new URLSearchParams();
    if (params?.page !== undefined) qs.set("page", String(params.page));
    if (params?.size !== undefined) qs.set("size", String(params.size));
    const res = await fetch(`/api/metrolac-readings?${qs.toString()}`);
    return handleResponse(res);
}

export async function createMetrolacReading(payload: MetrolacReadingRequest): Promise<MetrolacReading> {
    const res = await fetch("/api/metrolac-readings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

// ─── Ammonia Records ──────────────────────────────────────────────────────────

export async function getAmmoniaRecords(params?: { page?: number; size?: number }): Promise<PageResponse<AmmoniaRecord>> {
    const qs = new URLSearchParams();
    if (params?.page !== undefined) qs.set("page", String(params.page));
    if (params?.size !== undefined) qs.set("size", String(params.size));
    const res = await fetch(`/api/ammonia-records?${qs.toString()}`);
    return handleResponse(res);
}

export async function createAmmoniaRecord(payload: AmmoniaRecordRequest): Promise<AmmoniaRecord> {
    const res = await fetch("/api/ammonia-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

// ─── Rubber Solid Records ─────────────────────────────────────────────────────

export async function getRubberSolidRecords(params?: { page?: number; size?: number }): Promise<PageResponse<RubberSolidRecord>> {
    const qs = new URLSearchParams();
    if (params?.page !== undefined) qs.set("page", String(params.page));
    if (params?.size !== undefined) qs.set("size", String(params.size));
    const res = await fetch(`/api/rubber-solid-records?${qs.toString()}`);
    return handleResponse(res);
}

export async function createRubberSolidRecord(payload: RubberSolidRecordRequest): Promise<RubberSolidRecord> {
    const res = await fetch("/api/rubber-solid-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

// ─── Calendar ─────────────────────────────────────────────────────────────────

export async function getCalendarDays(params?: { page?: number; size?: number }): Promise<PageResponse<CalendarDay>> {
    const qs = new URLSearchParams();
    if (params?.page !== undefined) qs.set("page", String(params.page));
    if (params?.size !== undefined) qs.set("size", String(params.size));
    const res = await fetch(`/api/calendar?${qs.toString()}`);
    return handleResponse(res);
}

export async function upsertCalendarDay(payload: CalendarRequest): Promise<CalendarDay> {
    const res = await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}
