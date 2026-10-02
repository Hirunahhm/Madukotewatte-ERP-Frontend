import type { PageResponse } from "@/features/production/types/production.types";

export type { PageResponse };

export type SaleCategory = "latex" | "rubber-solid" | "manioc" | "coconut" | "banana";
/** Every sale table: the five core categories plus general products (cocoa, pepper, ...). */
export type SaleType = SaleCategory | "general";

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
    buyerName: string | null;
    dueDate: string | null;
    overdue: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface SaleLatexRequest {
    loadId: string;
    mass: number;
    litres: number;
    metrolacReading?: number;
    unitPrice: number;
    buyerName?: string;
    dueDate?: string;
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
    buyerName: string | null;
    dueDate: string | null;
    overdue: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface SaleCropRequest {
    loadId: string;
    type?: string;
    saleDate: string;      // "YYYY-MM-DD"
    mass: number;
    unitPrice: number;
    buyerName?: string;
    dueDate?: string;
    /** Record the sale as already paid: needs accountCode (cash or bank). */
    isPaid?: boolean;
    accountCode?: string;
    paymentDate?: string;
}

// ─── General product sales (cocoa, pepper, cinnamon, timber, ...) ──────────

export interface SaleGeneral {
    saleId: string;
    product: string;
    description: string | null;
    quantity: number;
    unit: string;
    unitPrice: number;
    totalAmount: number;
    buyerName: string | null;
    saleDate: string;
    dueDate: string | null;
    isPaid: boolean;
    status: string;
    accountCode: string | null;
    paymentDate: string | null;
    transactionId: string | null;
    overdue: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface SaleGeneralRequest {
    product: string;
    description?: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    buyerName?: string;
    saleDate: string;
    dueDate?: string;
    isPaid?: boolean;
    accountCode?: string;
    paymentDate?: string;
}

export interface SaleGeneralOptions {
    products: string[];
    units: string[];
}

/** Any single sale, as returned by GET /sales/{type}/{id}. */
export type SaleDetail = SaleLatex | SaleCrop | SaleGeneral;
export type SaleUpdatePayload = SaleLatexRequest | SaleCropRequest | SaleGeneralRequest;

export interface SaleMarkPaidRequest {
    accountCode: string;
    paymentDate?: string;
}

// ─── Sales Ledger + Stats (cross-category) ─────────────────────────────────

export interface SalesLedgerRow {
    saleId: string;
    /** latex | rubber-solid | manioc | coconut | banana, or the product name ("Cocoa") for general sales. */
    category: string;
    saleType: SaleType;
    loadId: string | null;
    saleDate: string;
    amount: number;
    status: "paid" | "pending";
    accountCode: string | null;
    buyerName: string | null;
    dueDate: string | null;
    paymentDate: string | null;
    overdue: boolean;
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

// ─── Receivables / Payables ageing ──────────────────────────────────────────

export type AgingBucketName = "0-30" | "31-60" | "61-90" | "90+";

export interface AgingBucket {
    bucket: AgingBucketName;
    count: number;
    total: number;
}

export interface PartyTotal {
    name: string;
    count: number;
    total: number;
    overdueTotal: number;
    oldestDays: number;
}

export interface ReceivableRow {
    saleType: SaleType;
    saleId: string;
    product: string;
    buyerName: string | null;
    saleDate: string;
    dueDate: string | null;
    amount: number;
    daysOutstanding: number;
    bucket: AgingBucketName;
    overdue: boolean;
}

export interface Receivables {
    asOf: string;
    total: number;
    overdueTotal: number;
    rows: ReceivableRow[];
    buckets: AgingBucket[];
    byBuyer: PartyTotal[];
}

export interface PayableRow {
    expenseId: string;
    category: string;
    payee: string | null;
    description: string | null;
    expenseDate: string;
    dueDate: string | null;
    amount: number;
    daysOutstanding: number;
    bucket: AgingBucketName;
    overdue: boolean;
}

export interface Payables {
    asOf: string;
    total: number;
    overdueTotal: number;
    rows: PayableRow[];
    buckets: AgingBucket[];
    byPayee: PartyTotal[];
}

// ─── Expenses ───────────────────────────────────────────────────────────────

export interface Expense {
    expenseId: string;
    /** One of the standard categories from GET /expenses/categories. */
    type: string;
    /** Account the expense was paid from (cash, bank or credit card); null while unpaid. */
    accountCode: string | null;
    payee: string | null;
    description: string | null;
    dueDate: string | null;
    overdue: boolean;
    /** True for expenses created by payroll/labour/loans: read-only here. */
    systemManaged: boolean;
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
    payee?: string;
    description?: string;
    dueDate?: string;       // "YYYY-MM-DD"
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
