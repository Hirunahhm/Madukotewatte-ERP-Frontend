import {
    getSalesSummary, getSalesDistribution, getExpenseSummary, getExpenseDistribution,
} from "@/features/financials/services/financials-service";
import {
    getAssetBalances, getLoanBalances, getCreditCardStatement, getFixedAssets, getFixedAssetSummary,
} from "@/features/assets/services/assets-service";
import { CREDIT_CARD_TYPES } from "@/features/assets/types/assets.types";
import type { SalesSummary, ExpenseSummary, CategoryTotal } from "@/features/financials/types/financials.types";
import type { AssetBalance, EstateLoanBalance, CreditCardStatement, FixedAsset, FixedAssetSummary } from "@/features/assets/types/assets.types";
import type { ReportScope, ResolvedRange } from "@/features/reports/types/report.types";

export interface FinancialsReportData {
    salesSummary: SalesSummary;
    salesDistribution: CategoryTotal[];
    expenseSummary: ExpenseSummary;
    expenseDistribution: CategoryTotal[];
}

export interface CashDebtReportData {
    assetBalances: AssetBalance[];
    loanBalances: EstateLoanBalance[];
    creditCardStatements: CreditCardStatement[];
}

export interface AssetsReportData {
    fixedAssetSummary: FixedAssetSummary;
    fixedAssets: FixedAsset[];
}

export interface ReportData {
    period: ResolvedRange;
    scope: ReportScope;
    financials?: FinancialsReportData;
    cashDebt?: CashDebtReportData;
    assets?: AssetsReportData;
}

async function fetchFinancials(range: ResolvedRange): Promise<FinancialsReportData> {
    const [salesSummary, salesDistribution, expenseSummary, expenseDistribution] = await Promise.all([
        getSalesSummary({ from: range.from, to: range.to }),
        getSalesDistribution({ from: range.from, to: range.to }),
        getExpenseSummary({ from: range.from, to: range.to }),
        getExpenseDistribution({ from: range.from, to: range.to }),
    ]);
    return { salesSummary, salesDistribution, expenseSummary, expenseDistribution };
}

async function fetchCashDebt(range: ResolvedRange): Promise<CashDebtReportData> {
    const [assetBalances, loanBalances, creditCardStatements] = await Promise.all([
        getAssetBalances(range.to),
        getLoanBalances(range.to),
        Promise.all(CREDIT_CARD_TYPES.map((loanType) => getCreditCardStatement(loanType, range.from, range.to))),
    ]);
    return { assetBalances, loanBalances, creditCardStatements };
}

async function fetchAssets(): Promise<AssetsReportData> {
    const [fixedAssetSummary, fixedAssetsPage] = await Promise.all([
        getFixedAssetSummary(),
        getFixedAssets({ status: "active", size: 500 }),
    ]);
    return { fixedAssetSummary, fixedAssets: fixedAssetsPage.content };
}

export async function fetchReportData(scope: ReportScope, range: ResolvedRange): Promise<ReportData> {
    const includeFinancials = scope === "consolidated" || scope === "financials";
    const includeCashDebt = scope === "consolidated" || scope === "cash-debt";
    const includeAssets = scope === "consolidated" || scope === "assets";

    const [financials, cashDebt, assets] = await Promise.all([
        includeFinancials ? fetchFinancials(range) : Promise.resolve(undefined),
        includeCashDebt ? fetchCashDebt(range) : Promise.resolve(undefined),
        includeAssets ? fetchAssets() : Promise.resolve(undefined),
    ]);

    return { period: range, scope, financials, cashDebt, assets };
}
