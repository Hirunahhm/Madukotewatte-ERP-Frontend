"use client";

import { Card } from "@/components/ui/card";
import type { WeatherInsights } from "@/features/weather/types/weather-insights.types";

interface WeatherInsightKpisProps {
    insights: WeatherInsights | undefined;
    isLoading: boolean;
}

function describeCorrelation(r: number | null): string {
    if (r == null) return "Not enough data yet";
    const abs = Math.abs(r);
    const strength = abs < 0.2 ? "negligible" : abs < 0.5 ? "weak" : abs < 0.8 ? "moderate" : "strong";
    return `${strength} ${r < 0 ? "negative" : "positive"} link`;
}

interface KpiProps {
    label: string;
    value: string;
    hint: string;
}

function Kpi({ label, value, hint }: KpiProps) {
    return (
        <Card className="shadow-sm gap-1 p-4">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</span>
            <span className="text-[11px] text-gray-400">{hint}</span>
        </Card>
    );
}

export function WeatherInsightKpis({ insights, isLoading }: WeatherInsightKpisProps) {
    if (isLoading || !insights) {
        return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[0, 1, 2, 3].map((i) => (
                    <Card key={i} className="h-24 animate-pulse" />
                ))}
            </div>
        );
    }
    const { correlations: c, morningYield: m, rainfallYearToDate: y } = insights;
    const unit = insights.latexUnit === "litres" ? "L" : insights.latexUnit;
    const pct = y.differencePct;
    const dry = m.avgLatexDryMornings != null ? Math.round(m.avgLatexDryMornings) : "—";
    const wet = m.avgLatexWetMornings != null ? Math.round(m.avgLatexWetMornings) : "—";

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Kpi
                label="Rainfall vs yield (correlation)"
                value={c.rainfallVsYield != null ? c.rainfallVsYield.toFixed(2) : "—"}
                hint={`${describeCorrelation(c.rainfallVsYield)} · ${c.rainfallVsYieldSamples} tapping days`}
            />
            <Kpi
                label="Avg yield: dry vs wet mornings"
                value={`${dry} / ${wet} ${unit}`}
                hint={`Dry (under ${m.thresholdMm} mm): ${m.dryMorningTappingDays} days · wet: ${m.wetMorningTappingDays} days`}
            />
            <Kpi
                label="Rain-lost tapping days (this month)"
                value={String(insights.rainLostTappingDaysThisMonth ?? 0)}
                hint={insights.thisMonth}
            />
            <Kpi
                label={`Rainfall ${y.year} year to date`}
                value={y.thisYearMm != null ? `${Math.round(y.thisYearMm).toLocaleString()} mm` : "—"}
                hint={
                    y.lastYearSamePeriodMm != null
                        ? `Last year same period: ${Math.round(y.lastYearSamePeriodMm).toLocaleString()} mm${pct != null ? ` (${pct > 0 ? "+" : ""}${pct}%)` : ""}`
                        : "No comparison data"
                }
            />
        </div>
    );
}
