"use server";

export const paypalCheckPayment = async (paypalTransactionId: string) => {
  try {
    const { access_token } = await getPayPalBearerToken();
    if (!access_token) {
      return { ok: false, message: "Error obtaining PayPal access token" };
    }

    return { ok: true, access_token };
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
