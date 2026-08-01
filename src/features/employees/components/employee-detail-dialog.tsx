"use client";

import { useEffect, useMemo, useState } from "react";
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
import { useEmployeeDetail } from "@/features/employees/hooks/use-employee-detail";
import { useUpdateEmployee } from "@/features/employees/hooks/use-employee-mutations";
import { ABSENCE_REASONS } from "@/features/employees/types/attendance.types";

const POSITIONS = ["Tapper", "Lead Tapper", "Senior Tapper", "Junior Tapper", "General Labour", "Assistant Manager", "Supervisor", "Operations Assistant"];

const TRANSACTION_LABELS: Record<string, string> = {
    Manual_Labor: "Labour Payment",
    Advance: "Advance",
    Loan_Payment: "Loan Payment",
    Latex_Tap: "Latex Tap Earnings",
    Banana_Harvest: "Banana Harvest Earnings",
    Coconut_Harvest: "Coconut Harvest Earnings",
    Manioc_Harvest: "Manioc Harvest Earnings",
};

const TRANSACTION_TYPES = ["Manual_Labor", "Advance", "Loan_Payment", "Latex_Tap", "Banana_Harvest", "Coconut_Harvest", "Manioc_Harvest"];

type Tab = "attendance" | "transactions" | "loans";
type LoanFilter = "all" | "active" | "closed";

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

export function EmployeeDetailDialog({ open, onOpenChange, employeeId }: Props) {
    const [tab, setTab] = useState<Tab>("attendance");
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [name, setName] = useState("");
    const [position, setPosition] = useState("");
    const [salary, setSalary] = useState("");
    const [ratePerTree, setRatePerTree] = useState("");
    const [ratePerBunch, setRatePerBunch] = useState("");
    const [ratePerNut, setRatePerNut] = useState("");
    const [ratePerKgManioc, setRatePerKgManioc] = useState("");
    const [joinedDate, setJoinedDate] = useState("");
    const [isActive, setIsActive] = useState(true);

    // Attendance filters
    const [attendancePage, setAttendancePage] = useState(0);
    const [attendanceFrom, setAttendanceFrom] = useState("");
    const [attendanceTo, setAttendanceTo] = useState("");
    const [attendanceStatus, setAttendanceStatus] = useState("all");

    // Transaction filters
    const [transactionsPage, setTransactionsPage] = useState(0);
    const [transactionsFrom, setTransactionsFrom] = useState("");
    const [transactionsTo, setTransactionsTo] = useState("");
    const [transactionsType, setTransactionsType] = useState("all");

    // Loans filter (client-side)
    const [loansFilter, setLoansFilter] = useState<LoanFilter>("all");

    const role = useAuthStore((s) => s.role);
    const isAdmin = role === "ROLE_ADMIN";

    const { employee, attendance, attendanceStats, transactions, transactionStats, loans } = useEmployeeDetail(
        employeeId,
        {
            page: attendancePage,
            from: attendanceFrom ? toIsoStart(attendanceFrom) : undefined,
            to: attendanceTo ? toIsoEnd(attendanceTo) : undefined,
            status: attendanceStatus !== "all" ? attendanceStatus : undefined,
        },
        {
            page: transactionsPage,
            from: transactionsFrom ? toIsoStart(transactionsFrom) : undefined,
            to: transactionsTo ? toIsoEnd(transactionsTo) : undefined,
            type: transactionsType !== "all" ? transactionsType : undefined,
        },
    );
    const updateEmployee = useUpdateEmployee();

    const filteredLoans = useMemo(() => {
        const all = loans.data ?? [];
        if (loansFilter === "all") return all;
        return all.filter((l) => (loansFilter === "active" ? l.isActive : !l.isActive));
    }, [loans.data, loansFilter]);

    const loanStats = useMemo(() => {
        const all = loans.data ?? [];
        return {
            totalBorrowed: all.reduce((sum, l) => sum + l.principalAmount, 0),
            totalOutstanding: all.filter((l) => l.isActive).reduce((sum, l) => sum + l.currentBalance, 0),
            activeCount: all.filter((l) => l.isActive).length,
            totalCount: all.length,
        };
    }, [loans.data]);

    useEffect(() => {
        if (employee.data) {
            setName(employee.data.name);
            setPosition(employee.data.position ?? "");
            setSalary(String(employee.data.salary ?? ""));
            setRatePerTree(String(employee.data.ratePerTree ?? "0"));
            setRatePerBunch(String(employee.data.ratePerBunch ?? "0"));
            setRatePerNut(String(employee.data.ratePerNut ?? "0"));
            setRatePerKgManioc(String(employee.data.ratePerKgManioc ?? "0"));
            setJoinedDate(employee.data.joinedDate ?? "");
            setIsActive(employee.data.isActive);
        }
    }, [employee.data]);

    useEffect(() => {
        if (!open) {
            setTab("attendance");
            setIsEditing(false);
            setError(null);
            setAttendancePage(0);
            setAttendanceFrom("");
            setAttendanceTo("");
            setAttendanceStatus("all");
            setTransactionsPage(0);
            setTransactionsFrom("");
            setTransactionsTo("");
            setTransactionsType("all");
            setLoansFilter("all");
        }
    }, [open]);

    async function handleSave() {
        if (!employeeId) return;
        setError(null);
        if (!name.trim() || !joinedDate || !salary) {
            setError("Name, date of joining, and salary are required.");
            return;
        }
        try {
            await updateEmployee.mutateAsync({
                id: employeeId,
                payload: {
                    name: name.trim(),
                    joinedDate,
                    salary: Number(salary),
                    ratePerTree: ratePerTree ? Number(ratePerTree) : 0,
                    ratePerBunch: ratePerBunch ? Number(ratePerBunch) : 0,
                    ratePerNut: ratePerNut ? Number(ratePerNut) : 0,
                    ratePerKgManioc: ratePerKgManioc ? Number(ratePerKgManioc) : 0,
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
            setRatePerBunch(String(employee.data.ratePerBunch ?? "0"));
            setRatePerNut(String(employee.data.ratePerNut ?? "0"));
            setRatePerKgManioc(String(employee.data.ratePerKgManioc ?? "0"));
            setJoinedDate(employee.data.joinedDate ?? "");
            setIsActive(employee.data.isActive);
        }
        setError(null);
        setIsEditing(false);
    }

    const attendanceFiltersActive = attendanceFrom || attendanceTo || attendanceStatus !== "all";
    const transactionFiltersActive = transactionsFrom || transactionsTo || transactionsType !== "all";

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
                                    <div className="space-y-1.5">
                                        <Label>Salary (LKR)</Label>
                                        <Input type="number" value={salary} onChange={(e) => setSalary(e.target.value)} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label>Rate per Tree (LKR)</Label>
                                        <Input type="number" min={0} step="0.01" value={ratePerTree} onChange={(e) => setRatePerTree(e.target.value)} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label>Rate per Banana Bunch (LKR)</Label>
                                        <Input type="number" min={0} step="0.01" value={ratePerBunch} onChange={(e) => setRatePerBunch(e.target.value)} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label>Rate per Coconut (LKR)</Label>
                                        <Input type="number" min={0} step="0.01" value={ratePerNut} onChange={(e) => setRatePerNut(e.target.value)} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label>Rate per kg Manioc (LKR)</Label>
                                        <Input type="number" min={0} step="0.01" value={ratePerKgManioc} onChange={(e) => setRatePerKgManioc(e.target.value)} />
                                    </div>
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
                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Salary</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-0.5">{employee.data.salary != null ? formatLkr(employee.data.salary) : "-"}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Rate per Tree</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-0.5">{employee.data.ratePerTree ? formatLkr(employee.data.ratePerTree) : "Not set"}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Rate per Banana Bunch</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-0.5">{employee.data.ratePerBunch ? formatLkr(employee.data.ratePerBunch) : "Not set"}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Rate per Coconut</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-0.5">{employee.data.ratePerNut ? formatLkr(employee.data.ratePerNut) : "Not set"}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Rate per kg Manioc</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-0.5">{employee.data.ratePerKgManioc ? formatLkr(employee.data.ratePerKgManioc) : "Not set"}</p>
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

                        {/* Tab switcher */}
                        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 gap-1 w-fit">
                            {([
                                { id: "attendance", label: "Attendance History" },
                                { id: "transactions", label: "Salary & Transactions" },
                                { id: "loans", label: "Loans" },
                            ] as { id: Tab; label: string }[]).map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setTab(t.id)}
                                    className={`h-8 px-3 rounded-md text-xs font-medium transition-colors ${tab === t.id ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-gray-100" : "text-gray-500 hover:text-gray-700"}`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        {/* Attendance tab */}
                        {tab === "attendance" && (
                            <div className="space-y-3">
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
                        )}

                        {/* Transactions tab */}
                        {tab === "transactions" && (
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                                    <StatCard label="Total Earned" value={transactionStats.data ? formatLkr(transactionStats.data.totalAmount) : "-"} accent />
                                    <StatCard label="Latex Tap" value={transactionStats.data ? formatLkr(transactionStats.data.latexTap) : "-"} />
                                    <StatCard label="Harvest Earnings" value={transactionStats.data ? formatLkr(transactionStats.data.harvestEarnings) : "-"} />
                                    <StatCard label="Labour" value={transactionStats.data ? formatLkr(transactionStats.data.manualLabor) : "-"} />
                                    <StatCard label="Advances" value={transactionStats.data ? formatLkr(transactionStats.data.advances) : "-"} />
                                    <StatCard label="Loan Deductions" value={transactionStats.data ? formatLkr(transactionStats.data.loanPayments) : "-"} />
                                </div>

                                <div className="flex flex-wrap items-end gap-3">
                                    <div className="space-y-1">
                                        <Label className="text-xs text-gray-500">From</Label>
                                        <Input type="date" className="h-8 text-xs w-36" value={transactionsFrom}
                                            onChange={(e) => { setTransactionsFrom(e.target.value); setTransactionsPage(0); }} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-gray-500">To</Label>
                                        <Input type="date" className="h-8 text-xs w-36" value={transactionsTo}
                                            onChange={(e) => { setTransactionsTo(e.target.value); setTransactionsPage(0); }} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-gray-500">Type</Label>
                                        <Select value={transactionsType} onValueChange={(v) => { if (v) { setTransactionsType(v); setTransactionsPage(0); } }}>
                                            <SelectTrigger className="h-8 text-xs w-44"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All</SelectItem>
                                                {TRANSACTION_TYPES.map((t) => <SelectItem key={t} value={t}>{TRANSACTION_LABELS[t]}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {transactionFiltersActive && (
                                        <Button size="sm" variant="ghost" className="h-8 gap-1 text-xs text-gray-500"
                                            onClick={() => { setTransactionsFrom(""); setTransactionsTo(""); setTransactionsType("all"); setTransactionsPage(0); }}>
                                            <X className="w-3 h-3" /> Clear
                                        </Button>
                                    )}
                                </div>

                                <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    <Table>
                                        <TableHeader className="bg-gray-50/50 dark:bg-gray-800/50">
                                            <TableRow>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Payment Method</TableHead>
                                                <TableHead className="text-right">Amount</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {transactions.isLoading && (
                                                <TableRow><TableCell colSpan={4} className="text-center py-8 text-gray-400"><Loader2 className="w-5 h-5 animate-spin inline-block" /></TableCell></TableRow>
                                            )}
                                            {!transactions.isLoading && (transactions.data?.content.length ?? 0) === 0 && (
                                                <TableRow><TableCell colSpan={4} className="text-center py-8 text-gray-400">No transactions match these filters.</TableCell></TableRow>
                                            )}
                                            {transactions.data?.content.map((tx) => (
                                                <TableRow key={tx.transactionRecordId}>
                                                    <TableCell className="text-sm">{new Date(tx.timestamp).toLocaleDateString()}</TableCell>
                                                    <TableCell className="text-sm">{TRANSACTION_LABELS[tx.type] ?? tx.type}</TableCell>
                                                    <TableCell className="text-sm text-gray-500 dark:text-gray-400">{tx.paymentType ?? "-"}</TableCell>
                                                    <TableCell className="text-right text-sm font-medium">{formatLkr(tx.amount)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    {transactions.data && transactions.data.totalPages > 1 && (
                                        <div className="flex items-center justify-end gap-2 p-2 border-t border-gray-100 dark:border-gray-700 text-xs">
                                            <button disabled={transactionsPage === 0} onClick={() => setTransactionsPage((p) => Math.max(0, p - 1))} className="w-6 h-6 rounded flex items-center justify-center border border-gray-200 dark:border-gray-700 disabled:opacity-40">
                                                <ChevronLeft className="w-3.5 h-3.5" />
                                            </button>
                                            <span>Page {transactionsPage + 1} of {transactions.data.totalPages}</span>
                                            <button disabled={transactions.data.last} onClick={() => setTransactionsPage((p) => p + 1)} className="w-6 h-6 rounded flex items-center justify-center border border-gray-200 dark:border-gray-700 disabled:opacity-40">
                                                <ChevronRight className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Loans tab */}
                        {tab === "loans" && (
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <StatCard label="Total Borrowed" value={formatLkr(loanStats.totalBorrowed)} />
                                    <StatCard label="Total Outstanding" value={formatLkr(loanStats.totalOutstanding)} accent />
                                    <StatCard label="Active Loans" value={loanStats.activeCount} />
                                    <StatCard label="Total Loans" value={loanStats.totalCount} />
                                </div>

                                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 gap-1 w-fit">
                                    {([
                                        { id: "all", label: "All" },
                                        { id: "active", label: "Active" },
                                        { id: "closed", label: "Closed" },
                                    ] as { id: LoanFilter; label: string }[]).map((f) => (
                                        <button
                                            key={f.id}
                                            onClick={() => setLoansFilter(f.id)}
                                            className={`h-7 px-2.5 rounded-md text-xs font-medium transition-colors ${loansFilter === f.id ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-gray-100" : "text-gray-500 hover:text-gray-700"}`}
                                        >
                                            {f.label}
                                        </button>
                                    ))}
                                </div>

                                <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    <Table>
                                        <TableHeader className="bg-gray-50/50 dark:bg-gray-800/50">
                                            <TableRow>
                                                <TableHead>Principal</TableHead>
                                                <TableHead className="text-right">Installment</TableHead>
                                                <TableHead className="text-right">Balance</TableHead>
                                                <TableHead className="text-right">Interest</TableHead>
                                                <TableHead>Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {loans.isLoading && (
                                                <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-400"><Loader2 className="w-5 h-5 animate-spin inline-block" /></TableCell></TableRow>
                                            )}
                                            {!loans.isLoading && filteredLoans.length === 0 && (
                                                <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-400">No loans match this filter.</TableCell></TableRow>
                                            )}
                                            {filteredLoans.map((loan) => (
                                                <TableRow key={loan.loanId}>
                                                    <TableCell className="text-sm">{formatLkr(loan.principalAmount)}</TableCell>
                                                    <TableCell className="text-right text-sm">{formatLkr(loan.installment)}</TableCell>
                                                    <TableCell className="text-right text-sm font-medium">{formatLkr(loan.currentBalance)}</TableCell>
                                                    <TableCell className="text-right text-sm text-gray-500 dark:text-gray-400">{loan.interest}%</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className={cn(
                                                            "text-[10px] font-bold uppercase border-transparent",
                                                            loan.isActive ? "bg-emerald-50 text-brand-600" : "bg-gray-100 text-gray-500"
                                                        )}>
                                                            {loan.isActive ? "Active" : "Closed"}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
