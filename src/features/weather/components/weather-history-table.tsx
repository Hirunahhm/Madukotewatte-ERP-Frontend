"use client";

import { useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSyncWeatherHistory, useWeatherHistory } from "@/features/weather/hooks/use-weather-insights";
import { useAuthStore } from "@/stores/auth-store";

function isoDate(d: Date): string {
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
}

function daysAgo(n: number): string {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return isoDate(d);
}

function cell(v: number | null, digits = 1): string {
    return v == null ? "—" : v.toFixed(digits);
}

export function WeatherHistoryTable() {
    const role = useAuthStore((s) => s.role);
    const isAdmin = role === "ROLE_ADMIN";
    const [from, setFrom] = useState(() => daysAgo(30));
    const [to, setTo] = useState(() => isoDate(new Date()));
    const history = useWeatherHistory(from, to);
    const sync = useSyncWeatherHistory();
    const rows = [...(history.data ?? [])].reverse();

    return (
        <Card className="shadow-sm gap-0 p-6">
            <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
                <div>
                    <CardTitle className="text-base font-semibold">Weather History</CardTitle>
                    <CardDescription>Daily record at the estate. Morning rain is 4–9am, the tapping window.</CardDescription>
                </div>
                <div className="flex flex-wrap items-end gap-2">
                    <label className="text-xs text-gray-500">
                        From
                        <Input type="date" value={from} max={to} onChange={(e) => setFrom(e.target.value)} className="h-8 w-36" />
                    </label>
                    <label className="text-xs text-gray-500">
                        To
                        <Input type="date" value={to} min={from} onChange={(e) => setTo(e.target.value)} className="h-8 w-36" />
                    </label>
                    {isAdmin && (
                        <Button size="sm" variant="outline" disabled={sync.isPending || !from || !to} onClick={() => sync.mutate({ from, to })}>
                            {sync.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <RefreshCw className="w-4 h-4 mr-1" />}
                            Sync history
                        </Button>
                    )}
                </div>
            </div>
            {sync.isSuccess && (
                <p className="text-xs text-brand-600 mb-2">
                    Synced {sync.data.daysUpserted} days ({sync.data.from} to {sync.data.to}).
                </p>
            )}
            {sync.isError && <p className="text-xs text-red-500 mb-2">{sync.error.message}</p>}
            <div className="max-h-96 overflow-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Rain (mm)</TableHead>
                            <TableHead className="text-right">Rain hrs</TableHead>
                            <TableHead className="text-right">Morning rain (mm)</TableHead>
                            <TableHead className="text-right">Max / min °C</TableHead>
                            <TableHead className="text-right">Humidity %</TableHead>
                            <TableHead className="text-right">Wind km/h</TableHead>
                            <TableHead>Source</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {history.isLoading ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-6">
                                    <Loader2 className="w-4 h-4 animate-spin inline text-brand-500" />
                                </TableCell>
                            </TableRow>
                        ) : rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center text-gray-500 py-6">
                                    No weather recorded for this range.
                                </TableCell>
                            </TableRow>
                        ) : (
                            rows.map((r) => (
                                <TableRow key={r.date}>
                                    <TableCell className="font-medium">{r.date}</TableCell>
                                    <TableCell className="text-right">{cell(r.precipitationMm)}</TableCell>
                                    <TableCell className="text-right">{cell(r.rainHours, 0)}</TableCell>
                                    <TableCell className="text-right">{cell(r.morningRainMm)}</TableCell>
                                    <TableCell className="text-right">
                                        {cell(r.tempMax)} / {cell(r.tempMin)}
                                    </TableCell>
                                    <TableCell className="text-right">{cell(r.humidityMean, 0)}</TableCell>
                                    <TableCell className="text-right">{cell(r.windMax, 0)}</TableCell>
                                    <TableCell className="text-xs text-gray-500">{r.source}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </Card>
    );
}
