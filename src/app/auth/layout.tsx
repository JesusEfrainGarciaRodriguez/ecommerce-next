import { getSession } from "@/lib/get-session";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (session) {
    redirect("/");
  }

  return (
    <main className="flex justify-center">
      <div className="w-full sm:w-87.5 px-10">{children}</div>
    </main>
  );
}
