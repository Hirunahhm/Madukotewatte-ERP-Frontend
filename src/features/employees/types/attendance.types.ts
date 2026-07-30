export type NoWorkReason =
    | "none"
    | "rain"
    | "sick"
    | "other"
    | "public_holiday"
    | "funeral"
    | "family_matter"
    | "kids";

export const ABSENCE_REASONS: { value: NoWorkReason; label: string }[] = [
    { value: "sick", label: "Sick" },
    { value: "rain", label: "Rain" },
    { value: "other", label: "Other" },
    { value: "public_holiday", label: "Public Holiday" },
    { value: "funeral", label: "Funeral" },
    { value: "family_matter", label: "Family Matter" },
    { value: "kids", label: "Kids" },
];

export interface Attendance {
    attendanceId: string;
    employeeId: string;
    employeeName: string;
    calendarId: string | null;
    timestamp: string;
    noOfTrees: number | null;
    noWork: NoWorkReason;
    createdAt: string;
}

export interface AttendanceRequest {
    employeeId: string;
    calendarId?: string;
    timestamp: string;
    noOfTrees?: number;
    noWork?: NoWorkReason;
}

export interface AttendanceBulkRequest {
    attendances: AttendanceRequest[];
}

export interface EmployeeAttendanceStats {
    totalDays: number;
    presentDays: number;
    absentDays: number;
    totalTreesTapped: number;
    avgTreesPerPresentDay: number;
    attendanceRatePercent: number;
}
