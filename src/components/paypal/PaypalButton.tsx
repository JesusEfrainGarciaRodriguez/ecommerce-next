"use client";

import {
  PayPalButtons,
  PayPalButtonsComponentProps,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";

interface Props {
  orderId: string;
  amount: number;
}
export const PaypalButton = ({ orderId, amount }: Props) => {
  const [{ isPending }] = usePayPalScriptReducer();
  const rountedAmount = (Math.round(amount * 100)) / 100;

  if (isPending) {
    return (
      <p className="animated-pulse antialiased text-lg mb-1 bg-gray-200 rounded">
        &nbsp;
      </p>
    );
  }

  const createOrder: PayPalButtonsComponentProps["createOrder"] = async (
    data,
    actions,
  ) => {
    try {
      const transactionId = await actions.order.create({
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: rountedAmount.toString(),
            },
          },
        ],
        intent: "CAPTURE",
      });

      console.log("Transaction ID:", transactionId);
      return transactionId;
    } catch (error) {
      console.error(error);

      throw error;
    }
  };

  return (
    <PayPalButtons
      /* TODO: Implement createOrder function */
      createOrder={createOrder}
    />
  );
};
