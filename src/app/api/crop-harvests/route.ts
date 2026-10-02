import { NextRequest } from "next/server";
import { bffProxy } from "@/lib/bff";

export const GET = (req: NextRequest) => bffProxy(req, "/crop-harvests");
export const POST = (req: NextRequest) => bffProxy(req, "/crop-harvests", { status: 201 });
