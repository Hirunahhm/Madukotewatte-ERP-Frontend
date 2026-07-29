"use client";

import { useUiStore } from "@/stores/ui-store";
import { SalesScreen } from "./sales/sales-screen";
import { ExpensesScreen } from "./expenses/expenses-screen";
import { StatsScreen } from "./stats/stats-screen";

export function FinancialsPageClient() {
    const activeTab = useUiStore((state) => state.financialsTab);

    if (activeTab === "sales") return <SalesScreen />;
    if (activeTab === "expenses") return <ExpensesScreen />;

    return <StatsScreen />;
}
