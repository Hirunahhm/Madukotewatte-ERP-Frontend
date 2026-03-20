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

export interface ExpenseRow {
    id: string;
    date: string;
    type: string;
    description: string;
    amount: string;
    status: "Paid" | "Pending";
}

const MOCK_DATA: ExpenseRow[] = [
    { id: "1", date: "2026-03-19", type: "Fertilizer", description: "NPK compound — Field A & B", amount: "LKR 48,200", status: "Paid" },
    { id: "2", date: "2026-03-17", type: "Labor", description: "Daily labor wages — week 11", amount: "LKR 62,400", status: "Pending" },
    { id: "3", date: "2026-03-15", type: "Maintenance", description: "Processing shed roof repair", amount: "LKR 28,600", status: "Paid" },
    { id: "4", date: "2026-03-12", type: "Chemicals", description: "Coagulant and acid supply", amount: "LKR 34,100", status: "Pending" },
    { id: "5", date: "2026-03-10", type: "Utilities", description: "Monthly electricity bill", amount: "LKR 18,400", status: "Paid" },
    { id: "6", date: "2026-03-08", type: "Logistics", description: "Transport to factory — load #37", amount: "LKR 12,200", status: "Pending" },
];

interface ExpensesTableProps {
    onMarkPayment: (row: ExpenseRow) => void;
}

export function ExpensesTable({ onMarkPayment }: ExpensesTableProps) {
    return (
        <Card className="shadow-sm gap-0 p-6">
            <CardTitle className="text-base font-semibold mb-4">Expense Ledger</CardTitle>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {MOCK_DATA.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell className="text-sm text-gray-600 dark:text-gray-400">{row.date}</TableCell>
                                <TableCell className="text-sm font-medium">{row.type}</TableCell>
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
