"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getCropHarvests, getCropHarvestSummary, getCropHarvestOptions,
    createCropHarvest, updateCropHarvest, deleteCropHarvest,
} from "@/features/production/services/crop-harvest-service";
import type { CropHarvestRequest } from "@/features/production/types/crop-harvest.types";

export function useCropHarvests(params?: { crop?: string; from?: string; to?: string; page?: number; size?: number }) {
    return useQuery({ queryKey: ["crop-harvests", params], queryFn: () => getCropHarvests(params) });
}

export function useCropHarvestSummary(range?: { from?: string; to?: string }) {
    return useQuery({ queryKey: ["crop-harvest-summary", range ?? null], queryFn: () => getCropHarvestSummary(range) });
}

export function useCropHarvestOptions() {
    return useQuery({ queryKey: ["crop-harvest-options"], queryFn: getCropHarvestOptions, staleTime: Infinity });
}

function useInvalidateHarvests() {
    const qc = useQueryClient();
    return () => {
        qc.invalidateQueries({ queryKey: ["crop-harvests"] });
        qc.invalidateQueries({ queryKey: ["crop-harvest-summary"] });
    };
}

export function useCreateCropHarvest() {
    const invalidate = useInvalidateHarvests();
    return useMutation({ mutationFn: (payload: CropHarvestRequest) => createCropHarvest(payload), onSuccess: invalidate });
}

export function useUpdateCropHarvest() {
    const invalidate = useInvalidateHarvests();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: CropHarvestRequest }) => updateCropHarvest(id, payload),
        onSuccess: invalidate,
    });
}

export function useDeleteCropHarvest() {
    const invalidate = useInvalidateHarvests();
    return useMutation({ mutationFn: (id: string) => deleteCropHarvest(id), onSuccess: invalidate });
}
