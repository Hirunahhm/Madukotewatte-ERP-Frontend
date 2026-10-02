"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    createSaleLatex, createSaleCrop, createSaleGeneral, getSaleGeneralOptions,
    getSale, updateSale, deleteSale, markSalePaid, undoSalePayment,
    getSalesLedger, getSalesSummary, getSalesDistribution, getSalesTrend, getReceivables,
    getExpenseCategories, getExpenses, createExpense, updateExpense, deleteExpense, markExpensePaid, undoExpensePayment,
    getPayables, getExpenseSummary, getExpenseDistribution, getExpenseTrend,
} from "@/features/financials/services/financials-service";
import type {
    SaleType, SaleLatexRequest, SaleCropRequest, SaleGeneralRequest, SaleMarkPaidRequest, SaleUpdatePayload,
    TrendScale, ExpenseRequest, ExpenseMarkPaidRequest,
} from "@/features/financials/types/financials.types";
import { invalidateAccountQueries } from "@/features/accounts/hooks/use-accounts";

function invalidateSales(qc: ReturnType<typeof useQueryClient>) {
    invalidateAccountQueries(qc);
    qc.invalidateQueries({ queryKey: ["sales-ledger"] });
    qc.invalidateQueries({ queryKey: ["sales-summary"] });
    qc.invalidateQueries({ queryKey: ["sales-distribution"] });
    qc.invalidateQueries({ queryKey: ["sales-trend"] });
    qc.invalidateQueries({ queryKey: ["sale-detail"] });
    qc.invalidateQueries({ queryKey: ["receivables"] });
}

function invalidateExpenses(qc: ReturnType<typeof useQueryClient>) {
    invalidateAccountQueries(qc);
    qc.invalidateQueries({ queryKey: ["expenses"] });
    qc.invalidateQueries({ queryKey: ["expense-summary"] });
    qc.invalidateQueries({ queryKey: ["expense-distribution"] });
    qc.invalidateQueries({ queryKey: ["expense-trend"] });
    qc.invalidateQueries({ queryKey: ["payables"] });
}

// ─── Sales: create ──────────────────────────────────────────────────────────

export function useCreateSaleLatex() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: SaleLatexRequest) => createSaleLatex(payload),
        onSuccess: () => invalidateSales(qc),
    });
}

export function useCreateSaleCrop() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ category, payload }: { category: Exclude<SaleType, "latex" | "general">; payload: SaleCropRequest }) =>
            createSaleCrop(category, payload),
        onSuccess: () => invalidateSales(qc),
    });
}

export function useCreateSaleGeneral() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: SaleGeneralRequest) => createSaleGeneral(payload),
        onSuccess: () => invalidateSales(qc),
    });
}

export function useSaleGeneralOptions() {
    return useQuery({ queryKey: ["sale-general-options"], queryFn: getSaleGeneralOptions, staleTime: Infinity });
}

// ─── Sales: any type ────────────────────────────────────────────────────────

export function useSaleDetail(type: SaleType | null, id: string | null) {
    return useQuery({
        queryKey: ["sale-detail", type, id],
        queryFn: () => getSale(type as SaleType, id as string),
        enabled: type !== null && id !== null,
    });
}

export function useUpdateSale() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ type, id, payload }: { type: SaleType; id: string; payload: SaleUpdatePayload }) => updateSale(type, id, payload),
        onSuccess: () => invalidateSales(qc),
    });
}

export function useDeleteSale() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ type, id }: { type: SaleType; id: string }) => deleteSale(type, id),
        onSuccess: () => invalidateSales(qc),
    });
}

export function useMarkSalePaid() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ type, id, payload }: { type: SaleType; id: string; payload: SaleMarkPaidRequest }) => markSalePaid(type, id, payload),
        onSuccess: () => invalidateSales(qc),
    });
}

export function useUndoSalePayment() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ type, id }: { type: SaleType; id: string }) => undoSalePayment(type, id),
        onSuccess: () => invalidateSales(qc),
    });
}

// ─── Sales Ledger + Stats ───────────────────────────────────────────────────

export function useSalesLedger(params?: { category?: string; status?: string; from?: string; to?: string; page?: number; size?: number }) {
    return useQuery({
        queryKey: ["sales-ledger", params],
        queryFn: () => getSalesLedger(params),
    });
}

export function useSalesSummary(range?: { from?: string; to?: string }) {
    return useQuery({
        queryKey: ["sales-summary", range ?? null],
        queryFn: () => getSalesSummary(range),
    });
}

export function useSalesDistribution() {
    return useQuery({
        queryKey: ["sales-distribution"],
        queryFn: () => getSalesDistribution(),
    });
}

export function useSalesTrend(scale: TrendScale) {
    return useQuery({
        queryKey: ["sales-trend", scale],
        queryFn: () => getSalesTrend(scale),
    });
}

export function useReceivables(asOf?: string) {
    return useQuery({
        queryKey: ["receivables", asOf ?? null],
        queryFn: () => getReceivables(asOf),
    });
}

// ─── Expenses ───────────────────────────────────────────────────────────────

export function useExpenseCategories() {
    return useQuery({ queryKey: ["expense-categories"], queryFn: getExpenseCategories, staleTime: Infinity });
}

export function useExpenses(params?: { type?: string; payee?: string; isPaid?: boolean; from?: string; to?: string; page?: number; size?: number }) {
    return useQuery({
        queryKey: ["expenses", params],
        queryFn: () => getExpenses(params),
    });
}

export function useCreateExpense() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: ExpenseRequest) => createExpense(payload),
        onSuccess: () => invalidateExpenses(qc),
    });
}

export function useUpdateExpense() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: ExpenseRequest }) => updateExpense(id, payload),
        onSuccess: () => invalidateExpenses(qc),
    });
}

export function useDeleteExpense() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteExpense(id),
        onSuccess: () => invalidateExpenses(qc),
    });
}

export function useMarkExpensePaid() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: ExpenseMarkPaidRequest }) => markExpensePaid(id, payload),
        onSuccess: () => invalidateExpenses(qc),
    });
}

export function useUndoExpensePayment() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => undoExpensePayment(id),
        onSuccess: () => invalidateExpenses(qc),
    });
}

export function usePayables(asOf?: string) {
    return useQuery({
        queryKey: ["payables", asOf ?? null],
        queryFn: () => getPayables(asOf),
    });
}

export function useExpenseSummary(range?: { from?: string; to?: string }) {
    return useQuery({
        queryKey: ["expense-summary", range ?? null],
        queryFn: () => getExpenseSummary(range),
    });
}

export function useExpenseDistribution() {
    return useQuery({
        queryKey: ["expense-distribution"],
        queryFn: () => getExpenseDistribution(),
    });
}

export function useExpenseTrend(scale: TrendScale) {
    return useQuery({
        queryKey: ["expense-trend", scale],
        queryFn: () => getExpenseTrend(scale),
    });
}
