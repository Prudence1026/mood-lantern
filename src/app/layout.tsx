import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mood Lantern",
  description: "A three-action onchain mood lantern for Base.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="base:app_id" content="6a2a385f0cfd412b2ab2b60a" />
        <meta
          name="talentapp:project_verification"
          content="1916713cde387b4fe7fbfa345a890b49b6a72e438d4766828c52ad50dd82f33a2e93b49eb4c5f8b30f55f0235ee0d8a47f7bc8505001a6dd3f12ad4134666741"
        />
      </head>
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
