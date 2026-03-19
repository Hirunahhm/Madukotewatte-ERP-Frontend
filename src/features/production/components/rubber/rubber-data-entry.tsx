"use client";

import { useState } from "react";
import { Scale } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function RubberDataEntry() {
    const today = new Date().toISOString().split("T")[0];
    const [date, setDate] = useState(today);
    const [mass, setMass] = useState("");

    return (
        <div>
            <div className="flex items-center gap-2 mb-4">
                <Scale className="w-4 h-4 text-amber-500" />
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Log Scrap Collection</h2>
            </div>
            <Card className="gap-0 p-3">
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                    <div className="w-12 h-12 shrink-0 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/40 rounded-lg flex items-center justify-center">
                        <Scale className="w-5 h-5 text-amber-500" />
                    </div>

                    <Input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="flex-1 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg focus-visible:ring-1 focus-visible:ring-amber-500"
                    />

                    <Input
                        type="number"
                        placeholder="e.g. 4.5"
                        value={mass}
                        onChange={(e) => setMass(e.target.value)}
                        className="flex-1 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg focus-visible:ring-1 focus-visible:ring-amber-500"
                    />

                    <Button className="bg-amber-500 hover:bg-amber-600 font-bold px-8 shadow-sm shrink-0 text-white">
                        Log Collection
                    </Button>
                </div>
            </Card>
        </div>
    );
}
