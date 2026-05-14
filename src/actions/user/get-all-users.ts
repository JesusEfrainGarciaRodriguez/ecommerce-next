"use server";

import { getSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";

interface PaginationOptions {
  page?: number;
  take?: number;
}

export const getAllUsers = async ({
  page = 1,
  take = 5,
}: PaginationOptions) => {
  const session = await getSession();

  if (session?.user?.role.toLocaleLowerCase() !== "admin") {
    return {
      ok: false,
      message: "Debe de ser un usuario administrador",
    };
  }

  const [totalUsers, users] = await Promise.all([
    prisma.user.count(),
    prisma.user.findMany({
      orderBy: {
        name: "desc",
      },
      take,
      skip: (page - 1) * take,
    }),
  ]);

  const totalPages = Math.ceil(totalUsers / take);

  return {
    ok: true,
    users: users,
    totalUsers: totalUsers,
    totalPages: totalPages,
  };
};
