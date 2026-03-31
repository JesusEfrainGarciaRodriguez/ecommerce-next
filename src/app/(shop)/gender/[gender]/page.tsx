export const revalidate = 60;

import { Pagination, ProductGrid, Title } from "@/components";
import { notFound } from "next/navigation";
import { Gender } from "../../../../../generated/prisma/enums";
import { getPaginatedProductsWithImages } from "@/actions";

interface Props {
  params: Promise<{ gender: Gender }>;
  searchParams: Promise<{ page?: string }>
}

export default async function GenderPage({ params, searchParams }: Props) {
  const { gender } = await params;

  const { page: queryPage } = await searchParams;
  const page =  queryPage ? parseInt(queryPage) : 1;

  const { products, totalPages } = await getPaginatedProductsWithImages({ page, gender});

  const labels: Record<Gender, string> = {
    men: "Hombre",
    women: "Mujer",
    kid: "Niño",
    unisex: "Unisex",
  };

  if (products.length === 0) return notFound();

  return (
    <>
      <Title title={labels[gender]} subtitle="Todos los productos" className="mb-2"/>

      <ProductGrid products={products} />  

      <Pagination totalPages={totalPages} />
    </>
  );
}
