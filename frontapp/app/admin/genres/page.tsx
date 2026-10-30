import Link from "next/link";
import styles from "../admin.module.css";

import AdminShell from "../AdminShell";
import DeleteButton from "../DeleteButton";
import { requireAdmin } from "../../lib/admin";
import { getGenres, getVinyls } from "../../lib/api";

export default async function AdminGenresPage() {
  await requireAdmin();

  const [genres, vinyls] = await Promise.all([
    getGenres().catch(() => null),
    getVinyls().catch(() => null),
  ]);

  // Discos por gênero (null = não deu para calcular)
  const counts = vinyls
    ? vinyls.reduce<Record<number, number>>((acc, vinyl) => {
        acc[vinyl.genreId] = (acc[vinyl.genreId] ?? 0) + 1;
        return acc;
      }, {})
    : null;

  return (
    <AdminShell
      active="genres"
      title="Gêneros"
      actions={
        <Link href="/admin/genres/new" className={styles.primary}>
          + Novo gênero
        </Link>
      }
    >
      {genres === null ? (
        <p className={styles.message}>
          Não foi possível carregar os gêneros agora. Tente novamente em
          instantes.
        </p>
      ) : genres.length === 0 ? (
        <p className={styles.message}>
          Nenhum gênero cadastrado ainda.{" "}
          <Link href="/admin/genres/new">Cadastrar o primeiro</Link>
        </p>
      ) : (
        <>
          <p className={styles.count}>
            {genres.length} {genres.length === 1 ? "gênero" : "gêneros"}
          </p>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Nome</th>
                  <th scope="col">Descrição</th>
                  <th scope="col">Discos</th>
                  <th scope="col">Ações</th>
                </tr>
              </thead>

              <tbody>
                {genres.map((genre) => {
                  const used = counts ? (counts[genre.id] ?? 0) : null;

                  return (
                    <tr key={genre.id}>
                      <td className={styles.titleCell}>
                        <Link href={`/vinyls?genreId=${genre.id}`}>
                          {genre.name}
                        </Link>
                      </td>

                      <td>
                        <div className={styles.excerpt}>
                          {genre.description}
                        </div>
                      </td>

                      <td>{used ?? "—"}</td>

                      <td>
                        <div className={styles.rowActions}>
                          <Link href={`/admin/genres/${genre.id}/edit`}>
                            Editar
                          </Link>

                          {used !== null && used > 0 ? (
                            <span
                              className={styles.inUse}
                              title="Remova ou mude os discos deste gênero antes de excluir."
                            >
                              Em uso
                            </span>
                          ) : (
                            <DeleteButton
                              kind="genre"
                              id={genre.id}
                              title={genre.name}
                            />
                          )}
                        </div>
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
