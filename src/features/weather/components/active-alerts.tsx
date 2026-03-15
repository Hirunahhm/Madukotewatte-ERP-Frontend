"use client";

import { AlertTriangle, Info } from "lucide-react";

export function ActiveAlerts() {
    return (
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
    );
}
