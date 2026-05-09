"use client";

import {
  OnApproveDataOneTimePayments,
  PayPalOneTimePaymentButton,
} from "@paypal/react-paypal-js/sdk-v6";

export const PaypalButton = () => {
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