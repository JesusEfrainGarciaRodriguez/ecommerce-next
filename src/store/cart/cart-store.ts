import { CartProduct } from "@/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  cart: CartProduct[];
  totalItems: number;
  addProductToCart: (product: CartProduct) => void;
}

export const useCartStore = create<State>()(
  persist(
    (set, get) => ({
      cart: [],
      totalItems: 0,

      addProductToCart: (product: CartProduct) => {
        const { cart } = get();

        const productInCart = cart.some(
          (item) => item.id === product.id && item.size === product.size,
        );

        let updatedCart: CartProduct[];

        if (productInCart) {
          updatedCart = cart.map((item) =>
            item.id === product.id && item.size === product.size
              ? { ...item, quantity: item.quantity + product.quantity }
              : item
          );
        } else {
          updatedCart = [...cart, product];
        }

        const totalItems = updatedCart.reduce(
          (total, item) => total + item.quantity,
          0
        );

        set({
          cart: updatedCart,
          totalItems,
        });
      },
    }),
    {
      name: "shopping-cart",
    }
  )
);
