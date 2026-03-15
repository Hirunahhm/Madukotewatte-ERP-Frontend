"use client";

import { Filter, MoreHorizontal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";

const transactions = [
    { id: 'TX-9021', date: '2024-05-28', desc: 'Bulk Latex Sale - Grade A', category: 'Sales', type: 'income', amount: '+$12,450.00', status: 'completed' },
    { id: 'TX-9022', date: '2024-05-27', desc: 'Weekly Tapping Wages - Sector B', category: 'Labor', type: 'expense', amount: '-$3,200.00', status: 'completed' },
    { id: 'TX-9023', date: '2024-05-26', desc: 'Ammonia Supply (500L)', category: 'Chemicals', type: 'expense', amount: '-$850.50', status: 'completed' },
    { id: 'TX-9024', date: '2024-05-25', desc: 'Truck Engine Refurbishment', category: 'Maintenance', type: 'expense', amount: '-$1,540.00', status: 'pending' },
    { id: 'TX-9025', date: '2024-05-24', desc: 'Rubber Scrap Sale', category: 'Sales', type: 'income', amount: '+$2,100.25', status: 'completed' },
];

export function TransactionLedger() {
    return (
        <Card className="shadow-sm gap-0 overflow-hidden p-0">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h2 className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100">Transaction Ledger</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Comprehensive log of all financial movements for May 2024</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-gray-50 dark:bg-gray-800 p-1 rounded-lg border border-gray-100 dark:border-gray-700">
                        <Button size="sm" className="bg-brand-500 hover:bg-brand-600 h-7 text-xs shadow-sm">All</Button>
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-gray-500 hover:text-gray-900">Income</Button>
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-gray-500 hover:text-gray-900">Expenses</Button>
                    </div>
                    <div className="relative w-64 hidden md:block">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                        <Input type="text" placeholder="Filter transactions..." className="pl-9 border-gray-200 focus-visible:ring-1 focus-visible:ring-brand-500" />
                    </div>
                </div>
            </div>

            <Table>
                <TableHeader className="bg-gray-50/50 dark:bg-gray-800/50">
                    <TableRow className="border-gray-100 dark:border-gray-700/40">
                        <TableHead className="px-6 py-4 text-gray-500 dark:text-gray-400 font-semibold">TX ID</TableHead>
                        <TableHead className="px-6 py-4 text-gray-500 dark:text-gray-400 font-semibold">Date</TableHead>
                        <TableHead className="px-6 py-4 text-gray-500 dark:text-gray-400 font-semibold">Description</TableHead>
                        <TableHead className="px-6 py-4 text-gray-500 dark:text-gray-400 font-semibold">Category</TableHead>
                        <TableHead className="px-6 py-4 text-gray-500 dark:text-gray-400 font-semibold">Type</TableHead>
                        <TableHead className="px-6 py-4 text-gray-500 dark:text-gray-400 font-semibold">Amount</TableHead>
                        <TableHead className="px-6 py-4 text-gray-500 dark:text-gray-400 font-semibold">Status</TableHead>
                        <TableHead className="px-6 py-4 text-right"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map((tx, idx) => (
                        <TableRow key={idx} className="border-gray-50 dark:border-gray-700/30 hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                            <TableCell className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{tx.id}</TableCell>
                            <TableCell className="px-6 py-4 text-gray-500 dark:text-gray-400">{tx.date}</TableCell>
                            <TableCell className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{tx.desc}</TableCell>
                            <TableCell className="px-6 py-4 text-gray-500 dark:text-gray-400">{tx.category}</TableCell>
                            <TableCell className="px-6 py-4">
                                <Badge variant="outline" className={`text-[10px] font-bold uppercase border-transparent ${tx.type === 'income' ? 'bg-gray-100 text-gray-600' : 'bg-red-50 text-red-600'}`}>
                                    {tx.type}
                                </Badge>
                            </TableCell>
                            <TableCell className="px-6 py-4 font-bold text-gray-900 dark:text-gray-100">
                                {tx.amount}
                            </TableCell>
                            <TableCell className="px-6 py-4">
                                <Badge variant="outline" className={`text-[10px] font-bold uppercase ${tx.status === 'completed' ? 'bg-gray-100 text-gray-500 border-gray-200' : 'bg-gray-100 text-gray-500 border-transparent'}`}>
                                    {tx.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="px-6 py-4 text-right">
                                <button className="text-gray-400 hover:text-gray-600 p-1">
                                    <MoreHorizontal className="w-4 h-4" />
                                </button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="p-4 border-t border-gray-100 dark:border-gray-700/40 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Showing 5 of 142 transactions this month</span>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-900 h-7 text-xs">Previous</Button>
                    <Button variant="outline" size="sm" className="h-7 text-xs shadow-sm">Next Page</Button>
                </div>
            </div>
        </Card>
    );
}
