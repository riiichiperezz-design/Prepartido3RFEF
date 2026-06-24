import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, checkPassword, signSession } from "@/lib/auth";

/** Valida la contraseña y crea la cookie de sesión firmada. */
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const password = String(form.get("password") ?? "");

  if (!checkPassword(password)) {
    return NextResponse.redirect(new URL("/login?error=1", req.url), { status: 303 });
  }

  const res = NextResponse.redirect(new URL("/", req.url), { status: 303 });
  res.cookies.set(AUTH_COOKIE, await signSession(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 días
  });
  return res;
}
