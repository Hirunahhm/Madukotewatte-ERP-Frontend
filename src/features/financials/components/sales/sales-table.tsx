"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export interface SaleRow {
    id: string;
    loadId: string;
    date: string;
    category: string;
    description: string;
    amount: string;
    status: "Paid" | "Pending";
}

const MOCK_DATA: SaleRow[] = [
    { id: "1", loadId: "LX-0041", date: "2026-03-18", category: "Latex", description: "Field A morning collection", amount: "LKR 84,200", status: "Paid" },
    { id: "2", loadId: "RS-0019", date: "2026-03-17", category: "Rubber Solid", description: "Smoked sheet batch #19", amount: "LKR 62,500", status: "Pending" },
    { id: "3", loadId: "MN-0008", date: "2026-03-15", category: "Manioc", description: "Monthly harvest — 480 kg", amount: "LKR 19,200", status: "Paid" },
    { id: "4", loadId: "LX-0040", date: "2026-03-14", category: "Latex", description: "Field B morning collection", amount: "LKR 77,800", status: "Pending" },
    { id: "5", loadId: "BN-0003", date: "2026-03-12", category: "Banana", description: "Weekly banana harvest", amount: "LKR 14,400", status: "Paid" },
    { id: "6", loadId: "CN-0011", date: "2026-03-10", category: "Coconut", description: "Bi-weekly coconut harvest", amount: "LKR 21,600", status: "Pending" },
];

interface SalesTableProps {
    onMarkPayment: (row: SaleRow) => void;
}

export function SalesTable({ onMarkPayment }: SalesTableProps) {
    return (
        <Card className="shadow-sm gap-0 p-6">
            <CardTitle className="text-base font-semibold mb-4">Sales Ledger</CardTitle>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Load ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {MOCK_DATA.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell className="font-mono text-sm font-medium">{row.loadId}</TableCell>
                                <TableCell className="text-sm text-gray-600 dark:text-gray-400">{row.date}</TableCell>
                                <TableCell className="text-sm">{row.category}</TableCell>
                                <TableCell className="text-sm text-gray-600 dark:text-gray-400">{row.description}</TableCell>
                                <TableCell className="text-sm font-medium">{row.amount}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={row.status === "Paid"
                                            ? "text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/20 dark:border-emerald-800"
                                            : "text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-900/20 dark:border-amber-800"
                                        }
                                    >
                                        {row.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={row.status === "Paid"}
                                        onClick={() => onMarkPayment(row)}
                                    >
                                        Mark Payment
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Card>
    );
}
