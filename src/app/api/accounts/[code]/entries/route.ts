import { NextRequest } from "next/server";
import { bffProxy } from "@/lib/bff";

type Ctx = { params: Promise<{ code: string }> };

export async function POST(req: NextRequest, { params }: Ctx) {
    const { code } = await params;
    return bffProxy(req, `/accounts/${encodeURIComponent(code)}/entries`, { status: 201 });
}
