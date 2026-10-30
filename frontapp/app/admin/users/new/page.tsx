import styles from "../../admin.module.css";
import AdminShell from "../../AdminShell";
import UserForm from "../../UserForm";
import { requireAdmin } from "../../../lib/admin";
export default async function NewUserPage() {
  await requireAdmin();
  return (
    <AdminShell active="users" title="Cadastrar usuário">
      <UserForm />
    </AdminShell>
  );
}
