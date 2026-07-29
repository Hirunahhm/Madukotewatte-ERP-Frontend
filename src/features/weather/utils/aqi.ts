export interface AqiCategory {
    label: string;
    color: string;
    textColor: string;
}

const AQI_BREAKPOINTS: { max: number; label: string; color: string; textColor: string }[] = [
    { max: 50, label: "Good", color: "#22c55e", textColor: "text-brand-600" },
    { max: 100, label: "Moderate", color: "#eab308", textColor: "text-yellow-600" },
    { max: 150, label: "Unhealthy for Sensitive Groups", color: "#f97316", textColor: "text-orange-600" },
    { max: 200, label: "Unhealthy", color: "#ef4444", textColor: "text-red-600" },
    { max: 300, label: "Very Unhealthy", color: "#a855f7", textColor: "text-purple-600" },
    { max: Infinity, label: "Hazardous", color: "#881337", textColor: "text-rose-900" },
];

export function categorizeAqi(usAqi: number): AqiCategory {
    const bucket = AQI_BREAKPOINTS.find((b) => usAqi <= b.max) ?? AQI_BREAKPOINTS[AQI_BREAKPOINTS.length - 1];
    return { label: bucket.label, color: bucket.color, textColor: bucket.textColor };
}

export const AQI_SCALE_MAX = 300;
