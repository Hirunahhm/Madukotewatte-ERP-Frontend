"use client";

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

export function RecordLiabilityForm() {
    return (
        <Card className="shadow-sm p-6 gap-0 flex flex-col h-full">
            <CardTitle className="text-base font-semibold mb-5">Record Liability</CardTitle>
            <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label>Date</Label>
                        <Input type="date" />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Type</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="loan">Loan</SelectItem>
                                <SelectItem value="credit-card">Credit Card</SelectItem>
                                <SelectItem value="overdraft">Overdraft</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label>Amount (LKR)</Label>
                        <Input type="number" placeholder="0.00" />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Interest Rate (%)</Label>
                        <Input type="number" placeholder="0.00" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label>Principal Amount (LKR)</Label>
                        <Input type="number" placeholder="0.00" />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Transfer Type</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select transfer" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="bank">Bank Transfer</SelectItem>
                                <SelectItem value="cash">Cash</SelectItem>
                                <SelectItem value="credit-card">Credit Card</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
            <Button className="w-full mt-6 bg-brand-500 hover:bg-brand-600 text-white">
                Record Liability
            </Button>
        </Card>
    );
}
