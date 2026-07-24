"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLabour, updateLabour } from "@/features/employees/services/labour-service";

export function useCreateLabour() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createLabour,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["labour"] });
            queryClient.invalidateQueries({ queryKey: ["payment-summary"] });
            queryClient.invalidateQueries({ queryKey: ["salary-table"] });
        },
    });
}

export function useUpdateLabour() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof updateLabour>[1] }) =>
            updateLabour(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["labour"] });
            queryClient.invalidateQueries({ queryKey: ["payment-summary"] });
            queryClient.invalidateQueries({ queryKey: ["salary-table"] });
        },
    });
}
