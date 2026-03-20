"use client";

import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const RECORDS = [
    { date: "2026-03-19", type: "Refill", amount: 50, loggedBy: "Arjun Das" },
    { date: "2026-03-18", type: "Usage", amount: 45, loggedBy: "System" },
    { date: "2026-03-17", type: "Usage", amount: 62, loggedBy: "System" },
    { date: "2026-03-16", type: "Refill", amount: 100, loggedBy: "Rajesh Kumar" },
    { date: "2026-03-15", type: "Usage", amount: 38, loggedBy: "System" },
    { date: "2026-03-14", type: "Usage", amount: 71, loggedBy: "System" },
];

const PAGE_SIZE = 5;

export function AmmoniaPastRecords() {
    const [filterDate, setFilterDate] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [page, setPage] = useState(0);

    const filtered = RECORDS.filter((r) => {
        const matchDate = !filterDate || r.date === filterDate;
        const matchType = filterType === "all" || r.type.toLowerCase() === filterType;
        return matchDate && matchType;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

    function handleFilterChange() {
        setPage(0);
    }

    return (
        <Card className="shadow-sm gap-0 p-6">
            <CardTitle className="text-base font-semibold mb-4">Past Ammonia Records</CardTitle>

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <Input
                    type="date"
                    value={filterDate}
                    onChange={(e) => { setFilterDate(e.target.value); handleFilterChange(); }}
                    className="flex-1 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                />
                <Select value={filterType} onValueChange={(v) => { if (v !== null) { setFilterType(v); handleFilterChange(); } }}>
                    <SelectTrigger className="flex-1 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                        <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="refill">Refill</SelectItem>
                        <SelectItem value="usage">Usage</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Amount (L)</TableHead>
                            <TableHead>Logged By</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paged.map((row, i) => (
                            <TableRow key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                <TableCell className="text-sm">{row.date}</TableCell>
                                <TableCell>
                                    <Badge className={
                                        row.type === "Refill"
                                            ? "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-400 border-transparent text-[10px] font-bold uppercase"
                                            : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 border-transparent text-[10px] font-bold uppercase"
                                    }>
                                        {row.type}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-sm font-medium">{row.amount}</TableCell>
                                <TableCell className="text-sm text-gray-500 dark:text-gray-400">{row.loggedBy}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between pt-4">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                    Page {page + 1} of {totalPages}
                </span>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Prev</Button>
                    <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>Next</Button>
                </div>
            </div>
        </Card>
    );
}
