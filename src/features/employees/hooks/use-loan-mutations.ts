"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createLoan, getActiveLoans, updateLoan } from "@/features/employees/services/loan-service";

export function useActiveLoans() {
    return useQuery({
        queryKey: ["loans", "active"],
        queryFn: getActiveLoans,
    });
}

export function useCreateLoan() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createLoan,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["loans"] });
            queryClient.invalidateQueries({ queryKey: ["payment-summary"] });
        },
    });
}

export function useUpdateLoan() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof updateLoan>[1] }) =>
            updateLoan(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["loans"] });
            queryClient.invalidateQueries({ queryKey: ["payment-summary"] });
        },
    });
}
