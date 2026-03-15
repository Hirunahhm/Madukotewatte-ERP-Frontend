"use client";

import { Bell, Search, Menu, ChevronDown, Moon, Sun } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useUiStore } from "@/stores/ui-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const PAGE_NAMES: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/employees": "Employee Management",
    "/latex-production": "Latex Production",
    "/financials": "Financials",
    "/assets": "Cash & Assets",
    "/weather": "Climate & Forecasting",
};

export function Topbar() {
    const pathname = usePathname();
    const toggleSidebar = useUiStore((state) => state.toggleSidebar);
    const pageTitle = PAGE_NAMES[pathname] ?? "Dashboard";
    const { theme, setTheme } = useTheme();

    return (
        <header className="flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 shadow-sm sm:gap-x-6 sm:px-6">
            {/* Sidebar toggle + page title */}
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-400 transition-colors"
                    onClick={toggleSidebar}
                >
                    <span className="sr-only">Toggle sidebar</span>
                    <Menu className="h-5 w-5" aria-hidden="true" />
                </button>
                <span className="hidden sm:block text-sm font-semibold text-gray-700 dark:text-gray-200">{pageTitle}</span>
            </div>

            <div className="flex flex-1 items-center gap-x-4 self-stretch lg:gap-x-6">
                <form className="relative flex flex-1 items-center" action="#" method="GET">
                    <label htmlFor="search-field" className="sr-only">
                        Search estate records...
                    </label>
                    <Search
                        className="pointer-events-none absolute left-2 h-4 w-4 text-gray-400"
                        aria-hidden="true"
                    />
                    <Input
                        id="search-field"
                        className="h-8 w-full border-0 pl-8 pr-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:border-transparent text-gray-900 placeholder:text-gray-400 sm:text-sm"
                        placeholder="Search estate records..."
                        type="search"
                        name="search"
                    />
                </form>

                <div className="flex items-center gap-x-4 lg:gap-x-6">
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                        <span className="sr-only">View notifications</span>
                        <Bell className="h-5 w-5" aria-hidden="true" />
                    </Button>

                    {/* Dark mode toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        title="Toggle dark mode"
                    >
                        <Sun className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>

                    {/* Separator */}
                    <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200 dark:lg:bg-gray-700" aria-hidden="true" />

                    {/* Profile dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center gap-2 p-1.5 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 outline-none focus:outline-none">
                            <span className="hidden lg:flex lg:flex-col lg:items-end lg:mr-1">
                                <span className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100">
                                    Estate Manager
                                </span>
                                <span className="text-xs leading-4 text-gray-500 dark:text-gray-400">
                                    Admin Access
                                </span>
                            </span>
                            <Avatar>
                                <AvatarImage
                                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                    alt="User"
                                />
                                <AvatarFallback>EM</AvatarFallback>
                            </Avatar>
                            <ChevronDown className="hidden lg:block h-4 w-4 text-gray-400" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Estate Manager</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                            <DropdownMenuItem>Activity Log</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant="destructive">Sign Out</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
