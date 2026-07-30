"use client";

import { Map, Droplets, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { describeWeatherCode, formatTemp, formatDayLabel, formatDateLabel } from "@/features/weather/utils/weather-code";
import type { TemperatureUnit, WeatherData } from "@/features/weather/types/weather.types";

interface Outlook5DayProps {
    data: WeatherData | undefined;
    isLoading: boolean;
    unit: TemperatureUnit;
}

export function Outlook5Day({ data, isLoading, unit }: Outlook5DayProps) {
    return (
        <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-4">
                <Map className="w-5 h-5 text-brand-500" /> 5-Day Outlook
            </h3>
            {isLoading || !data ? (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-5 h-5 animate-spin text-brand-500" />
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {data.daily.slice(0, 5).map((day, idx) => {
                        const condition = describeWeatherCode(day.weatherCode);
                        return (
                            <Card key={day.date} className="shadow-sm gap-0 p-4 flex flex-col items-center text-center">
                                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{formatDayLabel(day.date, idx)}</span>
                                <span className="text-xs text-gray-400 dark:text-gray-500 font-medium mb-4">{formatDateLabel(day.date)}</span>

                                <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center mb-3">
                                    <condition.icon className="w-6 h-6 text-brand-500" />
                                </div>

                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{condition.label}</span>
                                <span className="text-[10px] font-bold text-brand-500 mt-1 flex items-center gap-1">
                                    <Droplets className="w-3 h-3" /> {Math.round(day.precipitationProbabilityMax)}%
                                </span>

                                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-50 dark:border-gray-700/30 w-full justify-center">
                                    <span className="text-base font-bold text-gray-900 dark:text-gray-100">{formatTemp(day.tempMax, unit)}°</span>
                                    <span className="text-sm font-semibold text-gray-400 dark:text-gray-500">{formatTemp(day.tempMin, unit)}°</span>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
