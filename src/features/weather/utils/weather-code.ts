import {
    Sun,
    Moon,
    CloudSun,
    CloudMoon,
    Cloud,
    CloudFog,
    CloudDrizzle,
    CloudRain,
    CloudLightning,
    type LucideIcon,
} from "lucide-react";
import type { TemperatureUnit } from "@/features/weather/types/weather.types";

interface WeatherCodeInfo {
    label: string;
    icon: LucideIcon;
    rainy: boolean;
}

export function describeWeatherCode(code: number, isDay: boolean = true): WeatherCodeInfo {
    switch (true) {
        case code === 0:
            return { label: "Clear Sky", icon: isDay ? Sun : Moon, rainy: false };
        case code === 1:
            return { label: "Mainly Clear", icon: isDay ? Sun : Moon, rainy: false };
        case code === 2:
            return { label: "Partly Cloudy", icon: isDay ? CloudSun : CloudMoon, rainy: false };
        case code === 3:
            return { label: "Overcast", icon: Cloud, rainy: false };
        case code === 45 || code === 48:
            return { label: "Foggy", icon: CloudFog, rainy: false };
        case code >= 51 && code <= 57:
            return { label: "Drizzle", icon: CloudDrizzle, rainy: true };
        case code >= 61 && code <= 67:
            return { label: "Rain", icon: CloudRain, rainy: true };
        case code >= 71 && code <= 77:
            return { label: "Snow", icon: CloudRain, rainy: true };
        case code >= 80 && code <= 82:
            return { label: "Rain Showers", icon: CloudRain, rainy: true };
        case code >= 85 && code <= 86:
            return { label: "Snow Showers", icon: CloudRain, rainy: true };
        case code >= 95 && code <= 99:
            return { label: "Thunderstorm", icon: CloudLightning, rainy: true };
        default:
            return { label: "Unknown", icon: Cloud, rainy: false };
    }
}

export function formatTemp(celsius: number, unit: TemperatureUnit): number {
    const value = unit === "F" ? celsius * 9 / 5 + 32 : celsius;
    return Math.round(value);
}

export function formatTime(iso: string): string {
    return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export function formatDayLabel(dateStr: string, index: number): string {
    if (index === 0) return "Today";
    return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-US", { weekday: "long" });
}

export function formatDateLabel(dateStr: string): string {
    return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
