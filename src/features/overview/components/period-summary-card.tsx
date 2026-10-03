"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";
import { NoSSR } from "@/components/ui/no-ssr";
import { chartPalette } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { formatLkr } from "@/features/accounts/utils/format";
import type { OverviewPeriods, PeriodFigures } from "@/features/overview/types/overview.types";

type PeriodKey = "monthToDate" | "yearToDate" | "financialYearToDate";

const TAB_LABEL: Record<PeriodKey, string> = {
    monthToDate: "Month",
    yearToDate: "Calendar year",
    financialYearToDate: "Financial year",
};

function Line({ label, value, strong }: { label: string; value: number; strong?: boolean }) {
    return (
        <div className={cn("flex items-center justify-between py-1.5 text-sm", strong && "border-t border-gray-100 dark:border-gray-700/40 font-semibold")}>
            <span className="text-gray-500 dark:text-gray-400">{label}</span>
            <span className={cn("text-gray-900 dark:text-gray-100", strong && value < 0 && "text-red-500")}>{formatLkr(value)}</span>
        </div>
    );
}

function Figures({ p }: { p: PeriodFigures }) {
    const total = p.revenueByCrop.reduce((s, r) => s + r.amount, 0);
    return (
        <div className="grid gap-6 md:grid-cols-2">
            <div>
                <p className="mb-2 text-xs text-gray-400">{p.label}: {p.from} to {p.to}</p>
                <Line label="Revenue" value={p.revenue} />
                <Line label="Expenses" value={-p.expenses} />
                <Line label="Operating result" value={p.operatingResult} strong />
                <Line label="Depreciation" value={-p.depreciation} />
                <Line label="Result after depreciation" value={p.resultAfterDepreciation} strong />
                <p className="mt-4 mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">Top expenses</p>
                {p.expensesByCategory.length === 0 ? (
                    <p className="text-sm text-gray-400">No expenses recorded.</p>
                ) : p.expensesByCategory.slice(0, 5).map((c) => (
                    <div key={c.name} className="flex items-center justify-between py-0.5 text-sm">
                        <span className="text-gray-500 dark:text-gray-400">{c.name}</span>
                        <span className="text-gray-900 dark:text-gray-100">{formatLkr(c.amount)}</span>
                    </div>
                ))}
            </div>
            <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Revenue by crop</p>
                {total === 0 ? (
                    <p className="py-10 text-center text-sm text-gray-400">No sales in this period.</p>
                ) : (
                    <>
                        <div className="h-40 w-full">
                            <NoSSR>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={p.revenueByCrop} dataKey="amount" nameKey="name" innerRadius={42} outerRadius={68} paddingAngle={2} stroke="none">
                                            {p.revenueByCrop.map((r, i) => <Cell key={r.name} fill={chartPalette[i % chartPalette.length]} />)}
                                        </Pie>
                                        <Tooltip formatter={(value) => formatLkr(Number(value))} contentStyle={{ fontSize: 12 }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </NoSSR>
                        </div>
                        <ul className="mt-2 space-y-1">
                            {p.revenueByCrop.map((r, i) => (
                                <li key={r.name} className="flex items-center justify-between text-sm">
                                    <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: chartPalette[i % chartPalette.length] }} />
                                        {r.name}
                                    </span>
                                    <span className="text-gray-900 dark:text-gray-100">{formatLkr(r.amount)} <span className="text-xs text-gray-400">({Math.round((r.amount / total) * 100)}%)</span></span>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
}

export function PeriodSummaryCard({ periods }: { periods: OverviewPeriods }) {
    const [tab, setTab] = useState<PeriodKey>("monthToDate");
    return (
        <Card className="shadow-sm gap-0 p-6">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Profit and loss</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Operating result is revenue minus recorded expenses; depreciation is shown separately</p>
                </div>
                <div className="flex items-center gap-1 rounded-lg bg-gray-100 dark:bg-gray-800 p-1">
                    {(Object.keys(TAB_LABEL) as PeriodKey[]).map((k) => (
                        <button
                            key={k}
                            onClick={() => setTab(k)}
                            className={cn(
                                "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                                tab === k
                                    ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-gray-100"
                                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200",
                            )}
                        >
                            {TAB_LABEL[k]}
                        </button>
                    ))}
                </div>
            </div>
            <Figures p={periods[tab]} />
        </Card>
    );
}
