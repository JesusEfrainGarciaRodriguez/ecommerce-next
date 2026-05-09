import { PayPalProvider } from "@paypal/react-paypal-js/sdk-v6";

export default function CheckoutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PayPalProvider
      clientId={process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ""}
      components={["paypal-payments"]}
      pageType="checkout"
    >
      {children}
    </PayPalProvider>
  );
}
