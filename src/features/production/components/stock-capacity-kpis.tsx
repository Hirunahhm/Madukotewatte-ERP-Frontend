"use client";

import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

const CURRENT_STOCK = 4820;
const CAPACITY = 8000;
const fillPct = Math.round((CURRENT_STOCK / CAPACITY) * 100);

export function StockCapacityKpis() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Current Latex Stock */}
            <Card className="shadow-sm p-5 gap-0">
                <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                    Current Latex Stock
                </p>
                <div className="flex items-end gap-3">
                    <span className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                        {CURRENT_STOCK.toLocaleString()} L
                    </span>
                    <span className="mb-1 flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <TrendingUp className="w-3.5 h-3.5" />
                        +8.2% vs last week
                    </span>
                </div>
            </Card>

            {/* Current Latex Capacity */}
            <Card className="shadow-sm p-5 gap-0">
                <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                    Current Latex Capacity
                </p>
                <div className="flex items-end gap-2 mb-3">
                    <span className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                        {fillPct}%
                    </span>
                    <span className="mb-1 text-xs text-gray-500 dark:text-gray-400 font-medium">
                        {CURRENT_STOCK.toLocaleString()} / {CAPACITY.toLocaleString()} L
                    </span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full bg-brand-500 transition-all duration-500"
                        style={{ width: `${fillPct}%` }}
                    />
                </div>
            </Card>
        </div>
    );
}
