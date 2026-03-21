"use client";

import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type TransactionType = "Credit" | "Debit";
type BankName = "BOC" | "Seylan" | "Peoples";

interface BankTransaction {
    date: string;
    bank: BankName;
    description: string;
    lastAmount: number;
    amount: number;
    newAmount: number;
    type: TransactionType;
}

const transactions: BankTransaction[] = [
    { date: "2026-03-20", bank: "BOC", description: "Latex Sale Payment", lastAmount: 362400, amount: 21800, newAmount: 384200, type: "Credit" },
    { date: "2026-03-18", bank: "Seylan", description: "Fertilizer Supplier", lastAmount: 298200, amount: 16800, newAmount: 281400, type: "Debit" },
    { date: "2026-03-16", bank: "Peoples", description: "Labour Payroll", lastAmount: 198200, amount: 21500, newAmount: 176700, type: "Debit" },
    { date: "2026-03-14", bank: "BOC", description: "Rubber Solid Sale", lastAmount: 344600, amount: 17800, newAmount: 362400, type: "Credit" },
    { date: "2026-03-12", bank: "Seylan", description: "Equipment Purchase", lastAmount: 312400, amount: 14200, newAmount: 298200, type: "Debit" },
    { date: "2026-03-10", bank: "Peoples", description: "Grant Deposit", lastAmount: 168400, amount: 29800, newAmount: 198200, type: "Credit" },
    { date: "2026-03-08", bank: "BOC", description: "Maintenance Costs", lastAmount: 351200, amount: 6600, newAmount: 344600, type: "Debit" },
    { date: "2026-03-05", bank: "Seylan", description: "Ammonia Sale", lastAmount: 294600, amount: 17800, newAmount: 312400, type: "Credit" },
];

export function BankTransactionsTable() {
    const [selectedBank, setSelectedBank] = useState<string>("all");
    const [selectedType, setSelectedType] = useState<string>("all");

    function handleBankChange(value: string | null) { setSelectedBank(value ?? "all"); }
    function handleTypeChange(value: string | null) { setSelectedType(value ?? "all"); }

    const filtered = transactions.filter((t) => {
        const bankMatch = selectedBank === "all" || t.bank === selectedBank;
        const typeMatch = selectedType === "all" || t.type === selectedType;
        return bankMatch && typeMatch;
    });

    return (
        <Card className="shadow-sm gap-0">
            <div className="p-6 pb-4 flex items-center justify-between gap-4 flex-wrap">
                <CardTitle className="text-base font-semibold">Bank Transactions</CardTitle>
                <div className="flex items-center gap-3">
                    <Select value={selectedBank} onValueChange={handleBankChange}>
                        <SelectTrigger className="w-36 h-8 text-xs">
                            <SelectValue placeholder="Select Bank" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Banks</SelectItem>
                            <SelectItem value="BOC">BOC</SelectItem>
                            <SelectItem value="Seylan">Seylan</SelectItem>
                            <SelectItem value="Peoples">Peoples</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={selectedType} onValueChange={handleTypeChange}>
                        <SelectTrigger className="w-32 h-8 text-xs">
                            <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="Credit">Credit</SelectItem>
                            <SelectItem value="Debit">Debit</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <Table>
                <TableHeader>
                    <TableRow className="dark:border-gray-700/40">
                        <TableHead className="text-xs">Date</TableHead>
                        <TableHead className="text-xs">Bank</TableHead>
                        <TableHead className="text-xs">Description</TableHead>
                        <TableHead className="text-xs text-right">Last Amount</TableHead>
                        <TableHead className="text-xs text-right">Amount</TableHead>
                        <TableHead className="text-xs text-right">New Amount</TableHead>
                        <TableHead className="text-xs text-center">Type</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filtered.map((t, i) => (
                        <TableRow key={i} className="dark:border-gray-700/40">
                            <TableCell className="text-sm text-gray-500 dark:text-gray-400">{t.date}</TableCell>
                            <TableCell className="text-sm font-medium text-gray-800 dark:text-gray-200">{t.bank}</TableCell>
                            <TableCell className="text-sm text-gray-700 dark:text-gray-300">{t.description}</TableCell>
                            <TableCell className="text-sm text-right text-gray-500 dark:text-gray-400">LKR {t.lastAmount.toLocaleString()}</TableCell>
                            <TableCell className="text-sm text-right font-medium text-gray-800 dark:text-gray-200">LKR {t.amount.toLocaleString()}</TableCell>
                            <TableCell className="text-sm text-right text-gray-700 dark:text-gray-300">LKR {t.newAmount.toLocaleString()}</TableCell>
                            <TableCell className="text-center">
                                {t.type === "Credit" ? (
                                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-medium">Credit</Badge>
                                ) : (
                                    <Badge className="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-xs font-medium">Debit</Badge>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
}
