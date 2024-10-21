import { motion } from "framer-motion";
import { cn } from "~/lib/utils";
import useBreakpoint, { BREAKPOINTS } from "~/hooks/use-breakpoint";

interface ModalProps {
  isVisible: boolean;
  children: React.ReactNode;
  onRequestClose?: () => void;
  duration?: number;
}

export default function Modal({
  isVisible,
  onRequestClose,
  children,
  duration = 100, // in milliseconds
}: ModalProps) {
  const isSmall = useBreakpoint(BREAKPOINTS.sm);

  return (
    <motion.div
      initial="hidden"
      variants={{ visible: { opacity: 1 }, hidden: { opacity: 0 } }}
      transition={{ duration: duration / 1000 }}
      animate={isVisible ? "visible" : "hidden"}
      onClick={onRequestClose}
      className={cn(
        "fixed bottom-0 left-0 right-0 top-0 z-30 flex items-center justify-center bg-black/40",
        !isVisible && "pointer-events-none",
        isSmall && "items-end",
      )}
    >
      <motion.div
        initial="hidden"
        variants={{
          visible: { translateY: 0 },
          hidden: { translateY: 1_000 },
        }}
        transition={{ duration: (duration + 100) / 1_000, type: "spring" }}
        animate={isVisible ? "visible" : "hidden"}
        onClick={(e) => e.stopPropagation()}
        className={isSmall ? "w-full" : ""}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
