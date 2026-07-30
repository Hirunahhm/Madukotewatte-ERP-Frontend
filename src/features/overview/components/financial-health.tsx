"use client";

import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLiquiditySummary } from "@/features/overview/hooks/use-overview";

function formatLkr(value: number): string {
    return `LKR ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export function FinancialHealth() {
    const { isLoading, totalCash, totalDebt, cashPct, salesMtd, expenseMtd, salesGrowthPct, expenseRatioPct } = useLiquiditySummary();
    const debtPct = 100 - cashPct;

    return (
        <div className="grid grid-cols-2 gap-4">
            <Card className="col-span-2 sm:col-span-1 shadow-sm gap-0 p-6 flex flex-col items-center justify-center relative">
                {isLoading && <div className="absolute top-4 right-4"><Loader2 className="w-4 h-4 animate-spin text-brand-500" /></div>}
                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 tracking-wider mb-6 self-start w-full text-center">LIQUIDITY DISTRIBUTION</h3>
                <div className="relative w-32 h-32 mb-4">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path
                            className="text-gray-100 dark:text-gray-700"
                            strokeWidth="4"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                            className="text-brand-500"
                            strokeDasharray={`${cashPct}, 100`}
                            strokeWidth="4"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                    </svg>
                </div>
                <div className="flex w-full justify-between text-xs font-medium mt-auto border-t border-gray-50 dark:border-gray-700/30 pt-4">
                    <div className="flex flex-col">
                        <span className="flex items-center gap-1 before:w-2 before:h-2 before:bg-brand-500 before:rounded-full">Cash ({formatLkr(totalCash)})</span>
                        <span className="text-gray-500 dark:text-gray-400">({cashPct}%)</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="flex items-center gap-1 before:w-2 before:h-2 before:bg-gray-200 dark:before:bg-gray-600 before:rounded-full">Debt ({formatLkr(totalDebt)})</span>
                        <span className="text-gray-500 dark:text-gray-400">({debtPct}%)</span>
                    </div>
                </div>
            </Card>
            <div className="col-span-2 sm:col-span-1 flex flex-col gap-4">
                <Card className="border-brand-100 dark:border-brand-800 bg-brand-50 dark:bg-brand-950/30 p-6 flex-1 flex flex-col justify-center gap-0">
                    <span className="text-xs font-bold text-brand-700">TOTAL SALES (MTD)</span>
                    <p className="text-2xl font-bold text-brand-900 mt-2">{formatLkr(salesMtd)}</p>
                    <span className="text-xs text-brand-600 mt-2">
                        {salesGrowthPct === null ? "No prior-month data yet" : `${salesGrowthPct >= 0 ? "↗" : "↘"} ${Math.abs(salesGrowthPct)}% vs last month`}
                    </span>
                </Card>
                <Card className="shadow-sm p-6 flex-1 flex flex-col justify-center gap-0">
                    <span className="text-xs font-bold text-gray-900 dark:text-gray-100">OPERATIONAL EXPENSE (MTD)</span>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">{formatLkr(expenseMtd)}</p>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 h-1 mt-3 rounded-full overflow-hidden">
                        <div className="bg-red-500 h-full rounded-full" style={{ width: `${Math.min(100, expenseRatioPct)}%` }}></div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">{expenseRatioPct}% of MTD sales spent on expenses</span>
                </Card>
            </div>
        </div>
    );
}
