"use client";

import { useState } from "react";
import { TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { chartColors } from "@/lib/theme";

const AMMONIA_STOCK = 200;
const CAPACITY = 1000;
const fillPct = Math.round((AMMONIA_STOCK / CAPACITY) * 100);

export function AmmoniaKpis() {
    const [ratio, setRatio] = useState(25);
    const [editing, setEditing] = useState(false);
    const [inputVal, setInputVal] = useState("25");

    const maxTappable = AMMONIA_STOCK * ratio;

    function commitEdit() {
        const parsed = parseInt(inputVal, 10);
        if (!isNaN(parsed) && parsed > 0) {
            setRatio(parsed);
        } else {
            setInputVal(String(ratio));
        }
        setEditing(false);
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Ammonia Stock */}
            <Card className="shadow-sm p-5 gap-0">
                <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                    Ammonia Stock
                </p>
                <div className="flex items-end gap-3">
                    <span className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                        {AMMONIA_STOCK} L
                    </span>
                    <span className="mb-1 flex items-center gap-1 text-xs font-bold text-red-500 dark:text-red-400">
                        <TrendingDown className="w-3.5 h-3.5" />
                        −3.1% vs last week
                    </span>
                </div>
            </Card>

            {/* Total Capacity */}
            <Card className="shadow-sm p-5 gap-0">
                <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                    Total Capacity
                </p>
                <div className="flex items-end gap-2 mb-3">
                    <span className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                        {fillPct}%
                    </span>
                    <span className="mb-1 text-xs text-gray-500 dark:text-gray-400 font-medium">
                        {AMMONIA_STOCK} / {CAPACITY} L
                    </span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${fillPct}%`, backgroundColor: chartColors.cyan }}
                    />
                </div>
            </Card>

            {/* Max Tappable Latex */}
            <Card className="shadow-sm p-5 gap-0">
                <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                    Max Tappable Latex
                </p>
                <div className="flex items-end gap-3 mb-2">
                    <span className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                        {maxTappable.toLocaleString()} L
                    </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>Ratio:</span>
                    {editing ? (
                        <Input
                            type="number"
                            value={inputVal}
                            autoFocus
                            onChange={(e) => setInputVal(e.target.value)}
                            onBlur={commitEdit}
                            onKeyDown={(e) => { if (e.key === "Enter") commitEdit(); if (e.key === "Escape") { setInputVal(String(ratio)); setEditing(false); } }}
                            className="w-16 h-6 text-xs px-2 py-0"
                        />
                    ) : (
                        <button
                            onClick={() => { setInputVal(String(ratio)); setEditing(true); }}
                            className="font-bold text-cyan-600 dark:text-cyan-400 underline decoration-dotted cursor-pointer hover:text-cyan-700 dark:hover:text-cyan-300"
                            title="Click to edit ratio"
                        >
                            {ratio}
                        </button>
                    )}
                    <span>: 1</span>
                </div>
            </Card>
        </div>
    );
}
