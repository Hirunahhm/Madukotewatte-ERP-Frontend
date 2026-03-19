"use client";

import { useState } from "react";
import { Beaker } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function AmmoniaDataEntry() {
    const today = new Date().toISOString().split("T")[0];
    const [date, setDate] = useState(today);
    const [amount, setAmount] = useState("");

    return (
        <div>
            <div className="flex items-center gap-2 mb-4">
                <Beaker className="w-4 h-4 text-cyan-500" />
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Log Ammonia Refill</h2>
            </div>
            <Card className="gap-0 p-3">
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                    <div className="w-12 h-12 shrink-0 bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-100 dark:border-cyan-800/40 rounded-lg flex items-center justify-center">
                        <Beaker className="w-5 h-5 text-cyan-500" />
                    </div>

                    <Input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="flex-1 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg focus-visible:ring-1 focus-visible:ring-cyan-500"
                    />

                    <div className="flex-1 flex items-center justify-center">
                        <Badge className="bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-400 border-transparent font-semibold px-4 py-1.5 text-xs pointer-events-none select-none">
                            Refill
                        </Badge>
                    </div>

                    <Input
                        type="number"
                        placeholder="e.g. 50"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="flex-1 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg focus-visible:ring-1 focus-visible:ring-cyan-500"
                    />

                    <Button className="bg-cyan-500 hover:bg-cyan-600 font-bold px-8 shadow-sm shrink-0 text-white">
                        Log Refill
                    </Button>
                </div>
            </Card>
        </div>
    );
}
