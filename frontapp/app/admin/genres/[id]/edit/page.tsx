import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "../../../admin.module.css";

import AdminShell from "../../../AdminShell";
import EntityForm from "../../../EntityForm";
import { requireAdmin } from "../../../../lib/admin";
import { getGenre, type Genre } from "../../../../lib/api";
import { parseId } from "../../../../lib/ids";

interface EditGenrePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditGenrePage({ params }: EditGenrePageProps) {
  await requireAdmin();

  const id = parseId((await params).id);

  if (!id) {
    notFound();
  }

  let genre: Genre | null = null;
  let failed = false;

  try {
    genre = await getGenre(id);
  } catch {
    failed = true;
  }

  // notFound() lança um erro especial; por isso fica fora do try/catch
  if (!failed && !genre) {
    notFound();
  }

  return (
    <AdminShell active="genres" title="Editar gênero">
      {failed || !genre ? (
        <p className={styles.message}>
          Não foi possível carregar o gênero agora.{" "}
          <Link href="/admin/genres">Voltar</Link>
        </p>
      ) : (
        <EntityForm
          kind="genre"
          id={genre.id}
          initial={{ name: genre.name, description: genre.description }}
        />
      )}
    </AdminShell>
  );
}
