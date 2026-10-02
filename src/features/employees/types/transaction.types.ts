export type TransactionType = "Manual_Labor" | "Advance" | "Advance_Recovery" | "Loan_Payment" | "Latex_Tap" | "Salary_Payment";

export interface EmployeeTransaction {
    transactionRecordId: string;
    employeeId: string;
    employeeName: string;
    type: TransactionType;
    accountCode: string | null;
    amount: number;
    timestamp: string;
    ledgerTransactionId: string | null;
    note: string | null;
    payslipId: string | null;
    createdAt: string;
}

export interface AdvanceRequest {
    employeeId: string;
    amount: number;
    /** Cash/bank account the advance is paid from. */
    accountCode: string;
    date: string;
    note?: string;
}

export interface EmployeeTransactionStats {
    totalAmount: number;
    manualLabor: number;
    advances: number;
    loanPayments: number;
    latexTap: number;
    salaryPayments: number;
    transactionCount: number;
}
