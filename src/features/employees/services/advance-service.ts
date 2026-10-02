import type { AdvanceRequest, EmployeeTransaction } from "@/features/employees/types/transaction.types";

async function handleResponse<T>(res: Response): Promise<T> {
    if (res.status === 204) return undefined as T;
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? "An unexpected error occurred.");
    return data as T;
}

export async function giveAdvance(payload: AdvanceRequest): Promise<EmployeeTransaction> {
    return handleResponse(await fetch("/api/employee-transactions/advances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    }));
}

export async function deleteAdvance(id: string): Promise<void> {
    return handleResponse(await fetch(`/api/employee-transactions/advances/${id}`, { method: "DELETE" }));
}
