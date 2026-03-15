"use client";

import { Card } from "@/components/ui/card";

export function FinancialHealth() {
    return (
        <div className="grid grid-cols-2 gap-4">
            <Card className="col-span-2 sm:col-span-1 shadow-sm gap-0 p-6 flex flex-col items-center justify-center">
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
                            strokeDasharray="65, 100"
                            strokeWidth="4"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                    </svg>
                </div>
                <div className="flex w-full justify-between text-xs font-medium mt-auto border-t border-gray-50 dark:border-gray-700/30 pt-4">
                    <div className="flex flex-col"><span className="flex items-center gap-1 before:w-2 before:h-2 before:bg-brand-500 before:rounded-full">Cash in Hand</span><span className="text-gray-500 dark:text-gray-400">(65%)</span></div>
                    <div className="flex flex-col"><span className="flex items-center gap-1 before:w-2 before:h-2 before:bg-gray-200 dark:before:bg-gray-600 before:rounded-full">Credit</span><span className="text-gray-500 dark:text-gray-400">(35%)</span></div>
                </div>
            </Card>
            <div className="col-span-2 sm:col-span-1 flex flex-col gap-4">
                <Card className="border-brand-100 dark:border-brand-800 bg-brand-50 dark:bg-brand-950/30 p-6 flex-1 flex flex-col justify-center gap-0">
                    <span className="text-xs font-bold text-brand-700">TOTAL SALES (MTD)</span>
                    <p className="text-2xl font-bold text-brand-900 mt-2">$124,500.00</p>
                    <span className="text-xs text-brand-600 mt-2">↗ 12% growth vs last month</span>
                </Card>
                <Card className="shadow-sm p-6 flex-1 flex flex-col justify-center gap-0">
                    <span className="text-xs font-bold text-gray-900 dark:text-gray-100">OPERATIONAL EXPENSE</span>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">$42,320.00</p>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 h-1 mt-3 rounded-full overflow-hidden">
                        <div className="bg-red-500 h-full w-[45%] rounded-full"></div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">45% of monthly budget utilized</span>
                </Card>
            </div>
        </div>
    );
}
