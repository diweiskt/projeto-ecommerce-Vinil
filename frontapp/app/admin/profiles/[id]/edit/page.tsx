import { notFound } from "next/navigation";
import AdminShell from "../../../AdminShell";
import ProfileForm, { type ProfileRecord } from "../../../ProfileForm";
import { requireAdmin } from "../../../../lib/admin";
import { getAdminData } from "../../../../lib/admin-data";
export default async function EditProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const profileId = Number(id);
  if (!Number.isInteger(profileId) || profileId < 1) notFound();
  const profile = await getAdminData<ProfileRecord>(`/profiles/${profileId}`);
  if (!profile) notFound();
  return (
    <AdminShell active="profiles" title="Editar perfil">
      <ProfileForm profile={profile} users={[]} />
    </AdminShell>
  );
}
