import { Title } from "@/components";
import { getSession } from "@/lib/get-session";

export default async function ProfilePage() {
  const session = await getSession();

  return (
    <div>
      <Title title="Perfil" />

      <pre>{JSON.stringify(session?.user, null, 2)}</pre>

      <h3 className="text-3xl mb-10">{session?.user?.role}</h3>
    </div>
  );
}
