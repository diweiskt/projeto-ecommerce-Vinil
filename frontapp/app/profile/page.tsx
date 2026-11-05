import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/app/lib/session";
import { getMyProfile } from "@/app/lib/profile-actions";
import ProfileEditor from "./ProfileEditor";
import styles from "./profile.module.css";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getSession();

  if (!user) {
    redirect("/login");
  }

  if (user.role === "DEMO") redirect("/admin");

  const result = await getMyProfile();

  if (result.error || !result.profile) {
    return (
      <main className={styles.profilePage}>
        <div className={styles.profileContainer}>
          <p role="alert" className={styles.error}>
            {result.error || "Não foi possível carregar seu perfil."}
          </p>
          <Link href="/" className={styles.secondaryLink}>
            Voltar à loja
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.profilePage}>
      <div className={styles.profileContainer}>
        <span className={styles.eyebrow}>Minha conta</span>

        <h1 className={styles.title}>Editar perfil</h1>

        <ProfileEditor initial={result.profile} userName={user.name} />
      </div>
    </main>
  );
}
