import { NextRequest } from "next/server";
import { bffProxy } from "@/lib/bff";

export const GET = (req: NextRequest) => bffProxy(req, "/sales/general");
export const POST = (req: NextRequest) => bffProxy(req, "/sales/general", { status: 201 });
