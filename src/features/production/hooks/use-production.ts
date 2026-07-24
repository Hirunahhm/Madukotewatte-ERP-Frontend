"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getLoads, createLoad, updateLoad, deleteLoad,
    getLatexRecords, createLatexRecord,
    getMetrolacReadings, createMetrolacReading,
    getAmmoniaRecords, createAmmoniaRecord,
    getRubberSolidRecords, createRubberSolidRecord,
    getCalendarDays, upsertCalendarDay,
} from "@/features/production/services/production-service";
import type { LoadRequest, LatexRecordRequest, MetrolacReadingRequest, AmmoniaRecordRequest, RubberSolidRecordRequest, CalendarRequest } from "@/features/production/types/production.types";

// ─── Loads ────────────────────────────────────────────────────────────────────

export function useLoads(params?: { page?: number; size?: number }) {
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
        onSuccess: () => qc.invalidateQueries({ queryKey: ["latex-records"] }),
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

export function useAmmoniaRecords(params?: { page?: number; size?: number }) {
    return useQuery({
        queryKey: ["ammonia-records", params],
        queryFn: () => getAmmoniaRecords(params),
    });
}

export function useCreateAmmoniaRecord() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: AmmoniaRecordRequest) => createAmmoniaRecord(payload),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["ammonia-records"] }),
    });
}

// ─── Rubber Solid Records ─────────────────────────────────────────────────────

export function useRubberSolidRecords(params?: { page?: number; size?: number }) {
    return useQuery({
        queryKey: ["rubber-solid-records", params],
        queryFn: () => getRubberSolidRecords(params),
    });
}

export function useCreateRubberSolidRecord() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: RubberSolidRecordRequest) => createRubberSolidRecord(payload),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["rubber-solid-records"] }),
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
