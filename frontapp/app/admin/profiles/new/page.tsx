import Link from "next/link";
import styles from "../../admin.module.css";
import AdminShell from "../../AdminShell";
import ProfileForm, { type UserOption } from "../../ProfileForm";
import { requireAdmin } from "../../../lib/admin";
import { getAdminData } from "../../../lib/admin-data";
export default async function NewProfilePage() {
  await requireAdmin();
  const [users, profiles] = await Promise.all([
    getAdminData<UserOption[]>("/users"),
    getAdminData<{ userId: number }[]>("/profiles"),
  ]);
  if (!users || !profiles)
    return (
      <AdminShell active="profiles" title="Cadastrar perfil">
        <p className={styles.message}>
          Não foi possível carregar usuários e perfis.
        </p>
      </AdminShell>
    );
  const used = new Set(profiles.map((p) => p.userId));
  const available = users.filter((u) => !used.has(u.id));
  return (
    <AdminShell active="profiles" title="Cadastrar perfil">
      {available.length ? (
        <ProfileForm users={available} />
      ) : (
        <p className={styles.message}>
          Todos os usuários já possuem perfil.{" "}
          <Link href="/admin/users/new">Cadastre outro usuário</Link> primeiro.
        </p>
      )}
    </AdminShell>
  );
}
