import { NextRequest, NextResponse } from "next/server";
import { backendJson, BackendError } from "@/lib/backend-fetch";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ date: string }> }) {
    const { date } = await params;
    try {
        const data = await backendJson(`/calendar/date/${date}`);
        return NextResponse.json(data);
    } catch (err) {
        if (err instanceof BackendError) return NextResponse.json({ message: err.message }, { status: err.status });
        return NextResponse.json({ message: "Unable to reach the server." }, { status: 503 });
    }
}
