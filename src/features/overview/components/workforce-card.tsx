"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatLkr } from "@/features/accounts/utils/format";
import { NO_WORK_LABEL, PAY_TYPE_LABEL } from "@/features/overview/utils/format";
import type { OverviewWorkforce } from "@/features/overview/types/overview.types";

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between py-1 text-sm">
            <span className="text-gray-500 dark:text-gray-400">{label}</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">{value}</span>
        </div>
    );
}

export function WorkforceCard({ workforce }: { workforce: OverviewWorkforce }) {
    const pct = workforce.activeEmployees > 0 ? Math.round((workforce.presentToday / workforce.activeEmployees) * 100) : 0;
    return (
        <Card className="shadow-sm gap-0 p-6">
            <div className="mb-4 flex items-start justify-between">
                <div>
                    <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Workforce</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Attendance today and payroll</p>
                </div>
                <Link href="/employees" className="flex shrink-0 items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700">
                    Employees <ArrowRight className="h-3 w-3" />
                </Link>
            </div>

            <p className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                {workforce.presentToday} <span className="text-base font-medium text-gray-500">of {workforce.activeEmployees} present today</span>
            </p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                <div className="h-full rounded-full bg-brand-500" style={{ width: `${pct}%` }} />
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
                {workforce.noWorkToday.map((r) => (
                    <span key={r.name} className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                        {NO_WORK_LABEL[r.name] ?? r.name}: {r.count}
                    </span>
                ))}
                {workforce.notLoggedToday > 0 && (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                        Not logged: {workforce.notLoggedToday}
                    </span>
                )}
            </div>

            <p className="mt-4 mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">Active employees by pay type</p>
            {workforce.byPayType.length === 0 ? (
                <p className="text-sm text-gray-400">No active employees.</p>
            ) : workforce.byPayType.map((t) => (
                <Row key={t.name} label={PAY_TYPE_LABEL[t.name] ?? t.name} value={String(t.count)} />
            ))}

            <p className="mt-4 mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">Payroll</p>
            <Row label={`Paid this month (${workforce.payslipsPaidInMonth} payslip(s)), gross`} value={formatLkr(workforce.payrollGrossPaidInMonth)} />
            <Row label="Paid this month, net" value={formatLkr(workforce.payrollNetPaidInMonth)} />
            <Row label="Earned but unpaid, month to date" value={formatLkr(workforce.unpaidEarningsToDate)} />
        </Card>
    );
}
