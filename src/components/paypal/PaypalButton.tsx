"use client";

import { paypalCheckPayment, setTransactionId } from "@/actions";
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
  const rountedAmount = Math.round(amount * 100) / 100;

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

      const { ok } = await setTransactionId(orderId, transactionId);

      if (!ok) {
        throw new Error("Error creating PayPal order");
      }

      return transactionId;
    } catch (error) {
      console.error(error);

      throw error;
    }
  };

  const onApprove: PayPalButtonsComponentProps["onApprove"] = async (
    data,
    actions,
  ) => {
    try {
      const detail = await actions.order?.capture();
      if (!detail) return;

      await paypalCheckPayment(detail.id!);

    } catch (error) {
      console.error("Error capturing PayPal order:", error);
    }
  };

  return <PayPalButtons createOrder={createOrder} onApprove={onApprove} />;
};
