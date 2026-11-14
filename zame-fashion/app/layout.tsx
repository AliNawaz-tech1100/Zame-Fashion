import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ZAMÉ Fashion | Premium Imported Accessories",
    template: "%s | ZAMÉ Fashion",
  },
  description:
    "Shop cute, pastel, feminine fashion accessories online in Pakistan. Hair clips, bows, keychains & more. 100% Imported. Launch Sale 50% Off!",
  keywords: ["fashion accessories", "hair clips", "bows", "keychains", "Pakistan", "cute accessories", "pastel", "Zame Fashion"],
  icons: {
    icon: "/Logo.png",
    shortcut: "/Logo.png",
    apple: "/Logo.png",
  },
  openGraph: {
    title: "ZAMÉ Fashion | Premium Imported Accessories",
    description: "Shop cute, pastel, feminine fashion accessories online in Pakistan.",
    type: "website",
    locale: "en_PK",
    siteName: "ZAMÉ Fashion",
    images: ["/Logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "ZAMÉ Fashion | Premium Imported Accessories",
    description: "Shop cute, pastel, feminine fashion accessories online in Pakistan.",
    images: ["/Logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-body bg-cream text-charcoal antialiased">
        <AnnouncementBar />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
