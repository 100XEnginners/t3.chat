import "@/styles/globals.css";
import type { Metadata } from "next";
import { Geist, Inter, Playfair_Display, Roboto } from "next/font/google";
import { TRPCReactProvider } from "@/trpc/react";
import localFont from "next/font/local";
import { FontProvider } from "@/contexts/font-context";
import { BlurProvider } from "@/contexts/blur-context";
import { Toaster } from "sonner";
import { siteConfig } from "@/config/site";
export const metadata: Metadata = siteConfig;

const proxima = localFont({
  src: "../app/proxima_vara.woff2",
  variable: "--font-proxima",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  style: ["italic", "normal"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["400", "500", "700"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${proxima.variable} ${inter.variable} ${geist.variable} ${playfair.variable} ${roboto.variable}`}
    >
      <body
        className={`${proxima.className} ${inter.className} ${geist.className} ${playfair.className} ${roboto.className}`}
      >
        <TRPCReactProvider>
          <FontProvider>
            <BlurProvider>
              {children}
              <Toaster />
            </BlurProvider>
          </FontProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
