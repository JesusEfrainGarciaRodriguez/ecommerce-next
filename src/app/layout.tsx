import type { Metadata } from "next";
import { openSans } from "@/config/fonts"
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Ecommerce",
    default: "Home",
  },
  description: 'Tienda de productos',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${openSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
