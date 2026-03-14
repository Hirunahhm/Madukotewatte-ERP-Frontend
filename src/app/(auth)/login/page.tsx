"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
    return (
        <div className="w-full max-w-[420px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
            <div className="flex flex-col items-center text-center mb-8">
                <div className="w-24 h-24 mb-4 relative">
                    <Image
                        src="/estate_logo.png"
                        alt="Madukotewatta Estates"
                        width={96}
                        height={96}
                        className="rounded-full object-cover shadow-[0_0_30px_rgba(16,185,129,0.25)] border-2 border-emerald-500/30"
                    />
                </div>
                <h1 className="text-2xl font-bold text-white tracking-tight mb-1">Madukotewatta Estates</h1>
                <p className="text-sm text-emerald-100/70">Secure Industrial Portal for Estate Management</p>
            </div>

            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); window.location.href = '/dashboard'; }}>
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-emerald-100/90 block">Employee Identification</label>
                    <Input
                        type="text"
                        placeholder="ADM-XXXX-2024"
                        className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg px-4 h-12 text-sm focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:border-white/20 font-mono"
                    />
                </div>

                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-emerald-100/90 block">System Passkey</label>
                        <a href="#" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300">Forgot Access?</a>
                    </div>
                    <Input
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg px-4 h-12 text-sm focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:border-white/20 font-mono tracking-widest"
                    />
                </div>

                <div className="pt-2">
                    <div className="flex justify-start mb-6">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-500 border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 rounded-full">Enterprise Grade Security</span>
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold h-12 rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                    >
                        Authenticate Access
                    </Button>
                </div>

                <p className="text-[10px] text-center text-emerald-100/50 mt-4">
                    Authorized personnel only. All access attempts are logged and monitored.
                </p>
            </form>
        </div>
    );
}
