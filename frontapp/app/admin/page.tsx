import Link from "next/link";
import styles from "./admin.module.css";

import AdminShell from "./AdminShell";
import { requirePanelAccess } from "../lib/admin";
import { getArtists, getGenres, getVinyls } from "../lib/api";

export default async function AdminPage() {
  const user = await requirePanelAccess();
  const canEdit = user.role === "ADMIN";

  const [vinyls, artists, genres] = await Promise.all([
    getVinyls().catch(() => null),
    getArtists().catch(() => null),
    getGenres().catch(() => null),
  ]);

  const units = vinyls?.reduce((sum, vinyl) => sum + vinyl.stockQuantity, 0);
  const soldOut = vinyls?.filter((vinyl) => vinyl.stockQuantity === 0).length;

  const stats = [
    { label: "Discos cadastrados", value: vinyls?.length },
    { label: "Unidades em estoque", value: units },
    { label: "Discos esgotados", value: soldOut },
    { label: "Artistas", value: artists?.length },
    { label: "Gêneros", value: genres?.length },
  ];

  return (
    <AdminShell
      active="dashboard"
      title="Painel"
      actions={
        canEdit && (<Link href="/admin/vinyls/new" className={styles.primary}>
          + Novo disco
        </Link>)
      }
    >
      <section className={styles.shortcuts}>
        <Link href="/admin/vinyls">
          <strong>Gerenciar discos</strong>
          <span>Ver a lista, editar preços e estoque ou excluir discos.</span>
        </Link>

        {canEdit && (<Link href="/admin/vinyls/new">
          <strong>Cadastrar disco</strong>
          <span>Adicionar um novo disco ao catálogo da loja.</span>
        </Link>)}

        <Link href="/admin/artists">
          <strong>Artistas</strong>
          <span>Cadastrar e editar os artistas que aparecem nos discos.</span>
        </Link>

        <Link href="/admin/genres">
          <strong>Gêneros</strong>
          <span>Organizar os gêneros musicais usados no catálogo.</span>
        </Link>

        {canEdit && (<Link href="/admin/users">
          <strong>Gerenciar usuários</strong>
          <span>
            Consultar contas, cadastrar usuários e administrar acessos.
          </span>
        </Link>)}

        {canEdit && (<Link href="/admin/profiles">
          <strong>Gerenciar perfis</strong>
          <span>Consultar e manter os dados complementares dos usuários.</span>
        </Link>)}
      </section>
    </AdminShell>
  );
}
