import {
    getSalesSummary, getSalesDistribution, getExpenseSummary, getExpenseDistribution,
} from "@/features/financials/services/financials-service";
import { getFixedAssets, getFixedAssetSummary } from "@/features/assets/services/assets-service";
import { getAccountBalances, getAccounts, getStatement } from "@/features/accounts/services/accounts-service";
import type { AccountBalance, AccountStatement } from "@/features/accounts/types/accounts.types";
import type { SalesSummary, ExpenseSummary, CategoryTotal } from "@/features/financials/types/financials.types";
import type { FixedAsset, FixedAssetSummary } from "@/features/assets/types/assets.types";
import type { ReportScope, ResolvedRange } from "@/features/reports/types/report.types";

export interface FinancialsReportData {
    salesSummary: SalesSummary;
    salesDistribution: CategoryTotal[];
    expenseSummary: ExpenseSummary;
    expenseDistribution: CategoryTotal[];
}

export interface CashDebtReportData {
    /** Balances of every account as of the period end (credit cards are negative when owed). */
    balances: AccountBalance[];
    /** Statements of every credit card for the period. */
    creditCardStatements: AccountStatement[];
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
    const [balances, accounts] = await Promise.all([getAccountBalances(range.to), getAccounts()]);
    const cards = accounts.filter((a) => a.type === "CREDIT_CARD");
    const creditCardStatements = await Promise.all(cards.map((card) => getStatement(card.code, range.from, range.to)));
    return { balances, creditCardStatements };
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
