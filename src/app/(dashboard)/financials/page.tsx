"use client";

import { Download, Plus, Filter, MoreHorizontal } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";

export default function FinancialsPage() {
    const chartData = [
        { name: '01 May', uv: 2.1 },
        { name: '05 May', uv: 2.2 },
        { name: '10 May', uv: 2.15 },
        { name: '15 May', uv: 2.3 },
        { name: '20 May', uv: 2.4 },
        { name: '25 May', uv: 2.35 },
        { name: '30 May', uv: 2.5 },
    ];

    const transactions = [
        { id: 'TX-9021', date: '2024-05-28', desc: 'Bulk Latex Sale - Grade A', category: 'Sales', type: 'income', amount: '+$12,450.00', status: 'completed' },
        { id: 'TX-9022', date: '2024-05-27', desc: 'Weekly Tapping Wages - Sector B', category: 'Labor', type: 'expense', amount: '-$3,200.00', status: 'completed' },
        { id: 'TX-9023', date: '2024-05-26', desc: 'Ammonia Supply (500L)', category: 'Chemicals', type: 'expense', amount: '-$850.50', status: 'completed' },
        { id: 'TX-9024', date: '2024-05-25', desc: 'Truck Engine Refurbishment', category: 'Maintenance', type: 'expense', amount: '-$1,540.00', status: 'pending' },
        { id: 'TX-9025', date: '2024-05-24', desc: 'Rubber Scrap Sale', category: 'Sales', type: 'income', amount: '+$2,100.25', status: 'completed' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Financial Tracking</h1>
                    <p className="text-sm text-gray-500 mt-1">Real-time overview of rubber plantation revenue and expenditures.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button variant="outline" className="flex-1 sm:flex-none gap-2 text-gray-700 h-9">
                        <Download className="w-4 h-4" /> Export Ledger
                    </Button>
                    <Button className="flex-1 sm:flex-none gap-2 bg-brand-500 hover:bg-brand-600 h-9 shadow-sm">
                        <Plus className="w-4 h-4" /> Add Transaction
                    </Button>
                </div>
            </div>

            {/* Top Row: Chart & Expenses */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart */}
                <Card className="lg:col-span-2 shadow-sm gap-0 p-6">
                    <div className="flex items-start justify-between mb-8">
                        <div>
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-gray-400"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                                Sales & Price History
                            </CardTitle>
                            <CardDescription className="mt-1 max-w-[200px]">Rubber Grade RSS1 Market Price Trends (USD/kg)</CardDescription>
                        </div>
                        <div className="flex gap-6">
                            <div>
                                <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Total Revenue</span>
                                <p className="text-2xl font-bold text-gray-900">$142,500 <span className="text-xs font-semibold text-brand-600">↗ +12.4%</span></p>
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Avg Price</span>
                                <p className="text-2xl font-bold text-gray-900">$2.34 <span className="text-xs font-semibold text-brand-600">↗ +4.2%</span></p>
                            </div>
                        </div>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                                <YAxis dataKey="uv" domain={[2, 6]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                                <RechartsTooltip />
                                <Area type="monotone" dataKey="uv" stroke="#22c55e" strokeWidth={2} fill="transparent" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Expense Distribution Block */}
                <Card className="shadow-sm gap-0 p-6 flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-red-500"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                                Expense Distribution
                            </CardTitle>
                            <CardDescription className="mt-1 max-w-[200px]">Monthly Expenditure by Functional Category</CardDescription>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Total Expenses</span>
                            <p className="text-xl font-bold text-gray-900">$91,700 <span className="text-xs font-semibold text-red-500 inline-block">↘ +2.1%</span></p>
                        </div>
                    </div>

                    {/* Treemap mock using grid */}
                    <div className="flex-1 mt-4 grid grid-cols-3 grid-rows-3 gap-1 rounded-xl overflow-hidden text-white font-bold text-sm">
                        <div className="col-span-2 row-span-3 bg-black p-4 flex flex-col">
                            <span>Labor</span>
                            <span className="text-xs opacity-70 mt-1">$45.0k</span>
                        </div>
                        <div className="col-span-1 row-span-1 bg-black p-3 flex flex-col justify-end border-l border-b border-gray-800">
                            <span className="text-xs">Chemicals</span>
                            <span className="text-[10px] opacity-70">$22.0k</span>
                        </div>
                        <div className="col-span-1 row-span-1 bg-black p-3 flex flex-col justify-end border-l border-b border-gray-800">
                            <span className="text-xs">Maintenance</span>
                            <span className="text-[10px] opacity-70">$12.0k</span>
                        </div>
                        <div className="col-span-1 row-span-1 bg-black p-3 flex flex-col justify-end border-l border-gray-800">
                            <span className="text-xs">Logistics</span>
                            <span className="text-[10px] opacity-70">$8.5k</span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Transaction Ledger */}
            <Card className="shadow-sm gap-0 overflow-hidden p-0">
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <h2 className="text-base font-semibold leading-6 text-gray-900">Transaction Ledger</h2>
                        <p className="text-sm text-gray-500">Comprehensive log of all financial movements for May 2024</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-100">
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
                    <TableHeader className="bg-gray-50/50">
                        <TableRow className="border-gray-100">
                            <TableHead className="px-6 py-4 text-gray-500 font-semibold">TX ID</TableHead>
                            <TableHead className="px-6 py-4 text-gray-500 font-semibold">Date</TableHead>
                            <TableHead className="px-6 py-4 text-gray-500 font-semibold">Description</TableHead>
                            <TableHead className="px-6 py-4 text-gray-500 font-semibold">Category</TableHead>
                            <TableHead className="px-6 py-4 text-gray-500 font-semibold">Type</TableHead>
                            <TableHead className="px-6 py-4 text-gray-500 font-semibold">Amount</TableHead>
                            <TableHead className="px-6 py-4 text-gray-500 font-semibold">Status</TableHead>
                            <TableHead className="px-6 py-4 text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((tx, idx) => (
                            <TableRow key={idx} className="border-gray-50 hover:bg-gray-50/50">
                                <TableCell className="px-6 py-4 font-medium text-gray-900">{tx.id}</TableCell>
                                <TableCell className="px-6 py-4 text-gray-500">{tx.date}</TableCell>
                                <TableCell className="px-6 py-4 font-medium text-gray-900">{tx.desc}</TableCell>
                                <TableCell className="px-6 py-4 text-gray-500">{tx.category}</TableCell>
                                <TableCell className="px-6 py-4">
                                    <Badge variant="outline" className={`text-[10px] font-bold uppercase border-transparent ${tx.type === 'income' ? 'bg-gray-100 text-gray-600' : 'bg-red-50 text-red-600'}`}>
                                        {tx.type}
                                    </Badge>
                                </TableCell>
                                <TableCell className="px-6 py-4 font-bold text-gray-900">
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
                <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <span>Showing 5 of 142 transactions this month</span>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-900 h-7 text-xs">Previous</Button>
                        <Button variant="outline" size="sm" className="h-7 text-xs shadow-sm">Next Page</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
