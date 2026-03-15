"use client";

import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";

const recentInjections = [
    { date: 'May 12, 2024', type: 'Equity', amount: '$45,000' },
    { date: 'May 10, 2024', type: 'Cash', amount: '$12,000' },
    { date: 'May 08, 2024', type: 'Fixed Income', amount: '$8,500' },
    { date: 'May 05, 2024', type: 'Real Estate', amount: '$150,000' },
    { date: 'May 01, 2024', type: 'Commodities', amount: '$5,000' },
];

export function RecentInjectionsTable() {
    return (
        <Card className="shadow-sm gap-0 p-6">
            <CardTitle className="text-base font-semibold">Recent Injections</CardTitle>
            <CardDescription className="mt-1 mb-6">Latest assets added to the liquidity pool</CardDescription>

            <Table>
                <TableHeader>
                    <TableRow className="border-gray-100 dark:border-gray-700/40">
                        <TableHead className="pb-3 pr-4 text-xs font-semibold text-gray-500 dark:text-gray-400">Transaction<br />Date</TableHead>
                        <TableHead className="pb-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400">Asset Type</TableHead>
                        <TableHead className="pb-3 pl-4 text-xs font-semibold text-gray-500 dark:text-gray-400 text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recentInjections.map((inj, idx) => (
                        <TableRow key={idx} className="border-gray-50 dark:border-gray-700/30">
                            <TableCell className="py-4 pr-4 text-xs text-gray-500 dark:text-gray-400">{inj.date}</TableCell>
                            <TableCell className="py-4 px-4 font-medium text-gray-900 dark:text-gray-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-brand-500"></div>
                                    {inj.type}
                                </div>
                            </TableCell>
                            <TableCell className="py-4 pl-4 text-right font-bold text-gray-900 dark:text-gray-100">{inj.amount}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
}
