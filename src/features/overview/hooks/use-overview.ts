"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardOverview } from "@/features/overview/services/overview-service";

/** The whole dashboard in one call. `month` is "YYYY-MM"; omit for the current month. */
export function useDashboardOverview(month?: string) {
    return useQuery({
        queryKey: ["dashboard-overview", month ?? "current"],
        queryFn: () => getDashboardOverview(month),
        staleTime: 60 * 1000,
        refetchInterval: 5 * 60 * 1000,
    });
}
