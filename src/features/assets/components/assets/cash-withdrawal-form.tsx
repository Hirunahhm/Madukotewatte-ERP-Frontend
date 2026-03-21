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

export function CashWithdrawalForm() {
    return (
        <Card className="shadow-sm p-6 gap-0">
            <CardTitle className="text-base font-semibold mb-5">Record Withdrawal</CardTitle>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="space-y-1.5">
                    <Label>Date</Label>
                    <Input type="date" />
                </div>
                <div className="space-y-1.5">
                    <Label>Amount (LKR)</Label>
                    <Input type="number" placeholder="0.00" />
                </div>
                <div className="space-y-1.5">
                    <Label>Asset Type</Label>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="boc">BOC</SelectItem>
                            <SelectItem value="seylan">Seylan</SelectItem>
                            <SelectItem value="peoples">Peoples</SelectItem>
                            <SelectItem value="cash">Cash In Hand</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button className="bg-brand-500 hover:bg-brand-600 text-white">
                    Record Withdrawal
                </Button>
            </div>
        </Card>
    );
}
