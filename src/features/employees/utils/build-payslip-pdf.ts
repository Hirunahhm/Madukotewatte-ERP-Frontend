import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Payslip } from "@/features/employees/types/payroll.types";

type AutoTableDoc = jsPDF & { lastAutoTable: { finalY: number } };

const BRAND_COLOR: [number, number, number] = [16, 122, 87];
const ESTATE_NAME = "Madukotewatta Estates";

function money(value: number): string {
    return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** One payslip as a printable A4 PDF: estate, employee, period, earnings, deductions, net, account, date. */
export function buildPayslipPdf(payslip: Payslip): jsPDF {
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(18);
    doc.text(ESTATE_NAME, 14, y);
    y += 8;
    doc.setFontSize(12);
    doc.text("Payslip", 14, y);
    if (payslip.status === "VOID") {
        doc.setTextColor(200, 30, 30);
        doc.text("VOID", 196, y, { align: "right" });
        doc.setTextColor(0);
    }
    y += 8;

    doc.setFontSize(10);
    doc.text(`Employee: ${payslip.employeeName}${payslip.position ? ` (${payslip.position})` : ""}`, 14, y);
    y += 5;
    doc.text(`Period: ${payslip.periodStart} to ${payslip.periodEnd}`, 14, y);
    y += 5;
    doc.text(`Payment date: ${payslip.paymentDate}   Paid from: ${payslip.accountCode}`, 14, y);
    y += 5;
    doc.setTextColor(120);
    doc.text(`Payslip no. ${payslip.payslipId.slice(0, 8).toUpperCase()}`, 14, y);
    doc.setTextColor(0);
    y += 8;

    const earnings: (string | number)[][] = [];
    if (payslip.fixedSalary > 0) earnings.push(["Fixed monthly salary", money(payslip.fixedSalary)]);
    if (payslip.tapEarnings > 0) earnings.push(["Tapping (per tree)", money(payslip.tapEarnings)]);
    if (payslip.hourlyEarnings > 0) earnings.push(["Hourly labour", money(payslip.hourlyEarnings)]);
    if (payslip.otherEarnings > 0) {
        earnings.push([`Other earnings${payslip.otherEarningsNote ? ` (${payslip.otherEarningsNote})` : ""}`, money(payslip.otherEarnings)]);
    }
    autoTable(doc, {
        startY: y,
        head: [["Earnings", "LKR"]],
        body: earnings,
        foot: [["Gross pay", money(payslip.grossPay)]],
        theme: "striped",
        headStyles: { fillColor: BRAND_COLOR },
        footStyles: { fillColor: [235, 245, 240], textColor: 20 },
        columnStyles: { 1: { halign: "right" } },
        margin: { left: 14, right: 14 },
        styles: { fontSize: 10 },
    });
    y = (doc as AutoTableDoc).lastAutoTable.finalY + 8;

    const deductions: (string | number)[][] = [];
    if (payslip.advanceDeduction > 0) deductions.push(["Advance recovered", money(payslip.advanceDeduction)]);
    if (payslip.loanDeduction > 0) deductions.push(["Loan installment", money(payslip.loanDeduction)]);
    if (payslip.otherDeduction > 0) {
        deductions.push([`Other deduction${payslip.otherDeductionNote ? ` (${payslip.otherDeductionNote})` : ""}`, money(payslip.otherDeduction)]);
    }
    if (deductions.length === 0) deductions.push(["No deductions", money(0)]);
    const totalDeductions = payslip.advanceDeduction + payslip.loanDeduction + payslip.otherDeduction;
    autoTable(doc, {
        startY: y,
        head: [["Deductions", "LKR"]],
        body: deductions,
        foot: [["Total deductions", money(totalDeductions)]],
        theme: "striped",
        headStyles: { fillColor: [120, 120, 120] },
        footStyles: { fillColor: [240, 240, 240], textColor: 20 },
        columnStyles: { 1: { halign: "right" } },
        margin: { left: 14, right: 14 },
        styles: { fontSize: 10 },
    });
    y = (doc as AutoTableDoc).lastAutoTable.finalY + 10;

    doc.setFontSize(14);
    doc.text("Net pay", 14, y);
    doc.text(`LKR ${money(payslip.netPay)}`, 196, y, { align: "right" });
    y += 10;

    if (payslip.notes) {
        doc.setFontSize(9);
        doc.setTextColor(100);
        doc.text(`Notes: ${payslip.notes}`, 14, y, { maxWidth: 180 });
        doc.setTextColor(0);
        y += 8;
    }

    doc.setFontSize(8);
    doc.setTextColor(140);
    doc.text(`Generated ${new Date().toLocaleString()}`, 14, 285);
    doc.setTextColor(0);
    return doc;
}

export function downloadPayslipPdf(payslip: Payslip): void {
    const safeName = payslip.employeeName.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
    buildPayslipPdf(payslip).save(`payslip-${safeName}-${payslip.periodStart}_${payslip.periodEnd}.pdf`);
}
