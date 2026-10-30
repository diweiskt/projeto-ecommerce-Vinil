import Link from "next/link";
import styles from "../../admin.module.css";

import AdminShell from "../../AdminShell";
import VinylForm from "../VinylForm";
import { requireAdmin } from "../../../lib/admin";
import { getArtists, getGenres } from "../../../lib/api";

export default async function NewVinylPage() {
  await requireAdmin();

  const [artists, genres] = await Promise.all([
    getArtists().catch(() => null),
    getGenres().catch(() => null),
  ]);

  return (
    <AdminShell active="vinyls" title="Novo disco">
      {artists === null || genres === null ? (
        <p className={styles.message}>
          Não foi possível carregar artistas e gêneros agora.{" "}
          <Link href="/admin/vinyls">Voltar</Link>
        </p>
      ) : artists.length === 0 || genres.length === 0 ? (
        <p className={styles.message}>
          Para cadastrar um disco, é preciso ter ao menos um artista e um
          gênero. Cadastre <Link href="/admin/artists/new">um artista</Link> e{" "}
          <Link href="/admin/genres/new">um gênero</Link> primeiro.
        </p>
      ) : (
        <VinylForm artists={artists} genres={genres} />
      )}
    </AdminShell>
  );
}
