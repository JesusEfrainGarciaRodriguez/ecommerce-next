"use client";
import { useCartSummary } from "@/hooks/useCartSummary";
import { useCartStore } from "@/store";
import Link from "next/link";
import { IoCartOutline } from "react-icons/io5";

export const ButtonCart = () => {
  const { itemsInCart } = useCartSummary();
  const hasHydrated = useCartStore((state) => state._hasHydrated);

  return (
    <Link href={itemsInCart === 0 ? "/empty" : "/cart"} className="mx-2">
      <div className="relative">
        {hasHydrated && itemsInCart > 0 && (
          <span className="fade-in absolute text-xs px-1 rounded-full font-bold -top-2 -right-2 bg-blue-700 text-white">
            {itemsInCart}
          </span>
        )}
        <IoCartOutline className="w-5 h-5" />
      </div>
    </Link>
  );
};
