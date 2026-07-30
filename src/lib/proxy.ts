import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function requireAuth(): Promise<void> {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token');
    if (!token) redirect('/login');
}

export async function requireGuest(): Promise<void> {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token');
    if (token) redirect('/dashboard');
}
