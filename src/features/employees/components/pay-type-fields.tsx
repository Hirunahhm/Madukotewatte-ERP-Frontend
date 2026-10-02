"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PAY_TYPE_LABELS, type PayType } from "@/features/employees/types/employee.types";

export interface PayFieldsValue {
    payType: PayType;
    salary: string;
    ratePerTree: string;
    hourlyRate: string;
}

interface Props {
    value: PayFieldsValue;
    onChange: (patch: Partial<PayFieldsValue>) => void;
}

/** Pay type selector with the one rate field that pay type needs. */
export function PayTypeFields({ value, onChange }: Props) {
    return (
        <>
            <div className="space-y-1.5">
                <Label>Paid by</Label>
                <Select value={value.payType} onValueChange={(v) => { if (v) onChange({ payType: v as PayType }); }}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        {(Object.keys(PAY_TYPE_LABELS) as PayType[]).map((t) => (
                            <SelectItem key={t} value={t}>{PAY_TYPE_LABELS[t]}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            {value.payType === "FIXED_MONTHLY" && (
                <div className="space-y-1.5">
                    <Label>Monthly salary (LKR)</Label>
                    <Input type="number" min={0} placeholder="e.g. 45000" value={value.salary} onChange={(e) => onChange({ salary: e.target.value })} />
                </div>
            )}
            {value.payType === "PER_TREE" && (
                <div className="space-y-1.5">
                    <Label>Rate per tree (LKR)</Label>
                    <Input type="number" min={0} step="0.01" placeholder="e.g. 5.00" value={value.ratePerTree} onChange={(e) => onChange({ ratePerTree: e.target.value })} />
                </div>
            )}
            {value.payType === "HOURLY" && (
                <div className="space-y-1.5">
                    <Label>Hourly rate (LKR)</Label>
                    <Input type="number" min={0} step="0.01" placeholder="e.g. 250" value={value.hourlyRate} onChange={(e) => onChange({ hourlyRate: e.target.value })} />
                </div>
            )}
        </>
    );
}

/** Message for the first missing rate, or null when the pay fields are complete. */
export function payFieldsError(value: PayFieldsValue): string | null {
    if (value.payType === "FIXED_MONTHLY" && !(Number(value.salary) > 0)) return "A monthly salary is required.";
    if (value.payType === "PER_TREE" && !(Number(value.ratePerTree) > 0)) return "A rate per tree is required.";
    if (value.payType === "HOURLY" && !(Number(value.hourlyRate) > 0)) return "An hourly rate is required.";
    return null;
}
