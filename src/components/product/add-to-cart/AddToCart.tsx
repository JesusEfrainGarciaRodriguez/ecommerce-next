"use client";
import { useState } from "react";
import { CartProduct, Product, Size } from "@/interfaces";
import { QuantitySelector } from "../quantity-selector/QuantitySelector";
import { SizeSelector } from "../size-selector/SizeSelector";
import { useCartStore } from "@/store";

interface AddToCartProps {
  product: Product;
}
export const AddToCart = ({ product }: AddToCartProps) => {
  const addProductToCart = useCartStore((state) => state.addProductToCart);
  const [size, setSize] = useState<Size | undefined>();
  const [quantity, setQuantity] = useState<number>(1);
  const [error, setError] = useState<boolean>(false);

  const addToCart = () => {
    if (!size) {
      setError(true);
      return;
    }
    const cartProduct: CartProduct = {
      id: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      size: size,
      quantity: quantity,
      image: product.images[0],
    };
    addProductToCart(cartProduct);
    setError(false);
    setSize(undefined);
    setQuantity(1);
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
