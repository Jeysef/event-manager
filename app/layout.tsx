import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/components/providers/react-query-provider";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Event Management App",
  description: "Manage your events",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NuqsAdapter>
          <ReactQueryProvider>
            <Suspense>
              {children}
            </Suspense>
            <Toaster />
          </ReactQueryProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
