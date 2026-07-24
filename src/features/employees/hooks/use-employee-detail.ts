"use client";

import { useQuery } from "@tanstack/react-query";
import {
    getEmployee,
    getEmployeeAttendance,
    getEmployeeTransactions,
} from "@/features/employees/services/employee-service";
import { getEmployeeLoans } from "@/features/employees/services/loan-service";

export function useEmployeeDetail(employeeId: string | null, attendancePage: number) {
    const employee = useQuery({
        queryKey: ["employee", employeeId],
        queryFn: () => getEmployee(employeeId as string),
        enabled: !!employeeId,
    });

    const attendance = useQuery({
        queryKey: ["employee", employeeId, "attendance", attendancePage],
        queryFn: () => getEmployeeAttendance(employeeId as string, { page: attendancePage, size: 10 }),
        enabled: !!employeeId,
    });

    const transactions = useQuery({
        queryKey: ["employee", employeeId, "transactions"],
        queryFn: () => getEmployeeTransactions(employeeId as string),
        enabled: !!employeeId,
    });

    const loans = useQuery({
        queryKey: ["employee", employeeId, "loans"],
        queryFn: () => getEmployeeLoans(employeeId as string),
        enabled: !!employeeId,
    });

    return { employee, attendance, transactions, loans };
}
