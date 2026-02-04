import type { Metadata } from "next";
import { Outfit, Geist_Mono, Hind_Siliguri } from "next/font/google";
import { Header } from "@/components/layout/header";
import { ConditionalFooter } from "@/components/layout/conditional-footer";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import "../globals.css";

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

const hindSiliguri = Hind_Siliguri({
  variable: "--font-bengali",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["bengali"],
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

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${outfit.variable} ${geistMono.variable} ${hindSiliguri.variable} antialiased ${locale === 'bn' ? 'font-bengali' : ''}`}
      >
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <Header />
            <main className="min-h-screen pt-20">{children}</main>
            <ConditionalFooter />
            <Toaster position="top-center" richColors />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

