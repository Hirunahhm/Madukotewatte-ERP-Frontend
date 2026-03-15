"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function TopPerformers() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <Card className="shadow-sm gap-0 p-6 relative">
                <Badge className="absolute top-4 right-4 bg-yellow-100 text-yellow-700 border-transparent">#1</Badge>
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Arjun Das</h3>
                        <p className="text-xs text-brand-600">↗ +12% efficiency increase</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">TREES TAPPED</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-gray-100">450</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">LATEX VOL (L)</p>
                        <p className="text-lg font-bold text-brand-500">1250</p>
                    </div>
                </div>
                <div className="flex items-end justify-between border-t border-gray-50 dark:border-gray-700/30 pt-4">
                    <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">TOTAL SALARY</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-gray-100">$5700</p>
                    </div>
                    <Badge variant="secondary" className="text-[10px] font-bold text-gray-500">Elite Tier</Badge>
                </div>
            </Card>
            {/* Card 2 */}
            <Card className="shadow-sm gap-0 p-6 relative">
                <Badge className="absolute top-4 right-4 bg-gray-100 text-gray-600 border-transparent">#2</Badge>
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Siti Aminah</h3>
                        <p className="text-xs text-brand-600">↗ +8% efficiency increase</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">TREES TAPPED</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-gray-100">425</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">LATEX VOL (L)</p>
                        <p className="text-lg font-bold text-brand-500">1180</p>
                    </div>
                </div>
                <div className="flex items-end justify-between border-t border-gray-50 dark:border-gray-700/30 pt-4">
                    <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">TOTAL SALARY</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-gray-100">$5400</p>
                    </div>
                    <Badge variant="secondary" className="text-[10px] font-bold text-gray-500">Elite Tier</Badge>
                </div>
            </Card>
            {/* Card 3 */}
            <Card className="shadow-sm gap-0 p-6 relative">
                <Badge className="absolute top-4 right-4 bg-orange-100 text-orange-700 border-transparent">#3</Badge>
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Rajesh Kumar</h3>
                        <p className="text-xs text-brand-600">↗ +5% efficiency increase</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">TREES TAPPED</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-gray-100">410</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">LATEX VOL (L)</p>
                        <p className="text-lg font-bold text-brand-500">1100</p>
                    </div>
                </div>
                <div className="flex items-end justify-between border-t border-gray-50 dark:border-gray-700/30 pt-4">
                    <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">TOTAL SALARY</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-gray-100">$5100</p>
                    </div>
                    <Badge variant="secondary" className="text-[10px] font-bold text-gray-500">Elite Tier</Badge>
                </div>
            </Card>
        </div>
    );
}
