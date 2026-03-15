"use client";

import { Droplet, Scale, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";

export function KpiCards() {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Total Latex */}
            <Card className="shadow-sm gap-0 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-green-50 dark:bg-green-950/40 text-brand-500">
                        <Droplet className="h-5 w-5" />
                    </div>
                    <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                        +5.2%
                    </span>
                </div>
                <p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">Total Latex</p>
                <p className="mt-1 flex items-baseline gap-2">
                    <span className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">14,250</span>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Liters</span>
                </p>
            </Card>

            {/* Total Mass */}
            <Card className="shadow-sm gap-0 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-500">
                        <Scale className="h-5 w-5" />
                    </div>
                    <span className="flex items-center text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                        -1.8%
                    </span>
                </div>
                <p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">Total Mass</p>
                <p className="mt-1 flex items-baseline gap-2">
                    <span className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">4,820</span>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">kg</span>
                </p>
            </Card>

            {/* Avg Metrolac */}
            <Card className="shadow-sm gap-0 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                        <Zap className="h-5 w-5" />
                    </div>
                    <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                        +0.5%
                    </span>
                </div>
                <p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">Avg Metrolac</p>
                <p className="mt-1 flex items-baseline gap-2">
                    <span className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">32.4</span>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">% DRC</span>
                </p>
            </Card>
        </div>
    );
}
