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
    CloudSun,
    ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/stores/ui-store";
import { sidebarTheme } from "@/lib/theme";
import type { LucideIcon } from "lucide-react";

const navSections: { label: string; items: { name: string; href: string; icon: LucideIcon }[] }[] = [
    {
        label: "Operations",
        items: [
            { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
            { name: "Employees", href: "/employees", icon: Users },
            { name: "Latex Production", href: "/latex-production", icon: Droplets },
        ],
    },
    {
        label: "Finance",
        items: [
            { name: "Financials", href: "/financials", icon: TrendingUp },
            { name: "Cash & Assets", href: "/assets", icon: Briefcase },
        ],
    },
    {
        label: "Monitoring",
        items: [
            { name: "Weather", href: "/weather", icon: CloudSun },
        ],
    },
];

export function Sidebar() {
    const pathname = usePathname();
    const isSidebarOpen = useUiStore((state) => state.isSidebarOpen);

    if (!isSidebarOpen) return null;

    return (
        <div
            className="flex h-screen w-64 flex-col"
            style={{ backgroundColor: sidebarTheme.bg, borderRight: `1px solid ${sidebarTheme.border}` }}
        >
            {/* Brand */}
            <div
                className="flex h-20 shrink-0 items-center px-4"
                style={{ borderBottom: `1px solid ${sidebarTheme.border}` }}
            >
                <Link href="/dashboard" className="flex items-center gap-3">
                    <Image
                        src="/estate_logo.png"
                        alt="Madukotewatta Estates Logo"
                        width={44}
                        height={44}
                        className="rounded-full object-cover shrink-0 ring-2 ring-brand-600/40"
                    />
                    <div className="flex flex-col leading-tight">
                        <span className="text-sm font-bold tracking-tight" style={{ color: sidebarTheme.logo.titleColor }}>
                            Madukotewatta
                        </span>
                        <span className="text-[11px] font-semibold tracking-widest uppercase" style={{ color: sidebarTheme.logo.subtitleColor }}>
                            Estates ERP
                        </span>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
                {navSections.map((section) => (
                    <div key={section.label}>
                        <p
                            className="text-[10px] font-bold tracking-widest uppercase px-2 mb-2"
                            style={{ color: sidebarTheme.labelText }}
                        >
                            {section.label}
                        </p>
                        <ul className="space-y-0.5">
                            {section.items.map((item) => {
                                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                                return (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "group flex items-center gap-x-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-150",
                                                isActive
                                                    ? "text-brand-400"
                                                    : "hover:text-brand-300"
                                            )}
                                            style={{
                                                backgroundColor: isActive ? sidebarTheme.activeBg : "transparent",
                                                color: isActive ? sidebarTheme.activeText : sidebarTheme.inactiveText,
                                            }}
                                        >
                                            <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                                            <span className="flex-1">{item.name}</span>
                                            {isActive && <ChevronRight className="h-3.5 w-3.5 opacity-60" />}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            {/* User Footer */}
            <div
                className="shrink-0 p-3"
                style={{ borderTop: `1px solid ${sidebarTheme.border}` }}
            >
                {/* User info */}
                <div className="flex items-center gap-3 px-2 py-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-brand-800 flex items-center justify-center text-brand-300 text-xs font-bold shrink-0">
                        AD
                    </div>
                    <div className="leading-tight min-w-0">
                        <p className="text-[13px] font-semibold truncate" style={{ color: '#d1fae5' }}>Admin User</p>
                        <p className="text-[11px] truncate" style={{ color: sidebarTheme.labelText }}>Estate Manager</p>
                    </div>
                </div>

                {/* Sign out */}
                <button
                    onClick={() => console.log("Sign Out")}
                    className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-150 hover:bg-brand-950/60"
                    style={{ color: sidebarTheme.inactiveText }}
                >
                    <LogOut className="h-4 w-4 shrink-0" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
