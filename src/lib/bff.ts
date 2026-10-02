import { NextRequest, NextResponse } from "next/server";
import { backendJson, BackendError } from "@/lib/backend-fetch";

interface ProxyOptions {
    /** HTTP method to use against the backend. Defaults to the incoming request method. */
    method?: string;
    /** Status returned to the browser on success (e.g. 201 for creates). Defaults to 200. */
    status?: number;
    /** Forward the incoming query string. Defaults to true. */
    forwardQuery?: boolean;
    /** Forward the incoming JSON body (POST/PUT/PATCH only). Defaults to true. */
    forwardBody?: boolean;
}

/**
 * One-call BFF route handler: forwards method, path, query and JSON body to the backend with the
 * httpOnly-cookie JWT attached, passes 204 through, maps BackendError to its status + message and an
 * unreachable backend to 503.
 *
 *   export const GET = (req: NextRequest) => bffProxy(req, "/accounts");
 *   export const POST = (req: NextRequest) => bffProxy(req, "/accounts", { status: 201 });
 */
export async function bffProxy(req: NextRequest, backendPath: string, options: ProxyOptions = {}): Promise<NextResponse> {
    const method = options.method ?? req.method;
    const hasBody = ["POST", "PUT", "PATCH"].includes(method) && options.forwardBody !== false;
    try {
        const qs = options.forwardQuery === false ? "" : req.nextUrl.searchParams.toString();
        const path = qs ? `${backendPath}${backendPath.includes("?") ? "&" : "?"}${qs}` : backendPath;

        let body: string | undefined;
        if (hasBody) {
            const text = await req.text();
            body = text.length > 0 ? text : undefined;
        }

        const data = await backendJson<unknown>(path, { method, body });
        if (data === undefined) return new NextResponse(null, { status: 204 });
        return NextResponse.json(data, { status: options.status ?? 200 });
    } catch (err) {
        if (err instanceof BackendError) return NextResponse.json({ message: err.message }, { status: err.status });
        return NextResponse.json({ message: "Unable to reach the server." }, { status: 503 });
    }
}
