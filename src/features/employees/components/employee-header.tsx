"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function EmployeeHeader() {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Employee Management</h1>
                    <Badge variant="outline" className="text-brand-600 bg-brand-50 border-brand-200 font-semibold">128 Active Staff</Badge>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Monitor performance, track attendance, and manage labor logistics.</p>
            </div>
            <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-1">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-3">VIEW STATS FOR:</span>
                <Button size="sm" className="bg-brand-500 hover:bg-brand-600 text-white h-7 text-xs">Monthly</Button>
                <Button variant="ghost" size="sm" className="text-gray-500 h-7 text-xs">Annual</Button>
                <Button variant="ghost" size="sm" className="text-gray-500 h-7 text-xs">Lifetime</Button>
            </div>
        </div>
    );
}
