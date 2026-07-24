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
import { useEmployeeDetail } from "@/features/employees/hooks/use-employee-detail";
import { useUpdateEmployee } from "@/features/employees/hooks/use-employee-mutations";
import { ABSENCE_REASONS } from "@/features/employees/types/attendance.types";

const POSITIONS = ["Tapper", "Lead Tapper", "Senior Tapper", "Junior Tapper", "General Labour", "Assistant Manager", "Supervisor", "Operations Assistant"];

const TRANSACTION_LABELS: Record<string, string> = {
    Manual_Labor: "Labour Payment",
    Advance: "Advance",
    Loan_Payment: "Loan Payment",
    Latex_Tap: "Latex Tap Earnings",
};

type Tab = "attendance" | "transactions" | "loans";

function reasonLabel(noWork: string) {
    return ABSENCE_REASONS.find((r) => r.value === noWork)?.label ?? noWork;
}

function formatLkr(value: number) {
    return `LKR ${value.toLocaleString()}`;
}

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    employeeId: string | null;
}

export function EmployeeDetailDialog({ open, onOpenChange, employeeId }: Props) {
    const [tab, setTab] = useState<Tab>("attendance");
    const [attendancePage, setAttendancePage] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [name, setName] = useState("");
    const [position, setPosition] = useState("");
    const [salary, setSalary] = useState("");
    const [joinedDate, setJoinedDate] = useState("");
    const [isActive, setIsActive] = useState(true);

    const role = useAuthStore((s) => s.role);
    const isAdmin = role === "ROLE_ADMIN";

    const { employee, attendance, transactions, loans } = useEmployeeDetail(employeeId, attendancePage);
    const updateEmployee = useUpdateEmployee();

    useEffect(() => {
        if (employee.data) {
            setName(employee.data.name);
            setPosition(employee.data.position ?? "");
            setSalary(String(employee.data.salary ?? ""));
            setJoinedDate(employee.data.joinedDate ?? "");
            setIsActive(employee.data.isActive);
        }
    }, [employee.data]);

    useEffect(() => {
        if (!open) {
            setTab("attendance");
            setAttendancePage(0);
            setIsEditing(false);
            setError(null);
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
            setJoinedDate(employee.data.joinedDate ?? "");
            setIsActive(employee.data.isActive);
        }
        setError(null);
        setIsEditing(false);
    }

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
                                            <TableRow><TableCell colSpan={3} className="text-center py-8 text-gray-400">No attendance records yet.</TableCell></TableRow>
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
                        )}

                        {/* Transactions tab */}
                        {tab === "transactions" && (
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
                                        {!transactions.isLoading && (transactions.data?.length ?? 0) === 0 && (
                                            <TableRow><TableCell colSpan={4} className="text-center py-8 text-gray-400">No transactions recorded yet.</TableCell></TableRow>
                                        )}
                                        {transactions.data
                                            ?.slice()
                                            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                                            .map((tx) => (
                                                <TableRow key={tx.transactionRecordId}>
                                                    <TableCell className="text-sm">{new Date(tx.timestamp).toLocaleDateString()}</TableCell>
                                                    <TableCell className="text-sm">{TRANSACTION_LABELS[tx.type] ?? tx.type}</TableCell>
                                                    <TableCell className="text-sm text-gray-500 dark:text-gray-400">{tx.paymentType ?? "-"}</TableCell>
                                                    <TableCell className="text-right text-sm font-medium">{formatLkr(tx.amount)}</TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}

                        {/* Loans tab */}
                        {tab === "loans" && (
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
                                        {!loans.isLoading && (loans.data?.length ?? 0) === 0 && (
                                            <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-400">No loans recorded for this employee.</TableCell></TableRow>
                                        )}
                                        {loans.data?.map((loan) => (
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
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
