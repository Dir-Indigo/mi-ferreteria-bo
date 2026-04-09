import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { CartProvider } from "@/context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ferretería Industrial | Tu catálogo online",
  description: "Encuentra las mejores herramientas y materiales para tus proyectos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen pb-24 md:pb-0 md:pt-24`}
      >
        <CartProvider>
          <Navbar />
          <main className="container mx-auto px-4 max-w-7xl">
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  );
}
