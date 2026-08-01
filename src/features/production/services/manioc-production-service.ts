import type { PageResponse, VolumeTrend } from "@/features/production/types/production.types";
import type {
    ManiocRecord, ManiocRecordRequest, ManiocLoadSummary, ManiocVarietyBreakdown,
} from "@/features/production/types/manioc-production.types";

async function handleResponse<T>(res: Response): Promise<T> {
    if (res.status === 204) return undefined as T;
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? "An unexpected error occurred.");
    return data as T;
}

export async function getManiocRecords(params?: { page?: number; size?: number; variety?: string; from?: string; to?: string }): Promise<PageResponse<ManiocRecord>> {
    const qs = new URLSearchParams();
    if (params?.page !== undefined) qs.set("page", String(params.page));
    if (params?.size !== undefined) qs.set("size", String(params.size));
    if (params?.variety) qs.set("variety", params.variety);
    if (params?.from) qs.set("from", params.from);
    if (params?.to) qs.set("to", params.to);
    const res = await fetch(`/api/manioc-records?${qs.toString()}`);
    return handleResponse(res);
}

export async function createManiocRecord(payload: ManiocRecordRequest): Promise<ManiocRecord> {
    const res = await fetch("/api/manioc-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

export async function updateManiocRecord(id: string, payload: ManiocRecordRequest): Promise<ManiocRecord> {
    const res = await fetch(`/api/manioc-records/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

export async function deleteManiocRecord(id: string): Promise<void> {
    const res = await fetch(`/api/manioc-records/${id}`, { method: "DELETE" });
    return handleResponse(res);
}

export async function getManiocLoadSummary(loadId: string): Promise<ManiocLoadSummary> {
    const res = await fetch(`/api/manioc-records/load/${loadId}/summary`);
    return handleResponse(res);
}

export async function getManiocLoadTrends(loadId: string, days?: number): Promise<VolumeTrend[]> {
    const qs = new URLSearchParams();
    if (days !== undefined) qs.set("days", String(days));
    const res = await fetch(`/api/manioc-records/load/${loadId}/trends?${qs.toString()}`);
    return handleResponse(res);
}

export async function getManiocVarietyBreakdown(params?: { from?: string; to?: string }): Promise<ManiocVarietyBreakdown[]> {
    const qs = new URLSearchParams();
    if (params?.from) qs.set("from", params.from);
    if (params?.to) qs.set("to", params.to);
    const res = await fetch(`/api/manioc-records/variety-breakdown?${qs.toString()}`);
    return handleResponse(res);
}
