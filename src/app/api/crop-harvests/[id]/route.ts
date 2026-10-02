import { NextRequest } from "next/server";
import { bffProxy } from "@/lib/bff";

type Ctx = { params: Promise<{ id: string }> };

async function forward(req: NextRequest, { params }: Ctx) {
    const { id } = await params;
    return bffProxy(req, `/crop-harvests/${id}`);
}

export const GET = forward;
export const PUT = forward;
export const DELETE = forward;
