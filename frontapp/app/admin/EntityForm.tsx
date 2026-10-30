"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./admin.module.css";
import { saveArtistAction, saveGenreAction } from "../lib/admin-actions";

interface EntityFormProps {
  kind: "artist" | "genre";
  // sem id = cadastrar; com id = editar
  id?: number;
  initial?: {
    name?: string;
    country?: string;
    bio?: string;
    description?: string;
  };
}

const CONFIG = {
  artist: { listPath: "/admin/artists", noun: "artista" },
  genre: { listPath: "/admin/genres", noun: "gênero" },
};

export default function EntityForm({
  kind,
  id,
  initial = {},
}: EntityFormProps) {
  const router = useRouter();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isEdit = id !== undefined;
  const { listPath, noun } = CONFIG[kind];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const form = new FormData(event.currentTarget);
    const text = (name: string) => String(form.get(name) ?? "").trim();

    setLoading(true);

    try {
      const result =
        kind === "artist"
          ? await saveArtistAction(id ?? null, {
              name: text("name"),
              country: text("country"),
              bio: text("bio"),
            })
          : await saveGenreAction(id ?? null, {
              name: text("name"),
              description: text("description"),
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

      router.push(listPath);
      router.refresh();
    } catch {
      setError("Não foi possível salvar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={`${styles.field} ${kind === "genre" ? styles.full : ""}`}>
        <label htmlFor="name">Nome</label>
        <input
          id="name"
          name="name"
          type="text"
          minLength={2}
          defaultValue={initial.name ?? ""}
          placeholder={kind === "artist" ? "Ex.: The Beatles" : "Ex.: Rock"}
          required
        />
      </div>

      {kind === "artist" ? (
        <>
          <div className={styles.field}>
            <label htmlFor="country">País</label>
            <input
              id="country"
              name="country"
              type="text"
              minLength={2}
              defaultValue={initial.country ?? ""}
              placeholder="Ex.: Reino Unido"
              required
            />
          </div>

          <div className={`${styles.field} ${styles.full}`}>
            <label htmlFor="bio">Biografia</label>
            <textarea
              id="bio"
              name="bio"
              minLength={3}
              defaultValue={initial.bio ?? ""}
              placeholder="Conte um pouco sobre o artista."
              required
            />
          </div>
        </>
      ) : (
        <div className={`${styles.field} ${styles.full}`}>
          <label htmlFor="description">Descrição</label>
          <textarea
            id="description"
            name="description"
            minLength={3}
            defaultValue={initial.description ?? ""}
            placeholder="Descreva o gênero em uma frase."
            required
          />
        </div>
      )}

      {error && (
        <p className={`${styles.error} ${styles.full}`} role="alert">
          {error}
        </p>
      )}

      <div className={`${styles.formActions} ${styles.full}`}>
        <button type="submit" className={styles.primary} disabled={loading}>
          {loading
            ? "Salvando..."
            : isEdit
              ? "Salvar alterações"
              : `Cadastrar ${noun}`}
        </button>

        <Link href={listPath} className={styles.secondary}>
          Cancelar
        </Link>
      </div>
    </form>
  );
}
