import Link from "next/link";
import styles from "./Header.module.css";
import { getSession, getToken } from "../../lib/session";
import { API_URL } from "../../lib/api";
import { logoutAction } from "../../lib/auth-actions";
import HeaderSearch from "./HeaderSearch";
import MobileMenu from "./MobileMenu";
import Icon from "../Icon";
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
    <>
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>
          <span>VINYL</span>
          <strong>STORE</strong>
        </Link>

        <nav className={styles.desktopNav} aria-label="Navegação principal">
          <Link href="/">Início</Link>
          <Link href="/vinyls">Discos</Link>
          <a href="/artists">Artistas</a>
          <GenresLink />
          {(user?.role === "ADMIN" || user?.role === "DEMO") && (
            <Link href="/admin">Admin</Link>
          )}
        </nav>

        <div className={styles.headerSearch}>
          <HeaderSearch />
        </div>
        <div className={styles.actions}>
          <button type="button" aria-label="Carrinho">
            <Icon name="cart" />
          </button>

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
          <MobileMenu>
            <Link href="/">Início</Link>
            <Link href="/vinyls">Discos</Link>
            <Link href="/artists">Artistas</Link>
            <GenresLink />
            {(user?.role === "ADMIN" || user?.role === "DEMO") && (
              <Link href="/admin">Painel</Link>
            )}
            {user && user.role !== "DEMO" && (
              <Link href="/profile">Meu perfil</Link>
            )}
            {user ? (
              <form action={logoutAction}>
                <button type="submit">Sair da conta</button>
              </form>
            ) : (
              <Link href="/login">Entrar</Link>
            )}
          </MobileMenu>
        </div>
      </header>
      <div className={styles.headerSpacer} aria-hidden="true" />
    </>
  );
}
