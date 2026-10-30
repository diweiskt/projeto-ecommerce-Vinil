import styles from "./Hero.module.css";
import Link from "next/link";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <span className={styles.heroLabel}>VINYL STORE</span>

        <h1>
          Música que você
          <br />
          pode <span>tocar.</span>
        </h1>

        <p>Encontre discos clássicos e novos para completar sua coleção.</p>

        <Link href="/vinyls" className={styles.heroButton}>
          Explorar coleção
        </Link>
      </div>
    </section>
  );
}
