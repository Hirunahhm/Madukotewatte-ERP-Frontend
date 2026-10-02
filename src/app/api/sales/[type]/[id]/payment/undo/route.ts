import { NextRequest, NextResponse } from "next/server";
import { bffProxy } from "@/lib/bff";

const SALE_TYPES = ["latex", "rubber-solid", "manioc", "coconut", "banana", "general"];

export async function POST(req: NextRequest, { params }: { params: Promise<{ type: string; id: string }> }) {
    const { type, id } = await params;
    if (!SALE_TYPES.includes(type)) return NextResponse.json({ message: "Unknown sale type." }, { status: 404 });
    return bffProxy(req, `/sales/${type}/${id}/payment/undo`);
}
