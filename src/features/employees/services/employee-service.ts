import type { PageResponse } from "@/features/employees/types/common.types";
import type { Employee, EmployeeRequest, EmployeeSummary, PaymentSummary } from "@/features/employees/types/employee.types";

async function handleResponse<T>(res: Response): Promise<T> {
    if (res.status === 204) return undefined as T;
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? "An unexpected error occurred.");
    return data as T;
}

export async function getEmployees(params: { name?: string; page?: number; size?: number }): Promise<PageResponse<Employee>> {
    const qs = new URLSearchParams();
    if (params.name) qs.set("name", params.name);
    if (params.page !== undefined) qs.set("page", String(params.page));
    if (params.size !== undefined) qs.set("size", String(params.size));
    const res = await fetch(`/api/employees?${qs.toString()}`);
    return handleResponse(res);
}

export async function getEmployeesSummary(): Promise<EmployeeSummary[]> {
    const res = await fetch("/api/employees/summary");
    return handleResponse(res);
}

export async function createEmployee(payload: EmployeeRequest): Promise<Employee> {
    const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

export async function updateEmployee(id: string, payload: EmployeeRequest): Promise<Employee> {
    const res = await fetch(`/api/employees/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

export async function deleteEmployee(id: string): Promise<void> {
    const res = await fetch(`/api/employees/${id}`, { method: "DELETE" });
    return handleResponse(res);
}

export async function getPaymentSummary(): Promise<PaymentSummary> {
    const res = await fetch("/api/employees/payment-summary");
    return handleResponse(res);
}
