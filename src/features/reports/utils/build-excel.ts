import * as XLSX from "xlsx";
import type { ReportData } from "@/features/reports/services/report-data-service";

export function buildReportExcel(data: ReportData): Blob {
    const wb = XLSX.utils.book_new();

    if (data.financials) {
        const f = data.financials;
        const summarySheet = XLSX.utils.json_to_sheet([
            { Metric: "Total Sales", Amount: f.salesSummary.totalSales },
            { Metric: "Received", Amount: f.salesSummary.received },
            { Metric: "Pending Receivables", Amount: f.salesSummary.pending },
            { Metric: "Total Expenses", Amount: f.expenseSummary.totalExpenses },
            { Metric: "Paid", Amount: f.expenseSummary.paid },
            { Metric: "Pending Payables", Amount: f.expenseSummary.pending },
            { Metric: "Net Profit", Amount: f.salesSummary.totalSales - f.expenseSummary.totalExpenses },
        ]);
        XLSX.utils.book_append_sheet(wb, summarySheet, "Financials Summary");

        XLSX.utils.book_append_sheet(
            wb,
            XLSX.utils.json_to_sheet(f.salesDistribution.map((c) => ({ Category: c.category, Total: c.total }))),
            "Sales by Category",
        );
        XLSX.utils.book_append_sheet(
            wb,
            XLSX.utils.json_to_sheet(f.expenseDistribution.map((c) => ({ Category: c.category, Total: c.total }))),
            "Expenses by Category",
        );
    }

    if (data.cashDebt) {
        const cd = data.cashDebt;
        const balanceRows = [
            ...cd.assetBalances.map((b) => ({ Account: b.assetType, Type: "Cash & Bank", Balance: b.balance })),
            ...cd.loanBalances.map((b) => ({ Account: b.loanType, Type: "Debt", Balance: b.balance })),
        ];
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(balanceRows), "Cash & Debt Balances");

        if (cd.creditCardStatements.length > 0) {
            const statementRows = cd.creditCardStatements.map((s) => ({
                Card: s.loanType,
                Opening: s.openingBalance,
                Charges: s.totalCharges,
                Payments: s.totalPayments,
                Closing: s.closingBalance,
            }));
            XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(statementRows), "Credit Card Statements");
        }
    }

    if (data.assets) {
        const assetsRows = data.assets.fixedAssets.map((a) => ({
            Name: a.name,
            Category: a.category,
            AcquisitionDate: a.acquisitionDate,
            AcquisitionValue: a.acquisitionValue,
            CurrentValue: a.currentValue,
            Status: a.status,
            Location: a.location ?? "",
        }));
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(assetsRows), "Fixed Assets");
    }

    const arrayBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" }) as ArrayBuffer;
    return new Blob([arrayBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
}
