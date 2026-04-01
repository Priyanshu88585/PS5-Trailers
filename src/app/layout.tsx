import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Condensed, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/common/Providers";
import { Toaster } from "react-hot-toast";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PS5 Trailers — Game Trailer Streaming Platform",
    template: "%s | PS5 Trailers",
  },
  description:
    "The ultimate destination for PS5 game trailers. Watch, discover and explore the latest PlayStation 5 game trailers in stunning quality.",
  keywords: ["PS5", "PlayStation 5", "game trailers", "gaming", "PlayStation"],
  authors: [{ name: "PS5 Trailers Team" }],
  creator: "PS5 Trailers",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: "PS5 Trailers — Game Trailer Streaming Platform",
    description: "The ultimate destination for PS5 game trailers.",
    siteName: "PS5 Trailers",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PS5 Trailers",
    description: "Watch the latest PS5 game trailers.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${barlow.variable} ${barlowCondensed.variable} ${jetBrainsMono.variable} dark`}
      suppressHydrationWarning
    >
      <body className="bg-ps5-void text-ps5-text-primary font-body antialiased selection:bg-ps5-blue/30 selection:text-white">
        <Providers>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#161616",
                color: "#fff",
                border: "1px solid #1F1F1F",
                borderRadius: "8px",
                fontFamily: "var(--font-body)",
              },
              success: {
                iconTheme: { primary: "#006FFF", secondary: "#fff" },
              },
              error: {
                iconTheme: { primary: "#FF3B3B", secondary: "#fff" },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
