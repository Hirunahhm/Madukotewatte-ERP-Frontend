"use client";

import { useQuery, useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query";
import {
    getEstateLoans, createEstateLoan, updateEstateLoan, deleteEstateLoan, recordEstateLoanPayment,
    recordEstateLoanDrawdown, undoLastLoanMovement, getLoanMovements, getBorrowingSchedule,
    getFixedAssets, createFixedAsset, updateFixedAsset, disposeFixedAsset, deleteFixedAsset,
    getFixedAssetSummary, getDepreciationSchedule,
} from "@/features/assets/services/assets-service";
import { invalidateAccountQueries } from "@/features/accounts/hooks/use-accounts";
import type {
    EstateLoanRequest, EstateLoanUpdateRequest, EstateLoanPaymentRequest, EstateLoanDrawdownRequest,
    FixedAssetFilters, FixedAssetRequest, FixedAssetUpdateRequest, FixedAssetDisposalRequest,
} from "@/features/assets/types/assets.types";

// ─── Named Estate Loans ─────────────────────────────────────────────────────

export function useEstateLoans() {
    return useQuery({
        queryKey: ["estate-loans"],
        queryFn: () => getEstateLoans(),
    });
}

export function useLoanMovements(loanId: string | null) {
    return useQuery({
        queryKey: ["estate-loan-movements", loanId],
        queryFn: () => getLoanMovements(loanId as string),
        enabled: !!loanId,
    });
}

export function useBorrowingSchedule(from: string, to: string) {
    return useQuery({
        queryKey: ["borrowing-schedule", from, to],
        queryFn: () => getBorrowingSchedule(from, to),
        enabled: !!from && !!to && from <= to,
    });
}

/** Loans, their movements, the schedule and every account balance change together. */
function invalidateLoans(qc: QueryClient) {
    qc.invalidateQueries({ queryKey: ["estate-loans"] });
    qc.invalidateQueries({ queryKey: ["estate-loan-movements"] });
    qc.invalidateQueries({ queryKey: ["borrowing-schedule"] });
    qc.invalidateQueries({ queryKey: ["expenses"] });
    invalidateAccountQueries(qc);
}

export function useCreateEstateLoanRecord() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: EstateLoanRequest) => createEstateLoan(payload),
        onSuccess: () => invalidateLoans(qc),
    });
}

export function useUpdateEstateLoan() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ loanId, payload }: { loanId: string; payload: EstateLoanUpdateRequest }) =>
            updateEstateLoan(loanId, payload),
        onSuccess: () => invalidateLoans(qc),
    });
}

export function useDeleteEstateLoan() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (loanId: string) => deleteEstateLoan(loanId),
        onSuccess: () => invalidateLoans(qc),
    });
}

export function useRecordEstateLoanPayment() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ loanId, payload }: { loanId: string; payload: EstateLoanPaymentRequest }) =>
            recordEstateLoanPayment(loanId, payload),
        onSuccess: () => invalidateLoans(qc),
    });
}

export function useRecordEstateLoanDrawdown() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ loanId, payload }: { loanId: string; payload: EstateLoanDrawdownRequest }) =>
            recordEstateLoanDrawdown(loanId, payload),
        onSuccess: () => invalidateLoans(qc),
    });
}

export function useUndoLastLoanMovement() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (loanId: string) => undoLastLoanMovement(loanId),
        onSuccess: () => invalidateLoans(qc),
    });
}

// ─── Fixed Assets ───────────────────────────────────────────────────────────

export function useFixedAssets(params?: FixedAssetFilters) {
    return useQuery({
        queryKey: ["fixed-assets", params],
        queryFn: () => getFixedAssets(params),
    });
}

export function useFixedAssetSummary() {
    return useQuery({
        queryKey: ["fixed-asset-summary"],
        queryFn: () => getFixedAssetSummary(),
    });
}

export function useDepreciationSchedule(from: string, to: string) {
    return useQuery({
        queryKey: ["depreciation-schedule", from, to],
        queryFn: () => getDepreciationSchedule(from, to),
        enabled: !!from && !!to && from <= to,
    });
}

function invalidateFixedAssets(qc: QueryClient) {
    qc.invalidateQueries({ queryKey: ["fixed-assets"] });
    qc.invalidateQueries({ queryKey: ["fixed-asset-summary"] });
    qc.invalidateQueries({ queryKey: ["depreciation-schedule"] });
    invalidateAccountQueries(qc);
}

export function useCreateFixedAsset() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: FixedAssetRequest) => createFixedAsset(payload),
        onSuccess: () => invalidateFixedAssets(qc),
    });
}

export function useUpdateFixedAsset() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: FixedAssetUpdateRequest }) => updateFixedAsset(id, payload),
        onSuccess: () => invalidateFixedAssets(qc),
    });
}

export function useDisposeFixedAsset() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: FixedAssetDisposalRequest }) => disposeFixedAsset(id, payload),
        onSuccess: () => invalidateFixedAssets(qc),
    });
}

export function useDeleteFixedAsset() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteFixedAsset(id),
        onSuccess: () => invalidateFixedAssets(qc),
    });
}
