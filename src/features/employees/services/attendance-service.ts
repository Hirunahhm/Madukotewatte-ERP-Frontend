import type { Attendance, AttendanceBulkRequest, AttendanceRequest } from "@/features/employees/types/attendance.types";

async function handleResponse<T>(res: Response): Promise<T> {
    if (res.status === 204) return undefined as T;
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? "An unexpected error occurred.");
    return data as T;
}

export async function createAttendance(payload: AttendanceRequest): Promise<Attendance> {
    const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

export async function createAttendanceBulk(payload: AttendanceBulkRequest): Promise<Attendance[]> {
    const res = await fetch("/api/attendance/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

export async function getAttendanceByRange(from: string, to: string): Promise<Attendance[]> {
    const qs = new URLSearchParams({ from, to });
    const res = await fetch(`/api/attendance/range?${qs.toString()}`);
    return handleResponse(res);
}

export async function updateAttendance(id: string, payload: AttendanceRequest): Promise<Attendance> {
    const res = await fetch(`/api/attendance/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}
