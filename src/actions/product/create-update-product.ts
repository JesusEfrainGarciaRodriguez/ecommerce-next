"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import { Gender, Product, Size } from "../../../generated/prisma/client";

const productSchema = z.object({
  id: z.uuid().optional().nullable(),
  title: z.string().min(3).max(255),
  slug: z.string().min(3).max(255),
  description: z.string(),
  price: z.coerce
    .number()
    .min(0)
    .transform((val) => Number(val.toFixed(2))),
  inStock: z.coerce
    .number()
    .min(0)
    .transform((val) => Number(val.toFixed(0))),
  categoryId: z.string().uuid(),
  sizes: z.coerce.string().transform((val) => val.split(",")),
  tags: z.string(),
  gender: z.enum(Gender),
});

export const createUpdateProduct = async (formData: FormData) => {
  const data = Object.fromEntries(formData);
  const productParsed = productSchema.safeParse(data);

  if (!productParsed.success) {
    return { ok: false, messagge: "Invalid data" };
  }

  const product = productParsed.data;
  product.slug = product.slug.toLowerCase().replace(/ /g, "-").trim();

  const { id, ...rest } = product;

  try {
    const prismaTx = await prisma.$transaction(async () => {
      let product: Product;
      const tagsArray = rest.tags
        .split(",")
        .map((tag) => tag.trim().toLowerCase());

      const data = {
        ...rest,
        sizes: {
          set: rest.sizes as Size[],
        },
        tags: {
          set: tagsArray,
        },
      };

      if (id) {
        product = await prisma.product.update({
          where: { id },
          data,
        });
      } else {
        product = await prisma.product.create({
          data,
        });
      }

      return {
        product,
      };
    });

    return {
      ok: true,
      product: prismaTx.product,
    };
  } catch (error) {
    return {
      ok: false,
      message: "Error saving product",
    };
  }
};
