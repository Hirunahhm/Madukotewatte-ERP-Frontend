import type { PageResponse, VolumeTrend } from "@/features/production/types/production.types";
import type {
    BananaRecord, BananaRecordRequest, BananaLoadSummary, BananaVarietyBreakdown,
} from "@/features/production/types/banana-production.types";

async function handleResponse<T>(res: Response): Promise<T> {
    if (res.status === 204) return undefined as T;
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? "An unexpected error occurred.");
    return data as T;
}

export async function getBananaRecords(params?: { page?: number; size?: number; variety?: string; from?: string; to?: string }): Promise<PageResponse<BananaRecord>> {
    const qs = new URLSearchParams();
    if (params?.page !== undefined) qs.set("page", String(params.page));
    if (params?.size !== undefined) qs.set("size", String(params.size));
    if (params?.variety) qs.set("variety", params.variety);
    if (params?.from) qs.set("from", params.from);
    if (params?.to) qs.set("to", params.to);
    const res = await fetch(`/api/banana-records?${qs.toString()}`);
    return handleResponse(res);
}

export async function createBananaRecord(payload: BananaRecordRequest): Promise<BananaRecord> {
    const res = await fetch("/api/banana-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

export async function updateBananaRecord(id: string, payload: BananaRecordRequest): Promise<BananaRecord> {
    const res = await fetch(`/api/banana-records/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

export async function deleteBananaRecord(id: string): Promise<void> {
    const res = await fetch(`/api/banana-records/${id}`, { method: "DELETE" });
    return handleResponse(res);
}

export async function getBananaLoadSummary(loadId: string): Promise<BananaLoadSummary> {
    const res = await fetch(`/api/banana-records/load/${loadId}/summary`);
    return handleResponse(res);
}

export async function getBananaLoadTrends(loadId: string, days?: number): Promise<VolumeTrend[]> {
    const qs = new URLSearchParams();
    if (days !== undefined) qs.set("days", String(days));
    const res = await fetch(`/api/banana-records/load/${loadId}/trends?${qs.toString()}`);
    return handleResponse(res);
}

export async function getBananaVarietyBreakdown(params?: { from?: string; to?: string }): Promise<BananaVarietyBreakdown[]> {
    const qs = new URLSearchParams();
    if (params?.from) qs.set("from", params.from);
    if (params?.to) qs.set("to", params.to);
    const res = await fetch(`/api/banana-records/variety-breakdown?${qs.toString()}`);
    return handleResponse(res);
}
