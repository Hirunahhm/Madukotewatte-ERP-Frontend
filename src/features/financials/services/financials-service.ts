import type {
    PageResponse, SaleType,
    SaleLatex, SaleLatexRequest,
    SaleCrop, SaleCropRequest, SaleMarkPaidRequest,
    SaleGeneral, SaleGeneralRequest, SaleGeneralOptions, SaleDetail, SaleUpdatePayload,
    SalesLedgerRow, SalesSummary, CategoryTotal, TrendPoint, TrendScale,
    Receivables, Payables,
    Expense, ExpenseRequest, ExpenseMarkPaidRequest, ExpenseSummary,
} from "@/features/financials/types/financials.types";

async function handleResponse<T>(res: Response): Promise<T> {
    if (res.status === 204) return undefined as T;
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? "An unexpected error occurred.");
    return data as T;
}

function jsonRequest(method: string, body?: unknown): RequestInit {
    return {
        method,
        headers: { "Content-Type": "application/json" },
        body: body === undefined ? undefined : JSON.stringify(body),
    };
}

function rangeQuery(range?: { from?: string; to?: string }): string {
    const qs = new URLSearchParams();
    if (range?.from) qs.set("from", range.from);
    if (range?.to) qs.set("to", range.to);
    return qs.toString() ? `?${qs.toString()}` : "";
}

// ─── Sales (create) ─────────────────────────────────────────────────────────

export async function createSaleLatex(payload: SaleLatexRequest): Promise<SaleLatex> {
    return handleResponse(await fetch("/api/sales/latex", jsonRequest("POST", payload)));
}

export async function createSaleCrop(category: Exclude<SaleType, "latex" | "general">, payload: SaleCropRequest): Promise<SaleCrop> {
    return handleResponse(await fetch(`/api/sales/${category}`, jsonRequest("POST", payload)));
}

export async function createSaleGeneral(payload: SaleGeneralRequest): Promise<SaleGeneral> {
    return handleResponse(await fetch("/api/sales/general", jsonRequest("POST", payload)));
}

export async function getSaleGeneralOptions(): Promise<SaleGeneralOptions> {
    return handleResponse(await fetch("/api/sales/general/options"));
}

// ─── Sales (any type: detail, edit, delete, payment) ───────────────────────

export async function getSale(type: SaleType, id: string): Promise<SaleDetail> {
    return handleResponse(await fetch(`/api/sales/${type}/${id}`));
}

export async function updateSale(type: SaleType, id: string, payload: SaleUpdatePayload): Promise<SaleDetail> {
    return handleResponse(await fetch(`/api/sales/${type}/${id}`, jsonRequest("PUT", payload)));
}

export async function deleteSale(type: SaleType, id: string): Promise<void> {
    return handleResponse(await fetch(`/api/sales/${type}/${id}`, { method: "DELETE" }));
}

export async function markSalePaid(type: SaleType, id: string, payload: SaleMarkPaidRequest): Promise<SaleDetail> {
    return handleResponse(await fetch(`/api/sales/${type}/${id}/payment`, jsonRequest("PUT", payload)));
}

export async function undoSalePayment(type: SaleType, id: string): Promise<SaleDetail> {
    return handleResponse(await fetch(`/api/sales/${type}/${id}/payment/undo`, { method: "POST" }));
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
    return handleResponse(await fetch(`/api/finance/sales/ledger?${qs.toString()}`));
}

export async function getSalesSummary(range?: { from?: string; to?: string }): Promise<SalesSummary> {
    return handleResponse(await fetch(`/api/finance/sales/summary${rangeQuery(range)}`));
}

export async function getSalesDistribution(range?: { from?: string; to?: string }): Promise<CategoryTotal[]> {
    return handleResponse(await fetch(`/api/finance/sales/distribution${rangeQuery(range)}`));
}

export async function getSalesTrend(scale: TrendScale): Promise<TrendPoint[]> {
    return handleResponse(await fetch(`/api/finance/sales/trend?scale=${scale}`));
}

export async function getReceivables(asOf?: string): Promise<Receivables> {
    return handleResponse(await fetch(`/api/finance/receivables${asOf ? `?asOf=${asOf}` : ""}`));
}

// ─── Expenses ───────────────────────────────────────────────────────────────

export async function getExpenseCategories(): Promise<string[]> {
    return handleResponse(await fetch("/api/expenses/categories"));
}

export async function getExpenses(params?: { type?: string; payee?: string; isPaid?: boolean; from?: string; to?: string; page?: number; size?: number }): Promise<PageResponse<Expense>> {
    const qs = new URLSearchParams();
    if (params?.type) qs.set("type", params.type);
    if (params?.payee) qs.set("payee", params.payee);
    if (params?.isPaid !== undefined) qs.set("isPaid", String(params.isPaid));
    if (params?.from) qs.set("from", params.from);
    if (params?.to) qs.set("to", params.to);
    if (params?.page !== undefined) qs.set("page", String(params.page));
    if (params?.size !== undefined) qs.set("size", String(params.size));
    return handleResponse(await fetch(`/api/expenses?${qs.toString()}`));
}

export async function createExpense(payload: ExpenseRequest): Promise<Expense> {
    return handleResponse(await fetch("/api/expenses", jsonRequest("POST", payload)));
}

export async function updateExpense(id: string, payload: ExpenseRequest): Promise<Expense> {
    return handleResponse(await fetch(`/api/expenses/${id}`, jsonRequest("PUT", payload)));
}

export async function deleteExpense(id: string): Promise<void> {
    return handleResponse(await fetch(`/api/expenses/${id}`, { method: "DELETE" }));
}

export async function markExpensePaid(id: string, payload: ExpenseMarkPaidRequest): Promise<Expense> {
    return handleResponse(await fetch(`/api/expenses/${id}/payment`, jsonRequest("PUT", payload)));
}

export async function undoExpensePayment(id: string): Promise<Expense> {
    return handleResponse(await fetch(`/api/expenses/${id}/payment/undo`, { method: "POST" }));
}

export async function getPayables(asOf?: string): Promise<Payables> {
    return handleResponse(await fetch(`/api/expenses/payables${asOf ? `?asOf=${asOf}` : ""}`));
}

export async function getExpenseSummary(range?: { from?: string; to?: string }): Promise<ExpenseSummary> {
    return handleResponse(await fetch(`/api/expenses/summary${rangeQuery(range)}`));
}

export async function getExpenseDistribution(range?: { from?: string; to?: string }): Promise<CategoryTotal[]> {
    return handleResponse(await fetch(`/api/expenses/distribution${rangeQuery(range)}`));
}

export async function getExpenseTrend(scale: TrendScale): Promise<TrendPoint[]> {
    return handleResponse(await fetch(`/api/expenses/trend?scale=${scale}`));
}
