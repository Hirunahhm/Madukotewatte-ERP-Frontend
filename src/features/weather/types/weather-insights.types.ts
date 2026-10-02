export interface WeatherDailyRecord {
    date: string;
    precipitationMm: number | null;
    rainHours: number | null;
    morningRainMm: number | null;
    morningRainProbabilityMax: number | null;
    tempMax: number | null;
    tempMin: number | null;
    humidityMean: number | null;
    windMax: number | null;
    et0Mm: number | null;
    source: "archive" | "forecast";
}

export interface WeatherSyncResult {
    from: string;
    to: string;
    daysUpserted: number;
    archiveDays: number;
    forecastDays: number;
}

export interface InsightsDay {
    date: string;
    rainfallMm: number | null;
    morningRainMm: number | null;
    latexQty: number | null;
    tappers: number;
    treesTapped: number;
    tapped: boolean;
    rainLost: boolean;
}

export interface InsightsMonth {
    month: string;
    rainfallMm: number | null;
    rainDays: number;
    tappingDays: number;
    rainLostDays: number;
    latexQty: number;
    avgLatexPerTappingDay: number | null;
    treesTapped: number;
}

export interface WeatherInsights {
    from: string;
    to: string;
    latexUnit: string;
    days: InsightsDay[];
    months: InsightsMonth[];
    correlations: {
        rainfallVsYield: number | null;
        rainfallVsYieldSamples: number;
        morningRainVsTapping: number | null;
        morningRainVsTappingSamples: number;
        rainfallVsYieldBasis: string;
        morningRainVsTappingBasis: string;
    };
    morningYield: {
        thresholdMm: number;
        avgLatexDryMornings: number | null;
        dryMorningTappingDays: number;
        avgLatexWetMornings: number | null;
        wetMorningTappingDays: number;
    };
    rainfallYearToDate: {
        year: number;
        thisYearMm: number | null;
        lastYearSamePeriodMm: number | null;
        differenceMm: number | null;
        differencePct: number | null;
        thisYearDaysWithData: number;
        lastYearDaysWithData: number;
    };
    rainLostTappingDaysThisMonth: number | null;
    thisMonth: string;
}

export interface OutlookDay {
    date: string;
    rainMm: number | null;
    morningRainMm: number | null;
    morningRainProbabilityMax: number | null;
    tempMax: number | null;
    tempMin: number | null;
    tappable: boolean;
    expectedLatex: number | null;
    summary: string;
}

export interface WeatherOutlook {
    fetchedAt: string;
    tapRainThresholdMm: number;
    tapRainProbabilityMax: number;
    basis: { description: string; avgLatexPerTappingDay: number | null; sampleDays: number; windowDays: number };
    tappableDays: number;
    expectedLatexTotal: number | null;
    latexUnit: string;
    days: OutlookDay[];
}
