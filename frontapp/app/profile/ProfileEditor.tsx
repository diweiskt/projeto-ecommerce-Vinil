"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { saveMyProfile } from "@/app/lib/profile-actions";
import styles from "./profile.module.css";

type ProfileData = {
  fullName?: string | null;
  birthDate?: string | Date | null;
  avatarUrl?: string | null;
};

type ProfileEditorProps = {
  initial: ProfileData;
  userName: string;
};

export default function ProfileEditor({
  initial,
  userName,
}: ProfileEditorProps) {
  const router = useRouter();

  const [avatar, setAvatar] = useState(initial?.avatarUrl || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function choose(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Selecione um arquivo de imagem válido.");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("A foto deve ter no máximo 2 MB.");
      event.target.value = "";
      return;
    }

    setError("");

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatar(reader.result);
      }
    };

    reader.onerror = () => {
      setError("Não foi possível carregar a imagem.");
    };

    reader.readAsDataURL(file);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving) return;

    setSaving(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const fullName = String(formData.get("fullName") || "").trim();
    const birthDate = String(formData.get("birthDate") || "");

    if (fullName.length < 3) {
      setError("Informe seu nome completo, com pelo menos 3 caracteres.");
      setSaving(false);
      return;
    }

    try {
      const result = await saveMyProfile({
        fullName,
        birthDate: birthDate || null,
        avatarUrl: avatar,
      });

      if (result && "error" in result && result.error) {
        setError(String(result.error));
        return;
      }

      router.refresh();
      router.push("/");
    } catch {
      setError("Não foi possível salvar o perfil. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  const formattedBirthDate = initial?.birthDate
    ? String(initial.birthDate).slice(0, 10)
    : "";

  return (
    <form onSubmit={submit} className={styles.form}>
      <div className={styles.photoRow}>
        {avatar ? (
          <img src={avatar} alt="Foto de perfil" className={styles.avatar} />
        ) : (
          <div className={styles.avatarFallback}>
            {userName.charAt(0).toUpperCase()}
          </div>
        )}

        <label className={styles.field}>
          Foto de perfil
          <input
            className={styles.fileInput}
            type="file"
            accept="image/*"
            onChange={choose}
          />
        </label>
      </div>

      <label className={styles.field}>
        Nome completo
        <input
          type="text"
          name="fullName"
          defaultValue={initial?.fullName || userName}
          autoComplete="name"
          required
          minLength={3}
        />
      </label>

      <label className={styles.field}>
        Data de nascimento
        <input type="date" name="birthDate" defaultValue={formattedBirthDate} />
      </label>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <button type="submit" className={styles.primaryButton} disabled={saving}>
        {saving ? "Salvando..." : "Salvar perfil"}
      </button>

      <p className={styles.helpText}>
        A foto deve ter até 2 MB. Ao salvar, seu nome também será atualizado no
        cabeçalho.
      </p>

      <div>
        <Link href="/" className={styles.secondaryLink}>
          Voltar à loja
        </Link>
      </div>
    </form>
  );
}
