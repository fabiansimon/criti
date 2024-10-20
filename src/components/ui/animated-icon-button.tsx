import { motion } from "framer-motion";
import Text from "../typography/text";
import { useState } from "react";
import { cn } from "~/lib/utils";
import LoadingSpinner from "./loading-spinner";

interface IconButtonProps {
  icon: React.ReactNode;
  text?: string;
  className?: string;
  isLoading?: boolean;
  onClick?: () => void;
}
export default function IconButton({
  icon,
  text,
  isLoading,
  className,
  onClick,
}: IconButtonProps) {
  const [hovered, setHovered] = useState<boolean>(false);

  return (
    <div
      onClick={() => !isLoading && onClick && onClick()}
      onMouseEnter={() => text && setHovered(true)}
      onMouseLeave={() => text && setHovered(false)}
      className={cn(
        "flex h-10 cursor-pointer items-center overflow-hidden rounded-md bg-accent hover:bg-accent/80",
        className,
      )}
    >
      <div className="flex w-10 items-center justify-center">
        {!isLoading ? icon : <LoadingSpinner className="size-4" />}
      </div>
      <motion.div
        initial="hidden"
        transition={{ duration: 0.1 }}
        animate={hovered ? "visible" : "hidden"}
        variants={{
          hidden: { width: 0, opacity: 0 },
          visible: { width: "auto", marginRight: 10, opacity: 1 },
        }}
      >
        {text && <Text.Body>{text}</Text.Body>}
      </motion.div>
    </div>
  );
}
