import "server-only";

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

// Lê os dados do usuário a partir do JWT, só para exibir na interface.
// Quem valida o token de verdade (assinatura) é o backend a cada requisição.
export async function getSession(): Promise<SessionUser | null> {
  const token = await getToken();

  if (!token) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64url").toString("utf8"),
    );

    if (typeof payload.exp === "number" && payload.exp * 1000 < Date.now()) {
      return null;
    }

    return {
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };
  } catch {
    return null;
  }
}
