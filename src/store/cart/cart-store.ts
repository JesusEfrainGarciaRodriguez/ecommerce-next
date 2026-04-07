import { CartProduct } from "@/interfaces";
import { create, StateCreator } from "zustand";
import { persist } from "zustand/middleware";

type CartStoreState = {
  cart: CartProduct[];
  totalItems: number;
};

type CartStoreActions = {
  addProductToCart: (product: CartProduct) => void;
};

type CartStore = CartStoreState & CartStoreActions;

const cartStoreApi: StateCreator<CartStore> = (set, get) => ({
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
          : item,
      );
    } else {
      updatedCart = [...cart, product];
    }

    const totalItems = updatedCart.reduce(
      (total, item) => total + item.quantity,
      0,
    );

    set({
      cart: updatedCart,
      totalItems,
    });
  },
});

export const useCartStore = create<CartStore>()(
  persist(cartStoreApi, {
    name: "shopping-cart",
  }),
);
