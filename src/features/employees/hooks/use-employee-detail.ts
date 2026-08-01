"use client";

import { useQuery } from "@tanstack/react-query";
import {
    getEmployee,
    getEmployeeAttendance,
    getEmployeeAttendanceStats,
    getEmployeeTransactions,
    getEmployeeTransactionStats,
} from "@/features/employees/services/employee-service";
import { getEmployeeLoans } from "@/features/employees/services/loan-service";

export interface AttendanceFilters {
    page: number;
    from?: string;
    to?: string;
    status?: string;
}

export interface TransactionFilters {
    page: number;
    from?: string;
    to?: string;
    type?: string;
}

function useEmployeeQuery(employeeId: string | null) {
    return useQuery({
        queryKey: ["employee", employeeId],
        queryFn: () => getEmployee(employeeId as string),
        enabled: !!employeeId,
    });
}

export function useEmployeeAttendanceDetail(
    employeeId: string | null,
    attendanceFilters: AttendanceFilters,
) {
    const employee = useEmployeeQuery(employeeId);

    const attendance = useQuery({
        queryKey: ["employee", employeeId, "attendance", attendanceFilters],
        queryFn: () => getEmployeeAttendance(employeeId as string, { ...attendanceFilters, size: 10 }),
        enabled: !!employeeId,
    });

    const attendanceStats = useQuery({
        queryKey: ["employee", employeeId, "attendance-stats", attendanceFilters.from, attendanceFilters.to],
        queryFn: () => getEmployeeAttendanceStats(employeeId as string, { from: attendanceFilters.from, to: attendanceFilters.to }),
        enabled: !!employeeId,
    });

    return { employee, attendance, attendanceStats };
}

export function useEmployeePaymentDetail(
    employeeId: string | null,
    transactionFilters: TransactionFilters,
) {
    const employee = useEmployeeQuery(employeeId);

    const transactions = useQuery({
        queryKey: ["employee", employeeId, "transactions", transactionFilters],
        queryFn: () => getEmployeeTransactions(employeeId as string, { ...transactionFilters, size: 10 }),
        enabled: !!employeeId,
    });

    const transactionStats = useQuery({
        queryKey: ["employee", employeeId, "transaction-stats", transactionFilters.from, transactionFilters.to],
        queryFn: () => getEmployeeTransactionStats(employeeId as string, { from: transactionFilters.from, to: transactionFilters.to }),
        enabled: !!employeeId,
    });

    const loans = useQuery({
        queryKey: ["employee", employeeId, "loans"],
        queryFn: () => getEmployeeLoans(employeeId as string),
        enabled: !!employeeId,
    });

    return { employee, transactions, transactionStats, loans };
}
