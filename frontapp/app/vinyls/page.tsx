import styles from "./vinyls.module.css";
import SearchBox from "../components/SearchBox/SearchBox";
import Header from "../components/Header/Header";
import VinylCard from "../components/VinylCard/VinylCard";
import { getGenres, getVinyls } from "../lib/api";
import Link from "next/link";

interface VinylsPageProps {
  searchParams: Promise<{
    genreId?: string;
    search?: string | string[];
  }>;
}

export default async function VinylsPage({ searchParams }: VinylsPageProps) {
  const params = await searchParams;
  const rawSearch = Array.isArray(params.search)
    ? params.search[0]
    : params.search;
  const search = rawSearch?.trim() ?? "";
  const genreId = params.genreId;

  const [vinyls, allVinyls, genres] = await Promise.all([
    getVinyls(genreId ? { genreId } : {}).catch(() => []),
    // Com um gênero selecionado, `vinyls` vem filtrado; as sugestões
    // devem considerar a loja inteira.
    genreId ? getVinyls().catch(() => []) : null,
    getGenres().catch(() => []),
  ]);

  const suggestionHints = new Map<string, string>();

  for (const vinyl of allVinyls ?? vinyls) {
    if (!suggestionHints.has(vinyl.title)) {
      suggestionHints.set(vinyl.title, "Álbum");
    }

    if (!suggestionHints.has(vinyl.artist)) {
      suggestionHints.set(vinyl.artist, "Artista");
    }
  }

  const suggestions = [...suggestionHints].map(([value, hint]) => ({
    value,
    hint,
  }));

  const filteredVinyls = vinyls.filter((vinyl) => {
    const term = search.toLocaleLowerCase("pt-BR");

    return (
      vinyl.title.toLocaleLowerCase("pt-BR").includes(term) ||
      vinyl.artist.toLocaleLowerCase("pt-BR").includes(term)
    );
  });

  return (
    <>
      <Header />

      <main className={styles.catalog}>
        <header className={styles.heading}>
          <span className={styles.eyebrow}>EXPLORE A COLEÇÃO</span>
          <h1>Todos os vinis</h1>
          <p>Clássicos, descobertas e álbuns especiais para sua coleção.</p>
        </header>

        <form className={styles.filters} action="/vinyls">
          <SearchBox
            name="search"
            placeholder="Buscar por álbum ou artista..."
            ariaLabel="Buscar por álbum ou artista"
            defaultValue={search}
            suggestions={suggestions}
            className={styles.search}
          />

          <select
            name="genreId"
            defaultValue={genreId ?? ""}
            aria-label="Filtrar por gênero"
          >
            <option value="">Todos os gêneros</option>

            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>

          <button type="submit">Buscar</button>
        </form>

        <div className={styles.results}>
          <span>
            {filteredVinyls.length}{" "}
            {filteredVinyls.length === 1
              ? "disco encontrado"
              : "discos encontrados"}
          </span>

          {(search || genreId) && <a href="/vinyls">Limpar filtros ×</a>}
        </div>

        {filteredVinyls.length > 0 ? (
          <section className={styles.grid}>
            {filteredVinyls.map((vinyl) => (
              <VinylCard key={vinyl.id} vinyl={vinyl} />
            ))}
          </section>
        ) : (
          <div className={styles.empty}>
            <h2>Nenhum disco encontrado</h2>
            <p>Tente buscar outro álbum ou artista, ou escolha outro gênero.</p>
            <Link href="/vinyls">...</Link>
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <p>© 2026 Vinyl Store</p>
        <p>Feito para quem ama música.</p>
      </footer>
    </>
  );
}
