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
  title: "BTC Hits - Tracking Bitcoin's Rise in the Market Cap Arena",
  description:
    "Track Bitcoin's journey to the top of global market capitalization. Compare Bitcoin's market cap against major companies, assets, and indices with real-time data and interactive visualizations.",
  keywords:
    "Bitcoin market cap, cryptocurrency market capitalization, BTC vs companies, market cap comparison, real-time tracking, Bitcoin dominance, top assets by market cap, investment analysis, crypto market data",
  authors: [{ name: "BTC Hits" }],
  category: "Finance",
  icons: {
    icon: "/images/favicon.ico",
  },
  openGraph: {
    title: "BTC Hits - Tracking Bitcoin's Rise in the Market Cap Arena",
    description:
      "Track Bitcoin's journey to the top of global market capitalization with real-time data and interactive visualizations",
    type: "website",
    siteName: "BTC Hits",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BTC Hits - Tracking Bitcoin's Rise in the Market Cap Arena",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BTC Hits - Tracking Bitcoin's Rise in the Market Cap Arena",
    description:
      "Track Bitcoin's journey to the top of global market capitalization with real-time data and interactive visualizations",
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
    canonical: "https://btchits.top",
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
