import { NextRequest, NextResponse } from "next/server";
import { backendJson, BackendError } from "@/lib/backend-fetch";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const body = await req.json();
        const data = await backendJson(`/sales/rubber-solid/${id}/payment`, { method: "PUT", body: JSON.stringify(body) });
        return NextResponse.json(data);
    } catch (err) {
        if (err instanceof BackendError) return NextResponse.json({ message: err.message }, { status: err.status });
        return NextResponse.json({ message: "Unable to reach the server." }, { status: 503 });
    }
}
