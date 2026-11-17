import { NextResponse, type NextRequest } from "next/server";

/**
 * Verificação rápida antes de abrir o painel: sem cookie de sessão, vai para o login.
 * (A validação completa da sessão acontece no servidor, em cada página e ação do painel.)
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!req.cookies.has("erca_admin")) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }
  const res = NextResponse.next();
  if (pathname.startsWith("/admin")) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    res.headers.set("X-Frame-Options", "DENY");
  }
  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};
