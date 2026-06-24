import { create } from 'zustand';
import type { AuthUser } from '@/features/auth/types/auth.types';

interface AuthState extends AuthUser {
    setUser: (username: string, role: string) => void;
    clearUser: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
    username: '',
    role: '',
    isAuthenticated: false,

    setUser: (username, role) =>
        set({ username, role, isAuthenticated: true }),

    clearUser: () =>
        set({ username: '', role: '', isAuthenticated: false }),
}));
