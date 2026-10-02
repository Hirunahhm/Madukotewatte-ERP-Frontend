"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    createSaleLatex, markSaleLatexPaid,
    createSaleCrop, markSaleCropPaid,
    getSalesLedger, getSalesSummary, getSalesDistribution, getSalesTrend,
    getExpenses, createExpense, updateExpense, deleteExpense, markExpensePaid,
    getExpenseSummary, getExpenseDistribution, getExpenseTrend,
} from "@/features/financials/services/financials-service";
import type {
    SaleCategory, SaleLatexRequest, SaleLatexMarkPaidRequest, SaleCropRequest, SaleMarkPaidRequest,
    TrendScale, ExpenseRequest, ExpenseMarkPaidRequest,
} from "@/features/financials/types/financials.types";
import { invalidateAccountQueries } from "@/features/accounts/hooks/use-accounts";

function invalidateSales(qc: ReturnType<typeof useQueryClient>) {
    invalidateAccountQueries(qc);
    qc.invalidateQueries({ queryKey: ["sales-ledger"] });
    qc.invalidateQueries({ queryKey: ["sales-summary"] });
    qc.invalidateQueries({ queryKey: ["sales-distribution"] });
    qc.invalidateQueries({ queryKey: ["sales-trend"] });
}

function invalidateExpenses(qc: ReturnType<typeof useQueryClient>) {
    invalidateAccountQueries(qc);
    qc.invalidateQueries({ queryKey: ["expenses"] });
    qc.invalidateQueries({ queryKey: ["expense-summary"] });
    qc.invalidateQueries({ queryKey: ["expense-distribution"] });
    qc.invalidateQueries({ queryKey: ["expense-trend"] });
}

// ─── Sales Latex ────────────────────────────────────────────────────────────

export function useCreateSaleLatex() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: SaleLatexRequest) => createSaleLatex(payload),
        onSuccess: () => invalidateSales(qc),
    });
}

export function useMarkSaleLatexPaid() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: SaleLatexMarkPaidRequest }) => markSaleLatexPaid(id, payload),
        onSuccess: () => invalidateSales(qc),
    });
}

// ─── Sales Rubber Solid / Manioc / Coconut / Banana ────────────────────────

export function useCreateSaleCrop() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ category, payload }: { category: Exclude<SaleCategory, "latex">; payload: SaleCropRequest }) =>
            createSaleCrop(category, payload),
        onSuccess: () => invalidateSales(qc),
    });
}

export function useMarkSaleCropPaid() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ category, id, payload }: { category: Exclude<SaleCategory, "latex">; id: string; payload: SaleMarkPaidRequest }) =>
            markSaleCropPaid(category, id, payload),
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

// ─── Expenses ───────────────────────────────────────────────────────────────

export function useExpenses(params?: { type?: string; isPaid?: boolean; from?: string; to?: string; page?: number; size?: number }) {
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
