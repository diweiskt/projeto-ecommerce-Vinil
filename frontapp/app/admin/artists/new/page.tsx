import AdminShell from "../../AdminShell";
import EntityForm from "../../EntityForm";
import { requireAdmin } from "../../../lib/admin";

export default async function NewArtistPage() {
  await requireAdmin();

  return (
    <AdminShell active="artists" title="Novo artista">
      <EntityForm kind="artist" />
    </AdminShell>
  );
}
