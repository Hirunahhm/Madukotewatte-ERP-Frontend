export interface EmployeePayrollEntry {
    employeeId: string;
    employeeName: string;
    salary: number;
    workDays: number;
    latexTap: number;
    advances: number;
    loanDeductions: number;
    manualLabor: number;
    net: number;
}

export interface MonthlyPayrollResponse {
    month: number;
    year: number;
    entries: EmployeePayrollEntry[];
}

export async function getMonthlyPayroll(month: number, year: number): Promise<MonthlyPayrollResponse> {
    const qs = new URLSearchParams({ month: String(month), year: String(year) });
    const res = await fetch(`/api/dashboard/payroll?${qs.toString()}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? "An unexpected error occurred.");
    return data;
}
