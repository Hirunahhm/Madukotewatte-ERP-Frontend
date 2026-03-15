import { KpiCards } from "@/features/overview/components/kpi-cards";
import { WeatherWidget } from "@/features/overview/components/weather-widget";
import { YieldTrendChart } from "@/features/overview/components/yield-trend-chart";
import { FinancialHealth } from "@/features/overview/components/financial-health";
import { WorkforceEngagement } from "@/features/overview/components/workforce-engagement";

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Dashboard</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Estate overview and daily operations</p>
            </div>
            <KpiCards />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <WeatherWidget />
                <YieldTrendChart />
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <FinancialHealth />
                <WorkforceEngagement />
            </div>
        </div>
    );
}
