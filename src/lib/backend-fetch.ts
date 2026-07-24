import { cookies } from "next/headers";

const AUTH_API_URL = process.env.AUTH_API_URL;

export class BackendError extends Error {
    status: number;
    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

export async function backendFetch(path: string, init: RequestInit = {}): Promise<Response> {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    const headers = new Headers(init.headers);
    headers.set("Content-Type", "application/json");
    if (token) headers.set("Authorization", `Bearer ${token}`);

    return fetch(`${AUTH_API_URL}${path}`, { ...init, headers });
}

export async function backendJson<T>(path: string, init: RequestInit = {}): Promise<T> {
    const res = await backendFetch(path, init);
    if (res.status === 204) return undefined as T;

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new BackendError(res.status, data.message ?? "Backend request failed.");
    }
    return data as T;
}
