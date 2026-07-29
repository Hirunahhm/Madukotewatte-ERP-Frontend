import type {
    PageResponse, TrendPoint, TrendScale,
    AssetBalance, EstateLoanBalance,
    MonetaryTransactionFilters, LoanTransactionFilters,
    MonetaryAssetTransactionResponse, EstateLoanTransactionResponse,
    CreditCardStatement, CreditCardLimit, UpdateCreditCardLimitRequest,
} from "@/features/assets/types/assets.types";

async function handleResponse<T>(res: Response): Promise<T> {
    if (res.status === 204) return undefined as T;
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? "An unexpected error occurred.");
    return data as T;
}

// ─── Monetary Assets ────────────────────────────────────────────────────────

export async function getAssetBalances(): Promise<AssetBalance[]> {
    const res = await fetch("/api/monetary-assets/balances");
    return handleResponse(res);
}

export async function getMonetaryTrend(scale: TrendScale): Promise<TrendPoint[]> {
    const res = await fetch(`/api/monetary-assets/trend?scale=${scale}`);
    return handleResponse(res);
}

export async function getMonetaryTransactions(params?: MonetaryTransactionFilters): Promise<PageResponse<MonetaryAssetTransactionResponse>> {
    const qs = new URLSearchParams();
    if (params?.assetType) qs.set("assetType", params.assetType);
    if (params?.transactionType) qs.set("transactionType", params.transactionType);
    if (params?.from) qs.set("from", params.from);
    if (params?.to) qs.set("to", params.to);
    if (params?.page !== undefined) qs.set("page", String(params.page));
    if (params?.size !== undefined) qs.set("size", String(params.size));
    const res = await fetch(`/api/monetary-assets/transactions?${qs.toString()}`);
    return handleResponse(res);
}

// ─── Estate Loans ───────────────────────────────────────────────────────────

export async function getLoanBalances(): Promise<EstateLoanBalance[]> {
    const res = await fetch("/api/estate-loans/balances");
    return handleResponse(res);
}

export async function getLoanTrend(scale: TrendScale): Promise<TrendPoint[]> {
    const res = await fetch(`/api/estate-loans/trend?scale=${scale}`);
    return handleResponse(res);
}

export async function getLoanTransactions(params?: LoanTransactionFilters): Promise<PageResponse<EstateLoanTransactionResponse>> {
    const qs = new URLSearchParams();
    if (params?.loanType) qs.set("loanType", params.loanType);
    if (params?.transactionType) qs.set("transactionType", params.transactionType);
    if (params?.from) qs.set("from", params.from);
    if (params?.to) qs.set("to", params.to);
    if (params?.page !== undefined) qs.set("page", String(params.page));
    if (params?.size !== undefined) qs.set("size", String(params.size));
    const res = await fetch(`/api/estate-loans/transactions?${qs.toString()}`);
    return handleResponse(res);
}

// ─── Credit Cards ───────────────────────────────────────────────────────────

export async function getCreditCardStatement(loanType: string, from: string, to: string): Promise<CreditCardStatement> {
    const qs = new URLSearchParams({ loanType, from, to });
    const res = await fetch(`/api/estate-loans/credit-cards/statement?${qs.toString()}`);
    return handleResponse(res);
}

export async function getCreditCardLimits(): Promise<CreditCardLimit[]> {
    const res = await fetch("/api/estate-loans/credit-cards/limits");
    return handleResponse(res);
}

export async function updateCreditCardLimit(payload: UpdateCreditCardLimitRequest): Promise<CreditCardLimit> {
    const res = await fetch("/api/estate-loans/credit-cards/limits", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}
