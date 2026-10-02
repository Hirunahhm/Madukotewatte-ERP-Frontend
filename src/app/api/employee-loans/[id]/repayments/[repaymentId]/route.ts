import { NextRequest } from "next/server";
import { bffProxy } from "@/lib/bff";

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string; repaymentId: string }> },
) {
    const { id, repaymentId } = await params;
    return bffProxy(req, `/employee-loans/${encodeURIComponent(id)}/repayments/${encodeURIComponent(repaymentId)}`);
}
