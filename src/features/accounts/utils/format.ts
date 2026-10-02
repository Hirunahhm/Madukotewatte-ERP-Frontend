import type { AccountType, LedgerCategory } from "@/features/accounts/types/accounts.types";

export function formatLkr(value: number, fractionDigits = 0): string {
    const sign = value < 0 ? "-" : "";
    return `${sign}LKR ${Math.abs(value).toLocaleString(undefined, { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits })}`;
}

export const ACCOUNT_TYPE_LABEL: Record<AccountType, string> = {
    CASH: "Cash",
    BANK: "Bank",
    CREDIT_CARD: "Credit card",
};

export const CATEGORY_LABEL: Record<LedgerCategory, string> = {
    OPENING_BALANCE: "Opening balance",
    OWNER_CAPITAL: "Capital introduced",
    OWNER_DRAWING: "Owner drawings",
    TRANSFER: "Transfer",
    SALE_RECEIPT: "Sale receipt",
    OTHER_INCOME: "Other income",
    INTEREST_INCOME: "Interest income",
    EXPENSE_PAYMENT: "Expense payment",
    CREDIT_CARD_PAYMENT: "Credit card payment",
    SALARY_PAYMENT: "Salary payment",
    LABOUR_PAYMENT: "Labour payment",
    EMPLOYEE_ADVANCE: "Employee advance",
    EMPLOYEE_LOAN_ISSUE: "Employee loan issued",
    EMPLOYEE_LOAN_REPAYMENT: "Employee loan repaid",
    ESTATE_LOAN_RECEIPT: "Estate loan received",
    ESTATE_LOAN_REPAYMENT: "Estate loan repayment",
    ASSET_PURCHASE: "Asset purchase",
    ASSET_DISPOSAL: "Asset disposal",
    BANK_CHARGES: "Bank charges",
    ADJUSTMENT: "Adjustment",
};
