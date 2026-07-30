"use client";

import { useEffect, useState } from "react";
import { Search, Plus, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { AttendanceDialog } from "./attendance-dialog";
import { AddEmployeeDialog } from "./add-employee-dialog";
import { EmployeeDetailDialog } from "./employee-detail-dialog";
import { useEmployees } from "@/features/employees/hooks/use-employees";
import { getAttendanceByRange } from "@/features/employees/services/attendance-service";
import { useAuthStore } from "@/stores/auth-store";
import { ABSENCE_REASONS } from "@/features/employees/types/attendance.types";

const PAGE_SIZE = 8;

function todayRange() {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 0);
    return { from: start.toISOString().slice(0, 19), to: end.toISOString().slice(0, 19) };
}

function reasonLabel(noWork: string) {
    return ABSENCE_REASONS.find((r) => r.value === noWork)?.label ?? noWork;
}

export function EmployeeTable() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<{ employeeId: string; name: string } | null>(null);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [detailEmployeeId, setDetailEmployeeId] = useState<string | null>(null);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);

    const role = useAuthStore((s) => s.role);
    const isAdmin = role === "ROLE_ADMIN";

    useEffect(() => {
        const timeout = setTimeout(() => {
            setSearch(searchInput);
            setPage(0);
        }, 300);
        return () => clearTimeout(timeout);
    }, [searchInput]);

    const { data, isLoading } = useEmployees({ name: search || undefined, page, size: PAGE_SIZE });

    const { from, to } = todayRange();
    const { data: todayAttendance } = useQuery({
        queryKey: ["attendance", "range", from, to],
        queryFn: () => getAttendanceByRange(from, to),
    });

    function openAttendance(emp: { employeeId: string; name: string }) {
        setSelectedEmployee(emp);
        setDialogOpen(true);
    }

    const employees = data?.content ?? [];

    return (
        <>
            <Card className="shadow-sm gap-0 overflow-hidden p-0">
                <div className="p-4 border-b border-gray-100 dark:border-gray-700/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                        <Input
                            type="text"
                            placeholder="Search staff by name..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="pl-9 bg-gray-50 border-0 focus-visible:ring-1 focus-visible:ring-brand-500"
                        />
                    </div>
                    {isAdmin && (
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <Button
                                className="flex-1 sm:flex-none gap-2 bg-brand-500 hover:bg-brand-600 h-9 shadow-sm"
                                onClick={() => setAddDialogOpen(true)}
                            >
                                <Plus className="w-4 h-4" /> Add Employee
                            </Button>
                        </div>
                    )}
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
                        {isLoading && (
                            <TableRow>
                                <TableCell colSpan={6} className="px-6 py-10 text-center text-gray-400">
                                    <Loader2 className="w-5 h-5 animate-spin inline-block" />
                                </TableCell>
                            </TableRow>
                        )}
                        {!isLoading && employees.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="px-6 py-10 text-center text-gray-400">
                                    No employees found.
                                </TableCell>
                            </TableRow>
                        )}
                        {employees.map((emp) => {
                            const record = todayAttendance?.find((a) => a.employeeId === emp.employeeId);
                            const status = !record ? "Not Marked" : record.noWork === "none" ? "Present" : reasonLabel(record.noWork);
                            const lastActivity = record ? new Date(record.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "-";
                            const trees = record?.noOfTrees ?? 0;

                            return (
                                <TableRow key={emp.employeeId} className="border-gray-50 dark:border-gray-700/30 hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                                    <TableCell className="px-6 py-3">
                                        <button
                                            className="flex items-center gap-3 text-left group"
                                            onClick={() => setDetailEmployeeId(emp.employeeId)}
                                        >
                                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0"></div>
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-brand-600 group-hover:underline underline-offset-2 transition-colors">{emp.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{emp.employeeId.slice(0, 8)}</p>
                                            </div>
                                        </button>
                                    </TableCell>
                                    <TableCell className="px-6 py-3 text-gray-600 dark:text-gray-300">{emp.position ?? "-"}</TableCell>
                                    <TableCell className="px-6 py-3">
                                        <Badge variant="outline" className={cn(
                                            "text-[10px] font-bold tracking-wide uppercase border-transparent",
                                            status === "Present" ? "bg-emerald-50 text-brand-600" :
                                                status === "Not Marked" ? "bg-gray-100 text-gray-600" : "bg-red-50 text-red-600"
                                        )}>
                                            {status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-6 py-3 text-gray-500 dark:text-gray-400 text-xs font-medium">{lastActivity}</TableCell>
                                    <TableCell className="px-6 py-3">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-gray-900 dark:text-gray-100 w-8">{trees}</span>
                                            {trees > 0 && (
                                                <div className="w-16 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                    <div className="h-full bg-brand-500" style={{ width: `${Math.min((trees / 150) * 100, 100)}%` }}></div>
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-3 text-right">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => openAttendance({ employeeId: emp.employeeId, name: emp.name })}
                                        >
                                            Mark Attendance
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
                <div className="p-4 border-t border-gray-100 dark:border-gray-700/40 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>
                        {data ? `Showing ${employees.length} of ${data.totalElements} registered employees` : ""}
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={page === 0}
                            onClick={() => setPage((p) => Math.max(0, p - 1))}
                            className="w-6 h-6 rounded flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 disabled:opacity-40"
                        >
                            <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-medium">Page {page + 1} of {Math.max(data?.totalPages ?? 1, 1)}</span>
                        <button
                            disabled={data?.last ?? true}
                            onClick={() => setPage((p) => p + 1)}
                            className="w-6 h-6 rounded flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 disabled:opacity-40"
                        >
                            <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </Card>

            <AttendanceDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                employee={selectedEmployee}
            />
            {isAdmin && (
                <AddEmployeeDialog
                    open={addDialogOpen}
                    onOpenChange={setAddDialogOpen}
                />
            )}
            <EmployeeDetailDialog
                open={!!detailEmployeeId}
                onOpenChange={(o) => { if (!o) setDetailEmployeeId(null); }}
                employeeId={detailEmployeeId}
            />
        </>
    );
}
