"use client";

import { Bell, Search, Menu } from "lucide-react";
import { useUiStore } from "@/stores/ui-store";

export function Topbar() {
    const toggleSidebar = useUiStore((state) => state.toggleSidebar);

    return (
        <header className="flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                onClick={toggleSidebar}
            >
                <span className="sr-only">Open sidebar</span>
                <Menu className="h-6 w-6" aria-hidden="true" />
            </button>

            <div className="flex flex-1 items-center gap-x-4 self-stretch lg:gap-x-6">
                <form className="relative flex flex-1" action="#" method="GET">
                    <label htmlFor="search-field" className="sr-only">
                        Search estate records...
                    </label>
                    <Search
                        className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
                        aria-hidden="true"
                    />
                    <input
                        id="search-field"
                        className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm bg-transparent"
                        placeholder="Search estate records..."
                        type="search"
                        name="search"
                    />
                </form>

                <div className="flex items-center gap-x-4 lg:gap-x-6">
                    <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                        <span className="sr-only">View notifications</span>
                        <Bell className="h-5 w-5" aria-hidden="true" />
                    </button>

                    {/* Separator */}
                    <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

                    {/* Profile dropdown */}
                    <div className="flex items-center p-1.5 focus:outline-none">
                        <span className="hidden lg:flex lg:flex-col lg:items-end lg:mr-3">
                            <span className="text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">
                                Estate Manager
                            </span>
                            <span className="text-xs leading-4 text-gray-500" aria-hidden="true">
                                Admin Access
                            </span>
                        </span>
                        <img
                            className="h-8 w-8 rounded-full bg-gray-50 object-cover border border-gray-200"
                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            alt="User"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}
