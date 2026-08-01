"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEmployees } from "@/features/employees/hooks/use-employees";
import { useCreateLatexRecord, useLatexRecords, useLoads } from "@/features/production/hooks/use-production";
import { toLocalDateInputValue } from "@/lib/utils";

const PAGE_SIZE = 10;

export function DirectDataEntry() {
    const today = toLocalDateInputValue();

    const [loadId, setLoadId] = useState("");
    const [employeeId, setEmployeeId] = useState("");
    const [date, setDate] = useState(today);
    const [latexAmount, setLatexAmount] = useState("");
    const [ammoniaAmount, setAmmoniaAmount] = useState("");

    const [historyOpen, setHistoryOpen] = useState(false);
    const [historyPage, setHistoryPage] = useState(0);

    // Real data
    const { data: employeesData } = useEmployees({ size: 100 });
    const employees = employeesData?.content ?? [];

    const { data: loadsData } = useLoads({ loadType: "field-latex", size: 50 });
    const loads = loadsData?.content ?? [];

    const { data: historyData, isLoading: historyLoading } = useLatexRecords({ page: historyPage, size: PAGE_SIZE });
    const historyRows = historyData?.content ?? [];
    const totalPages = historyData?.totalPages ?? 1;

    const createMutation = useCreateLatexRecord();

    async function handleAddRecord() {
        if (!loadId || !employeeId || !latexAmount || !ammoniaAmount) return;
        await createMutation.mutateAsync({
            loadId,
            employeeId,
            timestamp: `${date}T06:00:00`,
            latexAmount: parseFloat(latexAmount),
            ammoniaAmount: parseFloat(ammoniaAmount),
        });
        setLatexAmount("");
        setAmmoniaAmount("");
        setEmployeeId("");
        setLoadId("");
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-brand-500" /> Direct Data Entry
                </h2>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        Session logged as:{" "}
                        <span className="font-bold text-gray-900 dark:text-gray-100">Clerk_04 (Main Weigh-in)</span>
                    </span>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-brand-600 hover:text-brand-700 h-7 px-2"
                        onClick={() => { setHistoryPage(0); setHistoryOpen(true); }}
                    >
                        View Past Data
                    </Button>
                </div>
            </div>

            <Card className="gap-0 p-3">
                <div className="flex flex-col sm:flex-row gap-3 items-center flex-wrap">
                    {/* Load selector */}
                    <Select value={loadId} onValueChange={(v) => { if (v) setLoadId(v); }}>
                        <SelectTrigger className="flex-1 min-w-[140px] bg-gray-50 dark:bg-gray-800 border-0 rounded-lg focus:ring-1 focus:ring-brand-500">
                            <SelectValue placeholder="Select Load" />
                        </SelectTrigger>
                        <SelectContent>
                            {loads.map((l) => (
                                <SelectItem key={l.loadId} value={l.loadId}>
                                    {l.loadId.slice(0, 8).toUpperCase()} — {l.loadType.replace("-", " ")}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Employee selector — real employees from backend */}
                    <Select value={employeeId} onValueChange={(v) => { if (v) setEmployeeId(v); }}>
                        <SelectTrigger className="flex-1 min-w-[140px] bg-gray-50 dark:bg-gray-800 border-0 rounded-lg focus:ring-1 focus:ring-brand-500">
                            <SelectValue placeholder="Employee Name" />
                        </SelectTrigger>
                        <SelectContent>
                            {employees.map((e) => (
                                <SelectItem key={e.employeeId} value={e.employeeId}>{e.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="flex-1 min-w-[120px] bg-gray-50 dark:bg-gray-800 border-0 rounded-lg focus-visible:ring-1 focus-visible:ring-brand-500"
                    />

                    <Input
                        type="number"
                        placeholder="Litres (L)"
                        value={latexAmount}
                        onChange={(e) => setLatexAmount(e.target.value)}
                        className="flex-1 min-w-[100px] bg-gray-50 dark:bg-gray-800 border-0 rounded-lg focus-visible:ring-1 focus-visible:ring-brand-500"
                    />

                    <Input
                        type="number"
                        placeholder="Ammonia (CC)"
                        value={ammoniaAmount}
                        onChange={(e) => setAmmoniaAmount(e.target.value)}
                        className="flex-1 min-w-[110px] bg-gray-50 dark:bg-gray-800 border-0 rounded-lg focus-visible:ring-1 focus-visible:ring-brand-500"
                    />

                    <Button
                        className="bg-brand-500 hover:bg-brand-600 font-bold px-8 shadow-sm shrink-0"
                        onClick={handleAddRecord}
                        disabled={createMutation.isPending || !loadId || !employeeId || !latexAmount || !ammoniaAmount}
                    >
                        {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Record"}
                    </Button>
                </div>
            </Card>

            {/* Past Data Dialog */}
            <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
                <DialogContent className="sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Past Latex Entry Records</DialogTitle>
                    </DialogHeader>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Employee</TableHead>
                                    <TableHead>Load ID</TableHead>
                                    <TableHead>Latex (L)</TableHead>
                                    <TableHead>Ammonia (CC)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {historyLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8">
                                            <Loader2 className="w-5 h-5 animate-spin inline text-brand-500" />
                                        </TableCell>
                                    </TableRow>
                                ) : historyRows.map((row) => (
                                    <TableRow key={row.recordId}>
                                        <TableCell className="text-sm">{new Date(row.timestamp).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-sm">{row.employeeName}</TableCell>
                                        <TableCell className="text-sm font-mono text-xs">{row.loadId.slice(0, 8).toUpperCase()}</TableCell>
                                        <TableCell className="text-sm">{row.latexAmount}</TableCell>
                                        <TableCell className="text-sm">{row.ammoniaAmount}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            Page {historyPage + 1} of {totalPages}
                        </span>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={historyPage === 0}
                                onClick={() => setHistoryPage((p) => p - 1)}
                            >
                                Prev
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={historyPage >= totalPages - 1}
                                onClick={() => setHistoryPage((p) => p + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
