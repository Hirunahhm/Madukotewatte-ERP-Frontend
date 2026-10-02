import type {
    FinancialAccount, AccountBalance, CreateAccountRequest, UpdateAccountRequest,
    LedgerEntry, LedgerFilters, PageResult, AccountStatement, LedgerCategory,
    TransferRequest, TransferResult, ManualEntryRequest, AccountTrendPoint, AccountTrendScale,
} from "@/features/accounts/types/accounts.types";

async function handleResponse<T>(res: Response): Promise<T> {
    if (res.status === 204) return undefined as T;
    const data: unknown = await res.json().catch(() => ({}));
    if (!res.ok) {
        const message = (data as { message?: string }).message;
        throw new Error(message ?? "An unexpected error occurred.");
    }
    return data as T;
}

function sendJson(method: string, body?: unknown): RequestInit {
    return {
        method,
        headers: { "Content-Type": "application/json" },
        body: body === undefined ? undefined : JSON.stringify(body),
    };
}

export async function getAccounts(): Promise<FinancialAccount[]> {
    return handleResponse(await fetch("/api/accounts"));
}

export async function getAccountBalances(asOf?: string): Promise<AccountBalance[]> {
    return handleResponse(await fetch(`/api/accounts/balances${asOf ? `?asOf=${asOf}` : ""}`));
}

export async function getAccountTrend(scale: AccountTrendScale): Promise<AccountTrendPoint[]> {
    return handleResponse(await fetch(`/api/accounts/trend?scale=${scale}`));
}

export async function createAccount(payload: CreateAccountRequest): Promise<FinancialAccount> {
    return handleResponse(await fetch("/api/accounts", sendJson("POST", payload)));
}

export async function updateAccount(code: string, payload: UpdateAccountRequest): Promise<FinancialAccount> {
    return handleResponse(await fetch(`/api/accounts/${encodeURIComponent(code)}`, sendJson("PUT", payload)));
}

export async function getLedger(filters: LedgerFilters = {}): Promise<PageResult<LedgerEntry>> {
    const qs = new URLSearchParams();
    if (filters.accountCode) qs.set("accountCode", filters.accountCode);
    if (filters.category) qs.set("category", filters.category);
    if (filters.from) qs.set("from", filters.from);
    if (filters.to) qs.set("to", filters.to);
    if (filters.page !== undefined) qs.set("page", String(filters.page));
    if (filters.size !== undefined) qs.set("size", String(filters.size));
    return handleResponse(await fetch(`/api/accounts/ledger?${qs.toString()}`));
}

export async function getStatement(code: string, from: string, to: string, category?: LedgerCategory): Promise<AccountStatement> {
    const qs = new URLSearchParams({ from, to });
    if (category) qs.set("category", category);
    return handleResponse(await fetch(`/api/accounts/${encodeURIComponent(code)}/statement?${qs.toString()}`));
}

export async function transfer(payload: TransferRequest): Promise<TransferResult> {
    return handleResponse(await fetch("/api/accounts/transfers", sendJson("POST", payload)));
}

export async function createManualEntry(code: string, payload: ManualEntryRequest): Promise<LedgerEntry> {
    return handleResponse(await fetch(`/api/accounts/${encodeURIComponent(code)}/entries`, sendJson("POST", payload)));
}

export async function reverseEntry(id: string, reason?: string): Promise<LedgerEntry> {
    return handleResponse(await fetch(`/api/accounts/ledger/${id}/reverse`, sendJson("POST", { reason })));
}
