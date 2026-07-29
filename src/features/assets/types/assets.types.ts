import type {
    PageResponse, TrendPoint, TrendScale,
    MonetaryAssetTransactionRequest, MonetaryAssetTransactionResponse,
    EstateLoanTransactionRequest, EstateLoanTransactionResponse,
} from "@/features/financials/types/financials.types";

export type {
    PageResponse, TrendPoint, TrendScale,
    MonetaryAssetTransactionRequest, MonetaryAssetTransactionResponse,
    EstateLoanTransactionRequest, EstateLoanTransactionResponse,
};

export const ASSET_TYPES = ["Cash", "Bank-BOC", "Bank-Seylan", "Bank-Peoples"] as const;
export type AssetType = (typeof ASSET_TYPES)[number];

export const LOAN_TYPES = ["credit-card - Peoples", "credit-card - Sampath", "Loan-mom", "Loan-other"] as const;
export type LoanType = (typeof LOAN_TYPES)[number];

export const CREDIT_CARD_TYPES = ["credit-card - Peoples", "credit-card - Sampath"] as const;
export type CreditCardType = (typeof CREDIT_CARD_TYPES)[number];

export interface AssetBalance {
    assetType: string;
    balance: number;
}

export interface EstateLoanBalance {
    loanType: string;
    balance: number;
}

export interface MonetaryTransactionFilters {
    assetType?: string;
    transactionType?: "money in" | "money out";
    from?: string;
    to?: string;
    page?: number;
    size?: number;
}

export interface LoanTransactionFilters {
    loanType?: string;
    transactionType?: "borrow" | "repay";
    from?: string;
    to?: string;
    page?: number;
    size?: number;
}

export interface CreditCardStatement {
    loanType: string;
    from: string;
    to: string;
    openingBalance: number;
    totalCharges: number;
    totalPayments: number;
    closingBalance: number;
    transactions: EstateLoanTransactionResponse[];
}

export interface CreditCardLimit {
    loanType: string;
    creditLimit: number;
    balance: number;
    availableCredit: number;
}

export interface UpdateCreditCardLimitRequest {
    loanType: string;
    creditLimit: number;
}
