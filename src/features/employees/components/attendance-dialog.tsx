"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle } from "lucide-react";
import { ABSENCE_REASONS, type NoWorkReason } from "@/features/employees/types/attendance.types";
import { useRecordAttendance } from "@/features/employees/hooks/use-attendance-mutations";

interface AttendanceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    employee: { employeeId: string; name: string } | null;
}

export function AttendanceDialog({ open, onOpenChange, employee }: AttendanceDialogProps) {
    const today = new Date().toISOString().split("T")[0];
    const [date, setDate] = useState(today);
    const [treesTapped, setTreesTapped] = useState("");
    const [isAbsent, setIsAbsent] = useState(false);
    const [absenceReason, setAbsenceReason] = useState<NoWorkReason | null>(null);
    const [error, setError] = useState<string | null>(null);

    const recordAttendance = useRecordAttendance();

    function resetAndClose() {
        setDate(today);
        setTreesTapped("");
        setIsAbsent(false);
        setAbsenceReason(null);
        setError(null);
        onOpenChange(false);
    }

    async function handleRecordAttendance() {
        if (!employee) return;
        setError(null);
        try {
            await recordAttendance.mutateAsync({
                employeeId: employee.employeeId,
                timestamp: `${date}T06:00:00`,
                noOfTrees: treesTapped ? Number(treesTapped) : undefined,
                noWork: "none",
            });
            resetAndClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to record attendance.");
        }
    }

    async function handleRecordAbsence() {
        if (!employee || !absenceReason) return;
        setError(null);
        try {
            await recordAttendance.mutateAsync({
                employeeId: employee.employeeId,
                timestamp: `${date}T06:00:00`,
                noOfTrees: 0,
                noWork: absenceReason,
            });
            resetAndClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to record absence.");
        }
    }

    return (
        <Dialog open={open} onOpenChange={(o) => (o ? onOpenChange(o) : resetAndClose())}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Mark Attendance</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                    {error && (
                        <div role="alert" className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/30 px-3 py-2 text-xs text-red-600 dark:text-red-400">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    {/* Date */}
                    <div className="space-y-1.5">
                        <Label htmlFor="att-date">Date</Label>
                        <Input
                            id="att-date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                        />
                    </div>

                    {/* Employee */}
                    <div className="space-y-1.5">
                        <Label>Employee</Label>
                        <div className="px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100">
                            {employee?.name ?? "—"}
                        </div>
                    </div>

                    {/* Trees Tapped */}
                    {!isAbsent && (
                        <div className="space-y-1.5">
                            <Label htmlFor="att-trees">Trees Tapped</Label>
                            <Input
                                id="att-trees"
                                type="number"
                                placeholder="e.g. 130"
                                value={treesTapped}
                                onChange={(e) => setTreesTapped(e.target.value)}
                                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                            />
                        </div>
                    )}

                    {/* Record Attendance */}
                    {!isAbsent && (
                        <Button
                            className="w-full bg-brand-500 hover:bg-brand-600"
                            disabled={!employee || recordAttendance.isPending}
                            onClick={handleRecordAttendance}
                        >
                            {recordAttendance.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Record Attendance
                        </Button>
                    )}

                    {/* Divider */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Mark as Absent</span>
                            <button
                                onClick={() => { setIsAbsent(!isAbsent); setAbsenceReason(null); }}
                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${isAbsent ? "bg-red-500" : "bg-gray-200 dark:bg-gray-700"}`}
                            >
                                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${isAbsent ? "translate-x-5" : "translate-x-1"}`} />
                            </button>
                        </div>

                        {isAbsent && (
                            <div className="space-y-3">
                                <p className="text-xs text-gray-500 dark:text-gray-400">Select absence reason:</p>
                                <div className="flex flex-wrap gap-2">
                                    {ABSENCE_REASONS.map((reason) => (
                                        <button
                                            key={reason.value}
                                            onClick={() => setAbsenceReason(absenceReason === reason.value ? null : reason.value)}
                                            className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                                                absenceReason === reason.value
                                                    ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800"
                                                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-transparent"
                                            }`}
                                        >
                                            {reason.label}
                                        </button>
                                    ))}
                                </div>
                                <Button
                                    className="w-full bg-red-500 hover:bg-red-600 text-white mt-2"
                                    disabled={!employee || !absenceReason || recordAttendance.isPending}
                                    onClick={handleRecordAbsence}
                                >
                                    {recordAttendance.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Record Absence
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
