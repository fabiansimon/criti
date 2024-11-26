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
import CoffeeButton from "./coffee-button";
import LoadingSpinner from "./loading-spinner";

export default function InitRoot({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (LocalStorage.fetchSessionId()) return;
    const sessionId = uuid();
    LocalStorage.storeSessionId(sessionId);
  }, []);

  return (
    <SessionProvider>
      <LoadingProvider>
        <DialogProvider>
          <ModalProvider>
            <Root>{children}</Root>
          </ModalProvider>
        </DialogProvider>
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
    router.push(route(ROUTES.auth));
  }

  return (
    <div>
      {status === "loading" && (
        <div className="flex min-h-screen flex-col items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
      {status !== "loading" && (
        <>
          <NavBar />
          {children}
          <div className="absolute bottom-10 right-10">
            <CoffeeButton />
          </div>
        </>
      )}
    </div>
  );
}
