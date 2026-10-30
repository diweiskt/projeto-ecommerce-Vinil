"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./admin.module.css";
import {
  deleteArtistAction,
  deleteGenreAction,
  deleteVinylAction,
  deleteUserAction,
  deleteProfileAction,
} from "../lib/admin-actions";

type Kind = "vinyl" | "artist" | "genre" | "user" | "profile";

const DELETE_ACTIONS = {
  vinyl: deleteVinylAction,
  artist: deleteArtistAction,
  genre: deleteGenreAction,
  user: deleteUserAction,
  profile: deleteProfileAction,
};

interface DeleteButtonProps {
  id: number;
  title: string;
  kind?: Kind;
}

export default function DeleteButton({
  id,
  title,
  kind = "vinyl",
}: DeleteButtonProps) {
  const router = useRouter();

  const [step, setStep] = useState<"idle" | "confirm" | "loading">("idle");
  const [error, setError] = useState("");

  async function handleDelete() {
    setStep("loading");
    setError("");

    try {
      const result = await DELETE_ACTIONS[kind](id);

      if (result.sessionExpired) {
        router.push("/login");
        router.refresh();
        return;
      }

      if (result.error) {
        setError(result.error);
        setStep("idle");
        return;
      }

      router.refresh();
    } catch {
      setError("Não foi possível excluir. Tente novamente.");
      setStep("idle");
    }
  }

  if (step === "idle") {
    return (
      <>
        <button
          type="button"
          className={styles.danger}
          aria-label={`Excluir ${title}`}
          onClick={() => {
            setError("");
            setStep("confirm");
          }}
        >
          Excluir
        </button>

        {error && (
          <span className={styles.inlineError} role="alert">
            {error}
          </span>
        )}
      </>
    );
  }

  return (
    <span className={styles.confirm}>
      <span>Excluir?</span>

      <button
        type="button"
        className={styles.danger}
        disabled={step === "loading"}
        aria-label={step === "loading" ? undefined : `Sim, excluir ${title}`}
        onClick={handleDelete}
      >
        {step === "loading" ? "Excluindo..." : "Sim"}
      </button>

      <button
        type="button"
        className={styles.plain}
        disabled={step === "loading"}
        aria-label={`Não excluir ${title}`}
        onClick={() => setStep("idle")}
      >
        Não
      </button>
    </span>
  );
}
