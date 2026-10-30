import Link from "next/link";
import styles from "../admin.module.css";

import AdminShell from "../AdminShell";
import DeleteButton from "../DeleteButton";
import { requireAdmin } from "../../lib/admin";
import { getVinyls } from "../../lib/api";

function formatPrice(value: number) {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

export default async function AdminVinylsPage() {
  await requireAdmin();

  const vinyls = await getVinyls().catch(() => null);

  return (
    <AdminShell
      active="vinyls"
      title="Discos"
      actions={
        <Link href="/admin/vinyls/new" className={styles.primary}>
          + Novo disco
        </Link>
      }
    >
      {vinyls === null ? (
        <p className={styles.message}>
          Não foi possível carregar os discos agora. Tente novamente em
          instantes.
        </p>
      ) : vinyls.length === 0 ? (
        <p className={styles.message}>
          Nenhum disco cadastrado ainda.{" "}
          <Link href="/admin/vinyls/new">Cadastrar o primeiro</Link>
        </p>
      ) : (
        <>
          <p className={styles.count}>
            {vinyls.length} {vinyls.length === 1 ? "disco" : "discos"}
          </p>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Capa</th>
                  <th scope="col">Título</th>
                  <th scope="col">Artista</th>
                  <th scope="col">Gênero</th>
                  <th scope="col">Preço</th>
                  <th scope="col">Estoque</th>
                  <th scope="col">Ações</th>
                </tr>
              </thead>

              <tbody>
                {vinyls.map((vinyl) => (
                  <tr key={vinyl.id}>
                    <td>
                      {vinyl.coverUrl ? (
                        <img
                          src={vinyl.coverUrl}
                          alt=""
                          className={styles.thumb}
                        />
                      ) : (
                        <span
                          className={styles.thumbEmpty}
                          aria-hidden="true"
                        />
                      )}
                    </td>

                    <td className={styles.titleCell}>
                      <Link href={`/vinyls/${vinyl.id}`}>{vinyl.title}</Link>
                    </td>

                    <td>{vinyl.artist}</td>
                    <td>{vinyl.genre}</td>
                    <td>{formatPrice(vinyl.price)}</td>

                    <td>
                      {vinyl.stockQuantity === 0 ? (
                        <span className={styles.soldOut}>Esgotado</span>
                      ) : (
                        vinyl.stockQuantity
                      )}
                    </td>

                    <td>
                      <div className={styles.rowActions}>
                        <Link href={`/admin/vinyls/${vinyl.id}/edit`}>
                          Editar
                        </Link>

                        <DeleteButton id={vinyl.id} title={vinyl.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </AdminShell>
  );
}
