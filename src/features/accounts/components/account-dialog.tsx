"use client";

import { useEffect, useState } from "react";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, AlertCircle } from "lucide-react";
import { useCreateAccount, useUpdateAccount } from "@/features/accounts/hooks/use-accounts";
import { ACCOUNT_TYPE_LABEL } from "@/features/accounts/utils/format";
import type { AccountType, FinancialAccount } from "@/features/accounts/types/accounts.types";
import { toLocalDateInputValue } from "@/lib/utils";

interface AccountDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Account to edit; null creates a new one. */
    account: FinancialAccount | null;
    /** Pre-selected type for new accounts (e.g. CREDIT_CARD from the Debt tab). */
    defaultType?: AccountType;
}

const TYPE_ITEMS = (Object.keys(ACCOUNT_TYPE_LABEL) as AccountType[]).map((t) => ({ value: t, label: ACCOUNT_TYPE_LABEL[t] }));

function slug(name: string): string {
    return name.trim().replace(/[^A-Za-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function AccountDialog({ open, onOpenChange, account, defaultType = "BANK" }: AccountDialogProps) {
    const isEdit = account !== null;
    const [type, setType] = useState<AccountType>(defaultType);
    const [code, setCode] = useState("");
    const [codeTouched, setCodeTouched] = useState(false);
    const [name, setName] = useState("");
    const [institution, setInstitution] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [creditLimit, setCreditLimit] = useState("");
    const [opening, setOpening] = useState("");
    const [openingDate, setOpeningDate] = useState(toLocalDateInputValue());
    const [isActive, setIsActive] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const create = useCreateAccount();
    const update = useUpdateAccount();
    const isPending = create.isPending || update.isPending;
    const isCard = type === "CREDIT_CARD";

    useEffect(() => {
        if (!open) return;
        setError(null);
        if (account) {
            setType(account.type);
            setCode(account.code);
            setName(account.name);
            setInstitution(account.institution ?? "");
            setAccountNumber(account.accountNumber ?? "");
            setCreditLimit(account.creditLimit != null ? String(account.creditLimit) : "");
            // cards: show the amount owed as a positive number
            setOpening(String(account.type === "CREDIT_CARD" ? Math.abs(account.openingBalance) : account.openingBalance));
            setOpeningDate(account.openingDate);
            setIsActive(account.isActive);
        } else {
            setType(defaultType);
            setCode("");
            setCodeTouched(false);
            setName("");
            setInstitution("");
            setAccountNumber("");
            setCreditLimit("");
            setOpening("");
            setOpeningDate(toLocalDateInputValue());
            setIsActive(true);
        }
    }, [open, account, defaultType]);

    function onNameChange(value: string) {
        setName(value);
        if (!isEdit && !codeTouched) {
            const prefix = type === "BANK" ? "Bank-" : type === "CREDIT_CARD" ? "CC-" : "";
            setCode(prefix + slug(value));
        }
    }

    async function handleSubmit() {
        setError(null);
        if (!name.trim() || !code.trim()) {
            setError("Name and code are required.");
            return;
        }
        const limit = creditLimit ? Number(creditLimit) : undefined;
        if (isCard && (limit === undefined || Number.isNaN(limit) || limit < 0)) {
            setError("Enter the card's credit limit.");
            return;
        }
        const openingValue = opening ? Number(opening) : 0;
        if (Number.isNaN(openingValue) || openingValue < 0) {
            setError("Opening balance must be zero or more.");
            return;
        }
        // cards store the amount owed as a negative balance
        const signedOpening = isCard ? -openingValue : openingValue;
        try {
            if (isEdit && account) {
                await update.mutateAsync({
                    code: account.code,
                    payload: {
                        name: name.trim(),
                        institution: institution.trim(),
                        accountNumber: accountNumber.trim(),
                        creditLimit: isCard ? limit : undefined,
                        openingBalance: signedOpening,
                        openingDate,
                        isActive,
                    },
                });
            } else {
                await create.mutateAsync({
                    code: code.trim(),
                    name: name.trim(),
                    type,
                    institution: institution.trim() || undefined,
                    accountNumber: accountNumber.trim() || undefined,
                    creditLimit: isCard ? limit : undefined,
                    openingBalance: signedOpening,
                    openingDate,
                });
            }
            onOpenChange(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save the account.");
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{isEdit ? `Edit ${account?.name}` : "Add account"}</DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? "Changing the opening balance reverses the old opening entry and posts a new one."
                            : "Cash, bank accounts and credit cards all live in the same ledger."}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 py-1">
                    {error && (
                        <div role="alert" className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/30 px-3 py-2 text-xs text-red-600 dark:text-red-400">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>Type</Label>
                            <Select value={type} onValueChange={(v) => { if (v) setType(v as AccountType); }} items={TYPE_ITEMS} disabled={isEdit}>
                                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {TYPE_ITEMS.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Code</Label>
                            <Input
                                value={code}
                                disabled={isEdit}
                                placeholder="e.g. Bank-Commercial"
                                onChange={(e) => { setCode(e.target.value); setCodeTouched(true); }}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label>Name</Label>
                        <Input value={name} placeholder="e.g. Commercial Bank current account" onChange={(e) => onNameChange(e.target.value)} />
                    </div>

                    {type !== "CASH" && (
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label>Institution</Label>
                                <Input value={institution} onChange={(e) => setInstitution(e.target.value)} />
                            </div>
                            <div className="space-y-1.5">
                                <Label>{isCard ? "Card number (last 4)" : "Account number"}</Label>
                                <Input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
                            </div>
                        </div>
                    )}

                    {isCard && (
                        <div className="space-y-1.5">
                            <Label>Credit limit (LKR)</Label>
                            <Input type="number" min={0} value={creditLimit} onChange={(e) => setCreditLimit(e.target.value)} />
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>{isCard ? "Amount owed on opening date (LKR)" : "Opening balance (LKR)"}</Label>
                            <Input type="number" min={0} placeholder="0.00" value={opening} onChange={(e) => setOpening(e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Opening date</Label>
                            <Input type="date" value={openingDate} onChange={(e) => setOpeningDate(e.target.value)} />
                        </div>
                    </div>

                    {isEdit && (
                        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                            Account is active (inactive accounts cannot receive new entries)
                        </label>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>Cancel</Button>
                    <Button className="bg-brand-500 hover:bg-brand-600 text-white" onClick={handleSubmit} disabled={isPending}>
                        {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {isEdit ? "Save changes" : "Add account"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
