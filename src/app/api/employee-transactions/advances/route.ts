import { NextRequest } from "next/server";
import { bffProxy } from "@/lib/bff";

export const POST = (req: NextRequest) => bffProxy(req, "/employee-transactions/advances", { status: 201 });
