"use client";

import {
  INSTANCE_LOADING_STATE,
  OnApproveDataOneTimePayments,
  PayPalOneTimePaymentButton,
  usePayPal,
} from "@paypal/react-paypal-js/sdk-v6";

export const PaypalButton = () => {
  const { loadingStatus } = usePayPal();

  const isPending = loadingStatus === INSTANCE_LOADING_STATE.PENDING;

  if (isPending) {
    return (
      <p className="animated-pulse antialiased text-lg mb-1 bg-gray-200 rounded">
        &nbsp;
      </p>
    );
  }

  return (
    <PayPalOneTimePaymentButton
      presentationMode="auto"
      /* TODO: Implement createOrder function */
      createOrder={async () => {
        const response = await fetch("/api/create-order", {
          method: "POST",
        });
        const { orderId } = await response.json();
        return { orderId };
      }}
      /* TODO: Implement onApprove function */
      onApprove={async ({ orderId }: OnApproveDataOneTimePayments) => {
        await fetch(`/api/capture-order/${orderId}`, {
          method: "POST",
        });
        console.log("Payment captured!");
      }}
    />
  );
};
