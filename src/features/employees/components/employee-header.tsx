"use client";

import { Badge } from "@/components/ui/badge";

export function EmployeeHeader() {
    return (
        <div>
            <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Employee Management</h1>
                <Badge variant="outline" className="text-brand-600 bg-brand-50 border-brand-200 font-semibold">128 Active Staff</Badge>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Monitor performance, track attendance, and manage labor logistics.</p>
        </div>
    );
}
