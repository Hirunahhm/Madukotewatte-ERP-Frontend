"use client";

import { CloudLightning } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function WeatherWidget() {
    return (
        <Card className="shadow-sm flex flex-col gap-0">
            <CardHeader className="px-6 pt-6 pb-0">
                <CardTitle className="text-base font-semibold">Climate Outlook</CardTitle>
                <CardDescription>Weather conditions impacting tapping schedules</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 p-6">
                <div className="flex h-full items-center justify-between rounded-lg border border-gray-100 dark:border-gray-700/40 dark:bg-gray-800/30 p-6">
                    <div className="flex items-center gap-6">
                        <CloudLightning className="h-16 w-16 text-gray-400" />
                        <div>
                            <p className="text-4xl font-bold text-gray-900 dark:text-gray-100">28°C</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Banting, Selangor</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                                <CloudLightning className="h-3 w-3" /> 12 km/h NW
                            </p>
                        </div>
                    </div>

                    {/* 5-day forecast */}
                    <div className="hidden sm:flex items-center gap-4 text-center border-l border-gray-100 dark:border-gray-700/40 pl-6 ml-6">
                        {['MON', 'TUE', 'WED', 'THU', 'FRI'].map((day, i) => (
                            <div key={day} className="flex flex-col items-center gap-2">
                                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{day}</span>
                                <CloudLightning className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                                <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{28 - i}°C</span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
