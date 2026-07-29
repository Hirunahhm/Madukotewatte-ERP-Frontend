"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getAssetBalances, getMonetaryTrend, getMonetaryTransactions,
    getLoanBalances, getLoanTrend, getLoanTransactions,
    getCreditCardStatement, getCreditCardLimits, updateCreditCardLimit,
} from "@/features/assets/services/assets-service";
import { useCreateMonetaryTransaction, useCreateEstateLoanTransaction } from "@/features/financials/hooks/use-financials";
import type {
    TrendScale, MonetaryTransactionFilters, LoanTransactionFilters, UpdateCreditCardLimitRequest,
} from "@/features/assets/types/assets.types";

function invalidateAssets(qc: ReturnType<typeof useQueryClient>) {
    qc.invalidateQueries({ queryKey: ["asset-balances"] });
    qc.invalidateQueries({ queryKey: ["monetary-transactions"] });
    qc.invalidateQueries({ queryKey: ["monetary-trend"] });
}

function invalidateLoans(qc: ReturnType<typeof useQueryClient>) {
    qc.invalidateQueries({ queryKey: ["loan-balances"] });
    qc.invalidateQueries({ queryKey: ["loan-transactions"] });
    qc.invalidateQueries({ queryKey: ["loan-trend"] });
    qc.invalidateQueries({ queryKey: ["credit-card-statement"] });
    qc.invalidateQueries({ queryKey: ["credit-card-limits"] });
}

// ─── Monetary Assets ────────────────────────────────────────────────────────

export function useAssetBalances() {
    return useQuery({
        queryKey: ["asset-balances"],
        queryFn: () => getAssetBalances(),
    });
}

export function useMonetaryTrend(scale: TrendScale) {
    return useQuery({
        queryKey: ["monetary-trend", scale],
        queryFn: () => getMonetaryTrend(scale),
    });
}

export function useMonetaryTransactions(params?: MonetaryTransactionFilters) {
    return useQuery({
        queryKey: ["monetary-transactions", params],
        queryFn: () => getMonetaryTransactions(params),
    });
}

// ─── Estate Loans ───────────────────────────────────────────────────────────

export function useLoanBalances() {
    return useQuery({
        queryKey: ["loan-balances"],
        queryFn: () => getLoanBalances(),
    });
}

export function useLoanTrend(scale: TrendScale) {
    return useQuery({
        queryKey: ["loan-trend", scale],
        queryFn: () => getLoanTrend(scale),
    });
}

export function useLoanTransactions(params?: LoanTransactionFilters) {
    return useQuery({
        queryKey: ["loan-transactions", params],
        queryFn: () => getLoanTransactions(params),
    });
}

// ─── Credit Cards ───────────────────────────────────────────────────────────

export function useCreditCardStatement(loanType: string, from: string, to: string) {
    return useQuery({
        queryKey: ["credit-card-statement", loanType, from, to],
        queryFn: () => getCreditCardStatement(loanType, from, to),
        enabled: Boolean(loanType && from && to),
    });
}

export function useCreditCardLimits() {
    return useQuery({
        queryKey: ["credit-card-limits"],
        queryFn: () => getCreditCardLimits(),
    });
}

export function useUpdateCreditCardLimit() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: UpdateCreditCardLimitRequest) => updateCreditCardLimit(payload),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["credit-card-limits"] }),
    });
}

// ─── Composed actions ───────────────────────────────────────────────────────

export function useRecordWithdrawal() {
    const qc = useQueryClient();
    const createMonetaryTx = useCreateMonetaryTransaction();

    async function withdraw(assetType: string, amount: number) {
        await createMonetaryTx.mutateAsync({ transactionType: "money out", assetType, amount });
        invalidateAssets(qc);
    }

    return { withdraw, isPending: createMonetaryTx.isPending };
}

export function useRecordLiability() {
    const qc = useQueryClient();
    const createLoanTx = useCreateEstateLoanTransaction();
    const createMonetaryTx = useCreateMonetaryTransaction();

    async function recordLiability(loanType: string, depositTo: string, amount: number) {
        await createLoanTx.mutateAsync({ loanType, transactionType: "borrow", amount });
        await createMonetaryTx.mutateAsync({ transactionType: "money in", assetType: depositTo, amount });
        invalidateLoans(qc);
        invalidateAssets(qc);
    }

    return { recordLiability, isPending: createLoanTx.isPending || createMonetaryTx.isPending };
}

export function useRecordRepayment() {
    const qc = useQueryClient();
    const createLoanTx = useCreateEstateLoanTransaction();
    const createMonetaryTx = useCreateMonetaryTransaction();

    async function recordRepayment(loanType: string, payFrom: string, amount: number) {
        await createLoanTx.mutateAsync({ loanType, transactionType: "repay", amount });
        await createMonetaryTx.mutateAsync({ transactionType: "money out", assetType: payFrom, amount });
        invalidateLoans(qc);
        invalidateAssets(qc);
    }

    return { recordRepayment, isPending: createLoanTx.isPending || createMonetaryTx.isPending };
}
