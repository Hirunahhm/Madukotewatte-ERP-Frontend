import type { LoginRequest, LoginResponse } from '@/features/auth/types/auth.types';

async function handleResponse<T>(res: Response): Promise<T> {
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? 'An unexpected error occurred.');
    return data as T;
}

export async function loginUser(payload: LoginRequest): Promise<LoginResponse> {
    const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    return handleResponse<LoginResponse>(res);
}

export async function logoutUser(): Promise<void> {
    await fetch('/api/auth/logout', { method: 'POST' });
}
