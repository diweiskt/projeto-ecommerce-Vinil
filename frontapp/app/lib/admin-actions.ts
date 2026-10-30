"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "./admin";
import { adminRequest } from "./admin-api";
import { deleteSession } from "./session";
import type {
  ActionResult,
  ArtistInput,
  GenreInput,
  VinylInput,
  UserInput,
  ProfileInput,
} from "./admin-types";

// Sessão expirada: apaga o cookie e avisa a tela, que leva ao login.
// (Um redirect() aqui para uma página estática, como /login, não repassa
// o Set-Cookie, por isso o redirecionamento é feito pelo cliente.)
async function failure(status: number, error: string): Promise<ActionResult> {
  if (status === 401) {
    await deleteSession();

    return { error, sessionExpired: true };
  }

  return { error };
}

// id = null cadastra um disco novo; com id, edita o existente
export async function saveVinylAction(
  id: number | null,
  input: VinylInput,
): Promise<ActionResult> {
  await requireAdmin();

  if (id !== null && !Number.isInteger(id)) {
    return { error: "Disco inválido." };
  }

  const coverUrl = String(input.coverUrl ?? "").trim();

  const body = {
    title: String(input.title).trim(),
    releaseYear: Number(input.releaseYear),
    price: Number(input.price),
    condition: String(input.condition).trim(),
    rpmSpeed: Number(input.rpmSpeed),
    stockQuantity: Number(input.stockQuantity),
    artistId: Number(input.artistId),
    genreId: Number(input.genreId),
    // Vazio: ao criar, não envia; ao editar, null remove a capa
    coverUrl: coverUrl || (id !== null ? null : undefined),
  };

  const result = await adminRequest(
    id !== null ? `/vinyl-records/${id}` : "/vinyl-records",
    { method: id !== null ? "PUT" : "POST", body },
  );

  if (!result.ok) {
    return failure(result.status, result.error);
  }

  revalidatePath("/", "layout");

  return {};
}

export async function deleteVinylAction(id: number): Promise<ActionResult> {
  await requireAdmin();

  if (!Number.isInteger(id)) {
    return { error: "Disco inválido." };
  }

  const result = await adminRequest(`/vinyl-records/${id}`, {
    method: "DELETE",
  });

  if (!result.ok) {
    return failure(result.status, result.error);
  }

  revalidatePath("/", "layout");

  return {};
}

// id = null cadastra um artista novo; com id, edita o existente
export async function saveArtistAction(
  id: number | null,
  input: ArtistInput,
): Promise<ActionResult> {
  await requireAdmin();

  if (id !== null && !Number.isInteger(id)) {
    return { error: "Artista inválido." };
  }

  const result = await adminRequest(
    id !== null ? `/artists/${id}` : "/artists",
    {
      method: id !== null ? "PUT" : "POST",
      body: {
        name: String(input.name).trim(),
        country: String(input.country).trim(),
        bio: String(input.bio).trim(),
      },
    },
  );

  if (!result.ok) {
    return failure(result.status, result.error);
  }

  revalidatePath("/", "layout");

  return {};
}

// O backend recusa (409) artistas que ainda têm discos
export async function deleteArtistAction(id: number): Promise<ActionResult> {
  await requireAdmin();

  if (!Number.isInteger(id)) {
    return { error: "Artista inválido." };
  }

  const result = await adminRequest(`/artists/${id}`, { method: "DELETE" });

  if (!result.ok) {
    return failure(result.status, result.error);
  }

  revalidatePath("/", "layout");

  return {};
}

// id = null cadastra um gênero novo; com id, edita o existente
export async function saveGenreAction(
  id: number | null,
  input: GenreInput,
): Promise<ActionResult> {
  await requireAdmin();

  if (id !== null && !Number.isInteger(id)) {
    return { error: "Gênero inválido." };
  }

  const result = await adminRequest(id !== null ? `/genres/${id}` : "/genres", {
    method: id !== null ? "PUT" : "POST",
    body: {
      name: String(input.name).trim(),
      description: String(input.description).trim(),
    },
  });

  if (!result.ok) {
    return failure(result.status, result.error);
  }

  revalidatePath("/", "layout");

  return {};
}

// O backend recusa (409) gêneros que ainda têm discos
export async function deleteGenreAction(id: number): Promise<ActionResult> {
  await requireAdmin();

  if (!Number.isInteger(id)) {
    return { error: "Gênero inválido." };
  }

  const result = await adminRequest(`/genres/${id}`, { method: "DELETE" });

  if (!result.ok) {
    return failure(result.status, result.error);
  }

  revalidatePath("/", "layout");

  return {};
}

// Usuários
export async function saveUserAction(
  id: number | null,
  input: UserInput,
): Promise<ActionResult> {
  await requireAdmin();
  if (id !== null && !Number.isInteger(id))
    return { error: "Usuário inválido." };
  const body: Record<string, unknown> = {
    name: String(input.name).trim(),
    email: String(input.email).trim(),
    role: input.role,
  };
  if (input.password) body.password = input.password;
  const result = await adminRequest(id === null ? "/users" : `/users/${id}`, {
    method: id === null ? "POST" : "PUT",
    body,
  });
  if (!result.ok) return failure(result.status, result.error);
  revalidatePath("/admin/users");
  revalidatePath("/", "layout");
  return {};
}

export async function deleteUserAction(id: number): Promise<ActionResult> {
  await requireAdmin();
  if (!Number.isInteger(id)) return { error: "Usuário inválido." };
  const result = await adminRequest(`/users/${id}`, { method: "DELETE" });
  if (!result.ok) return failure(result.status, result.error);
  revalidatePath("/admin/users");
  revalidatePath("/admin/profiles");
  return {};
}

// Perfis
export async function saveProfileAction(
  id: number | null,
  input: ProfileInput,
): Promise<ActionResult> {
  await requireAdmin();
  if (id !== null && !Number.isInteger(id))
    return { error: "Perfil inválido." };
  const body: Record<string, unknown> = {
    fullName: String(input.fullName).trim(),
    birthDate: input.birthDate || undefined,
    avatarUrl: String(input.avatarUrl).trim() || undefined,
  };
  if (id === null) body.userId = Number(input.userId);
  const result = await adminRequest(
    id === null ? "/profiles" : `/profiles/${id}`,
    {
      method: id === null ? "POST" : "PUT",
      body,
    },
  );
  if (!result.ok) return failure(result.status, result.error);
  revalidatePath("/admin/profiles");
  return {};
}

export async function deleteProfileAction(id: number): Promise<ActionResult> {
  await requireAdmin();
  if (!Number.isInteger(id)) return { error: "Perfil inválido." };
  const result = await adminRequest(`/profiles/${id}`, { method: "DELETE" });
  if (!result.ok) return failure(result.status, result.error);
  revalidatePath("/admin/profiles");
  return {};
}
