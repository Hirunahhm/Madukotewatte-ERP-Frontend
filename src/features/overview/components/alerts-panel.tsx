"use client";

import Link from "next/link";
import { AlertTriangle, CheckCircle2, ChevronRight, Info, OctagonAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatLkr } from "@/features/accounts/utils/format";
import type { AlertSeverity, OverviewAlert } from "@/features/overview/types/overview.types";

const STYLE: Record<AlertSeverity, { icon: typeof Info; box: string }> = {
    DANGER: { icon: OctagonAlert, box: "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300" },
    WARNING: { icon: AlertTriangle, box: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300" },
    INFO: { icon: Info, box: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300" },
};

export function AlertsPanel({ alerts }: { alerts: OverviewAlert[] }) {
    return (
        <Card className="shadow-sm gap-0 p-6">
            <div className="mb-4">
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Needs attention</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Overdue money, low balances, card limits and tapping outlook</p>
            </div>
            {alerts.length === 0 ? (
                <div className="flex items-center gap-2 py-6 text-sm text-gray-500 dark:text-gray-400">
                    <CheckCircle2 className="h-5 w-5 text-brand-500" /> Nothing needs attention right now.
                </div>
            ) : (
                <ul className="space-y-2">
                    {alerts.map((a, i) => {
                        const { icon: Icon, box } = STYLE[a.severity];
                        return (
                            <li key={`${a.type}-${i}`}>
                                <Link
                                    href={a.href}
                                    className="flex items-center gap-3 rounded-lg border border-gray-100 p-3 transition-colors hover:bg-gray-50 dark:border-gray-700/40 dark:hover:bg-gray-800/40"
                                >
                                    <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-md", box)}>
                                        <Icon className="h-4 w-4" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{a.title}</p>
                                        <p className="truncate text-xs text-gray-500 dark:text-gray-400">{a.detail}</p>
                                    </div>
                                    {a.amount !== null && (
                                        <span className="shrink-0 text-sm font-semibold text-gray-900 dark:text-gray-100">{formatLkr(a.amount)}</span>
                                    )}
                                    <ChevronRight className="h-4 w-4 shrink-0 text-gray-400" />
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            )}
        </Card>
    );
}
