"use client";

import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { chartPalette } from "@/lib/theme";
import { useExpenseDistribution } from "@/features/financials/hooks/use-financials";

function formatLkr(value: number): string {
    return `LKR ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

const GRID_CLASSES = [
    "col-span-2 row-span-2 p-4 flex flex-col justify-end",
    "col-span-1 row-span-2 p-3 flex flex-col justify-end",
    "col-span-1 row-span-1 p-3 flex flex-col justify-end",
    "col-span-1 row-span-1 p-3 flex flex-col justify-end",
    "col-span-1 row-span-1 p-3 flex flex-col justify-end",
    "col-span-1 row-span-1 p-3 flex flex-col justify-end",
];

export function ExpenseDistribution() {
    const { data } = useExpenseDistribution();
    const categories = [...(data ?? [])].sort((a, b) => b.total - a.total).slice(0, 6);
    const totalExpenses = categories.reduce((sum, c) => sum + c.total, 0);

    return (
        <Card className="shadow-sm gap-0 p-6 flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <CardTitle className="text-base font-semibold">Expense Distribution</CardTitle>
                    <CardDescription className="mt-1">Breakdown by expense category</CardDescription>
                </div>
                <div className="text-right">
                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase">Total Expenses</span>
                    <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{formatLkr(totalExpenses)}</p>
                </div>
            </div>

            {categories.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-sm text-gray-400 min-h-[180px]">No expenses recorded yet</div>
            ) : (
                <div className="flex-1 mt-2 grid grid-cols-3 grid-rows-3 gap-1 rounded-xl overflow-hidden text-white font-bold text-sm min-h-[180px]">
                    {categories.map((cat, i) => (
                        <div
                            key={cat.category}
                            className={GRID_CLASSES[i] ?? GRID_CLASSES[GRID_CLASSES.length - 1]}
                            style={{ backgroundColor: chartPalette[i % chartPalette.length] }}
                        >
                            <span className={i === 0 ? "text-sm font-bold" : "text-xs font-bold"}>{cat.category}</span>
                            <span className={i === 0 ? "text-xs opacity-80 mt-0.5" : "text-[10px] opacity-80 mt-0.5"}>{formatLkr(cat.total)}</span>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
}
