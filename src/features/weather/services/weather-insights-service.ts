import type {
    WeatherDailyRecord,
    WeatherInsights,
    WeatherOutlook,
    WeatherSyncResult,
} from "@/features/weather/types/weather-insights.types";

async function handleResponse<T>(res: Response): Promise<T> {
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error((data as { message?: string }).message ?? "An unexpected error occurred.");
    return data as T;
}

export async function getWeatherHistory(from: string, to: string): Promise<WeatherDailyRecord[]> {
    return handleResponse(await fetch(`/api/weather/history?from=${from}&to=${to}`));
}

export async function getWeatherInsights(from?: string, to?: string): Promise<WeatherInsights> {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    const qs = params.toString();
    return handleResponse(await fetch(`/api/weather/insights${qs ? `?${qs}` : ""}`));
}

export async function getWeatherOutlook(): Promise<WeatherOutlook> {
    return handleResponse(await fetch("/api/weather/outlook"));
}

export async function syncWeatherHistory(from: string, to: string): Promise<WeatherSyncResult> {
    return handleResponse(await fetch(`/api/weather/sync?from=${from}&to=${to}`, { method: "POST" }));
}
