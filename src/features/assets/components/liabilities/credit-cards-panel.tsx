"use client";

import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Pencil, Plus, Banknote } from "lucide-react";
import { useAccounts } from "@/features/accounts/hooks/use-accounts";
import { AccountDialog } from "@/features/accounts/components/account-dialog";
import { TransferDialog } from "@/features/accounts/components/transfer-dialog";
import { formatLkr } from "@/features/accounts/utils/format";
import type { FinancialAccount } from "@/features/accounts/types/accounts.types";

/** Credit cards are ledger accounts: this panel shows utilisation and offers pay / edit-limit actions. */
export function CreditCardsPanel() {
    const { data: accounts, isLoading } = useAccounts();
    const cards = (accounts ?? []).filter((a) => a.type === "CREDIT_CARD");

    const [editing, setEditing] = useState<FinancialAccount | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [payCard, setPayCard] = useState<string | undefined>(undefined);
    const [payOpen, setPayOpen] = useState(false);

    return (
        <Card className="shadow-sm gap-0 p-6">
            <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-base font-semibold">Credit cards</CardTitle>
                <Button size="sm" variant="outline" onClick={() => { setEditing(null); setDialogOpen(true); }}>
                    <Plus className="w-4 h-4 mr-1.5" /> Add card
                </Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-brand-500" /></div>
            ) : cards.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">No credit cards yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cards.map((card) => {
                        const owed = Math.max(-card.balance, 0);
                        const limit = card.creditLimit ?? 0;
                        const utilisation = limit > 0 ? Math.min(100, Math.round((owed / limit) * 100)) : 0;
                        return (
                            <div key={card.code} className={`rounded-lg border border-gray-200 dark:border-gray-700 p-4 ${card.isActive ? "" : "opacity-60"}`}>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-gray-100">{card.name}</p>
                                        <p className="text-xs text-gray-400">{card.code}{card.accountNumber ? ` - ${card.accountNumber}` : ""}</p>
                                    </div>
                                    {!card.isActive && <Badge variant="outline" className="text-[10px]">Inactive</Badge>}
                                </div>
                                <p className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-3">{formatLkr(owed)}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">owed of {formatLkr(limit)} limit</p>
                                <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${utilisation >= 85 ? "bg-red-400" : utilisation >= 60 ? "bg-amber-400" : "bg-emerald-500"}`}
                                        style={{ width: `${utilisation}%` }}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                                    {utilisation}% used - {formatLkr(card.availableCredit ?? 0)} available
                                </p>
                                <div className="flex gap-2 mt-3">
                                    <Button
                                        size="sm"
                                        className="bg-brand-500 hover:bg-brand-600 text-white"
                                        disabled={!card.isActive}
                                        onClick={() => { setPayCard(card.code); setPayOpen(true); }}
                                    >
                                        <Banknote className="w-4 h-4 mr-1.5" /> Pay card
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => { setEditing(card); setDialogOpen(true); }}>
                                        <Pencil className="w-3.5 h-3.5 mr-1.5" /> Edit limit
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <AccountDialog open={dialogOpen} onOpenChange={setDialogOpen} account={editing} defaultType="CREDIT_CARD" />
            <TransferDialog open={payOpen} onOpenChange={setPayOpen} defaultTo={payCard} />
        </Card>
    );
}
