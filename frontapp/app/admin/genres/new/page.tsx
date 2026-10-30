import AdminShell from "../../AdminShell";
import EntityForm from "../../EntityForm";
import { requireAdmin } from "../../../lib/admin";

export default async function NewGenrePage() {
  await requireAdmin();

  return (
    <AdminShell active="genres" title="Novo gênero">
      <EntityForm kind="genre" />
    </AdminShell>
  );
}
