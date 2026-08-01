"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";

/**
 * The JWT lives in an httpOnly cookie, so it survives a page reload — but the
 * Zustand auth store is in-memory only and resets to role: "" on every hard
 * navigation/refresh. Without this, every admin-only control (Edit/Delete
 * Employee, etc.) silently disappears after a refresh even though the user
 * is still logged in.
 */
export function SessionHydrator() {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const setUser = useAuthStore((s) => s.setUser);

    useEffect(() => {
        if (isAuthenticated) return;
        fetch("/api/auth/me")
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (data?.username && data?.role) setUser(data.username, data.role);
            })
            .catch(() => {});
    }, [isAuthenticated, setUser]);

    return null;
}
