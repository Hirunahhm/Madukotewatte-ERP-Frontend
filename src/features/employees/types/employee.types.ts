export type PayType = "FIXED_MONTHLY" | "PER_TREE" | "HOURLY";

export const PAY_TYPE_LABELS: Record<PayType, string> = {
    FIXED_MONTHLY: "Fixed monthly salary",
    PER_TREE: "Per tree (tapper)",
    HOURLY: "Hourly",
};

export interface Employee {
    employeeId: string;
    name: string;
    joinedDate: string | null;
    salary: number | null;
    ratePerTree: number | null;
    payType: PayType;
    hourlyRate: number | null;
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
    payType: PayType;
    ratePerTree: number | null;
    hourlyRate: number | null;
    isActive: boolean;
}

export interface EmployeeRequest {
    name: string;
    joinedDate: string;
    salary?: number;
    ratePerTree?: number;
    payType?: PayType;
    hourlyRate?: number;
    position?: string;
    isActive?: boolean;
}

export interface PaymentSummary {
    /** Monthly cost of the active fixed-salary employees. */
    totalSalaryCost: number;
    /** Payslips paid this month: gross earnings. */
    payrollPaidGross: number;
    /** Payslips paid this month: money that left the accounts. */
    payrollPaidNet: number;
    /** Earned this month to date and not yet on a payslip. */
    unpaidEarnings: number;
    /** Advances given and not yet recovered. */
    outstandingAdvances: number;
    activeEmployeeLoansTotal: number;
}
