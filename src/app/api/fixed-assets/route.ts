import { NextRequest } from "next/server";
import { bffProxy } from "@/lib/bff";

export const GET = (req: NextRequest) => bffProxy(req, "/fixed-assets");
export const POST = (req: NextRequest) => bffProxy(req, "/fixed-assets", { status: 201 });
