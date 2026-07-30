import type { WeatherData } from "@/features/weather/types/weather.types";

async function handleResponse<T>(res: Response): Promise<T> {
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? "An unexpected error occurred.");
    return data as T;
}

export async function getWeather(): Promise<WeatherData> {
    const res = await fetch("/api/weather");
    return handleResponse(res);
}
