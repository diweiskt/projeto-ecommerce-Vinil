"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";
import { demoLoginAction, loginAction, registerAction } from "../lib/auth-actions";

export default function LoginPage() {
  const router = useRouter();

  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleDemoLogin() {
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      const result = await demoLoginAction();
      if (result.error) {
        setError(result.error);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Não foi possível entrar na demonstração. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  function switchMode(registerMode: boolean) {
    setIsRegister(registerMode);
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setError("");

    const form = new FormData(event.currentTarget);

    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const confirmPassword = String(form.get("confirmPassword") ?? "");
    const remember = form.get("remember") === "on";

    if (isRegister && password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      const result = isRegister
        ? await registerAction({ name, email, password })
        : await loginAction({ email, password, remember });

      if (result.error) {
        setError(result.error);
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Não foi possível concluir a operação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      {/* Lado visual */}
      <section className={styles.visual}>
        <Link href="/" className={styles.logo}>
          <span>VINYL</span>
          <strong>STORE</strong>
        </Link>

        <div className={styles.visualContent}>
          <span className={styles.eyebrow}>A MÚSICA NUNCA SAI DE MODA</span>

          <h1>
            Sua coleção.
            <br />
            Sua história.
            <br />
            <em>Seu som.</em>
          </h1>

          <p>
            Descubra discos especiais e encontre os álbuns que merecem fazer
            parte da sua história.
          </p>
        </div>

        <span className={styles.visualFooter}>
          UMA EXPERIÊNCIA PARA QUEM AMA MÚSICA.
        </span>
      </section>

      {/* Formulário */}
      <section className={styles.formSection}>
        <Link href="/" className={styles.backLink}>
          ← Voltar para a loja
        </Link>

        <div className={styles.formContainer}>
          <span className={styles.formEyebrow}>
            {isRegister ? "FAÇA PARTE DA COMUNIDADE" : "BEM-VINDO DE VOLTA"}
          </span>

          <h2>{isRegister ? "Crie sua conta." : "Entre na sua conta."}</h2>

          <p className={styles.description}>
            {isRegister
              ? "Cadastre-se para começar sua coleção."
              : "Entre para continuar explorando nossa coleção."}
          </p>

          <div className={styles.tabs}>
            <button
              type="button"
              className={!isRegister ? styles.activeTab : ""}
              onClick={() => switchMode(false)}
            >
              Entrar
            </button>

            <button
              type="button"
              className={isRegister ? styles.activeTab : ""}
              onClick={() => switchMode(true)}
            >
              Criar conta
            </button>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            {isRegister && (
              <div className={styles.field}>
                <label htmlFor="name">Nome completo</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Como podemos te chamar?"
                  autoComplete="name"
                  minLength={3}
                  required
                />
              </div>
            )}

            <div className={styles.field}>
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="seuemail@exemplo.com"
                autoComplete="email"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="password">Senha</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Digite sua senha"
                autoComplete={isRegister ? "new-password" : "current-password"}
                minLength={isRegister ? 8 : 6}
                required
              />
            </div>

            {isRegister && (
              <div className={styles.field}>
                <label htmlFor="confirmPassword">Confirmar senha</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Digite sua senha novamente"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </div>
            )}

            {!isRegister && (
              <div className={styles.formOptions}>
                <label className={styles.remember}>
                  <input type="checkbox" name="remember" />
                  <span>Manter conectado</span>
                </label>

                <button
                  type="button"
                  className={styles.forgotPassword}
                  onClick={() =>
                    alert("A recuperação de senha será implementada depois.")
                  }
                >
                  Esqueci minha senha
                </button>
              </div>
            )}

            {error && (
              <p className={styles.error} role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading
                ? "Aguarde..."
                : isRegister
                  ? "Criar minha conta"
                  : "Entrar"}
              <span>→</span>
            </button>
            {!isRegister && (
              <>
                <button
                  type="button"
                  className={styles.demoButton}
                  disabled={loading}
                  onClick={handleDemoLogin}
                >
                  Testar Demo <span aria-hidden="true">→</span>
                </button>
                <p className={styles.demoHint}>
                  Explore o painel em modo somente leitura, sem precisar criar uma conta.
                </p>
              </>
            )}
          </form>

          <p className={styles.switchText}>
            {isRegister ? "Já tem uma conta?" : "Ainda não tem uma conta?"}{" "}
            <button type="button" onClick={() => switchMode(!isRegister)}>
              {isRegister ? "Entrar" : "Cadastre-se"}
            </button>
          </p>

          <div className={styles.divider}>
            <span>VINYL STORE</span>
          </div>
        </div>

        <p className={styles.legal}>
          Ao continuar, você concorda com nossos termos de uso e política de
          privacidade.
        </p>
      </section>
    </main>
  );
}
