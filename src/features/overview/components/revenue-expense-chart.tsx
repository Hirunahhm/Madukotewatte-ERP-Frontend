"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";
import { NoSSR } from "@/components/ui/no-ssr";
import { chartColors } from "@/lib/theme";
import { formatLkr } from "@/features/accounts/utils/format";
import { compactNumber, shortMonthLabel } from "@/features/overview/utils/format";
import type { OverviewTrendPoint } from "@/features/overview/types/overview.types";

export function RevenueExpenseChart({ trend }: { trend: OverviewTrendPoint[] }) {
    const data = trend.map((p) => ({ name: shortMonthLabel(p.month), revenue: p.revenue, expenses: p.expenses }));
    const empty = data.every((d) => d.revenue === 0 && d.expenses === 0);
    return (
        <Card className="shadow-sm gap-0 p-6">
            <div className="mb-4">
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Revenue vs expenses</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Last 12 months (LKR). Expenses are costs recorded in the month.</p>
            </div>
            {empty ? (
                <p className="py-16 text-center text-sm text-gray-400">No sales or expenses recorded in this period.</p>
            ) : (
                <div className="h-72 w-full">
                    <NoSSR>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--chart-axis)" }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--chart-axis)" }} tickFormatter={compactNumber} />
                                <Tooltip formatter={(value) => formatLkr(Number(value))} contentStyle={{ fontSize: 12 }} />
                                <Legend wrapperStyle={{ fontSize: 12 }} />
                                <Bar dataKey="revenue" name="Revenue" fill={chartColors.primary} radius={[3, 3, 0, 0]} />
                                <Bar dataKey="expenses" name="Expenses" fill={chartColors.warning} radius={[3, 3, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </NoSSR>
                </div>
            )}
        </Card>
    );
}
