"use client";

import { Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinancialsHeader() {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Financial Tracking</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Real-time overview of rubber plantation revenue and expenditures.</p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button variant="outline" className="flex-1 sm:flex-none gap-2 text-gray-700 h-9">
                    <Download className="w-4 h-4" /> Export Ledger
                </Button>
                <Button className="flex-1 sm:flex-none gap-2 bg-brand-500 hover:bg-brand-600 h-9 shadow-sm">
                    <Plus className="w-4 h-4" /> Add Transaction
                </Button>
            </div>
        </div>
    );
}
