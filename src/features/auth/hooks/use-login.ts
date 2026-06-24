'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { loginUser } from '@/features/auth/services/auth-service';
import { useAuthStore } from '@/stores/auth-store';

const loginSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    rememberMe: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export function useLogin() {
    const router = useRouter();
    const setUser = useAuthStore((s) => s.setUser);
    const [formError, setFormError] = useState<string | null>(null);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { rememberMe: false },
    });

    const onSubmit = form.handleSubmit(async (values) => {
        setFormError(null);
        try {
            const { username, role } = await loginUser({
                username: values.username,
                password: values.password,
                rememberMe: values.rememberMe,
            });
            setUser(username, role);
            router.push('/dashboard');
        } catch (err) {
            setFormError(err instanceof Error ? err.message : 'Something went wrong.');
        }
    });

    return { form, onSubmit, formError };
}
