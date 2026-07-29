"use client";

import { useState } from "react";
import { LiveWeather } from "@/features/weather/components/live-weather";
import { Next24Hours } from "@/features/weather/components/next-24-hours";
import { Outlook5Day } from "@/features/weather/components/outlook-5-day";
import { SatelliteRadar } from "@/features/weather/components/satellite-radar";
import { ActiveAlerts } from "@/features/weather/components/active-alerts";
import { AirQuality } from "@/features/weather/components/air-quality";
import { useWeather } from "@/features/weather/hooks/use-weather";
import type { TemperatureUnit } from "@/features/weather/types/weather.types";

export function WeatherPageClient() {
    const [unit, setUnit] = useState<TemperatureUnit>("C");
    const { data, isLoading, isError } = useWeather();

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <LiveWeather data={data} isLoading={isLoading} isError={isError} unit={unit} onToggleUnit={setUnit} />
                    <Next24Hours data={data} isLoading={isLoading} unit={unit} />
                    <Outlook5Day data={data} isLoading={isLoading} unit={unit} />
                </div>
                <div className="space-y-6">
                    <SatelliteRadar />
                    <ActiveAlerts data={data} isLoading={isLoading} />
                    <AirQuality data={data} isLoading={isLoading} />
                </div>
            </div>
        </div>
    );
}
