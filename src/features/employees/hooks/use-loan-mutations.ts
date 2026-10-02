"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createLoan, getActiveLoans, updateLoan } from "@/features/employees/services/loan-service";
import { invalidatePayrollQueries } from "@/features/employees/hooks/use-payroll";

export function useActiveLoans() {
    return useQuery({
        queryKey: ["loans", "active"],
        queryFn: getActiveLoans,
    });
}

/** Issuing a loan pays the principal out of a cash/bank account, so the ledger queries are refreshed too. */
export function useCreateLoan() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createLoan,
        onSuccess: () => invalidatePayrollQueries(queryClient),
    });
}

export function useUpdateLoan() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof updateLoan>[1] }) =>
            updateLoan(id, payload),
        onSuccess: () => invalidatePayrollQueries(queryClient),
    });
}
