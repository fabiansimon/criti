"use client";

import { SessionProvider, useSession } from "next-auth/react";
import ModalProvider from "~/providers/modal-provider";
import NavBar from "./navbar/navbar";
import DialogProvider from "~/providers/dialog-provider";
import { usePathname, useRouter } from "next/navigation";
import { openRoutes, route, ROUTES } from "~/constants/routes";

export default function InitRoot({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ModalProvider>
        <DialogProvider>
          <Root>{children}</Root>
        </DialogProvider>
      </ModalProvider>
    </SessionProvider>
  );
}

function Root({ children }: { children: React.ReactNode }) {
  const { data, status } = useSession();
  const path = usePathname();
  const router = useRouter();

  if (openRoutes.has(path.split("/")[1] ?? "")) {
    return children;
  }

  if (status === "unauthenticated") {
    router.push(route(ROUTES.landing));
  }

  return (
    <div>
      <NavBar />
      {children}
    </div>
  );
}
