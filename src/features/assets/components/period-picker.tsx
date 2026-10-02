"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PERIOD_PRESET_LABEL, resolvePeriod, type DateRange, type PeriodPreset } from "@/features/assets/utils/period";
import { toLocalDateInputValue } from "@/lib/utils";

interface PeriodPickerProps {
    initial?: PeriodPreset;
    onChange: (range: DateRange) => void;
}

const PRESETS = Object.keys(PERIOD_PRESET_LABEL) as PeriodPreset[];

/** Month / quarter / year / financial-year / custom period selector; reports the resolved range. */
export function PeriodPicker({ initial = "this-year", onChange }: PeriodPickerProps) {
    const [preset, setPreset] = useState<PeriodPreset>(initial);
    const [customFrom, setCustomFrom] = useState(() => toLocalDateInputValue(new Date(new Date().getFullYear(), 0, 1)));
    const [customTo, setCustomTo] = useState(() => toLocalDateInputValue());

    const items = useMemo(() => PRESETS.map((p) => ({ value: p, label: PERIOD_PRESET_LABEL[p] })), []);

    function apply(nextPreset: PeriodPreset, from: string, to: string) {
        onChange(resolvePeriod(nextPreset, { from, to }));
    }

    return (
        <div className="flex flex-wrap items-end gap-3">
            <div className="space-y-1.5">
                <Label className="text-xs">Period</Label>
                <Select
                    value={preset}
                    items={items}
                    onValueChange={(v) => {
                        if (!v) return;
                        const next = v as PeriodPreset;
                        setPreset(next);
                        apply(next, customFrom, customTo);
                    }}
                >
                    <SelectTrigger className="w-60 h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        {PRESETS.map((p) => (
                            <SelectItem key={p} value={p}>{PERIOD_PRESET_LABEL[p]}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            {preset === "custom" && (
                <>
                    <div className="space-y-1.5">
                        <Label className="text-xs">From</Label>
                        <Input type="date" className="h-8 text-xs" value={customFrom}
                            onChange={(e) => { setCustomFrom(e.target.value); apply("custom", e.target.value, customTo); }} />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">To</Label>
                        <Input type="date" className="h-8 text-xs" value={customTo}
                            onChange={(e) => { setCustomTo(e.target.value); apply("custom", customFrom, e.target.value); }} />
                    </div>
                </>
            )}
        </div>
    );
}
