"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaleDetail, useUpdateSale, useSaleGeneralOptions } from "@/features/financials/hooks/use-financials";
import { saleCategoryLabel } from "@/features/financials/utils/sale-labels";
import type {
    SalesLedgerRow, SaleType, SaleDetail, SaleLatex, SaleCrop, SaleGeneral, SaleUpdatePayload,
} from "@/features/financials/types/financials.types";

function isGeneral(type: SaleType, sale: SaleDetail): sale is SaleGeneral {
    return type === "general";
}

function isLatex(type: SaleType, sale: SaleDetail): sale is SaleLatex {
    return type === "latex";
}

interface FormProps {
    type: SaleType;
    sale: SaleDetail;
    onClose: () => void;
}

function EditSaleForm({ type, sale, onClose }: FormProps) {
    const update = useUpdateSale();
    const { data: generalOptions } = useSaleGeneralOptions();
    const [error, setError] = useState<string | null>(null);

    const general = isGeneral(type, sale) ? sale : null;
    const latex = isLatex(type, sale) ? sale : null;
    const crop = !general && !latex ? (sale as SaleCrop) : null;

    const [buyerName, setBuyerName] = useState(sale.buyerName ?? "");
    const [dueDate, setDueDate] = useState(sale.dueDate ?? "");
    const [unitPrice, setUnitPrice] = useState(String(sale.unitPrice));
    const [saleDate, setSaleDate] = useState(general?.saleDate ?? crop?.saleDate ?? "");
    const [mass, setMass] = useState(latex ? String(latex.mass) : crop ? String(crop.mass) : "");
    const [litres, setLitres] = useState(latex ? String(latex.litres) : "");
    const [metrolac, setMetrolac] = useState(latex?.metrolacReading != null ? String(latex.metrolacReading) : "");
    const [variety, setVariety] = useState(crop?.type ?? "");
    const [product, setProduct] = useState(general?.product ?? "");
    const [description, setDescription] = useState(general?.description ?? "");
    const [quantity, setQuantity] = useState(general ? String(general.quantity) : "");
    const [unit, setUnit] = useState(general?.unit ?? "kg");

    async function handleSave() {
        setError(null);
        const buyer = buyerName.trim() || undefined;
        const due = dueDate || undefined;
        let payload: SaleUpdatePayload;
        if (general) {
            payload = {
                product, description: description.trim() || undefined, quantity: parseFloat(quantity), unit,
                unitPrice: parseFloat(unitPrice), buyerName: buyer, saleDate, dueDate: due,
            };
        } else if (latex) {
            payload = {
                loadId: latex.loadId, mass: parseFloat(mass), litres: parseFloat(litres),
                metrolacReading: metrolac ? parseFloat(metrolac) : undefined,
                unitPrice: parseFloat(unitPrice), buyerName: buyer, dueDate: due,
            };
        } else if (crop) {
            payload = {
                loadId: crop.loadId, type: crop.type !== undefined ? variety : undefined, saleDate,
                mass: parseFloat(mass), unitPrice: parseFloat(unitPrice), buyerName: buyer, dueDate: due,
            };
        } else {
            return;
        }
        try {
            await update.mutateAsync({ type, id: sale.saleId, payload });
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save the sale.");
        }
    }

    return (
        <div className="space-y-3 py-2">
            {general && (
                <>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>Product</Label>
                            <Select value={product} onValueChange={(v) => { if (v) setProduct(v); }}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {(generalOptions?.products ?? [product]).map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Unit</Label>
                            <Select value={unit} onValueChange={(v) => { if (v) setUnit(v); }}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {(generalOptions?.units ?? [unit]).map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label>Description</Label>
                        <Input value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>Quantity</Label>
                            <Input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Unit price (LKR)</Label>
                            <Input type="number" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} />
                        </div>
                    </div>
                </>
            )}
            {latex && (
                <>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>Litres</Label>
                            <Input type="number" value={litres} onChange={(e) => setLitres(e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Mass (kg)</Label>
                            <Input type="number" value={mass} onChange={(e) => setMass(e.target.value)} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>Metrolac reading</Label>
                            <Input type="number" max={150} value={metrolac} onChange={(e) => setMetrolac(e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Unit price (LKR/kg)</Label>
                            <Input type="number" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} />
                        </div>
                    </div>
                </>
            )}
            {crop && (
                <>
                    {crop.type !== undefined && (
                        <div className="space-y-1.5">
                            <Label>Variety / Type</Label>
                            <Input value={variety} onChange={(e) => setVariety(e.target.value)} />
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>Mass (kg)</Label>
                            <Input type="number" value={mass} onChange={(e) => setMass(e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Unit price (LKR/kg)</Label>
                            <Input type="number" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} />
                        </div>
                    </div>
                </>
            )}
            {(general || crop) && (
                <div className="space-y-1.5">
                    <Label>Sale date</Label>
                    <Input type="date" value={saleDate} onChange={(e) => setSaleDate(e.target.value)} />
                </div>
            )}
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                    <Label>Buyer</Label>
                    <Input value={buyerName} onChange={(e) => setBuyerName(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                    <Label>Payment due date</Label>
                    <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                </div>
            </div>
            {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
            <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={onClose} disabled={update.isPending}>Cancel</Button>
                <Button className="flex-1 bg-brand-500 hover:bg-brand-600 text-white" onClick={handleSave} disabled={update.isPending}>
                    {update.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                </Button>
            </div>
        </div>
    );
}

interface EditSaleDialogProps {
    row: SalesLedgerRow | null;
    onClose: () => void;
}

/** Edits an unpaid sale of any type; the form is chosen from the fetched sale. */
export function EditSaleDialog({ row, onClose }: EditSaleDialogProps) {
    const { data: sale, isLoading, error } = useSaleDetail(row?.saleType ?? null, row?.saleId ?? null);

    return (
        <Dialog open={row !== null} onOpenChange={(open) => { if (!open) onClose(); }}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit {row ? saleCategoryLabel(row.category) : ""} Sale</DialogTitle>
                </DialogHeader>
                {isLoading && <div className="py-8 text-center"><Loader2 className="w-5 h-5 animate-spin inline text-brand-500" /></div>}
                {error && <p role="alert" className="text-sm text-red-500">{error instanceof Error ? error.message : "Failed to load the sale."}</p>}
                {row && sale && <EditSaleForm key={sale.saleId} type={row.saleType} sale={sale} onClose={onClose} />}
            </DialogContent>
        </Dialog>
    );
}
