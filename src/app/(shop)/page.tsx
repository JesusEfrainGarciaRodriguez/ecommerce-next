export const revalidate = 60;

import { getPaginatedProductsWithImages } from "@/actions";
import { Title, ProductGrid } from "@/components";
import { Pagination } from "@/components/ui/pagination/Pagination";
import { redirect } from "next/navigation";

interface Params {
  searchParams: Promise<{ page?: string }>
}

export default async function Shop({searchParams}: Params) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;

  const { products, totalPages } = await getPaginatedProductsWithImages({page});

  if (products.length === 0) {
    redirect("/")
  }

  return (
    <>
      <Title title="Tienda" subtitle="Todos los productos" className="mb-2"/>

      <ProductGrid products={products} />  

      <Pagination totalPages={totalPages} />
    </>
  );
}
