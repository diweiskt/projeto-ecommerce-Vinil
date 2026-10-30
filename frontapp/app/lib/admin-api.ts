import "server-only";

import { API_URL } from "./api";
import { getToken } from "./session";

export type AdminResult<T = unknown> =
  { ok: true; data: T } | { ok: false; status: number; error: string };

const FIELD_LABELS: Record<string, string> = {
  title: "Título",
  releaseYear: "Ano de lançamento",
  price: "Preço",
  condition: "Condição",
  rpmSpeed: "Rotação",
  stockQuantity: "Estoque",
  artistId: "Artista",
  genreId: "Gênero",
  coverUrl: "Capa",
  name: "Nome",
  country: "País",
  bio: "Biografia",
  description: "Descrição",
};

// Mensagens de validação do class-validator vêm em inglês
function translate(message: string): string {
  const match = message.match(/^(\w+) (.*)$/);
  const field = match ? FIELD_LABELS[match[1]] : undefined;

  if (match && field) {
    const rest = match[2];
    let found: RegExpMatchArray | null;

    if (
      (found = rest.match(/^must be longer than or equal to (\d+) characters$/))
    ) {
      return `${field} deve ter pelo menos ${found[1]} caracteres.`;
    }

    if ((found = rest.match(/^must not be less than ([\d.]+)$/))) {
      return `${field} deve ser no mínimo ${found[1]}.`;
    }

    if (rest === "must be an integer number") {
      return `${field} deve ser um número inteiro.`;
    }

    if (rest.startsWith("must be a number")) {
      return `${field} deve ser um número válido.`;
    }

    if ((found = rest.match(/^must be one of the following values: (.*)$/))) {
      return `${field} deve ser um destes valores: ${found[1]}.`;
    }

    if (rest === "must be a string") {
      return `${field} é inválido.`;
    }
  }

  if (message.endsWith("should not exist")) {
    return "Dados inválidos.";
  }

  return message;
}

// Chamada autenticada ao backend (o token vem do cookie httpOnly)
export async function adminRequest<T = unknown>(
  path: string,
  init: { method: "POST" | "PUT" | "DELETE"; body?: unknown },
): Promise<AdminResult<T>> {
  const token = await getToken();

  if (!token) {
    return {
      ok: false,
      status: 401,
      error: "Sua sessão expirou. Entre novamente.",
    };
  }

  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method: init.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
      cache: "no-store",
    });
  } catch {
    return {
      ok: false,
      status: 0,
      error: "Não foi possível conectar ao servidor.",
    };
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const raw = Array.isArray(data?.message) ? data.message[0] : data?.message;

    const error =
      response.status === 401
        ? "Sua sessão expirou. Entre novamente."
        : response.status === 403
          ? "Você não tem permissão para fazer isso."
          : translate(raw ?? "Erro inesperado.");

    return { ok: false, status: response.status, error };
  }

  return { ok: true, data: data as T };
}
