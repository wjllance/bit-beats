import "./globals.css";
import type { Metadata } from "next";
import { Orbitron } from "next/font/google";
import DeviceRedirect from "../components/DeviceRedirect";
import GoogleAnalytics from "../components/GoogleAnalytics";
import { Providers } from "@/components/Providers";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const orbitron = Orbitron({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bit Beats - Track Bitcoin's Dominance",
  description:
    "Watch Bitcoin beat other assets in real-time with market tracking and visualization. Compare Bitcoin's performance against stocks, commodities, and other assets with real-time data and interactive charts.",
  keywords:
    "Bitcoin, cryptocurrency, market comparison, real-time tracking, asset visualization, BTC price, market data, investment comparison, crypto tracking",
  authors: [{ name: "BitBeats" }],
  category: "Finance",
  openGraph: {
    title: "Bit Beats - Track Bitcoin's Dominance",
    description:
      "Watch Bitcoin beat other assets in real-time with market tracking and visualization",
    type: "website",
    siteName: "BitBeats",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BitBeats - Real-time Bitcoin Performance Tracking",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bit Beats - Track Bitcoin's Dominance",
    description:
      "Watch Bitcoin beat other assets in real-time with market tracking and visualization",
    images: ["/og-image.png"],
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
  verification: {
    google: "google-site-verification-code", // You'll need to replace this with your actual verification code
  },
  alternates: {
    canonical: "https://btcbeats.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={orbitron.className}>
        <GoogleAnalytics />
        <Analytics />
        <SpeedInsights />
        <Providers>
          <DeviceRedirect>{children}</DeviceRedirect>
        </Providers>
      </body>
    </html>
  );
}
