"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import {
    Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import {
    Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, Loader2 } from "lucide-react";
import { useSalaryTable } from "@/features/employees/hooks/use-salary-table";
import { getEmployeesSummary } from "@/features/employees/services/employee-service";

export function SalaryTable() {
    const now = new Date();
    const { data: payroll, isLoading } = useSalaryTable(now.getMonth() + 1, now.getFullYear());
    const { data: employees } = useQuery({ queryKey: ["employees", "summary"], queryFn: getEmployeesSummary });

    const positionByEmployeeId = useMemo(() => {
        const map = new Map<string, string>();
        employees?.forEach((e) => map.set(e.employeeId, e.position ?? "-"));
        return map;
    }, [employees]);

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
                            <TableHead className="px-6 py-4 text-gray-500 dark:text-gray-400 font-semibold text-right">Latex Tap</TableHead>
                            <TableHead className="px-6 py-4 text-gray-500 dark:text-gray-400 font-semibold text-right">Labour</TableHead>
                            <TableHead className="px-6 py-4 text-gray-500 dark:text-gray-400 font-semibold text-right">Work Days</TableHead>
                            <TableHead className="px-6 py-4 text-gray-500 dark:text-gray-400 font-semibold text-right">Net Salary</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && (
                            <TableRow>
                                <TableCell colSpan={6} className="px-6 py-10 text-center text-gray-400">
                                    <Loader2 className="w-5 h-5 animate-spin inline-block" />
                                </TableCell>
                            </TableRow>
                        )}
                        {!isLoading && payroll?.entries.map((emp) => (
                            <TableRow key={emp.employeeId} className="border-gray-50 dark:border-gray-700/30 hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                                <TableCell className="px-6 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{emp.employeeName}</p>
                                            <p className="text-xs text-gray-400">{emp.employeeId.slice(0, 8)}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="px-6 py-3 text-gray-600 dark:text-gray-300 text-sm">
                                    {positionByEmployeeId.get(emp.employeeId) ?? "-"}
                                </TableCell>
                                <TableCell className="px-6 py-3 text-right text-gray-700 dark:text-gray-300 text-sm">
                                    {emp.latexTap > 0 ? `LKR ${emp.latexTap.toLocaleString()}` : "—"}
                                </TableCell>
                                <TableCell className="px-6 py-3 text-right text-gray-700 dark:text-gray-300 text-sm">
                                    {emp.manualLabor > 0 ? `LKR ${emp.manualLabor.toLocaleString()}` : "—"}
                                </TableCell>
                                <TableCell className="px-6 py-3 text-right text-gray-700 dark:text-gray-300 text-sm">{emp.workDays}</TableCell>
                                <TableCell className="px-6 py-3 text-right">
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <span className="inline-flex items-center gap-1 font-semibold text-gray-900 dark:text-gray-100 text-sm cursor-default">
                                                LKR {emp.net.toLocaleString()}
                                                <Info className="w-3 h-3 text-gray-400" />
                                            </span>
                                        </TooltipTrigger>
                                        <TooltipContent side="top" className="text-xs space-y-1">
                                            <p>Base Salary: LKR {emp.salary.toLocaleString()}</p>
                                            <p>Latex Tap: LKR {emp.latexTap.toLocaleString()}</p>
                                            <p>Labour: LKR {emp.manualLabor.toLocaleString()}</p>
                                            <p>Advances: -LKR {emp.advances.toLocaleString()}</p>
                                            <p>Loan Deductions: -LKR {emp.loanDeductions.toLocaleString()}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </TooltipProvider>
    );
}
