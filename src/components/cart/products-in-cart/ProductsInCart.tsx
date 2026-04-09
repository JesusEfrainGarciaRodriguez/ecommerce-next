"use client";

import { QuantitySelector } from "@/components";
import { useCartStore } from "@/store/cart/cart-store";
import Image from "next/image";
import Link from "next/link";

export const ProductsInCart = () => {
  const products = useCartStore((state) => state.cart);
  const hasHydrated = useCartStore(state => state._hasHydrated);
  const updateProductQuantity = useCartStore(state => state.updateProductQuantity);

  if (!hasHydrated) {
    return <p>Loading...</p>
  }
  
  return (
    <>
      {products.map((product) => (
        <div key={`${product.slug}-${product.size}`} className="flex mb-5">
          <Image
            src={`/products/${product.image}`}
            width={100}
            height={100}
            style={{
              width: "100px",
              height: "100px",
            }}
            alt={product.title}
            className="mr-5 rounded"
            loading="eager"
          />

          <div>
            <Link href={`/product/${product.slug}`} className="hover:underline cursor-pointer">
                <p>{product.title}</p>
                <p>${product.price}</p>
            </Link>
            <QuantitySelector
              quantity={product.quantity}
              onQuantityChange={(quantity) => updateProductQuantity(product, quantity)}
            />

            <button className="underline mt-3">Remover</button>
          </div>
        </div>
      ))}
    </>
  );
};
