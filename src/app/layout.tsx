import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "~/components/ui/toaster";
import InitRoot from "~/components/ui/init-root";
import { SessionProvider } from "next-auth/react";

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
          <InitRoot>{children}</InitRoot>
        </TRPCReactProvider>
        <Toaster />
      </body>
    </html>
  );
}
