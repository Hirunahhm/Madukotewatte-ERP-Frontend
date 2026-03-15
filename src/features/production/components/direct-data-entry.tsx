"use client";

import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function DirectDataEntry() {
    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-brand-500" /> Direct Data Entry
                </h2>
                <span className="text-xs text-gray-500 dark:text-gray-400">Session logged as: <span className="font-bold text-gray-900 dark:text-gray-100">Clerk_04 (Main Weigh-in)</span></span>
            </div>
            <Card className="gap-0 p-2">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-12 h-12 shrink-0 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-500 font-light text-2xl">+</div>
                    <Input type="text" placeholder="Employee Name/ID" className="flex-1 bg-gray-50 border-0 rounded-lg focus-visible:ring-1 focus-visible:ring-brand-500" />
                    <Input type="text" placeholder="Liters (L)" className="flex-1 bg-gray-50 border-0 rounded-lg focus-visible:ring-1 focus-visible:ring-brand-500" />
                    <Input type="text" placeholder="Mass (kg)" className="flex-1 bg-gray-50 border-0 rounded-lg focus-visible:ring-1 focus-visible:ring-brand-500" />
                    <Input type="text" placeholder="Ammonia (CC)" className="flex-1 bg-gray-50 border-0 rounded-lg focus-visible:ring-1 focus-visible:ring-brand-500" />
                    <Button className="bg-brand-500 hover:bg-brand-600 font-bold px-8 shadow-sm">Add Record</Button>
                </div>
            </Card>
        </div>
    );
}
