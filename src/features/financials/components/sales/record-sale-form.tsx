"use client";

import { useState } from "react";
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

type Category = "latex" | "rubber" | "manioc" | "coconut" | "banana";

const CATEGORIES: { id: Category; label: string }[] = [
    { id: "latex", label: "Latex" },
    { id: "rubber", label: "Rubber Solid" },
    { id: "manioc", label: "Manioc" },
    { id: "coconut", label: "Coconut" },
    { id: "banana", label: "Banana" },
];

export function RecordSaleForm() {
    const [category, setCategory] = useState<Category>("latex");
    const [isPaymentReceived, setIsPaymentReceived] = useState(false);

    return (
        <Card className="shadow-sm p-6 gap-0 flex flex-col h-full">
            <CardTitle className="text-base font-semibold mb-5">Record Sale</CardTitle>

            {/* Category selector */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 gap-1 w-fit mb-6">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
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

            <div className="flex-1 space-y-4">
                {category === "latex" && (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>Load ID</Label>
                                <Input placeholder="LX-0001" />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Date</Label>
                                <Input type="date" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>Litres</Label>
                                <Input type="number" placeholder="0.00" />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Mass (kg)</Label>
                                <Input type="number" placeholder="0.00" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>Metrolac Reading</Label>
                                <Input type="number" placeholder="0.00" />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Unit Price (LKR/kg)</Label>
                                <Input type="number" placeholder="0.00" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Total Amount (LKR)</Label>
                            <Input type="number" placeholder="0.00" />
                        </div>
                    </>
                )}

                {category === "rubber" && (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>Load ID</Label>
                                <Input placeholder="RS-0001" />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Date</Label>
                                <Input type="date" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>Mass (kg)</Label>
                                <Input type="number" placeholder="0.00" />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Unit Price (LKR/kg)</Label>
                                <Input type="number" placeholder="0.00" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Amount (LKR)</Label>
                            <Input type="number" placeholder="0.00" />
                        </div>
                    </>
                )}

                {(category === "manioc" || category === "coconut" || category === "banana") && (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>Date</Label>
                                <Input type="date" />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Quantity (kg)</Label>
                                <Input type="number" placeholder="0.00" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>Unit Price (LKR/kg)</Label>
                                <Input type="number" placeholder="0.00" />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Amount (LKR)</Label>
                                <Input type="number" placeholder="0.00" />
                            </div>
                        </div>
                    </>
                )}

                {/* Payment received fields */}
                {isPaymentReceived && (
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
                        <p className="text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase">Payment Details</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>Payment Date</Label>
                                <Input type="date" />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Amount Received (LKR)</Label>
                                <Input type="number" placeholder="0.00" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Payment Type</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select payment type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cash">Cash</SelectItem>
                                    <SelectItem value="bank-boc">Bank Transfer - BOC</SelectItem>
                                    <SelectItem value="bank-peoples">Bank Transfer - Peoples</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex gap-3 mt-6">
                <Button variant="outline" className="flex-1">Record Sale</Button>
                <Button
                    className={`flex-1 text-white ${isPaymentReceived ? "bg-brand-600 hover:bg-brand-700" : "bg-brand-500 hover:bg-brand-600"}`}
                    onClick={() => setIsPaymentReceived(!isPaymentReceived)}
                >
                    {isPaymentReceived ? "Payment Entered" : "Payment Received"}
                </Button>
            </div>
        </Card>
    );
}
