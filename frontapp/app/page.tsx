import styles from "./page.module.css";
import Link from "next/link";
import Icon from "./components/Icon";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import VinylCard from "./components/VinylCard/VinylCard";
import { getGenres, getVinyls } from "./lib/api";

export default async function Home() {
  const [vinyls, genres] = await Promise.all([
    getVinyls({ inStock: "true" })
      .then((list) => list.slice(0, 4))
      .catch(() => []),
    getGenres().catch(() => []),
  ]);

  return (
    <>
      <Header />

      <main>
        <Hero />

        {/* Discos em destaque */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionLabel}>NOSSA COLEÇÃO</span>

              <h2>Discos em destaque</h2>
            </div>

            <Link href="/vinyls" className={styles.viewAll}>
              ...
            </Link>
          </div>

          <div className={styles.vinylGrid}>
            {vinyls.map((vinyl) => (
              <VinylCard key={vinyl.id} vinyl={vinyl} />
            ))}
          </div>
        </section>

        {/* Gêneros musicais */}
        <section id="genres" className={styles.genres}>
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionLabel}>EXPLORE</span>

              <h2>Encontre seu estilo</h2>
            </div>
          </div>

          <div className={styles.genreGrid}>
            {genres.map((genre, index) => (
              <a
                href={`/vinyls?genreId=${genre.id}`}
                className={styles.genreCard}
                key={genre.id}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>

                <h3>{genre.name}</h3>

                <span className={styles.genreArrow}>
                  <Icon name="arrow" />
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Sobre a loja */}
        <section className={styles.about}>
          <div>
            <span className={styles.sectionLabel}>SOBRE A LOJA</span>

            <h2>
              Para quem acredita que
              <br />
              música é mais do que ouvir.
            </h2>
          </div>

          <p>
            Reunimos discos clássicos e especiais para colecionadores, amantes
            da música e para quem deseja descobrir a experiência de ouvir um
            álbum do começo ao fim.
          </p>
        </section>
      </main>

      {/* Rodapé */}
      <footer className={styles.footer}>
        <p>© 2026 Vinyl Store</p>
        <p>Feito para quem ama música.</p>
      </footer>
    </>
  );
}
