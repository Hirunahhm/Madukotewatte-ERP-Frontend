"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLabourByRange } from "@/features/employees/services/labour-service";
import { getPayslips } from "@/features/employees/services/payroll-service";
import { bucketLabel, getRangeForScale, type TimeScale } from "@/features/employees/utils/date-buckets";

/**
 * Salary paid out per bucket: the net pay of PAID payslips (by payment date) plus day labour paid on the spot.
 * Labour settled through a payslip is already inside that payslip, so it is not counted twice.
 */
export function useSalaryChart(timeScale: TimeScale) {
    const { from, to } = getRangeForScale(timeScale);
    const fromDate = from.slice(0, 10);
    const toDate = to.slice(0, 10);

    const labour = useQuery({
        queryKey: ["labour", "range", from, to],
        queryFn: () => getLabourByRange(from, to),
    });
    const payslips = useQuery({
        queryKey: ["payroll", "payslips", "chart", fromDate, toDate],
        queryFn: () => getPayslips({ from: fromDate, to: toDate, page: 0, size: 500 }),
    });

    const chartData = useMemo(() => {
        const entries: { date: Date; amount: number }[] = [];
        for (const record of labour.data ?? []) {
            if (record.isPaid && !record.payslipId) entries.push({ date: new Date(record.timestamp), amount: record.amount });
        }
        for (const slip of payslips.data?.content ?? []) {
            if (slip.status === "PAID") entries.push({ date: new Date(`${slip.paymentDate}T00:00:00`), amount: slip.netPay });
        }
        entries.sort((a, b) => a.date.getTime() - b.date.getTime());
        const buckets = new Map<string, number>();
        for (const entry of entries) {
            const label = bucketLabel(entry.date, timeScale);
            buckets.set(label, (buckets.get(label) ?? 0) + entry.amount);
        }
        return Array.from(buckets.entries()).map(([name, total]) => ({ name, total }));
    }, [labour.data, payslips.data, timeScale]);

    return { isLoading: labour.isLoading || payslips.isLoading, chartData };
}
