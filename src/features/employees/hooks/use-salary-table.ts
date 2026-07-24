"use client";

import { useQuery } from "@tanstack/react-query";
import { getMonthlyPayroll } from "@/features/employees/services/payroll-service";

export function useSalaryTable(month: number, year: number) {
    return useQuery({
        queryKey: ["salary-table", month, year],
        queryFn: () => getMonthlyPayroll(month, year),
    });
}
