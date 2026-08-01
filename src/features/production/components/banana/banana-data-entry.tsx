"use client";

import { useState } from "react";
import { Banana, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEmployees } from "@/features/employees/hooks/use-employees";
import { useLoads } from "@/features/production/hooks/use-production";
import { useCreateBananaRecord } from "@/features/production/hooks/use-banana-production";
import { BANANA_VARIETIES } from "@/features/production/types/banana-production.types";
import { toLocalDateInputValue } from "@/lib/utils";

export function BananaDataEntry() {
    const [loadId, setLoadId] = useState("");
    const [employeeId, setEmployeeId] = useState("");
    const [variety, setVariety] = useState("");
    const [varietyNote, setVarietyNote] = useState("");
    const [bunchCount, setBunchCount] = useState("");
    const [massKg, setMassKg] = useState("");
    const [date, setDate] = useState(() => toLocalDateInputValue());

    const { data: employeesData } = useEmployees({ size: 100 });
    const employees = employeesData?.content ?? [];

    const { data: loadsData } = useLoads({ loadType: "banana", size: 50 });
    const loads = loadsData?.content ?? [];

    const createMutation = useCreateBananaRecord();

    async function handleSubmit() {
        if (!loadId || !employeeId || !variety || !date) return;
        await createMutation.mutateAsync({
            loadId,
            employeeId,
            variety,
            varietyNote: variety === "Other" ? varietyNote || undefined : undefined,
            bunchCount: bunchCount ? parseInt(bunchCount, 10) : undefined,
            massKg: massKg ? parseFloat(massKg) : undefined,
            timestamp: `${date}T06:00:00`,
        });
        setBunchCount("");
        setMassKg("");
        setVarietyNote("");
        setEmployeeId("");
        setLoadId("");
    }

    return (
        <div>
            <div className="flex items-center gap-2 mb-4">
                <Banana className="w-4 h-4 text-amber-500" />
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Log Banana Harvest</h2>
            </div>
            <Card className="gap-0 p-4">
                <div className="flex flex-col sm:flex-row gap-3 items-end flex-wrap">
                    <div className="w-12 h-12 shrink-0 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/40 rounded-lg flex items-center justify-center">
                        <Banana className="w-5 h-5 text-amber-500" />
                    </div>

                    <div className="flex-1 min-w-[140px] space-y-1.5">
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

                    <div className="flex-1 min-w-[140px] space-y-1.5">
                        <Label>Employee</Label>
                        <Select value={employeeId} onValueChange={(v) => { if (v) setEmployeeId(v); }}>
                            <SelectTrigger className="bg-gray-50 dark:bg-gray-800 border-0 rounded-lg focus:ring-1 focus:ring-amber-500">
                                <SelectValue placeholder="Employee Name" />
                            </SelectTrigger>
                            <SelectContent>
                                {employees.map((e) => (
                                    <SelectItem key={e.employeeId} value={e.employeeId}>{e.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex-1 min-w-[140px] space-y-1.5">
                        <Label>Variety</Label>
                        <Select value={variety} onValueChange={(v) => { if (v) setVariety(v); }}>
                            <SelectTrigger className="bg-gray-50 dark:bg-gray-800 border-0 rounded-lg focus:ring-1 focus:ring-amber-500">
                                <SelectValue placeholder="Select Variety…" />
                            </SelectTrigger>
                            <SelectContent>
                                {BANANA_VARIETIES.map((v) => (
                                    <SelectItem key={v} value={v}>{v}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {variety === "Other" && (
                        <div className="flex-1 min-w-[130px] space-y-1.5">
                            <Label>Variety Note</Label>
                            <Input
                                placeholder="e.g. Sini Kesel"
                                value={varietyNote}
                                onChange={(e) => setVarietyNote(e.target.value)}
                                className="bg-gray-50 dark:bg-gray-800 border-0 rounded-lg focus-visible:ring-1 focus-visible:ring-amber-500"
                            />
                        </div>
                    )}

                    <div className="flex-1 min-w-[110px] space-y-1.5">
                        <Label>Bunches</Label>
                        <Input
                            type="number"
                            placeholder="e.g. 12"
                            value={bunchCount}
                            onChange={(e) => setBunchCount(e.target.value)}
                            className="bg-gray-50 dark:bg-gray-800 border-0 rounded-lg focus-visible:ring-1 focus-visible:ring-amber-500"
                        />
                    </div>

                    <div className="flex-1 min-w-[110px] space-y-1.5">
                        <Label>Mass (kg)</Label>
                        <Input
                            type="number"
                            placeholder="e.g. 84"
                            value={massKg}
                            onChange={(e) => setMassKg(e.target.value)}
                            className="bg-gray-50 dark:bg-gray-800 border-0 rounded-lg focus-visible:ring-1 focus-visible:ring-amber-500"
                        />
                    </div>

                    <div className="flex-1 min-w-[130px] space-y-1.5">
                        <Label>Date</Label>
                        <Input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="bg-gray-50 dark:bg-gray-800 border-0 rounded-lg focus-visible:ring-1 focus-visible:ring-amber-500"
                        />
                    </div>

                    <Button
                        className="bg-amber-500 hover:bg-amber-600 font-bold px-8 shadow-sm shrink-0 text-white"
                        onClick={handleSubmit}
                        disabled={createMutation.isPending || !loadId || !employeeId || !variety || !date}
                    >
                        {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Log Harvest"}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
