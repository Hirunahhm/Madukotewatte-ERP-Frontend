import { NextRequest } from "next/server";
import { bffProxy } from "@/lib/bff";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return bffProxy(req, `/estate-loans/loans/${id}/movements/latest`);
}
