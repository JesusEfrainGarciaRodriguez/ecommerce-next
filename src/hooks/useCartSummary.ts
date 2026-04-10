import { useCartStore } from "@/store";
import { getCartSummary } from "@/utils/getCartSummary";

export const useCartSummary = () => {
  const cart = useCartStore((state) => state.cart);

  return getCartSummary(cart);
};
