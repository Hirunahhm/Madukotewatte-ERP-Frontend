import Link from "next/link";
import Image from "next/image";
import { requireGuest } from "@/lib/proxy";

export default async function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    await requireGuest();

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden bg-slate-50 dark:bg-[#060f09]">

            {/* ── LIGHT MODE background ── */}
            {/* Soft emerald bloom from top */}
            <div
                className="absolute inset-0 z-0 dark:hidden"
                style={{
                    background: `
                        radial-gradient(ellipse 80% 55% at 50% -5%, rgba(16,185,129,0.10) 0%, transparent 65%),
                        radial-gradient(ellipse 35% 30% at 92% 96%, rgba(16,185,129,0.07) 0%, transparent 60%)
                    `,
                }}
            />

            {/* ── DARK MODE background ── */}
            {/* Layer 1: base dark gradient */}
            <div
                className="absolute inset-0 z-0 hidden dark:block"
                style={{
                    background: `linear-gradient(135deg, #0a1f10 0%, #0d2617 40%, #061209 100%)`,
                }}
            />
            {/* Layer 2: horizontal mist bands */}
            <div
                className="absolute inset-0 z-[1] hidden dark:block opacity-50"
                style={{
                    backgroundImage: `repeating-linear-gradient(
                        0deg,
                        transparent,
                        transparent 120px,
                        rgba(16,80,35,0.07) 120px,
                        rgba(16,80,35,0.07) 121px
                    )`,
                }}
            />
            {/* Layer 3: radial depth glows */}
            <div
                className="absolute inset-0 z-[2] hidden dark:block"
                style={{
                    background: `
                        radial-gradient(ellipse 70% 55% at 50% 30%, rgba(34,197,94,0.09) 0%, transparent 70%),
                        radial-gradient(ellipse 50% 40% at 15% 85%, rgba(15,60,25,0.55) 0%, transparent 65%),
                        radial-gradient(ellipse 45% 35% at 85% 10%, rgba(15,60,25,0.45) 0%, transparent 65%)
                    `,
                }}
            />
            {/* Layer 4: vignette */}
            <div
                className="absolute inset-0 z-[3] hidden dark:block"
                style={{
                    background: `radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.50) 100%)`,
                }}
            />

            {/* ── HEADER ── */}
            <header className="relative z-10 p-6 flex items-center justify-between">
                <Link href="/login" className="flex items-center gap-2.5 group">
                    <Image
                        src="/estate_logo.png"
                        alt="Madukotewatta Estates"
                        width={28}
                        height={28}
                        className="rounded-full opacity-75 group-hover:opacity-100 transition-opacity"
                    />
                    <span className="text-gray-500 group-hover:text-gray-800 dark:text-white/50 dark:group-hover:text-white/80 text-sm font-semibold transition-colors">
                        Madukotewatta Estates
                    </span>
                </Link>
                <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-600 border border-emerald-200 bg-emerald-50 dark:text-emerald-500/70 dark:border-emerald-500/20 dark:bg-emerald-500/5 px-3 py-1.5 rounded-full">
                    Secure Portal
                </span>
            </header>

            {/* ── CONTENT ── */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4">
                {children}
            </main>

            {/* ── FOOTER ── */}
            <footer className="relative z-10 p-5 flex justify-center items-center">
                <p className="text-[11px] text-gray-400 dark:text-white/30 font-medium tracking-wide">
                    © {new Date().getFullYear()} Madukotewatta Estates Sdn. Bhd. — All rights reserved.
                </p>
            </footer>
        </div>
    );
}
