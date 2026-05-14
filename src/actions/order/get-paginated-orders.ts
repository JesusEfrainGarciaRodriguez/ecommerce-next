"use server";

import { getSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";

interface PaginationOptions {
  page?: number;
  take?: number;
}

export const getPaginatedOrders = async ({
  page = 1,
  take = 5,
}: PaginationOptions) => {
  const session = await getSession();

  if (session?.user?.role.toLocaleLowerCase() !== "admin") {
    throw new Error("User not authenticated");
  }

  const [totalOrders, orders] = await Promise.all([
    prisma.order.count(),
    prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        orderAddress: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      take,
      skip: (page - 1) * take,
    }),
  ]);

  const totalPages = Math.ceil(totalOrders / take);

  return {
    ok: true,
    orders,
    totalOrders,
    totalPages,
  };
};
