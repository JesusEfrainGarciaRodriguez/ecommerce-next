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

  const { subTotal, taxes, total } = productIds.reduce(
    (totals, p) => {
      const product = products.find((prod) => prod.id === p.productId);
      if (!product) {
        throw new Error(`Product with ID ${p.productId} not found`);
      }

      const subTotal = product.price * p.quantity;

      totals.subTotal += subTotal;
      totals.taxes += subTotal * 0.16;
      totals.total += subTotal * 1.16;

      return totals;
    },
    { subTotal: 0, taxes: 0, total: 0 },
  );

  console.log({ subTotal, taxes, total });

  //TODO: Implementar lógica para guardar la orden en la base de datos
};
