"use client";
import { useCartStore } from "@/store";
import Link from "next/link";
import { IoCartOutline } from "react-icons/io5";

export const ButtonCart = () => {
  const totalItems = useCartStore((state) => state.getSummaryInformation().itemsInCart);
  const hasHydrated = useCartStore((state) => state._hasHydrated);

  return (
    <Link href="/cart" className="mx-2">
      <div className="relative">
        {hasHydrated && totalItems > 0 && (
          <span className="absolute text-xs px-1 rounded-full font-bold -top-2 -right-2 bg-blue-700 text-white">
            {totalItems}
          </span>
        )}
        <IoCartOutline className="w-5 h-5" />
      </div>
    </Link>
  );
};
