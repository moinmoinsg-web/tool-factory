import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AdSenseScript } from "@/components/AdSense";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SITE_NAME, getSiteUrl } from "@/lib/site";
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
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${SITE_NAME} — Free Online Utility Tools`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Free online utility tools for writers, students, and marketers. Fast, simple, and SEO-friendly.",
  verification: {
    google: "MJC_s3lyHbZcyQoM5Kj038b01a4F72qI5II2S1NF4ok",
  },
  other: {
    "google-adsense-account": "ca-pub-2165570721492107",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-zinc-50 font-sans text-zinc-900 dark:bg-black dark:text-zinc-50">
        <AdSenseScript />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
