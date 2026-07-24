export interface EmployeeLoan {
    loanId: string;
    employeeId: string;
    employeeName: string;
    principalAmount: number;
    interest: number;
    installment: number;
    currentBalance: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface EmployeeLoanRequest {
    employeeId: string;
    principalAmount: number;
    interest: number;
    installment: number;
}

export interface UpdateLoanRequest {
    isActive?: boolean;
    currentBalance?: number;
    installment?: number;
}
