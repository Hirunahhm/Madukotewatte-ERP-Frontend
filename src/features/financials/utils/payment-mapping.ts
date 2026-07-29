/**
 * Maps a user-facing "Payment Type" label (shown on Sales/Expense forms and stored
 * verbatim on the sale/expense row) to the underlying ledger it should post to.
 * The two ledgers (cash/bank vs. credit) use their own type vocabularies, which
 * don't match the payment-type label strings, so this indirection is required.
 */
export const PAYMENT_TYPE_TO_LEDGER: Record<string, { kind: "monetary" | "loan"; ledgerType: string }> = {
    "Cash": { kind: "monetary", ledgerType: "Cash" },
    "Bank Transfer-BOC": { kind: "monetary", ledgerType: "Bank-BOC" },
    "Bank Transfer-Seylan": { kind: "monetary", ledgerType: "Bank-Seylan" },
    "Bank Transfer-Peoples": { kind: "monetary", ledgerType: "Bank-Peoples" },
    "Credit Card-Peoples": { kind: "loan", ledgerType: "credit-card - Peoples" },
};
