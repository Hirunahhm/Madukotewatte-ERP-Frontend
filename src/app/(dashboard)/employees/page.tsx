"use client";

import { Search, Plus, Download, ChevronRight, Droplet } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from "@/lib/utils";
import { chartColors } from "@/lib/theme";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";

export default function EmployeesPage() {
    const chartData = [
        { name: 'Mon', uv: 400 },
        { name: 'Tue', uv: 300 },
        { name: 'Wed', uv: 550 },
        { name: 'Thu', uv: 480 },
        { name: 'Fri', uv: 620 },
        { name: 'Sat', uv: 320 },
        { name: 'Sun', uv: 200 },
    ];

    const employees = [
        { id: 'EMP001', name: 'Arjun Das', role: 'Lead Tapper', status: 'Present', lastActivity: '06:45 AM', trees: 142 },
        { id: 'EMP002', name: 'Siti Aminah', role: 'Senior Tapper', status: 'Present', lastActivity: '07:12 AM', trees: 128 },
        { id: 'EMP003', name: 'Rajesh Kumar', role: 'Tapper', status: 'Present', lastActivity: '07:30 AM', trees: 115 },
        { id: 'EMP004', name: 'Linh Pham', role: 'Junior Tapper', status: 'Absent', lastActivity: '-', trees: 0 },
        { id: 'EMP005', name: 'Karthik Raja', role: 'General Labour', status: 'Present', lastActivity: '08:00 AM', trees: 45 },
        { id: 'EMP006', name: 'Wong Kar Wai', role: 'Tapper', status: 'On Leave', lastActivity: '-', trees: 0 },
        { id: 'EMP007', name: 'Elena Gilbert', role: 'Tapper', status: 'Present', lastActivity: '06:50 AM', trees: 130 },
        { id: 'EMP008', name: 'Marcus Tan', role: 'Assistant Manager', status: 'Present', lastActivity: '06:30 AM', trees: 20 },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Employee Management</h1>
                        <Badge variant="outline" className="text-brand-600 bg-brand-50 border-brand-200 font-semibold">128 Active Staff</Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Monitor performance, track attendance, and manage labor logistics.</p>
                </div>
                <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
                    <span className="text-xs font-semibold text-gray-500 px-3">VIEW STATS FOR:</span>
                    <Button size="sm" className="bg-brand-500 hover:bg-brand-600 text-white h-7 text-xs">Monthly</Button>
                    <Button variant="ghost" size="sm" className="text-gray-500 h-7 text-xs">Annual</Button>
                    <Button variant="ghost" size="sm" className="text-gray-500 h-7 text-xs">Lifetime</Button>
                </div>
            </div>

            {/* Top Performers Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1 */}
                <Card className="shadow-sm gap-0 p-6 relative">
                    <Badge className="absolute top-4 right-4 bg-yellow-100 text-yellow-700 border-transparent">#1</Badge>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-900">Arjun Das</h3>
                            <p className="text-xs text-brand-600">↗ +12% efficiency increase</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <p className="text-xs font-semibold text-gray-500">TREES TAPPED</p>
                            <p className="text-lg font-bold text-gray-900">450</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-500">LATEX VOL (L)</p>
                            <p className="text-lg font-bold text-brand-500">1250</p>
                        </div>
                    </div>
                    <div className="flex items-end justify-between border-t border-gray-50 pt-4">
                        <div>
                            <p className="text-xs font-semibold text-gray-500">TOTAL SALARY</p>
                            <p className="text-lg font-bold text-gray-900">$5700</p>
                        </div>
                        <Badge variant="secondary" className="text-[10px] font-bold text-gray-500">Elite Tier</Badge>
                    </div>
                </Card>
                {/* Card 2 */}
                <Card className="shadow-sm gap-0 p-6 relative">
                    <Badge className="absolute top-4 right-4 bg-gray-100 text-gray-600 border-transparent">#2</Badge>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-900">Siti Aminah</h3>
                            <p className="text-xs text-brand-600">↗ +8% efficiency increase</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <p className="text-xs font-semibold text-gray-500">TREES TAPPED</p>
                            <p className="text-lg font-bold text-gray-900">425</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-500">LATEX VOL (L)</p>
                            <p className="text-lg font-bold text-brand-500">1180</p>
                        </div>
                    </div>
                    <div className="flex items-end justify-between border-t border-gray-50 pt-4">
                        <div>
                            <p className="text-xs font-semibold text-gray-500">TOTAL SALARY</p>
                            <p className="text-lg font-bold text-gray-900">$5400</p>
                        </div>
                        <Badge variant="secondary" className="text-[10px] font-bold text-gray-500">Elite Tier</Badge>
                    </div>
                </Card>
                {/* Card 3 */}
                <Card className="shadow-sm gap-0 p-6 relative">
                    <Badge className="absolute top-4 right-4 bg-orange-100 text-orange-700 border-transparent">#3</Badge>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-900">Rajesh Kumar</h3>
                            <p className="text-xs text-brand-600">↗ +5% efficiency increase</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <p className="text-xs font-semibold text-gray-500">TREES TAPPED</p>
                            <p className="text-lg font-bold text-gray-900">410</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-500">LATEX VOL (L)</p>
                            <p className="text-lg font-bold text-brand-500">1100</p>
                        </div>
                    </div>
                    <div className="flex items-end justify-between border-t border-gray-50 pt-4">
                        <div>
                            <p className="text-xs font-semibold text-gray-500">TOTAL SALARY</p>
                            <p className="text-lg font-bold text-gray-900">$5100</p>
                        </div>
                        <Badge variant="secondary" className="text-[10px] font-bold text-gray-500">Elite Tier</Badge>
                    </div>
                </Card>
            </div>

            {/* Middle section with chart and stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 shadow-sm gap-0 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <CardTitle className="text-base font-semibold">Production Yield Trend</CardTitle>
                            <CardDescription>Daily latex collection average across all tappers (Litres)</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" className="text-xs font-semibold text-gray-700">
                            Export PDF
                        </Button>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                                <Tooltip cursor={{ fill: '#f0fdf4' }} />
                                <Bar dataKey="uv" fill={chartColors.primary} radius={[4, 4, 0, 0]} barSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                <div className="flex flex-col gap-6">
                    {/* Total Yield Card */}
                    <Card className="bg-brand-500 p-6 flex-1 text-white relative overflow-hidden gap-0">
                        <div className="relative z-10">
                            <p className="text-xs font-bold tracking-wider opacity-80 mb-2">TOTAL ESTATE YIELD</p>
                            <p className="text-4xl font-bold">12.4k <span className="text-xl">L</span></p>
                            <p className="text-xs font-medium bg-white/20 inline-block px-2 py-1 rounded mt-4">↗ 14% Above Target</p>
                        </div>
                        <Droplet className="absolute -right-4 -bottom-4 w-40 h-40 opacity-10" />
                    </Card>
                    {/* Productivity Card */}
                    <Card className="shadow-sm p-6 flex-1 flex flex-col justify-center gap-0">
                        <p className="text-xs font-bold tracking-wider text-gray-500 mb-2">AVERAGE PRODUCTIVITY</p>
                        <p className="text-3xl font-bold text-gray-900">134 <span className="text-sm font-medium text-gray-500">trees / tapper</span></p>
                        <div className="w-full bg-gray-100 h-1 mt-6 rounded-full overflow-hidden">
                            <div className="bg-blue-600 h-full w-[80%] rounded-full"></div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Table Section */}
            <Card className="shadow-sm gap-0 overflow-hidden p-0">
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                        <Input
                            type="text"
                            placeholder="Search staff by name or ID..."
                            className="pl-9 bg-gray-50 border-0 focus-visible:ring-1 focus-visible:ring-brand-500"
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Button variant="outline" className="flex-1 sm:flex-none gap-2 text-gray-700 h-9">
                            <Download className="w-4 h-4" /> Bulk Attendance
                        </Button>
                        <Button className="flex-1 sm:flex-none gap-2 bg-brand-500 hover:bg-brand-600 h-9 shadow-sm">
                            <Plus className="w-4 h-4" /> Add Employee
                        </Button>
                    </div>
                </div>
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow className="border-gray-100">
                            <TableHead className="px-6 py-4 text-gray-500 font-semibold">Employee Name</TableHead>
                            <TableHead className="px-6 py-4 text-gray-500 font-semibold">Role</TableHead>
                            <TableHead className="px-6 py-4 text-gray-500 font-semibold">Status</TableHead>
                            <TableHead className="px-6 py-4 text-gray-500 font-semibold">Last Activity</TableHead>
                            <TableHead className="px-6 py-4 text-gray-500 font-semibold">Trees (Today)</TableHead>
                            <TableHead className="px-6 py-4 text-right text-gray-500 font-semibold">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {employees.map((emp, idx) => (
                            <TableRow key={idx} className="border-gray-50 hover:bg-gray-50/50">
                                <TableCell className="px-6 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                                        <div>
                                            <p className="font-bold text-gray-900">{emp.name}</p>
                                            <p className="text-xs text-gray-500">{emp.id}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="px-6 py-3 text-gray-600">{emp.role}</TableCell>
                                <TableCell className="px-6 py-3">
                                    <Badge variant="outline" className={cn(
                                        "text-[10px] font-bold tracking-wide uppercase border-transparent",
                                        emp.status === 'Present' ? "bg-emerald-50 text-brand-600" :
                                            emp.status === 'Absent' ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-600"
                                    )}>
                                        {emp.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="px-6 py-3 text-gray-500 text-xs font-medium">{emp.lastActivity}</TableCell>
                                <TableCell className="px-6 py-3">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-gray-900 w-8">{emp.trees}</span>
                                        {emp.trees > 0 && (
                                            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-brand-500" style={{ width: `${(emp.trees / 150) * 100}%` }}></div>
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="px-6 py-3 text-right">
                                    <button className="text-gray-400 hover:text-gray-600 p-1">
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <span>Showing 8 of 128 registered employees</span>
                    <div className="flex items-center gap-2">
                        <span>Download Attendance Log (CSV)</span>
                        <div className="flex gap-1 ml-4">
                            <button className="w-6 h-6 rounded flex items-center justify-center bg-brand-500 text-white font-bold">1</button>
                            <button className="w-6 h-6 rounded flex items-center justify-center bg-white border border-gray-200 hover:bg-gray-50 font-medium">2</button>
                            <button className="w-6 h-6 rounded flex items-center justify-center bg-white border border-gray-200 hover:bg-gray-50 font-medium">3</button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
