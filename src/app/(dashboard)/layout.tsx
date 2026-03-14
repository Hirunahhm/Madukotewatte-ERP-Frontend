import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-slate-50 dark:bg-gray-950">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Topbar />
                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden pt-6 pb-20 px-4 sm:px-6 lg:px-8 dark:bg-gray-950">
                    <div className="mx-auto max-w-7xl">
                        {children}
                    </div>
                </main>

                {/* Footer mimicking the screenshot */}
                <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 dark:text-gray-500">
                    <p>© 2024 Madukotewatta Estates ERP. All systems operational.</p>
                    <div className="mt-2 sm:mt-0 space-x-4">
                        <a href="#" className="hover:text-gray-900 dark:hover:text-gray-300">Documentation</a>
                        <a href="#" className="hover:text-gray-900 dark:hover:text-gray-300">Support</a>
                        <a href="#" className="hover:text-gray-900 dark:hover:text-gray-300">Privacy Policy</a>
                    </div>
                </footer>
            </div>
        </div>
    );
}
