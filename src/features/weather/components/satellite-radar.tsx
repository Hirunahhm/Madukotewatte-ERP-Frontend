"use client";

import { Map } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ESTATE_LOCATION } from "@/features/weather/utils/constants";

const WINDY_EMBED_URL = `https://embed.windy.com/embed2.html?lat=${ESTATE_LOCATION.lat}&lon=${ESTATE_LOCATION.lon}&detailLat=${ESTATE_LOCATION.lat}&detailLon=${ESTATE_LOCATION.lon}&zoom=9&level=surface&overlay=radar&menu=&message=true&marker=true&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1`;

export function SatelliteRadar() {
    return (
        <Card className="shadow-sm gap-0 overflow-hidden p-0 flex flex-col h-[320px]">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700/40 flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Map className="w-4 h-4 text-brand-500" /> Live Radar
                </h3>
                <span className="text-[10px] font-bold tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">Live</span>
            </div>

            <div className="flex-1 relative">
                <iframe
                    src={WINDY_EMBED_URL}
                    className="absolute inset-0 w-full h-full border-0"
                    loading="lazy"
                    title={`Live weather radar for ${ESTATE_LOCATION.label}`}
                />
            </div>
        </Card>
    );
}
