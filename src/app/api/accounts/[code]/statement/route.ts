import { NextRequest } from "next/server";
import { bffProxy } from "@/lib/bff";

type Ctx = { params: Promise<{ code: string }> };

export async function GET(req: NextRequest, { params }: Ctx) {
    const { code } = await params;
    return bffProxy(req, `/accounts/${encodeURIComponent(code)}/statement`);
}
