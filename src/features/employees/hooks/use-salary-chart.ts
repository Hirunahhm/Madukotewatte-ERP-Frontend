"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLabourByRange } from "@/features/employees/services/labour-service";
import { bucketLabel, getRangeForScale, type TimeScale } from "@/features/employees/utils/date-buckets";

export function useSalaryChart(timeScale: TimeScale) {
    const { from, to } = getRangeForScale(timeScale);

    const query = useQuery({
        queryKey: ["labour", "range", from, to],
        queryFn: () => getLabourByRange(from, to),
    });

    const chartData = useMemo(() => {
        if (!query.data) return [];
        const buckets = new Map<string, number>();
        for (const record of query.data) {
            if (!record.isPaid) continue;
            const label = bucketLabel(new Date(record.timestamp), timeScale);
            buckets.set(label, (buckets.get(label) ?? 0) + record.amount);
        }
        return Array.from(buckets.entries()).map(([name, total]) => ({ name, total }));
    }, [query.data, timeScale]);

    return { ...query, chartData };
}
