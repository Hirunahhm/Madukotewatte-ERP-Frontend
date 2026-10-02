import { NextRequest } from "next/server";
import { bffProxy } from "@/lib/bff";

export const GET = (req: NextRequest) => bffProxy(req, "/sales/general/options");
