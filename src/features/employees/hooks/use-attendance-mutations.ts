"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAttendance, createAttendanceBulk } from "@/features/employees/services/attendance-service";

export function useRecordAttendance() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createAttendance,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["attendance"] });
        },
    });
}

export function useBulkAttendance() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createAttendanceBulk,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["attendance"] });
        },
    });
}
