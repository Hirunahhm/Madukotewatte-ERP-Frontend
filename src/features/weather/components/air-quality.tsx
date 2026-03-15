"use client";

import { Card } from "@/components/ui/card";

export function AirQuality() {
    return (
        <Card className="bg-gray-50 dark:bg-gray-800/50 shadow-sm gap-0 p-6">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-brand-500"></div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Air Quality Index</h3>
            </div>

            <div className="flex items-end justify-between border-b border-gray-200 dark:border-gray-600 pb-4 mb-4">
                <div>
                    <p className="text-4xl font-black text-brand-600 tracking-tighter">34</p>
                    <p className="text-xs font-bold text-brand-600 uppercase tracking-wider mt-1">Excellent Quality</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Dominant Pollutant</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">PM 2.5</p>
                </div>
            </div>

            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex">
                <div className="h-full bg-brand-500 w-1/4"></div>
                <div className="h-full bg-yellow-400 w-1/4"></div>
                <div className="h-full bg-orange-500 w-1/4"></div>
                <div className="h-full bg-red-500 w-1/4"></div>
            </div>
        </Card>
    );
}
