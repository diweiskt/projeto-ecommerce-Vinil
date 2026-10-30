"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./admin.module.css";
import { saveUserAction } from "../lib/admin-actions";

export interface UserRecord {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function UserForm({ user }: { user?: UserRecord }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    try {
      const result = await saveUserAction(user?.id ?? null, {
        name: String(form.get("name") ?? "").trim(),
        email: String(form.get("email") ?? "").trim(),
        password: String(form.get("password") ?? ""),
        role: String(form.get("role") ?? "CUSTOMER") as "ADMIN" | "CUSTOMER",
      });
      if (result.sessionExpired) {
        router.push("/login");
        router.refresh();
        return;
      }
      if (result.error) {
        setError(result.error);
        return;
      }
      router.push("/admin/users");
      router.refresh();
    } catch {
      setError("Não foi possível salvar o usuário.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <form className={styles.form} onSubmit={submit}>
      <div className={styles.field}>
        <label htmlFor="name">Nome</label>
        <input
          id="name"
          name="name"
          minLength={3}
          defaultValue={user?.name ?? ""}
          required
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="email">E-mail</label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={user?.email ?? ""}
          required
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="password">
          {user ? "Nova senha (opcional)" : "Senha"}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          minLength={6}
          required={!user}
          autoComplete="new-password"
          placeholder={
            user ? "Deixe em branco para manter" : "Mínimo de 6 caracteres"
          }
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="role">Permissão</label>
        <select id="role" name="role" defaultValue={user?.role ?? "CUSTOMER"}>
          <option value="CUSTOMER">Cliente</option>
          <option value="ADMIN">Administrador</option>
        </select>
      </div>
      {error && (
        <p className={`${styles.error} ${styles.full}`} role="alert">
          {error}
        </p>
      )}
      <div className={`${styles.formActions} ${styles.full}`}>
        <button className={styles.primary} disabled={loading}>
          {loading
            ? "Salvando..."
            : user
              ? "Salvar alterações"
              : "Cadastrar usuário"}
        </button>
        <Link href="/admin/users" className={styles.secondary}>
          Cancelar
        </Link>
      </div>
    </form>
  );
}
