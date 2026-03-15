"use client";

import { Download, ArrowUpRight, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function LiquidityOverview() {
    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 uppercase">LIQUIDITY OVERVIEW</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Real-time consolidated asset management and liquidity tracking.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button variant="outline" className="flex-1 sm:flex-none gap-2 border-brand-200 text-brand-600 hover:bg-brand-50 h-9">
                        <Download className="w-4 h-4" /> Export CSV
                    </Button>
                    <Button className="flex-1 sm:flex-none gap-2 bg-brand-500 hover:bg-brand-600 h-9 shadow-sm">
                        <ArrowUpRight className="w-4 h-4" /> Portfolio Insights
                    </Button>
                </div>
            </div>

            {/* Hero KPI Card */}
            <Card className="shadow-sm gap-0 p-12 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center mb-6">
                    <Wallet className="w-6 h-6 text-brand-500" />
                </div>
                <span className="text-xs font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-2">Total Liquidity</span>
                <h2 className="text-5xl font-bold text-gray-900 dark:text-gray-100 tracking-tight flex items-baseline justify-center">
                    $1,248,500<span className="text-2xl text-gray-400 dark:text-gray-500 font-semibold">.00</span>
                </h2>
                <span className="mt-6 inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100">
                    <ArrowUpRight className="w-3 h-3" /> +12.4% from last quarter
                </span>
            </Card>
        </>
    );
}
