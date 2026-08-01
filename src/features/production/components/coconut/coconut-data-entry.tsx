"use client";

import { useState } from "react";
import { Nut, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEmployees } from "@/features/employees/hooks/use-employees";
import { useLoads } from "@/features/production/hooks/use-production";
import { useCreateCoconutRecord } from "@/features/production/hooks/use-coconut-production";
import { COCONUT_VARIETIES } from "@/features/production/types/coconut-production.types";
import { toLocalDateInputValue } from "@/lib/utils";

export function CoconutDataEntry() {
    const [loadId, setLoadId] = useState("");
    const [employeeId, setEmployeeId] = useState("");
    const [variety, setVariety] = useState("");
    const [varietyNote, setVarietyNote] = useState("");
    const [nutCount, setNutCount] = useState("");
    const [massKg, setMassKg] = useState("");
    const [date, setDate] = useState(() => toLocalDateInputValue());

    const { data: employeesData } = useEmployees({ size: 100 });
    const employees = employeesData?.content ?? [];

    const { data: loadsData } = useLoads({ loadType: "coconut", size: 50 });
    const loads = loadsData?.content ?? [];

    const createMutation = useCreateCoconutRecord();

    async function handleSubmit() {
        if (!loadId || !employeeId || !variety || !date) return;
        await createMutation.mutateAsync({
            loadId,
            employeeId,
            variety,
            varietyNote: variety === "Other" ? varietyNote || undefined : undefined,
            nutCount: nutCount ? parseInt(nutCount, 10) : undefined,
            massKg: massKg ? parseFloat(massKg) : undefined,
            timestamp: `${date}T06:00:00`,
        });
        setNutCount("");
        setMassKg("");
        setVarietyNote("");
        setEmployeeId("");
        setLoadId("");
    }

    return (
        <div>
            <div className="flex items-center gap-2 mb-4">
                <Nut className="w-4 h-4 text-blue-500" />
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Log Coconut Harvest</h2>
            </div>
            <Card className="gap-0 p-4">
                <div className="flex flex-col sm:flex-row gap-3 items-end flex-wrap">
                    <div className="w-12 h-12 shrink-0 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/40 rounded-lg flex items-center justify-center">
                        <Nut className="w-5 h-5 text-blue-500" />
                    </div>

                    <div className="flex-1 min-w-[140px] space-y-1.5">
                        <Label>Load</Label>
                        <Select value={loadId} onValueChange={(v) => { if (v) setLoadId(v); }}>
                            <SelectTrigger className="bg-gray-50 dark:bg-gray-800 border-0 rounded-lg focus:ring-1 focus:ring-blue-500">
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
                            <SelectTrigger className="bg-gray-50 dark:bg-gray-800 border-0 rounded-lg focus:ring-1 focus:ring-blue-500">
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
                            <SelectTrigger className="bg-gray-50 dark:bg-gray-800 border-0 rounded-lg focus:ring-1 focus:ring-blue-500">
                                <SelectValue placeholder="Select Variety…" />
                            </SelectTrigger>
                            <SelectContent>
                                {COCONUT_VARIETIES.map((v) => (
                                    <SelectItem key={v} value={v}>{v}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {variety === "Other" && (
                        <div className="flex-1 min-w-[130px] space-y-1.5">
                            <Label>Variety Note</Label>
                            <Input
                                placeholder="e.g. Gon Thembili"
                                value={varietyNote}
                                onChange={(e) => setVarietyNote(e.target.value)}
                                className="bg-gray-50 dark:bg-gray-800 border-0 rounded-lg focus-visible:ring-1 focus-visible:ring-blue-500"
                            />
                        </div>
                    )}

                    <div className="flex-1 min-w-[110px] space-y-1.5">
                        <Label>Nuts</Label>
                        <Input
                            type="number"
                            placeholder="e.g. 120"
                            value={nutCount}
                            onChange={(e) => setNutCount(e.target.value)}
                            className="bg-gray-50 dark:bg-gray-800 border-0 rounded-lg focus-visible:ring-1 focus-visible:ring-blue-500"
                        />
                    </div>

                    <div className="flex-1 min-w-[110px] space-y-1.5">
                        <Label>Mass (kg)</Label>
                        <Input
                            type="number"
                            placeholder="e.g. 150"
                            value={massKg}
                            onChange={(e) => setMassKg(e.target.value)}
                            className="bg-gray-50 dark:bg-gray-800 border-0 rounded-lg focus-visible:ring-1 focus-visible:ring-blue-500"
                        />
                    </div>

                    <div className="flex-1 min-w-[130px] space-y-1.5">
                        <Label>Date</Label>
                        <Input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="bg-gray-50 dark:bg-gray-800 border-0 rounded-lg focus-visible:ring-1 focus-visible:ring-blue-500"
                        />
                    </div>

                    <Button
                        className="bg-blue-500 hover:bg-blue-600 font-bold px-8 shadow-sm shrink-0 text-white"
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
