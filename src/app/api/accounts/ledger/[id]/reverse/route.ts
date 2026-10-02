import { NextRequest } from "next/server";
import { bffProxy } from "@/lib/bff";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return bffProxy(req, `/accounts/ledger/${encodeURIComponent(id)}/reverse`, { status: 201 });
}
