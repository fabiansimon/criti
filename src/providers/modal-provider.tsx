"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "~/lib/utils";

interface ModalContextType {
  show: (render: React.ReactNode) => void;
  hide: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);
const DURATION_MS = 100;

export default function ModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState<boolean>(false);
  const [render, setRender] = useState<React.ReactNode | undefined>();

  const show = useCallback((render: React.ReactNode) => {
    setRender(render);
    setVisible(true);
  }, []);

  const hide = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      setRender(undefined);
    }, DURATION_MS + 100);
  }, []);

  const value = {
    show,
    hide,
  };

  return (
    <ModalContext.Provider value={value}>
      <motion.div
        initial="hidden"
        variants={{ visible: { opacity: 1 }, hidden: { opacity: 0 } }}
        transition={{ duration: DURATION_MS / 1000 }}
        animate={visible ? "visible" : "hidden"}
        onClick={hide}
        className={cn(
          "fixed bottom-0 left-0 right-0 top-0 z-20 flex items-center justify-center bg-black/40",
          !visible && "pointer-events-none",
        )}
      >
        <motion.div
          initial="hidden"
          variants={{
            visible: { translateY: 0 },
            hidden: { translateY: 1_000 },
          }}
          transition={{ duration: (DURATION_MS + 100) / 1_000, type: "spring" }}
          animate={visible ? "visible" : "hidden"}
          onClick={(e) => e.stopPropagation()}
        >
          {render}
        </motion.div>
      </motion.div>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("useModal must be used within a Modalprovider");
  }

  return context;
}
