import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE } from "@/lib/auth";

/** Cierra la sesión borrando la cookie. */
export async function POST(req: NextRequest) {
  const res = NextResponse.redirect(new URL("/login", req.url), { status: 303 });
  res.cookies.delete(AUTH_COOKIE);
  return res;
}
