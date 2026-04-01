"use server"

import prisma from "@/lib/prisma"
import { cache } from "react"

export const getProductBySlug = cache(async (slug: string) => {
    try {
        const product = await prisma.product.findUnique({
            where: { slug },
            include: {
                ProductImage: {
                    select: {
                        url: true
                    }
                }
            }
        })
        if (!product) {
            throw new Error("Producto no encontrado")
        }
        return {
            ...product,
            images: product.ProductImage.map(image => image.url)
        }
    } catch (error) {
        throw new Error("No se pudo cargar el producto")
    }
})