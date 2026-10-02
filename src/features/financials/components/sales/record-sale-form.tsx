"use client";

import { useEffect, useState } from "react";
import { ChevronDown, PlusCircle, Loader2, Plus } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useLoads } from "@/features/production/hooks/use-production";
import { LoadDialog } from "@/features/production/components/load-dialog";
import {
    useCreateSaleLatex, useMarkSalePaid,
    useCreateSaleCrop, useCreateSaleGeneral, useSaleGeneralOptions,
} from "@/features/financials/hooks/use-financials";
import type { SaleCategory, SaleType } from "@/features/financials/types/financials.types";
import { AccountSelect } from "@/features/accounts/components/account-select";
import { metrolacToMassFactor } from "@/features/financials/utils/latex-conversion";
import { toLocalDateInputValue } from "@/lib/utils";

const CATEGORIES: { id: SaleType; label: string }[] = [
    { id: "latex", label: "Latex" },
    { id: "rubber-solid", label: "Rubber Solid" },
    { id: "manioc", label: "Manioc" },
    { id: "coconut", label: "Coconut" },
    { id: "banana", label: "Banana" },
    { id: "general", label: "Other products" },
];

const CATEGORY_LOAD_TYPE: Record<SaleCategory, string> = {
    "latex": "field-latex",
    "rubber-solid": "scrap",
    "manioc": "manioc",
    "coconut": "coconut",
    "banana": "banana",
};

const today = () => toLocalDateInputValue();

export function RecordSaleForm() {
    const [isOpen, setIsOpen] = useState(false);
    const [category, setCategory] = useState<SaleType>("latex");
    const [loadDialogOpen, setLoadDialogOpen] = useState(false);

    const [loadId, setLoadId] = useState("");
    const [saleDate, setSaleDate] = useState(today());
    const [type, setType] = useState("");
    const [litres, setLitres] = useState("");
    const [mass, setMass] = useState("");
    const [metrolacReading, setMetrolacReading] = useState("");
    const [unitPrice, setUnitPrice] = useState("");
    const [buyerName, setBuyerName] = useState("");
    const [dueDate, setDueDate] = useState("");

    // general (other products)
    const [product, setProduct] = useState("Cocoa");
    const [description, setDescription] = useState("");
    const [quantity, setQuantity] = useState("");
    const [unit, setUnit] = useState("kg");

    const [isPaymentReceived, setIsPaymentReceived] = useState(false);
    const [accountCode, setAccountCode] = useState("");
    const [error, setError] = useState<string | null>(null);

    const isGeneral = category === "general";
    const loadType = isGeneral ? undefined : CATEGORY_LOAD_TYPE[category];
    const { data: loadsData } = useLoads({ loadType: loadType ?? "", size: 50 });
    const loads = isGeneral ? [] : (loadsData?.content ?? []);
    const { data: generalOptions } = useSaleGeneralOptions();

    const createLatex = useCreateSaleLatex();
    const markPaid = useMarkSalePaid();
    const createCrop = useCreateSaleCrop();
    const createGeneral = useCreateSaleGeneral();

    useEffect(() => {
        if (category === "latex" && litres && metrolacReading) {
            const factor = metrolacToMassFactor(parseFloat(metrolacReading));
            setMass((parseFloat(litres) * factor).toFixed(2));
        }
    }, [litres, metrolacReading, category]);

    const needsType = category === "manioc" || category === "coconut" || category === "banana";
    const isSubmitting = createLatex.isPending || createCrop.isPending || markPaid.isPending || createGeneral.isPending;
    const generalTotal = quantity && unitPrice ? parseFloat(quantity) * parseFloat(unitPrice) : 0;

    function resetFields() {
        setLoadId("");
        setType("");
        setLitres("");
        setMass("");
        setMetrolacReading("");
        setUnitPrice("");
        setBuyerName("");
        setDueDate("");
        setDescription("");
        setQuantity("");
        setIsPaymentReceived(false);
        setAccountCode("");
    }

    async function handleSubmit() {
        if (!unitPrice) return;
        if (isPaymentReceived && !accountCode) return;
        setError(null);
        const buyer = buyerName.trim() || undefined;
        const due = dueDate || undefined;

        try {
            if (category === "general") {
                if (!quantity || !saleDate) return;
                await createGeneral.mutateAsync({
                    product, description: description.trim() || undefined, quantity: parseFloat(quantity), unit,
                    unitPrice: parseFloat(unitPrice), buyerName: buyer, saleDate, dueDate: due,
                    isPaid: isPaymentReceived || undefined,
                    accountCode: isPaymentReceived ? accountCode : undefined,
                    paymentDate: isPaymentReceived ? saleDate : undefined,
                });
            } else if (category === "latex") {
                if (!loadId || !litres || !mass) return;
                const sale = await createLatex.mutateAsync({
                    loadId,
                    mass: parseFloat(mass),
                    litres: parseFloat(litres),
                    metrolacReading: metrolacReading ? parseFloat(metrolacReading) : undefined,
                    unitPrice: parseFloat(unitPrice),
                    buyerName: buyer,
                    dueDate: due,
                });
                if (isPaymentReceived) {
                    await markPaid.mutateAsync({ type: "latex", id: sale.saleId, payload: { accountCode, paymentDate: saleDate } });
                }
            } else {
                if (!loadId || !mass || !saleDate || (needsType && !type)) return;
                await createCrop.mutateAsync({
                    category,
                    payload: {
                        loadId, type: needsType ? type : undefined, saleDate, mass: parseFloat(mass), unitPrice: parseFloat(unitPrice),
                        buyerName: buyer, dueDate: due,
                        isPaid: isPaymentReceived || undefined,
                        accountCode: isPaymentReceived ? accountCode : undefined,
                        paymentDate: isPaymentReceived ? saleDate : undefined,
                    },
                });
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to record the sale.");
            return;
        }
        resetFields();
    }

    const canSubmit = isGeneral ? !!quantity && !!unitPrice : !!loadId && !!unitPrice;

    return (
        <Card className="shadow-sm gap-0 overflow-hidden">
            <button
                type="button"
                onClick={() => setIsOpen((v) => !v)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
                <div className="flex items-center gap-2.5">
                    <PlusCircle className="w-4 h-4 text-brand-500" />
                    <CardTitle className="text-base font-semibold">Record New Sale</CardTitle>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <div className="px-6 pb-6 border-t border-gray-100 dark:border-gray-800 pt-5 space-y-4">
                    <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 gap-1 w-fit flex-wrap">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => { setCategory(cat.id); resetFields(); }}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                                    category === cat.id
                                        ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-gray-100"
                                        : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {!isGeneral && (
                            <div className="space-y-1.5">
                                <Label>Load</Label>
                                <div className="flex gap-2">
                                    <Select value={loadId} onValueChange={(v) => { if (v) setLoadId(v); }}>
                                        <SelectTrigger className="flex-1">
                                            <SelectValue placeholder="Select Load…" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {loads.map((l) => (
                                                <SelectItem key={l.loadId} value={l.loadId}>
                                                    {l.loadId.slice(0, 8).toUpperCase()} — {new Date(l.startDate).toLocaleDateString()}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button type="button" variant="outline" size="icon" onClick={() => setLoadDialogOpen(true)} title="Create new load">
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                        {isGeneral && (
                            <div className="space-y-1.5">
                                <Label>Product</Label>
                                <Select value={product} onValueChange={(v) => { if (v) setProduct(v); }}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {(generalOptions?.products ?? [product]).map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                        <div className="space-y-1.5">
                            <Label>Sale date</Label>
                            <Input type="date" value={saleDate} onChange={(e) => setSaleDate(e.target.value)} />
                        </div>
                    </div>

                    {needsType && (
                        <div className="space-y-1.5">
                            <Label>Variety / Type</Label>
                            <Input placeholder="e.g. White, King Coconut, Ambul" value={type} onChange={(e) => setType(e.target.value)} />
                        </div>
                    )}

                    {category === "latex" && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label>Litres</Label>
                                    <Input type="number" placeholder="0.00" value={litres} onChange={(e) => setLitres(e.target.value)} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Mass (kg)</Label>
                                    <Input type="number" placeholder="0.00" value={mass} onChange={(e) => setMass(e.target.value)} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label>Metrolac Reading</Label>
                                    <Input type="number" max={150} placeholder="0.00" value={metrolacReading} onChange={(e) => setMetrolacReading(e.target.value)} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Unit Price (LKR/kg)</Label>
                                    <Input type="number" placeholder="0.00" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} />
                                </div>
                            </div>
                        </>
                    )}

                    {category !== "latex" && !isGeneral && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>Mass (kg)</Label>
                                <Input type="number" placeholder="0.00" value={mass} onChange={(e) => setMass(e.target.value)} />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Unit Price (LKR/kg)</Label>
                                <Input type="number" placeholder="0.00" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} />
                            </div>
                        </div>
                    )}

                    {isGeneral && (
                        <>
                            <div className="space-y-1.5">
                                <Label>Description (optional)</Label>
                                <Input placeholder="e.g. Dried cocoa beans, grade A" value={description} onChange={(e) => setDescription(e.target.value)} />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                    <Label>Quantity</Label>
                                    <Input type="number" placeholder="0.00" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
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
                                <div className="space-y-1.5">
                                    <Label>Unit Price (LKR)</Label>
                                    <Input type="number" placeholder="0.00" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} />
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Total: <span className="font-semibold text-gray-900 dark:text-gray-100">LKR {generalTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                            </p>
                        </>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label>Buyer (optional)</Label>
                            <Input placeholder="e.g. Perera Traders" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Payment due date (optional)</Label>
                            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                        </div>
                    </div>

                    {isPaymentReceived && (
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
                            <p className="text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase">Payment Details</p>
                            <div className="space-y-1.5">
                                <Label>Received into</Label>
                                <AccountSelect value={accountCode} onValueChange={setAccountCode} allowedTypes={["CASH", "BANK"]} />
                            </div>
                        </div>
                    )}

                    {error && <p role="alert" className="text-sm text-red-500">{error}</p>}

                    <div className="flex gap-3 pt-1">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={handleSubmit}
                            disabled={isSubmitting || !canSubmit}
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Record Sale"}
                        </Button>
                        <Button
                            className={`flex-1 text-white ${isPaymentReceived ? "bg-brand-600 hover:bg-brand-700" : "bg-brand-500 hover:bg-brand-600"}`}
                            onClick={() => setIsPaymentReceived((v) => !v)}
                        >
                            {isPaymentReceived ? "Payment Entered" : "Payment Received"}
                        </Button>
                    </div>
                </div>
            )}

            {!isGeneral && (
                <LoadDialog
                    open={loadDialogOpen}
                    onOpenChange={setLoadDialogOpen}
                    initialData={null}
                    defaultLoadType={CATEGORY_LOAD_TYPE[category]}
                />
            )}
        </Card>
    );
}
