import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};

export default function proxy(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const hostname = host.split(":")[0];
  const parts = hostname.split(".");

  // mysite.lvh.me => ["mysite","lvh","me"]
  const hasSubdomain = parts.length >= 3;
  if (!hasSubdomain) return NextResponse.next();

  const subdomain = parts[0].toLowerCase();

  if (subdomain === "app") return NextResponse.next();

  const url = req.nextUrl;
  url.pathname = `/s/${subdomain}${url.pathname === "/" ? "" : url.pathname}`;
  return NextResponse.rewrite(url);
}
