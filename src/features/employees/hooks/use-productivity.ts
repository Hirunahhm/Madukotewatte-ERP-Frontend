"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAttendanceByRange } from "@/features/employees/services/attendance-service";
import { bucketLabel, getRangeForScale, type TimeScale } from "@/features/employees/utils/date-buckets";

export function useProductivity(timeScale: TimeScale) {
    const { from, to } = getRangeForScale(timeScale);

    const query = useQuery({
        queryKey: ["attendance", "range", from, to],
        queryFn: () => getAttendanceByRange(from, to),
    });

    const employeeNames = useMemo(() => {
        const names = new Set<string>();
        query.data?.forEach((r) => {
            if (r.noWork === "none") names.add(r.employeeName);
        });
        return Array.from(names);
    }, [query.data]);

    const chartData = useMemo(() => {
        if (!query.data) return [];
        const buckets = new Map<string, Record<string, number>>();
        for (const record of query.data) {
            if (record.noWork !== "none") continue;
            const label = bucketLabel(new Date(record.timestamp), timeScale);
            const bucket = buckets.get(label) ?? {};
            bucket[record.employeeName] = (bucket[record.employeeName] ?? 0) + (record.noOfTrees ?? 0);
            buckets.set(label, bucket);
        }
        return Array.from(buckets.entries()).map(([name, values]) => ({ name, ...values }));
    }, [query.data, timeScale]);

    const averageProductivity = useMemo(() => {
        if (!query.data || employeeNames.length === 0) return 0;
        const total = query.data
            .filter((r) => r.noWork === "none")
            .reduce((sum, r) => sum + (r.noOfTrees ?? 0), 0);
        return Math.round(total / employeeNames.length);
    }, [query.data, employeeNames]);

    return { ...query, chartData, employeeNames, averageProductivity };
}

export function useTopPerformers() {
    const { from, to } = getRangeForScale("week");

    const query = useQuery({
        queryKey: ["attendance", "range", from, to],
        queryFn: () => getAttendanceByRange(from, to),
    });

    const topPerformers = useMemo(() => {
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
        return Array.from(totals.values())
            .sort((a, b) => b.trees - a.trees)
            .slice(0, 3);
    }, [query.data]);

    return { ...query, topPerformers };
}
