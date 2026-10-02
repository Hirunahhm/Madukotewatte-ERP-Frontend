import { NextRequest } from "next/server";
import { bffProxy } from "@/lib/bff";

export const GET = (req: NextRequest) => bffProxy(req, "/payroll/payslips");
export const POST = (req: NextRequest) => bffProxy(req, "/payroll/payslips", { status: 201 });
