import type { PageResponse, TrendPoint, TrendScale } from "@/features/financials/types/financials.types";

export type { PageResponse, TrendPoint, TrendScale };

export interface EstateLoan {
    loanId: string;
    name: string;
    principalAmount: number;
    currentBalance: number;
    issuedDate: string;
    interestRate: number | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface EstateLoanRequest {
    name: string;
    principalAmount: number;
    issuedDate: string;
    interestRate?: number;
    /** Optional cash/bank account the borrowed money was paid into (posts an ESTATE_LOAN_RECEIPT). */
    receivedIntoAccountCode?: string;
}

export interface EstateLoanPaymentRequest {
    amount: number;
    /** Cash/bank account the repayment is paid from. */
    accountCode: string;
    paymentDate?: string;
}

export const FIXED_ASSET_CATEGORIES = ["Vehicle", "Land", "Building", "Equipment", "Other"] as const;
export type FixedAssetCategory = (typeof FIXED_ASSET_CATEGORIES)[number];

export interface FixedAsset {
    assetId: string;
    category: string;
    name: string;
    acquisitionDate: string;
    acquisitionValue: number;
    currentValue: number;
    status: "active" | "disposed";
    location: string | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface FixedAssetRequest {
    category: string;
    name: string;
    acquisitionDate: string;
    acquisitionValue: number;
    currentValue?: number;
    location?: string;
    notes?: string;
}

export interface FixedAssetUpdateRequest {
    currentValue?: number;
    status?: string;
    location?: string;
    notes?: string;
}

export interface FixedAssetFilters {
    category?: string;
    status?: string;
    page?: number;
    size?: number;
}

export interface CategoryTotal {
    category: string;
    total: number;
}

export interface FixedAssetSummary {
    totalCount: number;
    totalAcquisitionValue: number;
    totalCurrentValue: number;
    byCategory: CategoryTotal[];
}
