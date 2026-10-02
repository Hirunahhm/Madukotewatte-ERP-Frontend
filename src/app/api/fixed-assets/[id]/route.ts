import { NextRequest } from "next/server";
import { bffProxy } from "@/lib/bff";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Ctx) {
    const { id } = await params;
    return bffProxy(req, `/fixed-assets/${id}`);
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
    const { id } = await params;
    return bffProxy(req, `/fixed-assets/${id}`);
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
    const { id } = await params;
    return bffProxy(req, `/fixed-assets/${id}`);
}
