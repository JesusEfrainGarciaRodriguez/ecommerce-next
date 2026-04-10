"use client";
import { useCartStore } from "@/store";
import { useShallow } from "zustand/shallow";
import { currencyFormat } from '../../../utils/currencyFormat';

export const OrderSummary = () => {
  const { itemsInCart, subsTotal, taxes, total } = useCartStore(
    useShallow((state) => state.getSummaryInformation()),
  );
  const hasHydrated = useCartStore((state) => state._hasHydrated);

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
