"use server";
import { API_URL } from "./api";
import { getToken } from "./session";

export async function getMyProfile() {
  const token = await getToken();
  if (!token) return { error: "Entre novamente na sua conta." };
  try {
    const response = await fetch(`${API_URL}/account-profile`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) return { error: "Não foi possível carregar seu perfil." };
    return { profile: data };
  } catch {
    return { error: "Não foi possível conectar ao servidor." };
  }
}

export async function saveMyProfile(input: {
  fullName: string;
  birthDate: string | null;
  avatarUrl: string;
}) {
  const token = await getToken();
  if (!token) return { error: "Entre novamente na sua conta." };
  try {
    const response = await fetch(`${API_URL}/account-profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fullName: input.fullName,
        birthDate: input.birthDate || undefined,
        avatarUrl: input.avatarUrl || undefined,
      }),
      cache: "no-store",
    });
    const data = await response.json().catch(() => null);
    if (!response.ok)
      return {
        error: Array.isArray(data?.message)
          ? data.message[0]
          : data?.message || "Não foi possível salvar o perfil.",
      };
    return { ok: true };
  } catch {
    return { error: "Não foi possível conectar ao servidor." };
  }
}
