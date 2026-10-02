"use client";

import { CheckCircle2, CloudRain, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useWeatherOutlook } from "@/features/weather/hooks/use-weather-insights";
import { formatDateLabel, formatDayLabel } from "@/features/weather/utils/weather-code";

export function TappingOutlook() {
    const { data, isLoading, isError } = useWeatherOutlook();

    return (
        <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-5 h-5 text-brand-500" /> Tapping Outlook — next 7 days
            </h3>
            {data && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    Tappable when rain 4–9am is under {data.tapRainThresholdMm} mm and the chance is under {data.tapRainProbabilityMax}%.{" "}
                    {data.basis.description}
                </p>
            )}
            {isLoading ? (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-5 h-5 animate-spin text-brand-500" />
                </div>
            ) : isError || !data ? (
                <Card className="shadow-sm p-4 text-sm text-gray-500">Tapping outlook is unavailable right now.</Card>
            ) : (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                        {data.days.map((day, idx) => (
                            <Card key={day.date} className="shadow-sm gap-0 p-3 flex flex-col items-center text-center" title={day.summary}>
                                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{formatDayLabel(day.date, idx)}</span>
                                <span className="text-[11px] text-gray-400 mb-2">{formatDateLabel(day.date)}</span>
                                <span
                                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                        day.tappable
                                            ? "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300"
                                            : "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-300"
                                    }`}
                                >
                                    {day.tappable ? "Tap" : "No tap"}
                                </span>
                                <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                                    <CloudRain className="w-3 h-3" />
                                    {day.morningRainMm ?? "—"} mm
                                    {day.morningRainProbabilityMax != null ? ` · ${Math.round(day.morningRainProbabilityMax)}%` : ""}
                                </span>
                                <span className="text-[11px] text-gray-400">day {day.rainMm ?? "—"} mm</span>
                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 mt-2">
                                    {day.tappable && day.expectedLatex != null ? `~${Math.round(day.expectedLatex)} ${data.latexUnit === "litres" ? "L" : data.latexUnit}` : "—"}
                                </span>
                            </Card>
                        ))}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-3">
                        <strong>{data.tappableDays}</strong> of {data.days.length} days look tappable
                        {data.expectedLatexTotal != null && (
                            <>
                                {" "}— expected about <strong>{Math.round(data.expectedLatexTotal).toLocaleString()} {data.latexUnit}</strong> of latex
                                {" "}(avg {data.basis.avgLatexPerTappingDay} per tapping day, {data.basis.sampleDays} days sampled)
                            </>
                        )}
                        .
                    </p>
                </>
            )}
        </div>
    );
}
