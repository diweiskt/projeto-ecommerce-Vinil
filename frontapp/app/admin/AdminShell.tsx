import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./admin.module.css";

import Header from "../components/Header/Header";

interface AdminShellProps {
  active: "dashboard" | "vinyls" | "artists" | "genres" | "users" | "profiles";
  title: string;
  actions?: ReactNode;
  children: ReactNode;
}

export default function AdminShell({
  active,
  title,
  actions,
  children,
}: AdminShellProps) {
  return (
    <div className={styles.adminLayout}>
      <Header />

      <main className={styles.page}>
        <header className={styles.heading}>
          <div>
            <span className={styles.eyebrow}>ÁREA ADMINISTRATIVA</span>
            <h1>{title}</h1>
          </div>

          {actions}
        </header>

        <nav className={styles.subnav} aria-label="Administração">
          <Link
            href="/admin"
            className={active === "dashboard" ? styles.activeLink : undefined}
            aria-current={active === "dashboard" ? "page" : undefined}
          >
            Painel
          </Link>

          <Link
            href="/admin/vinyls"
            className={active === "vinyls" ? styles.activeLink : undefined}
            aria-current={active === "vinyls" ? "page" : undefined}
          >
            Discos
          </Link>

          <Link
            href="/admin/artists"
            className={active === "artists" ? styles.activeLink : undefined}
            aria-current={active === "artists" ? "page" : undefined}
          >
            Artistas
          </Link>

          <Link
            href="/admin/genres"
            className={active === "genres" ? styles.activeLink : undefined}
            aria-current={active === "genres" ? "page" : undefined}
          >
            Gêneros
          </Link>

          <Link
            href="/admin/users"
            className={active === "users" ? styles.activeLink : undefined}
            aria-current={active === "users" ? "page" : undefined}
          >
            Usuários
          </Link>

          <Link
            href="/admin/profiles"
            className={active === "profiles" ? styles.activeLink : undefined}
            aria-current={active === "profiles" ? "page" : undefined}
          >
            Perfis
          </Link>
        </nav>

        {children}
      </main>

      <footer className={styles.footer}>
        <p>© 2026 Vinyl Store</p>
        <p>Feito para quem ama música.</p>
      </footer>
    </div>
  );
}
