"use client";

import {
    CloudLightning, Sunrise, Sunset, Clock, Droplets, Wind, Sun,
    CloudRain, Umbrella, Zap, Map, AlertTriangle, Info, Bell
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function WeatherPage() {
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

    const dailyForecast = [
        { day: 'Monday', date: 'Oct 23', icon: Sun, desc: 'Sunny', rain: '5%', high: '78°', low: '62°' },
        { day: 'Tuesday', date: 'Oct 24', icon: CloudLightning, desc: 'Partly Cloudy', rain: '12%', high: '75°', low: '60°' },
        { day: 'Wednesday', date: 'Oct 25', icon: CloudRain, desc: 'Showers', rain: '65%', high: '68°', low: '58°' },
        { day: 'Thursday', date: 'Oct 26', icon: Zap, desc: 'Thunderstorm', rain: '80%', high: '64°', low: '55°' },
        { day: 'Friday', date: 'Oct 27', icon: CloudLightning, desc: 'Foggy', rain: '25%', high: '70°', low: '59°' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column (Main Weather Info) */}
                <div className="lg:col-span-2 space-y-6">

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

                    {/* Next 24 Hours */}
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

                    {/* 5-Day Outlook */}
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

                </div>

                {/* Right Column (Sidebar Widgets) */}
                <div className="space-y-6">

                    {/* Radar Mock */}
                    <Card className="shadow-sm gap-0 overflow-hidden p-0 flex flex-col h-[320px]">
                        <div className="p-4 border-b border-gray-100 dark:border-gray-700/40 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                <Map className="w-4 h-4 text-brand-500" /> Satellite View
                            </h3>
                            <span className="text-[10px] font-bold tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">Live Radar</span>
                        </div>

                        {/* Mock Map using gradients */}
                        <div className="flex-1 relative bg-gradient-to-br from-blue-900 via-emerald-800 to-emerald-600 overflow-hidden">
                            <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay"></div>

                            <div className="absolute top-10 left-10 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>
                            <div className="absolute bottom-20 right-10 w-60 h-60 bg-yellow-400/20 rounded-full blur-3xl"></div>
                            <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-red-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>

                            {/* Pin */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                                <div className="bg-white text-gray-900 text-[10px] font-bold px-2 py-1 rounded shadow-lg mb-1">Estate HQ</div>
                                <div className="w-3 h-3 bg-brand-500 border-2 border-white rounded-full shadow-lg"></div>
                            </div>

                            <div className="absolute bottom-4 right-4 flex flex-col gap-1">
                                <button className="w-8 h-8 bg-white/90 backdrop-blur rounded shadow font-bold text-gray-700 hover:bg-white">+</button>
                                <button className="w-8 h-8 bg-white/90 backdrop-blur rounded shadow font-bold text-gray-700 hover:bg-white">-</button>
                            </div>
                        </div>
                        <div className="p-3 text-center text-xs text-gray-500 font-medium">
                            Showing cloud density & moisture levels for Banting
                        </div>
                    </Card>

                    {/* Active Alerts */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-4">
                            <AlertTriangle className="w-4 h-4 text-brand-500" /> Active Alerts
                        </h3>

                        <div className="space-y-3">
                            <div className="p-4 rounded-xl border border-red-200 bg-red-50 flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="text-sm font-bold text-red-800">Heavy Rain Advisory</h4>
                                        <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">15M ago</span>
                                    </div>
                                    <p className="text-xs text-red-600/90 font-medium leading-relaxed">
                                        Heavy rainfall expected from 4:00 PM today through early tomorrow morning. Halt tapping operations and secure harvested latex.
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl border border-orange-200 bg-orange-50 flex items-start gap-3">
                                <Info className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="text-sm font-bold text-orange-800">UV Level High</h4>
                                        <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">1H ago</span>
                                    </div>
                                    <p className="text-xs text-orange-600/90 font-medium leading-relaxed">
                                        Sun protection recommended between 11:00 AM and 3:00 PM for all field labor.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Air Quality */}
                    <Card className="bg-gray-50 dark:bg-gray-800/50 shadow-sm gap-0 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-2 h-2 rounded-full bg-brand-500"></div>
                            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Air Quality Index</h3>
                        </div>

                        <div className="flex items-end justify-between border-b border-gray-200 dark:border-gray-600 pb-4 mb-4">
                            <div>
                                <p className="text-4xl font-black text-brand-600 tracking-tighter">34</p>
                                <p className="text-xs font-bold text-brand-600 uppercase tracking-wider mt-1">Excellent Quality</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Dominant Pollutant</p>
                                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">PM 2.5</p>
                            </div>
                        </div>

                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex">
                            <div className="h-full bg-brand-500 w-1/4"></div>
                            <div className="h-full bg-yellow-400 w-1/4"></div>
                            <div className="h-full bg-orange-500 w-1/4"></div>
                            <div className="h-full bg-red-500 w-1/4"></div>
                        </div>
                    </Card>

                </div>
            </div>
        </div>
    );
}
