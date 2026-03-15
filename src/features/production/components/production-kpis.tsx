"use client";

export function ProductionKpis() {
    return (
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Latex Production Management</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Monitor quality, log daily intake, and analyze yield trends.</p>
            </div>
            <div className="flex gap-6 text-right">
                <div>
                    <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider">CURRENT PRICE (RSS 1)</span>
                    <p className="text-xl font-bold text-brand-600">$1.82 / kg</p>
                </div>
                <div>
                    <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider">DAILY YIELD DELTA</span>
                    <p className="text-xl font-bold text-gray-900 dark:text-gray-100">+12.4%</p>
                </div>
            </div>
        </div>
    );
}
