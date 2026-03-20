"use client";

import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { chartPalette } from "@/lib/theme";

const categories = [
    { name: "Latex Sales", value: "LKR 612,000", color: chartPalette[0] },
    { name: "Rubber Solid Sales", value: "LKR 318,500", color: chartPalette[1] },
    { name: "Manioc Sales", value: "LKR 184,200", color: chartPalette[2] },
    { name: "Banana Sales", value: "LKR 98,400", color: chartPalette[3] },
    { name: "Coconut Sales", value: "LKR 71,400", color: chartPalette[4] },
];

export function RevenueDistribution() {
    return (
        <Card className="shadow-sm gap-0 p-6 flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <CardTitle className="text-base font-semibold">Sales Distribution</CardTitle>
                    <CardDescription className="mt-1">Estate revenue by product category</CardDescription>
                </div>
                <div className="text-right">
                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase">Total Sales</span>
                    <p className="text-xl font-bold text-gray-900 dark:text-gray-100">LKR 1.28M</p>
                </div>
            </div>

            <div className="flex-1 mt-2 grid grid-cols-3 grid-rows-3 gap-1 rounded-xl overflow-hidden text-white font-bold text-sm min-h-[180px]">
                <div
                    className="col-span-2 row-span-2 p-4 flex flex-col justify-end"
                    style={{ backgroundColor: categories[0].color }}
                >
                    <span className="text-sm font-bold">{categories[0].name}</span>
                    <span className="text-xs opacity-80 mt-0.5">{categories[0].value}</span>
                </div>
                <div
                    className="col-span-1 row-span-2 p-3 flex flex-col justify-end"
                    style={{ backgroundColor: categories[1].color }}
                >
                    <span className="text-xs font-bold">{categories[1].name}</span>
                    <span className="text-[10px] opacity-80 mt-0.5">{categories[1].value}</span>
                </div>
                <div
                    className="col-span-1 row-span-1 p-3 flex flex-col justify-end"
                    style={{ backgroundColor: categories[2].color }}
                >
                    <span className="text-xs font-bold">{categories[2].name}</span>
                    <span className="text-[10px] opacity-80 mt-0.5">{categories[2].value}</span>
                </div>
                <div
                    className="col-span-1 row-span-1 p-3 flex flex-col justify-end"
                    style={{ backgroundColor: categories[3].color }}
                >
                    <span className="text-xs font-bold">{categories[3].name}</span>
                    <span className="text-[10px] opacity-80 mt-0.5">{categories[3].value}</span>
                </div>
                <div
                    className="col-span-1 row-span-1 p-3 flex flex-col justify-end"
                    style={{ backgroundColor: categories[4].color }}
                >
                    <span className="text-xs font-bold">{categories[4].name}</span>
                    <span className="text-[10px] opacity-80 mt-0.5">{categories[4].value}</span>
                </div>
            </div>
        </Card>
    );
}
