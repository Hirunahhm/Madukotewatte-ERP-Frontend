"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, Landmark, HandCoins, Receipt, TrendingUp, TrendingDown, Scale } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatLkr } from "@/features/accounts/utils/format";
import { percentChange } from "@/features/overview/utils/format";
import type { DashboardOverview } from "@/features/overview/types/overview.types";

interface KpiProps {
    title: string;
    value: string;
    icon: ReactNode;
    accent: string;
    href?: string;
    footer?: ReactNode;
}

function Kpi({ title, value, icon, accent, href, footer }: KpiProps) {
    const body = (
        <Card className="shadow-sm gap-0 p-5 h-full transition-colors hover:border-brand-200 dark:hover:border-brand-800">
            <div className="flex items-center justify-between">
                <div className={cn("flex h-9 w-9 items-center justify-center rounded-md", accent)}>{icon}</div>
            </div>
            <p className="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{value}</p>
            {footer && <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">{footer}</div>}
        </Card>
    );
    return href ? <Link href={href} className="block h-full">{body}</Link> : body;
}

/** Delta chip. `goodWhenUp` flips the colour for cost-like figures. */
function Delta({ current, previous, goodWhenUp = true }: { current: number; previous: number; goodWhenUp?: boolean }) {
    const pct = percentChange(current, previous);
    if (pct === null) return <span>Nothing to compare with last month</span>;
    const up = pct >= 0;
    const good = up === goodWhenUp;
    const Icon = up ? ArrowUpRight : ArrowDownRight;
    return (
        <span className="inline-flex items-center gap-1">
            <span className={cn("inline-flex items-center font-semibold", good ? "text-brand-600" : "text-red-500")}>
                <Icon className="h-3.5 w-3.5" />
                {Math.abs(pct).toFixed(0)}%
            </span>
            vs same days last month
        </span>
    );
}

export function OverviewKpis({ data }: { data: DashboardOverview }) {
    const { money, periods } = data;
    const mtd = periods.monthToDate;
    const prev = periods.previousMonthSameDays;
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <Kpi
                title="Cash & bank"
                value={formatLkr(money.cashAndBankTotal)}
                icon={<Landmark className="h-5 w-5" />}
                accent="bg-green-50 text-brand-600 dark:bg-green-950/40"
                href="/assets"
                footer={money.creditCardsOwed > 0 ? `${formatLkr(money.creditCardsOwed)} owed on credit cards` : "No credit card balance"}
            />
            <Kpi
                title="Customers owe us"
                value={formatLkr(money.receivables.total)}
                icon={<HandCoins className="h-5 w-5" />}
                accent="bg-blue-50 text-blue-600 dark:bg-blue-950/40"
                href="/financials"
                footer={money.receivables.overdue > 0
                    ? <span className="text-amber-600">{formatLkr(money.receivables.overdue)} overdue</span>
                    : `${money.receivables.count} open sale(s), none overdue`}
            />
            <Kpi
                title="We owe suppliers"
                value={formatLkr(money.payables.total)}
                icon={<Receipt className="h-5 w-5" />}
                accent="bg-amber-50 text-amber-600 dark:bg-amber-950/40"
                href="/financials"
                footer={money.payables.overdue > 0
                    ? <span className="text-red-500">{formatLkr(money.payables.overdue)} overdue</span>
                    : `${money.payables.count} open bill(s), none overdue`}
            />
            <Kpi
                title="Revenue this month"
                value={formatLkr(mtd.revenue)}
                icon={<TrendingUp className="h-5 w-5" />}
                accent="bg-green-50 text-brand-600 dark:bg-green-950/40"
                href="/financials"
                footer={<Delta current={mtd.revenue} previous={prev.revenue} />}
            />
            <Kpi
                title="Expenses this month"
                value={formatLkr(mtd.expenses)}
                icon={<TrendingDown className="h-5 w-5" />}
                accent="bg-red-50 text-red-500 dark:bg-red-950/40"
                href="/financials"
                footer={<Delta current={mtd.expenses} previous={prev.expenses} goodWhenUp={false} />}
            />
            <Kpi
                title="Operating result"
                value={formatLkr(mtd.operatingResult)}
                icon={<Scale className="h-5 w-5" />}
                accent={mtd.operatingResult >= 0 ? "bg-green-50 text-brand-600 dark:bg-green-950/40" : "bg-red-50 text-red-500 dark:bg-red-950/40"}
                footer={<Delta current={mtd.operatingResult} previous={prev.operatingResult} />}
            />
        </div>
    );
}
