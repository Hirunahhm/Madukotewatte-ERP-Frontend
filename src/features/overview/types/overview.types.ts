export interface NamedAmount {
    name: string;
    amount: number;
}

export interface NamedCount {
    name: string;
    count: number;
}

export interface OverviewAccountLine {
    code: string;
    name: string;
    type: "CASH" | "BANK" | "CREDIT_CARD";
    balance: number;
    creditLimit: number | null;
    availableCredit: number | null;
    utilisationPct: number | null;
}

export interface OverviewParty {
    total: number;
    overdue: number;
    count: number;
    overdueCount: number;
}

export interface OverviewMoney {
    cashAndBankTotal: number;
    cashAndBank: OverviewAccountLine[];
    creditCardsOwed: number;
    creditCardsAvailable: number;
    creditCards: OverviewAccountLine[];
    receivables: OverviewParty;
    payables: OverviewParty;
    borrowingsOutstanding: number;
    borrowings: NamedAmount[];
    employeeAdvancesOutstanding: number;
    employeeLoansOutstanding: number;
    activeEmployeeLoans: number;
}

export interface PeriodFigures {
    label: string;
    from: string;
    to: string;
    revenue: number;
    expenses: number;
    operatingResult: number;
    depreciation: number;
    resultAfterDepreciation: number;
    revenueByCrop: NamedAmount[];
    expensesByCategory: NamedAmount[];
}

export interface OverviewPeriods {
    monthToDate: PeriodFigures;
    previousMonthSameDays: PeriodFigures;
    previousMonth: PeriodFigures;
    yearToDate: PeriodFigures;
    financialYearToDate: PeriodFigures;
}

export interface OverviewTrendPoint {
    month: string;
    revenue: number;
    expenses: number;
    latexLitres: number;
}

export interface CropQuantity {
    crop: string;
    unit: string;
    quantity: number;
    harvests: number;
}

export interface OverviewProduction {
    latexToday: number;
    latexMonthToDate: number;
    latexPreviousMonthSameDays: number;
    rubberKgMonthToDate: number;
    treesTappedMonthToDate: number;
    latexPerTree: number | null;
    crops: CropQuantity[];
}

export interface OverviewWorkforce {
    activeEmployees: number;
    byPayType: NamedCount[];
    presentToday: number;
    noWorkToday: NamedCount[];
    notLoggedToday: number;
    payslipsPaidInMonth: number;
    payrollGrossPaidInMonth: number;
    payrollNetPaidInMonth: number;
    unpaidEarningsToDate: number;
}

export type AlertSeverity = "DANGER" | "WARNING" | "INFO";

export interface OverviewAlert {
    type: string;
    severity: AlertSeverity;
    title: string;
    detail: string;
    amount: number | null;
    href: string;
}

export interface DashboardOverview {
    asOf: string;
    month: string;
    money: OverviewMoney;
    periods: OverviewPeriods;
    trend: OverviewTrendPoint[];
    production: OverviewProduction;
    workforce: OverviewWorkforce;
    alerts: OverviewAlert[];
}
