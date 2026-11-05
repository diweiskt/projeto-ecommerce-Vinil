import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./admin.module.css";

import { requirePanelAccess } from "../lib/admin";

import Header from "../components/Header/Header";

interface AdminShellProps {
  active: "dashboard" | "vinyls" | "artists" | "genres" | "users" | "profiles";
  title: string;
  actions?: ReactNode;
  children: ReactNode;
}

export default async function AdminShell({
  active,
  title,
  actions,
  children,
}: AdminShellProps) {
  const user = await requirePanelAccess();
  return (
    <div className={styles.adminLayout}>
      <Header />

      <main className={styles.page}>
        <header className={styles.heading}>
          <div>
            <span className={styles.eyebrow}>ÁREA ADMINISTRATIVA</span>
            <h1>{title}</h1>
          </div>

          {user.role === "ADMIN" && actions}
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

          {user.role === "ADMIN" && (<Link
            href="/admin/users"
            className={active === "users" ? styles.activeLink : undefined}
            aria-current={active === "users" ? "page" : undefined}
          >
            Usuários
          </Link>)}

          {user.role === "ADMIN" && (<Link
            href="/admin/profiles"
            className={active === "profiles" ? styles.activeLink : undefined}
            aria-current={active === "profiles" ? "page" : undefined}
          >
            Perfis
          </Link>)}
        </nav>

        {user.role === "DEMO" && <p>Modo demonstração: somente leitura.</p>}
        {children}
      </main>

      <footer className={styles.footer}>
        <p>© 2026 Vinyl Store</p>
        <p>Feito para quem ama música.</p>
      </footer>
    </div>
  );
}
