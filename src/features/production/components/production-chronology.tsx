"use client";

import { useState } from "react";
import { Calendar, Filter, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

const YEARS = ["2024", "2025", "2026"];

type DayState = "public-holiday" | "rain" | "leave" | "no-tapping" | "normal";

function getDayState(index: number): DayState {
    if (index % 13 === 0) return "public-holiday";
    if (index % 7 === 0) return "rain";
    if (index % 11 === 0) return "leave";
    if (index % 5 === 0) return "no-tapping";
    return "normal";
}

const DAY_STATE_STYLES: Record<DayState, string> = {
    "public-holiday": "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/40",
    "rain": "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/40",
    "leave": "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/40",
    "no-tapping": "bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700/40",
    "normal": "border-gray-100 dark:border-gray-700/40",
};

const DAY_STATE_TAG: Record<DayState, { label: string; style: string } | null> = {
    "public-holiday": { label: "Public Holiday", style: "text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/30" },
    "rain": { label: "Rain Interference", style: "text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30" },
    "leave": { label: "Leave Day", style: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30" },
    "no-tapping": { label: "No Tapping", style: "text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700" },
    "normal": null,
};

const TAPPER_DATA = "Siti: 12L · Arjun: 14L · Rajesh: 10L";
const HAS_COLLECTION = (index: number) => getDayState(index) === "normal" && index % 2 === 0;

export function ProductionChronology() {
    const now = new Date();
    const [month, setMonth] = useState(String(now.getMonth()));
    const [year, setYear] = useState(String(now.getFullYear()));
    const [view, setView] = useState<"30" | "7">("30");

    const cellCount = view === "30" ? 28 : 7;
    const gridRows = view === "30" ? "grid-rows-4" : "grid-rows-1";
    const cellHeight = view === "30" ? "auto-rows-[120px]" : "auto-rows-[160px]";

    return (
        <TooltipProvider>
            <Card className="shadow-sm gap-0 overflow-hidden p-0 mt-6">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700/40">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        {/* Left: title + dropdowns */}
                        <div className="flex flex-wrap items-center gap-3">
                            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-brand-500" /> Production Chronology
                            </h2>
                            <Select value={month} onValueChange={(v) => { if (v !== null) setMonth(v); }}>
                                <SelectTrigger className="h-7 text-xs w-32 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {MONTHS.map((m, i) => (
                                        <SelectItem key={i} value={String(i)}>{m}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={year} onValueChange={(v) => { if (v !== null) setYear(v); }}>
                                <SelectTrigger className="h-7 text-xs w-24 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {YEARS.map((y) => (
                                        <SelectItem key={y} value={y}>{y}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Right: legend + view toggle + actions */}
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
                                <div className="w-2 h-2 rounded-full bg-red-400" /> Public Holidays
                            </span>
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
                                <div className="w-2 h-2 rounded-full bg-blue-400" /> Rain Days
                            </span>
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
                                <div className="w-2 h-2 rounded-full bg-amber-400" /> Leave Days
                            </span>
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
                                <div className="w-2 h-2 rounded-full bg-gray-400" /> No Tapping
                            </span>

                            {/* View toggle */}
                            <div className="flex bg-gray-50 dark:bg-gray-800 p-0.5 rounded-lg border border-gray-100 dark:border-gray-700">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`h-6 text-xs px-2.5 ${view === "30" ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"}`}
                                    onClick={() => setView("30")}
                                >
                                    30-Day
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`h-6 text-xs px-2.5 ${view === "7" ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"}`}
                                    onClick={() => setView("7")}
                                >
                                    7-Day
                                </Button>
                            </div>

                            <Button variant="outline" size="sm" className="gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300 h-7">
                                <Filter className="w-3.5 h-3.5" /> Filter
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300 h-7">
                                <Download className="w-3.5 h-3.5" /> Export
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 border-b border-gray-100 dark:border-gray-700/40 bg-gray-50/50 dark:bg-gray-800/50">
                    {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
                        <div key={day} className="py-2 text-center text-xs font-bold text-gray-500 dark:text-gray-400 tracking-wider border-r border-gray-100 dark:border-gray-700/40 last:border-r-0">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar grid */}
                <div className={`grid grid-cols-7 ${gridRows} ${cellHeight}`}>
                    {Array.from({ length: cellCount }).map((_, i) => {
                        const state = getDayState(i);
                        const tag = DAY_STATE_TAG[state];
                        const hasCollection = HAS_COLLECTION(i);

                        const cellContent = (
                            <>
                                <div className="flex items-start justify-between">
                                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{i + 1}</span>
                                    {hasCollection && (
                                        <div className="w-2 h-2 rounded-full bg-brand-500 mt-0.5 shrink-0" />
                                    )}
                                </div>
                                <div className="mt-auto">
                                    {tag ? (
                                        <div className={`text-[10px] font-bold inline-block px-1.5 py-0.5 rounded ${tag.style}`}>
                                            {tag.label}
                                        </div>
                                    ) : (
                                        hasCollection && (
                                            <div className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/40 border border-brand-200 dark:border-brand-700/40" />
                                        )
                                    )}
                                </div>
                            </>
                        );

                        const cellClass = `border-r border-b border-gray-100 dark:border-gray-700/40 last:border-r-0 p-2 flex flex-col hover:brightness-95 dark:hover:brightness-110 cursor-pointer transition-all ${DAY_STATE_STYLES[state]}`;

                        if (hasCollection) {
                            return (
                                <Tooltip key={i}>
                                    <TooltipTrigger className={cellClass}>
                                        {cellContent}
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-gray-900 dark:bg-gray-100 text-gray-100 dark:text-gray-900 text-xs font-medium">
                                        {TAPPER_DATA}
                                    </TooltipContent>
                                </Tooltip>
                            );
                        }

                        return (
                            <div key={i} className={cellClass}>
                                {cellContent}
                            </div>
                        );
                    })}
                </div>
            </Card>
        </TooltipProvider>
    );
}
