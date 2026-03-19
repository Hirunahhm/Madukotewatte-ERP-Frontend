"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const EMPLOYEES = [
    { value: "arjun-das", label: "Arjun Das" },
    { value: "siti-aminah", label: "Siti Aminah" },
    { value: "rajesh-kumar", label: "Rajesh Kumar" },
    { value: "ahmad-k", label: "Ahmad K." },
];

const HISTORY_DATA = [
    { date: "2026-03-18", employee: "Arjun Das", litres: "148", mass: "162", ammonia: "4.2", metrolac: "32.1" },
    { date: "2026-03-17", employee: "Siti Aminah", litres: "135", mass: "149", ammonia: "4.0", metrolac: "31.8" },
    { date: "2026-03-16", employee: "Rajesh Kumar", litres: "162", mass: "178", ammonia: "4.5", metrolac: "33.0" },
    { date: "2026-03-15", employee: "Ahmad K.", litres: "121", mass: "133", ammonia: "3.9", metrolac: "31.4" },
    { date: "2026-03-14", employee: "Arjun Das", litres: "155", mass: "170", ammonia: "4.3", metrolac: "32.6" },
];

const PAGE_SIZE = 5;

export function DirectDataEntry() {
    const today = new Date().toISOString().split("T")[0];

    const [employee, setEmployee] = useState("");
    const [date, setDate] = useState(today);
    const [litres, setLitres] = useState("");
    const [mass, setMass] = useState("");
    const [ammonia, setAmmonia] = useState("");

    const [historyOpen, setHistoryOpen] = useState(false);
    const [historyPage, setHistoryPage] = useState(0);
    const totalPages = Math.ceil(HISTORY_DATA.length / PAGE_SIZE);
    const pagedRows = HISTORY_DATA.slice(historyPage * PAGE_SIZE, (historyPage + 1) * PAGE_SIZE);

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
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                    <div className="w-12 h-12 shrink-0 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-500 font-light text-2xl">
                        +
                    </div>

                    <Select value={employee} onValueChange={(v) => { if (v !== null) setEmployee(v); }}>
                        <SelectTrigger className="flex-1 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg focus:ring-1 focus:ring-brand-500">
                            <SelectValue placeholder="Employee Name" />
                        </SelectTrigger>
                        <SelectContent>
                            {EMPLOYEES.map((e) => (
                                <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="flex-1 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg focus-visible:ring-1 focus-visible:ring-brand-500"
                    />

                    <Input
                        type="number"
                        placeholder="Litres (L)"
                        value={litres}
                        onChange={(e) => setLitres(e.target.value)}
                        className="flex-1 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg focus-visible:ring-1 focus-visible:ring-brand-500"
                    />

                    <Input
                        type="number"
                        placeholder="Mass (kg)"
                        value={mass}
                        onChange={(e) => setMass(e.target.value)}
                        className="flex-1 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg focus-visible:ring-1 focus-visible:ring-brand-500"
                    />

                    <Input
                        type="number"
                        placeholder="Ammonia (CC)"
                        value={ammonia}
                        onChange={(e) => setAmmonia(e.target.value)}
                        className="flex-1 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg focus-visible:ring-1 focus-visible:ring-brand-500"
                    />

                    <Button className="bg-brand-500 hover:bg-brand-600 font-bold px-8 shadow-sm shrink-0">
                        Add Record
                    </Button>
                </div>
            </Card>

            {/* Past Data Dialog */}
            <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Past Entry Records</DialogTitle>
                    </DialogHeader>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Employee</TableHead>
                                    <TableHead>Litres</TableHead>
                                    <TableHead>Mass (kg)</TableHead>
                                    <TableHead>Ammonia (CC)</TableHead>
                                    <TableHead>Metrolac</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pagedRows.map((row, i) => (
                                    <TableRow key={i}>
                                        <TableCell className="text-sm">{row.date}</TableCell>
                                        <TableCell className="text-sm">{row.employee}</TableCell>
                                        <TableCell className="text-sm">{row.litres}</TableCell>
                                        <TableCell className="text-sm">{row.mass}</TableCell>
                                        <TableCell className="text-sm">{row.ammonia}</TableCell>
                                        <TableCell className="text-sm">{row.metrolac}</TableCell>
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
