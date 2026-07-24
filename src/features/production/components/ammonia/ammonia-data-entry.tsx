"use client";

import { useState } from "react";
import { Beaker, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateAmmoniaRecord } from "@/features/production/hooks/use-production";

const AMMONIA_TYPES = [
    { value: "refill", label: "Refill" },
    { value: "usage", label: "Usage" },
];

export function AmmoniaDataEntry() {
    const today = new Date().toISOString().split("T")[0];
    const [date, setDate] = useState(today);
    const [type, setType] = useState("refill");
    const [previousAmount, setPreviousAmount] = useState("");
    const [newAmount, setNewAmount] = useState("");

    const createMutation = useCreateAmmoniaRecord();

    async function handleSubmit() {
        if (!previousAmount || !newAmount) return;
        await createMutation.mutateAsync({
            type,
            previousAmount: parseFloat(previousAmount),
            newAmount: parseFloat(newAmount),
            timestamp: `${date}T06:00:00`,
        });
        setPreviousAmount("");
        setNewAmount("");
    }

    return (
        <div>
            <div className="flex items-center gap-2 mb-4">
                <Beaker className="w-4 h-4 text-cyan-500" />
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Log Ammonia Record</h2>
            </div>
            <Card className="gap-0 p-4">
                <div className="flex flex-col sm:flex-row gap-3 items-end flex-wrap">
                    <div className="w-12 h-12 shrink-0 bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-100 dark:border-cyan-800/40 rounded-lg flex items-center justify-center">
                        <Beaker className="w-5 h-5 text-cyan-500" />
                    </div>

                    <div className="flex-1 min-w-[120px] space-y-1.5">
                        <Label>Type</Label>
                        <Select value={type} onValueChange={(v) => { if (v) setType(v); }}>
                            <SelectTrigger className="bg-gray-50 dark:bg-gray-800 border-0 rounded-lg focus:ring-1 focus:ring-cyan-500">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {AMMONIA_TYPES.map((t) => (
                                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex-1 min-w-[110px] space-y-1.5">
                        <Label>Date</Label>
                        <Input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="bg-gray-50 dark:bg-gray-800 border-0 rounded-lg focus-visible:ring-1 focus-visible:ring-cyan-500"
                        />
                    </div>

                    <div className="flex-1 min-w-[110px] space-y-1.5">
                        <Label>Prev. Amount (L)</Label>
                        <Input
                            type="number"
                            placeholder="e.g. 100"
                            value={previousAmount}
                            onChange={(e) => setPreviousAmount(e.target.value)}
                            className="bg-gray-50 dark:bg-gray-800 border-0 rounded-lg focus-visible:ring-1 focus-visible:ring-cyan-500"
                        />
                    </div>

                    <div className="flex-1 min-w-[110px] space-y-1.5">
                        <Label>New Amount (L)</Label>
                        <Input
                            type="number"
                            placeholder="e.g. 50"
                            value={newAmount}
                            onChange={(e) => setNewAmount(e.target.value)}
                            className="bg-gray-50 dark:bg-gray-800 border-0 rounded-lg focus-visible:ring-1 focus-visible:ring-cyan-500"
                        />
                    </div>

                    <div className="flex items-center justify-center shrink-0">
                        <Badge className="bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-400 border-transparent font-semibold px-3 py-1.5 text-xs pointer-events-none capitalize">
                            {type}
                        </Badge>
                    </div>

                    <Button
                        className="bg-cyan-500 hover:bg-cyan-600 font-bold px-8 shadow-sm shrink-0 text-white"
                        onClick={handleSubmit}
                        disabled={createMutation.isPending || !previousAmount || !newAmount}
                    >
                        {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Log Record"}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
