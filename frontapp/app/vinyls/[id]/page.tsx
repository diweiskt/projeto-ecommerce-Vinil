import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./detail.module.css";

import Header from "../../components/Header/Header";
import VinylCard from "../../components/VinylCard/VinylCard";
import { getVinyl, getVinyls, type VinylDetail } from "../../lib/api";

interface VinylPageProps {
  params: Promise<{ id: string }>;
}

// Só aceita números inteiros positivos dentro do limite do banco
function parseId(raw: string): number | null {
  const id = Number(raw);

  return /^\d+$/.test(raw) && id >= 1 && id <= 2147483647 ? id : null;
}

function formatPrice(value: number) {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

function stockInfo(quantity: number) {
  if (quantity <= 0) {
    return { label: "Esgotado", tone: styles.out };
  }

  if (quantity <= 3) {
    return {
      label:
        quantity === 1
          ? "Resta apenas 1 unidade"
          : `Restam apenas ${quantity} unidades`,
      tone: styles.low,
    };
  }

  return { label: "Em estoque", tone: styles.available };
}

export async function generateMetadata({
  params,
}: VinylPageProps): Promise<Metadata> {
  const id = parseId((await params).id);
  const vinyl = id ? await getVinyl(id).catch(() => null) : null;

  if (!vinyl) {
    return { title: "Disco não encontrado" };
  }

  return {
    title: `${vinyl.title} — ${vinyl.artist} | Vinyl Store`,
    description: `${vinyl.title}, de ${vinyl.artist} (${vinyl.releaseYear}).`,
  };
}

function Footer() {
  return (
    <footer className={styles.footer}>
      <p>© 2026 Vinyl Store</p>
      <p>Feito para quem ama música.</p>
    </footer>
  );
}

export default async function VinylPage({ params }: VinylPageProps) {
  const id = parseId((await params).id);

  if (!id) {
    notFound();
  }

  let vinyl: VinylDetail | null = null;
  let failed = false;

  try {
    vinyl = await getVinyl(id);
  } catch {
    failed = true;
  }

  // notFound() lança um erro especial; por isso fica fora do try/catch
  if (!failed && !vinyl) {
    notFound();
  }

  if (failed || !vinyl) {
    return (
      <>
        <Header />

        <main className={styles.page}>
          <div className={styles.message}>
            <h1>Não foi possível carregar o disco</h1>
            <p>Tente novamente em instantes.</p>
            <Link href="/vinyls">← Voltar ao catálogo</Link>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  const stock = stockInfo(vinyl.stockQuantity);

  // Outros discos do mesmo gênero
  const related = (await getVinyls({ genreId: vinyl.genreId }).catch(() => []))
    .filter((item) => item.id !== vinyl.id)
    .slice(0, 4);

  return (
    <>
      <Header />

      <main className={styles.page}>
        <nav className={styles.breadcrumb} aria-label="Você está em">
          <Link href="/">Início</Link>
          <span aria-hidden="true">/</span>
          <Link href="/vinyls">Discos</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{vinyl.title}</span>
        </nav>

        <section className={styles.product}>
          <div className={styles.cover}>
            {vinyl.coverUrl ? (
              <img
                src={vinyl.coverUrl}
                alt={`Capa do álbum ${vinyl.title}`}
                className={styles.coverImage}
              />
            ) : (
              <div className={styles.record}>
                <div className={styles.recordCenter} />
              </div>
            )}
          </div>

          <div className={styles.info}>
            <Link
              href={`/vinyls?genreId=${vinyl.genreId}`}
              className={styles.label}
            >
              {vinyl.genre}
            </Link>

            <h1>{vinyl.title}</h1>

            <p className={styles.artistLine}>
              por{" "}
              <Link href={`/vinyls?search=${encodeURIComponent(vinyl.artist)}`}>
                {vinyl.artist}
              </Link>
              {vinyl.artistCountry && <span> · {vinyl.artistCountry}</span>}
            </p>

            <div className={styles.priceRow}>
              <strong className={styles.price}>
                {formatPrice(vinyl.price)}
              </strong>

              <span className={`${styles.stock} ${stock.tone}`}>
                {stock.label}
              </span>
            </div>

            <dl className={styles.facts}>
              <div>
                <dt>Lançamento</dt>
                <dd>{vinyl.releaseYear}</dd>
              </div>

              <div>
                <dt>Condição</dt>
                <dd>{vinyl.condition}</dd>
              </div>

              <div>
                <dt>Rotação</dt>
                <dd>{vinyl.rpmSpeed} RPM</dd>
              </div>

              <div>
                <dt>Gênero</dt>
                <dd>{vinyl.genre}</dd>
              </div>
            </dl>

            {vinyl.artistBio && (
              <div className={styles.about}>
                <h2>Sobre o artista</h2>
                <p>{vinyl.artistBio}</p>
              </div>
            )}

            <div className={styles.actions}>
              <Link href="/vinyls">← Voltar ao catálogo</Link>

              <Link href={`/vinyls?search=${encodeURIComponent(vinyl.artist)}`}>
                Mais de {vinyl.artist}
              </Link>
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className={styles.related}>
            <header className={styles.relatedHeader}>
              <span className={styles.label}>VOCÊ TAMBÉM PODE GOSTAR</span>
              <h2>Mais de {vinyl.genre}</h2>
            </header>

            <div className={styles.grid}>
              {related.map((item) => (
                <VinylCard key={item.id} vinyl={item} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
