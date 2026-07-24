export type TimeScale = "week" | "month" | "year";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function getRangeForScale(scale: TimeScale): { from: string; to: string } {
    const to = new Date();
    const from = new Date(to);
    if (scale === "week") from.setDate(to.getDate() - 6);
    else if (scale === "month") from.setDate(to.getDate() - 29);
    else from.setMonth(to.getMonth() - 11, 1);
    from.setHours(0, 0, 0, 0);
    return { from: toIso(from), to: toIso(to) };
}

export function bucketLabel(date: Date, scale: TimeScale): string {
    if (scale === "week") return DAY_LABELS[date.getDay()];
    if (scale === "month") return `${date.getDate()}/${date.getMonth() + 1}`;
    return MONTH_LABELS[date.getMonth()];
}

function toIso(date: Date): string {
    return date.toISOString().slice(0, 19);
}
