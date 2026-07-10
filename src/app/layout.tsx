import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import { Rubik_Doodle_Shadow } from "next/font/google";
import "./globals.css";

const rubik = Rubik_Doodle_Shadow({
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Love Chits ❤️",
  description: "A collection of love promises, just for you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${rubik.className} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#main-content"
          className="focus:bg-love-pink sr-only focus:not-sr-only focus:absolute focus:inset-x-0 focus:top-0 focus:z-50 focus:p-4 focus:text-center focus:text-white"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
