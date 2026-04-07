"use client";

import { QuantitySelector } from "@/components";
import { useCartStore } from "@/store/cart/cart-store";
import Image from "next/image";

export const ProductsInCart = () => {
  const products = useCartStore((state) => state.cart);
  const hasHydrated = useCartStore(state => state._hasHydrated);

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
            <p>{product.title}</p>
            <p>${product.price}</p>
            <QuantitySelector
              quantity={product.quantity}
              onQuantityChange={() => {}}
            />

            <button className="underline mt-3">Remover</button>
          </div>
        </div>
      ))}
    </>
  );
};
