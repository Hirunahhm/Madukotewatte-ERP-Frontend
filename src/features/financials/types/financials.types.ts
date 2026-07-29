import type { PageResponse } from "@/features/production/types/production.types";

export type { PageResponse };

export type SaleCategory = "latex" | "rubber-solid" | "manioc" | "coconut" | "banana";

/** All payment types recognized by the Expense CHECK constraint. */
export const PAYMENT_TYPES = [
    "Cash",
    "Bank Transfer-BOC",
    "Bank Transfer-Seylan",
    "Bank Transfer-Peoples",
    "Credit Card-Peoples",
] as const;

/**
 * Payment types offered for Sales — excludes "Credit Card-Peoples" because that maps to the
 * estate's credit-card *liability* ledger; posting incoming sale revenue there would incorrectly
 * increase what the estate owes instead of recording money received.
 */
export const SALE_PAYMENT_TYPES = [
    "Cash",
    "Bank Transfer-BOC",
    "Bank Transfer-Seylan",
    "Bank Transfer-Peoples",
] as const;

// ─── Sales Latex ────────────────────────────────────────────────────────────

export interface SaleLatex {
    saleId: string;
    loadId: string;
    mass: number;
    litres: number;
    metrolacReading: number | null;
    unitPrice: number;
    totalAmount: number;
    isPaymentReceived: boolean;
    transactionId: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface SaleLatexRequest {
    loadId: string;
    mass: number;
    litres: number;
    metrolacReading?: number;
    unitPrice: number;
}

// ─── Sales Rubber Solid / Manioc / Coconut / Banana ────────────────────────
// Manioc/Coconut/Banana also carry a free-text `type` (sub-variety); Rubber Solid does not.

export interface SaleCrop {
    saleId: string;
    loadId: string;
    type?: string;
    saleDate: string;      // "YYYY-MM-DD"
    mass: number;
    unitPrice: number;
    totalAmount: number;
    isPaid: boolean;
    status: string;
    paymentType: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface SaleCropRequest {
    loadId: string;
    type?: string;
    saleDate: string;      // "YYYY-MM-DD"
    mass: number;
    unitPrice: number;
}

export interface SaleMarkPaidRequest {
    paymentType: string;
}

export interface SaleLatexMarkPaidRequest {
    monetaryTransactionId?: string;
}

// ─── Sales Ledger + Stats (cross-category) ─────────────────────────────────

export interface SalesLedgerRow {
    saleId: string;
    category: SaleCategory;
    loadId: string;
    saleDate: string;
    amount: number;
    status: "paid" | "pending";
    paymentType: string | null;
}

export interface SalesSummary {
    totalSales: number;
    received: number;
    pending: number;
}

export interface CategoryTotal {
    category: string;
    total: number;
}

export interface TrendPoint {
    name: string;
    total: number;
}

export type TrendScale = "week" | "month" | "year";

// ─── Expenses ───────────────────────────────────────────────────────────────

export interface Expense {
    expenseId: string;
    type: string;
    paymentType: string | null;
    amount: number;
    timestamp: string;
    monetaryTransactionId: string | null;
    estateLoanTransactionId: string | null;
    isPaid: boolean;
    status: string;
    createdAt: string;
}

export interface ExpenseRequest {
    type: string;
    paymentType?: string;
    amount: number;
    timestamp: string;      // ISO date-time
    monetaryTransactionId?: string;
    estateLoanTransactionId?: string;
    isPaid?: boolean;
}

export interface ExpenseMarkPaidRequest {
    paymentType: string;
    monetaryTransactionId?: string;
    estateLoanTransactionId?: string;
}

export interface ExpenseSummary {
    totalExpenses: number;
    paid: number;
    pending: number;
}

// ─── Monetary / Loan ledger transactions (needed to compose "mark paid") ───

export interface MonetaryAssetTransactionRequest {
    transactionType: "money in" | "money out";
    assetType: string;
    amount: number;
}

export interface MonetaryAssetTransactionResponse {
    id: string;
    transactionType: string;
    assetType: string;
    lastAmount: number;
    newAmount: number;
    createdAt: string;
}

export interface EstateLoanTransactionRequest {
    loanType: string;
    amount: number;
}

export interface EstateLoanTransactionResponse {
    id: string;
    loanType: string;
    lastAmount: number;
    newAmount: number;
    createdAt: string;
}
