import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "~/components/ui/toaster";
import NavBar from "~/components/ui/navbar/navbar";

export const metadata: Metadata = {
  title: "Criti",
  description: "MVP",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          <NavBar />
          {children}
        </TRPCReactProvider>
        <Toaster />
      </body>
    </html>
  );
}
