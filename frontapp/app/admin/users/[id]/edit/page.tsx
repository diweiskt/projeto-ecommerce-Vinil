import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "../../../admin.module.css";
import AdminShell from "../../../AdminShell";
import UserForm, { type UserRecord } from "../../../UserForm";
import { requireAdmin } from "../../../../lib/admin";
import { getAdminData } from "../../../../lib/admin-data";
export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const userId = Number(id);
  if (!Number.isInteger(userId) || userId < 1) notFound();
  const user = await getAdminData<UserRecord>(`/users/${userId}`);
  if (!user) notFound();
  return (
    <AdminShell active="users" title="Editar usuário">
      <UserForm user={user} />
    </AdminShell>
  );
}
