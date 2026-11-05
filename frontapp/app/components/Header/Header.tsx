import Link from "next/link";
import styles from "./Header.module.css";
import { getSession, getToken } from "../../lib/session";
import { API_URL } from "../../lib/api";
import { logoutAction } from "../../lib/auth-actions";
import HeaderSearch from "./HeaderSearch";
import GenresLink from "./GenresLink";

export default async function Header() {
  const user = await getSession();
  let avatarUrl = "";
  if (user) {
    const token = await getToken();
    if (token) {
      try {
        const response = await fetch(`${API_URL}/account-profile`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        if (response.ok) {
          const profile = await response.json();
          avatarUrl = profile?.avatarUrl || "";
        }
      } catch {
        /* avatar opcional; o cabeçalho continua disponível */
      }
    }
  }

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        <span>VINYL</span>
        <strong>STORE</strong>
      </Link>

      <nav>
        <Link href="/">Início</Link>
        <Link href="/vinyls">Discos</Link>
        <a href="/artists">Artistas</a>
        <GenresLink />
        {(user?.role === "ADMIN" || user?.role === "DEMO") && <Link href="/admin">Admin</Link>}
      </nav>

      <div className={styles.actions}>
        <HeaderSearch />
        <button aria-label="Carrinho">🛒</button>

        {user ? (
          <>
            <Link
              href="/profile"
              className={styles.userAccount}
              aria-label="Editar meu perfil"
            >
              {avatarUrl ? (
                <img className={styles.avatarImage} src={avatarUrl} alt="" />
              ) : (
                <span className={styles.avatarFallback}>
                  {user.name.trim().charAt(0).toUpperCase()}
                </span>
              )}
              <span className={styles.userName}>
                Olá, {user.name.split(" ")[0]}
              </span>
            </Link>

            <form action={logoutAction} className={styles.logoutForm}>
              <button type="submit" className={styles.logout}>
                Sair
              </button>
            </form>
          </>
        ) : (
          <Link href="/login" className={styles.login}>
            Entrar
          </Link>
        )}
      </div>
    </header>
  );
}
