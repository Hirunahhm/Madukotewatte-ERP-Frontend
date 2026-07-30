import type { Labour, LabourRequest } from "@/features/employees/types/labour.types";

async function handleResponse<T>(res: Response): Promise<T> {
    if (res.status === 204) return undefined as T;
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? "An unexpected error occurred.");
    return data as T;
}

export async function createLabour(payload: LabourRequest): Promise<Labour> {
    const res = await fetch("/api/labour", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

export async function getLabourByRange(from: string, to: string): Promise<Labour[]> {
    const qs = new URLSearchParams({ from, to });
    const res = await fetch(`/api/labour/range?${qs.toString()}`);
    return handleResponse(res);
}

export async function updateLabour(id: string, payload: LabourRequest): Promise<Labour> {
    const res = await fetch(`/api/labour/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}
