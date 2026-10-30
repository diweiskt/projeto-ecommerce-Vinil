import Link from "next/link";
import styles from "./artists.module.css";
import SearchBox from "../components/SearchBox/SearchBox";
import Header from "../components/Header/Header";
import { getArtists } from "../lib/api";

interface ArtistsPageProps {
  searchParams: Promise<{
    search?: string | string[];
  }>;
}

// Ignora acentos e maiúsculas na busca ("joao" encontra "João")
function normalize(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");
}

export default async function ArtistsPage({ searchParams }: ArtistsPageProps) {
  const params = await searchParams;

  const rawSearch = Array.isArray(params.search)
    ? params.search[0]
    : params.search;
  const search = rawSearch?.trim() ?? "";

  const artists = await getArtists().catch(() => null);
  const failed = artists === null;

  const suggestionHints = new Map<string, string>();

  for (const artist of artists ?? []) {
    suggestionHints.set(artist.name, "Artista");
  }

  for (const artist of artists ?? []) {
    if (!suggestionHints.has(artist.country)) {
      suggestionHints.set(artist.country, "País");
    }
  }

  const suggestions = [...suggestionHints].map(([value, hint]) => ({
    value,
    hint,
  }));

  const term = normalize(search);
  const filteredArtists = (artists ?? []).filter(
    (artist) =>
      normalize(artist.name).includes(term) ||
      normalize(artist.country).includes(term),
  );

  return (
    <>
      <Header />

      <main className={styles.catalog}>
        <header className={styles.heading}>
          <span className={styles.eyebrow}>QUEM FAZ A MÚSICA</span>
          <h1>Artistas</h1>
          <p>Conheça os nomes por trás dos discos da nossa coleção.</p>
        </header>

        <form className={styles.filters} action="/artists">
          <SearchBox
            name="search"
            placeholder="Buscar por artista ou país..."
            ariaLabel="Buscar por artista ou país"
            defaultValue={search}
            suggestions={suggestions}
            className={styles.search}
          />

          <button type="submit">Buscar</button>
        </form>

        {failed ? (
          <div className={styles.empty}>
            <h2>Não foi possível carregar os artistas</h2>
            <p>Tente novamente em instantes.</p>
          </div>
        ) : (
          <>
            <div className={styles.results}>
              <span>
                {filteredArtists.length}{" "}
                {filteredArtists.length === 1
                  ? "artista encontrado"
                  : "artistas encontrados"}
              </span>

              {search && <Link href="/artists">Limpar busca ×</Link>}
            </div>

            {filteredArtists.length > 0 ? (
              <section className={styles.grid}>
                {filteredArtists.map((artist) => (
                  <Link
                    key={artist.id}
                    href={`/vinyls?search=${encodeURIComponent(artist.name)}`}
                    className={styles.card}
                  >
                    <span className={styles.initial} aria-hidden="true">
                      {artist.name.charAt(0).toUpperCase()}
                    </span>

                    <div className={styles.cardBody}>
                      <span className={styles.country}>{artist.country}</span>

                      <h2>{artist.name}</h2>

                      <p>{artist.bio}</p>
                    </div>

                    <span className={styles.cardLink}>Ver discos →</span>
                  </Link>
                ))}
              </section>
            ) : (
              <div className={styles.empty}>
                <h2>Nenhum artista encontrado</h2>
                <p>Tente buscar outro nome ou país.</p>
                <Link href="/artists">Ver todos os artistas</Link>
              </div>
            )}
          </>
        )}
      </main>

      <footer className={styles.footer}>
        <p>© 2026 Vinyl Store</p>
        <p>Feito para quem ama música.</p>
      </footer>
    </>
  );
}
