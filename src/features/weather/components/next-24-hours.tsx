"use client";

import { Clock, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { describeWeatherCode, formatTemp, formatTime } from "@/features/weather/utils/weather-code";
import type { TemperatureUnit, WeatherData } from "@/features/weather/types/weather.types";

interface Next24HoursProps {
    data: WeatherData | undefined;
    isLoading: boolean;
    unit: TemperatureUnit;
}

export function Next24Hours({ data, isLoading, unit }: Next24HoursProps) {
    return (
        <Card className="shadow-sm gap-0 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-brand-500" /> Next 24 Hours
                </h3>
            </div>
            {isLoading || !data ? (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-5 h-5 animate-spin text-brand-500" />
                </div>
            ) : (
                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                    {data.hourly.map((hour, idx) => {
                        const condition = describeWeatherCode(hour.weatherCode);
                        const active = idx === 0;
                        return (
                            <div
                                key={hour.time}
                                className={`min-w-[80px] p-4 rounded-xl flex flex-col items-center justify-center gap-3 border transition-colors ${active ? "bg-brand-500 border-brand-500 text-white shadow-md" : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700/40 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50"}`}
                            >
                                <span className={`text-xs font-semibold ${active ? "text-brand-100" : "text-gray-500 dark:text-gray-400"}`}>
                                    {active ? "Now" : formatTime(hour.time)}
                                </span>
                                <condition.icon className={`w-6 h-6 ${active ? "text-white" : "text-gray-400 dark:text-gray-500"}`} />
                                <span className="text-lg font-bold">{formatTemp(hour.temperature, unit)}°</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </Card>
    );
}
