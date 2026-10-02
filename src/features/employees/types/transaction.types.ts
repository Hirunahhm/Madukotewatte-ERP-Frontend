import type { AssetType } from "@/features/assets/types/assets.types";

export type TransactionType = "Manual_Labor" | "Advance" | "Loan_Payment" | "Latex_Tap" | "Salary_Payment";

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

export interface EmployeeSalaryPaymentRequest {
    employeeId: string;
    paymentType: AssetType;
    amount: number;
    timestamp: string;
}

export interface EmployeeLoanDeductionRequest {
    employeeId: string;
    amount: number;
    timestamp: string;
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
