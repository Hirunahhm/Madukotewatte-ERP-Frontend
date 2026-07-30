"use client";

import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Pencil, Check, X } from "lucide-react";
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
import { useFixedAssets, useUpdateFixedAsset } from "@/features/assets/hooks/use-assets";
import { FIXED_ASSET_CATEGORIES } from "@/features/assets/types/assets.types";

function formatLkr(value: number): string {
    return `LKR ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export function FixedAssetsTable() {
    const [category, setCategory] = useState<string>("all");
    const [status, setStatus] = useState<string>("active");
    const [editing, setEditing] = useState<string | null>(null);
    const [draft, setDraft] = useState("");

    const { data, isLoading } = useFixedAssets({
        category: category === "all" ? undefined : category,
        status: status === "all" ? undefined : status,
        size: 50,
    });
    const updateAsset = useUpdateFixedAsset();
    const assets = data?.content ?? [];

    function startEdit(assetId: string, current: number) {
        setEditing(assetId);
        setDraft(String(current));
    }

    async function saveRevalue(assetId: string) {
        const value = parseFloat(draft);
        if (!Number.isNaN(value) && value >= 0) {
            await updateAsset.mutateAsync({ id: assetId, payload: { currentValue: value } });
        }
        setEditing(null);
    }

    async function markDisposed(assetId: string) {
        await updateAsset.mutateAsync({ id: assetId, payload: { status: "disposed" } });
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
            <Table>
                <TableHeader>
                    <TableRow className="dark:border-gray-700/40">
                        <TableHead className="text-xs">Name</TableHead>
                        <TableHead className="text-xs">Category</TableHead>
                        <TableHead className="text-xs">Acquired</TableHead>
                        <TableHead className="text-xs text-right">Acquisition Value</TableHead>
                        <TableHead className="text-xs text-right">Current Value</TableHead>
                        <TableHead className="text-xs">Location</TableHead>
                        <TableHead className="text-xs text-center">Status</TableHead>
                        <TableHead className="text-xs text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center py-8">
                                <Loader2 className="w-5 h-5 animate-spin inline text-brand-500" />
                            </TableCell>
                        </TableRow>
                    ) : assets.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center py-8 text-sm text-gray-400">No assets found.</TableCell>
                        </TableRow>
                    ) : assets.map((a) => (
                        <TableRow key={a.assetId} className="dark:border-gray-700/40">
                            <TableCell className="text-sm font-medium text-gray-800 dark:text-gray-200">{a.name}</TableCell>
                            <TableCell className="text-sm text-gray-500 dark:text-gray-400">{a.category}</TableCell>
                            <TableCell className="text-sm text-gray-500 dark:text-gray-400">{new Date(a.acquisitionDate).toLocaleDateString()}</TableCell>
                            <TableCell className="text-sm text-right text-gray-500 dark:text-gray-400">{formatLkr(a.acquisitionValue)}</TableCell>
                            <TableCell className="text-sm text-right">
                                {editing === a.assetId ? (
                                    <div className="flex items-center gap-1 justify-end">
                                        <Input
                                            type="number"
                                            value={draft}
                                            onChange={(e) => setDraft(e.target.value)}
                                            className="h-7 text-xs w-24"
                                        />
                                        <button onClick={() => saveRevalue(a.assetId)} className="text-emerald-600"><Check className="w-3.5 h-3.5" /></button>
                                        <button onClick={() => setEditing(null)} className="text-gray-400"><X className="w-3.5 h-3.5" /></button>
                                    </div>
                                ) : (
                                    <span className="font-medium text-gray-800 dark:text-gray-200">{formatLkr(a.currentValue)}</span>
                                )}
                            </TableCell>
                            <TableCell className="text-sm text-gray-500 dark:text-gray-400">{a.location ?? "—"}</TableCell>
                            <TableCell className="text-center">
                                {a.status === "active" ? (
                                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-medium">Active</Badge>
                                ) : (
                                    <Badge className="bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 text-xs font-medium">Disposed</Badge>
                                )}
                            </TableCell>
                            <TableCell className="text-right">
                                {editing !== a.assetId && (
                                    <div className="flex items-center gap-3 justify-end">
                                        <button onClick={() => startEdit(a.assetId, a.currentValue)} className="text-gray-400 hover:text-brand-600" title="Revalue">
                                            <Pencil className="w-3.5 h-3.5" />
                                        </button>
                                        {a.status === "active" && (
                                            <button onClick={() => markDisposed(a.assetId)} className="text-xs text-red-500 hover:text-red-600">
                                                Dispose
                                            </button>
                                        )}
                                    </div>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
}
