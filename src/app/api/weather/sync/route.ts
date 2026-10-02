import { NextRequest, NextResponse } from "next/server";
import { backendJson, BackendError } from "@/lib/backend-fetch";

export async function POST(req: NextRequest) {
    try {
        const qs = req.nextUrl.searchParams.toString();
        const data = await backendJson(`/weather/sync${qs ? `?${qs}` : ""}`, { method: "POST" });
        return NextResponse.json(data);
    } catch (err) {
        if (err instanceof BackendError) return NextResponse.json({ message: err.message }, { status: err.status });
        return NextResponse.json({ message: "Unable to reach the server." }, { status: 503 });
    }
}
