import { cookies } from "next/headers";

/**
 * Login local muy básico para uso privado.
 * No es un sistema de usuarios: solo una contraseña (APP_PASSWORD) que protege
 * el acceso a la app en tu propio ordenador. Tras validarla, se firma una
 * cookie con HMAC (Web Crypto) para mantener la sesión.
 *
 * Se usa Web Crypto (crypto.subtle) porque está disponible tanto en el runtime
 * de Node (route handlers) como en el Edge runtime (middleware).
 */

export const AUTH_COOKIE = "prepartido_session";
const SESSION_VALUE = "ok";

function getSecret(): string {
  return process.env.AUTH_SECRET || "prepartido-secret-dev";
}

async function hmac(message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Buffer.from(new Uint8Array(sig)).toString("hex");
}

/** Genera el valor firmado de la cookie de sesión. */
export async function signSession(): Promise<string> {
  const sig = await hmac(SESSION_VALUE);
  return `${SESSION_VALUE}.${sig}`;
}

/** Comprueba si un valor de cookie es una sesión válida. */
export async function verifySession(value: string | undefined): Promise<boolean> {
  if (!value) return false;
  const [val, sig] = value.split(".");
  if (val !== SESSION_VALUE || !sig) return false;
  return (await hmac(val)) === sig;
}

/** Comprueba la contraseña introducida contra APP_PASSWORD. */
export function checkPassword(password: string): boolean {
  const expected = process.env.APP_PASSWORD || "arbitro";
  return password === expected;
}

/** ¿Hay una sesión válida en la petición actual? (uso en server components) */
export async function isAuthenticated(): Promise<boolean> {
  const cookie = cookies().get(AUTH_COOKIE);
  return verifySession(cookie?.value);
}
