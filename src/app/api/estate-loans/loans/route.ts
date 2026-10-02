import { NextRequest } from "next/server";
import { bffProxy } from "@/lib/bff";

export const GET = (req: NextRequest) => bffProxy(req, "/estate-loans/loans");
export const POST = (req: NextRequest) => bffProxy(req, "/estate-loans/loans", { status: 201 });
