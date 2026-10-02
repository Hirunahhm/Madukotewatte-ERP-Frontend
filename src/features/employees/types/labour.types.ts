export interface Labour {
    labourId: string;
    employeeId: string;
    employeeName: string;
    transactionRecordId: string | null;
    isPaid: boolean;
    workedHours: number;
    hourlyRate: number;
    amount: number;
    workType: string;
    description: string | null;
    timestamp: string;
    /** Cash/bank account the labour was paid from (null while unpaid). */
    accountCode: string | null;
    /** Set when the labour was paid through a payslip. */
    payslipId: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface LabourRequest {
    employeeId: string;
    transactionRecordId?: string;
    isPaid?: boolean;
    workedHours: number;
    /** Optional: defaults to the employee hourly rate. */
    hourlyRate?: number;
    /** Optional: the server computes hours x rate when omitted. */
    amount?: number;
    workType: string;
    description?: string;
    timestamp?: string;
    /** Required when isPaid is true. */
    accountCode?: string;
}
