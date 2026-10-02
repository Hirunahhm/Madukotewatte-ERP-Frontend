import { NextRequest } from "next/server";
import { bffProxy } from "@/lib/bff";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return bffProxy(req, `/payroll/payslips/${encodeURIComponent(id)}`);
}
