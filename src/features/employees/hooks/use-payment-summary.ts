"use client";

import { useQuery } from "@tanstack/react-query";
import { getPaymentSummary } from "@/features/employees/services/employee-service";

export function usePaymentSummary() {
    return useQuery({
        queryKey: ["payment-summary"],
        queryFn: getPaymentSummary,
    });
}
