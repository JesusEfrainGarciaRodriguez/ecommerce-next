export const revalidate = 604800; // 7 días en segundos

import { AddToCart, ProductMobileSlideshow, ProductSlideshow, StockLabel } from "@/components";
import { getProductBySlug } from "@/actions";
import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = (await params).slug
   const product = await getProductBySlug(slug)
 
  return {
    title: `${product.title}`,
    description: product.description,
    openGraph: {
      title: `${product.title}`,
      description: product.description,
      images: product.images.map((image) => ({
        url: `${process.env.BASE_URL}/products/${image}`,
        alt: product.title,
      })),
    },
  }
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) return notFound();

  return (
    <div className="mt-5 mb-20 grid grid-cols-1 md:grid-cols-3 gap-3">
      {/* Slideshow */}

      <div className="col-span-1 md:col-span-2 ">
        {/* Mobile Slideshow */}
        <ProductMobileSlideshow
          title={product.title}
          images={product.images}
          className="block md:hidden"
        />

        {/* Desktop Slideshow */}
        <ProductSlideshow
          title={product.title}
          images={product.images}
          className="hidden md:block"
        />
      </div>

      {/* Detalles */}
      <div className="col-span-1 px-5">
        <StockLabel slug={product.slug} />

        <h1 className="antialiased font-bold text-xl">
          {product.title}
        </h1>
        <p className="text-lg mb-5">${product.price}</p>

        <AddToCart product={product}/>

        {/* Descripción */}
        <h3 className="font-bold text-sm">Descripción</h3>
        <p className="font-light">{product.description}</p>
      </div>
    </div>
  );
}
