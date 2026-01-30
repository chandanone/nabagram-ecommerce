import type { Metadata } from "next";
import { Outfit, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/header";
import { ConditionalFooter } from "@/components/layout/conditional-footer";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Nabagram Seva Sangha | Heritage Handwoven Textiles",
    template: "%s | Nabagram Seva Sangha",
  },
  description:
    "Discover premium handwoven muslin and silk from Murshidabad. Crafted by 28 master spinners and 13 skilled weavers. KVIC certified heritage textiles.",
  keywords: [
    "handwoven textiles",
    "muslin",
    "silk sarees",
    "khadi",
    "KVIC",
    "Murshidabad",
    "Indian handicrafts",
    "heritage textiles",
  ],
  authors: [{ name: "Nabagram Seva Sangha" }],
  openGraph: {
    title: "Nabagram Seva Sangha | Heritage Handwoven Textiles",
    description:
      "Premium handwoven muslin and silk from the heart of Murshidabad",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Header />
          <main className="min-h-screen pt-20">{children}</main>
          <ConditionalFooter />
          <Toaster position="top-center" richColors />
        </Providers>
      </body>
    </html>
  );
}
