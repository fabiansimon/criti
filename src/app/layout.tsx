import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "~/components/ui/toaster";
import NavBar from "~/components/ui/navbar/navbar";
import Dialog from "~/providers/dialog-provider";
import DialogProvider from "~/providers/dialog-provider";
import ModalProvider from "~/providers/modal-provider";

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
          <ModalProvider>
            <DialogProvider>
              <NavBar />
              {children}
            </DialogProvider>
          </ModalProvider>
        </TRPCReactProvider>
        <Toaster />
      </body>
    </html>
  );
}
