"use client";

import { Clock, Sun, CloudLightning, CloudRain } from "lucide-react";
import { Card } from "@/components/ui/card";

const hourlyForecast = [
    { time: 'Now', temp: '72°', icon: Sun, active: true },
    { time: '1 PM', temp: '74°', icon: Sun, active: false },
    { time: '2 PM', temp: '75°', icon: Sun, active: false },
    { time: '3 PM', temp: '76°', icon: CloudLightning, active: false },
    { time: '4 PM', temp: '74°', icon: CloudLightning, active: false },
    { time: '5 PM', temp: '71°', icon: CloudRain, active: false },
    { time: '6 PM', temp: '68°', icon: CloudRain, active: false },
    { time: '7 PM', temp: '65°', icon: CloudLightning, active: false },
    { time: '8 PM', temp: '63°', icon: CloudLightning, active: false },
    { time: '9 PM', temp: '61°', icon: CloudLightning, active: false },
    { time: '10 PM', temp: '59°', icon: CloudLightning, active: false },
    { time: '11 PM', temp: '58°', icon: CloudLightning, active: false },
];

export function Next24Hours() {
    return (
        <Card className="shadow-sm gap-0 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-brand-500" /> Next 24 Hours
                </h3>
                <button className="text-sm font-bold text-brand-600 hover:text-brand-700">View Detailed Timeline</button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                {hourlyForecast.map((hour, idx) => (
                    <div key={idx} className={`min-w-[80px] p-4 rounded-xl flex flex-col items-center justify-center gap-3 border transition-colors ${hour.active ? 'bg-brand-500 border-brand-500 text-white shadow-md' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700/40 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}>
                        <span className={`text-xs font-semibold ${hour.active ? 'text-brand-100' : 'text-gray-500 dark:text-gray-400'}`}>{hour.time}</span>
                        <hour.icon className={`w-6 h-6 ${hour.active ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`} />
                        <span className="text-lg font-bold">{hour.temp}</span>
                    </div>
                ))}
            </div>
        </Card>
    );
}
