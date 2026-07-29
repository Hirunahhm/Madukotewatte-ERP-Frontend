"use client";

import { Card } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { chartColors } from "@/lib/theme";
import { useAssetBalances } from "@/features/assets/hooks/use-assets";

const BANKS: { assetType: string; name: string }[] = [
    { assetType: "Bank-BOC", name: "BOC" },
    { assetType: "Bank-Seylan", name: "Seylan" },
    { assetType: "Bank-Peoples", name: "Peoples" },
];

function formatLkr(value: number): string {
    return `LKR ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export function BankBalances() {
    const { data: balances } = useAssetBalances();

    return (
        <div className="space-y-3">
            <p className="text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase">Individual Bank Accounts</p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {BANKS.map((bank) => {
                    const balance = balances?.find((b) => b.assetType === bank.assetType)?.balance ?? 0;
                    return (
                        <Card key={bank.assetType} className="p-5 shadow-sm gap-0">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase">{bank.name} Bank</p>
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                                    <Building2 className="w-4 h-4" style={{ color: chartColors.primary }} />
                                </div>
                            </div>
                            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{formatLkr(balance)}</p>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
