"use client";

import { Card } from "@/components/ui/card";
import {
    Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import {
    Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

const salaryData = [
    { id: "EMP001", name: "Arjun Das", role: "Lead Tapper", latexSalary: 24500, labourSalary: 8200, toBePaid: true },
    { id: "EMP002", name: "Siti Aminah", role: "Senior Tapper", latexSalary: 21000, labourSalary: 6500, toBePaid: true },
    { id: "EMP003", name: "Rajesh Kumar", role: "Tapper", latexSalary: 18500, labourSalary: 5800, toBePaid: false },
    { id: "EMP004", name: "Linh Pham", role: "Junior Tapper", latexSalary: 14200, labourSalary: 3100, toBePaid: true },
    { id: "EMP005", name: "Karthik Raja", role: "General Labour", latexSalary: 0, labourSalary: 12400, toBePaid: false },
    { id: "EMP006", name: "Wong Kar Wai", role: "Tapper", latexSalary: 17800, labourSalary: 4900, toBePaid: true },
    { id: "EMP007", name: "Elena Gilbert", role: "Tapper", latexSalary: 20200, labourSalary: 6100, toBePaid: false },
    { id: "EMP008", name: "Marcus Tan", role: "Assistant Manager", latexSalary: 38000, labourSalary: 0, toBePaid: true },
];

export function SalaryTable() {
    return (
        <TooltipProvider>
            <Card className="shadow-sm gap-0 overflow-hidden p-0">
                <div className="p-4 border-b border-gray-100 dark:border-gray-700/40">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Salary Breakdown</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Current period payroll for all registered employees</p>
                </div>
                <Table>
                    <TableHeader className="bg-gray-50/50 dark:bg-gray-800/50">
                        <TableRow className="border-gray-100 dark:border-gray-700/40">
                            <TableHead className="px-6 py-4 text-gray-500 dark:text-gray-400 font-semibold">Name</TableHead>
                            <TableHead className="px-6 py-4 text-gray-500 dark:text-gray-400 font-semibold">Role</TableHead>
                            <TableHead className="px-6 py-4 text-gray-500 dark:text-gray-400 font-semibold text-right">Latex Salary</TableHead>
                            <TableHead className="px-6 py-4 text-gray-500 dark:text-gray-400 font-semibold text-right">Labour Salary</TableHead>
                            <TableHead className="px-6 py-4 text-gray-500 dark:text-gray-400 font-semibold text-right">Total Salary</TableHead>
                            <TableHead className="px-6 py-4 text-gray-500 dark:text-gray-400 font-semibold text-right">To Be Paid</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {salaryData.map((emp) => {
                            const total = emp.latexSalary + emp.labourSalary;
                            return (
                                <TableRow key={emp.id} className="border-gray-50 dark:border-gray-700/30 hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                                    <TableCell className="px-6 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{emp.name}</p>
                                                <p className="text-xs text-gray-400">{emp.id}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-3 text-gray-600 dark:text-gray-300 text-sm">{emp.role}</TableCell>
                                    <TableCell className="px-6 py-3 text-right text-gray-700 dark:text-gray-300 text-sm">
                                        {emp.latexSalary > 0 ? `LKR ${emp.latexSalary.toLocaleString()}` : "—"}
                                    </TableCell>
                                    <TableCell className="px-6 py-3 text-right text-gray-700 dark:text-gray-300 text-sm">
                                        {emp.labourSalary > 0 ? `LKR ${emp.labourSalary.toLocaleString()}` : "—"}
                                    </TableCell>
                                    <TableCell className="px-6 py-3 text-right">
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <span className="inline-flex items-center gap-1 font-semibold text-gray-900 dark:text-gray-100 text-sm cursor-default">
                                                    LKR {total.toLocaleString()}
                                                    <Info className="w-3 h-3 text-gray-400" />
                                                </span>
                                            </TooltipTrigger>
                                            <TooltipContent side="top" className="text-xs space-y-1">
                                                <p>Latex Salary: LKR {emp.latexSalary.toLocaleString()}</p>
                                                <p>Labour Work Salary: LKR {emp.labourSalary.toLocaleString()}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell className="px-6 py-3 text-right">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                                            emp.toBePaid
                                                ? "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                                                : "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                                        }`}>
                                            {emp.toBePaid ? "Pending" : "Paid"}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Card>
        </TooltipProvider>
    );
}
