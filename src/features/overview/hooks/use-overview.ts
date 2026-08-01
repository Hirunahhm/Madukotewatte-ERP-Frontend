"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLoads, useLoadSummary, useMetrolacReadings } from "@/features/production/hooks/use-production";
import { getAttendanceByRange } from "@/features/employees/services/attendance-service";
import { getEmployeesSummary } from "@/features/employees/services/employee-service";
import { getRangeForScale } from "@/features/employees/utils/date-buckets";
import { useSalesSummary, useExpenseSummary } from "@/features/financials/hooks/use-financials";
import { useAssetBalances, useLoanBalances } from "@/features/assets/hooks/use-assets";
import { toLocalDateInputValue, toLocalDateTimeString } from "@/lib/utils";

function toIso(date: Date): string {
    return toLocalDateTimeString(date);
}

function todayRange(): { from: string; to: string } {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return { from: toIso(start), to: toIso(end) };
}

function last28DaysRange(): { from: string; to: string } {
    const to = new Date();
    const from = new Date(to);
    from.setDate(to.getDate() - 27);
    from.setHours(0, 0, 0, 0);
    return { from: toIso(from), to: toIso(to) };
}

function monthRange(monthsAgo: number): { from: string; to: string } {
    const now = new Date();
    const first = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
    const last = monthsAgo === 0 ? now : new Date(now.getFullYear(), now.getMonth() - monthsAgo + 1, 0);
    return { from: toLocalDateInputValue(first), to: toLocalDateInputValue(last) };
}

// ─── KPI Cards ────────────────────────────────────────────────────────────────

export function useDashboardKpis() {
    const { data: loadsPage, isLoading: isLoadingLoads } = useLoads({ loadType: "field-latex", size: 1, sort: "startDate,desc" });
    const latestLoadId = loadsPage?.content?.[0]?.loadId ?? "";

    const { data: loadSummary, isLoading: isLoadingSummary } = useLoadSummary(latestLoadId);
    const { data: metrolacPage, isLoading: isLoadingMetrolac } = useMetrolacReadings({ size: 50 });

    const { from, to } = todayRange();
    const { data: attendanceToday, isLoading: isLoadingAttendance } = useQuery({
        queryKey: ["attendance", "range", from, to],
        queryFn: () => getAttendanceByRange(from, to),
    });

    const { data: employeesSummary, isLoading: isLoadingEmployees } = useQuery({
        queryKey: ["employees-summary"],
        queryFn: () => getEmployeesSummary(),
    });

    const avgMetrolac = useMemo(() => {
        const readings = (metrolacPage?.content ?? []).filter((r) => r.loadId === latestLoadId && r.reading != null);
        if (readings.length === 0) return null;
        return readings.reduce((sum, r) => sum + (r.reading ?? 0), 0) / readings.length;
    }, [metrolacPage, latestLoadId]);

    const presentEmployees = useMemo(() => {
        const names = new Set<string>();
        (attendanceToday ?? []).forEach((r) => { if (r.noWork === "none") names.add(r.employeeName); });
        return Array.from(names);
    }, [attendanceToday]);

    const totalActiveEmployees = (employeesSummary ?? []).filter((e) => e.isActive).length;

    return {
        isLoading: isLoadingLoads || isLoadingSummary || isLoadingMetrolac || isLoadingAttendance || isLoadingEmployees,
        latestLoadId,
        totalLatex: loadSummary?.totalLatexCollected ?? 0,
        avgMetrolac,
        presentEmployees,
        totalActiveEmployees,
    };
}

// ─── Worker Trees Ranking ─────────────────────────────────────────────────────

export function useWorkerTreesRanking() {
    const { from, to } = getRangeForScale("week");
    const query = useQuery({
        queryKey: ["attendance", "range", from, to],
        queryFn: () => getAttendanceByRange(from, to),
    });

    const ranking = useMemo(() => {
        if (!query.data) return [];
        const totals = new Map<string, { employeeId: string; employeeName: string; trees: number }>();
        for (const record of query.data) {
            if (record.noWork !== "none") continue;
            const existing = totals.get(record.employeeId);
            totals.set(record.employeeId, {
                employeeId: record.employeeId,
                employeeName: record.employeeName,
                trees: (existing?.trees ?? 0) + (record.noOfTrees ?? 0),
            });
        }
        return Array.from(totals.values()).sort((a, b) => b.trees - a.trees);
    }, [query.data]);

    return { ...query, ranking };
}

// ─── Workforce Engagement (28-day heatmap) ───────────────────────────────────

export interface EngagementDay {
    date: string;
    presentCount: number;
    level: 0 | 1 | 2 | 3;
    rained: boolean;
}

export function useWorkforceEngagement() {
    const { from, to } = last28DaysRange();
    const query = useQuery({
        queryKey: ["attendance", "range", from, to],
        queryFn: () => getAttendanceByRange(from, to),
    });
    const { data: employeesSummary } = useQuery({
        queryKey: ["employees-summary"],
        queryFn: () => getEmployeesSummary(),
    });

    const totalActive = (employeesSummary ?? []).filter((e) => e.isActive).length;

    const engagement = useMemo(() => {
        const byDate = new Map<string, { present: Set<string>; rained: boolean }>();
        for (let i = 0; i < 28; i++) {
            const d = new Date();
            d.setDate(d.getDate() - (27 - i));
            byDate.set(toLocalDateInputValue(d), { present: new Set(), rained: false });
        }

        (query.data ?? []).forEach((record) => {
            const key = record.timestamp.slice(0, 10);
            const bucket = byDate.get(key);
            if (!bucket) return;
            if (record.noWork === "none") bucket.present.add(record.employeeId);
            if (record.noWork === "rain") bucket.rained = true;
        });

        const ratioBase = totalActive || 1;
        const days: EngagementDay[] = [];
        let highestDay = { date: "", count: -1 };
        let rainDays = 0;

        for (const [date, bucket] of byDate.entries()) {
            const count = bucket.present.size;
            const ratio = count / ratioBase;
            const level: EngagementDay["level"] = count === 0 ? 0 : ratio < 0.34 ? 1 : ratio < 0.67 ? 2 : 3;
            days.push({ date, presentCount: count, level, rained: bucket.rained });
            if (count > highestDay.count) highestDay = { date, count };
            if (bucket.rained) rainDays += 1;
        }

        return { days, highestDay, rainDays };
    }, [query.data, totalActive]);

    return { ...query, ...engagement, totalActiveTappers: totalActive };
}

// ─── Liquidity Summary ────────────────────────────────────────────────────────

export function useLiquiditySummary() {
    const { data: assetBalances, isLoading: isLoadingAssets } = useAssetBalances();
    const { data: loanBalances, isLoading: isLoadingLoans } = useLoanBalances();

    const thisMonth = monthRange(0);
    const lastMonth = monthRange(1);

    const { data: salesThisMonth, isLoading: isLoadingSalesThis } = useSalesSummary(thisMonth);
    const { data: salesLastMonth, isLoading: isLoadingSalesLast } = useSalesSummary(lastMonth);
    const { data: expenseThisMonth, isLoading: isLoadingExpenseThis } = useExpenseSummary(thisMonth);

    const totalCash = (assetBalances ?? []).reduce((s, b) => s + b.balance, 0);
    const totalDebt = (loanBalances ?? []).reduce((s, b) => s + b.balance, 0);
    const totalLiquidity = totalCash + totalDebt;
    const cashPct = totalLiquidity > 0 ? Math.round((totalCash / totalLiquidity) * 100) : 0;

    const salesMtd = salesThisMonth?.totalSales ?? 0;
    const expenseMtd = expenseThisMonth?.totalExpenses ?? 0;
    const prevSales = salesLastMonth?.totalSales ?? 0;
    const salesGrowthPct = prevSales > 0 ? Math.round(((salesMtd - prevSales) / prevSales) * 100) : null;
    const expenseRatioPct = salesMtd > 0 ? Math.round((expenseMtd / salesMtd) * 100) : 0;

    return {
        isLoading: isLoadingAssets || isLoadingLoans || isLoadingSalesThis || isLoadingSalesLast || isLoadingExpenseThis,
        totalCash,
        totalDebt,
        cashPct,
        salesMtd,
        expenseMtd,
        salesGrowthPct,
        expenseRatioPct,
    };
}
