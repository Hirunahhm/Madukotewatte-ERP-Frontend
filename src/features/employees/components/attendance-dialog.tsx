"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const employees = [
    { id: "EMP001", name: "Arjun Das" },
    { id: "EMP002", name: "Siti Aminah" },
    { id: "EMP003", name: "Rajesh Kumar" },
    { id: "EMP004", name: "Linh Pham" },
    { id: "EMP005", name: "Karthik Raja" },
    { id: "EMP006", name: "Wong Kar Wai" },
    { id: "EMP007", name: "Elena Gilbert" },
    { id: "EMP008", name: "Marcus Tan" },
];

const ABSENCE_REASONS = ["Sick", "Rain", "Other", "Public Holiday", "Funeral", "Family Matter", "Kids"];

interface AttendanceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    employee: { id: string; name: string } | null;
}

export function AttendanceDialog({ open, onOpenChange, employee }: AttendanceDialogProps) {
    const today = new Date().toISOString().split("T")[0];
    const [date, setDate] = useState(today);
    const [selectedEmployee, setSelectedEmployee] = useState<string>("");
    const [treesTapped, setTreesTapped] = useState("");
    const [isAbsent, setIsAbsent] = useState(false);
    const [absenceReason, setAbsenceReason] = useState<string | null>(null);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Mark Attendance</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
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
                        {employee ? (
                            <div className="px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100">
                                {employee.name} <span className="text-gray-400 text-xs ml-1">({employee.id})</span>
                            </div>
                        ) : (
                            <Select value={selectedEmployee} onValueChange={(v) => { if (v !== null) setSelectedEmployee(v); }}>
                                <SelectTrigger className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                    <SelectValue placeholder="Select employee..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {employees.map((emp) => (
                                        <SelectItem key={emp.id} value={emp.id}>
                                            {emp.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
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
                        <Button className="w-full bg-brand-500 hover:bg-brand-600">Record Attendance</Button>
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
                                            key={reason}
                                            onClick={() => setAbsenceReason(absenceReason === reason ? null : reason)}
                                            className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                                                absenceReason === reason
                                                    ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800"
                                                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-transparent"
                                            }`}
                                        >
                                            {reason}
                                        </button>
                                    ))}
                                </div>
                                <Button className="w-full bg-red-500 hover:bg-red-600 text-white mt-2">Record Absence</Button>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
