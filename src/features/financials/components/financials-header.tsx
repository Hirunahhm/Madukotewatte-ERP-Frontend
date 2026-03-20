"use client";

import { Button } from "@/components/ui/button";
import { useUiStore, type FinancialsTab } from "@/stores/ui-store";

const TABS: { id: FinancialsTab; label: string }[] = [
    { id: "sales", label: "Sales Tracking" },
    { id: "expenses", label: "Expenses Tracking" },
    { id: "stats", label: "Stats" },
];

export function FinancialsHeader() {
    const activeTab = useUiStore((state) => state.financialsTab);
    const setFinancialsTab = useUiStore((state) => state.setFinancialsTab);

    return (
        <div className="flex flex-col gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Financial Tracking</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Monitor sales, expenses, and financial performance across the estate.</p>
            </div>
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 gap-1 w-fit">
                {TABS.map((tab) => (
                    <Button
                        key={tab.id}
                        size="sm"
                        variant="ghost"
                        onClick={() => setFinancialsTab(tab.id)}
                        className={`h-8 text-sm ${activeTab === tab.id ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-gray-100" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
                    >
                        {tab.label}
                    </Button>
                ))}
            </div>
        </div>
    );
}
