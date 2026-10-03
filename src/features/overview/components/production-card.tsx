"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";
import { NoSSR } from "@/components/ui/no-ssr";
import { chartColors } from "@/lib/theme";
import { compactNumber, formatQuantity, shortMonthLabel } from "@/features/overview/utils/format";
import type { OverviewProduction, OverviewTrendPoint } from "@/features/overview/types/overview.types";

function Stat({ label, value, unit }: { label: string; value: string; unit?: string }) {
    return (
        <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {value} {unit && <span className="text-xs font-medium text-gray-500">{unit}</span>}
            </p>
        </div>
    );
}

export function ProductionCard({ production, trend }: { production: OverviewProduction; trend: OverviewTrendPoint[] }) {
    const data = trend.map((p) => ({ name: shortMonthLabel(p.month), litres: p.latexLitres }));
    const hasTrend = data.some((d) => d.litres > 0);
    return (
        <Card className="shadow-sm gap-0 p-6">
            <div className="mb-4 flex items-start justify-between">
                <div>
                    <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Production</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Latex, rubber and crop harvests this month</p>
                </div>
                <Link href="/latex-production" className="flex shrink-0 items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700">
                    Details <ArrowRight className="h-3 w-3" />
                </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <Stat label="Latex today" value={formatQuantity(production.latexToday)} unit="L" />
                <Stat label="Latex this month" value={formatQuantity(production.latexMonthToDate)} unit="L" />
                <Stat label="Rubber this month" value={formatQuantity(production.rubberKgMonthToDate)} unit="kg" />
                <Stat label="Trees tapped" value={formatQuantity(production.treesTappedMonthToDate)} />
                <Stat label="Yield per tree" value={production.latexPerTree === null ? "-" : production.latexPerTree.toFixed(3)} unit="L" />
                <Stat label="Last month, same days" value={formatQuantity(production.latexPreviousMonthSameDays)} unit="L" />
            </div>

            <div className="mt-5 h-40 w-full">
                {hasTrend ? (
                    <NoSSR>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data} margin={{ top: 4, right: 0, left: -15, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--chart-axis)" }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--chart-axis)" }} tickFormatter={compactNumber} />
                                <Tooltip formatter={(value) => [`${formatQuantity(Number(value))} L`, "Latex"]} contentStyle={{ fontSize: 12 }} />
                                <Area type="monotone" dataKey="litres" stroke={chartColors.primary} fill={chartColors.primary} fillOpacity={0.15} strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </NoSSR>
                ) : (
                    <p className="py-12 text-center text-sm text-gray-400">No latex recorded in the last 12 months.</p>
                )}
            </div>

            <p className="mt-4 mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">Crop harvests this month</p>
            {production.crops.length === 0 ? (
                <p className="text-sm text-gray-400">No coconut, banana, manioc, cocoa or other harvests recorded this month.</p>
            ) : (
                <div className="grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3">
                    {production.crops.map((c) => (
                        <div key={`${c.crop}-${c.unit}`} className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">{c.crop}</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">{formatQuantity(c.quantity)} {c.unit}</span>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
}
