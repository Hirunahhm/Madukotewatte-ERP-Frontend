"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getCoconutRecords, createCoconutRecord, updateCoconutRecord, deleteCoconutRecord,
    getCoconutLoadSummary, getCoconutLoadTrends, getCoconutVarietyBreakdown,
} from "@/features/production/services/coconut-production-service";
import type { CoconutRecordRequest } from "@/features/production/types/coconut-production.types";

export function useCoconutRecords(params?: { page?: number; size?: number; variety?: string; from?: string; to?: string }) {
    return useQuery({
        queryKey: ["coconut-records", params],
        queryFn: () => getCoconutRecords(params),
    });
}

export function useCreateCoconutRecord() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: CoconutRecordRequest) => createCoconutRecord(payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["coconut-records"] });
            qc.invalidateQueries({ queryKey: ["coconut-load-summary"] });
            qc.invalidateQueries({ queryKey: ["coconut-load-trends"] });
            qc.invalidateQueries({ queryKey: ["coconut-variety-breakdown"] });
        },
    });
}

export function useUpdateCoconutRecord() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: CoconutRecordRequest }) => updateCoconutRecord(id, payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["coconut-records"] });
            qc.invalidateQueries({ queryKey: ["coconut-load-summary"] });
            qc.invalidateQueries({ queryKey: ["coconut-load-trends"] });
            qc.invalidateQueries({ queryKey: ["coconut-variety-breakdown"] });
        },
    });
}

export function useDeleteCoconutRecord() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteCoconutRecord(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["coconut-records"] });
            qc.invalidateQueries({ queryKey: ["coconut-load-summary"] });
            qc.invalidateQueries({ queryKey: ["coconut-load-trends"] });
            qc.invalidateQueries({ queryKey: ["coconut-variety-breakdown"] });
        },
    });
}

export function useCoconutLoadSummary(loadId: string) {
    return useQuery({
        queryKey: ["coconut-load-summary", loadId],
        queryFn: () => getCoconutLoadSummary(loadId),
        enabled: !!loadId,
    });
}

export function useCoconutLoadTrends(loadId: string, days: number = 7) {
    return useQuery({
        queryKey: ["coconut-load-trends", loadId, days],
        queryFn: () => getCoconutLoadTrends(loadId, days),
        enabled: !!loadId,
    });
}

export function useCoconutVarietyBreakdown(params?: { from?: string; to?: string }) {
    return useQuery({
        queryKey: ["coconut-variety-breakdown", params],
        queryFn: () => getCoconutVarietyBreakdown(params),
    });
}
