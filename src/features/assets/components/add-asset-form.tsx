"use client";

import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AddAssetForm() {
    return (
        <Card className="shadow-sm gap-0 p-6">
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-6">
                <Plus className="w-4 h-4 text-brand-500" /> Add Asset
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</label>
                    <Input type="date" defaultValue="2024-05-15" className="border-gray-200 focus-visible:ring-1 focus-visible:ring-brand-500" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm z-10">$</span>
                        <Input type="text" placeholder="0.00" className="pl-7 border-gray-200 focus-visible:ring-1 focus-visible:ring-brand-500" />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Asset Type</label>
                    <Select>
                        <SelectTrigger className="w-full border-gray-200 focus-visible:ring-1 focus-visible:ring-brand-500">
                            <SelectValue placeholder="Select type..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="equity">Equity</SelectItem>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="real-estate">Real Estate</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button className="w-full bg-brand-500 hover:bg-brand-600 shadow-sm h-8">
                    Register Asset
                </Button>
            </div>
        </Card>
    );
}
