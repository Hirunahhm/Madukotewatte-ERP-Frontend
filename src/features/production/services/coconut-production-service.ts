import type { PageResponse, VolumeTrend } from "@/features/production/types/production.types";
import type {
    CoconutRecord, CoconutRecordRequest, CoconutLoadSummary, CoconutVarietyBreakdown,
} from "@/features/production/types/coconut-production.types";

async function handleResponse<T>(res: Response): Promise<T> {
    if (res.status === 204) return undefined as T;
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? "An unexpected error occurred.");
    return data as T;
}

export async function getCoconutRecords(params?: { page?: number; size?: number; variety?: string; from?: string; to?: string }): Promise<PageResponse<CoconutRecord>> {
    const qs = new URLSearchParams();
    if (params?.page !== undefined) qs.set("page", String(params.page));
    if (params?.size !== undefined) qs.set("size", String(params.size));
    if (params?.variety) qs.set("variety", params.variety);
    if (params?.from) qs.set("from", params.from);
    if (params?.to) qs.set("to", params.to);
    const res = await fetch(`/api/coconut-records?${qs.toString()}`);
    return handleResponse(res);
}

export async function createCoconutRecord(payload: CoconutRecordRequest): Promise<CoconutRecord> {
    const res = await fetch("/api/coconut-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

export async function updateCoconutRecord(id: string, payload: CoconutRecordRequest): Promise<CoconutRecord> {
    const res = await fetch(`/api/coconut-records/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

export async function deleteCoconutRecord(id: string): Promise<void> {
    const res = await fetch(`/api/coconut-records/${id}`, { method: "DELETE" });
    return handleResponse(res);
}

export async function getCoconutLoadSummary(loadId: string): Promise<CoconutLoadSummary> {
    const res = await fetch(`/api/coconut-records/load/${loadId}/summary`);
    return handleResponse(res);
}

export async function getCoconutLoadTrends(loadId: string, days?: number): Promise<VolumeTrend[]> {
    const qs = new URLSearchParams();
    if (days !== undefined) qs.set("days", String(days));
    const res = await fetch(`/api/coconut-records/load/${loadId}/trends?${qs.toString()}`);
    return handleResponse(res);
}

export async function getCoconutVarietyBreakdown(params?: { from?: string; to?: string }): Promise<CoconutVarietyBreakdown[]> {
    const qs = new URLSearchParams();
    if (params?.from) qs.set("from", params.from);
    if (params?.to) qs.set("to", params.to);
    const res = await fetch(`/api/coconut-records/variety-breakdown?${qs.toString()}`);
    return handleResponse(res);
}
