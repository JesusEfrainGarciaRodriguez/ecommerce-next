"use client";
import { useCartStore } from "@/store";
import { currencyFormat } from '../../../utils/currencyFormat';
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartSummary } from "@/hooks/useCartSummary";

export const OrderSummary = () => {
  const router = useRouter();
  const { itemsInCart, subsTotal, taxes, total } = useCartSummary();
  const hasHydrated = useCartStore((state) => state._hasHydrated);

  
  useEffect(() => {
    if (hasHydrated && itemsInCart === 0) {
      router.replace("/empty");
    }
  }, [hasHydrated, itemsInCart, router]);

  if (!hasHydrated) {
    return <p>Loading...</p>;
  }

  return (
    <div className="grid grid-cols-2">
      <span>No. Productos</span>
      <span className="text-right">
        {itemsInCart === 1 ? "1 artículo" : `${itemsInCart} artículos`}
      </span>

      <span>Subtotal</span>
      <span className="text-right">{currencyFormat(subsTotal)}</span>

      <span>Impuestos (15%)</span>
      <span className="text-right">{currencyFormat(taxes)}</span>

      <span className="mt-5 text-2xl">Total:</span>
      <span className="mt-5 text-2xl text-right">{currencyFormat(total)}</span>
    </div>
  );
};
