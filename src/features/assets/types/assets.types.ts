import type { PageResponse, TrendPoint, TrendScale } from "@/features/financials/types/financials.types";

export type { PageResponse, TrendPoint, TrendScale };

// ─── Estate loans ───────────────────────────────────────────────────────────

export interface EstateLoan {
    loanId: string;
    name: string;
    /** Total borrowed so far (initial amount plus drawdowns). */
    principalAmount: number;
    currentBalance: number;
    issuedDate: string;
    interestRate: number | null;
    isActive: boolean;
    lender: string | null;
    termMonths: number | null;
    installmentAmount: number | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface EstateLoanRequest {
    name: string;
    principalAmount: number;
    issuedDate: string;
    interestRate?: number;
    lender?: string;
    termMonths?: number;
    installmentAmount?: number;
    notes?: string;
    /** Optional cash/bank account the borrowed money was paid into (posts an ESTATE_LOAN_RECEIPT). */
    receivedIntoAccountCode?: string;
}

export interface EstateLoanUpdateRequest {
    name?: string;
    lender?: string;
    interestRate?: number;
    termMonths?: number;
    installmentAmount?: number;
    notes?: string;
}

export interface EstateLoanPaymentRequest {
    principalAmount: number;
    interestAmount?: number;
    /** Cash/bank account both parts are paid from. */
    accountCode: string;
    paymentDate?: string;
}

export interface EstateLoanDrawdownRequest {
    amount: number;
    date?: string;
    /** Optional cash/bank account receiving the money. */
    accountCode?: string;
}

export interface EstateLoanMovement {
    id: string;
    loanId: string;
    type: "borrow" | "repay";
    transactionDate: string;
    amount: number;
    interestAmount: number;
    balanceBefore: number;
    balanceAfter: number;
    ledgerTransactionId: string | null;
    undoable: boolean;
}

export interface BorrowingRow {
    loanId: string | null;
    name: string | null;
    lender: string | null;
    interestRate: number | null;
    openingBalance: number;
    drawdowns: number;
    principalRepaid: number;
    interestPaid: number;
    closingBalance: number;
}

export interface BorrowingSchedule {
    from: string;
    to: string;
    loans: BorrowingRow[];
    total: BorrowingRow;
}

// ─── Fixed assets ───────────────────────────────────────────────────────────

export const FIXED_ASSET_CATEGORIES = [
    "Land", "Building", "Vehicle", "Machinery", "Equipment", "Tools", "Plantation", "Other",
] as const;
export type FixedAssetCategory = (typeof FIXED_ASSET_CATEGORIES)[number];

export type DepreciationMethod = "STRAIGHT_LINE" | "NONE";

/** Default useful life by category (null = not depreciated). Mirrors the backend defaults. */
export const DEFAULT_USEFUL_LIFE_YEARS: Record<string, number | null> = {
    Land: null,
    Building: 20,
    Vehicle: 5,
    Machinery: 10,
    Equipment: 5,
    Tools: 5,
    Plantation: 25,
    Other: 5,
};

export interface FixedAsset {
    assetId: string;
    category: string;
    name: string;
    acquisitionDate: string;
    acquisitionValue: number;
    /** Computed net book value today (equals netBookValue). */
    currentValue: number;
    accumulatedDepreciation: number;
    netBookValue: number;
    status: "active" | "disposed";
    location: string | null;
    notes: string | null;
    usefulLifeYears: number | null;
    residualValue: number;
    depreciationMethod: DepreciationMethod;
    purchaseAccountCode: string | null;
    purchaseTransactionId: string | null;
    disposalDate: string | null;
    disposalProceeds: number | null;
    disposalAccountCode: string | null;
    disposalTransactionId: string | null;
    gainLoss: number | null;
    createdAt: string;
    updatedAt: string;
}

export interface FixedAssetRequest {
    category: string;
    name: string;
    acquisitionDate: string;
    acquisitionValue: number;
    usefulLifeYears?: number;
    residualValue?: number;
    depreciationMethod?: DepreciationMethod;
    /** Account the purchase was paid from; empty = pre-existing asset (no ledger entry). */
    paidFromAccountCode?: string;
    location?: string;
    notes?: string;
}

export interface FixedAssetUpdateRequest {
    name?: string;
    category?: string;
    acquisitionDate?: string;
    acquisitionValue?: number;
    usefulLifeYears?: number;
    residualValue?: number;
    depreciationMethod?: DepreciationMethod;
    location?: string;
    notes?: string;
}

export interface FixedAssetDisposalRequest {
    disposalDate: string;
    proceeds: number;
    accountCode?: string;
}

export interface FixedAssetFilters {
    category?: string;
    status?: string;
    page?: number;
    size?: number;
}

export interface CategoryTotal {
    category: string;
    total: number;
}

export interface FixedAssetSummary {
    totalCount: number;
    totalAcquisitionValue: number;
    /** Total net book value of active assets. */
    totalCurrentValue: number;
    totalAccumulatedDepreciation: number;
    byCategory: CategoryTotal[];
}

export interface DepreciationRow {
    assetId: string | null;
    name: string | null;
    category: string;
    acquisitionDate: string | null;
    disposalDate: string | null;
    depreciationMethod: DepreciationMethod | null;
    usefulLifeYears: number | null;
    cost: number;
    costAtStart: number;
    additions: number;
    disposalCost: number;
    costAtEnd: number;
    accumulatedAtStart: number;
    chargeForPeriod: number;
    accumulatedOnDisposals: number;
    accumulatedAtEnd: number;
    nbvAtStart: number;
    nbvAtEnd: number;
    disposalProceeds: number;
    disposalGainLoss: number;
}

export interface DepreciationSchedule {
    from: string;
    to: string;
    assets: DepreciationRow[];
    categories: DepreciationRow[];
    total: DepreciationRow;
}
