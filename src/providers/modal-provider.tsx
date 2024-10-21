"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import Modal from "~/components/ui/modals/modal";

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
      <Modal isVisible={visible} onRequestClose={hide} duration={DURATION_MS}>
        {render}
      </Modal>
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
