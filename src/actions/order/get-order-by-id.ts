"use server";

import { getSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";

export const getOrderById = async (id: string) => {
  const session = await getSession();

  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("User not authenticated");
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderAddress: true,
        orderItems: {
          select: {
            price: true,
            quantity: true,
            size: true,

            product: {
              select: {
                title: true,
                slug: true,

                ProductImage: {
                  select: {
                    url: true,
                  },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new Error(`Orden #${id} no existe`);
    }

    if(session.user.role === "user" && session.user.id !== order.userId) {
        throw new Error(`Orden #${id} no pertenece al usuario`);
    }

    return {
      ok: true,
      order,
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Error al obtener la orden",
    };
  }
};
