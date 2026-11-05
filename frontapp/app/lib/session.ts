import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";

const COOKIE_NAME = "vinyl_session";
const ONE_DAY = 60 * 60 * 24; // mesmo prazo do JWT do backend (1d)

export interface SessionUser {
  sub: number;
  email: string;
  name: string;
  role: string;
}

export async function createSession(token: string, remember: boolean) {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // Sem maxAge, vira cookie de sessão (some ao fechar o navegador)
    ...(remember ? { maxAge: ONE_DAY } : {}),
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value ?? null;
}

// O backend valida a assinatura e consulta o papel atual no banco.
export const getSession = cache(async (): Promise<SessionUser | null> => {
  const token = await getToken();
  if (!token) return null;
  try {
    const response = await fetch(
      `${process.env.API_URL || "http://localhost:3000/api"}/auth/me`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      },
    );
    if (!response.ok) return null;
    return (await response.json()) as SessionUser;
  } catch {
    return null;
  }
});
