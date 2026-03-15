"use client";

import { ArrowUpRight, Layers, Banknote } from "lucide-react";
import { Card } from "@/components/ui/card";

export function AssetKpis() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gray-50 dark:bg-gray-800/50 gap-0 p-6 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                    <ArrowUpRight className="w-5 h-5" />
                </div>
                <div>
                    <span className="text-[10px] font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase block mb-1">MTD Yield</span>
                    <p className="text-xl font-bold text-gray-900 dark:text-gray-100">+0.85%</p>
                </div>
            </Card>
            <Card className="bg-gray-50 dark:bg-gray-800/50 gap-0 p-6 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600">
                    <Layers className="w-5 h-5" />
                </div>
                <div>
                    <span className="text-[10px] font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase block mb-1">Asset Count</span>
                    <p className="text-xl font-bold text-gray-900 dark:text-gray-100">14 Entities</p>
                </div>
            </Card>
            <Card className="bg-gray-50 dark:bg-gray-800/50 gap-0 p-6 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <Banknote className="w-5 h-5" />
                </div>
                <div>
                    <span className="text-[10px] font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase block mb-1">Available Cash</span>
                    <p className="text-xl font-bold text-gray-900 dark:text-gray-100">$185,400</p>
                </div>
            </Card>
        </div>
    );
}
