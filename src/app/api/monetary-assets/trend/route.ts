import { NextRequest, NextResponse } from "next/server";
import { backendJson, BackendError } from "@/lib/backend-fetch";

export async function GET(req: NextRequest) {
    try {
        const qs = req.nextUrl.searchParams.toString();
        const data = await backendJson(`/monetary-assets/trend${qs ? `?${qs}` : ""}`);
        return NextResponse.json(data);
    } catch (err) {
        if (err instanceof BackendError) return NextResponse.json({ message: err.message }, { status: err.status });
        return NextResponse.json({ message: "Unable to reach the server." }, { status: 503 });
    }
}
