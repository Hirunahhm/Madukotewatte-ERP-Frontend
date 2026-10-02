export type AccountType = "CASH" | "BANK" | "CREDIT_CARD";

export interface FinancialAccount {
    code: string;
    name: string;
    type: AccountType;
    institution: string | null;
    accountNumber: string | null;
    creditLimit: number | null;
    /** Signed; negative for a card that owed money on the opening date. */
    openingBalance: number;
    openingDate: string;
    isActive: boolean;
    /** Current balance; negative when a credit card owes money. */
    balance: number;
    /** Credit cards only: creditLimit + balance. */
    availableCredit: number | null;
    createdAt: string;
}

export interface AccountBalance {
    accountCode: string;
    name: string;
    type: AccountType;
    isActive: boolean;
    balance: number;
    creditLimit: number | null;
    availableCredit: number | null;
}

export interface CreateAccountRequest {
    code: string;
    name: string;
    type: AccountType;
    institution?: string;
    accountNumber?: string;
    creditLimit?: number;
    openingBalance?: number;
    openingDate?: string;
}

export interface UpdateAccountRequest {
    name?: string;
    institution?: string;
    accountNumber?: string;
    creditLimit?: number;
    openingBalance?: number;
    openingDate?: string;
    isActive?: boolean;
}

export const LEDGER_CATEGORIES = [
    "OPENING_BALANCE", "OWNER_CAPITAL", "OWNER_DRAWING", "TRANSFER", "SALE_RECEIPT", "OTHER_INCOME",
    "INTEREST_INCOME", "EXPENSE_PAYMENT", "CREDIT_CARD_PAYMENT", "SALARY_PAYMENT", "LABOUR_PAYMENT",
    "EMPLOYEE_ADVANCE", "EMPLOYEE_LOAN_ISSUE", "EMPLOYEE_LOAN_REPAYMENT", "ESTATE_LOAN_RECEIPT",
    "ESTATE_LOAN_REPAYMENT", "ASSET_PURCHASE", "ASSET_DISPOSAL", "BANK_CHARGES", "ADJUSTMENT",
] as const;
export type LedgerCategory = (typeof LEDGER_CATEGORIES)[number];

/** Categories the Cash & Debt screen may post by hand (the backend enforces the same list). */
export const MANUAL_ENTRY_CATEGORIES = [
    "OWNER_CAPITAL", "OWNER_DRAWING", "OTHER_INCOME", "INTEREST_INCOME", "BANK_CHARGES", "ADJUSTMENT",
] as const satisfies readonly LedgerCategory[];
export type ManualEntryCategory = (typeof MANUAL_ENTRY_CATEGORIES)[number];

export type LedgerDirection = "IN" | "OUT";

export interface LedgerEntry {
    id: string;
    accountCode: string;
    transactionType: "money in" | "money out";
    category: LedgerCategory;
    amount: number;
    signedAmount: number;
    transactionDate: string;
    referenceType: string | null;
    referenceId: string | null;
    description: string | null;
    reversalOfId: string | null;
    reversed: boolean;
    reversible: boolean;
    balanceAfter: number;
    createdAt: string;
}

export interface PageResult<T> {
    content: T[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

export interface LedgerFilters {
    accountCode?: string;
    category?: LedgerCategory;
    from?: string;
    to?: string;
    page?: number;
    size?: number;
}

export interface AccountStatement {
    accountCode: string;
    name: string;
    type: AccountType;
    from: string;
    to: string;
    openingBalance: number;
    totalIn: number;
    totalOut: number;
    closingBalance: number;
    rows: LedgerEntry[];
}

export interface TransferRequest {
    fromAccountCode: string;
    toAccountCode: string;
    amount: number;
    date?: string;
    description?: string;
}

export interface TransferResult {
    transferId: string;
    from: LedgerEntry;
    to: LedgerEntry;
}

export interface ManualEntryRequest {
    direction: LedgerDirection;
    category: ManualEntryCategory;
    amount: number;
    date?: string;
    description?: string;
}

export interface AccountTrendPoint {
    name: string;
    cashAndBank: number;
    creditCards: number;
    net: number;
}

export type AccountTrendScale = "week" | "month" | "year";
