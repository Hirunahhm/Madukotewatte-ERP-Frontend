import type { PageResponse } from "@/features/production/types/production.types";

export type { PageResponse };

export type SaleCategory = "latex" | "rubber-solid" | "manioc" | "coconut" | "banana";

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
    accountCode: string | null;
    paymentDate: string | null;
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
    /** Cash/bank account the money was received into (null while unpaid). */
    accountCode: string | null;
    paymentDate: string | null;
    transactionId: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface SaleCropRequest {
    loadId: string;
    type?: string;
    saleDate: string;      // "YYYY-MM-DD"
    mass: number;
    unitPrice: number;
    /** Record the sale as already paid: needs accountCode (cash or bank). */
    isPaid?: boolean;
    accountCode?: string;
    paymentDate?: string;
}

export interface SaleMarkPaidRequest {
    accountCode: string;
    paymentDate?: string;
}

export type SaleLatexMarkPaidRequest = SaleMarkPaidRequest;

// ─── Sales Ledger + Stats (cross-category) ─────────────────────────────────

export interface SalesLedgerRow {
    saleId: string;
    category: SaleCategory;
    loadId: string;
    saleDate: string;
    amount: number;
    status: "paid" | "pending";
    accountCode: string | null;
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
    /** Account the expense was paid from (cash, bank or credit card); null while unpaid. */
    accountCode: string | null;
    amount: number;
    timestamp: string;
    /** Ledger entry that paid the expense. */
    transactionId: string | null;
    paymentDate: string | null;
    /** Set on system-created expenses, e.g. LABOUR. */
    referenceType: string | null;
    referenceId: string | null;
    isPaid: boolean;
    status: string;
    createdAt: string;
}

export interface ExpenseRequest {
    type: string;
    accountCode?: string;
    amount: number;
    timestamp: string;      // ISO date-time
    paymentDate?: string;   // "YYYY-MM-DD"
    isPaid?: boolean;
}

export interface ExpenseMarkPaidRequest {
    accountCode: string;
    paymentDate?: string;
}

export interface ExpenseSummary {
    totalExpenses: number;
    paid: number;
    pending: number;
}
