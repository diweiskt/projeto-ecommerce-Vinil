"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../admin.module.css";
import { saveVinylAction } from "../../lib/admin-actions";

interface Option {
  id: number;
  name: string;
}

export interface VinylFormValues {
  title: string;
  artistId: string;
  genreId: string;
  releaseYear: string;
  price: string;
  condition: string;
  rpmSpeed: string;
  stockQuantity: string;
  coverUrl: string;
}

interface VinylFormProps {
  // sem id = cadastrar; com id = editar
  id?: number;
  artists: Option[];
  genres: Option[];
  initial?: Partial<VinylFormValues>;
}

const CONDITIONS = ["Novo", "Excelente", "Muito bom", "Bom", "Regular"];
const SPEEDS = ["33", "45", "78"];

export default function VinylForm({
  id,
  artists,
  genres,
  initial = {},
}: VinylFormProps) {
  const router = useRouter();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cover, setCover] = useState(initial.coverUrl ?? "");
  const [coverBroken, setCoverBroken] = useState(false);
  const [imageError, setImageError] = useState("");

  async function handleImageFile(file?: File) {
    setImageError("");
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setImageError("Selecione um arquivo de imagem.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setImageError("A imagem deve ter no máximo 2 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setCover(result);
      setCoverBroken(false);
    };
    reader.onerror = () => setImageError("Não foi possível ler essa imagem.");
    reader.readAsDataURL(file);
  }

  const isEdit = id !== undefined;

  // Mantém uma condição já cadastrada que não esteja na lista padrão
  const conditions =
    initial.condition && !CONDITIONS.includes(initial.condition)
      ? [...CONDITIONS, initial.condition]
      : CONDITIONS;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const form = new FormData(event.currentTarget);
    const text = (name: string) => String(form.get(name) ?? "").trim();

    const price = Number(text("price").replace(",", "."));

    if (!Number.isFinite(price) || price <= 0) {
      setError("Informe um preço válido.");
      return;
    }

    setLoading(true);

    try {
      const result = await saveVinylAction(id ?? null, {
        title: text("title"),
        artistId: Number(text("artistId")),
        genreId: Number(text("genreId")),
        releaseYear: Number(text("releaseYear")),
        price,
        condition: text("condition"),
        rpmSpeed: Number(text("rpmSpeed")),
        stockQuantity: Number(text("stockQuantity")),
        coverUrl: text("coverUrl"),
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

      router.push("/admin/vinyls");
      router.refresh();
    } catch {
      setError("Não foi possível salvar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={`${styles.field} ${styles.full}`}>
        <label htmlFor="title">Título</label>
        <input
          id="title"
          name="title"
          type="text"
          minLength={2}
          defaultValue={initial.title ?? ""}
          placeholder="Ex.: Abbey Road"
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="artistId">Artista</label>
        <select
          id="artistId"
          name="artistId"
          defaultValue={initial.artistId ?? ""}
          required
        >
          <option value="" disabled>
            Selecione...
          </option>
          {artists.map((artist) => (
            <option key={artist.id} value={artist.id}>
              {artist.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="genreId">Gênero</label>
        <select
          id="genreId"
          name="genreId"
          defaultValue={initial.genreId ?? ""}
          required
        >
          <option value="" disabled>
            Selecione...
          </option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="releaseYear">Ano de lançamento</label>
        <input
          id="releaseYear"
          name="releaseYear"
          type="number"
          min={1900}
          max={new Date().getFullYear() + 1}
          step={1}
          defaultValue={initial.releaseYear ?? ""}
          placeholder="1969"
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="price">Preço (R$)</label>
        <input
          id="price"
          name="price"
          type="number"
          min={0.01}
          step={0.01}
          defaultValue={initial.price ?? ""}
          placeholder="149.90"
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="condition">Condição</label>
        <select
          id="condition"
          name="condition"
          defaultValue={initial.condition ?? ""}
          required
        >
          <option value="" disabled>
            Selecione...
          </option>
          {conditions.map((condition) => (
            <option key={condition} value={condition}>
              {condition}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="rpmSpeed">Rotação</label>
        <select
          id="rpmSpeed"
          name="rpmSpeed"
          defaultValue={initial.rpmSpeed ?? "33"}
          required
        >
          {SPEEDS.map((speed) => (
            <option key={speed} value={speed}>
              {speed} RPM
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="stockQuantity">Estoque (unidades)</label>
        <input
          id="stockQuantity"
          name="stockQuantity"
          type="number"
          min={0}
          step={1}
          defaultValue={initial.stockQuantity ?? "1"}
          required
        />
      </div>

      <div className={`${styles.field} ${styles.full}`}>
        <label htmlFor="coverUrl">Capa (opcional)</label>

        <div className={styles.coverRow}>
          <input
            id="coverUrl"
            name="coverUrl"
            type="text"
            value={cover}
            onChange={(event) => {
              setCover(event.target.value);
              setCoverBroken(false);
            }}
            placeholder="Link ou caminho da foto aqui"
          />

          {cover.trim() && !coverBroken && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cover.trim()}
              alt="Prévia da capa"
              className={styles.preview}
              onError={() => setCoverBroken(true)}
            />
          )}
        </div>
        <label htmlFor="coverFile">Ou escolha uma foto do computador</label>
        <input
          id="coverFile"
          className={styles.fileInput}
          type="file"
          accept="image/*"
          onChange={(event) => handleImageFile(event.target.files?.[0])}
        />
        {imageError && (
          <small role="alert" className={styles.error}>
            {imageError}
          </small>
        )}
        <small>
          Imagens de até 2 MB. Você pode enviar uma foto ou informar um
          endereço/caminho acima. Em branco, o card mostra o disco desenhado.
        </small>
      </div>

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
              : "Cadastrar disco"}
        </button>

        <Link href="/admin/vinyls" className={styles.secondary}>
          Cancelar
        </Link>
      </div>
    </form>
  );
}
