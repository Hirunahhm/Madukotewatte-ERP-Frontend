"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Thermometer } from "lucide-react";

export function MetrolacEntryForm() {
    const today = new Date().toISOString().split("T")[0];

    return (
        <Card className="shadow-sm gap-0 p-5">
            <div className="flex items-center gap-2 mb-4">
                <Thermometer className="w-4 h-4 text-brand-500" />
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    Metrolac Reading Entry
                </h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1 space-y-1.5">
                    <Label htmlFor="metrolac-reading">Metrolac Reading</Label>
                    <Input
                        id="metrolac-reading"
                        type="number"
                        placeholder="e.g. 32.4"
                        step="0.1"
                        className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus-visible:ring-brand-500"
                    />
                </div>

                <div className="flex-1 space-y-1.5">
                    <Label htmlFor="metrolac-date">Date</Label>
                    <Input
                        id="metrolac-date"
                        type="date"
                        defaultValue={today}
                        className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus-visible:ring-brand-500"
                    />
                </div>

                <div className="flex-1 space-y-1.5">
                    <Label htmlFor="temperature">Recorded Temperature (°C)</Label>
                    <Input
                        id="temperature"
                        type="number"
                        placeholder="e.g. 28"
                        step="0.1"
                        className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus-visible:ring-brand-500"
                    />
                </div>

                <Button className="bg-brand-500 hover:bg-brand-600 font-bold px-6 shadow-sm shrink-0">
                    Log Reading
                </Button>
            </div>
        </Card>
    );
}
