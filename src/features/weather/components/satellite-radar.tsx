"use client";

import { Map } from "lucide-react";
import { Card } from "@/components/ui/card";

export function SatelliteRadar() {
    return (
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
    );
}
