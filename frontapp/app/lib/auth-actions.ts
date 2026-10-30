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
