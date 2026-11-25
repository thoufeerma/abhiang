import type { Metadata, Viewport } from "next";
import { Caveat, Fredoka } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  title: "Abhinav & Angel ♥",
  description: "Two little stickfolk walked in from opposite sides — and sparks flew.",
};

export const viewport: Viewport = {
  themeColor: "#fff7ea",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fredoka.variable} ${caveat.variable} antialiased`}>
      <body className="min-h-svh">{children}</body>
    </html>
  );
}
