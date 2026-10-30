import "server-only";
import { API_URL } from "./api";
import { getToken } from "./session";

export async function getAdminData<T>(path: string): Promise<T | null> {
  const token = await getToken();
  if (!token) return null;
  try {
    const response = await fetch(`${API_URL}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}
