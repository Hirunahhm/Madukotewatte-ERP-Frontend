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

export function RecurringPaymentForm() {
    return (
        <Card className="shadow-sm p-6 gap-0">
            <CardTitle className="text-base font-semibold mb-5">Log Recurring Payment</CardTitle>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="space-y-1.5">
                    <Label>Date</Label>
                    <Input type="date" />
                </div>
                <div className="space-y-1.5">
                    <Label>Card</Label>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Select card" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="sampath">Sampath</SelectItem>
                            <SelectItem value="peoples">Peoples</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1.5">
                    <Label>Amount (LKR)</Label>
                    <Input type="number" placeholder="0.00" />
                </div>
                <Button className="bg-brand-500 hover:bg-brand-600 text-white">
                    Record Payment
                </Button>
            </div>
        </Card>
    );
}
