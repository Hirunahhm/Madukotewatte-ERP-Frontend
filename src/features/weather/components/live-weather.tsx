"use client";

import { Sun, Droplets, Wind, Umbrella, Sunrise, Sunset, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function LiveWeather() {
    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Climate & Forecasting</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Real-time weather tracking for estate operations scheduling.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="flex bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-1">
                        <Button size="sm" variant="secondary" className="h-7 text-xs text-gray-900 dark:text-gray-100">°C</Button>
                        <Button size="sm" variant="ghost" className="h-7 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">°F</Button>
                    </div>
                </div>
            </div>

            {/* Main Hero Card */}
            <Card className="shadow-sm gap-0 overflow-hidden p-0">
                <div className="p-6">
                    <div className="flex items-center gap-2 text-brand-600 font-bold text-xs tracking-wider mb-6">
                        <span className="flex items-center gap-1"><Sun className="w-4 h-4" /> LIVE NOW • BANTING ESTATE</span>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between gap-8 bg-white dark:bg-transparent">
                        <div className="flex-1">
                            <div className="flex items-start">
                                <span className="text-7xl font-bold text-gray-900 dark:text-gray-100 tracking-tighter">28</span>
                                <span className="text-3xl font-bold text-brand-500 mt-2">°C</span>
                            </div>
                            <p className="text-xl font-medium text-gray-400 dark:text-gray-500 mt-2">Sunny Skies</p>

                            <div className="flex items-center gap-2 mt-6">
                                <span className="px-3 py-1 bg-brand-50 dark:bg-brand-950/30 text-brand-600 text-xs font-bold rounded-full border border-brand-100 dark:border-brand-800">High 31°</span>
                                <span className="px-3 py-1 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold rounded-full border border-gray-100 dark:border-gray-700/40">Low 24°</span>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="flex-1 grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/40 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500"><Droplets className="w-5 h-5" /></div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Humidity</p>
                                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">76<span className="text-xs text-gray-500 dark:text-gray-400">%</span></p>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/40 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-500"><Wind className="w-5 h-5" /></div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Wind Speed</p>
                                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">12<span className="text-xs text-gray-500 dark:text-gray-400">km/h</span></p>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/40 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500"><Sun className="w-5 h-5" /></div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">UV Index</p>
                                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">8<span className="text-xs text-gray-500 dark:text-gray-400 inline-block ml-1">Very High</span></p>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/40 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-500"><Umbrella className="w-5 h-5" /></div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Rain Chance</p>
                                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">15<span className="text-xs text-gray-500 dark:text-gray-400">%</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card Footer */}
                <div className="border-t border-gray-100 dark:border-gray-700/40 bg-gray-50/50 dark:bg-gray-800/50 p-4 flex flex-col sm:flex-row items-center justify-between text-xs font-semibold text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-2"><Sunrise className="w-4 h-4 text-orange-400" /> Sunrise: 6:42 AM</span>
                        <span className="flex items-center gap-2"><Sunset className="w-4 h-4 text-orange-500" /> Sunset: 6:15 PM</span>
                    </div>
                    <span className="flex items-center gap-1 mt-4 sm:mt-0 italic"><Clock className="w-3.5 h-3.5" /> Last updated: 2 mins ago</span>
                </div>
            </Card>
        </>
    );
}
