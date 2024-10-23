"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "~/lib/utils";

interface LoadingContextType {
  loading: (func?: () => Promise<void>) => void;
  start: () => void;
  stop: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export default function LoadingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const start = useCallback(() => {
    setIsLoading(false);
  }, []);

  const stop = useCallback(() => {
    setIsLoading(false);
  }, []);

  const loading = useCallback(
    async (func?: () => Promise<void>) => {
      setIsLoading(true);
      if (!func) return;
      try {
        await func();
      } finally {
        stop();
      }
    },
    [stop],
  );

  const value = {
    start,
    stop,
    loading,
  };

  return (
    <LoadingContext.Provider value={value}>
      {isLoading && (
        <motion.div
          variants={{
            loading: { opacity: [0, 1], translateX: "100vw" },
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
          animate={"loading"}
          className={cn(
            "fixed left-0 top-0 z-40 h-1 w-[200px] rounded-md bg-neutral-900",
          )}
        />
      )}
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);

  if (!context) {
    throw new Error("useLoading must be used within a Loadingprovider");
  }

  return context;
}
