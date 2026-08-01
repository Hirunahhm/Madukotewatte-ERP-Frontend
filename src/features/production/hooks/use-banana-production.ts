"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getBananaRecords, createBananaRecord, updateBananaRecord, deleteBananaRecord,
    getBananaLoadSummary, getBananaLoadTrends, getBananaVarietyBreakdown,
} from "@/features/production/services/banana-production-service";
import type { BananaRecordRequest } from "@/features/production/types/banana-production.types";

export function useBananaRecords(params?: { page?: number; size?: number; variety?: string; from?: string; to?: string }) {
    return useQuery({
        queryKey: ["banana-records", params],
        queryFn: () => getBananaRecords(params),
    });
}

export function useCreateBananaRecord() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: BananaRecordRequest) => createBananaRecord(payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["banana-records"] });
            qc.invalidateQueries({ queryKey: ["banana-load-summary"] });
            qc.invalidateQueries({ queryKey: ["banana-load-trends"] });
            qc.invalidateQueries({ queryKey: ["banana-variety-breakdown"] });
        },
    });
}

export function useUpdateBananaRecord() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: BananaRecordRequest }) => updateBananaRecord(id, payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["banana-records"] });
            qc.invalidateQueries({ queryKey: ["banana-load-summary"] });
            qc.invalidateQueries({ queryKey: ["banana-load-trends"] });
            qc.invalidateQueries({ queryKey: ["banana-variety-breakdown"] });
        },
    });
}

export function useDeleteBananaRecord() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteBananaRecord(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["banana-records"] });
            qc.invalidateQueries({ queryKey: ["banana-load-summary"] });
            qc.invalidateQueries({ queryKey: ["banana-load-trends"] });
            qc.invalidateQueries({ queryKey: ["banana-variety-breakdown"] });
        },
    });
}

export function useBananaLoadSummary(loadId: string) {
    return useQuery({
        queryKey: ["banana-load-summary", loadId],
        queryFn: () => getBananaLoadSummary(loadId),
        enabled: !!loadId,
    });
}

export function useBananaLoadTrends(loadId: string, days: number = 7) {
    return useQuery({
        queryKey: ["banana-load-trends", loadId, days],
        queryFn: () => getBananaLoadTrends(loadId, days),
        enabled: !!loadId,
    });
}

export function useBananaVarietyBreakdown(params?: { from?: string; to?: string }) {
    return useQuery({
        queryKey: ["banana-variety-breakdown", params],
        queryFn: () => getBananaVarietyBreakdown(params),
    });
}
