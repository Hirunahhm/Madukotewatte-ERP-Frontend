"use client";

import { useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { NoSSR } from "@/components/ui/no-ssr";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useCropHarvestSummary } from "@/features/production/hooks/use-crop-harvests";
import { chartPalette } from "@/lib/theme";

/** Quantity harvested per crop per month. Units are never mixed: one unit is charted at a time. */
export function HarvestChart() {
    const { data, isLoading } = useCropHarvestSummary();
    const [unitChoice, setUnitChoice] = useState<string>("");

    const rows = useMemo(() => data ?? [], [data]);
    const units = useMemo(() => Array.from(new Set(rows.map((r) => r.unit))), [rows]);
    const unit = units.includes(unitChoice) ? unitChoice : (units[0] ?? "kg");

    const { chartData, crops } = useMemo(() => {
        const byMonth = new Map<string, Record<string, number | string>>();
        const cropSet = new Set<string>();
        for (const r of rows.filter((row) => row.unit === unit)) {
            cropSet.add(r.crop);
            const entry = byMonth.get(r.month) ?? { month: r.month };
            entry[r.crop] = Number(r.quantity);
            byMonth.set(r.month, entry);
        }
        return {
            chartData: Array.from(byMonth.values()).sort((a, b) => String(a.month).localeCompare(String(b.month))),
            crops: Array.from(cropSet),
        };
    }, [rows, unit]);

    return (
        <Card className="shadow-sm gap-0 p-6 relative">
            <div className="flex items-center justify-between mb-4 gap-3">
                <div>
                    <CardTitle className="text-base font-semibold">Monthly Harvest by Crop</CardTitle>
                    <CardDescription>Quantity harvested per month ({unit})</CardDescription>
                </div>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-brand-500" /> : units.length > 1 && (
                    <Select value={unit} onValueChange={(v) => { if (v) setUnitChoice(v); }}>
                        <SelectTrigger className="h-8 text-xs w-28"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {units.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                        </SelectContent>
                    </Select>
                )}
            </div>
            <div className="h-64 w-full">
                <NoSSR>
                    {chartData.length === 0 && !isLoading ? (
                        <div className="h-full w-full flex items-center justify-center text-sm text-gray-400">
                            No harvests recorded yet
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--chart-axis)" }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--chart-axis)" }} />
                                <Tooltip />
                                <Legend />
                                {crops.map((crop, i) => (
                                    <Bar key={crop} dataKey={crop} fill={chartPalette[i % chartPalette.length]} radius={[4, 4, 0, 0]} />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </NoSSR>
            </div>
        </Card>
    );
}
