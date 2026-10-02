import { NextRequest } from "next/server";
import { bffProxy } from "@/lib/bff";

export const POST = (req: NextRequest) => bffProxy(req, "/payroll/payslips/bulk", { status: 201 });
