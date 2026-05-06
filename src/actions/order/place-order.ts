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

  try {
    const prismaTx = await prisma.$transaction(async (tx) => {
      // Actualizar stock de productos
      const updatedProductsPromises = products.map(async (product) => {
        // Acumular valores
        const productQuantity = productIds
          .filter((p) => p.productId === product.id)
          .reduce((acc, item) => item.quantity + acc, 0);

        if (productQuantity === 0) {
          throw new Error(`${product.id} no tiene la cantidad definida`);
        }

        return tx.product.update({
          where: { id: product.id },
          data: {
            inStock: {
              decrement: productQuantity,
            },
          },
        });
      });

      const updatedProducts = await Promise.all(updatedProductsPromises);

      // Verificar valores negativos en la existencia = no hay stock
      updatedProducts.forEach((product) => {
        if (product.inStock < 0) {
          throw new Error(`${product.title} no tiene inventario suficiente`);
        }
      });

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
              price:
                products.find((prod) => prod.id === p.productId)?.price || 0,
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
          ...addressWithoutCountry,
          countryId: country,
          orderId: order.id,
        },
      });

      return {
        updatedProducts: updatedProducts,
        order: order,
        orderAddress: orderAddress,
      };
    });

    return {
      ok: true,
      order: prismaTx.order,
      prismaTx,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "An error occurred",
    };
  }
};
