"use client";

import { Search, Plus, Download, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";

const employees = [
    { id: 'EMP001', name: 'Arjun Das', role: 'Lead Tapper', status: 'Present', lastActivity: '06:45 AM', trees: 142 },
    { id: 'EMP002', name: 'Siti Aminah', role: 'Senior Tapper', status: 'Present', lastActivity: '07:12 AM', trees: 128 },
    { id: 'EMP003', name: 'Rajesh Kumar', role: 'Tapper', status: 'Present', lastActivity: '07:30 AM', trees: 115 },
    { id: 'EMP004', name: 'Linh Pham', role: 'Junior Tapper', status: 'Absent', lastActivity: '-', trees: 0 },
    { id: 'EMP005', name: 'Karthik Raja', role: 'General Labour', status: 'Present', lastActivity: '08:00 AM', trees: 45 },
    { id: 'EMP006', name: 'Wong Kar Wai', role: 'Tapper', status: 'On Leave', lastActivity: '-', trees: 0 },
    { id: 'EMP007', name: 'Elena Gilbert', role: 'Tapper', status: 'Present', lastActivity: '06:50 AM', trees: 130 },
    { id: 'EMP008', name: 'Marcus Tan', role: 'Assistant Manager', status: 'Present', lastActivity: '06:30 AM', trees: 20 },
];

export function EmployeeTable() {
    return (
        <Card className="shadow-sm gap-0 overflow-hidden p-0">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                    <Input
                        type="text"
                        placeholder="Search staff by name or ID..."
                        className="pl-9 bg-gray-50 border-0 focus-visible:ring-1 focus-visible:ring-brand-500"
                    />
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button variant="outline" className="flex-1 sm:flex-none gap-2 text-gray-700 h-9">
                        <Download className="w-4 h-4" /> Bulk Attendance
                    </Button>
                    <Button className="flex-1 sm:flex-none gap-2 bg-brand-500 hover:bg-brand-600 h-9 shadow-sm">
                        <Plus className="w-4 h-4" /> Add Employee
                    </Button>
                </div>
            </div>
            <Table>
                <TableHeader className="bg-gray-50/50 dark:bg-gray-800/50">
                    <TableRow className="border-gray-100 dark:border-gray-700/40">
                        <TableHead className="px-6 py-4 text-gray-500 dark:text-gray-400 font-semibold">Employee Name</TableHead>
                        <TableHead className="px-6 py-4 text-gray-500 dark:text-gray-400 font-semibold">Role</TableHead>
                        <TableHead className="px-6 py-4 text-gray-500 dark:text-gray-400 font-semibold">Status</TableHead>
                        <TableHead className="px-6 py-4 text-gray-500 dark:text-gray-400 font-semibold">Last Activity</TableHead>
                        <TableHead className="px-6 py-4 text-gray-500 dark:text-gray-400 font-semibold">Trees (Today)</TableHead>
                        <TableHead className="px-6 py-4 text-right text-gray-500 font-semibold">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {employees.map((emp, idx) => (
                        <TableRow key={idx} className="border-gray-50 dark:border-gray-700/30 hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                            <TableCell className="px-6 py-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-gray-100">{emp.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{emp.id}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="px-6 py-3 text-gray-600 dark:text-gray-300">{emp.role}</TableCell>
                            <TableCell className="px-6 py-3">
                                <Badge variant="outline" className={cn(
                                    "text-[10px] font-bold tracking-wide uppercase border-transparent",
                                    emp.status === 'Present' ? "bg-emerald-50 text-brand-600" :
                                        emp.status === 'Absent' ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-600"
                                )}>
                                    {emp.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="px-6 py-3 text-gray-500 dark:text-gray-400 text-xs font-medium">{emp.lastActivity}</TableCell>
                            <TableCell className="px-6 py-3">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-gray-900 dark:text-gray-100 w-8">{emp.trees}</span>
                                    {emp.trees > 0 && (
                                        <div className="w-16 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-brand-500" style={{ width: `${(emp.trees / 150) * 100}%` }}></div>
                                        </div>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className="px-6 py-3 text-right">
                                <button className="text-gray-400 hover:text-gray-600 p-1">
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="p-4 border-t border-gray-100 dark:border-gray-700/40 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Showing 8 of 128 registered employees</span>
                <div className="flex items-center gap-2">
                    <span>Download Attendance Log (CSV)</span>
                    <div className="flex gap-1 ml-4">
                        <button className="w-6 h-6 rounded flex items-center justify-center bg-brand-500 text-white font-bold">1</button>
                        <button className="w-6 h-6 rounded flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 font-medium dark:text-gray-200">2</button>
                        <button className="w-6 h-6 rounded flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 font-medium dark:text-gray-200">3</button>
                    </div>
                </div>
            </div>
        </Card>
    );
}
