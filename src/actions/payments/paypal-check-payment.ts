"use server";

import { PayPalOrderStatusResponse } from "@/interfaces";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const paypalCheckPayment = async (paypalTransactionId: string) => {
  try {
    const { access_token } = await getPayPalBearerToken();
    if (!access_token) {
      return { ok: false, message: "Error obtaining PayPal access token" };
    }

    const verificationResponse = await verifyPayPalPayment(
      paypalTransactionId,
      access_token,
    );
    if (!verificationResponse) {
      return { ok: false, message: "Error verifying PayPal payment" };
    }

    const { status, purchase_units } = verificationResponse as PayPalOrderStatusResponse;
    const { invoice_id: orderId } = purchase_units[0];

    if (status !== "COMPLETED") {
      return {
        ok: false,
        message: "Payment not completed. Current status: " + status,
      };
    }

    await prisma.order.update({
      where: { id: orderId },
      data: {
        isPaid: true,
        paidAt: new Date(),
      },
    });

    revalidatePath(`/orders/${orderId}`);

    return { ok: true };
  } catch (error) {
    console.error("Error checking PayPal payment:", error);
    return { ok: false, message: "Error checking PayPal payment" };
  }
};

const getPayPalBearerToken = async () => {
  const base64Credentials = btoa(
    `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`,
  );
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append("Authorization", `Basic ${base64Credentials}`);

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "client_credentials");

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
  };

  try {
    const resp = await fetch(process.env.PAYPAL_OAUTH_URL ?? "", {
      ...requestOptions,
      cache: "no-store",
    }).then((r) => r.json());

    return resp;
  } catch (error) {
    return null;
  }
};

const verifyPayPalPayment = async (
  transactionId: string,
  accessToken: string,
): Promise<PayPalOrderStatusResponse | null> => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + accessToken);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    };

    const resp = await fetch(
      `${process.env.PAYPAL_ORDERS_URL}/${transactionId}`,
      {
        ...requestOptions,
        cache: "no-store",
      },
    ).then((r) => r.json());

    return resp;
  } catch (error) {
    console.error("Error verifying PayPal payment:", error);
    return null;
  }
};
