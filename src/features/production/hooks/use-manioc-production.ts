"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getManiocRecords, createManiocRecord, updateManiocRecord, deleteManiocRecord,
    getManiocLoadSummary, getManiocLoadTrends, getManiocVarietyBreakdown,
} from "@/features/production/services/manioc-production-service";
import type { ManiocRecordRequest } from "@/features/production/types/manioc-production.types";

export function useManiocRecords(params?: { page?: number; size?: number; variety?: string; from?: string; to?: string }) {
    return useQuery({
        queryKey: ["manioc-records", params],
        queryFn: () => getManiocRecords(params),
    });
}

export function useCreateManiocRecord() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: ManiocRecordRequest) => createManiocRecord(payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["manioc-records"] });
            qc.invalidateQueries({ queryKey: ["manioc-load-summary"] });
            qc.invalidateQueries({ queryKey: ["manioc-load-trends"] });
            qc.invalidateQueries({ queryKey: ["manioc-variety-breakdown"] });
        },
    });
}

export function useUpdateManiocRecord() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: ManiocRecordRequest }) => updateManiocRecord(id, payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["manioc-records"] });
            qc.invalidateQueries({ queryKey: ["manioc-load-summary"] });
            qc.invalidateQueries({ queryKey: ["manioc-load-trends"] });
            qc.invalidateQueries({ queryKey: ["manioc-variety-breakdown"] });
        },
    });
}

export function useDeleteManiocRecord() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteManiocRecord(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["manioc-records"] });
            qc.invalidateQueries({ queryKey: ["manioc-load-summary"] });
            qc.invalidateQueries({ queryKey: ["manioc-load-trends"] });
            qc.invalidateQueries({ queryKey: ["manioc-variety-breakdown"] });
        },
    });
}

export function useManiocLoadSummary(loadId: string) {
    return useQuery({
        queryKey: ["manioc-load-summary", loadId],
        queryFn: () => getManiocLoadSummary(loadId),
        enabled: !!loadId,
    });
}

export function useManiocLoadTrends(loadId: string, days: number = 7) {
    return useQuery({
        queryKey: ["manioc-load-trends", loadId, days],
        queryFn: () => getManiocLoadTrends(loadId, days),
        enabled: !!loadId,
    });
}

export function useManiocVarietyBreakdown(params?: { from?: string; to?: string }) {
    return useQuery({
        queryKey: ["manioc-variety-breakdown", params],
        queryFn: () => getManiocVarietyBreakdown(params),
    });
}
