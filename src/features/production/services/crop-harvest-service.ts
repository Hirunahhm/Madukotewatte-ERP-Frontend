import type {
    CropHarvest, CropHarvestRequest, CropHarvestSummaryRow, CropHarvestOptions, PageResponse,
} from "@/features/production/types/crop-harvest.types";

async function handleResponse<T>(res: Response): Promise<T> {
    if (res.status === 204) return undefined as T;
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? "An unexpected error occurred.");
    return data as T;
}

export async function getCropHarvests(params?: { crop?: string; from?: string; to?: string; page?: number; size?: number }): Promise<PageResponse<CropHarvest>> {
    const qs = new URLSearchParams();
    if (params?.crop) qs.set("crop", params.crop);
    if (params?.from) qs.set("from", params.from);
    if (params?.to) qs.set("to", params.to);
    if (params?.page !== undefined) qs.set("page", String(params.page));
    if (params?.size !== undefined) qs.set("size", String(params.size));
    return handleResponse(await fetch(`/api/crop-harvests?${qs.toString()}`));
}

export async function getCropHarvestSummary(range?: { from?: string; to?: string }): Promise<CropHarvestSummaryRow[]> {
    const qs = new URLSearchParams();
    if (range?.from) qs.set("from", range.from);
    if (range?.to) qs.set("to", range.to);
    return handleResponse(await fetch(`/api/crop-harvests/summary?${qs.toString()}`));
}

export async function getCropHarvestOptions(): Promise<CropHarvestOptions> {
    return handleResponse(await fetch("/api/crop-harvests/options"));
}

export async function createCropHarvest(payload: CropHarvestRequest): Promise<CropHarvest> {
    return handleResponse(await fetch("/api/crop-harvests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    }));
}

export async function updateCropHarvest(id: string, payload: CropHarvestRequest): Promise<CropHarvest> {
    return handleResponse(await fetch(`/api/crop-harvests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    }));
}

export async function deleteCropHarvest(id: string): Promise<void> {
    return handleResponse(await fetch(`/api/crop-harvests/${id}`, { method: "DELETE" }));
}
