"use server";

import { getSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";

interface PaginationOptions {
  page?: number;
  take?: number;
}

export const getOrdersByUser = async ({
  page = 1,
  take = 5,
}: PaginationOptions) => {
  const session = await getSession();

  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const [totalOrders, orders] = await Promise.all([
    prisma.order.count({
      where: {
        userId,
      },
    }),
    prisma.order.findMany({
      where: {
        userId,
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

  const totalPages = Math.ceil(totalOrders / take)

  return {
    ok: true,
    orders,
    totalOrders,
    totalPages,
  };
};
