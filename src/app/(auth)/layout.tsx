import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            {/* === BACKGROUND LAYERS === */}

            {/* Layer 1: Base deep dark tone */}
            <div className="absolute inset-0 z-0 bg-[#060f09]" />

            {/* Layer 2: Rubber plantation texture using CSS - angled dark gradient slabs */}
            <div className="absolute inset-0 z-[1]"
                style={{
                    backgroundImage: `
                        linear-gradient(135deg, #0a1f10 0%, #0d2617 40%, #061209 100%)
                    `
                }}
            />

            {/* Layer 3: Horizontal "mist" bands - atmospheric plantation effect */}
            <div className="absolute inset-0 z-[2] opacity-60"
                style={{
                    backgroundImage: `
                        repeating-linear-gradient(
                            0deg,
                            transparent,
                            transparent 120px,
                            rgba(16, 80, 35, 0.06) 120px,
                            rgba(16, 80, 35, 0.06) 121px
                        )
                    `
                }}
            />

            {/* Layer 4: Radial glow from center — estate emblem halo */}
            <div className="absolute inset-0 z-[3]"
                style={{
                    background: `
                        radial-gradient(ellipse 70% 60% at 50% 35%, rgba(34,197,94,0.10) 0%, transparent 75%),
                        radial-gradient(ellipse 50% 40% at 20% 80%, rgba(15,60,25,0.5) 0%, transparent 70%),
                        radial-gradient(ellipse 50% 40% at 80% 10%, rgba(15,60,25,0.4) 0%, transparent 70%)
                    `
                }}
            />

            {/* Layer 5: Very subtle noise grain texture */}
            <div className="absolute inset-0 z-[4] opacity-[0.025]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: '200px 200px',
                }}
            />

            {/* === VIGNETTE === */}
            <div className="absolute inset-0 z-[5]"
                style={{
                    background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)'
                }}
            />

            {/* === CONTENT === */}
            {/* Header */}
            <header className="relative z-10 p-6 flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center gap-2.5 group">
                    <Image
                        src="/estate_logo.png"
                        alt="Madukotewatta Estates"
                        width={28}
                        height={28}
                        className="rounded-full opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                    <span className="text-white/50 group-hover:text-white/80 text-sm font-semibold transition-colors">
                        Madukotewatta Estates
                    </span>
                </Link>
                <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-500/70 border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 rounded-full">
                    Secure Portal
                </span>
            </header>

            {/* Main Form Area */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4">
                {children}
            </main>

            {/* Footer */}
            <footer className="relative z-10 p-5 flex justify-center items-center">
                <p className="text-[11px] text-white/20 font-medium tracking-wide">
                    © 2024 Madukotewatta Estates Sdn. Bhd. — All rights reserved.
                </p>
            </footer>
        </div>
    );
}
