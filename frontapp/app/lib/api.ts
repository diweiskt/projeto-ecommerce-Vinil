import "server-only";

export const API_URL = process.env.API_URL ?? "http://localhost:3000/api";

export interface Vinyl {
  id: number;
  title: string;
  artist: string;
  genre: string;
  releaseYear: number;
  price: number;
  condition: string;
  rpmSpeed: number;
  stockQuantity: number;
  artistId: number;
  genreId: number;
  coverUrl?: string | null;
}

export interface Genre {
  id: number;
  name: string;
  description: string;
}

// Formato que a API devolve
interface ApiVinylRecord {
  id: number;
  title: string;
  releaseYear: number;
  price: string | number; // Decimal chega como string
  condition: string;
  rpmSpeed: number;
  stockQuantity: number;
  artistId: number;
  genreId: number;
  coverUrl?: string | null;
  artist: { name: string };
  genre: { name: string };
}

function toVinyl(record: ApiVinylRecord): Vinyl {
  return {
    id: record.id,
    title: record.title,
    artist: record.artist.name,
    genre: record.genre.name,
    releaseYear: record.releaseYear,
    price: Number(record.price),
    condition: record.condition,
    rpmSpeed: record.rpmSpeed,
    stockQuantity: record.stockQuantity,
    artistId: record.artistId,
    genreId: record.genreId,
    coverUrl: record.coverUrl,
  };
}

export async function getVinyls(
  params: Record<string, string | number> = {},
): Promise<Vinyl[]> {
  const query = new URLSearchParams(
    Object.entries(params).map(([key, value]) => [key, String(value)]),
  ).toString();

  const response = await fetch(
    `${API_URL}/vinyl-records${query ? `?${query}` : ""}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error("Falha ao buscar discos");
  }

  const data: ApiVinylRecord[] = await response.json();
  return data.map(toVinyl);
}

export async function getGenres(): Promise<Genre[]> {
  const response = await fetch(`${API_URL}/genres`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Falha ao buscar gêneros");
  }

  return response.json();
}

// ---------- Autenticação ----------

export interface AuthResponse {
  access_token: string;
}

// Mensagens de validação do class-validator vêm em inglês
function translateMessage(message: string): string {
  if (message.includes("email must be an email")) {
    return "Informe um e-mail válido.";
  }
  if (message.startsWith("password must be longer")) {
    return "A senha deve ter pelo menos 6 caracteres.";
  }
  if (message.startsWith("name must be longer")) {
    return "O nome deve ter pelo menos 3 caracteres.";
  }
  return message;
}

async function authRequest(
  path: "login" | "register",
  body: Record<string, string>,
): Promise<AuthResponse> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}/auth/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    throw new Error("Não foi possível conectar ao servidor.");
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = Array.isArray(data?.message)
      ? data.message[0]
      : data?.message;

    throw new Error(translateMessage(message ?? "Erro inesperado."));
  }

  return data as AuthResponse;
}

export function login(email: string, password: string) {
  return authRequest("login", { email, password });
}

export function register(name: string, email: string, password: string) {
  return authRequest("register", { name, email, password });
}

// ---------- Artistas ----------

export interface Artist {
  id: number;
  name: string;
  country: string;
  bio: string;
}

export async function getArtists(): Promise<Artist[]> {
  const response = await fetch(`${API_URL}/artists`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Falha ao buscar artistas");
  }

  return response.json();
}

// ---------- Detalhe do disco ----------

export interface VinylDetail extends Vinyl {
  genreId: number;
  artistId: number;
  artistCountry: string;
  artistBio: string;
}

interface ApiVinylRecordDetail extends ApiVinylRecord {
  genreId: number;
  artistId: number;
  artist: { name: string; country: string; bio: string };
}

// Devolve null quando o disco não existe (404)
export async function getVinyl(id: number): Promise<VinylDetail | null> {
  const response = await fetch(`${API_URL}/vinyl-records/${id}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Falha ao buscar disco");
  }

  const data: ApiVinylRecordDetail = await response.json();

  return {
    ...toVinyl(data),
    genreId: data.genreId,
    artistId: data.artistId,
    artistCountry: data.artist.country,
    artistBio: data.artist.bio,
  };
}

// ---------- Artista e gênero individuais (admin) ----------

// Devolvem null quando não existem (404)
export async function getArtist(id: number): Promise<Artist | null> {
  const response = await fetch(`${API_URL}/artists/${id}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Falha ao buscar artista");
  }

  return response.json();
}

export async function getGenre(id: number): Promise<Genre | null> {
  const response = await fetch(`${API_URL}/genres/${id}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Falha ao buscar gênero");
  }

  return response.json();
}
