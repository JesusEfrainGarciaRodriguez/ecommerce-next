"use client";

import { ProductImage } from "@/components";
import { useCartStore } from "@/store/cart/cart-store";
import { currencyFormat } from "@/utils";
import Image from "next/image";
import { redirect } from "next/navigation";

export const ProductsInCart = () => {
  const products = useCartStore((state) => state.cart);
  const hasHydrated = useCartStore(state => state._hasHydrated);

  if (!hasHydrated) {
    return <p>Loading...</p>
  }

  if (products.length <= 0){
    redirect("/")
  }
  
  return (
    <>
      {products.map((product) => (
        <div key={`${product.slug}-${product.size}`} className="flex mb-5">
          <ProductImage
            src={product.image}
            width={100}
            height={100}
            style={{
              width: "100px",
              height: "100px",
            }}
            alt={product.title}
            className="mr-5 rounded"
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
