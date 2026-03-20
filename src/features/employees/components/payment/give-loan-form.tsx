"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
    Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const EMPLOYEES = [
    "Arjun Das",
    "Siti Aminah",
    "Rajesh Kumar",
    "Linh Pham",
    "Karthik Raja",
    "Wong Kar Wai",
    "Elena Gilbert",
    "Marcus Tan",
];

export function GiveLoanForm() {
    const [employee, setEmployee] = useState("");

    return (
        <Card className="p-5 shadow-sm gap-0">
            <p className="text-xs font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-4">Issue New Loan</p>
            <div className="space-y-3">
                <div className="space-y-1.5">
                    <Label>Employee</Label>
                    <Select value={employee} onValueChange={(v) => { if (v !== null) setEmployee(v); }}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select employee" />
                        </SelectTrigger>
                        <SelectContent>
                            {EMPLOYEES.map((name) => (
                                <SelectItem key={name} value={name}>{name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-1.5">
                    <Label>Date</Label>
                    <Input type="date" />
                </div>

                <div className="space-y-1.5">
                    <Label>Loan Amount (LKR)</Label>
                    <Input type="number" placeholder="0.00" min={0} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <Label>Interest Rate</Label>
                        <Input type="number" placeholder="% p.a." min={0} step={0.1} />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Installment (LKR)</Label>
                        <Input type="number" placeholder="0.00" min={0} />
                    </div>
                </div>

                <Button className="w-full bg-brand-500 hover:bg-brand-600 text-white mt-1">
                    Issue Loan
                </Button>
            </div>
        </Card>
    );
}
