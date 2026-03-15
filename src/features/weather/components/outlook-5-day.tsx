"use client";

import { Map, Sun, CloudLightning, CloudRain, Zap, Droplets } from "lucide-react";
import { Card } from "@/components/ui/card";

const dailyForecast = [
    { day: 'Monday', date: 'Oct 23', icon: Sun, desc: 'Sunny', rain: '5%', high: '78°', low: '62°' },
    { day: 'Tuesday', date: 'Oct 24', icon: CloudLightning, desc: 'Partly Cloudy', rain: '12%', high: '75°', low: '60°' },
    { day: 'Wednesday', date: 'Oct 25', icon: CloudRain, desc: 'Showers', rain: '65%', high: '68°', low: '58°' },
    { day: 'Thursday', date: 'Oct 26', icon: Zap, desc: 'Thunderstorm', rain: '80%', high: '64°', low: '55°' },
    { day: 'Friday', date: 'Oct 27', icon: CloudLightning, desc: 'Foggy', rain: '25%', high: '70°', low: '59°' },
];

export function Outlook5Day() {
    return (
        <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-4">
                <Map className="w-5 h-5 text-brand-500" /> 5-Day Outlook
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {dailyForecast.map((day, idx) => (
                    <Card key={idx} className="shadow-sm gap-0 p-4 flex flex-col items-center text-center">
                        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{day.day}</span>
                        <span className="text-xs text-gray-400 dark:text-gray-500 font-medium mb-4">{day.date}</span>

                        <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center mb-3">
                            <day.icon className="w-6 h-6 text-brand-500" />
                        </div>

                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{day.desc}</span>
                        <span className="text-[10px] font-bold text-brand-500 mt-1 flex items-center gap-1">
                            <Droplets className="w-3 h-3" /> {day.rain}
                        </span>

                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-50 dark:border-gray-700/30 w-full justify-center">
                            <span className="text-base font-bold text-gray-900 dark:text-gray-100">{day.high}</span>
                            <span className="text-sm font-semibold text-gray-400 dark:text-gray-500">{day.low}</span>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
