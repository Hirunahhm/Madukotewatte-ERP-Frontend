"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getWeatherHistory,
    getWeatherInsights,
    getWeatherOutlook,
    syncWeatherHistory,
} from "@/features/weather/services/weather-insights-service";

export function useWeatherOutlook() {
    return useQuery({ queryKey: ["weather", "outlook"], queryFn: getWeatherOutlook, staleTime: 10 * 60 * 1000 });
}

export function useWeatherInsights(from?: string, to?: string) {
    return useQuery({
        queryKey: ["weather", "insights", from, to],
        queryFn: () => getWeatherInsights(from, to),
        staleTime: 5 * 60 * 1000,
    });
}

export function useWeatherHistory(from: string, to: string) {
    return useQuery({
        queryKey: ["weather", "history", from, to],
        queryFn: () => getWeatherHistory(from, to),
        enabled: Boolean(from && to && from <= to),
    });
}

export function useSyncWeatherHistory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ from, to }: { from: string; to: string }) => syncWeatherHistory(from, to),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["weather"] }),
    });
}
