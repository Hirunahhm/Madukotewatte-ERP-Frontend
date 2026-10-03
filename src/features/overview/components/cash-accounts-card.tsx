"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatLkr } from "@/features/accounts/utils/format";
import type { OverviewMoney } from "@/features/overview/types/overview.types";

function Row({ label, value, negative }: { label: string; value: string; negative?: boolean }) {
    return (
        <div className="flex items-center justify-between py-1 text-sm">
            <span className="text-gray-500 dark:text-gray-400">{label}</span>
            <span className={cn("font-medium text-gray-900 dark:text-gray-100", negative && "text-red-500")}>{value}</span>
        </div>
    );
}

export function CashAccountsCard({ money }: { money: OverviewMoney }) {
    return (
        <Card className="shadow-sm gap-0 p-6">
            <div className="mb-4 flex items-start justify-between">
                <div>
                    <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Cash and accounts</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Balances right now</p>
                </div>
                <Link href="/assets" className="flex shrink-0 items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700">
                    Cash &amp; Debt <ArrowRight className="h-3 w-3" />
                </Link>
            </div>

            {money.cashAndBank.length === 0 ? (
                <p className="text-sm text-gray-400">No cash or bank accounts set up.</p>
            ) : money.cashAndBank.map((a) => (
                <Row key={a.code} label={a.name} value={formatLkr(a.balance)} negative={a.balance < 0} />
            ))}
            <div className="mt-1 border-t border-gray-100 dark:border-gray-700/40 pt-1">
                <Row label="Total cash & bank" value={formatLkr(money.cashAndBankTotal)} />
            </div>

            <p className="mt-4 mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Credit cards</p>
            {money.creditCards.length === 0 ? (
                <p className="text-sm text-gray-400">No credit cards.</p>
            ) : money.creditCards.map((c) => {
                const pct = Math.min(Math.max(c.utilisationPct ?? 0, 0), 100);
                return (
                    <div key={c.code} className="mb-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">{c.name}</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                {formatLkr(Math.max(-c.balance, 0))} <span className="text-xs text-gray-400">of {formatLkr(c.creditLimit ?? 0)}</span>
                            </span>
                        </div>
                        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                            <div
                                className={cn("h-full rounded-full", pct >= 80 ? "bg-red-400" : pct >= 50 ? "bg-amber-400" : "bg-brand-500")}
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                        <p className="mt-0.5 text-xs text-gray-400">{pct.toFixed(0)}% used, {formatLkr(c.availableCredit ?? 0)} available</p>
                    </div>
                );
            })}

            <p className="mt-2 mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">Other balances</p>
            <Row label="Estate borrowings outstanding" value={formatLkr(money.borrowingsOutstanding)} />
            <Row label="Employee advances outstanding" value={formatLkr(money.employeeAdvancesOutstanding)} />
            <Row label={`Employee loans outstanding (${money.activeEmployeeLoans})`} value={formatLkr(money.employeeLoansOutstanding)} />
        </Card>
    );
}
