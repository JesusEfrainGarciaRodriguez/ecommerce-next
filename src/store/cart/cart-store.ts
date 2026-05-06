import { CartProduct } from "@/interfaces";
import { create, StateCreator } from "zustand";
import { persist } from "zustand/middleware";

type CartStoreState = {
  cart: CartProduct[];
  _hasHydrated: boolean;
};

type CartStoreActions = {
  setHasHydrated: (state: boolean) => void;
  addProductToCart: (product: CartProduct) => void;
  updateProductQuantity: (product: CartProduct, quantity: number) => void;
  removeProductFromCart: (product: CartProduct) => void;
  clearCart: () => void;
};

type CartStore = CartStoreState & CartStoreActions;

const cartStoreApi: StateCreator<CartStore> = (set, get) => ({
  cart: [],
  _hasHydrated: false,

  setHasHydrated: (state) => {
    set({
      _hasHydrated: state,
    });
  },

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

    set({
      cart: updatedCart,
    });
  },
  updateProductQuantity: (product: CartProduct, quantity: number) => {
    const { cart } = get();

    const updatedCart = cart.map((item) =>
      item.id === product.id && item.size === product.size
        ? { ...item, quantity }
        : item,
    );

    set({
      cart: updatedCart,
    });
  },

  removeProductFromCart: (product: CartProduct) => {
    const { cart } = get();
    const updatedCart = cart.filter(
      (item) => !(item.id === product.id && item.size === product.size),
    );

    set({ cart: updatedCart });
  },

  clearCart: () => {
    set({cart: []})
  },
});

export const useCartStore = create<CartStore>()(
  persist(cartStoreApi, {
    name: "shopping-cart",
    onRehydrateStorage: (state) => {
      return () => state.setHasHydrated(true);
    },
  }),
);
