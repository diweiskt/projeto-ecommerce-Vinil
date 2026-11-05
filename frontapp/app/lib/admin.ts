import "server-only";

import { notFound, redirect } from "next/navigation";
import { getSession, type SessionUser } from "./session";

// Use no início de toda página e ação do admin.
// Visitante vai para o login; cliente comum recebe 404 (a área não "existe" para ele).
// A proteção de verdade está no backend (JWT + ADMIN em cada rota de escrita).
export async function requireAdmin(): Promise<SessionUser> {
  const user = await getSession();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN") {
    notFound();
  }

  return user;
}

// Somente páginas de consulta; ações e formulários continuam usando requireAdmin.
export async function requirePanelAccess(): Promise<SessionUser> {
  const user = await getSession();
  if (!user) redirect("/login");
  if (!["ADMIN", "DEMO"].includes(user.role)) notFound();
  return user;
}
