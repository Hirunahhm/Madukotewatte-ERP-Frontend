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

export function RecordExpenseForm() {
    const [isPaid, setIsPaid] = useState(false);

    return (
        <Card className="shadow-sm p-6 gap-0 flex flex-col h-full">
            <CardTitle className="text-base font-semibold mb-5">Record Expense</CardTitle>

            <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label>Date</Label>
                        <Input type="date" />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Expense Type</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="fertilizer">Fertilizer</SelectItem>
                                <SelectItem value="labor">Labor</SelectItem>
                                <SelectItem value="maintenance">Maintenance</SelectItem>
                                <SelectItem value="chemicals">Chemicals</SelectItem>
                                <SelectItem value="utilities">Utilities</SelectItem>
                                <SelectItem value="logistics">Logistics</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label>Description</Label>
                    <textarea
                        rows={3}
                        placeholder="Describe the expense..."
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none dark:bg-gray-900 dark:border-gray-700"
                    />
                </div>

                {isPaid && (
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
                        <p className="text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase">Payment Details</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>Payment Date</Label>
                                <Input type="date" />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Expense Amount (LKR)</Label>
                                <Input type="number" placeholder="0.00" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Transaction Type</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select transaction type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="bank">Bank Transfer</SelectItem>
                                    <SelectItem value="credit-card">Credit Card</SelectItem>
                                    <SelectItem value="cash">Cash</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex gap-3 mt-6">
                <Button variant="outline" className="flex-1">Record Expense</Button>
                <Button
                    className={`flex-1 text-white ${isPaid ? "bg-brand-600 hover:bg-brand-700" : "bg-brand-500 hover:bg-brand-600"}`}
                    onClick={() => setIsPaid(!isPaid)}
                >
                    {isPaid ? "Payment Entered" : "Paid"}
                </Button>
            </div>
        </Card>
    );
}
