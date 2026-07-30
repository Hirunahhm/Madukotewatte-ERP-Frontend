"use client";

import { useState } from "react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Download } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { resolvePeriod } from "@/features/reports/utils/period";
import { fetchReportData } from "@/features/reports/services/report-data-service";
import { buildReportPdf } from "@/features/reports/utils/build-pdf";
import { buildReportExcel } from "@/features/reports/utils/build-excel";
import type { ReportPeriod, ReportScope, ReportFormat } from "@/features/reports/types/report.types";

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - i);

const SCOPE_OPTIONS: { id: ReportScope; label: string }[] = [
    { id: "consolidated", label: "Consolidated (All Sections)" },
    { id: "financials", label: "Financials Only" },
    { id: "cash-debt", label: "Cash & Debt Only" },
    { id: "assets", label: "Assets Only" },
];

export function ReportGeneratorPanel() {
    const [periodType, setPeriodType] = useState<"year" | "quarter">("year");
    const [year, setYear] = useState<number>(CURRENT_YEAR);
    const [quarter, setQuarter] = useState<1 | 2 | 3 | 4>(1);
    const [scope, setScope] = useState<ReportScope>("consolidated");
    const [format, setFormat] = useState<ReportFormat>("pdf");
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleDownload() {
        setError(null);
        setIsGenerating(true);
        try {
            const period: ReportPeriod = periodType === "year" ? { kind: "year", year } : { kind: "quarter", year, quarter };
            const range = resolvePeriod(period);
            const data = await fetchReportData(scope, range);
            const blob = format === "pdf" ? buildReportPdf(data) : buildReportExcel(data);

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `estate-report-${scope}-${range.label.replace(/\s+/g, "-")}.${format === "pdf" ? "pdf" : "xlsx"}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate report.");
        } finally {
            setIsGenerating(false);
        }
    }

    return (
        <Card className="shadow-sm p-6 gap-0">
            <CardTitle className="text-base font-semibold">Reports</CardTitle>
            <CardDescription className="mb-5">Download an annual or quarterly financial report as PDF or Excel.</CardDescription>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div className="space-y-1.5">
                    <Label>Period</Label>
                    <Select value={periodType} onValueChange={(v) => { if (v) setPeriodType(v as "year" | "quarter"); }}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="year">Annual</SelectItem>
                            <SelectItem value="quarter">Quarterly</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1.5">
                    <Label>Year</Label>
                    <Select value={String(year)} onValueChange={(v) => { if (v) setYear(Number(v)); }}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {YEARS.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                {periodType === "quarter" && (
                    <div className="space-y-1.5">
                        <Label>Quarter</Label>
                        <Select value={String(quarter)} onValueChange={(v) => { if (v) setQuarter(Number(v) as 1 | 2 | 3 | 4); }}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {([1, 2, 3, 4] as const).map((q) => <SelectItem key={q} value={String(q)}>{`Q${q}`}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                )}
                <div className="space-y-1.5">
                    <Label>Scope</Label>
                    <Select value={scope} onValueChange={(v) => { if (v) setScope(v as ReportScope); }}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {SCOPE_OPTIONS.map((s) => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1.5">
                    <Label>Format</Label>
                    <Select value={format} onValueChange={(v) => { if (v) setFormat(v as ReportFormat); }}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pdf">PDF</SelectItem>
                            <SelectItem value="excel">Excel</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
            <Button
                className="mt-5 bg-brand-500 hover:bg-brand-600 text-white"
                onClick={handleDownload}
                disabled={isGenerating}
            >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : <Download className="w-4 h-4 mr-1.5" />}
                {isGenerating ? "Generating..." : "Download Report"}
            </Button>
        </Card>
    );
}
