"use client";

import { Card, CardTitle, CardDescription } from "@/components/ui/card";

export function ExpenditureBreakdown() {
    return (
        <Card className="shadow-sm gap-0 p-6 flex flex-col">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-red-500"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                        Expense Distribution
                    </CardTitle>
                    <CardDescription className="mt-1 max-w-[200px]">Monthly Expenditure by Functional Category</CardDescription>
                </div>
                <div className="text-right">
                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase">Total Expenses</span>
                    <p className="text-xl font-bold text-gray-900 dark:text-gray-100">$91,700 <span className="text-xs font-semibold text-red-500 inline-block">↘ +2.1%</span></p>
                </div>
            </div>

            {/* Treemap mock using grid */}
            <div className="flex-1 mt-4 grid grid-cols-3 grid-rows-3 gap-1 rounded-xl overflow-hidden text-white font-bold text-sm">
                <div className="col-span-2 row-span-3 bg-black dark:bg-gray-700 p-4 flex flex-col">
                    <span>Labor</span>
                    <span className="text-xs opacity-70 mt-1">$45.0k</span>
                </div>
                <div className="col-span-1 row-span-1 bg-black dark:bg-gray-700 p-3 flex flex-col justify-end border-l border-b border-gray-800 dark:border-gray-600">
                    <span className="text-xs">Chemicals</span>
                    <span className="text-[10px] opacity-70">$22.0k</span>
                </div>
                <div className="col-span-1 row-span-1 bg-black dark:bg-gray-700 p-3 flex flex-col justify-end border-l border-b border-gray-800 dark:border-gray-600">
                    <span className="text-xs">Maintenance</span>
                    <span className="text-[10px] opacity-70">$12.0k</span>
                </div>
                <div className="col-span-1 row-span-1 bg-black dark:bg-gray-700 p-3 flex flex-col justify-end border-l border-gray-800 dark:border-gray-600">
                    <span className="text-xs">Logistics</span>
                    <span className="text-[10px] opacity-70">$8.5k</span>
                </div>
            </div>
        </Card>
    );
}
