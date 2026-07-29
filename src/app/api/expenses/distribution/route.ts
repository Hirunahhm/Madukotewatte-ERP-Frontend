import { NextResponse } from "next/server";
import { backendJson, BackendError } from "@/lib/backend-fetch";

export async function GET() {
    try {
        const data = await backendJson("/expenses/distribution");
        return NextResponse.json(data);
    } catch (err) {
        if (err instanceof BackendError) return NextResponse.json({ message: err.message }, { status: err.status });
        return NextResponse.json({ message: "Unable to reach the server." }, { status: 503 });
    }
}
