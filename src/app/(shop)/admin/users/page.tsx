import { getAllUsers } from "@/actions";
import { Pagination, Title } from "@/components";

import { redirect } from "next/navigation";
import { UsersTable } from "./ui/UsersTable";

interface Params {
  searchParams: Promise<{ page?: string }>;
}

export default async function UsersPage({ searchParams }: Params) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;
  const { ok, totalPages = 1, users = [] } = await getAllUsers({ page });

  if (!ok) {
    redirect("/auth/login");
  }

  return (
    <>
      <Title title="Mantenimiento de usuarios" />

      <div className="mb-10">
        <UsersTable users={users} />

        <Pagination totalPages={totalPages} />
      </div>
    </>
  );
}
