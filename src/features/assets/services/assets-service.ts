import type {
    PageResponse,
    EstateLoan, EstateLoanRequest, EstateLoanPaymentRequest,
    FixedAsset, FixedAssetRequest, FixedAssetUpdateRequest, FixedAssetFilters, FixedAssetSummary,
} from "@/features/assets/types/assets.types";

async function handleResponse<T>(res: Response): Promise<T> {
    if (res.status === 204) return undefined as T;
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? "An unexpected error occurred.");
    return data as T;
}

// ─── Estate Loans ───────────────────────────────────────────────────────────

export async function getEstateLoans(): Promise<EstateLoan[]> {
    const res = await fetch("/api/estate-loans/loans");
    return handleResponse(res);
}

export async function createEstateLoan(payload: EstateLoanRequest): Promise<EstateLoan> {
    const res = await fetch("/api/estate-loans/loans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

export async function recordEstateLoanPayment(loanId: string, payload: EstateLoanPaymentRequest): Promise<EstateLoan> {
    const res = await fetch(`/api/estate-loans/loans/${loanId}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

// ─── Fixed Assets ───────────────────────────────────────────────────────────

export async function getFixedAssets(params?: FixedAssetFilters): Promise<PageResponse<FixedAsset>> {
    const qs = new URLSearchParams();
    if (params?.category) qs.set("category", params.category);
    if (params?.status) qs.set("status", params.status);
    if (params?.page !== undefined) qs.set("page", String(params.page));
    if (params?.size !== undefined) qs.set("size", String(params.size));
    const res = await fetch(`/api/fixed-assets?${qs.toString()}`);
    return handleResponse(res);
}

export async function createFixedAsset(payload: FixedAssetRequest): Promise<FixedAsset> {
    const res = await fetch("/api/fixed-assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

export async function updateFixedAsset(id: string, payload: FixedAssetUpdateRequest): Promise<FixedAsset> {
    const res = await fetch(`/api/fixed-assets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

export async function getFixedAssetSummary(): Promise<FixedAssetSummary> {
    const res = await fetch("/api/fixed-assets/summary");
    return handleResponse(res);
}
