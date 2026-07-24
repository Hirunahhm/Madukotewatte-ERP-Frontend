"use client";

import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { useRubberSolidRecords } from "@/features/production/hooks/use-production";

export function RubberPastRecords() {
    const [page, setPage] = useState(0);

    const { data, isLoading } = useRubberSolidRecords({ page, size: 10 });
    const records = data?.content ?? [];
    const totalPages = data?.totalPages ?? 1;

    return (
        <Card className="shadow-sm gap-0 p-6">
            <CardTitle className="text-base font-semibold mb-4">Past Scrap Records</CardTitle>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Logged</TableHead>
                            <TableHead>Load ID</TableHead>
                            <TableHead>Mass (kg)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-8">
                                    <Loader2 className="w-5 h-5 animate-spin inline text-amber-500" />
                                </TableCell>
                            </TableRow>
                        ) : records.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center text-sm text-gray-400 py-6">No records found.</TableCell>
                            </TableRow>
                        ) : records.map((row) => (
                            <TableRow key={row.recordId} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                <TableCell className="text-sm">{new Date(row.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell className="text-sm font-mono text-xs">{row.loadId.slice(0, 8).toUpperCase()}</TableCell>
                                <TableCell className="text-sm font-medium text-amber-600 dark:text-amber-400">{row.massKg} kg</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between pt-4">
                <span className="text-xs text-gray-500 dark:text-gray-400">Page {page + 1} of {totalPages}</span>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Prev</Button>
                    <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>Next</Button>
                </div>
            </div>
        </Card>
    );
}
