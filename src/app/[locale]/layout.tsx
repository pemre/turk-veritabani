import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"; // Tailwind
import Providers from "./providers";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Türk Veritabanı",
    description: "Türk Veritabanı uygulaması",
};

// TODO: Move to a config
// ISO 639-3 language codes: https://en.wikipedia.org/wiki/ISO_639-3
const LOCALES = [
  "aze", // Turkish of Azerbaijan
  "bak",
  "eng", // English
  "kaz",
  "kir",
  "rus",
  "tat",
  "tuk",
  "tur", // Turkish of Türkiye
  "uig",
  "uzb",
];

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({
    locale,
  }));
}

// Dynamically import needed messages for given locale
async function getMessages(locale: string) {
  const messageModule = await import(`@/i18n/messages/${locale}.json`);

  return messageModule.default;
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  // Asynchronous access of `params.locale`.
  // See reason: https://nextjs.org/docs/messages/sync-dynamic-apis
  const { locale } = await params;
  const messages = await getMessages(locale);
  return (
      <html lang={locale}>
      <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <Providers messages={messages} locale={locale}>
        {children}
      </Providers>
      </body>
      </html>
  );
}
