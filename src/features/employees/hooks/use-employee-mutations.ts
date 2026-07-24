"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEmployee, updateEmployee } from "@/features/employees/services/employee-service";
import type { EmployeeRequest } from "@/features/employees/types/employee.types";

export function useCreateEmployee() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createEmployee,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["employees"] });
        },
    });
}

export function useUpdateEmployee() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: EmployeeRequest }) => updateEmployee(id, payload),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["employees"] });
            queryClient.invalidateQueries({ queryKey: ["employee", variables.id] });
        },
    });
}
