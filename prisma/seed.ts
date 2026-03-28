import { PrismaPg } from "@prisma/adapter-pg";
import { Gender, PrismaClient, Size } from "../generated/prisma/client";
import { initialData } from "@/seed/seed";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  // Borrar registros (orden importante por relaciones)
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Obtener categorías únicas (type -> Category)
  const categoriesMap = new Map<string, string>();

  const uniqueCategories = Array.from(
    new Set(initialData.products.map((p) => p.type)),
  );

  // Crear categorías
  for (const categoryName of uniqueCategories) {
    const category = await prisma.category.create({
      data: {
        name: categoryName,
      },
    });

    categoriesMap.set(categoryName, category.id);
  }

  // Crear productos
  for (const product of initialData.products) {
    const { images, type, ...rest } = product;

    const createdProduct = await prisma.product.create({
      data: {
        ...rest,
        sizes: product.sizes as Size[],
        gender: product.gender as Gender,
        categoryId: categoriesMap.get(type)!,

        ProductImage: {
          create: images.map((img) => ({
            url: img,
          })),
        },
      },
    });

    console.log(`Producto creado: ${createdProduct.title}`);
  }
}

main()
  .then(async () => {
    console.log("Seed ejecutado correctamente");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
