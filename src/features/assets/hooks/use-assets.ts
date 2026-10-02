"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getEstateLoans, createEstateLoan, recordEstateLoanPayment,
    getFixedAssets, createFixedAsset, updateFixedAsset, getFixedAssetSummary,
} from "@/features/assets/services/assets-service";
import { invalidateAccountQueries } from "@/features/accounts/hooks/use-accounts";
import type {
    EstateLoanRequest, EstateLoanPaymentRequest,
    FixedAssetFilters, FixedAssetRequest, FixedAssetUpdateRequest,
} from "@/features/assets/types/assets.types";

// ─── Named Estate Loans ─────────────────────────────────────────────────────

export function useEstateLoans() {
    return useQuery({
        queryKey: ["estate-loans"],
        queryFn: () => getEstateLoans(),
    });
}

export function useCreateEstateLoanRecord() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: EstateLoanRequest) => createEstateLoan(payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["estate-loans"] });
            invalidateAccountQueries(qc);
        },
    });
}

export function useRecordEstateLoanPayment() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ loanId, payload }: { loanId: string; payload: EstateLoanPaymentRequest }) =>
            recordEstateLoanPayment(loanId, payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["estate-loans"] });
            invalidateAccountQueries(qc);
        },
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

function invalidateFixedAssets(qc: ReturnType<typeof useQueryClient>) {
    qc.invalidateQueries({ queryKey: ["fixed-assets"] });
    qc.invalidateQueries({ queryKey: ["fixed-asset-summary"] });
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
