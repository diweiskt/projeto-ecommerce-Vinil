import Link from "next/link";
import styles from "./VinylCard.module.css";

interface Vinyl {
  id: number;
  title: string;
  artist: string;
  genre: string;
  releaseYear: number;
  price: number;
  condition: string;
  rpmSpeed: number;
  coverUrl?: string | null;
}

interface VinylCardProps {
  vinyl: Vinyl;
}

export default function VinylCard({ vinyl }: VinylCardProps) {
  return (
    <article className={styles.card}>
      <Link href={`/vinyls/${vinyl.id}`} className={styles.link}>
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

          <span className={styles.genre}>{vinyl.genre}</span>
        </div>

        <div className={styles.info}>
          <div>
            <h3>{vinyl.title}</h3>
            <p>{vinyl.artist}</p>
          </div>

          <strong>R$ {vinyl.price.toFixed(2).replace(".", ",")}</strong>
        </div>

        <div className={styles.details}>
          <span>{vinyl.releaseYear}</span>
          <span>{vinyl.condition}</span>
          <span>{vinyl.rpmSpeed} RPM</span>
        </div>
      </Link>
    </article>
  );
}
