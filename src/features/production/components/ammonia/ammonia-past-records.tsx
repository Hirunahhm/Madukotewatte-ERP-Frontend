"use client";

import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { useAmmoniaRecords } from "@/features/production/hooks/use-production";

export function AmmoniaPastRecords() {
    const [filterType, setFilterType] = useState("all");
    const [page, setPage] = useState(0);

    const { data, isLoading } = useAmmoniaRecords({ page, size: 10 });
    const records = data?.content ?? [];
    const totalPages = data?.totalPages ?? 1;

    const filtered = filterType === "all" ? records : records.filter((r) => r.type.toLowerCase() === filterType);

    return (
        <Card className="shadow-sm gap-0 p-6">
            <CardTitle className="text-base font-semibold mb-4">Past Ammonia Records</CardTitle>

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <Select value={filterType} onValueChange={(v) => { if (v !== null) { setFilterType(v); setPage(0); } }}>
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
                            <TableHead>Prev (L)</TableHead>
                            <TableHead>New (L)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8">
                                    <Loader2 className="w-5 h-5 animate-spin inline text-cyan-500" />
                                </TableCell>
                            </TableRow>
                        ) : filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-sm text-gray-400 py-6">No records found.</TableCell>
                            </TableRow>
                        ) : filtered.map((row) => (
                            <TableRow key={row.recordId} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                <TableCell className="text-sm">{new Date(row.timestamp).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Badge className={
                                        row.type === "refill"
                                            ? "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-400 border-transparent text-[10px] font-bold uppercase"
                                            : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 border-transparent text-[10px] font-bold uppercase"
                                    }>
                                        {row.type}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-sm font-medium">{row.previousAmount}</TableCell>
                                <TableCell className="text-sm font-medium">{row.newAmount}</TableCell>
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
