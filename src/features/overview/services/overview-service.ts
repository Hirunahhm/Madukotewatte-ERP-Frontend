import type { DashboardOverview } from "@/features/overview/types/overview.types";

export async function getDashboardOverview(month?: string): Promise<DashboardOverview> {
    const res = await fetch(`/api/dashboard/overview${month ? `?month=${month}` : ""}`);
    const data: unknown = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error((data as { message?: string }).message ?? "Unable to load the dashboard overview.");
    }
    return data as DashboardOverview;
}
