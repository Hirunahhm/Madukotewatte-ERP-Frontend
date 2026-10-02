"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { Pencil, X, Check, Loader2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useEmployeeAttendanceDetail } from "@/features/employees/hooks/use-employee-detail";
import { useUpdateEmployee } from "@/features/employees/hooks/use-employee-mutations";
import { ABSENCE_REASONS } from "@/features/employees/types/attendance.types";
import { POSITIONS } from "@/features/employees/utils/positions";
import { PayTypeFields, payFieldsError } from "./pay-type-fields";
import { PAY_TYPE_LABELS, type PayType } from "@/features/employees/types/employee.types";

function reasonLabel(noWork: string) {
    return ABSENCE_REASONS.find((r) => r.value === noWork)?.label ?? noWork;
}

function formatLkr(value: number) {
    return `LKR ${value.toLocaleString()}`;
}

function toIsoStart(date: string) {
    return `${date}T00:00:00`;
}

function toIsoEnd(date: string) {
    return `${date}T23:59:59`;
}

function StatCard({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
    return (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 bg-gray-50/40 dark:bg-gray-800/30">
            <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
            <p className={cn("text-lg font-semibold mt-1", accent ? "text-brand-600" : "text-gray-900 dark:text-gray-100")}>{value}</p>
        </div>
    );
}

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    employeeId: string | null;
}

export function EmployeeProfileDialog({ open, onOpenChange, employeeId }: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [name, setName] = useState("");
    const [position, setPosition] = useState("");
    const [salary, setSalary] = useState("");
    const [ratePerTree, setRatePerTree] = useState("");
    const [hourlyRate, setHourlyRate] = useState("");
    const [payType, setPayType] = useState<PayType>("FIXED_MONTHLY");
    const [joinedDate, setJoinedDate] = useState("");
    const [isActive, setIsActive] = useState(true);

    // Attendance filters
    const [attendancePage, setAttendancePage] = useState(0);
    const [attendanceFrom, setAttendanceFrom] = useState("");
    const [attendanceTo, setAttendanceTo] = useState("");
    const [attendanceStatus, setAttendanceStatus] = useState("all");

    const role = useAuthStore((s) => s.role);
    const isAdmin = role === "ROLE_ADMIN";

    const { employee, attendance, attendanceStats } = useEmployeeAttendanceDetail(
        employeeId,
        {
            page: attendancePage,
            from: attendanceFrom ? toIsoStart(attendanceFrom) : undefined,
            to: attendanceTo ? toIsoEnd(attendanceTo) : undefined,
            status: attendanceStatus !== "all" ? attendanceStatus : undefined,
        },
    );
    const updateEmployee = useUpdateEmployee();

    useEffect(() => {
        if (employee.data) {
            setName(employee.data.name);
            setPosition(employee.data.position ?? "");
            setSalary(String(employee.data.salary ?? ""));
            setRatePerTree(String(employee.data.ratePerTree ?? "0"));
            setHourlyRate(String(employee.data.hourlyRate ?? ""));
            setPayType(employee.data.payType);
            setJoinedDate(employee.data.joinedDate ?? "");
            setIsActive(employee.data.isActive);
        }
    }, [employee.data]);

    useEffect(() => {
        if (!open) {
            setIsEditing(false);
            setError(null);
            setAttendancePage(0);
            setAttendanceFrom("");
            setAttendanceTo("");
            setAttendanceStatus("all");
        }
    }, [open]);

    async function handleSave() {
        if (!employeeId) return;
        setError(null);
        if (!name.trim() || !joinedDate) {
            setError("Name and date of joining are required.");
            return;
        }
        const payError = payFieldsError({ payType, salary, ratePerTree, hourlyRate });
        if (payError) {
            setError(payError);
            return;
        }
        try {
            await updateEmployee.mutateAsync({
                id: employeeId,
                payload: {
                    name: name.trim(),
                    joinedDate,
                    payType,
                    salary: salary ? Number(salary) : undefined,
                    ratePerTree: ratePerTree ? Number(ratePerTree) : 0,
                    hourlyRate: hourlyRate ? Number(hourlyRate) : undefined,
                    position: position || undefined,
                    isActive,
                },
            });
            setIsEditing(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update employee.");
        }
    }

    function handleCancelEdit() {
        if (employee.data) {
            setName(employee.data.name);
            setPosition(employee.data.position ?? "");
            setSalary(String(employee.data.salary ?? ""));
            setRatePerTree(String(employee.data.ratePerTree ?? "0"));
            setHourlyRate(String(employee.data.hourlyRate ?? ""));
            setPayType(employee.data.payType);
            setJoinedDate(employee.data.joinedDate ?? "");
            setIsActive(employee.data.isActive);
        }
        setError(null);
        setIsEditing(false);
    }

    const attendanceFiltersActive = attendanceFrom || attendanceTo || attendanceStatus !== "all";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between pr-6">
                        <span>{employee.data?.name ?? "Employee Details"}</span>
                        {isAdmin && !isEditing && employee.data && (
                            <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setIsEditing(true)}>
                                <Pencil className="w-3.5 h-3.5" /> Edit
                            </Button>
                        )}
                    </DialogTitle>
                </DialogHeader>

                {employee.isLoading && (
                    <div className="py-10 flex justify-center text-gray-400">
                        <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                )}

                {employee.data && (
                    <div className="space-y-5">
                        {error && (
                            <div role="alert" className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/30 px-3 py-2 text-xs text-red-600 dark:text-red-400">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        {/* Info / Edit section */}
                        {isEditing ? (
                            <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3 bg-gray-50/60 dark:bg-gray-800/40">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label>Name</Label>
                                        <Input value={name} onChange={(e) => setName(e.target.value)} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label>Position</Label>
                                        <Select value={position} onValueChange={(v) => { if (v !== null) setPosition(v); }}>
                                            <SelectTrigger><SelectValue placeholder="Select position" /></SelectTrigger>
                                            <SelectContent>
                                                {POSITIONS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <PayTypeFields
                                        value={{ payType, salary, ratePerTree, hourlyRate }}
                                        onChange={(patch) => {
                                            if (patch.payType !== undefined) setPayType(patch.payType);
                                            if (patch.salary !== undefined) setSalary(patch.salary);
                                            if (patch.ratePerTree !== undefined) setRatePerTree(patch.ratePerTree);
                                            if (patch.hourlyRate !== undefined) setHourlyRate(patch.hourlyRate);
                                        }}
                                    />
                                    <div className="space-y-1.5">
                                        <Label>Date of Joining</Label>
                                        <Input type="date" value={joinedDate} onChange={(e) => setJoinedDate(e.target.value)} />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-1">
                                    <div className="flex items-center gap-2.5">
                                        <button
                                            onClick={() => setIsActive(!isActive)}
                                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${isActive ? "bg-brand-500" : "bg-gray-300 dark:bg-gray-600"}`}
                                        >
                                            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${isActive ? "translate-x-5" : "translate-x-1"}`} />
                                        </button>
                                        <span className="text-sm text-gray-600 dark:text-gray-300">Active Employee</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline" className="gap-1.5" onClick={handleCancelEdit} disabled={updateEmployee.isPending}>
                                            <X className="w-3.5 h-3.5" /> Cancel
                                        </Button>
                                        <Button size="sm" className="gap-1.5 bg-brand-500 hover:bg-brand-600" onClick={handleSave} disabled={updateEmployee.isPending}>
                                            {updateEmployee.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                                            Save Changes
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Position</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-0.5">{employee.data.position ?? "-"}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{PAY_TYPE_LABELS[employee.data.payType]}</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-0.5">
                                        {employee.data.payType === "PER_TREE" && (employee.data.ratePerTree ? `${formatLkr(employee.data.ratePerTree)} / tree` : "Not set")}
                                        {employee.data.payType === "HOURLY" && (employee.data.hourlyRate ? `${formatLkr(employee.data.hourlyRate)} / hour` : "Not set")}
                                        {employee.data.payType === "FIXED_MONTHLY" && (employee.data.salary != null ? `${formatLkr(employee.data.salary)} / month` : "-")}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Joined</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-0.5">{employee.data.joinedDate ?? "-"}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Status</p>
                                    <Badge variant="outline" className={cn(
                                        "text-[10px] font-bold uppercase border-transparent mt-1",
                                        employee.data.isActive ? "bg-emerald-50 text-brand-600" : "bg-gray-100 text-gray-500"
                                    )}>
                                        {employee.data.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                </div>
                            </div>
                        )}

                        {/* Attendance History */}
                        <div className="space-y-3">
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Attendance History</p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <StatCard label="Present Days" value={attendanceStats.data?.presentDays ?? "-"} accent />
                                <StatCard label="Absent Days" value={attendanceStats.data?.absentDays ?? "-"} />
                                <StatCard label="Attendance Rate" value={attendanceStats.data ? `${attendanceStats.data.attendanceRatePercent}%` : "-"} />
                                <StatCard label="Trees Tapped" value={attendanceStats.data?.totalTreesTapped ?? "-"} />
                            </div>

                            <div className="flex flex-wrap items-end gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs text-gray-500">From</Label>
                                    <Input type="date" className="h-8 text-xs w-36" value={attendanceFrom}
                                        onChange={(e) => { setAttendanceFrom(e.target.value); setAttendancePage(0); }} />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-gray-500">To</Label>
                                    <Input type="date" className="h-8 text-xs w-36" value={attendanceTo}
                                        onChange={(e) => { setAttendanceTo(e.target.value); setAttendancePage(0); }} />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-gray-500">Status</Label>
                                    <Select value={attendanceStatus} onValueChange={(v) => { if (v) { setAttendanceStatus(v); setAttendancePage(0); } }}>
                                        <SelectTrigger className="h-8 text-xs w-40"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All</SelectItem>
                                            <SelectItem value="none">Present</SelectItem>
                                            {ABSENCE_REASONS.map((r) => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                {attendanceFiltersActive && (
                                    <Button size="sm" variant="ghost" className="h-8 gap-1 text-xs text-gray-500"
                                        onClick={() => { setAttendanceFrom(""); setAttendanceTo(""); setAttendanceStatus("all"); setAttendancePage(0); }}>
                                        <X className="w-3 h-3" /> Clear
                                    </Button>
                                )}
                            </div>

                            <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-gray-50/50 dark:bg-gray-800/50">
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Trees Tapped</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {attendance.isLoading && (
                                            <TableRow><TableCell colSpan={3} className="text-center py-8 text-gray-400"><Loader2 className="w-5 h-5 animate-spin inline-block" /></TableCell></TableRow>
                                        )}
                                        {!attendance.isLoading && (attendance.data?.content.length ?? 0) === 0 && (
                                            <TableRow><TableCell colSpan={3} className="text-center py-8 text-gray-400">No attendance records match these filters.</TableCell></TableRow>
                                        )}
                                        {attendance.data?.content.map((rec) => (
                                            <TableRow key={rec.attendanceId}>
                                                <TableCell className="text-sm">{new Date(rec.timestamp).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={cn(
                                                        "text-[10px] font-bold uppercase border-transparent",
                                                        rec.noWork === "none" ? "bg-emerald-50 text-brand-600" : "bg-red-50 text-red-600"
                                                    )}>
                                                        {rec.noWork === "none" ? "Present" : reasonLabel(rec.noWork)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right text-sm font-medium">{rec.noOfTrees ?? 0}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                {attendance.data && attendance.data.totalPages > 1 && (
                                    <div className="flex items-center justify-end gap-2 p-2 border-t border-gray-100 dark:border-gray-700 text-xs">
                                        <button disabled={attendancePage === 0} onClick={() => setAttendancePage((p) => Math.max(0, p - 1))} className="w-6 h-6 rounded flex items-center justify-center border border-gray-200 dark:border-gray-700 disabled:opacity-40">
                                            <ChevronLeft className="w-3.5 h-3.5" />
                                        </button>
                                        <span>Page {attendancePage + 1} of {attendance.data.totalPages}</span>
                                        <button disabled={attendance.data.last} onClick={() => setAttendancePage((p) => p + 1)} className="w-6 h-6 rounded flex items-center justify-center border border-gray-200 dark:border-gray-700 disabled:opacity-40">
                                            <ChevronRight className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
