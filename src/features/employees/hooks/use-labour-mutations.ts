"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLabour, updateLabour } from "@/features/employees/services/labour-service";
import { invalidateAccountQueries } from "@/features/accounts/hooks/use-accounts";

export function useCreateLabour() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createLabour,
        onSuccess: () => {
            invalidateAccountQueries(queryClient);
            queryClient.invalidateQueries({ queryKey: ["labour"] });
            queryClient.invalidateQueries({ queryKey: ["payment-summary"] });
            queryClient.invalidateQueries({ queryKey: ["payroll"] });
        },
    });
}

export function useUpdateLabour() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof updateLabour>[1] }) =>
            updateLabour(id, payload),
        onSuccess: () => {
            invalidateAccountQueries(queryClient);
            queryClient.invalidateQueries({ queryKey: ["labour"] });
            queryClient.invalidateQueries({ queryKey: ["payment-summary"] });
            queryClient.invalidateQueries({ queryKey: ["payroll"] });
        },
    });
}
