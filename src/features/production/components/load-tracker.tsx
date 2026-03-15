"use client";

import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const loadTrackers = [
    { id: 'L-8821', status: 'Processing', name: 'John D.', time: '10:45 AM', metric: '32.4 mL', vol: '125 LITERS', statusColor: 'bg-yellow-100 text-yellow-700' },
    { id: 'L-8822', status: 'Ready', name: 'Sarah M.', time: '11:15 AM', metric: '31.8 mL', vol: '98 LITERS', statusColor: 'bg-emerald-100 text-brand-700' },
    { id: 'L-8823', status: 'Testing', name: 'Ahmad K.', time: '11:30 AM', metric: '33.1 mL', vol: '142 LITERS', statusColor: 'bg-gray-100 text-gray-700' },
    { id: 'L-8824', status: 'Ready', name: 'Ravi S.', time: '11:55 AM', metric: '32 mL', vol: '110 LITERS', statusColor: 'bg-emerald-100 text-brand-700' },
];

export function LoadTracker() {
    return (
        <Card className="shadow-sm gap-0 p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-brand-500" />
                <CardTitle className="text-base font-semibold">Load Tracker</CardTitle>
            </div>
            <CardDescription className="mb-6">Live quality monitoring (Metrolac)</CardDescription>

            <div className="space-y-4 flex-1">
                {loadTrackers.map((tracker) => (
                    <div key={tracker.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-50 dark:border-gray-700/30 bg-gray-50/50 dark:bg-gray-800/50">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-sm text-gray-900 dark:text-gray-100">{tracker.id}</span>
                                <Badge variant="outline" className={cn("text-[10px] font-bold uppercase border-transparent", tracker.statusColor)}>{tracker.status}</Badge>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{tracker.name} • {tracker.time}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold text-brand-600">{tracker.metric}</p>
                            <p className="text-[10px] uppercase font-bold text-gray-400 mt-1">{tracker.vol}</p>
                        </div>
                    </div>
                ))}
            </div>

            <Button variant="outline" className="w-full mt-4 text-sm font-semibold text-gray-700">
                View All History
            </Button>
        </Card>
    );
}
