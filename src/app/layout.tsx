import type { Metadata } from "next";
import "./globals.css";

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
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
