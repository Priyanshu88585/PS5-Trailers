import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ApiResponse } from "@/types";

export type ApiHandler = (
  req: NextRequest,
  context?: { params: Record<string, string> }
) => Promise<NextResponse>;

// Rate limit store (in-memory for dev, use Redis in prod)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(maxRequests = 100, windowMs = 60000) {
  return function (handler: ApiHandler): ApiHandler {
    return async (req, context) => {
      const ip =
        req.headers.get("x-forwarded-for")?.split(",")[0] ||
        req.headers.get("x-real-ip") ||
        "unknown";
      const key = `${ip}:${req.nextUrl.pathname}`;
      const now = Date.now();
      const record = rateLimitStore.get(key);

      if (!record || now > record.resetTime) {
        rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
      } else {
        record.count += 1;
        if (record.count > maxRequests) {
          return NextResponse.json<ApiResponse>(
            { success: false, error: "Too many requests. Please try again later." },
            {
              status: 429,
              headers: {
                "Retry-After": String(Math.ceil((record.resetTime - now) / 1000)),
                "X-RateLimit-Limit": String(maxRequests),
                "X-RateLimit-Remaining": "0",
              },
            }
          );
        }
      }

      return handler(req, context);
    };
  };
}

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return {
      session: null,
      response: NextResponse.json<ApiResponse>(
        { success: false, error: "Authentication required" },
        { status: 401 }
      ),
    };
  }
  return { session, response: null };
}

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return {
      session: null,
      response: NextResponse.json<ApiResponse>(
        { success: false, error: "Authentication required" },
        { status: 401 }
      ),
    };
  }
  const role = (session.user as any).role;
  if (role !== "admin" && role !== "superadmin") {
    return {
      session: null,
      response: NextResponse.json<ApiResponse>(
        { success: false, error: "Admin access required" },
        { status: 403 }
      ),
    };
  }
  return { session, response: null };
}

export function successResponse<T>(data: T, message?: string, status = 200) {
  return NextResponse.json<ApiResponse<T>>(
    { success: true, data, message },
    { status }
  );
}

export function errorResponse(error: string, status = 500) {
  return NextResponse.json<ApiResponse>(
    { success: false, error },
    { status }
  );
}

export function handleApiError(err: unknown) {
  console.error("API Error:", err);
  const message = err instanceof Error ? err.message : "Internal server error";
  return errorResponse(message);
}
