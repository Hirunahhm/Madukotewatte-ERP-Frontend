export interface Employee {
    employeeId: string;
    name: string;
    joinedDate: string | null;
    salary: number | null;
    ratePerTree: number | null;
    ratePerBunch: number | null;
    ratePerNut: number | null;
    ratePerKgManioc: number | null;
    position: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface EmployeeSummary {
    employeeId: string;
    name: string;
    position: string | null;
    salary: number | null;
    isActive: boolean;
}

export interface EmployeeRequest {
    name: string;
    joinedDate: string;
    salary: number;
    ratePerTree?: number;
    ratePerBunch?: number;
    ratePerNut?: number;
    ratePerKgManioc?: number;
    position?: string;
    isActive?: boolean;
}

export interface PaymentSummary {
    totalSalaryCost: number;
    toBePaid: number;
    paidAmount: number;
    activeEmployeeLoansTotal: number;
}
