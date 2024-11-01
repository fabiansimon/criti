import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { type Viewport, type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "~/components/ui/toaster";
import InitRoot from "~/components/ui/init-root";

export const metadata = {
  title: "beatback.io",
  description: "Best website on this planet",
  icons: [
    { rel: "icon", url: "/favicon.ico", type: "image/x-icon" },
    {
      rel: "icon",
      url: "/favicon-32x32.png",
      sizes: "32x32",
      type: "image/png",
    },
    {
      rel: "icon",
      url: "/favicon-16x16.png",
      sizes: "16x16",
      type: "image/png",
    },
    { rel: "apple-touch-icon", url: "/apple-touch-icon.png" },
    {
      rel: "icon",
      url: "/android-chrome-192x192.png",
      sizes: "192x192",
      type: "image/png",
    },
    {
      rel: "icon",
      url: "/android-chrome-512x512.png",
      sizes: "512x512",
      type: "image/png",
    },
    { rel: "icon", url: "/double_arrow.svg", type: "image/svg+xml" },
    { rel: "icon", url: "/github_icon.svg", type: "image/svg+xml" },
    { rel: "icon", url: "/google_icon.svg", type: "image/svg+xml" },
    { rel: "icon", url: "/logo.svg", type: "image/svg+xml" },
  ],
};

export const viewport: Viewport = {
  maximumScale: 1,
  minimumScale: 1,
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          <InitRoot>{children}</InitRoot>
        </TRPCReactProvider>
        <Toaster />
      </body>
    </html>
  );
}
