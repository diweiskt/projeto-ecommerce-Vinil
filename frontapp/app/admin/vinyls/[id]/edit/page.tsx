import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "../../../admin.module.css";

import AdminShell from "../../../AdminShell";
import VinylForm from "../../VinylForm";
import { requireAdmin } from "../../../../lib/admin";
import {
  getArtists,
  getGenres,
  getVinyl,
  type VinylDetail,
} from "../../../../lib/api";

interface EditVinylPageProps {
  params: Promise<{ id: string }>;
}

function parseId(raw: string): number | null {
  const id = Number(raw);

  return /^\d+$/.test(raw) && id >= 1 && id <= 2147483647 ? id : null;
}

export default async function EditVinylPage({ params }: EditVinylPageProps) {
  await requireAdmin();

  const id = parseId((await params).id);

  if (!id) {
    notFound();
  }

  let vinyl: VinylDetail | null = null;
  let failed = false;

  try {
    vinyl = await getVinyl(id);
  } catch {
    failed = true;
  }

  // notFound() lança um erro especial; por isso fica fora do try/catch
  if (!failed && !vinyl) {
    notFound();
  }

  const [artists, genres] = await Promise.all([
    getArtists().catch(() => null),
    getGenres().catch(() => null),
  ]);

  return (
    <AdminShell active="vinyls" title="Editar disco">
      {failed || !vinyl || artists === null || genres === null ? (
        <p className={styles.message}>
          Não foi possível carregar os dados agora.{" "}
          <Link href="/admin/vinyls">Voltar</Link>
        </p>
      ) : (
        <VinylForm
          id={vinyl.id}
          artists={artists}
          genres={genres}
          initial={{
            title: vinyl.title,
            artistId: String(vinyl.artistId),
            genreId: String(vinyl.genreId),
            releaseYear: String(vinyl.releaseYear),
            price: String(vinyl.price),
            condition: vinyl.condition,
            rpmSpeed: String(vinyl.rpmSpeed),
            stockQuantity: String(vinyl.stockQuantity),
            coverUrl: vinyl.coverUrl ?? "",
          }}
        />
      )}
    </AdminShell>
  );
}
