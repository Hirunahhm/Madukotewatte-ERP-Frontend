import type { PayType } from "@/features/employees/types/employee.types";
import type { PageResponse } from "@/features/employees/types/common.types";

export interface ActiveLoanInfo {
    loanId: string;
    balance: number;
    installment: number;
}

export interface PayslipSummary {
    payslipId: string;
    employeeId: string;
    employeeName: string;
    periodStart: string;
    periodEnd: string;
    paymentDate: string;
    fixedSalary: number;
    grossPay: number;
    netPay: number;
    accountCode: string;
    status: "PAID" | "VOID";
}

/** What one employee is owed for a period (server computed). */
export interface PayrollPreviewRow {
    employeeId: string;
    employeeName: string;
    position: string | null;
    payType: PayType;
    salary: number | null;
    ratePerTree: number | null;
    hourlyRate: number | null;
    fixedSalary: number;
    tapEarnings: number;
    tapRecordCount: number;
    hourlyEarnings: number;
    labourHours: number;
    grossPay: number;
    outstandingAdvances: number;
    suggestedAdvanceDeduction: number;
    activeLoan: ActiveLoanInfo | null;
    suggestedLoanDeduction: number;
    netPay: number;
    /** PAID payslips overlapping the period. */
    alreadyPaid: PayslipSummary[];
}

export interface PayslipTapLine {
    transactionRecordId: string;
    date: string;
    amount: number;
}

export interface PayslipLabourLine {
    labourId: string;
    date: string;
    workType: string;
    workedHours: number;
    hourlyRate: number;
    amount: number;
}

export interface Payslip {
    payslipId: string;
    employeeId: string;
    employeeName: string;
    position: string | null;
    periodStart: string;
    periodEnd: string;
    fixedSalary: number;
    tapEarnings: number;
    hourlyEarnings: number;
    otherEarnings: number;
    otherEarningsNote: string | null;
    grossPay: number;
    advanceDeduction: number;
    loanDeduction: number;
    otherDeduction: number;
    otherDeductionNote: string | null;
    netPay: number;
    accountCode: string;
    paymentDate: string;
    ledgerTransactionId: string | null;
    loanId: string | null;
    notes: string | null;
    status: "PAID" | "VOID";
    voidReason: string | null;
    voidedAt: string | null;
    /** Only on the detail / create responses. */
    tapLines: PayslipTapLine[] | null;
    labourLines: PayslipLabourLine[] | null;
    createdAt: string;
}

export interface PayslipRequest {
    employeeId: string;
    periodStart: string;
    periodEnd: string;
    otherEarnings?: number;
    otherEarningsNote?: string;
    advanceDeduction: number;
    loanDeduction: number;
    otherDeduction?: number;
    otherDeductionNote?: string;
    accountCode: string;
    paymentDate: string;
    notes?: string;
}

export interface PayrollSummaryRow {
    employeeId: string | null;
    employeeName: string;
    payslipCount: number;
    gross: number;
    fixedSalary: number;
    tap: number;
    hourly: number;
    other: number;
    advanceRecovered: number;
    loanDeducted: number;
    otherDeducted: number;
    net: number;
}

export interface PayrollSummary {
    from: string;
    to: string;
    rows: PayrollSummaryRow[];
    totals: PayrollSummaryRow;
}

export type PayslipPage = PageResponse<Payslip>;
