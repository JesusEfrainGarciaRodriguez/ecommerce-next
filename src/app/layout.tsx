import type { Metadata } from "next";
import { openSans } from "@/config/fonts"
import "./globals.css";

export const metadata: Metadata = {
  title: "Ecommerce | Next.js",
  description: 'Ecommerce | Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${openSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
