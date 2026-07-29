"use client";

import { AlertTriangle, Info, CheckCircle2, Loader2 } from "lucide-react";
import type { WeatherData } from "@/features/weather/types/weather.types";

interface ActiveAlertsProps {
    data: WeatherData | undefined;
    isLoading: boolean;
}

interface Advisory {
    title: string;
    message: string;
    when: string;
    severity: "warning" | "info";
}

function buildAdvisories(data: WeatherData): Advisory[] {
    const advisories: Advisory[] = [];
    const today = data.daily[0];

    const heavyRainHour = data.hourly.find((h) => h.precipitationProbability >= 70);
    if (heavyRainHour) {
        advisories.push({
            title: "Heavy Rain Advisory",
            message: "High chance of heavy rainfall in the next 24 hours. Consider halting tapping operations and securing harvested latex.",
            when: "Next 24h",
            severity: "warning",
        });
    }

    if (today.uvIndexMax >= 8) {
        advisories.push({
            title: "UV Level High",
            message: "Sun protection recommended for all field labor during peak daylight hours.",
            when: "Today",
            severity: "info",
        });
    }

    if (today.windSpeedMax >= 40) {
        advisories.push({
            title: "Strong Wind Advisory",
            message: "Wind gusts may affect outdoor operations and loose equipment. Exercise caution on estate roads.",
            when: "Today",
            severity: "warning",
        });
    }

    return advisories;
}

export function ActiveAlerts({ data, isLoading }: ActiveAlertsProps) {
    const advisories = data ? buildAdvisories(data) : [];

    return (
        <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-brand-500" /> Forecast Advisories
            </h3>

            {isLoading ? (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-5 h-5 animate-spin text-brand-500" />
                </div>
            ) : advisories.length === 0 ? (
                <div className="p-4 rounded-xl border border-brand-100 bg-brand-50 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-500 shrink-0" />
                    <p className="text-xs text-brand-700 font-medium">No active advisories — conditions look normal.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {advisories.map((advisory) => {
                        const isWarning = advisory.severity === "warning";
                        return (
                            <div
                                key={advisory.title}
                                className={`p-4 rounded-xl border flex items-start gap-3 ${isWarning ? "border-red-200 bg-red-50" : "border-orange-200 bg-orange-50"}`}
                            >
                                {isWarning ? (
                                    <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                ) : (
                                    <Info className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                                )}
                                <div>
                                    <div className="flex items-center justify-between mb-1 gap-3">
                                        <h4 className={`text-sm font-bold ${isWarning ? "text-red-800" : "text-orange-800"}`}>{advisory.title}</h4>
                                        <span className={`text-[10px] font-bold uppercase tracking-widest ${isWarning ? "text-red-400" : "text-orange-400"}`}>
                                            {advisory.when}
                                        </span>
                                    </div>
                                    <p className={`text-xs font-medium leading-relaxed ${isWarning ? "text-red-600/90" : "text-orange-600/90"}`}>
                                        {advisory.message}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
