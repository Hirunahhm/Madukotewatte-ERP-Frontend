"use client";

import { useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAccounts } from "@/features/accounts/hooks/use-accounts";
import { ACCOUNT_TYPE_LABEL, formatLkr } from "@/features/accounts/utils/format";
import type { AccountType, FinancialAccount } from "@/features/accounts/types/accounts.types";
import { cn } from "@/lib/utils";

interface AccountSelectProps {
    value: string;
    onValueChange: (code: string) => void;
    /** Restrict to these account types, e.g. ["CASH", "BANK"] for money received. Default: all. */
    allowedTypes?: AccountType[];
    /** Account codes to hide (e.g. the source account of a transfer). */
    excludeCodes?: string[];
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    /** Show balance / available credit next to each account. Default true. */
    showBalance?: boolean;
}

function balanceText(account: FinancialAccount): string {
    return account.type === "CREDIT_CARD"
        ? `${formatLkr(account.availableCredit ?? 0)} available`
        : formatLkr(account.balance);
}

/** Account picker fed by useAccounts(): the only place payment / receipt accounts are chosen. */
export function AccountSelect({
    value, onValueChange, allowedTypes, excludeCodes, placeholder = "Select account",
    disabled, className, showBalance = true,
}: AccountSelectProps) {
    const { data: accounts, isLoading } = useAccounts();

    const options = useMemo(
        () => (accounts ?? []).filter((a) =>
            (a.isActive || a.code === value)
            && (!allowedTypes || allowedTypes.includes(a.type))
            && !(excludeCodes ?? []).includes(a.code)),
        [accounts, allowedTypes, excludeCodes, value],
    );
    const items = useMemo(
        () => options.map((a) => ({ value: a.code, label: showBalance ? `${a.name} (${balanceText(a)})` : a.name })),
        [options, showBalance],
    );

    return (
        <Select
            value={value}
            onValueChange={(v) => { if (v) onValueChange(v); }}
            items={items}
            disabled={disabled || isLoading}
        >
            <SelectTrigger className={cn("w-full", className)}>
                <SelectValue placeholder={isLoading ? "Loading accounts..." : placeholder} />
            </SelectTrigger>
            <SelectContent>
                {options.map((a) => (
                    <SelectItem key={a.code} value={a.code}>
                        <span className="font-medium">{a.name}</span>
                        <span className="text-xs text-muted-foreground">
                            {ACCOUNT_TYPE_LABEL[a.type]}{showBalance ? ` - ${balanceText(a)}` : ""}
                        </span>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
