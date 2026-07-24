"use client";

import { useState } from "react";
import { Scale, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateRubberSolidRecord, useLoads } from "@/features/production/hooks/use-production";

export function RubberDataEntry() {
    const [loadId, setLoadId] = useState("");
    const [massKg, setMassKg] = useState("");

    const { data: loadsData } = useLoads({ size: 50 });
    const loads = loadsData?.content ?? [];

    const createMutation = useCreateRubberSolidRecord();

    async function handleSubmit() {
        if (!loadId || !massKg) return;
        await createMutation.mutateAsync({
            loadId,
            massKg: parseFloat(massKg),
        });
        setLoadId("");
        setMassKg("");
    }

    return (
        <div>
            <div className="flex items-center gap-2 mb-4">
                <Scale className="w-4 h-4 text-amber-500" />
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Log Scrap Collection</h2>
            </div>
            <Card className="gap-0 p-4">
                <div className="flex flex-col sm:flex-row gap-3 items-end flex-wrap">
                    <div className="w-12 h-12 shrink-0 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/40 rounded-lg flex items-center justify-center">
                        <Scale className="w-5 h-5 text-amber-500" />
                    </div>

                    <div className="flex-1 min-w-[150px] space-y-1.5">
                        <Label>Load</Label>
                        <Select value={loadId} onValueChange={(v) => { if (v) setLoadId(v); }}>
                            <SelectTrigger className="bg-gray-50 dark:bg-gray-800 border-0 rounded-lg focus:ring-1 focus:ring-amber-500">
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

                    <div className="flex-1 min-w-[110px] space-y-1.5">
                        <Label>Mass (kg)</Label>
                        <Input
                            type="number"
                            placeholder="e.g. 4.5"
                            value={massKg}
                            onChange={(e) => setMassKg(e.target.value)}
                            className="bg-gray-50 dark:bg-gray-800 border-0 rounded-lg focus-visible:ring-1 focus-visible:ring-amber-500"
                        />
                    </div>

                    <Button
                        className="bg-amber-500 hover:bg-amber-600 font-bold px-8 shadow-sm shrink-0 text-white"
                        onClick={handleSubmit}
                        disabled={createMutation.isPending || !loadId || !massKg}
                    >
                        {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Log Collection"}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
