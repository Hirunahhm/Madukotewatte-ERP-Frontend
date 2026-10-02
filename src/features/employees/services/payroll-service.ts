import type {
    PayrollPreviewRow, PayrollSummary, Payslip, PayslipPage, PayslipRequest,
} from "@/features/employees/types/payroll.types";

async function handleResponse<T>(res: Response): Promise<T> {
    if (res.status === 204) return undefined as T;
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? "An unexpected error occurred.");
    return data as T;
}

const JSON_HEADERS = { "Content-Type": "application/json" };

export async function getPayrollPreview(from: string, to: string, employeeId?: string): Promise<PayrollPreviewRow[]> {
    const qs = new URLSearchParams({ from, to });
    if (employeeId) qs.set("employeeId", employeeId);
    return handleResponse(await fetch(`/api/payroll/preview?${qs.toString()}`));
}

export async function getPayrollSummary(from: string, to: string): Promise<PayrollSummary> {
    const qs = new URLSearchParams({ from, to });
    return handleResponse(await fetch(`/api/payroll/summary?${qs.toString()}`));
}

export interface PayslipListParams {
    from?: string;
    to?: string;
    employeeId?: string;
    page?: number;
    size?: number;
}

export async function getPayslips(params: PayslipListParams): Promise<PayslipPage> {
    const qs = new URLSearchParams();
    if (params.from) qs.set("from", params.from);
    if (params.to) qs.set("to", params.to);
    if (params.employeeId) qs.set("employeeId", params.employeeId);
    qs.set("page", String(params.page ?? 0));
    qs.set("size", String(params.size ?? 10));
    return handleResponse(await fetch(`/api/payroll/payslips?${qs.toString()}`));
}

export async function getPayslip(id: string): Promise<Payslip> {
    return handleResponse(await fetch(`/api/payroll/payslips/${id}`));
}

export async function createPayslip(payload: PayslipRequest): Promise<Payslip> {
    return handleResponse(await fetch("/api/payroll/payslips", {
        method: "POST", headers: JSON_HEADERS, body: JSON.stringify(payload),
    }));
}

/** All-or-nothing: every payslip is created or none. */
export async function createPayslipsBulk(payload: PayslipRequest[]): Promise<Payslip[]> {
    return handleResponse(await fetch("/api/payroll/payslips/bulk", {
        method: "POST", headers: JSON_HEADERS, body: JSON.stringify(payload),
    }));
}

export async function voidPayslip(id: string, reason?: string): Promise<Payslip> {
    return handleResponse(await fetch(`/api/payroll/payslips/${id}/void`, {
        method: "POST", headers: JSON_HEADERS, body: JSON.stringify({ reason }),
    }));
}
