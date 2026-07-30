"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getLoads, createLoad, updateLoad, deleteLoad, getLoadSummary, getLoadTrends,
    getLatexRecords, createLatexRecord,
    getMetrolacReadings, createMetrolacReading,
    getAmmoniaRecords, createAmmoniaRecord, updateAmmoniaRecord, deleteAmmoniaRecord, getAmmoniaBalance, getAmmoniaUsage,
    getRubberSolidRecords, createRubberSolidRecord, updateRubberSolidRecord, deleteRubberSolidRecord, getRubberLoadSummary, getRubberLoadTrends,
    getCalendarDays, upsertCalendarDay,
} from "@/features/production/services/production-service";
import type { LoadRequest, LatexRecordRequest, MetrolacReadingRequest, AmmoniaRecordRequest, RubberSolidRecordRequest, CalendarRequest } from "@/features/production/types/production.types";

// ─── Loads ────────────────────────────────────────────────────────────────────

export function useLoads(params?: { page?: number; size?: number; loadType?: string; sort?: string }) {
    return useQuery({
        queryKey: ["loads", params],
        queryFn: () => getLoads(params),
    });
}

export function useCreateLoad() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: LoadRequest) => createLoad(payload),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["loads"] }),
    });
}

export function useUpdateLoad() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: Partial<LoadRequest> }) => updateLoad(id, payload),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["loads"] }),
    });
}

export function useDeleteLoad() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteLoad(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["loads"] }),
    });
}

export function useLoadSummary(loadId: string) {
    return useQuery({
        queryKey: ["load-summary", loadId],
        queryFn: () => getLoadSummary(loadId),
        enabled: !!loadId,
    });
}

export function useLoadTrends(loadId: string, days: number = 7) {
    return useQuery({
        queryKey: ["load-trends", loadId, days],
        queryFn: () => getLoadTrends(loadId, days),
        enabled: !!loadId,
    });
}

// ─── Latex Records ────────────────────────────────────────────────────────────

export function useLatexRecords(params?: { page?: number; size?: number }) {
    return useQuery({
        queryKey: ["latex-records", params],
        queryFn: () => getLatexRecords(params),
    });
}

export function useCreateLatexRecord() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: LatexRecordRequest) => createLatexRecord(payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["latex-records"] });
            qc.invalidateQueries({ queryKey: ["load-summary"] });
            qc.invalidateQueries({ queryKey: ["load-trends"] });
        },
    });
}

// ─── Metrolac Readings ────────────────────────────────────────────────────────

export function useMetrolacReadings(params?: { page?: number; size?: number }) {
    return useQuery({
        queryKey: ["metrolac-readings", params],
        queryFn: () => getMetrolacReadings(params),
    });
}

export function useCreateMetrolacReading() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: MetrolacReadingRequest) => createMetrolacReading(payload),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["metrolac-readings"] }),
    });
}

// ─── Ammonia Records ──────────────────────────────────────────────────────────

export function useAmmoniaRecords(params?: { page?: number; size?: number; type?: string; from?: string; to?: string }) {
    return useQuery({
        queryKey: ["ammonia-records", params],
        queryFn: () => getAmmoniaRecords(params),
    });
}

export function useCreateAmmoniaRecord() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: AmmoniaRecordRequest) => createAmmoniaRecord(payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["ammonia-records"] });
            qc.invalidateQueries({ queryKey: ["ammonia-balance"] });
            qc.invalidateQueries({ queryKey: ["ammonia-usage"] });
        },
    });
}

export function useUpdateAmmoniaRecord() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: AmmoniaRecordRequest }) => updateAmmoniaRecord(id, payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["ammonia-records"] });
            qc.invalidateQueries({ queryKey: ["ammonia-balance"] });
            qc.invalidateQueries({ queryKey: ["ammonia-usage"] });
        },
    });
}

export function useDeleteAmmoniaRecord() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteAmmoniaRecord(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["ammonia-records"] });
            qc.invalidateQueries({ queryKey: ["ammonia-balance"] });
            qc.invalidateQueries({ queryKey: ["ammonia-usage"] });
        },
    });
}

export function useAmmoniaBalance() {
    return useQuery({
        queryKey: ["ammonia-balance"],
        queryFn: () => getAmmoniaBalance(),
    });
}

export function useAmmoniaUsage(days: number = 7) {
    return useQuery({
        queryKey: ["ammonia-usage", days],
        queryFn: () => getAmmoniaUsage(days),
    });
}

// ─── Rubber Solid Records ─────────────────────────────────────────────────────

export function useRubberSolidRecords(params?: { page?: number; size?: number; from?: string; to?: string }) {
    return useQuery({
        queryKey: ["rubber-solid-records", params],
        queryFn: () => getRubberSolidRecords(params),
    });
}

export function useCreateRubberSolidRecord() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: RubberSolidRecordRequest) => createRubberSolidRecord(payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["rubber-solid-records"] });
            qc.invalidateQueries({ queryKey: ["rubber-load-summary"] });
            qc.invalidateQueries({ queryKey: ["rubber-load-trends"] });
        },
    });
}

export function useUpdateRubberSolidRecord() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: RubberSolidRecordRequest }) => updateRubberSolidRecord(id, payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["rubber-solid-records"] });
            qc.invalidateQueries({ queryKey: ["rubber-load-summary"] });
            qc.invalidateQueries({ queryKey: ["rubber-load-trends"] });
        },
    });
}

export function useDeleteRubberSolidRecord() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteRubberSolidRecord(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["rubber-solid-records"] });
            qc.invalidateQueries({ queryKey: ["rubber-load-summary"] });
            qc.invalidateQueries({ queryKey: ["rubber-load-trends"] });
        },
    });
}

export function useRubberLoadSummary(loadId: string) {
    return useQuery({
        queryKey: ["rubber-load-summary", loadId],
        queryFn: () => getRubberLoadSummary(loadId),
        enabled: !!loadId,
    });
}

export function useRubberLoadTrends(loadId: string, days: number = 7) {
    return useQuery({
        queryKey: ["rubber-load-trends", loadId, days],
        queryFn: () => getRubberLoadTrends(loadId, days),
        enabled: !!loadId,
    });
}

// ─── Calendar ─────────────────────────────────────────────────────────────────

export function useCalendarDays(params?: { page?: number; size?: number }) {
    return useQuery({
        queryKey: ["calendar", params],
        queryFn: () => getCalendarDays(params),
    });
}

export function useUpsertCalendarDay() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: CalendarRequest) => upsertCalendarDay(payload),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["calendar"] }),
    });
}
