"use client";

import { TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { chartColors } from "@/lib/theme";

export function RubberKpis() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Current Stock */}
            <Card className="shadow-sm p-5 gap-0">
                <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                    Current Stock
                </p>
                <div className="flex items-end gap-3">
                    <span className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                        840 kg
                    </span>
                    <span className="mb-1 flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <TrendingUp className="w-3.5 h-3.5" />
                        +5.4% vs last week
                    </span>
                </div>
            </Card>

            {/* Unit Price */}
            <Card className="shadow-sm p-5 gap-0">
                <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                    Unit Price
                </p>
                <div className="flex items-end gap-2">
                    <span
                        className="text-3xl font-extrabold"
                        style={{ color: chartColors.warning }}
                    >
                        $0.85
                    </span>
                    <span className="mb-1 text-sm font-medium text-amber-600 dark:text-amber-400">
                        / kg
                    </span>
                </div>
            </Card>
        </div>
    );
}
