"use client";

import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

type CCType = "Credit" | "Debit";
type CardName = "Sampath" | "Peoples";

interface CreditCardTransaction {
    date: string;
    card: CardName;
    description: string;
    amount: number;
    type: CCType;
}

const transactions: CreditCardTransaction[] = [
    { date: "2026-03-20", card: "Sampath", description: "Online Payment Received", amount: 12400, type: "Credit" },
    { date: "2026-03-18", card: "Peoples", description: "Monthly Subscription", amount: 3800, type: "Debit" },
    { date: "2026-03-16", card: "Sampath", description: "Hardware Purchase", amount: 18600, type: "Debit" },
    { date: "2026-03-14", card: "Peoples", description: "Payment Credited", amount: 8200, type: "Credit" },
    { date: "2026-03-12", card: "Sampath", description: "Fuel & Transport", amount: 6400, type: "Debit" },
    { date: "2026-03-10", card: "Peoples", description: "Insurance Premium", amount: 14200, type: "Debit" },
    { date: "2026-03-08", card: "Sampath", description: "Refund Processed", amount: 4800, type: "Credit" },
    { date: "2026-03-05", card: "Peoples", description: "Utility Bill", amount: 9600, type: "Debit" },
];

export function CreditCardTable() {
    const [selectedCard, setSelectedCard] = useState<string>("all");
    const [fromDate, setFromDate] = useState<string>("");
    const [toDate, setToDate] = useState<string>("");

    function handleCardChange(value: string | null) { setSelectedCard(value ?? "all"); }

    const filtered = transactions.filter((t) => {
        const cardMatch = selectedCard === "all" || t.card === selectedCard;
        const fromMatch = !fromDate || t.date >= fromDate;
        const toMatch = !toDate || t.date <= toDate;
        return cardMatch && fromMatch && toMatch;
    });

    return (
        <Card className="shadow-sm gap-0">
            <div className="p-6 pb-4 space-y-4">
                <CardTitle className="text-base font-semibold">Credit Card Transactions</CardTitle>
                <div className="flex items-end gap-4 flex-wrap">
                    <div className="space-y-1.5">
                        <Label className="text-xs">Credit Card</Label>
                        <Select value={selectedCard} onValueChange={handleCardChange}>
                            <SelectTrigger className="w-36 h-8 text-xs">
                                <SelectValue placeholder="All Cards" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Cards</SelectItem>
                                <SelectItem value="Sampath">Sampath</SelectItem>
                                <SelectItem value="Peoples">Peoples</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">From</Label>
                        <Input
                            type="date"
                            className="h-8 text-xs w-36"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">To</Label>
                        <Input
                            type="date"
                            className="h-8 text-xs w-36"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <Table>
                <TableHeader>
                    <TableRow className="dark:border-gray-700/40">
                        <TableHead className="text-xs">Date</TableHead>
                        <TableHead className="text-xs">Card</TableHead>
                        <TableHead className="text-xs">Description</TableHead>
                        <TableHead className="text-xs text-right">Amount</TableHead>
                        <TableHead className="text-xs text-center">Type</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filtered.map((t, i) => (
                        <TableRow key={i} className="dark:border-gray-700/40">
                            <TableCell className="text-sm text-gray-500 dark:text-gray-400">{t.date}</TableCell>
                            <TableCell className="text-sm font-medium text-gray-800 dark:text-gray-200">{t.card}</TableCell>
                            <TableCell className="text-sm text-gray-700 dark:text-gray-300">{t.description}</TableCell>
                            <TableCell className="text-sm text-right font-medium text-gray-800 dark:text-gray-200">LKR {t.amount.toLocaleString()}</TableCell>
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
