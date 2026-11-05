import Link from "next/link";
import styles from "../admin.module.css";

import AdminShell from "../AdminShell";
import DeleteButton from "../DeleteButton";
import { requirePanelAccess } from "../../lib/admin";
import { getArtists, getVinyls } from "../../lib/api";

export default async function AdminArtistsPage() {
  const user = await requirePanelAccess();
  const canEdit = user.role === "ADMIN";

  const [artists, vinyls] = await Promise.all([
    getArtists().catch(() => null),
    getVinyls().catch(() => null),
  ]);

  // Discos por artista (null = não deu para calcular)
  const counts = vinyls
    ? vinyls.reduce<Record<number, number>>((acc, vinyl) => {
        acc[vinyl.artistId] = (acc[vinyl.artistId] ?? 0) + 1;
        return acc;
      }, {})
    : null;

  return (
    <AdminShell
      active="artists"
      title="Artistas"
      actions={
        canEdit && (<Link href="/admin/artists/new" className={styles.primary}>
          + Novo artista
        </Link>)
      }
    >
      {artists === null ? (
        <p className={styles.message}>
          Não foi possível carregar os artistas agora. Tente novamente em
          instantes.
        </p>
      ) : artists.length === 0 ? (
        <p className={styles.message}>
          Nenhum artista cadastrado ainda.{" "}
          {canEdit && (<Link href="/admin/artists/new">Cadastrar o primeiro</Link>)}
        </p>
      ) : (
        <>
          <p className={styles.count}>
            {artists.length} {artists.length === 1 ? "artista" : "artistas"}
          </p>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Nome</th>
                  <th scope="col">País</th>
                  <th scope="col">Biografia</th>
                  <th scope="col">Discos</th>
                  <th scope="col">Ações</th>
                </tr>
              </thead>

              <tbody>
                {artists.map((artist) => {
                  const used = counts ? (counts[artist.id] ?? 0) : null;

                  return (
                    <tr key={artist.id}>
                      <td className={styles.titleCell}>
                        <Link
                          href={`/vinyls?search=${encodeURIComponent(artist.name)}`}
                        >
                          {artist.name}
                        </Link>
                      </td>

                      <td>{artist.country}</td>

                      <td>
                        <div className={styles.excerpt}>{artist.bio}</div>
                      </td>

                      <td>{used ?? "—"}</td>

                      <td>
                        {canEdit ? <div className={styles.rowActions}>
                          <Link href={`/admin/artists/${artist.id}/edit`}>
                            Editar
                          </Link>

                          {used !== null && used > 0 ? (
                            <span
                              className={styles.inUse}
                              title="Remova ou mude os discos deste artista antes de excluir."
                            >
                              Em uso
                            </span>
                          ) : (
                            <DeleteButton
                              kind="artist"
                              id={artist.id}
                              title={artist.name}
                            />
                          )}
                        </div> : <span>Somente leitura</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </AdminShell>
  );
}
