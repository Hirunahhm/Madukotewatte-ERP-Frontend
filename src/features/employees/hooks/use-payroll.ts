"use client";

import { useMutation, useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { invalidateAccountQueries } from "@/features/accounts/hooks/use-accounts";
import {
    createPayslip, createPayslipsBulk, getPayrollPreview, getPayrollSummary, getPayslip, getPayslips, voidPayslip,
    type PayslipListParams,
} from "@/features/employees/services/payroll-service";
import { deleteAdvance, giveAdvance } from "@/features/employees/services/advance-service";
import { deleteLoan, deleteLoanRepayment, repayLoan } from "@/features/employees/services/loan-service";
import type { PayslipRequest } from "@/features/employees/types/payroll.types";
import type { LoanRepaymentRequest } from "@/features/employees/types/loan.types";

/** Everything that depends on payroll / advance / loan state, plus the account balances. */
export function invalidatePayrollQueries(queryClient: QueryClient) {
    invalidateAccountQueries(queryClient);
    queryClient.invalidateQueries({ queryKey: ["payroll"] });
    queryClient.invalidateQueries({ queryKey: ["payment-summary"] });
    queryClient.invalidateQueries({ queryKey: ["loans"] });
    queryClient.invalidateQueries({ queryKey: ["employee"] });
    queryClient.invalidateQueries({ queryKey: ["labour"] });
}

export function usePayrollPreview(from: string, to: string) {
    return useQuery({
        queryKey: ["payroll", "preview", from, to],
        queryFn: () => getPayrollPreview(from, to),
        enabled: !!from && !!to && from <= to,
    });
}

export function useEmployeePayrollPreview(employeeId: string | null, from: string, to: string) {
    return useQuery({
        queryKey: ["payroll", "preview", from, to, employeeId],
        queryFn: () => getPayrollPreview(from, to, employeeId as string),
        enabled: !!employeeId && !!from && !!to && from <= to,
    });
}

export function usePayrollSummary(from: string, to: string) {
    return useQuery({
        queryKey: ["payroll", "summary", from, to],
        queryFn: () => getPayrollSummary(from, to),
        enabled: !!from && !!to && from <= to,
    });
}

export function usePayslips(params: PayslipListParams) {
    return useQuery({
        queryKey: ["payroll", "payslips", params],
        queryFn: () => getPayslips(params),
    });
}

export function usePayslip(id: string | null) {
    return useQuery({
        queryKey: ["payroll", "payslip", id],
        queryFn: () => getPayslip(id as string),
        enabled: !!id,
    });
}

export function useCreatePayslip() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: PayslipRequest) => createPayslip(payload),
        onSuccess: () => invalidatePayrollQueries(queryClient),
    });
}

export function useCreatePayslipsBulk() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: PayslipRequest[]) => createPayslipsBulk(payload),
        onSuccess: () => invalidatePayrollQueries(queryClient),
    });
}

export function useVoidPayslip() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, reason }: { id: string; reason?: string }) => voidPayslip(id, reason),
        onSuccess: () => invalidatePayrollQueries(queryClient),
    });
}

export function useGiveAdvance() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: giveAdvance,
        onSuccess: () => invalidatePayrollQueries(queryClient),
    });
}

export function useDeleteAdvance() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteAdvance(id),
        onSuccess: () => invalidatePayrollQueries(queryClient),
    });
}

export function useRepayLoan() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ loanId, payload }: { loanId: string; payload: LoanRepaymentRequest }) => repayLoan(loanId, payload),
        onSuccess: () => invalidatePayrollQueries(queryClient),
    });
}

export function useDeleteLoanRepayment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ loanId, repaymentId }: { loanId: string; repaymentId: string }) =>
            deleteLoanRepayment(loanId, repaymentId),
        onSuccess: () => invalidatePayrollQueries(queryClient),
    });
}

export function useDeleteLoan() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteLoan(id),
        onSuccess: () => invalidatePayrollQueries(queryClient),
    });
}
