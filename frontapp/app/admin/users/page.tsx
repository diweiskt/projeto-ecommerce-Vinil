import Link from "next/link";
import styles from "../admin.module.css";
import AdminShell from "../AdminShell";
import DeleteButton from "../DeleteButton";
import { requireAdmin } from "../../lib/admin";
import { getAdminData } from "../../lib/admin-data";
import type { UserRecord } from "../UserForm";

export default async function AdminUsersPage() {
  await requireAdmin();
  const users = await getAdminData<UserRecord[]>("/users");
  return (
    <AdminShell
      active="users"
      title="Gerenciar usuários"
      actions={
        <Link href="/admin/users/new" className={styles.primary}>
          + Novo usuário
        </Link>
      }
    >
      {users === null ? (
        <p className={styles.message}>
          Não foi possível carregar os usuários. Verifique a conexão com o
          servidor.
        </p>
      ) : users.length === 0 ? (
        <p className={styles.message}>Nenhum usuário cadastrado.</p>
      ) : (
        <>
          <p className={styles.count}>
            {users.length} {users.length === 1 ? "usuário" : "usuários"}
          </p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Permissão</th>
                  <th>Cadastro</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className={styles.titleCell}>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      {user.role === "ADMIN" ? "Administrador" : user.role === "DEMO" ? "Demonstração" : "Cliente"}
                    </td>
                    <td>
                      {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td>
                      <div className={styles.rowActions}>
                        <Link href={`/admin/users/${user.id}/edit`}>
                          Editar
                        </Link>
                        <DeleteButton
                          kind="user"
                          id={user.id}
                          title={user.name}
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
