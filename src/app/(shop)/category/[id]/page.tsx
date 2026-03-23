import { ProductGrid, Title } from "@/components";
import { notFound } from "next/navigation";
import { initialData } from "@/seed/seed";
import { Category } from "@/interfaces";

interface Props {
  params: Promise<{ id: Category }>;
}

const seedProducts = initialData.products;

export default async function CategoryPage({ params }: Props) {
  const { id } = await params;

  const products = seedProducts.filter((product) => product.gender === id);

  const labels: Record<Category, string> = {
    men: "Hombre",
    women: "Mujer",
    kid: "Niño",
    unisex: "Unisex",
  };

  if (products.length === 0) return notFound();

  return (
    <>
      <Title title={labels[id]} subtitle="Todos los productos" className="mb-2"/>

      <ProductGrid products={products} />  
    </>
  );
}
