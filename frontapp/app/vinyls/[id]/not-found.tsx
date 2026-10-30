import Link from "next/link";
import styles from "./detail.module.css";

import Header from "../../components/Header/Header";

export default function VinylNotFound() {
  return (
    <>
      <Header />

      <main className={styles.page}>
        <div className={styles.message}>
          <h1>Disco não encontrado</h1>
          <p>Esse disco não existe ou saiu do nosso catálogo.</p>
          <Link href="/vinyls">← Voltar ao catálogo</Link>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>© 2026 Vinyl Store</p>
        <p>Feito para quem ama música.</p>
      </footer>
    </>
  );
}
