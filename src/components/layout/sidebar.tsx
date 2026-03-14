"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Droplets,
    TrendingUp,
    Briefcase,
    LogOut,
    CloudSun
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/stores/ui-store";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Employees", href: "/employees", icon: Users },
    { name: "Latex Production", href: "/latex-production", icon: Droplets },
    { name: "Financials", href: "/financials", icon: TrendingUp },
    { name: "Cash & Assets", href: "/assets", icon: Briefcase },
    { name: "Weather", href: "/weather", icon: CloudSun },
];

export function Sidebar() {
    const pathname = usePathname();
    const isSidebarOpen = useUiStore((state) => state.isSidebarOpen);

    if (!isSidebarOpen) return null;

    return (
        <div className="flex h-screen w-64 flex-col border-r border-gray-200 bg-white">
            {/* Brand */}
            <div className="flex h-20 shrink-0 items-center px-4 border-b border-gray-100">
                <Link href="/dashboard" className="flex items-center gap-3">
                    <Image
                        src="/estate_logo.png"
                        alt="Madukotewatta Estates Logo"
                        width={48}
                        height={48}
                        className="rounded-full object-cover shrink-0"
                    />
                    <div className="flex flex-col leading-tight">
                        <span className="text-sm font-bold text-brand-700 tracking-tight">Madukotewatta</span>
                        <span className="text-xs font-semibold text-brand-500 tracking-wider uppercase">Estates ERP</span>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex flex-1 flex-col justify-between overflow-y-auto p-4">
                <ul role="list" className="space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                                        isActive
                                            ? "bg-brand-500 text-white"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    )}
                                >
                                    <item.icon
                                        className={cn(
                                            "h-5 w-5 shrink-0",
                                            isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"
                                        )}
                                        aria-hidden="true"
                                    />
                                    {item.name}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                {/* Footer actions */}
                <ul role="list" className="mt-auto space-y-1 border-t border-gray-200 pt-4">
                    <li>
                        <button
                            onClick={() => console.log('Sign Out clicked')}
                            className="group flex w-full gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        >
                            <LogOut
                                className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-gray-600"
                                aria-hidden="true"
                            />
                            Sign Out
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
