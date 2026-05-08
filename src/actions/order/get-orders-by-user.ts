"use server";

import { getSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";

export const getOrdersByUser = async () => {
  const session = await getSession();

  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const orders = await prisma.order.findMany({
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
  });

  return {
    ok: true,
    orders: orders,
  };
};
