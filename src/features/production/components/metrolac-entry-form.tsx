"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Thermometer, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateMetrolacReading, useLoads } from "@/features/production/hooks/use-production";

export function MetrolacEntryForm() {
    const today = new Date().toISOString().split("T")[0];

    const [loadId, setLoadId] = useState("");
    const [reading, setReading] = useState("");
    const [date, setDate] = useState(today);
    const [temperature, setTemperature] = useState("");

    const { data: loadsData } = useLoads({ loadType: "field-latex", size: 50 });
    const loads = loadsData?.content ?? [];

    const createMutation = useCreateMetrolacReading();

    async function handleSubmit() {
        if (!loadId || !temperature) return;
        await createMutation.mutateAsync({
            loadId,
            temperature: parseFloat(temperature),
            reading: reading ? parseFloat(reading) : undefined,
            timestamp: `${date}T06:00:00`,
        });
        setTemperature("");
        setReading("");
        setLoadId("");
    }

    return (
        <Card className="shadow-sm gap-0 p-5">
            <div className="flex items-center gap-2 mb-4">
                <Thermometer className="w-4 h-4 text-brand-500" />
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    Metrolac Reading Entry
                </h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-end flex-wrap">
                <div className="flex-1 min-w-[140px] space-y-1.5">
                    <Label>Load</Label>
                    <Select value={loadId} onValueChange={(v) => { if (v) setLoadId(v); }}>
                        <SelectTrigger className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-brand-500">
                            <SelectValue placeholder="Select Load…" />
                        </SelectTrigger>
                        <SelectContent>
                            {loads.map((l) => (
                                <SelectItem key={l.loadId} value={l.loadId}>
                                    {l.loadId.slice(0, 8).toUpperCase()} — {l.loadType.replace("-", " ")}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex-1 min-w-[120px] space-y-1.5">
                    <Label htmlFor="metrolac-reading">Metrolac Reading (mL)</Label>
                    <Input
                        id="metrolac-reading"
                        type="number"
                        placeholder="e.g. 32.4"
                        step="0.1"
                        value={reading}
                        onChange={(e) => setReading(e.target.value)}
                        className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus-visible:ring-brand-500"
                    />
                </div>

                <div className="flex-1 min-w-[120px] space-y-1.5">
                    <Label htmlFor="metrolac-date">Date</Label>
                    <Input
                        id="metrolac-date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus-visible:ring-brand-500"
                    />
                </div>

                <div className="flex-1 min-w-[130px] space-y-1.5">
                    <Label htmlFor="temperature">Recorded Temperature (°C)</Label>
                    <Input
                        id="temperature"
                        type="number"
                        placeholder="e.g. 28"
                        step="0.1"
                        value={temperature}
                        onChange={(e) => setTemperature(e.target.value)}
                        className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus-visible:ring-brand-500"
                    />
                </div>

                <Button
                    className="bg-brand-500 hover:bg-brand-600 font-bold px-6 shadow-sm shrink-0"
                    onClick={handleSubmit}
                    disabled={createMutation.isPending || !loadId || !temperature}
                >
                    {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Log Reading"}
                </Button>
            </div>
        </Card>
    );
}
