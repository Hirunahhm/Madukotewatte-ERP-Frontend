"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { chartColors } from "@/lib/theme";

const outflows = [
    { date: "2026-03-18", description: "Fertilizer Purchase", amount: 48200 },
    { date: "2026-03-15", description: "Labour Payment — March W2", amount: 32400 },
    { date: "2026-03-12", description: "Equipment Maintenance", amount: 18600 },
    { date: "2026-03-08", description: "Utilities — Electricity", amount: 9800 },
    { date: "2026-03-05", description: "Vehicle Fuel & Service", amount: 7200 },
];

export function OutflowsCard() {
    return (
        <Card className="p-6 shadow-sm gap-0 flex flex-col h-full">
            <CardTitle className="text-base font-semibold mb-4">Recent Cash Outflows</CardTitle>
            <div className="flex-1 space-y-3">
                {outflows.map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{item.description}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{item.date}</p>
                        </div>
                        <p className="text-sm font-semibold ml-4 shrink-0" style={{ color: chartColors.danger }}>
                            − LKR {item.amount.toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>
        </Card>
    );
}
