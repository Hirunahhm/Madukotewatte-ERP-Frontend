"use client";

import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useDeleteFixedAsset, useFixedAssets } from "@/features/assets/hooks/use-assets";
import { FIXED_ASSET_CATEGORIES, type FixedAsset } from "@/features/assets/types/assets.types";
import { formatLkr } from "@/features/accounts/utils/format";
import { DisposeAssetDialog } from "./dispose-asset-dialog";
import { EditAssetDialog } from "./edit-asset-dialog";

export function FixedAssetsTable() {
    const [category, setCategory] = useState<string>("all");
    const [status, setStatus] = useState<string>("active");
    const [disposing, setDisposing] = useState<FixedAsset | null>(null);
    const [editing, setEditing] = useState<FixedAsset | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { data, isLoading } = useFixedAssets({
        category: category === "all" ? undefined : category,
        status: status === "all" ? undefined : status,
        size: 100,
    });
    const deleteAsset = useDeleteFixedAsset();
    const assets = data?.content ?? [];

    async function handleDelete(asset: FixedAsset) {
        const note = asset.purchaseAccountCode
            ? ` The ${formatLkr(asset.acquisitionValue)} paid from ${asset.purchaseAccountCode} will be put back.`
            : "";
        if (!window.confirm(`Delete "${asset.name}"? Use this only for assets added in error.${note}`)) return;
        setError(null);
        try {
            await deleteAsset.mutateAsync(asset.assetId);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete asset.");
        }
    }

    return (
        <Card className="shadow-sm gap-0">
            <div className="p-6 pb-4 flex items-end gap-4 flex-wrap">
                <CardTitle className="text-base font-semibold mr-auto">Fixed Assets</CardTitle>
                <div className="space-y-1.5">
                    <Label className="text-xs">Category</Label>
                    <Select value={category} onValueChange={(v) => { if (v) setCategory(v); }}>
                        <SelectTrigger className="w-36 h-8 text-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {FIXED_ASSET_CATEGORIES.map((c) => (
                                <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1.5">
                    <Label className="text-xs">Status</Label>
                    <Select value={status} onValueChange={(v) => { if (v) setStatus(v); }}>
                        <SelectTrigger className="w-32 h-8 text-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="disposed">Disposed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            {error && <p role="alert" className="px-6 pb-3 text-sm text-red-500">{error}</p>}
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="dark:border-gray-700/40">
                            <TableHead className="text-xs">Name</TableHead>
                            <TableHead className="text-xs">Category</TableHead>
                            <TableHead className="text-xs">Acquired</TableHead>
                            <TableHead className="text-xs text-right">Cost</TableHead>
                            <TableHead className="text-xs text-right">Accum. Depreciation</TableHead>
                            <TableHead className="text-xs text-right">Net Book Value</TableHead>
                            <TableHead className="text-xs">Basis</TableHead>
                            <TableHead className="text-xs text-center">Status</TableHead>
                            <TableHead className="text-xs text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center py-8">
                                    <Loader2 className="w-5 h-5 animate-spin inline text-brand-500" />
                                </TableCell>
                            </TableRow>
                        ) : assets.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center py-8 text-sm text-gray-400">No assets found.</TableCell>
                            </TableRow>
                        ) : assets.map((a) => (
                            <TableRow key={a.assetId} className="dark:border-gray-700/40">
                                <TableCell className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                    {a.name}
                                    <div className="text-[11px] font-normal text-gray-400">
                                        {a.purchaseAccountCode ? `Paid from ${a.purchaseAccountCode}` : "Pre-existing"}
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm text-gray-500 dark:text-gray-400">{a.category}</TableCell>
                                <TableCell className="text-sm text-gray-500 dark:text-gray-400">{a.acquisitionDate}</TableCell>
                                <TableCell className="text-sm text-right text-gray-500 dark:text-gray-400">{formatLkr(a.acquisitionValue)}</TableCell>
                                <TableCell className="text-sm text-right text-gray-500 dark:text-gray-400">{formatLkr(a.accumulatedDepreciation)}</TableCell>
                                <TableCell className="text-sm text-right font-medium text-gray-800 dark:text-gray-200">
                                    {a.status === "disposed" && a.gainLoss !== null ? (
                                        <span className={a.gainLoss >= 0 ? "text-emerald-600" : "text-red-600"}>
                                            {a.gainLoss >= 0 ? "Gain " : "Loss "}{formatLkr(Math.abs(a.gainLoss))}
                                        </span>
                                    ) : formatLkr(a.netBookValue)}
                                </TableCell>
                                <TableCell className="text-xs text-gray-500 dark:text-gray-400">
                                    {a.depreciationMethod === "NONE"
                                        ? "Not depreciated"
                                        : `${a.usefulLifeYears ?? "-"} yrs, residual ${formatLkr(a.residualValue)}`}
                                </TableCell>
                                <TableCell className="text-center">
                                    {a.status === "active" ? (
                                        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-medium">Active</Badge>
                                    ) : (
                                        <Badge className="bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 text-xs font-medium">
                                            Disposed {a.disposalDate}
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    {a.status === "active" && (
                                        <div className="flex items-center gap-3 justify-end">
                                            <button onClick={() => setEditing(a)} className="text-gray-400 hover:text-brand-600" title="Edit">
                                                <Pencil className="w-3.5 h-3.5" />
                                            </button>
                                            <button onClick={() => setDisposing(a)} className="text-xs text-red-500 hover:text-red-600">
                                                Dispose
                                            </button>
                                            <button onClick={() => handleDelete(a)} className="text-gray-400 hover:text-red-600" title="Delete (entered in error)">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <DisposeAssetDialog asset={disposing} onClose={() => setDisposing(null)} />
            <EditAssetDialog asset={editing} onClose={() => setEditing(null)} />
        </Card>
    );
}
