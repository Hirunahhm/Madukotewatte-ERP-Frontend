"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEmployee } from "@/features/employees/services/employee-service";

export function useCreateEmployee() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createEmployee,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["employees"] });
        },
    });
}
