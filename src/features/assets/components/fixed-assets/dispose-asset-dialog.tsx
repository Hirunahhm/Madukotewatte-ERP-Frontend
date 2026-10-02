"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle } from "lucide-react";
import { useDisposeFixedAsset } from "@/features/assets/hooks/use-assets";
import { AccountSelect } from "@/features/accounts/components/account-select";
import { formatLkr } from "@/features/accounts/utils/format";
import { nbvAtDisposal } from "@/features/assets/utils/depreciation";
import { toLocalDateInputValue } from "@/lib/utils";
import type { FixedAsset } from "@/features/assets/types/assets.types";

interface DisposeAssetDialogProps {
    asset: FixedAsset | null;
    onClose: () => void;
}

export function DisposeAssetDialog({ asset, onClose }: DisposeAssetDialogProps) {
    return (
        <Dialog open={!!asset} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="sm:max-w-md">
                {asset && <DisposeForm key={asset.assetId} asset={asset} onClose={onClose} />}
            </DialogContent>
        </Dialog>
    );
}

function DisposeForm({ asset, onClose }: { asset: FixedAsset; onClose: () => void }) {
    const [date, setDate] = useState(toLocalDateInputValue());
    const [proceeds, setProceeds] = useState("");
    const [accountCode, setAccountCode] = useState("");
    const [error, setError] = useState<string | null>(null);
    const dispose = useDisposeFixedAsset();

    const proceedsValue = proceeds ? Number(proceeds) : 0;
    const validDate = !!date && date >= asset.acquisitionDate;
    const nbv = validDate ? nbvAtDisposal(asset, date) : null;
    const gainLoss = nbv === null ? null : proceedsValue - nbv;

    async function handleSubmit() {
        setError(null);
        if (!validDate) {
            setError("Disposal date cannot be before the acquisition date.");
            return;
        }
        if (proceedsValue > 0 && !accountCode) {
            setError("Choose the account that receives the proceeds.");
            return;
        }
        try {
            await dispose.mutateAsync({
                id: asset.assetId,
                payload: { disposalDate: date, proceeds: proceedsValue, accountCode: accountCode || undefined },
            });
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to dispose asset.");
        }
    }

    return (
        <>
            <DialogHeader>
                <DialogTitle>Dispose of {asset.name}</DialogTitle>
                <DialogDescription>
                    Cost {formatLkr(asset.acquisitionValue)}. The proceeds are credited to the chosen account.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 pt-2">
                {error && (
                    <div role="alert" className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/30 px-3 py-2 text-xs text-red-600 dark:text-red-400">
                        <AlertCircle className="w-4 h-4 shrink-0" />{error}
                    </div>
                )}
                <div className="space-y-1.5">
                    <Label>Disposal Date</Label>
                    <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                    <Label>Proceeds (LKR)</Label>
                    <Input type="number" min={0} placeholder="0 if scrapped" value={proceeds} onChange={(e) => setProceeds(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                    <Label>Proceeds Received Into</Label>
                    <AccountSelect value={accountCode} onValueChange={setAccountCode} allowedTypes={["CASH", "BANK"]}
                        placeholder={proceedsValue > 0 ? "Select account" : "Not needed when proceeds are 0"} />
                </div>
                {nbv !== null && gainLoss !== null && (
                    <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-3 text-sm space-y-1">
                        <div className="flex justify-between"><span className="text-gray-500">Net book value at disposal</span><span className="font-medium">{formatLkr(nbv)}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Proceeds</span><span className="font-medium">{formatLkr(proceedsValue)}</span></div>
                        <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-1">
                            <span className="font-semibold">{gainLoss >= 0 ? "Gain on disposal" : "Loss on disposal"}</span>
                            <span className={`font-semibold ${gainLoss >= 0 ? "text-emerald-600" : "text-red-600"}`}>{formatLkr(Math.abs(gainLoss))}</span>
                        </div>
                    </div>
                )}
                <div className="flex gap-3 pt-2">
                    <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
                    <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white" disabled={dispose.isPending} onClick={handleSubmit}>
                        {dispose.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Dispose
                    </Button>
                </div>
            </div>
        </>
    );
}
