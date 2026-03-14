"use client";

import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, User, ArrowRight } from "lucide-react";

export default function LoginPage() {
    return (
        <div className="w-full max-w-md flex flex-col items-center gap-8">

            {/* Logo + Estate Name */}
            <div className="flex flex-col items-center text-center">
                <div className="relative mb-5">
                    <div className="absolute inset-0 rounded-full blur-2xl bg-emerald-500/20 scale-110" />
                    <Image
                        src="/estate_logo.png"
                        alt="Madukotewatta Estates"
                        width={110}
                        height={110}
                        className="relative rounded-full object-cover ring-4 ring-white/10 shadow-2xl"
                    />
                </div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">Madukotewatta</h1>
                <p className="text-lg font-bold text-emerald-400 tracking-widest uppercase mt-0.5">Estates</p>
                <p className="text-sm text-white/50 mt-3 font-medium">Sign in to access the Estate Management Portal</p>
            </div>

            {/* Card */}
            <div className="w-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-2xl space-y-5">

                {/* Employee ID */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-emerald-100/80 uppercase tracking-wider flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" /> Employee ID
                    </label>
                    <Input
                        type="text"
                        placeholder="e.g. MGR-0012"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/25 h-12 font-mono text-sm focus-visible:ring-emerald-500/50 focus-visible:border-white/20 rounded-xl"
                    />
                </div>

                {/* Password */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-emerald-100/80 uppercase tracking-wider flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5" /> Password
                        </label>
                        <a href="#" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
                            Forgot password?
                        </a>
                    </div>
                    <Input
                        type="password"
                        placeholder="••••••••"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/25 h-12 font-mono tracking-widest focus-visible:ring-emerald-500/50 focus-visible:border-white/20 rounded-xl"
                    />
                </div>

                {/* Submit */}
                <Link href="/dashboard" className="block pt-1">
                    <Button
                        className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.25)] hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        Sign In to Portal
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </Link>
            </div>

            {/* Footer note */}
            <p className="text-[11px] text-white/30 text-center font-medium px-4">
                This is a private system. Unauthorised access is strictly prohibited and may be subject to legal action.
            </p>
        </div>
    );
}
