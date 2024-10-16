"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { motion } from "framer-motion";
import Text from "~/components/typography/text";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface DialogAction {
  title: string;
  icon?: React.ReactNode;
  destructive?: boolean;
  onClick: () => Promise<void> | void;
}

interface DialogContent {
  title: string;
  subtitle: string;
  actions?: DialogAction[];
  render?: React.ReactNode;
}

interface DialogContextType {
  show: (options: DialogContent) => void;
  hide: () => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);
const DURATION_MS = 100;
const DEFAULT_CONTENT = {
  title: "",
  subtitle: "",
};

export default function DialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState<boolean>(false);
  const [content, setContent] = useState<DialogContent>(DEFAULT_CONTENT);

  const show = useCallback((options: DialogContent) => {
    setContent(options);
    setVisible(true);
  }, []);

  const hide = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      setContent(DEFAULT_CONTENT);
    }, DURATION_MS + 100);
  }, []);

  const value = {
    show,
    hide,
  };

  const { title, subtitle } = content;

  return (
    <DialogContext.Provider value={value}>
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
          className="max-w-[400px] justify-end rounded-md border border-neutral-200 bg-white px-4 py-3"
        >
          <Text.Headline type="h4">{title}</Text.Headline>
          <Text.Body subtle>{subtitle}</Text.Body>
          <div className="mt-6 flex justify-end space-x-2">
            {!content.render &&
              content.actions?.map(
                ({ icon, title, destructive, onClick }, index) => (
                  <Button
                    onClick={onClick}
                    title={title}
                    key={index}
                    variant={destructive ? "destructive" : "outline"}
                    icon={icon}
                  />
                ),
              )}
          </div>
          {content.render}
        </motion.div>
      </motion.div>
      {children}
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error("useDialog must be used within a Dialogprovider");
  }

  return context;
}
