"use client";

import { useState } from "react";
import { AlertCircle, ChevronLeft, ChevronRight, FileDown, Loader2, Ban } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuthStore } from "@/stores/auth-store";
import { usePayslips, useVoidPayslip } from "@/features/employees/hooks/use-payroll";
import { downloadPayslipPdf } from "@/features/employees/utils/build-payslip-pdf";
import type { Payslip } from "@/features/employees/types/payroll.types";

function fmt(value: number): string {
    return value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

interface Props {
    /** Limit the history to one employee (used inside the employee dialog). */
    employeeId?: string;
    pageSize?: number;
    title?: string;
}

export function PayslipHistory({ employeeId, pageSize = 10, title = "Payslip history" }: Props) {
    const [page, setPage] = useState(0);
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [voidTarget, setVoidTarget] = useState<Payslip | null>(null);
    const [reason, setReason] = useState("");
    const [error, setError] = useState<string | null>(null);

    const isAdmin = useAuthStore((s) => s.role) === "ROLE_ADMIN";
    const { data, isLoading } = usePayslips({ page, size: pageSize, employeeId, from: from || undefined, to: to || undefined });
    const voidPayslip = useVoidPayslip();

    async function confirmVoid() {
        if (!voidTarget) return;
        setError(null);
        try {
            await voidPayslip.mutateAsync({ id: voidTarget.payslipId, reason: reason.trim() || undefined });
            setVoidTarget(null);
            setReason("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to void the payslip.");
        }
    }

    return (
        <Card className="shadow-sm gap-0 overflow-hidden p-0">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700/40 flex flex-wrap items-end justify-between gap-3">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</p>
                <div className="flex items-end gap-2">
                    <div className="space-y-1">
                        <Label className="text-xs text-gray-500">Paid from</Label>
                        <Input type="date" className="h-8 text-xs w-36" value={from} onChange={(e) => { setFrom(e.target.value); setPage(0); }} />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs text-gray-500">Paid to</Label>
                        <Input type="date" className="h-8 text-xs w-36" value={to} onChange={(e) => { setTo(e.target.value); setPage(0); }} />
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-gray-50/50 dark:bg-gray-800/50">
                        <TableRow>
                            <TableHead>Paid on</TableHead>
                            {!employeeId && <TableHead>Employee</TableHead>}
                            <TableHead>Period</TableHead>
                            <TableHead className="text-right">Gross</TableHead>
                            <TableHead className="text-right">Deductions</TableHead>
                            <TableHead className="text-right">Net</TableHead>
                            <TableHead>Account</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && (
                            <TableRow><TableCell colSpan={9} className="text-center py-8 text-gray-400"><Loader2 className="w-5 h-5 animate-spin inline-block" /></TableCell></TableRow>
                        )}
                        {!isLoading && (data?.content.length ?? 0) === 0 && (
                            <TableRow><TableCell colSpan={9} className="text-center py-8 text-gray-400">No payslips yet.</TableCell></TableRow>
                        )}
                        {data?.content.map((p) => (
                            <TableRow key={p.payslipId} className={p.status === "VOID" ? "opacity-60" : undefined}>
                                <TableCell className="text-sm">{p.paymentDate}</TableCell>
                                {!employeeId && <TableCell className="text-sm font-medium">{p.employeeName}</TableCell>}
                                <TableCell className="text-xs text-gray-600 dark:text-gray-300">{p.periodStart} to {p.periodEnd}</TableCell>
                                <TableCell className="text-right text-sm">{fmt(p.grossPay)}</TableCell>
                                <TableCell className="text-right text-sm text-gray-500">
                                    {fmt(p.advanceDeduction + p.loanDeduction + p.otherDeduction)}
                                </TableCell>
                                <TableCell className="text-right text-sm font-semibold">{fmt(p.netPay)}</TableCell>
                                <TableCell className="text-sm text-gray-500">{p.accountCode}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={p.status === "PAID"
                                        ? "text-[10px] font-bold uppercase bg-emerald-50 text-brand-600 border-transparent"
                                        : "text-[10px] font-bold uppercase bg-gray-100 text-gray-500 border-transparent"}>
                                        {p.status === "PAID" ? "Paid" : "Void"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right whitespace-nowrap">
                                    <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs" onClick={() => downloadPayslipPdf(p)}>
                                        <FileDown className="w-3.5 h-3.5" /> PDF
                                    </Button>
                                    {isAdmin && p.status === "PAID" && (
                                        <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs text-red-600 hover:text-red-700"
                                            onClick={() => { setVoidTarget(p); setError(null); }}>
                                            <Ban className="w-3.5 h-3.5" /> Void
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {data && data.totalPages > 1 && (
                <div className="flex items-center justify-end gap-2 p-2 border-t border-gray-100 dark:border-gray-700 text-xs">
                    <button disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))} className="w-6 h-6 rounded flex items-center justify-center border border-gray-200 dark:border-gray-700 disabled:opacity-40">
                        <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <span>Page {page + 1} of {data.totalPages}</span>
                    <button disabled={data.last} onClick={() => setPage((p) => p + 1)} className="w-6 h-6 rounded flex items-center justify-center border border-gray-200 dark:border-gray-700 disabled:opacity-40">
                        <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}

            <Dialog open={voidTarget !== null} onOpenChange={(o) => { if (!o) setVoidTarget(null); }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Void this payslip?</DialogTitle>
                    </DialogHeader>
                    {voidTarget && (
                        <div className="space-y-3 text-sm">
                            <p className="text-gray-600 dark:text-gray-300">
                                {voidTarget.employeeName}, {voidTarget.periodStart} to {voidTarget.periodEnd}, net LKR {fmt(voidTarget.netPay)}.
                                This returns the money to {voidTarget.accountCode}, removes the salary expense, releases the tapping and labour
                                lines and restores the advance and loan balances.
                            </p>
                            {error && (
                                <div role="alert" className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/30 px-3 py-2 text-xs text-red-600 dark:text-red-400">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    {error}
                                </div>
                            )}
                            <div className="space-y-1.5">
                                <Label>Reason (optional)</Label>
                                <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. wrong period" />
                            </div>
                            <div className="flex gap-3 pt-1">
                                <Button variant="outline" className="flex-1" onClick={() => setVoidTarget(null)}>Keep payslip</Button>
                                <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white" disabled={voidPayslip.isPending} onClick={confirmVoid}>
                                    {voidPayslip.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Void payslip
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </Card>
    );
}
