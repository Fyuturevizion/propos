import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "PropOS — Phuket Real Estate",
  description: "AI-powered real estate platform for Phuket, Thailand. Find villas, condos, and land with expert local guidance.",
  keywords: ["Phuket", "real estate", "property", "villa", "condo", "Thailand"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
