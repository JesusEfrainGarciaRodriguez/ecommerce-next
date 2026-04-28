import "dotenv/config";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import { initialData } from "./seed";
import { countries } from "./seed-countries";

async function main() {
  console.log("🌱 Seeding users...");

  await Promise.all([
    prisma.userAddress.deleteMany(),
    prisma.account.deleteMany(),
    prisma.session.deleteMany(),
    prisma.user.deleteMany(),
    prisma.productImage.deleteMany(),
    prisma.product.deleteMany(),
    prisma.category.deleteMany(),
    prisma.country.deleteMany(),
  ]);

  const { categories, products, users } = initialData;

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    // Crear usuario
    const { id: userId } = await prisma.user.create({
      data: {
        email: user.email,
        name: user.email,
        role: user.role,
      },
    });

    // Crear account
    await prisma.account.create({
      data: {
        userId: userId,
        accountId: userId,
        providerId: "credential",
        password: hashedPassword,
      },
    });

    console.log(`✅ Usuario listo: ${user.email}`);
  }

  const categoriesData = categories.map((name) => ({ name }));

  await prisma.category.createMany({
    data: categoriesData,
  });

  const categoriesDB = await prisma.category.findMany();

  const categoriesMap = categoriesDB.reduce(
    (map, category) => {
      map[category.name.toLowerCase()] = category.id;
      return map;
    },
    {} as Record<string, string>,
  );

  // Productos
  for (const product of products) {
    const { type, images, ...rest } = product;

    const dbProduct = await prisma.product.create({
      data: {
        ...rest,
        categoryId: categoriesMap[type],
      },
    });

    const imagesData = images.map((image) => ({
      url: image,
      productId: dbProduct.id,
    }));

    await prisma.productImage.createMany({
      data: imagesData,
    });

    console.log(`✅ Producto listo: ${product.title}`);
  }

  // Paises
  await prisma.country.createMany({
    data: countries,
  });
  console.log(`✅ Paises listos: ${countries.length}`);

  console.log("🌱 Seed terminado");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
