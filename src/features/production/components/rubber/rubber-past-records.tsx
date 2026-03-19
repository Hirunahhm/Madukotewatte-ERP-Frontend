"use client";

import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const RECORDS = [
    { date: "2026-03-19", mass: 5.2, loggedBy: "Ahmad K." },
    { date: "2026-03-18", mass: 3.8, loggedBy: "Siti Aminah" },
    { date: "2026-03-17", mass: 7.1, loggedBy: "Arjun Das" },
    { date: "2026-03-16", mass: 4.5, loggedBy: "Ahmad K." },
    { date: "2026-03-15", mass: 6.3, loggedBy: "Rajesh Kumar" },
    { date: "2026-03-14", mass: 2.9, loggedBy: "Siti Aminah" },
];

const PAGE_SIZE = 5;

export function RubberPastRecords() {
    const [filterDate, setFilterDate] = useState("");
    const [page, setPage] = useState(0);

    const filtered = RECORDS.filter((r) => !filterDate || r.date === filterDate);
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

    return (
        <Card className="shadow-sm gap-0 p-6">
            <CardTitle className="text-base font-semibold mb-4">Past Scrap Records</CardTitle>

            <div className="mb-4">
                <Input
                    type="date"
                    value={filterDate}
                    onChange={(e) => { setFilterDate(e.target.value); setPage(0); }}
                    className="max-w-xs bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                />
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Mass (kg)</TableHead>
                            <TableHead>Logged By</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paged.map((row, i) => (
                            <TableRow key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                <TableCell className="text-sm">{row.date}</TableCell>
                                <TableCell className="text-sm font-medium text-amber-600 dark:text-amber-400">{row.mass}</TableCell>
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
