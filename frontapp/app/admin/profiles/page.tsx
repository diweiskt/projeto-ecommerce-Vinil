import Link from "next/link";
import styles from "../admin.module.css";
import AdminShell from "../AdminShell";
import DeleteButton from "../DeleteButton";
import { requireAdmin } from "../../lib/admin";
import { getAdminData } from "../../lib/admin-data";
import type { ProfileRecord } from "../ProfileForm";

export default async function AdminProfilesPage() {
  await requireAdmin();
  const profiles = await getAdminData<ProfileRecord[]>("/profiles");
  return (
    <AdminShell
      active="profiles"
      title="Gerenciar perfis"
      actions={
        <Link href="/admin/profiles/new" className={styles.primary}>
          + Novo perfil
        </Link>
      }
    >
      {profiles === null ? (
        <p className={styles.message}>
          Não foi possível carregar os perfis. Verifique a conexão com o
          servidor.
        </p>
      ) : profiles.length === 0 ? (
        <p className={styles.message}>
          Nenhum perfil cadastrado ainda.{" "}
          <Link href="/admin/profiles/new">Cadastrar o primeiro</Link>
        </p>
      ) : (
        <>
          <p className={styles.count}>
            {profiles.length} {profiles.length === 1 ? "perfil" : "perfis"}
          </p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nome completo</th>
                  <th>Usuário</th>
                  <th>E-mail</th>
                  <th>Nascimento</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((profile) => (
                  <tr key={profile.id}>
                    <td className={styles.titleCell}>{profile.fullName}</td>
                    <td>{profile.user.name}</td>
                    <td>{profile.user.email}</td>
                    <td>
                      {profile.birthDate
                        ? new Date(profile.birthDate).toLocaleDateString(
                            "pt-BR",
                          )
                        : "—"}
                    </td>
                    <td>
                      <div className={styles.rowActions}>
                        <Link href={`/admin/profiles/${profile.id}/edit`}>
                          Editar
                        </Link>
                        <DeleteButton
                          kind="profile"
                          id={profile.id}
                          title={profile.fullName}
                        />
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
