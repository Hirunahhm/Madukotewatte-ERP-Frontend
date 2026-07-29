"use client";

import { useQuery } from "@tanstack/react-query";
import { getWeather } from "@/features/weather/services/weather-service";

export function useWeather() {
    return useQuery({
        queryKey: ["weather"],
        queryFn: getWeather,
        staleTime: 5 * 60 * 1000,
        refetchInterval: 10 * 60 * 1000,
    });
}
