"use client";

import Link from "next/link";
import { Loader2, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useWeather } from "@/features/weather/hooks/use-weather";
import { describeWeatherCode, formatDayLabel } from "@/features/weather/utils/weather-code";

export function WeatherWidget() {
    const { data, isLoading, isError } = useWeather();
    const condition = data ? describeWeatherCode(data.current.weatherCode, data.current.isDay) : null;

    return (
        <Card className="shadow-sm flex flex-col gap-0">
            <CardHeader className="px-6 pt-6 pb-0">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-base font-semibold">Climate Outlook</CardTitle>
                        <CardDescription>Weather conditions impacting tapping schedules</CardDescription>
                    </div>
                    <Link href="/weather" className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 shrink-0">
                        Full Forecast <ArrowRight className="h-3 w-3" />
                    </Link>
                </div>
            </CardHeader>
            <CardContent className="flex-1 p-6">
                <div className="flex h-full items-center justify-between rounded-lg border border-gray-100 dark:border-gray-700/40 dark:bg-gray-800/30 p-6">
                    {isLoading ? (
                        <div className="flex w-full items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
                        </div>
                    ) : isError || !data || !condition ? (
                        <p className="w-full text-center text-sm text-gray-400 py-8">Unable to load weather data.</p>
                    ) : (
                        <>
                            <div className="flex items-center gap-6">
                                <condition.icon className="h-16 w-16 text-gray-400" />
                                <div>
                                    <p className="text-4xl font-bold text-gray-900 dark:text-gray-100">{Math.round(data.current.temperature)}°C</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{data.location.label}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                                        {condition.label} · {Math.round(data.current.windSpeed)} km/h
                                    </p>
                                </div>
                            </div>

                            <div className="hidden sm:flex items-center gap-4 text-center border-l border-gray-100 dark:border-gray-700/40 pl-6 ml-6">
                                {data.daily.slice(0, 4).map((day, idx) => {
                                    const dayCondition = describeWeatherCode(day.weatherCode);
                                    return (
                                        <div key={day.date} className="flex flex-col items-center gap-2">
                                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                                                {idx === 0 ? "Today" : formatDayLabel(day.date, idx).slice(0, 3).toUpperCase()}
                                            </span>
                                            <dayCondition.icon className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                                            <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{Math.round(day.tempMax)}°C</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
