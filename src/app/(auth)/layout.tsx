import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#142A1D] flex flex-col relative overflow-hidden">
            {/* Background Image logic based on screenshot. We'll simulate it with pure CSS and a placeholder gradient/blur for now to match the moody nature vibe */}
            <div
                className="absolute inset-0 z-0 opacity-40 mix-blend-overlay"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1516934816-ec0883db1fa3?q=80&w=2674&auto=format&fit=crop")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            ></div>
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#142A1D]/80 via-[#142A1D]/60 to-[#1e4a30]/90"></div>

            {/* Simple header */}
            <header className="relative z-10 p-6">
                <Link href="/dashboard" className="text-white/60 hover:text-white flex items-center gap-2 text-sm font-semibold transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to preview
                </Link>
            </header>

            {/* Main Form Area */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4">
                {children}
            </main>

            {/* Footer mimic Visily branding */}
            <footer className="relative z-10 p-6 flex justify-between items-center bg-white">
                <p className="text-xs text-gray-900 font-medium">Made with <span className="font-bold text-indigo-600">Visily</span></p>
            </footer>
        </div>
    );
}
