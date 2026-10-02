"use client";

import { useQuery, useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query";
import {
    getAccounts, getAccountBalances, getAccountTrend, createAccount, updateAccount,
    getLedger, getStatement, transfer, createManualEntry, reverseEntry,
} from "@/features/accounts/services/accounts-service";
import type {
    CreateAccountRequest, UpdateAccountRequest, LedgerFilters, LedgerCategory,
    TransferRequest, ManualEntryRequest, AccountTrendScale,
} from "@/features/accounts/types/accounts.types";

/** Refresh everything derived from the account ledger. Call from any mutation that moves money. */
export function invalidateAccountQueries(qc: QueryClient) {
    qc.invalidateQueries({ queryKey: ["accounts"] });
    qc.invalidateQueries({ queryKey: ["account-balances"] });
    qc.invalidateQueries({ queryKey: ["account-trend"] });
    qc.invalidateQueries({ queryKey: ["account-ledger"] });
    qc.invalidateQueries({ queryKey: ["account-statement"] });
}

/** The account list (with current balance / available credit): the source for every account selector. */
export function useAccounts() {
    return useQuery({
        queryKey: ["accounts"],
        queryFn: () => getAccounts(),
    });
}

export function useAccountBalances(asOf?: string) {
    return useQuery({
        queryKey: ["account-balances", asOf ?? null],
        queryFn: () => getAccountBalances(asOf),
    });
}

export function useAccountTrend(scale: AccountTrendScale) {
    return useQuery({
        queryKey: ["account-trend", scale],
        queryFn: () => getAccountTrend(scale),
    });
}

export function useLedger(filters: LedgerFilters) {
    return useQuery({
        queryKey: ["account-ledger", filters],
        queryFn: () => getLedger(filters),
    });
}

export function useAccountStatement(code: string, from: string, to: string, category?: LedgerCategory) {
    return useQuery({
        queryKey: ["account-statement", code, from, to, category ?? null],
        queryFn: () => getStatement(code, from, to, category),
        enabled: Boolean(code && from && to),
    });
}

export function useCreateAccount() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateAccountRequest) => createAccount(payload),
        onSuccess: () => invalidateAccountQueries(qc),
    });
}

export function useUpdateAccount() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ code, payload }: { code: string; payload: UpdateAccountRequest }) => updateAccount(code, payload),
        onSuccess: () => invalidateAccountQueries(qc),
    });
}

export function useTransfer() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: TransferRequest) => transfer(payload),
        onSuccess: () => invalidateAccountQueries(qc),
    });
}

export function useCreateManualEntry() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ code, payload }: { code: string; payload: ManualEntryRequest }) => createManualEntry(code, payload),
        onSuccess: () => invalidateAccountQueries(qc),
    });
}

export function useReverseEntry() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, reason }: { id: string; reason?: string }) => reverseEntry(id, reason),
        onSuccess: () => invalidateAccountQueries(qc),
    });
}
