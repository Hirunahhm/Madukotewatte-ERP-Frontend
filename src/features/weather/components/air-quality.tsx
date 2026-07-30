"use client";

import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { categorizeAqi, AQI_SCALE_MAX } from "@/features/weather/utils/aqi";
import type { WeatherData } from "@/features/weather/types/weather.types";

interface AirQualityProps {
    data: WeatherData | undefined;
    isLoading: boolean;
}

export function AirQuality({ data, isLoading }: AirQualityProps) {
    const aqi = data?.airQuality;
    const category = aqi ? categorizeAqi(aqi.usAqi) : null;
    const fillPct = aqi ? Math.min(100, (aqi.usAqi / AQI_SCALE_MAX) * 100) : 0;

    return (
        <Card className="bg-gray-50 dark:bg-gray-800/50 shadow-sm gap-0 p-6">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-brand-500"></div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Air Quality Index</h3>
            </div>

            {isLoading || !aqi || !category ? (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-5 h-5 animate-spin text-brand-500" />
                </div>
            ) : (
                <>
                    <div className="flex items-end justify-between border-b border-gray-200 dark:border-gray-600 pb-4 mb-4">
                        <div>
                            <p className="text-4xl font-black tracking-tighter" style={{ color: category.color }}>{Math.round(aqi.usAqi)}</p>
                            <p className="text-xs font-bold uppercase tracking-wider mt-1" style={{ color: category.color }}>{category.label}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Dominant Pollutant</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{aqi.dominantPollutant}</p>
                        </div>
                    </div>

                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${fillPct}%`, backgroundColor: category.color }}></div>
                    </div>
                </>
            )}
        </Card>
    );
}
