import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist, Playfair_Display } from "next/font/google";
import { TRPCReactProvider } from "@/trpc/react";

export const metadata: Metadata = {
  title: "t3.chat",
  description: "t3.chat",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  style: "normal",
  variable: "--font-geist",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  style: ["italic", "normal"],
  weight: ["400", "500", "600", "700", "800", "900"]
})

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.className} ${playfair.className} font-primary`}>
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
