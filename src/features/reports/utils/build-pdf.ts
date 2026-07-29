import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { ReportData } from "@/features/reports/services/report-data-service";

type AutoTableDoc = jsPDF & { lastAutoTable: { finalY: number } };

const BRAND_COLOR: [number, number, number] = [16, 122, 87];

function formatLkr(value: number): string {
    return `LKR ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function addSectionTitle(doc: jsPDF, title: string, y: number): number {
    doc.setFontSize(13);
    doc.setTextColor(20);
    doc.text(title, 14, y);
    doc.setFontSize(10);
    return y + 6;
}

function table(doc: jsPDF, startY: number, head: string[][], body: (string | number)[][]): number {
    autoTable(doc, {
        startY,
        head,
        body,
        theme: "striped",
        headStyles: { fillColor: BRAND_COLOR },
        margin: { left: 14, right: 14 },
        styles: { fontSize: 9 },
    });
    return (doc as AutoTableDoc).lastAutoTable.finalY + 8;
}

export function buildReportPdf(data: ReportData): Blob {
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(18);
    doc.text("Madukotewatta Estates", 14, y);
    y += 8;
    doc.setFontSize(12);
    doc.text(`Financial Report — ${data.period.label}`, 14, y);
    y += 6;
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text(`Period: ${data.period.from} to ${data.period.to}  ·  Generated ${new Date().toLocaleString()}`, 14, y);
    doc.setTextColor(0);
    y += 10;

    if (data.financials) {
        const f = data.financials;
        y = addSectionTitle(doc, "Financials — Sales & Expenses", y);
        y = table(doc, y, [["Metric", "Amount (LKR)"]], [
            ["Total Sales", formatLkr(f.salesSummary.totalSales)],
            ["Received", formatLkr(f.salesSummary.received)],
            ["Pending Receivables", formatLkr(f.salesSummary.pending)],
            ["Total Expenses", formatLkr(f.expenseSummary.totalExpenses)],
            ["Paid", formatLkr(f.expenseSummary.paid)],
            ["Pending Payables", formatLkr(f.expenseSummary.pending)],
            ["Net Profit", formatLkr(f.salesSummary.totalSales - f.expenseSummary.totalExpenses)],
        ]);
        y = table(doc, y, [["Sales by Category", "Amount (LKR)"]],
            f.salesDistribution.map((c) => [c.category, formatLkr(c.total)]));
        y = table(doc, y, [["Expenses by Category", "Amount (LKR)"]],
            f.expenseDistribution.map((c) => [c.category, formatLkr(c.total)]));
    }

    if (data.cashDebt) {
        const cd = data.cashDebt;
        if (y > 240) { doc.addPage(); y = 20; }
        y = addSectionTitle(doc, "Cash & Debt", y);
        const totalCash = cd.assetBalances.reduce((s, b) => s + b.balance, 0);
        const totalDebt = cd.loanBalances.reduce((s, b) => s + b.balance, 0);
        y = table(doc, y, [["Account", "Balance (LKR)"]], [
            ...cd.assetBalances.map((b) => [b.assetType, formatLkr(b.balance)]),
            ["Total Cash & Bank", formatLkr(totalCash)],
            ...cd.loanBalances.map((b) => [b.loanType, formatLkr(b.balance)]),
            ["Total Debt", formatLkr(totalDebt)],
        ]);
        for (const stmt of cd.creditCardStatements) {
            if (y > 250) { doc.addPage(); y = 20; }
            y = table(doc, y, [[`${stmt.loanType} Statement`, ""]], [
                ["Opening Balance", formatLkr(stmt.openingBalance)],
                ["Total Charges", formatLkr(stmt.totalCharges)],
                ["Total Payments", formatLkr(stmt.totalPayments)],
                ["Closing Balance", formatLkr(stmt.closingBalance)],
            ]);
        }
    }

    if (data.assets) {
        const a = data.assets;
        if (y > 230) { doc.addPage(); y = 20; }
        y = addSectionTitle(doc, "Fixed Assets", y);
        y = table(doc, y, [["Metric", "Value"]], [
            ["Asset Count", String(a.fixedAssetSummary.totalCount)],
            ["Total Acquisition Value", formatLkr(a.fixedAssetSummary.totalAcquisitionValue)],
            ["Total Current Value", formatLkr(a.fixedAssetSummary.totalCurrentValue)],
        ]);
        table(doc, y, [["Asset", "Category", "Acquired", "Current Value (LKR)"]],
            a.fixedAssets.map((asset) => [asset.name, asset.category, asset.acquisitionDate, formatLkr(asset.currentValue)]));
    }

    return doc.output("blob");
}
