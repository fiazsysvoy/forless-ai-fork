import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const hostname = host.split(":")[0]; // remove port

  // Local tests:
  // mysite.lvh.me  -> ["mysite","lvh","me"]
  // lvh.me         -> ["lvh","me"]
  const parts = hostname.split(".");
  const hasSubdomain = parts.length >= 3;

  if (!hasSubdomain) return NextResponse.next();

  const subdomain = parts[0];

  if (subdomain === "app") return NextResponse.next();

  const url = req.nextUrl;
  url.pathname = `/s/${subdomain}${url.pathname === "/" ? "" : url.pathname}`;
  return NextResponse.rewrite(url);
}
