import { CartProduct } from "@/interfaces";

export const getCartSummary = (cart: CartProduct[]) => {
  const itemsInCart = cart.reduce((acc, item) => acc + item.quantity, 0);

  const subsTotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const taxes = subsTotal * 0.15;
  const total = subsTotal + taxes;

  return {
    itemsInCart,
    subsTotal,
    taxes,
    total,
  };
};
