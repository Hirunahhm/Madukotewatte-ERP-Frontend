"use client";

import { Droplets, Wind, Umbrella, Sunrise, Sunset, Clock, Loader2, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { describeWeatherCode, formatTemp, formatTime } from "@/features/weather/utils/weather-code";
import type { TemperatureUnit, WeatherData } from "@/features/weather/types/weather.types";

interface LiveWeatherProps {
    data: WeatherData | undefined;
    isLoading: boolean;
    isError: boolean;
    unit: TemperatureUnit;
    onToggleUnit: (unit: TemperatureUnit) => void;
}

export function LiveWeather({ data, isLoading, isError, unit, onToggleUnit }: LiveWeatherProps) {
    const today = data?.daily[0];
    const condition = data ? describeWeatherCode(data.current.weatherCode, data.current.isDay) : null;

    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Climate & Forecasting</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Real-time weather tracking for estate operations scheduling — {data?.location.label ?? "Estate"}.
                    </p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="flex bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-1">
                        <Button
                            size="sm"
                            variant={unit === "C" ? "secondary" : "ghost"}
                            className={cn("h-7 text-xs", unit === "C" ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100")}
                            onClick={() => onToggleUnit("C")}
                        >
                            °C
                        </Button>
                        <Button
                            size="sm"
                            variant={unit === "F" ? "secondary" : "ghost"}
                            className={cn("h-7 text-xs", unit === "F" ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100")}
                            onClick={() => onToggleUnit("F")}
                        >
                            °F
                        </Button>
                    </div>
                </div>
            </div>

            <Card className="shadow-sm gap-0 overflow-hidden p-0">
                {isLoading ? (
                    <div className="flex items-center justify-center py-24">
                        <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
                    </div>
                ) : isError || !data || !today || !condition ? (
                    <div className="flex flex-col items-center justify-center gap-2 py-24 text-center px-6">
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Unable to load live weather data.</p>
                    </div>
                ) : (
                    <>
                        <div className="p-6">
                            <div className="flex items-center gap-2 text-brand-600 font-bold text-xs tracking-wider mb-6">
                                <span className="flex items-center gap-1">
                                    <condition.icon className="w-4 h-4" /> LIVE NOW • {data.location.label.toUpperCase()}
                                </span>
                            </div>

                            <div className="flex flex-col md:flex-row justify-between gap-8 bg-white dark:bg-transparent">
                                <div className="flex-1">
                                    <div className="flex items-start">
                                        <span className="text-7xl font-bold text-gray-900 dark:text-gray-100 tracking-tighter">
                                            {formatTemp(data.current.temperature, unit)}
                                        </span>
                                        <span className="text-3xl font-bold text-brand-500 mt-2">°{unit}</span>
                                    </div>
                                    <p className="text-xl font-medium text-gray-400 dark:text-gray-500 mt-2">{condition.label}</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Feels like {formatTemp(data.current.apparentTemperature, unit)}°{unit}</p>

                                    <div className="flex items-center gap-2 mt-6">
                                        <span className="px-3 py-1 bg-brand-50 dark:bg-brand-950/30 text-brand-600 text-xs font-bold rounded-full border border-brand-100 dark:border-brand-800">
                                            High {formatTemp(today.tempMax, unit)}°
                                        </span>
                                        <span className="px-3 py-1 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold rounded-full border border-gray-100 dark:border-gray-700/40">
                                            Low {formatTemp(today.tempMin, unit)}°
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-1 grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/40 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500"><Droplets className="w-5 h-5" /></div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Humidity</p>
                                            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{Math.round(data.current.humidity)}<span className="text-xs text-gray-500 dark:text-gray-400">%</span></p>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/40 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-500"><Wind className="w-5 h-5" /></div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Wind Speed</p>
                                            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{Math.round(data.current.windSpeed)}<span className="text-xs text-gray-500 dark:text-gray-400">km/h</span></p>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/40 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500"><condition.icon className="w-5 h-5" /></div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">UV Index</p>
                                            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                                {Math.round(today.uvIndexMax)}
                                                <span className="text-xs text-gray-500 dark:text-gray-400 inline-block ml-1">{uvLabel(today.uvIndexMax)}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/40 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-500"><Umbrella className="w-5 h-5" /></div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Rain Chance</p>
                                            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{Math.round(today.precipitationProbabilityMax)}<span className="text-xs text-gray-500 dark:text-gray-400">%</span></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 dark:border-gray-700/40 bg-gray-50/50 dark:bg-gray-800/50 p-4 flex flex-col sm:flex-row items-center justify-between text-xs font-semibold text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-6">
                                <span className="flex items-center gap-2"><Sunrise className="w-4 h-4 text-orange-400" /> Sunrise: {formatTime(today.sunrise)}</span>
                                <span className="flex items-center gap-2"><Sunset className="w-4 h-4 text-orange-500" /> Sunset: {formatTime(today.sunset)}</span>
                            </div>
                            <span className="flex items-center gap-1 mt-4 sm:mt-0 italic">
                                <Clock className="w-3.5 h-3.5" /> Last updated: {formatTime(data.generatedAt)}
                            </span>
                        </div>
                    </>
                )}
            </Card>
        </>
    );
}

function uvLabel(uv: number): string {
    if (uv < 3) return "Low";
    if (uv < 6) return "Moderate";
    if (uv < 8) return "High";
    if (uv < 11) return "Very High";
    return "Extreme";
}
