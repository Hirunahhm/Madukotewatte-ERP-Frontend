import type {
    PageResponse,
    EstateLoan, EstateLoanRequest, EstateLoanUpdateRequest, EstateLoanPaymentRequest, EstateLoanDrawdownRequest,
    EstateLoanMovement, BorrowingSchedule,
    FixedAsset, FixedAssetRequest, FixedAssetUpdateRequest, FixedAssetDisposalRequest, FixedAssetFilters,
    FixedAssetSummary, DepreciationSchedule,
} from "@/features/assets/types/assets.types";

async function handleResponse<T>(res: Response): Promise<T> {
    if (res.status === 204) return undefined as T;
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? "An unexpected error occurred.");
    return data as T;
}

function sendJson(method: string, url: string, payload?: unknown): Promise<Response> {
    return fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: payload === undefined ? undefined : JSON.stringify(payload),
    });
}

// ─── Estate Loans ───────────────────────────────────────────────────────────

export async function getEstateLoans(): Promise<EstateLoan[]> {
    return handleResponse(await fetch("/api/estate-loans/loans"));
}

export async function createEstateLoan(payload: EstateLoanRequest): Promise<EstateLoan> {
    return handleResponse(await sendJson("POST", "/api/estate-loans/loans", payload));
}

export async function updateEstateLoan(loanId: string, payload: EstateLoanUpdateRequest): Promise<EstateLoan> {
    return handleResponse(await sendJson("PUT", `/api/estate-loans/loans/${loanId}`, payload));
}

export async function deleteEstateLoan(loanId: string): Promise<void> {
    return handleResponse(await fetch(`/api/estate-loans/loans/${loanId}`, { method: "DELETE" }));
}

export async function recordEstateLoanPayment(loanId: string, payload: EstateLoanPaymentRequest): Promise<EstateLoan> {
    return handleResponse(await sendJson("POST", `/api/estate-loans/loans/${loanId}/payments`, payload));
}

export async function recordEstateLoanDrawdown(loanId: string, payload: EstateLoanDrawdownRequest): Promise<EstateLoan> {
    return handleResponse(await sendJson("POST", `/api/estate-loans/loans/${loanId}/drawdowns`, payload));
}

export async function undoLastLoanMovement(loanId: string): Promise<EstateLoan> {
    return handleResponse(await fetch(`/api/estate-loans/loans/${loanId}/movements/latest`, { method: "DELETE" }));
}

export async function getLoanMovements(loanId: string): Promise<EstateLoanMovement[]> {
    return handleResponse(await fetch(`/api/estate-loans/loans/${loanId}/movements`));
}

export async function getBorrowingSchedule(from: string, to: string): Promise<BorrowingSchedule> {
    const qs = new URLSearchParams({ from, to });
    return handleResponse(await fetch(`/api/estate-loans/schedule?${qs.toString()}`));
}

// ─── Fixed Assets ───────────────────────────────────────────────────────────

export async function getFixedAssets(params?: FixedAssetFilters): Promise<PageResponse<FixedAsset>> {
    const qs = new URLSearchParams();
    if (params?.category) qs.set("category", params.category);
    if (params?.status) qs.set("status", params.status);
    if (params?.page !== undefined) qs.set("page", String(params.page));
    if (params?.size !== undefined) qs.set("size", String(params.size));
    return handleResponse(await fetch(`/api/fixed-assets?${qs.toString()}`));
}

export async function createFixedAsset(payload: FixedAssetRequest): Promise<FixedAsset> {
    return handleResponse(await sendJson("POST", "/api/fixed-assets", payload));
}

export async function updateFixedAsset(id: string, payload: FixedAssetUpdateRequest): Promise<FixedAsset> {
    return handleResponse(await sendJson("PATCH", `/api/fixed-assets/${id}`, payload));
}

export async function disposeFixedAsset(id: string, payload: FixedAssetDisposalRequest): Promise<FixedAsset> {
    return handleResponse(await sendJson("POST", `/api/fixed-assets/${id}/dispose`, payload));
}

export async function deleteFixedAsset(id: string): Promise<void> {
    return handleResponse(await fetch(`/api/fixed-assets/${id}`, { method: "DELETE" }));
}

export async function getFixedAssetSummary(): Promise<FixedAssetSummary> {
    return handleResponse(await fetch("/api/fixed-assets/summary"));
}

export async function getDepreciationSchedule(from: string, to: string): Promise<DepreciationSchedule> {
    const qs = new URLSearchParams({ from, to });
    return handleResponse(await fetch(`/api/fixed-assets/depreciation?${qs.toString()}`));
}
