"use client";

import { Download, ArrowUpRight, Plus, Filter, Wallet, Layers, Banknote } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AssetsPage() {
    const chartData = [
        { name: '2023-10', uv: 800000 },
        { name: '2023-11', uv: 850000 },
        { name: '2023-12', uv: 900000 },
        { name: '2024-01', uv: 890000 },
        { name: '2024-02', uv: 1050000 },
        { name: '2024-03', uv: 1150000 },
        { name: '2024-04', uv: 1248500 },
    ];

    const recentInjections = [
        { date: 'May 12, 2024', type: 'Equity', amount: '$45,000' },
        { date: 'May 10, 2024', type: 'Cash', amount: '$12,000' },
        { date: 'May 08, 2024', type: 'Fixed Income', amount: '$8,500' },
        { date: 'May 05, 2024', type: 'Real Estate', amount: '$150,000' },
        { date: 'May 01, 2024', type: 'Commodities', amount: '$5,000' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 uppercase">LIQUIDITY OVERVIEW</h1>
                    <p className="text-sm text-gray-500 mt-1">Real-time consolidated asset management and liquidity tracking.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-brand-200 text-brand-600 px-4 py-2 rounded-md text-sm font-semibold hover:bg-brand-50 transition-colors">
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-brand-500 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-brand-600 shadow-sm transition-colors">
                        <ArrowUpRight className="w-4 h-4" /> Portfolio Insights
                    </button>
                </div>
            </div>

            {/* Hero KPI Card */}
            <div className="rounded-xl border border-gray-100 bg-white p-12 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center mb-6">
                    <Wallet className="w-6 h-6 text-brand-500" />
                </div>
                <span className="text-xs font-bold tracking-wider text-gray-500 uppercase mb-2">Total Liquidity</span>
                <h2 className="text-5xl font-bold text-gray-900 tracking-tight flex items-baseline justify-center">
                    $1,248,500<span className="text-2xl text-gray-400 font-semibold">.00</span>
                </h2>
                <span className="mt-6 inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100">
                    <ArrowUpRight className="w-3 h-3" /> +12.4% from last quarter
                </span>
            </div>

            {/* Add Asset Form Panel */}
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-6">
                    <Plus className="w-4 h-4 text-brand-500" /> Add Asset
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Date</label>
                        <input type="date" defaultValue="2024-05-15" className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brand-500 outline-none" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                            <input type="text" placeholder="0.00" className="w-full border border-gray-200 rounded-md pl-7 pr-3 py-2 text-sm focus:ring-1 focus:ring-brand-500 outline-none" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Asset Type</label>
                        <select className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brand-500 outline-none bg-white">
                            <option>Select type...</option>
                            <option>Equity</option>
                            <option>Cash</option>
                            <option>Real Estate</option>
                        </select>
                    </div>
                    <button className="w-full bg-brand-500 text-white font-bold text-sm py-2 rounded-md hover:bg-brand-600 transition-colors shadow-sm h-[38px]">
                        Register Asset
                    </button>
                </div>
            </div>

            {/* Charts & Recent Injections Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Step Chart */}
                <div className="lg:col-span-2 rounded-xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col">
                    <div className="flex items-start justify-between mb-8">
                        <div>
                            <h3 className="text-base font-semibold text-gray-900">Liquidity Growth</h3>
                            <p className="text-sm text-gray-500 mt-1">Visualizing capital accumulation over time</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded text-xs font-bold text-gray-700 hover:bg-gray-50">
                                <Filter className="w-3.5 h-3.5" /> Filter
                            </button>
                            <button className="px-3 py-1.5 bg-gray-100 rounded text-xs font-bold text-gray-700">1Y View</button>
                        </div>
                    </div>

                    <div className="h-72 w-full mt-auto">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorO" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} dy={10} />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                                    tickFormatter={(val) => `$${val / 1000}k`}
                                />
                                <Tooltip
                                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Liquidity']}
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #f3f4f6' }}
                                />
                                <Area
                                    type="stepAfter"
                                    dataKey="uv"
                                    stroke="#22c55e"
                                    strokeWidth={2}
                                    fill="url(#colorO)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Injections Table Snippet */}
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                    <h3 className="text-base font-semibold text-gray-900">Recent Injections</h3>
                    <p className="text-sm text-gray-500 mt-1 mb-6">Latest assets added to the liquidity pool</p>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-white text-gray-500 font-bold border-b border-gray-100 text-xs">
                                <tr>
                                    <th className="pb-3 pr-4 font-semibold text-gray-500">Transaction<br />Date</th>
                                    <th className="pb-3 px-4 font-semibold text-gray-500">Asset Type</th>
                                    <th className="pb-3 pl-4 font-semibold text-gray-500 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentInjections.map((inj, idx) => (
                                    <tr key={idx}>
                                        <td className="py-4 pr-4 text-xs text-gray-500">{inj.date}</td>
                                        <td className="py-4 px-4 font-medium text-gray-900 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-brand-500"></div>
                                            {inj.type}
                                        </td>
                                        <td className="py-4 pl-4 text-right font-bold text-gray-900">{inj.amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Bottom KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-xl bg-gray-50 border border-gray-100 p-6 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                        <ArrowUpRight className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="text-[10px] font-bold tracking-wider text-gray-500 uppercase block mb-1">MTD Yield</span>
                        <p className="text-xl font-bold text-gray-900">+0.85%</p>
                    </div>
                </div>
                <div className="rounded-xl bg-gray-50 border border-gray-100 p-6 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600">
                        <Layers className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="text-[10px] font-bold tracking-wider text-gray-500 uppercase block mb-1">Asset Count</span>
                        <p className="text-xl font-bold text-gray-900">14 Entities</p>
                    </div>
                </div>
                <div className="rounded-xl bg-gray-50 border border-gray-100 p-6 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <Banknote className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="text-[10px] font-bold tracking-wider text-gray-500 uppercase block mb-1">Available Cash</span>
                        <p className="text-xl font-bold text-gray-900">$185,400</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
