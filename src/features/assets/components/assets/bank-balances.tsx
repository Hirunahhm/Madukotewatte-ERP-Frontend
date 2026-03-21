"use client";

import { Card } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { chartColors } from "@/lib/theme";

const banks = [
    { name: "BOC", balance: "LKR 384,200", account: "Savings Account" },
    { name: "Seylan", balance: "LKR 281,400", account: "Current Account" },
    { name: "Peoples", balance: "LKR 176,700", account: "Savings Account" },
];

export function BankBalances() {
    return (
        <div className="space-y-3">
            <p className="text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase">Individual Bank Accounts</p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {banks.map((bank) => (
                    <Card key={bank.name} className="p-5 shadow-sm gap-0">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <p className="text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase">{bank.name} Bank</p>
                                <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{bank.account}</p>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                                <Building2 className="w-4 h-4" style={{ color: chartColors.primary }} />
                            </div>
                        </div>
                        <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{bank.balance}</p>
                    </Card>
                ))}
            </div>
        </div>
    );
}
