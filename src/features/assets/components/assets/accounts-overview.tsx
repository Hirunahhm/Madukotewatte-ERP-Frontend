"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, CreditCard, Wallet, Pencil, Plus, ArrowRightLeft, PenLine, Loader2 } from "lucide-react";
import { useAccounts } from "@/features/accounts/hooks/use-accounts";
import { AccountDialog } from "@/features/accounts/components/account-dialog";
import { TransferDialog } from "@/features/accounts/components/transfer-dialog";
import { ManualEntryDialog } from "@/features/accounts/components/manual-entry-dialog";
import { ACCOUNT_TYPE_LABEL, formatLkr } from "@/features/accounts/utils/format";
import type { FinancialAccount } from "@/features/accounts/types/accounts.types";

const TYPE_ICON = { CASH: Wallet, BANK: Building2, CREDIT_CARD: CreditCard } as const;

function AccountCard({ account, onEdit }: { account: FinancialAccount; onEdit: (a: FinancialAccount) => void }) {
    const Icon = TYPE_ICON[account.type];
    const isCard = account.type === "CREDIT_CARD";
    const owed = isCard ? Math.max(-account.balance, 0) : 0;
    const utilisation = isCard && account.creditLimit ? Math.min(100, Math.round((owed / account.creditLimit) * 100)) : 0;

    return (
        <Card className={`p-5 shadow-sm gap-0 ${account.isActive ? "" : "opacity-60"}`}>
            <div className="flex items-start justify-between mb-3">
                <div className="min-w-0">
                    <p className="text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase truncate">{account.name}</p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                        {account.code} - {ACCOUNT_TYPE_LABEL[account.type]}
                        {!account.isActive && <Badge variant="outline" className="ml-2 text-[10px]">Inactive</Badge>}
                    </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                    <Button size="icon" variant="ghost" className="h-7 w-7" aria-label={`Edit ${account.name}`} onClick={() => onEdit(account)}>
                        <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                </div>
            </div>

            {isCard ? (
                <>
                    <p className="text-xl font-bold text-amber-600 dark:text-amber-400">{formatLkr(owed)}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">owed of {formatLkr(account.creditLimit ?? 0)} limit</p>
                    <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                        <div
                            className={`h-full rounded-full ${utilisation >= 85 ? "bg-red-400" : utilisation >= 60 ? "bg-amber-400" : "bg-emerald-500"}`}
                            style={{ width: `${utilisation}%` }}
                        />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                        {utilisation}% used - {formatLkr(account.availableCredit ?? 0)} available
                    </p>
                </>
            ) : (
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{formatLkr(account.balance)}</p>
            )}
        </Card>
    );
}

export function AccountsOverview() {
    const { data: accounts, isLoading } = useAccounts();
    const [editing, setEditing] = useState<FinancialAccount | null>(null);
    const [accountDialogOpen, setAccountDialogOpen] = useState(false);
    const [transferOpen, setTransferOpen] = useState(false);
    const [entryOpen, setEntryOpen] = useState(false);

    function openEdit(account: FinancialAccount) {
        setEditing(account);
        setAccountDialogOpen(true);
    }

    function openAdd() {
        setEditing(null);
        setAccountDialogOpen(true);
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <p className="text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase">Accounts</p>
                <div className="flex items-center gap-2 flex-wrap">
                    <Button size="sm" variant="outline" onClick={() => setTransferOpen(true)}>
                        <ArrowRightLeft className="w-4 h-4 mr-1.5" /> Transfer / pay card
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEntryOpen(true)}>
                        <PenLine className="w-4 h-4 mr-1.5" /> Record entry
                    </Button>
                    <Button size="sm" className="bg-brand-500 hover:bg-brand-600 text-white" onClick={openAdd}>
                        <Plus className="w-4 h-4 mr-1.5" /> Add account
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-brand-500" /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {(accounts ?? []).map((a) => <AccountCard key={a.code} account={a} onEdit={openEdit} />)}
                </div>
            )}

            <AccountDialog open={accountDialogOpen} onOpenChange={setAccountDialogOpen} account={editing} />
            <TransferDialog open={transferOpen} onOpenChange={setTransferOpen} />
            <ManualEntryDialog open={entryOpen} onOpenChange={setEntryOpen} />
        </div>
    );
}
