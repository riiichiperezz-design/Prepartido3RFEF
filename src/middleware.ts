import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE, verifySession } from "@/lib/auth";

/**
 * Protege toda la app salvo /login y los recursos públicos.
 * Si no hay sesión válida, redirige a /login.
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Rutas que no requieren sesión
  const isPublic =
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon");

  if (isPublic) return NextResponse.next();

  const cookie = req.cookies.get(AUTH_COOKIE)?.value;
  const valid = await verifySession(cookie);

  if (!valid) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Aplica a todo excepto assets estáticos.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
