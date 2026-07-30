export type PaymentType = "bank_transfer" | "cash";

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
    paymentType: PaymentType | null;
    createdAt: string;
    updatedAt: string;
}

export interface LabourRequest {
    employeeId: string;
    transactionRecordId?: string;
    isPaid?: boolean;
    workedHours: number;
    hourlyRate: number;
    amount: number;
    workType: string;
    description?: string;
    timestamp?: string;
    paymentType?: PaymentType;
}
