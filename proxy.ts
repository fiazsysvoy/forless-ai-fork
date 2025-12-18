import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};

const ROOT_VERCEL_DOMAIN = "forless-ai-fork-ldc5.vercel.app";

export default function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const hostname = host.split(":")[0].toLowerCase();

  // ✅ 1. Load main website for root domain
  if (hostname === ROOT_VERCEL_DOMAIN) {
    return NextResponse.next();
  }

  // Split hostname
  const parts = hostname.split(".");

  // ✅ 2. If it's *.vercel.app
  if (hostname.endsWith(".vercel.app")) {
    const subdomain = parts[0];

    // If subdomain == deployment name → main website
    if (subdomain === ROOT_VERCEL_DOMAIN.split(".")[0]) {
      return NextResponse.next();
    }

    // Otherwise treat as real subdomain
    return rewriteToSubdomain(req, subdomain);
  }

  // ✅ 3. Custom domains (abc.yourdomain.com)
  if (parts.length >= 3) {
    const subdomain = parts[0];

    if (subdomain === "app") {
      return NextResponse.next();
    }

    return rewriteToSubdomain(req, subdomain);
  }

  // Default → main website
  return NextResponse.next();
}

function rewriteToSubdomain(req: NextRequest, subdomain: string) {
  const url = req.nextUrl.clone();
  url.pathname = `/s/${subdomain}${url.pathname === "/" ? "" : url.pathname}`;
  return NextResponse.rewrite(url);
}
