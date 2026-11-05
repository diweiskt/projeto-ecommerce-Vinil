"use server";

import { redirect } from "next/navigation";
import { login, register } from "./api";
import { createSession, deleteSession } from "./session";

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Erro inesperado.";
}

export async function loginAction(input: {
  email: string;
  password: string;
  remember: boolean;
}): Promise<{ error?: string }> {
  try {
    const data = await login(String(input.email), String(input.password));
    await createSession(data.access_token, Boolean(input.remember));
    return {};
  } catch (err) {
    return { error: errorMessage(err) };
  }
}

export async function registerAction(input: {
  name: string;
  email: string;
  password: string;
}): Promise<{ error?: string }> {
  try {
    const data = await register(
      String(input.name),
      String(input.email),
      String(input.password),
    );
    await createSession(data.access_token, true);
    return {};
  } catch (err) {
    return { error: errorMessage(err) };
  }
}

export async function logoutAction() {
  await deleteSession();
  redirect("/");
}

// Credenciais ficam somente no servidor, nunca no bundle do navegador.
export async function demoLoginAction(): Promise<{ error?: string }> {
  const email = process.env.DEMO_EMAIL;
  const password = process.env.DEMO_PASSWORD;
  if (!email || !password) {
    return { error: "Demonstração indisponível no momento." };
  }
  try {
    const data = await login(email, password);
    // Nunca permitir login automático em uma conta administrativa.
    if (data.user?.role !== "DEMO") {
      return { error: "Demonstração indisponível no momento." };
    }
    await createSession(data.access_token, false);
    return {};
  } catch {
    return { error: "Não foi possível entrar na demonstração. Tente novamente." };
  }
}
