import type { EmployeeLoan, EmployeeLoanRequest, LoanRepaymentRequest, UpdateLoanRequest } from "@/features/employees/types/loan.types";

async function handleResponse<T>(res: Response): Promise<T> {
    if (res.status === 204) return undefined as T;
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? "An unexpected error occurred.");
    return data as T;
}

export async function createLoan(payload: EmployeeLoanRequest): Promise<EmployeeLoan> {
    const res = await fetch("/api/employee-loans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

export async function getActiveLoans(): Promise<EmployeeLoan[]> {
    const res = await fetch("/api/employee-loans/active");
    return handleResponse(res);
}

export async function getEmployeeLoans(employeeId: string): Promise<EmployeeLoan[]> {
    const res = await fetch(`/api/employee-loans/employee/${employeeId}`);
    return handleResponse(res);
}

export async function updateLoan(id: string, payload: UpdateLoanRequest): Promise<EmployeeLoan> {
    const res = await fetch(`/api/employee-loans/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

export async function repayLoan(id: string, payload: LoanRepaymentRequest): Promise<EmployeeLoan> {
    const res = await fetch(`/api/employee-loans/${id}/repayments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

export async function deleteLoanRepayment(loanId: string, repaymentId: string): Promise<EmployeeLoan> {
    const res = await fetch(`/api/employee-loans/${loanId}/repayments/${repaymentId}`, { method: "DELETE" });
    return handleResponse(res);
}

export async function deleteLoan(id: string): Promise<void> {
    const res = await fetch(`/api/employee-loans/${id}`, { method: "DELETE" });
    return handleResponse(res);
}
