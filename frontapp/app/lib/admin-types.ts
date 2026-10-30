// Dados do formulário de disco (tudo já convertido para os tipos da API)
export interface VinylInput {
  title: string;
  artistId: number;
  genreId: number;
  releaseYear: number;
  price: number;
  condition: string;
  rpmSpeed: number;
  stockQuantity: number;
  coverUrl: string;
}

export interface ArtistInput {
  name: string;
  country: string;
  bio: string;
}

export interface GenreInput {
  name: string;
  description: string;
}

// Resultado das ações do admin
export interface ActionResult {
  error?: string;
  // true quando o backend recusou o token: o cookie já foi apagado
  // e a tela deve levar a pessoa de volta ao login
  sessionExpired?: boolean;
}
export interface UserInput {
  name: string;
  email: string;
  password?: string;
  role: "ADMIN" | "CUSTOMER";
}

export interface ProfileInput {
  userId: number;
  fullName: string;
  birthDate: string;
  avatarUrl: string;
}
