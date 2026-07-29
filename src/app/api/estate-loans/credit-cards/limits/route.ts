import { NextRequest, NextResponse } from "next/server";
import { backendJson, BackendError } from "@/lib/backend-fetch";

export async function GET() {
    try {
        const data = await backendJson("/estate-loans/credit-cards/limits");
        return NextResponse.json(data);
    } catch (err) {
        if (err instanceof BackendError) return NextResponse.json({ message: err.message }, { status: err.status });
        return NextResponse.json({ message: "Unable to reach the server." }, { status: 503 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const data = await backendJson("/estate-loans/credit-cards/limit", { method: "PUT", body: JSON.stringify(body) });
        return NextResponse.json(data);
    } catch (err) {
        if (err instanceof BackendError) return NextResponse.json({ message: err.message }, { status: err.status });
        return NextResponse.json({ message: "Unable to reach the server." }, { status: 503 });
    }
}
