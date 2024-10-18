"use client";

import { SessionProvider, useSession } from "next-auth/react";
import ModalProvider from "~/providers/modal-provider";
import NavBar from "./navbar/navbar";
import DialogProvider from "~/providers/dialog-provider";
import { usePathname, useRouter } from "next/navigation";
import { openRoutes, route, ROUTES } from "~/constants/routes";
import { useEffect } from "react";
import { v4 as uuid } from "uuid";
import { LocalStorage } from "~/lib/localStorage";
import LoadingProvider from "~/providers/loading-provider";

export default function InitRoot({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const sessionId = uuid();
    LocalStorage.storeSessionId(sessionId);
  }, []);

  return (
    <SessionProvider>
      <LoadingProvider>
        <ModalProvider>
          <DialogProvider>
            <Root>{children}</Root>
          </DialogProvider>
        </ModalProvider>
      </LoadingProvider>
    </SessionProvider>
  );
}

function Root({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const path = usePathname();
  const router = useRouter();

  const auth = status === "authenticated";

  if (!auth && openRoutes.has(path.split("/")[1] ?? "")) {
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
