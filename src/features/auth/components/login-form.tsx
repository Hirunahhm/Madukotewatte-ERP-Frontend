'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useLogin } from '@/features/auth/hooks/use-login';

export function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const { form, onSubmit, formError } = useLogin();
    const { register, formState: { errors, isSubmitting } } = form;

    return (
        <div className="w-full max-w-md flex flex-col gap-8">

            {/* Heading */}
            <div className="text-center">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Sign in to your account
                </h1>
                <p className="text-sm text-gray-500 dark:text-white/50 mt-2">
                    Estate Management Portal — authorised personnel only
                </p>
            </div>

            {/* Card */}
            <div className="w-full rounded-2xl p-8 space-y-5
                bg-white border border-gray-100 shadow-xl shadow-gray-200/60
                dark:bg-white/[0.07] dark:backdrop-blur-2xl dark:border-white/[0.12] dark:shadow-2xl">

                <form onSubmit={onSubmit} noValidate className="space-y-5">

                    {/* Form-level error */}
                    {formError && (
                        <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>{formError}</span>
                        </div>
                    )}

                    {/* Username */}
                    <div className="space-y-1.5">
                        <label
                            htmlFor="username"
                            className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-white/70"
                        >
                            Username
                        </label>
                        <Input
                            id="username"
                            type="text"
                            placeholder="e.g. admin"
                            autoComplete="username"
                            aria-describedby={errors.username ? 'username-error' : undefined}
                            aria-invalid={!!errors.username}
                            className="h-11 text-sm rounded-xl
                                bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-300
                                focus-visible:ring-emerald-500/30 focus-visible:border-emerald-400
                                dark:bg-white/[0.06] dark:border-white/[0.12] dark:text-white dark:placeholder:text-white/25
                                dark:focus-visible:ring-emerald-500/50 dark:focus-visible:border-emerald-500/40"
                            {...register('username')}
                        />
                        {errors.username && (
                            <p id="username-error" role="alert" className="flex items-center gap-1.5 text-xs text-red-500 dark:text-red-400 pt-0.5">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                {errors.username.message}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="password"
                                className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-white/70"
                            >
                                Password
                            </label>
                            <a
                                href="#"
                                className="text-xs font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400/80 dark:hover:text-emerald-300 transition-colors"
                            >
                                Forgot password?
                            </a>
                        </div>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                autoComplete="current-password"
                                aria-describedby={errors.password ? 'password-error' : undefined}
                                aria-invalid={!!errors.password}
                                className="h-11 pr-11 rounded-xl
                                    bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-300
                                    focus-visible:ring-emerald-500/30 focus-visible:border-emerald-400
                                    dark:bg-white/[0.06] dark:border-white/[0.12] dark:text-white dark:placeholder:text-white/25
                                    dark:focus-visible:ring-emerald-500/50 dark:focus-visible:border-emerald-500/40"
                                {...register('password')}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors
                                    text-gray-300 hover:text-gray-500
                                    dark:text-white/30 dark:hover:text-white/60"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.password && (
                            <p id="password-error" role="alert" className="flex items-center gap-1.5 text-xs text-red-500 dark:text-red-400 pt-0.5">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Remember me */}
                    <div className="flex items-center gap-2.5 pt-1">
                        <input
                            id="rememberMe"
                            type="checkbox"
                            className="w-4 h-4 rounded border-gray-300 bg-white accent-emerald-500 cursor-pointer
                                dark:border-white/20 dark:bg-white/5"
                            {...register('rememberMe')}
                        />
                        <label
                            htmlFor="rememberMe"
                            className="text-sm cursor-pointer select-none text-gray-400 dark:text-white/50"
                        >
                            Keep me signed in
                        </label>
                    </div>

                    {/* Submit */}
                    <div className="pt-1">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-11 font-semibold text-sm rounded-xl transition-all duration-200
                                bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-60
                                shadow-[0_4px_14px_rgba(16,185,129,0.30)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.40)]
                                dark:hover:bg-emerald-400
                                dark:shadow-[0_0_28px_rgba(16,185,129,0.20)] dark:hover:shadow-[0_0_38px_rgba(16,185,129,0.35)]
                                flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Signing in…
                                </>
                            ) : (
                                <>
                                    Sign In to Portal
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </Button>
                    </div>

                </form>
            </div>

            {/* Legal notice */}
            <p className="text-[11px] text-center leading-relaxed px-4 text-gray-400 dark:text-white/35">
                This is a private system. Unauthorised access is strictly prohibited
                and may be subject to legal action.
            </p>
        </div>
    );
}
