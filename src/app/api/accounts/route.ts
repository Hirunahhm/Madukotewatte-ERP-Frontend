import { NextRequest } from "next/server";
import { bffProxy } from "@/lib/bff";

export const GET = (req: NextRequest) => bffProxy(req, "/accounts");
export const POST = (req: NextRequest) => bffProxy(req, "/accounts", { status: 201 });
