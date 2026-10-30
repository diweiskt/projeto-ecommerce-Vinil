"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./admin.module.css";
import { saveProfileAction } from "../lib/admin-actions";

export interface ProfileRecord {
  id: number;
  userId: number;
  fullName: string;
  birthDate: string | null;
  avatarUrl: string | null;
  user: { id: number; name: string; email: string; role: string };
}
export interface UserOption {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function ProfileForm({
  profile,
  users,
}: {
  profile?: ProfileRecord;
  users: UserOption[];
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    try {
      const result = await saveProfileAction(profile?.id ?? null, {
        userId: Number(form.get("userId") ?? 0),
        fullName: String(form.get("fullName") ?? "").trim(),
        birthDate: String(form.get("birthDate") ?? ""),
        avatarUrl: String(form.get("avatarUrl") ?? "").trim(),
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
      router.push("/admin/profiles");
      router.refresh();
    } catch {
      setError("Não foi possível salvar o perfil.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <form className={styles.form} onSubmit={submit}>
      {!profile && (
        <div className={`${styles.field} ${styles.full}`}>
          <label htmlFor="userId">Usuário vinculado</label>
          <select id="userId" name="userId" required defaultValue="">
            <option value="" disabled>
              Selecione um usuário
            </option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} — {u.email}
              </option>
            ))}
          </select>
        </div>
      )}
      {profile && (
        <p className={`${styles.message} ${styles.full}`}>
          Usuário: {profile.user.name} ({profile.user.email})
        </p>
      )}
      <div className={`${styles.field} ${styles.full}`}>
        <label htmlFor="fullName">Nome completo</label>
        <input
          id="fullName"
          name="fullName"
          minLength={3}
          defaultValue={profile?.fullName ?? ""}
          required
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="birthDate">Data de nascimento</label>
        <input
          id="birthDate"
          name="birthDate"
          type="date"
          defaultValue={profile?.birthDate?.slice(0, 10) ?? ""}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="avatarUrl">URL da foto (opcional)</label>
        <input
          id="avatarUrl"
          name="avatarUrl"
          type="url"
          defaultValue={profile?.avatarUrl ?? ""}
          placeholder="https://..."
        />
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
            : profile
              ? "Salvar alterações"
              : "Cadastrar perfil"}
        </button>
        <Link href="/admin/profiles" className={styles.secondary}>
          Cancelar
        </Link>
      </div>
    </form>
  );
}
