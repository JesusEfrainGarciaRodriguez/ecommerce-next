"use client";

import { useState } from "react";
import { useCartSummary } from "@/hooks/useCartSummary";
import { useAddressStore, useCartStore } from "@/store";
import clsx from "clsx";
import { placeOrder } from "@/actions";
import { useRouter } from "next/navigation";

export const PlaceOrder = () => {
  const router = useRouter();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const hasHydrated = useCartStore((state) => state._hasHydrated);
  const address = useAddressStore((state) => state.address);
  const { itemsInCart, subsTotal, taxes, total } = useCartSummary();
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);

  if (!hasHydrated) {
    return <p>Loading...</p>;
  }

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);

    const productsToOrder = cart.map((product) => ({
      productId: product.id,
      size: product.size,
      quantity: product.quantity,
    }));

    const response = await placeOrder(productsToOrder, address);
    if ( !response.ok) {
      setIsPlacingOrder(false);
      setErrorMessage(response?.message ?? "Error al colocar la orden")
      return
    }

    clearCart();
    router.replace("/orders/" + response.order?.id)
  }

  return (
    <div className="bg-white rounded-xl shadow-xl p-7">
      <h2 className="text-2xl mb-2">Dirección de entrega</h2>
      <div className="mb-10">
        <p className="text-xl">
          {address.firstName} {address.lastName}
        </p>
        <p>{address.address}</p>
        <p>{address.address2}</p>
        <p>{address.postalCode}</p>
        <p>
          {address.city}, {address.country}
        </p>
        <p>{address.phone}</p>
      </div>

      {/* Divider */}
      <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

      <h2 className="text-2xl mb-2">Resumen de orden</h2>

      <div className="grid grid-cols-2">
        <span>No. Productos</span>
        <span className="text-right">
          {itemsInCart === 1 ? "1 artículo" : `${itemsInCart} artículos`}
        </span>

        <span>Subtotal</span>
        <span className="text-right">${subsTotal.toFixed(2)}</span>

        <span>Impuestos (15%)</span>
        <span className="text-right">${taxes.toFixed(2)}</span>

        <span className="mt-5 text-2xl">Total:</span>
        <span className="mt-5 text-2xl text-right">${total.toFixed(2)}</span>
      </div>

      <div className="mt-5 mb-2 w-full">
        <p className="mb-5">
          {/* Disclaimer */}
          <span className="text-xs">
            Al hacer clic en &quot;Colocar orden&quot;, aceptas nuestros{" "}
            <a href="#" className="underline">
              términos y condiciones
            </a>{" "}
            y{" "}
            <a href="#" className="underline">
              política de privacidad
            </a>
          </span>
        </p>
        
        <p className="text-red-500">{errorMessage}</p>

        <button 
          className={clsx({
            "btn-primary": !isPlacingOrder,
            "btn-disabled": isPlacingOrder
          })}
          onClick={handlePlaceOrder}
          disabled={isPlacingOrder}
        >
          {isPlacingOrder ? "Procesando..." : "Colocar orden"}
        </button>
      </div>
    </div>
  );
};
