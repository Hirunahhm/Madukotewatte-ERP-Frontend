import { NextRequest } from "next/server";
import { bffProxy } from "@/lib/bff";

export const POST = (req: NextRequest) => bffProxy(req, "/accounts/transfers", { status: 201 });
