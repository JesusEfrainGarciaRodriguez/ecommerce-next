import { CartProduct } from '@/interfaces'
import { create } from 'zustand'

interface State {
  cart: CartProduct[];
  addProductToCart: (product: CartProduct) => void;

}

export const useCartStore = create<State>((set, get) => ({
    cart: [],
    addProductToCart: (product: CartProduct) => {
        const { cart } = get();

        const productInCart = cart.some((item) => item.id === product.id && item.size === product.size);

        if (productInCart) {
            set((state) => ({
                cart: state.cart.map((item) =>
                    item.id === product.id && item.size === product.size
                        ? { ...item, quantity: item.quantity + product.quantity }
                        : item
                )
            }));
        } else {
            set({ cart: [...cart, product] });
        }

    }
}))
