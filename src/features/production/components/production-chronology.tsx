"use client";

import { Calendar, Filter, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ProductionChronology() {
    return (
        <Card className="shadow-sm gap-0 overflow-hidden p-0 mt-6">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700/40">
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-brand-500" /> Production Chronology
                    </h2>
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500"><div className="w-2 h-2 rounded-full bg-blue-400"></div> Rain Interference</span>
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500"><div className="w-2 h-2 rounded-full bg-red-400"></div> Public Holiday</span>
                        <Button variant="outline" size="sm" className="gap-2 text-xs font-semibold text-gray-700 h-7">
                            <Filter className="w-3.5 h-3.5" /> Filter
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2 text-xs font-semibold text-gray-700 h-7">
                            <Download className="w-3.5 h-3.5" /> Export
                        </Button>
                    </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">September 2024 Collection Overview</p>
            </div>

            {/* Mock Calendar Grid */}
            <div className="grid grid-cols-7 border-b border-gray-100 dark:border-gray-700/40 bg-gray-50/50 dark:bg-gray-800/50">
                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
                    <div key={day} className="py-2 text-center text-xs font-bold text-gray-500 dark:text-gray-400 tracking-wider border-r border-gray-100 dark:border-gray-700/40 last:border-r-0">
                        {day}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 grid-rows-4 auto-rows-[120px]">
                {Array.from({ length: 28 }).map((_, i) => (
                    <div key={i} className="border-r border-b border-gray-100 dark:border-gray-700/40 last:border-r-0 p-2 flex flex-col hover:bg-gray-50 dark:hover:bg-gray-800 hover:cursor-pointer transition-colors">
                        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{i + 1}</span>
                        <div className="mt-auto">
                            {i % 3 === 0 ? <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 inline-block px-1.5 py-0.5 rounded">No collections</div> : <div className="w-6 h-6 rounded-full bg-brand-100 border border-brand-200"></div>}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
