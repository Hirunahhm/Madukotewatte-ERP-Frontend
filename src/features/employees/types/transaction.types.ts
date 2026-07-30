export type TransactionType = "Manual_Labor" | "Advance" | "Loan_Payment" | "Latex_Tap";

export interface EmployeeTransaction {
    transactionRecordId: string;
    employeeId: string;
    employeeName: string;
    type: TransactionType;
    paymentType: string | null;
    amount: number;
    timestamp: string;
    createdAt: string;
}

export interface EmployeeTransactionStats {
    totalAmount: number;
    manualLabor: number;
    advances: number;
    loanPayments: number;
    latexTap: number;
    transactionCount: number;
}
