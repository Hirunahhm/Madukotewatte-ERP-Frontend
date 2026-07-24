"use client";

import { useQuery } from "@tanstack/react-query";
import { getEmployees } from "@/features/employees/services/employee-service";

export function useEmployees(params: { name?: string; page?: number; size?: number }) {
    return useQuery({
        queryKey: ["employees", params],
        queryFn: () => getEmployees(params),
    });
}
