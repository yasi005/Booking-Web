import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZEUS | Athens Furnished Apartments",
  description:
    "Better than home. Discover furnished Athens residences with map-first exploration and live Hostaway availability.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://book.vercel.app",
  ),
  icons: {
    icon: [
      { url: "/favicon.ico?v=3", sizes: "any" },
      { url: "/favicon-32.png?v=3", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png?v=3", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icon-192.png?v=3", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "ZEUS",
    description: "Better than home. Discover exceptional Athens residences.",
    type: "website",
    images: [{ url: "/zeus-logo.webp", alt: "ZEUS" }],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#111111",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="h-full" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
