"use server";

import type { Address, Size } from "@/interfaces";
import { getSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";

interface ProductToOrder {
  productId: string;
  quantity: number;
  size: Size;
}

export const placeOrder = async (
  productIds: ProductToOrder[],
  address: Address,
) => {
  const session = await getSession();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds.map((p) => p.productId),
      },
    },
  });

  const itemsInOrder = productIds.reduce((acc, p) => acc + p.quantity, 0);

  const { subTotal, tax, total } = productIds.reduce(
    (totals, p) => {
      const product = products.find((prod) => prod.id === p.productId);
      if (!product) {
        throw new Error(`Product with ID ${p.productId} not found`);
      }

      const subTotal = product.price * p.quantity;

      totals.subTotal += subTotal;
      totals.tax += subTotal * 0.16;
      totals.total += subTotal * 1.16;

      return totals;
    },
    { subTotal: 0, tax: 0, total: 0 },
  );

  const prismaTx = await prisma.$transaction(async (tx) => {
    // Actualizar stock de productos

    // Crear orden
    const order = await tx.order.create({
      data: {
        userId,
        itemsInOrder,
        subTotal,
        tax,
        total,
        orderItems: {
          create: productIds.map((p) => ({
            productId: p.productId,
            quantity: p.quantity,
            size: p.size,
            price: products.find((prod) => prod.id === p.productId)?.price || 0,
          })),
        },
      },
    });

    // Validar si el price es cero y lanzar error para hacer rollback
    if (order.total === 0) {
      throw new Error("Order total cannot be zero");
    }

    // Crear dirección de envío
    const { country, ...addressWithoutCountry } = address;
    const orderAddress = await tx.orderAddress.create({
      data: {
        orderId: order.id,
        ...addressWithoutCountry,
        countryId: country,
      },
    });

    return {
        order: order,
        orderAddress: orderAddress
    };
  });
};
