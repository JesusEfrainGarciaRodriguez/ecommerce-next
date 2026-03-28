import { getPaginatedProductsWithImages } from "@/actions";
import { Title, ProductGrid } from "@/components";

interface Params {
  searchParams: Promise<{ page?: string }>
}

export default async function Shop({searchParams}: Params) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;

  const { products } = await getPaginatedProductsWithImages({page});

  return (
    <>
      <Title title="Tienda" subtitle="Todos los productos" className="mb-2"/>

      <ProductGrid products={products} />  
    </>
  );
}
