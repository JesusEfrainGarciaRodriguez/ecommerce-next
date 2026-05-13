import { PayPalProvider } from "@/components";

export default function OrderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <PayPalProvider>{children}</PayPalProvider>;
}
