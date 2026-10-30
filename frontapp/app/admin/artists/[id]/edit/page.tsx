import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "../../../admin.module.css";

import AdminShell from "../../../AdminShell";
import EntityForm from "../../../EntityForm";
import { requireAdmin } from "../../../../lib/admin";
import { getArtist, type Artist } from "../../../../lib/api";
import { parseId } from "../../../../lib/ids";

interface EditArtistPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArtistPage({ params }: EditArtistPageProps) {
  await requireAdmin();

  const id = parseId((await params).id);

  if (!id) {
    notFound();
  }

  let artist: Artist | null = null;
  let failed = false;

  try {
    artist = await getArtist(id);
  } catch {
    failed = true;
  }

  // notFound() lança um erro especial; por isso fica fora do try/catch
  if (!failed && !artist) {
    notFound();
  }

  return (
    <AdminShell active="artists" title="Editar artista">
      {failed || !artist ? (
        <p className={styles.message}>
          Não foi possível carregar o artista agora.{" "}
          <Link href="/admin/artists">Voltar</Link>
        </p>
      ) : (
        <EntityForm
          kind="artist"
          id={artist.id}
          initial={{
            name: artist.name,
            country: artist.country,
            bio: artist.bio,
          }}
        />
      )}
    </AdminShell>
  );
}
