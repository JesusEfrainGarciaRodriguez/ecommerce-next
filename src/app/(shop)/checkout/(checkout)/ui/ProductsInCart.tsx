"use client";

import { useCartStore } from "@/store/cart/cart-store";
import { currencyFormat } from "@/utils";
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
            <span>
                {product.size} - {product.title} ({product.quantity})
            </span>

            <p className="font-bold">{currencyFormat(product.price * product.quantity)}</p>

          </div>
        </div>
      ))}
    </>
  );
};
