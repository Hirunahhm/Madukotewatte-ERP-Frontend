export interface LoanRepayment {
    repaymentId: string;
    loanId: string;
    amount: number;
    repaymentDate: string;
    source: "PAYSLIP" | "CASH";
    payslipId: string | null;
    accountCode: string | null;
    ledgerTransactionId: string | null;
}

export interface EmployeeLoan {
    loanId: string;
    employeeId: string;
    employeeName: string;
    principalAmount: number;
    interest: number;
    installment: number;
    currentBalance: number;
    isActive: boolean;
    issuedDate: string;
    ledgerTransactionId: string | null;
    totalRepaid: number;
    repayments: LoanRepayment[];
    createdAt: string;
    updatedAt: string;
}

export interface EmployeeLoanRequest {
    employeeId: string;
    principalAmount: number;
    interest: number;
    installment: number;
    /** Cash/bank account the principal is paid out of. */
    accountCode: string;
    issuedDate: string;
}

export interface UpdateLoanRequest {
    isActive?: boolean;
    currentBalance?: number;
    installment?: number;
}

export interface LoanRepaymentRequest {
    amount: number;
    accountCode: string;
    date: string;
}
