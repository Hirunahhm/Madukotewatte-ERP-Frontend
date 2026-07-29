import type {
    PageResponse, SaleCategory,
    SaleLatex, SaleLatexRequest, SaleLatexMarkPaidRequest,
    SaleCrop, SaleCropRequest, SaleMarkPaidRequest,
    SalesLedgerRow, SalesSummary, CategoryTotal, TrendPoint, TrendScale,
    Expense, ExpenseRequest, ExpenseMarkPaidRequest, ExpenseSummary,
    MonetaryAssetTransactionRequest, MonetaryAssetTransactionResponse,
    EstateLoanTransactionRequest, EstateLoanTransactionResponse,
} from "@/features/financials/types/financials.types";

async function handleResponse<T>(res: Response): Promise<T> {
    if (res.status === 204) return undefined as T;
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? "An unexpected error occurred.");
    return data as T;
}

const SALE_CROP_PATH: Record<Exclude<SaleCategory, "latex">, string> = {
    "rubber-solid": "rubber-solid",
    "manioc": "manioc",
    "coconut": "coconut",
    "banana": "banana",
};

// ─── Sales Latex ────────────────────────────────────────────────────────────

export async function createSaleLatex(payload: SaleLatexRequest): Promise<SaleLatex> {
    const res = await fetch("/api/sales/latex", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

export async function markSaleLatexPaid(id: string, payload: SaleLatexMarkPaidRequest): Promise<SaleLatex> {
    const res = await fetch(`/api/sales/latex/${id}/payment`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

// ─── Sales Rubber Solid / Manioc / Coconut / Banana ────────────────────────

export async function createSaleCrop(category: Exclude<SaleCategory, "latex">, payload: SaleCropRequest): Promise<SaleCrop> {
    const res = await fetch(`/api/sales/${SALE_CROP_PATH[category]}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

export async function markSaleCropPaid(category: Exclude<SaleCategory, "latex">, id: string, payload: SaleMarkPaidRequest): Promise<SaleCrop> {
    const res = await fetch(`/api/sales/${SALE_CROP_PATH[category]}/${id}/payment`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

// ─── Sales Ledger + Stats ───────────────────────────────────────────────────

export async function getSalesLedger(params?: { category?: string; status?: string; from?: string; to?: string; page?: number; size?: number }): Promise<PageResponse<SalesLedgerRow>> {
    const qs = new URLSearchParams();
    if (params?.category) qs.set("category", params.category);
    if (params?.status) qs.set("status", params.status);
    if (params?.from) qs.set("from", params.from);
    if (params?.to) qs.set("to", params.to);
    if (params?.page !== undefined) qs.set("page", String(params.page));
    if (params?.size !== undefined) qs.set("size", String(params.size));
    const res = await fetch(`/api/finance/sales/ledger?${qs.toString()}`);
    return handleResponse(res);
}

export async function getSalesSummary(range?: { from?: string; to?: string }): Promise<SalesSummary> {
    const qs = new URLSearchParams();
    if (range?.from) qs.set("from", range.from);
    if (range?.to) qs.set("to", range.to);
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    const res = await fetch(`/api/finance/sales/summary${suffix}`);
    return handleResponse(res);
}

export async function getSalesDistribution(range?: { from?: string; to?: string }): Promise<CategoryTotal[]> {
    const qs = new URLSearchParams();
    if (range?.from) qs.set("from", range.from);
    if (range?.to) qs.set("to", range.to);
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    const res = await fetch(`/api/finance/sales/distribution${suffix}`);
    return handleResponse(res);
}

export async function getSalesTrend(scale: TrendScale): Promise<TrendPoint[]> {
    const res = await fetch(`/api/finance/sales/trend?scale=${scale}`);
    return handleResponse(res);
}

// ─── Expenses ───────────────────────────────────────────────────────────────

export async function getExpenses(params?: { type?: string; isPaid?: boolean; from?: string; to?: string; page?: number; size?: number }): Promise<PageResponse<Expense>> {
    const qs = new URLSearchParams();
    if (params?.type) qs.set("type", params.type);
    if (params?.isPaid !== undefined) qs.set("isPaid", String(params.isPaid));
    if (params?.from) qs.set("from", params.from);
    if (params?.to) qs.set("to", params.to);
    if (params?.page !== undefined) qs.set("page", String(params.page));
    if (params?.size !== undefined) qs.set("size", String(params.size));
    const res = await fetch(`/api/expenses?${qs.toString()}`);
    return handleResponse(res);
}

export async function createExpense(payload: ExpenseRequest): Promise<Expense> {
    const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

export async function updateExpense(id: string, payload: ExpenseRequest): Promise<Expense> {
    const res = await fetch(`/api/expenses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

export async function deleteExpense(id: string): Promise<void> {
    const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
    return handleResponse(res);
}

export async function markExpensePaid(id: string, payload: ExpenseMarkPaidRequest): Promise<Expense> {
    const res = await fetch(`/api/expenses/${id}/payment`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

export async function getExpenseSummary(range?: { from?: string; to?: string }): Promise<ExpenseSummary> {
    const qs = new URLSearchParams();
    if (range?.from) qs.set("from", range.from);
    if (range?.to) qs.set("to", range.to);
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    const res = await fetch(`/api/expenses/summary${suffix}`);
    return handleResponse(res);
}

export async function getExpenseDistribution(range?: { from?: string; to?: string }): Promise<CategoryTotal[]> {
    const qs = new URLSearchParams();
    if (range?.from) qs.set("from", range.from);
    if (range?.to) qs.set("to", range.to);
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    const res = await fetch(`/api/expenses/distribution${suffix}`);
    return handleResponse(res);
}

export async function getExpenseTrend(scale: TrendScale): Promise<TrendPoint[]> {
    const res = await fetch(`/api/expenses/trend?scale=${scale}`);
    return handleResponse(res);
}

// ─── Ledger transactions (used to compose the "mark paid" flow) ───────────

export async function createMonetaryTransaction(payload: MonetaryAssetTransactionRequest): Promise<MonetaryAssetTransactionResponse> {
    const res = await fetch("/api/monetary-assets/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

export async function createEstateLoanTransaction(payload: EstateLoanTransactionRequest): Promise<EstateLoanTransactionResponse> {
    const res = await fetch("/api/estate-loans/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}
