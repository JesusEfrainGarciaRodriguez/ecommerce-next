"use client";
import { useState } from "react";
import { Product, Size } from "@/interfaces";
import { QuantitySelector } from "../quantity-selector/QuantitySelector";
import { SizeSelector } from "../size-selector/SizeSelector";

interface AddToCartProps {
  product: Product;
}
export const AddToCart = ({ product }: AddToCartProps) => {
  const [size, setSize] = useState<Size | undefined>();
  const [quantity, setQuantity] = useState<number>(1);
  const [error, setError] = useState<boolean>(false);

  const addToCart = () => {
    if (!size) {
      setError(true);
      return;
    }
    alert(`Agregaste ${quantity} producto(s) talla ${size} al carrito`);
  };

  return (
    <>
      {error && (
        <span className="mt-2 text-red-500">
          Por favor selecciona una talla
        </span>
      )}
      
      <SizeSelector
        selectedSize={size}
        availableSizes={product.sizes}
        onSizeChange={setSize}
      />

      <QuantitySelector quantity={quantity} onQuantityChange={setQuantity} />

      <button className="btn-primary my-5" onClick={addToCart}>
        Agregar al carrito
      </button>
    </>
  );
};
