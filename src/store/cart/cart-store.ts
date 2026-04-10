import { CartProduct } from "@/interfaces";
import { create, StateCreator } from "zustand";
import { persist } from "zustand/middleware";

type CartStoreState = {
  cart: CartProduct[];
  totalItems: number;
  _hasHydrated: boolean;
};

type CartStoreActions = {
  setHasHydrated: (state: boolean) => void;
  addProductToCart: (product: CartProduct) => void;
  updateProductQuantity: (product: CartProduct, quantity: number) => void;
  removeProductFromCart: (product: CartProduct) => void;
};

type CartStore = CartStoreState & CartStoreActions;

const cartStoreApi: StateCreator<CartStore> = (set, get) => ({
  cart: [],
  totalItems: 0,
  _hasHydrated: false,
  
  setHasHydrated: (state) => {
    set({
      _hasHydrated: state
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

    const totalItems = calculateTotalItems(updatedCart);

    set({
      cart: updatedCart,
      totalItems,
    });
  },
  updateProductQuantity: (product: CartProduct, quantity: number) => {
    const { cart } = get();

    const updatedCart = cart.map((item) =>
      item.id === product.id && item.size === product.size
        ? { ...item, quantity }
        : item
    );

    const totalItems = calculateTotalItems(updatedCart);

    set({
      cart: updatedCart,
      totalItems
    });
  },

  removeProductFromCart: (product: CartProduct) => {
    const { cart } = get();
    const updatedCart = cart.filter(
      (item) => !(item.id === product.id && item.size === product.size)
    );

    const totalItems = calculateTotalItems(updatedCart);

    set({
      cart: updatedCart,
      totalItems
    });
  }
});

const calculateTotalItems = (cart: CartProduct[]) => {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

export const useCartStore = create<CartStore>()(
  persist(cartStoreApi, {
    name: "shopping-cart",
    onRehydrateStorage: (state) => {
      return () => state.setHasHydrated(true)
    }
  }),
);
