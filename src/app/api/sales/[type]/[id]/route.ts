import { NextRequest, NextResponse } from "next/server";
import { bffProxy } from "@/lib/bff";

const SALE_TYPES = ["latex", "rubber-solid", "manioc", "coconut", "banana", "general"];

type Ctx = { params: Promise<{ type: string; id: string }> };

async function forward(req: NextRequest, { params }: Ctx) {
    const { type, id } = await params;
    if (!SALE_TYPES.includes(type)) return NextResponse.json({ message: "Unknown sale type." }, { status: 404 });
    return bffProxy(req, `/sales/${type}/${id}`);
}

export const GET = forward;
export const PUT = forward;
export const DELETE = forward;
