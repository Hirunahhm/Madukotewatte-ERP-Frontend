import { NextRequest } from "next/server";
import { bffProxy } from "@/lib/bff";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Ctx) {
    const { id } = await params;
    return bffProxy(req, `/sales/general/${id}/payment`);
}
